import { supplierOrderLoginUrl } from "../../lib/auth-routes";
import { internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { resolveOrderClientName } from "./orderClient";
import { notifySupplierNewOrderInApp } from "../supplierNotifications";

export async function notifySupplierOfAssignment(
  ctx: MutationCtx,
  args: {
    supplier: Doc<"suppliers">;
    order: Doc<"orders">;
    orderId: Id<"orders">;
  }
) {
  await notifySupplierNewOrderInApp(ctx, args);

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  // Login first so guests don't hit the hidden /supplier 404.
  const orderUrl = supplierOrderLoginUrl(args.orderId, siteUrl);
  const email = args.supplier.email?.trim();
  const customer = await ctx.db.get(args.order.customerId);
  const clientName = customer ? resolveOrderClientName(args.order, customer) : "Client";
  const clientPhone = customer?.phone?.trim() || "";

  if (email) {
    await ctx.scheduler.runAfter(0, internal.email.sendSupplierOrderAssignment, {
      to: email,
      supplierName: args.supplier.name,
      orderRef: args.order.ref,
      orderUrl,
      clientName,
      clientPhone,
    });
  }

  const phone = args.supplier.whatsapp?.trim() || args.supplier.phone?.trim();
  if (phone) {
    const text = [
      `Bonjour ${args.supplier.name},`,
      "",
      `Une nouvelle commande vous a été affectée (${args.order.ref}).`,
      "",
      `Client: ${clientName}${clientPhone ? ` · ${clientPhone}` : ""}`,
      "Consultez les détails et répondez avec votre offre :",
      orderUrl,
      "",
      "- Centre SOS Santé",
    ].join("\n");

    await ctx.scheduler.runAfter(0, internal.whatsappMessenger.sendDirectMessage, {
      phone,
      text,
      city: args.supplier.city,
    });
  }
}
