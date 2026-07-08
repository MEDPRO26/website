import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { resolveOrderClientFirstName } from "./orderClient";
import { buildDefaultOfferMessage } from "./pricing";
import { getQuotePricing } from "./quotePricing";

export async function ensureDraftClientOffer(
  ctx: MutationCtx,
  args: {
    orderId: Id<"orders">;
    quoteId: Id<"orderSupplierQuotes">;
    quote: Doc<"orderSupplierQuotes">;
    order: Doc<"orders">;
    actorStaffId?: Id<"staff">;
  }
) {
  const customer = await ctx.db.get(args.order.customerId);
  const pricing = getQuotePricing(args.quote);
  const clientFirstName = resolveOrderClientFirstName(args.order, customer);

  const message = buildDefaultOfferMessage({
    clientFirstName,
    requestType: args.order.type,
    item: args.order.item,
    duration: args.order.duration,
    finalPrice: pricing.finalPrice,
    desiredDate: args.order.desiredDate,
    slot: args.order.slot,
  });

  const now = Date.now();
  const existingOffers = await ctx.db
    .query("clientOffers")
    .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
    .collect();

  const draft = existingOffers.find((offer) => offer.status === "draft");
  const sent = existingOffers.find((offer) => offer.status === "sent");

  if (sent || draft) {
    if (draft) {
      await ctx.db.patch(draft._id, {
        quoteId: args.quoteId,
        supplierTotal: pricing.supplierTotal,
        commissionPct: pricing.commissionPct,
        commissionAmount: pricing.commissionAmount,
        finalPrice: pricing.finalPrice,
        message,
        updatedAt: now,
      });
    }
    return draft?._id ?? sent?._id;
  }

  return await ctx.db.insert("clientOffers", {
    orderId: args.orderId,
    quoteId: args.quoteId,
    supplierTotal: pricing.supplierTotal,
    commissionPct: pricing.commissionPct,
    commissionAmount: pricing.commissionAmount,
    finalPrice: pricing.finalPrice,
    message,
    status: "draft",
    createdByStaffId: args.actorStaffId,
    createdAt: now,
    updatedAt: now,
  });
}
