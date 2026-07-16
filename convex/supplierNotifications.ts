import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireSupplierStaff } from "./lib/authz";

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

export async function pushSupplierNotification(
  ctx: MutationCtx,
  args: {
    supplierId: Id<"suppliers">;
    title: string;
    description: string;
    link?: string;
    orderId?: Id<"orders">;
  }
) {
  await ctx.db.insert("supplierNotifications", {
    supplierId: args.supplierId,
    title: args.title,
    description: args.description,
    read: false,
    link: args.link,
    orderId: args.orderId,
    createdAt: Date.now(),
  });
}

export async function notifySupplierNewOrderInApp(
  ctx: MutationCtx,
  args: {
    supplier: Doc<"suppliers">;
    order: Doc<"orders">;
    orderId: Id<"orders">;
  }
) {
  await pushSupplierNotification(ctx, {
    supplierId: args.supplier._id,
    title: "Nouvelle commande",
    description: `${args.order.ref} - ${args.order.item}. Ouvrez la commande pour contacter le client.`,
    link: `/supplier/orders/${args.orderId}`,
    orderId: args.orderId,
  });
}

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const { supplier } = await requireSupplierStaff(ctx);
    const unread = await ctx.db
      .query("supplierNotifications")
      .withIndex("by_supplierId_read", (q) =>
        q.eq("supplierId", supplier._id).eq("read", false)
      )
      .collect();
    return unread.length;
  },
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { supplier } = await requireSupplierStaff(ctx);
    const limit = Math.min(Math.max(args.limit ?? 20, 1), 50);
    const rows = await ctx.db
      .query("supplierNotifications")
      .withIndex("by_supplierId_createdAt", (q) =>
        q.eq("supplierId", supplier._id)
      )
      .order("desc")
      .take(limit);

    return rows.map((row) => ({
      ...row,
      timeLabel: formatRelative(row.createdAt),
    }));
  },
});

export const markRead = mutation({
  args: { id: v.id("supplierNotifications") },
  handler: async (ctx, args) => {
    const { supplier } = await requireSupplierStaff(ctx);
    const row = await ctx.db.get(args.id);
    if (!row || row.supplierId !== supplier._id) {
      throw new Error("Notification introuvable.");
    }
    if (!row.read) {
      await ctx.db.patch(args.id, { read: true });
    }
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const { supplier } = await requireSupplierStaff(ctx);
    const unread = await ctx.db
      .query("supplierNotifications")
      .withIndex("by_supplierId_read", (q) =>
        q.eq("supplierId", supplier._id).eq("read", false)
      )
      .collect();
    for (const row of unread) {
      await ctx.db.patch(row._id, { read: true });
    }
  },
});
