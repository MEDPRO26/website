import { mutation, query, internalMutation, action, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { requireAdminStaff } from "./lib/authz";
import { findCustomerByPhone, findCustomerForConversation } from "./lib/customers";
import {
  resolveChannelIdForCity,
  isWebsiteFormSource,
} from "./lib/whatsappChannelCity";
import {
  ensureConversationOutboundChannel,
  findOrCreateOutboundConversation,
  inferOrderSourceForContact,
} from "./lib/whatsappOutboundConversation";
import { pruneOrderThreadClientMessages } from "./lib/whatsappConversationRouting";
import { conversationStatusValidator } from "./validators";
import { normalizePhone } from "./lib/refs";
import { logAudit } from "./lib/auditLog";
import {
  assertWhatsAppAudioContentType,
  buildWhatsAppMediaUrl,
} from "./lib/audioUpload";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

function formatTime(ts: number) {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function storageIdFromConvexUrl(mediaUrl?: string) {
  if (!mediaUrl) {
    return null;
  }

  try {
    const url = new URL(mediaUrl);
    const match = url.pathname.match(/\/api\/storage\/([^/]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

async function resolveCustomerIdForConversation(
  ctx: QueryCtx,
  conversation: {
    customerId?: Id<"customers">;
    phone: string;
    name: string;
  }
) {
  if (conversation.customerId) {
    return conversation.customerId;
  }
  const customer = await findCustomerForConversation(ctx, conversation);
  return customer?._id ?? null;
}

function summarizeOrderLink(orders: Doc<"orders">[]) {
  const sorted = [...orders].sort((a, b) => b.createdAt - a.createdAt);
  const latest = sorted[0];
  const nouvelle = sorted.find((order) => order.status === "nouvelle");
  const offreEnvoyee = sorted.find((order) => order.status === "offre_envoyee");
  const acceptee = sorted.find((order) => order.status === "acceptee");
  const prixRecu = sorted.find((order) => order.status === "prix_recu");
  const primary =
    offreEnvoyee ??
    prixRecu ??
    nouvelle ??
    acceptee ??
    latest ??
    null;

  const toSummary = (order: Doc<"orders">) => ({
    _id: order._id,
    ref: order.ref,
    status: order.status,
    item: order.item,
    createdAt: order.createdAt,
  });

  return {
    latest: latest ? toSummary(latest) : null,
    primary: primary ? toSummary(primary) : null,
    nouvelle: nouvelle ? toSummary(nouvelle) : null,
    offreEnvoyee: offreEnvoyee ? toSummary(offreEnvoyee) : null,
    acceptee: acceptee ? toSummary(acceptee) : null,
    starColor: acceptee ? ("yellow" as const) : null,
  };
}

const STATUS_LABEL: Record<string, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours de livraison",
  traite: "Traité",
};

async function resolveDefaultChannelId(ctx: MutationCtx) {
  const channels = await ctx.db.query("whatsappChannels").collect();
  const defaultChannel =
    channels.find((row) => row.isDefault) ??
    channels.sort((a, b) => a.sortOrder - b.sortOrder)[0];
  return defaultChannel?._id ?? null;
}

export const list = query({
  args: {
    channelId: v.optional(v.id("whatsappChannels")),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    let rows = await ctx.db.query("conversations").collect();

    if (args.channelId) {
      rows = rows.filter((row) => row.channelId === args.channelId);
    }

    const channels = await ctx.db.query("whatsappChannels").collect();
    const channelById = new Map(channels.map((channel) => [channel._id, channel]));
    const allOrders = await ctx.db.query("orders").collect();
    const ordersByCustomerId = new Map<Id<"customers">, Doc<"orders">[]>();
    for (const order of allOrders) {
      const existing = ordersByCustomerId.get(order.customerId) ?? [];
      existing.push(order);
      ordersByCustomerId.set(order.customerId, existing);
    }

    const enriched = await Promise.all(
      rows
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
        .map(async (row) => {
          const channel = row.channelId ? channelById.get(row.channelId) : null;
          const customer = row.customerId ? await ctx.db.get(row.customerId) : null;
          const customerId =
            row.customerId ??
            (await resolveCustomerIdForConversation(ctx, row));
          const orderLink = row.orderId
            ? summarizeOrderLink(
                allOrders.filter((order) => order._id === row.orderId)
              )
            : customerId
            ? summarizeOrderLink(ordersByCustomerId.get(customerId) ?? [])
            : {
                latest: null,
                primary: null,
                nouvelle: null,
                offreEnvoyee: null,
                acceptee: null,
                starColor: null,
              };

          return {
            ...row,
            channelLabel: channel?.label ?? "Non assignée",
            channelPhone: channel?.phone ?? "",
            channelAccentColor: channel?.accentColor ?? null,
            channelSlug: channel?.slug ?? null,
            channelSortOrder: channel?.sortOrder ?? 0,
            clientAccentColor: row.clientAccentColor ?? customer?.accentColor ?? null,
            timeLabel: formatTime(row.lastMessageAt),
            statusLabel: STATUS_LABEL[row.status] ?? row.status,
            starColor: orderLink.starColor,
          };
        })
    );

    return enriched;
  },
});

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const conversation = await ctx.db.get(args.id);
    if (!conversation) {
      return null;
    }

    const messages = await ctx.db
      .query("conversationMessages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    const customer = conversation.customerId
      ? await ctx.db.get(conversation.customerId)
      : await findCustomerForConversation(ctx, conversation);

    const channel = conversation.channelId
      ? await ctx.db.get(conversation.channelId)
      : null;

    return {
      conversation: {
        ...conversation,
        statusLabel: STATUS_LABEL[conversation.status] ?? conversation.status,
        channelLabel: channel?.label ?? "Non assignée",
        channelPhone: channel?.phone ?? "",
        channelAccentColor: channel?.accentColor ?? null,
        channelSlug: channel?.slug ?? null,
        channelSortOrder: channel?.sortOrder ?? 0,
        clientAccentColor:
          conversation.clientAccentColor ?? customer?.accentColor ?? null,
      },
      channel,
      messages: messages.sort((a, b) => a.createdAt - b.createdAt),
      customer,
    };
  },
});

export const getLinkedOrder = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return null;
    }

    if (conversation.orderId) {
      const order = await ctx.db.get(conversation.orderId);
      if (order) {
        return summarizeOrderLink([order]);
      }
    }

    let customerId = await resolveCustomerIdForConversation(ctx, conversation);
    if (!customerId) {
      return null;
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
      .collect();

    return summarizeOrderLink(orders);
  },
});

