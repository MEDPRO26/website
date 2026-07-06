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
  classifyMediaUrl,
  enable360Receive,
  fetchReceivedMessageMediaUrl,
  parseHttpBody,
  parseInboundPayload,
  phoneDigits,
  send360Message,
  set360Webhook,
  webhookUrl,
  type Inbound360Message,
} from "./lib/messenger360";
import { ensurePlatformSettings } from "./platformSettings";
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

  const now = Date.now();
  const phone = normalizePhone(message.fromPhone);
  const text = message.text.trim();
  const customer = await findCustomerByPhone(ctx, phone);

  const existing = await ctx.db
    .query("conversations")
    .withIndex("by_channelId_phone", (q) =>
      q.eq("channelId", channel._id).eq("phone", phone)
    )
    .first();

  if (existing) {
    await ctx.db.insert("conversationMessages", {
      conversationId: existing._id,
      from: "client",
      text,
      mediaUrl: message.mediaUrl,
      mediaKind: message.mediaKind,
      externalId: message.externalId,
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
    return { conversationId: existing._id, created: false as const };
  }

  const conversationId = await ctx.db.insert("conversations", {
    name: customer?.name ?? `Client ${phone}`,
    phone,
    channelId: channel._id,
    customerId: customer?._id,
    status: "nouveau",
    lastMessage: text,
    lastMessageAt: now,
    unreadCount: 1,
    source: `WhatsApp · ${channel.label}`,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("conversationMessages", {
    conversationId,
    from: "client",
    text,
    mediaUrl: message.mediaUrl,
    mediaKind: message.mediaKind,
    externalId: message.externalId,
    createdAt: now,
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
    | { ignored: true; reason: "unparseable" | "delivery_status" | "no_channel" | "duplicate" }
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

    if (message.type === "file" && !message.mediaUrl) {
      const channel = await ctx.runQuery(internal.whatsappMessenger.resolveInboundChannel, {
        fromPhone: message.fromPhone,
        toPhone: message.toPhone,
        apiKeyHint: message.apiKeyHint,
      });

      if (channel?.messenger360ApiKey) {
        const mediaUrl = await fetchReceivedMessageMediaUrl(
          channel.messenger360ApiKey,
          {
            messageId: message.externalId,
            fromPhone: message.fromPhone,
          }
        );

        if (mediaUrl) {
          const mediaKind = classifyMediaUrl(mediaUrl, "file");
          message = {
            ...message,
            mediaUrl,
            mediaKind,
            text: mediaKind === "audio" ? "[Message vocal]" : message.text,
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

export const getReplyContext = internalQuery({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation?.channelId) {
      return null;
    }

    const channel = await ctx.db.get(conversation.channelId);
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
      return { skipped: true as const };
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
      return { skipped: true as const };
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
