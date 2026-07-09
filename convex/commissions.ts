import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission } from "./lib/authz";
import { getQuotePricing } from "./lib/quotePricing";
import { logAudit } from "./lib/auditLog";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "commissions.view");

    const quotes = (await ctx.db.query("orderSupplierQuotes").collect()).filter(
      (quote) => quote.status === "submitted"
    );

    const rows = await Promise.all(
      quotes.map(async (quote) => {
        const order = await ctx.db.get(quote.orderId);
        if (order?.status === "annulee" || order?.status !== "terminee") {
          return null;
        }
        const supplier = await ctx.db.get(quote.supplierId);
        const offers = await ctx.db
          .query("clientOffers")
          .withIndex("by_orderId", (q) => q.eq("orderId", quote.orderId))
          .collect();
        const latestOffer = offers.sort((a, b) => b.updatedAt - a.updatedAt)[0];
        const pricing = getQuotePricing(quote);

        return {
          quoteId: quote._id,
          orderId: quote.orderId,
          orderRef: order?.ref ?? "—",
          supplierName: supplier?.name ?? "—",
          supplierTotal: pricing.supplierTotal,
          finalPrice: latestOffer?.finalPrice ?? pricing.finalPrice,
          commissionPct: pricing.commissionPct,
          commissionAmount: latestOffer?.commissionAmount ?? pricing.commissionAmount,
          commissionPaid: Boolean(quote.commissionPaidAt),
          commissionPaidAt: quote.commissionPaidAt,
          offerStatus: latestOffer?.status ?? "none",
          orderStatus: order?.status ?? "nouvelle",
          submittedAt: quote.submittedAt ?? quote.createdAt,
        };
      })
    );

    return rows
      .filter((row) => row !== null)
      .sort((a, b) => b.submittedAt - a.submittedAt);
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "commissions.view");

    const rows = await ctx.db.query("orderSupplierQuotes").collect();
    const submitted = rows.filter((quote) => quote.status === "submitted");

    let totalCommission = 0;
    let paidCommission = 0;
    let unpaidCommission = 0;
    let quoteCount = 0;

    for (const quote of submitted) {
      const order = await ctx.db.get(quote.orderId);
      if (order?.status !== "terminee") {
        continue;
      }
      const pricing = getQuotePricing(quote);
      totalCommission += pricing.commissionAmount;
      quoteCount += 1;

      if (quote.commissionPaidAt) {
        paidCommission += pricing.commissionAmount;
      } else {
        unpaidCommission += pricing.commissionAmount;
      }
    }

    return {
      totalCommission,
      paidCommission,
      unpaidCommission,
      quoteCount,
    };
  },
});

export const markPaid = mutation({
  args: { quoteId: v.id("orderSupplierQuotes") },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "commissions.manage");
    const quote = await ctx.db.get(args.quoteId);
    if (!quote) {
      throw new Error("Devis introuvable.");
    }

    const order = await ctx.db.get(quote.orderId);

    await ctx.db.patch(args.quoteId, {
      commissionPaidAt: Date.now(),
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "commission",
      entityId: args.quoteId,
      entityLabel: order?.ref ?? "Commission",
      toValue: "paid",
    });
  },
});