export const ensureForContact = mutation({
  args: {
    phone: v.string(),
    name: v.string(),
    city: v.optional(v.string()),
    message: v.optional(v.string()),
    source: v.optional(v.string()),
    orderSource: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const phone = normalizePhone(args.phone);
    const name = args.name.trim() || `Client ${phone}`;
    const text = args.message?.trim();
    const customer = await findCustomerByPhone(ctx, phone);
    const conversationSource = args.source?.trim() || "Commande CRM";
    const orderSource = await inferOrderSourceForContact(
      ctx,
      phone,
      args.orderSource
    );
    const isFormLead = isWebsiteFormSource(orderSource);
    const clientMessage = isFormLead ? undefined : text;
    const linkedOrder = args.orderId ? await ctx.db.get(args.orderId) : null;

    const existingOnPhone = await ctx.db
      .query("conversations")
      .withIndex("by_phone", (q) => q.eq("phone", phone))
      .collect();

    const result = await findOrCreateOutboundConversation(ctx, {
      phone,
      name,
      customerId: customer?._id,
      customerCity: args.city,
      orderSource: args.orderSource,
      orderId: args.orderId,
      orderRef: linkedOrder?.ref,
      source: conversationSource,
      status: clientMessage ? "nouveau" : "en_cours",
      clientMessage,
    });

    return {
      conversationId: result.conversationId,
      channelId: result.channelId,
      created: !existingOnPhone.some((row) => row._id === result.conversationId),
    };
  },
});

export const create = mutation({
  args: {
    channelId: v.id("whatsappChannels"),
    name: v.string(),
    phone: v.string(),
    message: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      throw new Error("Ligne WhatsApp introuvable.");
    }

    const now = Date.now();
    const phone = normalizePhone(args.phone);
    const text = args.message.trim();
    const customer = await findCustomerByPhone(ctx, phone);

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_channelId_phone", (q) =>
        q.eq("channelId", args.channelId).eq("phone", phone)
      )
      .first();

    if (existing) {
      await ctx.db.insert("conversationMessages", {
        conversationId: existing._id,
        from: "client",
        text,
        createdAt: now,
      });
      await ctx.db.patch(existing._id, {
        lastMessage: text,
        lastMessageAt: now,
        unreadCount: existing.unreadCount + 1,
        status: "nouveau",
        customerId: existing.customerId ?? customer?._id,
        updatedAt: now,
      });
      return existing._id;
    }

    const id = await ctx.db.insert("conversations", {
      name: args.name.trim(),
      phone,
      channelId: args.channelId,
      customerId: customer?._id,
      status: "nouveau",
      lastMessage: text,
      lastMessageAt: now,
      unreadCount: 1,
      source: args.source?.trim() || `WhatsApp · ${channel.label}`,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("conversationMessages", {
      conversationId: id,
      from: "client",
      text,
      createdAt: now,
    });

    return id;
  },
});

