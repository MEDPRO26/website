import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission } from "./lib/authz";
import { notificationTypeValidator } from "./validators";

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Hier" : `Il y a ${days} j`;
}

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "notifications.view");
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    return unread.length;
  },
});

export const list = query({
  args: {
    unreadOnly: v.optional(v.boolean()),
    type: v.optional(notificationTypeValidator),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "notifications.view");

    let rows = await ctx.db.query("notifications").collect();
    if (args.unreadOnly) {
      rows = rows.filter((row) => !row.read);
    }
    if (args.type) {
      rows = rows.filter((row) => row.type === args.type);
    }

    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((row) => ({
        ...row,
        timeLabel: formatRelative(row.createdAt),
      }));
  },
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "notifications.view");
    await ctx.db.patch(args.id, { read: true });
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "notifications.view");
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    for (const row of unread) {
      await ctx.db.patch(row._id, { read: true });
    }
  },
});
