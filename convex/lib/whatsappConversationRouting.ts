import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function listConversationsForContact(
  ctx: Pick<QueryCtx | MutationCtx, "db">,
  channelId: Id<"whatsappChannels">,
  phone: string
) {
  return await ctx.db
    .query("conversations")
    .withIndex("by_channelId_phone", (q) =>
      q.eq("channelId", channelId).eq("phone", phone)
    )
    .collect();
}

async function lastStaffMessageAt(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  fallback: number
) {
  const messages = await ctx.db
    .query("conversationMessages")
    .withIndex("by_conversationId", (q) => q.eq("conversationId", conversationId))
    .collect();

  const lastStaff = messages
    .filter((message) => message.from === "staff")
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  return lastStaff?.createdAt ?? fallback;
}

export async function getLastStaffMessageAt(
  ctx: MutationCtx,
  conversation: Pick<Doc<"conversations">, "_id" | "createdAt">
) {
  return lastStaffMessageAt(ctx, conversation._id, conversation.createdAt);
}

/** Only import WhatsApp history that belongs to this CRM thread. */
export async function conversationImportMinTimestamp(
  ctx: MutationCtx,
  conversation: Doc<"conversations">
) {
  const lastStaffAt = await getLastStaffMessageAt(ctx, conversation);
  if (conversation.orderId) {
    // Order threads: ignore old client messages from the same phone on 360Messenger.
    return lastStaffAt - 5_000;
  }
  return conversation.createdAt - 120_000;
}

export function shouldAcceptClientMessage(
  conversation: Doc<"conversations">,
  order: Doc<"orders"> | null,
  messageAt: number,
  lastStaffAt: number
) {
  if (conversation.status === "traite") {
    return false;
  }
  if (conversation.orderId) {
    if (!order) {
      return false;
    }
    const waitingForReply = new Set([
      "offre_envoyee",
      "acceptee",
      "prix_recu",
      "nouvelle",
    ]);
    if (!waitingForReply.has(order.status)) {
      return false;
    }
    const anchor = conversation.offerAnchorAt ?? lastStaffAt;
    return messageAt >= anchor - 5_000;
  }
  return true;
}

async function recalculateConversationSummary(
  ctx: MutationCtx,
  conversationId: Id<"conversations">
) {
  const conversation = await ctx.db.get(conversationId);
  if (!conversation) {
    return;
  }

  const messages = await ctx.db
    .query("conversationMessages")
    .withIndex("by_conversationId", (q) => q.eq("conversationId", conversationId))
    .collect();

  if (messages.length === 0) {
    await ctx.db.patch(conversationId, {
      lastMessage: conversation.source,
      lastMessageAt: conversation.createdAt,
      unreadCount: 0,
      updatedAt: Date.now(),
    });
    return;
  }

  const sorted = [...messages].sort((a, b) => a.createdAt - b.createdAt);
  const latest = sorted[sorted.length - 1];
  const unread = sorted.filter((message) => message.from === "client").length;

  await ctx.db.patch(conversationId, {
    lastMessage: latest.text,
    lastMessageAt: latest.createdAt,
    unreadCount: unread,
    updatedAt: Date.now(),
  });
}

/** Remove client messages that did not arrive live after our offer. */
export async function pruneOrderThreadClientMessages(
  ctx: MutationCtx,
  conversationId: Id<"conversations">
) {
  const conversation = await ctx.db.get(conversationId);
  if (!conversation?.orderId) {
    return { removed: 0 };
  }

  const messages = await ctx.db
    .query("conversationMessages")
    .withIndex("by_conversationId", (q) => q.eq("conversationId", conversationId))
    .collect();

  const hasStaffMessage = messages.some((message) => message.from === "staff");
  if (!hasStaffMessage) {
    return { removed: 0 };
  }

  let anchor = conversation.offerAnchorAt ?? 0;
  if (anchor === 0) {
    const latestStaff = messages
      .filter((message) => message.from === "staff")
      .sort((a, b) => b.createdAt - a.createdAt)[0];
    if (latestStaff) {
      anchor = latestStaff.createdAt;
      await ctx.db.patch(conversationId, { offerAnchorAt: anchor });
    }
  }

  let removed = 0;

  for (const message of messages) {
    if (message.from !== "client") {
      continue;
    }

    const isLiveWebhook = message.ingestSource === "webhook";
    const isAfterOffer = anchor > 0 && message.createdAt >= anchor - 5_000;
    const isSyncedReply = message.ingestSource === "sync" && isAfterOffer;
    const shouldRemove =
      message.ingestSource === undefined ||
      (message.ingestSource === "sync" && !isAfterOffer) ||
      (!isLiveWebhook && !isSyncedReply && !isAfterOffer);

    if (!shouldRemove) {
      continue;
    }

    await ctx.db.delete(message._id);
    removed += 1;
  }

  if (removed > 0) {
    await recalculateConversationSummary(ctx, conversationId);
  }

  return { removed };
}