export const generateAudioUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendAudioReply = mutation({
  args: {
    conversationId: v.id("conversations"),
    storageId: v.id("_storage"),
    contentType: v.string(),
    text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    assertWhatsAppAudioContentType(args.contentType);

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation introuvable.");
    }

    const routedConversation = await ensureConversationOutboundChannel(
      ctx,
      conversation
    );

    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (settings?.whatsappProvider === "disabled") {
      throw new Error("WhatsApp est désactivé dans les paramètres.");
    }

    const playbackUrl = await ctx.storage.getUrl(args.storageId);
    if (!playbackUrl) {
      throw new Error("Fichier audio introuvable.");
    }

    const convexSiteUrl = process.env.CONVEX_SITE_URL?.replace(/\/$/, "");
    if (!convexSiteUrl) {
      throw new Error("CONVEX_SITE_URL manquant sur Convex.");
    }
    const deliveryUrl = buildWhatsAppMediaUrl(
      convexSiteUrl,
      args.storageId,
      args.contentType
    );

    const text = args.text?.trim() || "[Message vocal]";
    const now = Date.now();

    await ctx.db.insert("conversationMessages", {
      conversationId: routedConversation._id,
      from: "staff",
      text,
      mediaUrl: playbackUrl,
      mediaStorageId: args.storageId,
      mediaKind: "audio",
      createdAt: now,
    });

    await ctx.db.patch(routedConversation._id, {
      lastMessage: text,
      lastMessageAt: now,
      unreadCount: 0,
      status: "en_cours",
      updatedAt: now,
    });

    if (settings?.whatsappProvider === "360messenger") {
      await ctx.scheduler.runAfter(0, internal.whatsappMessenger.deliverMediaReply, {
        conversationId: routedConversation._id,
        text,
        mediaUrl: deliveryUrl,
      });
    }

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "conversation",
      entityId: routedConversation._id,
      entityLabel: routedConversation.name,
      toValue: "audio_reply",
    });
  },
});

export const deleteMessageMedia = mutation({
  args: {
    messageId: v.id("conversationMessages"),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message introuvable.");
    }

    const conversation = await ctx.db.get(message.conversationId);
    if (!conversation) {
      throw new Error("Conversation introuvable.");
    }

    const storageId =
      message.mediaStorageId ?? storageIdFromConvexUrl(message.mediaUrl);
    if (storageId) {
      await ctx.storage.delete(storageId as Id<"_storage">);
    }

    await ctx.db.patch(args.messageId, {
      mediaUrl: undefined,
      mediaStorageId: undefined,
      mediaKind: undefined,
      text:
        message.text.trim() && !/^\[[^\]]+\]$/.test(message.text.trim())
          ? message.text
          : "[Audio supprimé]",
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "conversation",
      entityId: message.conversationId,
      entityLabel: conversation.name,
      toValue: "delete_message_media",
    });
  },
});

export const sendReply = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const text = args.text.trim();
    if (!text) {
      throw new Error("Message vide.");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation introuvable.");
    }

    const routedConversation = await ensureConversationOutboundChannel(
      ctx,
      conversation
    );

    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (settings?.whatsappProvider === "disabled") {
      throw new Error("WhatsApp est désactivé dans les paramètres.");
    }

    const now = Date.now();
    await ctx.db.insert("conversationMessages", {
      conversationId: routedConversation._id,
      from: "staff",
      text,
      ingestSource: "crm",
      createdAt: now,
    });

    await ctx.db.patch(routedConversation._id, {
      lastMessage: text,
      lastMessageAt: now,
      unreadCount: 0,
      status: "en_cours",
      updatedAt: now,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "conversation",
      entityId: routedConversation._id,
      entityLabel: routedConversation.name,
      toValue: "reply",
    });
    return routedConversation._id;
  },
});

