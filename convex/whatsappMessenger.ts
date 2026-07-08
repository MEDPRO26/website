import {
  httpAction,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireAdminPermission } from "./lib/authz";
import { findCustomerByPhone } from "./lib/customers";
import { normalizePhone } from "./lib/refs";
import {
  detectMediaKind,
  enable360Receive,
  fetchReceivedMessageMedia,
  fetchReceivedMessages,
  parseHttpBody,
  parseInboundPayload,
  phoneDigits,
  readMessageCreatedAt,
  send360Message,
  set360Webhook,
  webhookUrl,
  type Inbound360Message,
} from "./lib/messenger360";
import { ensurePlatformSettings } from "./platformSettings";
import { resolveOutboundChannelForCity } from "./lib/whatsappChannelCity";
import {
  conversationImportMinTimestamp,
  getLastStaffMessageAt,
  pruneOrderThreadClientMessages,
  resolveInboundConversation,
  shouldAcceptClientMessage,
} from "./lib/whatsappConversationRouting";
import { resolveOutboundChannelForContact } from "./lib/whatsappOutboundConversation";
import {
  assertWhatsAppAudioContentType,
  buildWhatsAppMediaUrl,
  mimeForAudioExtension,
  parseStorageIdFromMediaPath,
} from "./lib/audioUpload";

async function resolveChannelForInbound(
  ctx: Pick<QueryCtx, "db">,
  message: Inbound360Message
) {
  const channels = await ctx.db.query("whatsappChannels").collect();

  if (message.apiKeyHint) {
    const byKey = channels.find(
      (channel) => channel.messenger360ApiKey === message.apiKeyHint
    );
    if (byKey) {
      return byKey;
    }
  }

  if (message.toPhone) {
    const target = phoneDigits(message.toPhone);
    const byPhone = channels.find(
      (channel) => channel.phone && phoneDigits(channel.phone) === target
    );
    if (byPhone) {
      return byPhone;
    }
  }

  const connected = channels.filter((channel) => channel.messenger360ApiKey);
  if (connected.length === 1) {
    return connected[0];
  }

  return (
    channels.find((channel) => channel.isDefault) ??
    channels.sort((a, b) => a.sortOrder - b.sortOrder)[0] ??
    null
  );
}

export const connectChannel = mutation({
  args: {
    channelId: v.id("whatsappChannels"),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "settings.manage");
    await ensurePlatformSettings(ctx);

    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      throw new Error("Ligne WhatsApp introuvable.");
    }

    const apiKey = args.apiKey.trim();
    if (!apiKey) {
      throw new Error("Clé API 360Messenger obligatoire.");
    }

    await ctx.db.patch(args.channelId, {
      messenger360ApiKey: apiKey,
      messenger360ConnectedAt: Date.now(),
      updatedAt: Date.now(),
    });

    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (settings) {
      await ctx.db.patch(settings._id, {
        whatsappProvider: "360messenger",
        updatedAt: Date.now(),
      });
    }

    await ctx.scheduler.runAfter(0, internal.whatsappMessenger.registerWebhook, {
      channelId: args.channelId,
    });

    return { queued: true };
  },
});

export const registerWebhook = internalAction({
  args: { channelId: v.id("whatsappChannels") },
  handler: async (ctx, args) => {
    const channel = await ctx.runQuery(internal.whatsappMessenger.getChannel, {
      channelId: args.channelId,
    });
    if (!channel?.messenger360ApiKey) {
      throw new Error("Clé API 360Messenger manquante.");
    }

    const convexSiteUrl = process.env.CONVEX_SITE_URL?.replace(/\/$/, "");
    if (!convexSiteUrl) {
      throw new Error("CONVEX_SITE_URL manquant sur Convex.");
    }

    const url = webhookUrl(convexSiteUrl);
    await enable360Receive(channel.messenger360ApiKey);
    await set360Webhook(channel.messenger360ApiKey, url);

    await ctx.runMutation(internal.whatsappMessenger.markConnected, {
      channelId: args.channelId,
    });
  },
});

