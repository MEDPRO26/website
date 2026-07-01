import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { logAudit } from "./auditLog";
import { appendOrderEvent } from "./orderEvents";
import { formatStatusChange } from "./orderStatus";
import { supplierTotal } from "./pricing";
import { notifyStaff } from "./notifications";

type SubmitQuoteInput = {
  orderId: Id<"orders">;
  supplierId: Id<"suppliers">;
  basePrice: number;
  deliveryFee: number;
  installFee: number;
  otherFee: number;
  commissionPct: number;
  commissionAmount?: number;
  notes?: string;
  actorStaffId?: Id<"staff">;
  submittedBySupplier?: boolean;
};

export async function upsertSupplierQuote(ctx: MutationCtx, args: SubmitQuoteInput) {
  const order = await ctx.db.get(args.orderId);
  if (!order) {
    throw new Error("Commande introuvable.");
  }
  if (order.supplierId !== args.supplierId) {
    throw new Error("Cette commande n'est pas affectée à ce fournisseur.");
  }

  if (args.basePrice < 0) {
    throw new Error("Le prix doit être positif.");
  }

  if (
    args.commissionAmount !== undefined &&
    args.commissionAmount < 0
  ) {
    throw new Error("La commission doit être positive.");
  }

  const now = Date.now();
  const existing = await ctx.db
    .query("orderSupplierQuotes")
    .withIndex("by_orderId_supplierId", (q) =>
      q.eq("orderId", args.orderId).eq("supplierId", args.supplierId)
    )
    .unique();

  const quoteFields = {
    basePrice: args.basePrice,
    deliveryFee: args.deliveryFee,
    installFee: args.installFee,
    otherFee: args.otherFee,
    commissionPct: args.commissionAmount !== undefined ? 0 : args.commissionPct,
    commissionAmount: args.commissionAmount,
    notes: args.notes,
    status: "submitted" as const,
    submittedAt: now,
    updatedAt: now,
  };

  let quoteId;
  if (existing) {
    await ctx.db.patch(existing._id, quoteFields);
    quoteId = existing._id;
  } else {
    quoteId = await ctx.db.insert("orderSupplierQuotes", {
      orderId: args.orderId,
      supplierId: args.supplierId,
      ...quoteFields,
      createdByStaffId: args.actorStaffId,
      createdAt: now,
    });
  }

  const total = supplierTotal({
    basePrice: args.basePrice,
    deliveryFee: args.deliveryFee,
    installFee: args.installFee,
    otherFee: args.otherFee,
  });

  if (
    order.status !== "prix_recu" &&
    order.status !== "offre_envoyee" &&
    order.status !== "acceptee"
  ) {
    await ctx.db.patch(args.orderId, {
      status: "prix_recu",
      updatedAt: now,
    });
    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "status_change",
      label: formatStatusChange(order.status, "prix_recu"),
      fromStatus: order.status,
      toStatus: "prix_recu",
      actorStaffId: args.actorStaffId,
    });
  }

  const commissionLabel =
    args.commissionAmount !== undefined
      ? ` · commission SOS ${args.commissionAmount.toLocaleString("fr-FR")} MAD`
      : "";

  await appendOrderEvent(ctx, {
    orderId: args.orderId,
    type: "quote",
    label: args.submittedBySupplier
      ? `Prix confirmé par le fournisseur · ${total.toLocaleString("fr-FR")} MAD${commissionLabel}`
      : `Prix fournisseur enregistré · ${total.toLocaleString("fr-FR")} MAD${commissionLabel}`,
    actorStaffId: args.actorStaffId,
  });

  if (args.submittedBySupplier) {
    const orderRow = await ctx.db.get(args.orderId);
    const supplier = await ctx.db.get(args.supplierId);
    await notifyStaff(ctx, "supplier_response", {
      type: "supplier",
      title: `${supplier?.name ?? "Fournisseur"} a soumis un prix`,
      description: `${orderRow?.ref ?? "Commande"} · ${total.toLocaleString("fr-FR")} MAD`,
      link: `/admin/orders/${args.orderId}`,
      entityId: args.orderId,
    });
  }

  if (args.actorStaffId) {
    const actor = await ctx.db.get(args.actorStaffId);
    const orderRow = await ctx.db.get(args.orderId);
    if (actor) {
      await logAudit(ctx, {
        actorStaffId: args.actorStaffId,
        actorName: actor.name,
        action: "update",
        entityType: "supplier_quote",
        entityId: quoteId,
        entityLabel: orderRow?.ref ?? "Devis",
        toValue: "submitted",
      });
    }
  }

  return quoteId;
}