export const sendReplyWithWhatsApp = action({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args): Promise<{ conversationId: Id<"conversations"> }> => {
    const conversationId: Id<"conversations"> = await ctx.runMutation(
      api.conversations.sendReply,
      {
        conversationId: args.conversationId,
        text: args.text,
      }
    );

    await ctx.runAction(internal.whatsappMessenger.deliverReply, {
      conversationId,
      text: args.text.trim(),
    });

    return { conversationId };
  },
});

export const pruneThread = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    return await pruneOrderThreadClientMessages(ctx, args.conversationId);
  },
});

export const syncFrom360 = action({
  args: { conversationId: v.id("conversations") },
  handler: async (
    ctx,
    args
  ): Promise<{ imported: number; reason?: "no_api" }> => {
    await ctx.runMutation(api.conversations.assertAdminForSync, {
      conversationId: args.conversationId,
    });
    return await ctx.runAction(internal.whatsappMessenger.syncConversationFrom360, {
      conversationId: args.conversationId,
    });
  },
});

export const assertAdminForSync = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation introuvable.");
    }
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("conversations"),
    status: conversationStatusValidator,
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const conversation = await ctx.db.get(args.id);
    const patch: {
      status: typeof args.status;
      updatedAt: number;
      unreadCount?: number;
    } = {
      status: args.status,
      updatedAt: Date.now(),
    };
    if (args.status === "traite") {
      patch.unreadCount = 0;
    }
    await ctx.db.patch(args.id, patch);

    if (conversation) {
      await logAudit(ctx, {
        actorStaffId: staff._id,
        actorName: staff.name,
        action: "status_change",
        entityType: "conversation",
        entityId: args.id,
        entityLabel: conversation.name,
        fromValue: conversation.status,
        toValue: args.status,
      });
    }
  },
});

export const updateNotes = mutation({
  args: {
    id: v.id("conversations"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    await ctx.db.patch(args.id, {
      notes: args.notes.trim() || undefined,
      updatedAt: Date.now(),
    });
  },
});

export const updateClientAccentColor = mutation({
  args: {
    id: v.id("conversations"),
    accentColor: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const conversation = await ctx.db.get(args.id);
    if (!conversation) {
      throw new Error("Conversation introuvable.");
    }

    const color = args.accentColor.trim();
    const patch: {
      clientAccentColor?: string;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    patch.clientAccentColor = color || undefined;

    await ctx.db.patch(args.id, patch);

    if (conversation.customerId) {
      await ctx.db.patch(conversation.customerId, {
        accentColor: color || undefined,
        updatedAt: Date.now(),
      });
    }
  },
});

/** One-time: attach legacy conversations without channel to the default line. */
export const migrateUnassignedChannels = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    const defaultChannelId = await resolveDefaultChannelId(ctx);
    if (!defaultChannelId) {
      return { migrated: 0 };
    }

    const rows = await ctx.db.query("conversations").collect();
    let migrated = 0;
    for (const row of rows) {
      if (!row.channelId) {
        await ctx.db.patch(row._id, {
          channelId: defaultChannelId,
          updatedAt: Date.now(),
        });
        migrated += 1;
      }
    }
    return { migrated };
  },
});

async function purgeAllConversationData(ctx: MutationCtx) {
  const messages = await ctx.db.query("conversationMessages").collect();
  for (const message of messages) {
    const storageId =
      message.mediaStorageId ?? storageIdFromConvexUrl(message.mediaUrl);
    if (storageId) {
      try {
        await ctx.storage.delete(storageId as Id<"_storage">);
      } catch {
        // Storage may already be gone.
      }
    }
    await ctx.db.delete(message._id);
  }

  const conversations = await ctx.db.query("conversations").collect();
  for (const conversation of conversations) {
    await ctx.db.delete(conversation._id);
  }

  return {
    conversationsDeleted: conversations.length,
    messagesDeleted: messages.length,
  };
}

/** Delete every WhatsApp conversation and its messages (admin maintenance). */
export const purgeAll = mutation({
  args: {},
  handler: async (ctx) => {
    const staff = await requireAdminStaff(ctx);
    const result = await purgeAllConversationData(ctx);

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "delete",
      entityType: "conversation",
      entityId: "all",
      entityLabel: "Toutes les conversations WhatsApp",
      toValue: `${result.conversationsDeleted} conversations, ${result.messagesDeleted} messages`,
    });

    return result;
  },
});

export const purgeAllInternal = internalMutation({
  args: {},
  handler: async (ctx) => purgeAllConversationData(ctx),
});
