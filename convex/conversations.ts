import { mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { requireAdminStaff } from "./lib/authz";
import { findCustomerByPhone } from "./lib/customers";
import { conversationStatusValidator } from "./validators";
import { normalizePhone } from "./lib/refs";
import { logAudit } from "./lib/auditLog";

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

const STATUS_LABEL: Record<string, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
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

    return rows
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
      .map((row) => {
        const channel = row.channelId ? channelById.get(row.channelId) : null;
        return {
          ...row,
          channelLabel: channel?.label ?? "Non assignée",
          channelPhone: channel?.phone ?? "",
          timeLabel: formatTime(row.lastMessageAt),
          statusLabel: STATUS_LABEL[row.status] ?? row.status,
        };
      });
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
      : null;

    const channel = conversation.channelId
      ? await ctx.db.get(conversation.channelId)
      : null;

    return {
      conversation: {
        ...conversation,
        statusLabel: STATUS_LABEL[conversation.status] ?? conversation.status,
        channelLabel: channel?.label ?? "Non assignée",
        channelPhone: channel?.phone ?? "",
      },
      channel,
      messages: messages.sort((a, b) => a.createdAt - b.createdAt),
      customer,
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

    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (settings?.whatsappProvider === "disabled") {
      throw new Error("WhatsApp est désactivé dans les paramètres.");
    }

    const now = Date.now();
    await ctx.db.insert("conversationMessages", {
      conversationId: args.conversationId,
      from: "staff",
      text,
      createdAt: now,
    });

    await ctx.db.patch(args.conversationId, {
      lastMessage: text,
      lastMessageAt: now,
      unreadCount: 0,
      status: "en_cours",
      updatedAt: now,
    });

    if (settings?.whatsappProvider === "360messenger") {
      await ctx.scheduler.runAfter(0, internal.whatsappMessenger.deliverReply, {
        conversationId: args.conversationId,
        text,
      });
    }

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "conversation",
      entityId: args.conversationId,
      entityLabel: conversation.name,
      toValue: "reply",
    });
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