export const getChannel = internalQuery({
  args: { channelId: v.id("whatsappChannels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.channelId);
  },
});

export const markConnected = internalMutation({
  args: { channelId: v.id("whatsappChannels") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.channelId, {
      messenger360ConnectedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const resolveInboundChannel = internalQuery({
  args: {
    fromPhone: v.string(),
    toPhone: v.optional(v.string()),
    apiKeyHint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await resolveChannelForInbound(ctx, {
      fromPhone: args.fromPhone,
      toPhone: args.toPhone,
      apiKeyHint: args.apiKeyHint,
      text: "",
      type: "chat",
    });
  },
});

async function storeInboundMessage(ctx: MutationCtx, message: Inbound360Message) {
  const channel = await resolveChannelForInbound(ctx, message);
  if (!channel) {
    return { ignored: true as const, reason: "no_channel" as const };
  }

  if (message.externalId) {
    const duplicate = await ctx.db
      .query("conversationMessages")
      .withIndex("by_externalId", (q) => q.eq("externalId", message.externalId))
      .first();
    if (duplicate) {
      return { ignored: true as const, reason: "duplicate" as const };
    }
  }

  const businessDigits = channel.phone ? phoneDigits(channel.phone) : "";
  const fromDigits = phoneDigits(message.fromPhone);
  const toDigits = message.toPhone ? phoneDigits(message.toPhone) : "";
  const isOutboundEcho =
    Boolean(businessDigits) &&
    fromDigits === businessDigits &&
    Boolean(toDigits);

  const contactPhone = normalizePhone(isOutboundEcho ? toDigits : message.fromPhone);
  const messageFrom = isOutboundEcho ? ("staff" as const) : ("client" as const);
  const text = message.text.trim();
  const customer = await findCustomerByPhone(ctx, contactPhone);

  const existing = await resolveInboundConversation(ctx, channel._id, contactPhone);

  const now = Date.now();
  // Use 360Messenger's own timestamp (Morocco local) so the CRM shows the same
  // wall-clock time the client saw. Fall back to server time if absent.
  const messageAt = message.createdAt && message.createdAt > 0 ? message.createdAt : now;

  if (existing) {
    if (messageFrom === "client") {
      const order = existing.orderId ? await ctx.db.get(existing.orderId) : null;
      const lastStaffAt = await getLastStaffMessageAt(ctx, existing);
      if (!shouldAcceptClientMessage(existing, order, messageAt, lastStaffAt)) {
        return { ignored: true as const, reason: "not_for_thread" as const };
      }
    }

    await ctx.db.insert("conversationMessages", {
      conversationId: existing._id,
      from: messageFrom,
      text,
      mediaUrl: message.mediaUrl,
      mediaKind: message.mediaKind,
      externalId: message.externalId,
      ingestSource: "webhook",
      createdAt: messageAt,
    });
    await ctx.db.patch(existing._id, {
      lastMessage: text,
      lastMessageAt: messageAt,
      unreadCount:
        messageFrom === "client" ? existing.unreadCount + 1 : existing.unreadCount,
      status: messageFrom === "client" ? "nouveau" : existing.status,
      customerId: existing.customerId ?? customer?._id,
      updatedAt: now,
    });
    return { conversationId: existing._id, created: false as const };
  }

  const conversationId = await ctx.db.insert("conversations", {
    name: customer?.name ?? `Client ${contactPhone}`,
    phone: contactPhone,
    channelId: channel._id,
    customerId: customer?._id,
    status: messageFrom === "client" ? "nouveau" : "en_cours",
    lastMessage: text,
    lastMessageAt: messageAt,
    unreadCount: messageFrom === "client" ? 1 : 0,
    source: `WhatsApp · ${channel.label}`,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("conversationMessages", {
    conversationId,
    from: messageFrom,
    text,
    mediaUrl: message.mediaUrl,
    mediaKind: message.mediaKind,
    externalId: message.externalId,
    ingestSource: "webhook",
    createdAt: messageAt,
  });

  return { conversationId, created: true as const };
}

export const ingestInboundMessage = internalMutation({
  args: {
    externalId: v.optional(v.string()),
    fromPhone: v.string(),
    toPhone: v.optional(v.string()),
    text: v.string(),
    type: v.union(v.literal("chat"), v.literal("file")),
    mediaUrl: v.optional(v.string()),
    mediaKind: v.optional(
      v.union(
        v.literal("audio"),
        v.literal("image"),
        v.literal("video"),
        v.literal("document")
      )
    ),
    apiKeyHint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await storeInboundMessage(ctx, args);
  },
});

export const processInboundWebhook = internalAction({
  args: {
    payload: v.any(),
  },
  handler: async (ctx, args): Promise<
    | { ignored: true; reason: "unparseable" | "delivery_status" | "no_channel" | "duplicate" | "not_for_thread" }
    | { conversationId: string; created: boolean }
  > => {
    const parsed = parseInboundPayload(args.payload);
    if (!parsed) {
      return { ignored: true as const, reason: "unparseable" as const };
    }

    if ("delivery" in parsed) {
      return { ignored: true as const, reason: "delivery_status" as const };
    }

    let message = parsed;

    if (message.type === "file" && !message.mediaUrl && message.externalId) {
      const channel = await ctx.runQuery(internal.whatsappMessenger.resolveInboundChannel, {
        fromPhone: message.fromPhone,
        toPhone: message.toPhone,
        apiKeyHint: message.apiKeyHint,
      });

      if (channel?.messenger360ApiKey) {
        const fetched = await fetchReceivedMessageMedia(
          channel.messenger360ApiKey,
          {
            messageId: message.externalId,
            fromPhone: message.fromPhone,
          }
        );

        if (fetched) {
          const mediaKind = detectMediaKind(
            fetched.mediaUrl,
            fetched.record,
            fetched.sourceType
          );
          message = {
            ...message,
            mediaUrl: fetched.mediaUrl,
            mediaKind,
            sourceType: fetched.sourceType,
            text:
              mediaKind === "audio" && !message.text.trim()
                ? "[Message vocal]"
                : message.text,
          };
        }
      }
    }

    return await ctx.runMutation(internal.whatsappMessenger.ingestInboundMessage, message);
  },
});

export const ingestInbound = internalMutation({
  args: {
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const parsed = parseInboundPayload(args.payload);
    if (!parsed) {
      return { ignored: true as const, reason: "unparseable" as const };
    }

    if ("delivery" in parsed) {
      return { ignored: true as const, reason: "delivery_status" as const };
    }

    return await storeInboundMessage(ctx, parsed);
  },
});

export const getDirectSendContext = internalQuery({
  args: {
    phone: v.string(),
    text: v.string(),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const channels = await ctx.db.query("whatsappChannels").collect();
    const channel = resolveOutboundChannelForCity(channels, args.city);

    if (!channel?.messenger360ApiKey) {
      return null;
    }

    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    return {
      apiKey: channel.messenger360ApiKey,
      phone: normalizePhone(args.phone),
      text: args.text,
      provider: settings?.whatsappProvider ?? "manual",
    };
  },
});

export const sendDirectMessage = internalAction({
  args: {
    phone: v.string(),
    text: v.string(),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(
      internal.whatsappMessenger.getDirectSendContext,
      args
    );

    if (!context || context.provider !== "360messenger") {
      console.log(
        "[DEV] Supplier WhatsApp skipped (360Messenger not active):",
        args.phone
      );
      return { sent: false as const };
    }

    try {
      await send360Message(context.apiKey, context.phone, context.text);
      return { sent: true as const };
    } catch (error) {
      console.error("Supplier WhatsApp failed:", error);
      return { sent: false as const };
    }
  },
});

export const getReplyContext = internalQuery({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return null;
    }

    const customer = conversation.customerId
      ? await ctx.db.get(conversation.customerId)
      : await findCustomerByPhone(ctx, conversation.phone);

    const channelId = await resolveOutboundChannelForContact(ctx, {
      phone: conversation.phone,
      customerCity: customer?.city,
    });
    const channel = channelId ? await ctx.db.get(channelId) : null;

    if (!channel?.messenger360ApiKey) {
      return null;
    }

    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    return {
      apiKey: channel.messenger360ApiKey,
      phone: conversation.phone,
      text: args.text,
      provider: settings?.whatsappProvider ?? "manual",
    };
  },
});

export const deliverMediaReply = internalAction({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
    mediaUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.whatsappMessenger.getReplyContext, {
      conversationId: args.conversationId,
      text: args.text,
    });

    if (!context || context.provider !== "360messenger") {
      throw new Error(
        "360Messenger non configuré pour cette conversation. Vérifiez Paramètres → WhatsApp."
      );
    }

    await send360Message(
      context.apiKey,
      context.phone,
      args.text,
      args.mediaUrl
    );
    return { sent: true as const };
  },
});

export const deliverReply = internalAction({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.whatsappMessenger.getReplyContext, {
      conversationId: args.conversationId,
      text: args.text,
    });

    if (!context || context.provider !== "360messenger") {
      throw new Error(
        "360Messenger non configuré pour cette conversation. Vérifiez Paramètres → WhatsApp."
      );
    }

    await send360Message(context.apiKey, context.phone, context.text);
    return { sent: true as const };
  },
});

export const serveWhatsAppMedia = httpAction(async (ctx, request) => {
  const parsed = parseStorageIdFromMediaPath(new URL(request.url).pathname);
  if (!parsed) {
    return new Response("Not found", { status: 404 });
  }

  const blob = await ctx.storage.get(parsed.storageId as Id<"_storage">);
  if (!blob) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = parsed.extension
    ? mimeForAudioExtension(parsed.extension)
    : blob.type || "application/octet-stream";

  return new Response(blob, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
});

export const webhook = httpAction(async (ctx, request) => {
  if (request.method === "GET") {
    return new Response("OK", { status: 200 });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload = await parseHttpBody(request);
    console.log("360Messenger webhook payload:", JSON.stringify(payload));
    if (payload) {
      const result = await ctx.runAction(internal.whatsappMessenger.processInboundWebhook, {
        payload,
      });
      console.log("360Messenger ingest result:", JSON.stringify(result));
    }
  } catch (error) {
    console.error("360Messenger webhook error:", error);
  }

  return new Response("OK", { status: 200 });
});

export const getSyncContext = internalQuery({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation?.channelId) {
      return null;
    }

    const channel = await ctx.db.get(conversation.channelId);
    if (!channel?.messenger360ApiKey) {
      return null;
    }

    return {
      apiKey: channel.messenger360ApiKey,
      clientPhone: conversation.phone,
      businessPhone: channel.phone ?? "",
    };
  },
});