export async function clearClientMessagesForOffer(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  offerAnchorAt: number
) {
  const messages = await ctx.db
    .query("conversationMessages")
    .withIndex("by_conversationId", (q) => q.eq("conversationId", conversationId))
    .collect();

  for (const message of messages) {
    if (message.from === "client") {
      await ctx.db.delete(message._id);
    }
  }

  await ctx.db.patch(conversationId, {
    offerAnchorAt,
    unreadCount: 0,
    updatedAt: Date.now(),
  });
}

type ScoredThread = {
  thread: Doc<"conversations">;
  order: Doc<"orders"> | null;
  lastStaffAt: number;
  waitingForClient: boolean;
};

async function scoreOpenThreads(
  ctx: MutationCtx,
  threads: Doc<"conversations">[]
): Promise<ScoredThread[]> {
  return await Promise.all(
    threads.map(async (thread) => {
      const order = thread.orderId ? await ctx.db.get(thread.orderId) : null;
      const lastStaffAt = await lastStaffMessageAt(ctx, thread._id, thread.createdAt);
      return {
        thread,
        order,
        lastStaffAt,
        waitingForClient:
          order?.status === "offre_envoyee" || order?.status === "acceptee",
      };
    })
  );
}

function pickBestThread(scored: ScoredThread[]) {
  const waiting = scored
    .filter((row) => row.waitingForClient)
    .sort((a, b) => b.lastStaffAt - a.lastStaffAt);
  if (waiting[0]) {
    return waiting[0].thread;
  }

  const latestStaff = [...scored].sort((a, b) => b.lastStaffAt - a.lastStaffAt);
  return latestStaff[0]?.thread ?? null;
}

/** Pick the open CRM thread when several orders share the same phone. */
export async function resolveInboundConversation(
  ctx: MutationCtx,
  channelId: Id<"whatsappChannels">,
  phone: string
) {
  const threads = await listConversationsForContact(ctx, channelId, phone);
  const openThreads = threads.filter((thread) => thread.status !== "traite");

  if (openThreads.length === 0) {
    return null;
  }

  if (openThreads.length === 1) {
    return openThreads[0];
  }

  const orderThreads = openThreads.filter((thread) => thread.orderId);
  if (orderThreads.length > 0) {
    const best = pickBestThread(await scoreOpenThreads(ctx, orderThreads));
    if (best) {
      return best;
    }
  }

  const genericThreads = openThreads
    .filter((thread) => !thread.orderId)
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  if (genericThreads[0]) {
    return genericThreads[0];
  }

  return openThreads.sort((a, b) => b.lastMessageAt - a.lastMessageAt)[0] ?? null;
}

export function conversationSyncMinTimestamp(
  conversation: Pick<Doc<"conversations">, "createdAt">
) {
  return conversation.createdAt - 120_000;
}

export async function closeConversationForOrder(
  ctx: MutationCtx,
  orderId: Id<"orders">
) {
  const conversation = await ctx.db
    .query("conversations")
    .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
    .first();

  if (!conversation || conversation.status === "traite") {
    return null;
  }

  await ctx.db.patch(conversation._id, {
    status: "traite",
    updatedAt: Date.now(),
  });

  return conversation._id;
}
