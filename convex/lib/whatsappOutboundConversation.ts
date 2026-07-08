import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { findCustomerByPhone } from "./customers";
import { normalizePhone } from "./refs";
import {
  isWebsiteFormSource,
  resolveOutboundChannelIdForContact,
} from "./whatsappChannelCity";
import { clearClientMessagesForOffer } from "./whatsappConversationRouting";

export async function inferOrderSourceForContact(
  ctx: QueryCtx | MutationCtx,
  phone: string,
  orderSource?: string | null
) {
  if (orderSource?.trim()) {
    return orderSource.trim();
  }

  const customer = await findCustomerByPhone(ctx, phone);
  if (!customer) {
    return null;
  }

  const orders = await ctx.db
    .query("orders")
    .withIndex("by_customerId", (q) => q.eq("customerId", customer._id))
    .collect();

  const sorted = [...orders].sort((a, b) => b.createdAt - a.createdAt);
  const formOrder = sorted.find((order) => isWebsiteFormSource(order.source));
  return formOrder?.source ?? sorted[0]?.source ?? null;
}

export async function resolveOutboundChannelForContact(
  ctx: QueryCtx | MutationCtx,
  args: {
    phone: string;
    customerCity?: string | null;
    orderSource?: string | null;
  }
) {
  const orderSource = await inferOrderSourceForContact(
    ctx,
    args.phone,
    args.orderSource
  );

  return resolveOutboundChannelIdForContact(ctx, {
    phone: args.phone,
    customerCity: args.customerCity,
    orderSource,
  });
}

type OutboundConversationResult = {
  conversationId: Id<"conversations">;
  channelId: Id<"whatsappChannels">;
  channel: Doc<"whatsappChannels"> | null;
  conversation: Doc<"conversations">;
};