export const importSyncedMessages = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    clientPhone: v.string(),
    businessPhone: v.string(),
    rows: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return { imported: 0 };
    }

    const businessDigits = args.businessPhone
      ? phoneDigits(args.businessPhone)
      : "";
    const clientDigits = phoneDigits(args.clientPhone);
    const minCreatedAt = await conversationImportMinTimestamp(ctx, conversation);
    const lastStaffAt = await getLastStaffMessageAt(ctx, conversation);
    const order = conversation.orderId
      ? await ctx.db.get(conversation.orderId)
      : null;
    let imported = 0;
    let latestText = conversation.lastMessage;
    let latestAt = conversation.lastMessageAt;
    let unread = conversation.unreadCount;

    for (const raw of args.rows) {
      const parsed = parseInboundPayload(raw);
      if (!parsed || "delivery" in parsed) {
        continue;
      }

      const externalId = parsed.externalId;
      if (externalId) {
        const duplicate = await ctx.db
          .query("conversationMessages")
          .withIndex("by_externalId", (q) => q.eq("externalId", externalId))
          .first();
        if (duplicate) {
          continue;
        }
      }

      const fromDigits = phoneDigits(parsed.fromPhone);
      const toDigits = parsed.toPhone ? phoneDigits(parsed.toPhone) : "";
      const isOutboundEcho =
        Boolean(businessDigits) &&
        fromDigits === businessDigits &&
        toDigits === clientDigits;
      const isInbound =
        fromDigits === clientDigits &&
        (!businessDigits || !toDigits || toDigits === businessDigits);

      if (!isOutboundEcho && !isInbound) {
        continue;
      }

      const messageFrom = isOutboundEcho ? ("staff" as const) : ("client" as const);
      const text = parsed.text.trim();
      if (!text) {
        continue;
      }

      if (conversation.orderId && messageFrom === "client") {
        const createdAt = readMessageCreatedAt(raw);
        if (createdAt <= 0 || createdAt < minCreatedAt) {
          continue;
        }
        if (!shouldAcceptClientMessage(conversation, order, createdAt, lastStaffAt)) {
          continue;
        }
      } else if (conversation.orderId && messageFrom === "staff") {
        continue;
      }

      const createdAt =
        messageFrom === "staff"
          ? readMessageCreatedAt(raw) || Date.now()
          : readMessageCreatedAt(raw);
      if (createdAt <= 0) {
        continue;
      }
      if (createdAt < minCreatedAt) {
        continue;
      }
      if (
        messageFrom === "client" &&
        !conversation.orderId &&
        !shouldAcceptClientMessage(conversation, order, createdAt, lastStaffAt)
      ) {
        continue;
      }
      await ctx.db.insert("conversationMessages", {
        conversationId: args.conversationId,
        from: messageFrom,
        text,
        mediaUrl: parsed.mediaUrl,
        mediaKind: parsed.mediaKind,
        externalId,
        ingestSource: "sync",
        createdAt,
      });
      imported += 1;

      if (createdAt >= latestAt) {
        latestAt = createdAt;
        latestText = text;
      }
      if (messageFrom === "client") {
        unread += 1;
      }
    }

    if (imported > 0) {
      await ctx.db.patch(args.conversationId, {
        lastMessage: latestText,
        lastMessageAt: latestAt,
        unreadCount: unread,
        updatedAt: Date.now(),
      });
    }

    if (conversation.orderId) {
      await pruneOrderThreadClientMessages(ctx, args.conversationId);
    }

    return { imported };
  },
});

export const syncConversationFrom360 = internalAction({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.whatsappMessenger.getSyncContext, {
      conversationId: args.conversationId,
    });
    if (!context?.apiKey) {
      return { imported: 0, reason: "no_api" as const };
    }

    let imported = 0;
    for (let page = 1; page <= 3; page += 1) {
      const rows = await fetchReceivedMessages(
        context.apiKey,
        context.clientPhone,
        page
      );
      if (rows.length === 0) {
        break;
      }

      const result = await ctx.runMutation(
        internal.whatsappMessenger.importSyncedMessages,
        {
          conversationId: args.conversationId,
          clientPhone: context.clientPhone,
          businessPhone: context.businessPhone,
          rows,
        }
      );
      imported += result.imported;
    }

    return { imported };
  },
});
