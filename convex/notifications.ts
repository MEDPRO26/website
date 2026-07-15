import { internalMutation, mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission } from "./lib/authz";
import { isInAppNotificationTitle } from "./lib/notifications";
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

async function purgeIrrelevantNotifications(ctx: MutationCtx) {
  const rows = await ctx.db.query("notifications").collect();
  let deleted = 0;
  let kept = 0;
  for (const row of rows) {
    if (isInAppNotificationTitle(row.title)) {
      kept += 1;
      continue;
    }
    await ctx.db.delete(row._id);
    deleted += 1;
  }
  return { deleted, kept };
}

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "notifications.view");
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    return unread.filter((row) => isInAppNotificationTitle(row.title)).length;
  },
});

export const list = query({
  args: {
    unreadOnly: v.optional(v.boolean()),
    type: v.optional(notificationTypeValidator),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "notifications.view");

    let rows = (await ctx.db.query("notifications").collect()).filter(
      (row) => isInAppNotificationTitle(row.title)
    );
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
      if (!isInAppNotificationTitle(row.title)) continue;
      await ctx.db.patch(row._id, { read: true });
    }
  },
});

/** Deletes legacy alerts that are no longer shown in the inbox. */
export const purgeIrrelevant = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "notifications.view");
    return await purgeIrrelevantNotifications(ctx);
  },
});

/** CLI: `npx convex run notifications:purgeIrrelevantInternal --prod --push` */
export const purgeIrrelevantInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await purgeIrrelevantNotifications(ctx);
  },
});