/** Find or create the CRM thread on the correct WhatsApp line for this contact. */
export async function findOrCreateOutboundConversation(
  ctx: MutationCtx,
  args: {
    phone: string;
    name: string;
    customerId?: Id<"customers">;
    customerCity?: string | null;
    orderSource?: string | null;
    orderId?: Id<"orders">;
    orderRef?: string | null;
    source: string;
    status?: Doc<"conversations">["status"];
    staffMessage?: string;
    clientMessage?: string;
  }
): Promise<OutboundConversationResult> {
  const phone = normalizePhone(args.phone);
  const channelId = await resolveOutboundChannelForContact(ctx, {
    phone,
    customerCity: args.customerCity,
    orderSource: args.orderSource,
  });
  if (!channelId) {
    throw new Error(
      "Aucune ligne WhatsApp 360Messenger connectée. Vérifiez Paramètres → WhatsApp."
    );
  }

  const now = Date.now();
  const channel = await ctx.db.get(channelId);
  const orderSource = await inferOrderSourceForContact(
    ctx,
    phone,
    args.orderSource
  );
  const preferAgadir = isWebsiteFormSource(orderSource);

  let conversation: Doc<"conversations"> | null = null;

  if (args.orderId) {
    conversation = await ctx.db
      .query("conversations")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .first();
  }

  if (!conversation && !args.orderId) {
    const phoneThreads = await ctx.db
      .query("conversations")
      .withIndex("by_channelId_phone", (q) =>
        q.eq("channelId", channelId).eq("phone", phone)
      )
      .collect();
    conversation =
      phoneThreads.find((row) => !row.orderId) ??
      phoneThreads.sort((a, b) => b.lastMessageAt - a.lastMessageAt)[0] ??
      null;
  }

  if (!conversation && !args.orderId) {
    const existingOnPhone = await ctx.db
      .query("conversations")
      .withIndex("by_phone", (q) => q.eq("phone", phone))
      .collect();

    const migratable =
      preferAgadir || existingOnPhone.length === 1
        ? existingOnPhone
            .filter((row) => row.channelId !== channelId && !row.orderId)
            .sort((a, b) => b.lastMessageAt - a.lastMessageAt)[0]
        : null;

    if (migratable) {
      await ctx.db.patch(migratable._id, {
        channelId,
        customerId: migratable.customerId ?? args.customerId,
        updatedAt: now,
      });
      conversation = (await ctx.db.get(migratable._id))!;
    }
  } else if (conversation && conversation.channelId !== channelId) {
    await ctx.db.patch(conversation._id, {
      channelId,
      updatedAt: now,
    });
    conversation = { ...conversation, channelId };
  }

  if (!conversation) {
    const conversationId = await ctx.db.insert("conversations", {
      name: args.name,
      phone,
      channelId,
      customerId: args.customerId,
      orderId: args.orderId,
      orderRef: args.orderRef?.trim() || undefined,
      status: args.status ?? "en_cours",
      lastMessage:
        args.staffMessage?.trim() ||
        args.clientMessage?.trim() ||
        args.source,
      lastMessageAt: now,
      unreadCount: args.clientMessage?.trim() ? 1 : 0,
      source: args.source,
      createdAt: now,
      updatedAt: now,
    });
    conversation = (await ctx.db.get(conversationId))!;
  } else if (args.orderId && !conversation.orderId) {
    await ctx.db.patch(conversation._id, {
      orderId: args.orderId,
      orderRef: args.orderRef?.trim() || conversation.orderRef,
      name: args.name,
      customerId: conversation.customerId ?? args.customerId,
      updatedAt: now,
    });
    conversation = (await ctx.db.get(conversation._id))!;
  }

  if (args.clientMessage?.trim()) {
    await ctx.db.insert("conversationMessages", {
      conversationId: conversation._id,
      from: "client",
      text: args.clientMessage.trim(),
      createdAt: now,
    });
    await ctx.db.patch(conversation._id, {
      lastMessage: args.clientMessage.trim(),
      lastMessageAt: now,
      unreadCount: conversation.unreadCount + 1,
      customerId: conversation.customerId ?? args.customerId,
      updatedAt: now,
    });
    conversation = (await ctx.db.get(conversation._id))!;
  }

  if (args.staffMessage?.trim()) {
    const offerAnchorAt = Date.now();
    if (args.orderId) {
      await clearClientMessagesForOffer(ctx, conversation._id, offerAnchorAt);
    }

    await ctx.db.insert("conversationMessages", {
      conversationId: conversation._id,
      from: "staff",
      text: args.staffMessage.trim(),
      ingestSource: "crm",
      createdAt: offerAnchorAt,
    });
    await ctx.db.patch(conversation._id, {
      lastMessage: args.staffMessage.trim(),
      lastMessageAt: offerAnchorAt,
      unreadCount: 0,
      status: args.status ?? "en_cours",
      customerId: conversation.customerId ?? args.customerId,
      offerAnchorAt: args.orderId ? offerAnchorAt : conversation.offerAnchorAt,
      updatedAt: offerAnchorAt,
    });
    conversation = (await ctx.db.get(conversation._id))!;
  }

  return {
    conversationId: conversation._id,
    channelId,
    channel,
    conversation,
  };
}

/** Align an existing thread with the correct outbound line before sending. */
export async function ensureConversationOutboundChannel(
  ctx: MutationCtx,
  conversation: Doc<"conversations">,
  orderSource?: string | null
) {
  const customer = conversation.customerId
    ? await ctx.db.get(conversation.customerId)
    : await findCustomerByPhone(ctx, conversation.phone);

  const channelId = await resolveOutboundChannelForContact(ctx, {
    phone: conversation.phone,
    customerCity: customer?.city,
    orderSource,
  });

  if (!channelId || channelId === conversation.channelId) {
    return conversation;
  }

  const now = Date.now();
  await ctx.db.patch(conversation._id, {
    channelId,
    customerId: conversation.customerId ?? customer?._id,
    updatedAt: now,
  });

  return { ...conversation, channelId };
}
