import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { resolveSupplierPartnerKind } from "../lib/supplier-activity-types";

export const listSubscriptionsForSupplier = internalQuery({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
  },
});

export const listSubscriptionsForAudience = internalQuery({
  args: {
    audience: v.union(
      v.literal("all"),
      v.literal("materiel"),
      v.literal("soins")
    ),
    supplierId: v.optional(v.id("suppliers")),
  },
  handler: async (ctx, args) => {
    if (args.supplierId) {
      return await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId!))
        .collect();
    }

    const subscriptions = await ctx.db.query("pushSubscriptions").collect();
    if (args.audience === "all") {
      return subscriptions;
    }

    const suppliers = await ctx.db.query("suppliers").collect();
    const byId = new Map(suppliers.map((s) => [s._id, s] as const));
    return subscriptions.filter((sub) => {
      const supplier = byId.get(sub.supplierId);
      if (!supplier) return false;
      const kind =
        resolveSupplierPartnerKind(supplier) ??
        supplier.partnerKind ??
        "materiel";
      return kind === args.audience;
    });
  },
});

export const deleteSubscriptionById = internalMutation({
  args: { id: v.id("pushSubscriptions") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (existing) {
      await ctx.db.delete(args.id);
    }
    return null;
  },
});
