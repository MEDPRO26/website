import {
  httpAction,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { requireAdminPermission } from "./lib/authz";
import { findCustomerByPhone } from "./lib/customers";
import { normalizePhone } from "./lib/refs";
import {
  enable360Receive,
  parseHttpBody,
  parseInboundPayload,
  phoneDigits,
  send360Message,
  set360Webhook,
  webhookUrl,
  type Inbound360Message,
} from "./lib/messenger360";
import { ensurePlatformSettings } from "./platformSettings";

async function resolveChannelForInbound(ctx: MutationCtx, message: Inbound360Message) {
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

export const getWebhookInfo = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "settings.manage");
    const siteUrl =
      process.env.SITE_URL?.replace(/\/$/, "") ??
      process.env.CONVEX_SITE_URL?.replace(/\/$/, "") ??
      "";
    return {
      webhookUrl: siteUrl ? webhookUrl(siteUrl) : "",
      siteUrl,
    };
  },
});

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

    const siteUrl =
      process.env.SITE_URL?.replace(/\/$/, "") ??
      process.env.CONVEX_SITE_URL?.replace(/\/$/, "");
    if (!siteUrl) {
      throw new Error("SITE_URL ou CONVEX_SITE_URL manquant sur Convex.");
    }

    const url = webhookUrl(siteUrl);
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

    const message = parsed;
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
      externalId: message.externalId,
      createdAt: now,
    });

    return { conversationId, created: true as const };
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

export const webhook = httpAction(async (ctx, request) => {
  if (request.method === "GET") {
    return new Response("OK", { status: 200 });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload = await parseHttpBody(request);
    if (payload) {
      await ctx.runMutation(internal.whatsappMessenger.ingestInbound, { payload });
    }
  } catch (error) {
    console.error("360Messenger webhook error:", error);
  }

  return new Response("OK", { status: 200 });
});
