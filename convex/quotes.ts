import { mutation, query, action, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdminPermission, requireAdminStaff } from "./lib/authz";
import { appendOrderEvent } from "./lib/orderEvents";
import { formatStatusChange } from "./lib/orderStatus";
import { pushNotification, notifyStaff } from "./lib/notifications";
import { logAudit } from "./lib/auditLog";
import { buildDefaultOfferMessage } from "./lib/pricing";
import { getQuotePricing } from "./lib/quotePricing";
import { findOrCreateOutboundConversation } from "./lib/whatsappOutboundConversation";
import { normalizePhone } from "./lib/refs";
import { send360Message } from "./lib/messenger360";
import { closeConversationForOrder } from "./lib/whatsappConversationRouting";
import { resolveOrderClientFirstName, resolveOrderClientName } from "./lib/orderClient";

async function deliverOfferViaWhatsApp(
  ctx: MutationCtx,
  order: Doc<"orders">,
  message: string
) {
  const customer = await ctx.db.get(order.customerId);
  if (!customer) {
    throw new Error("Client introuvable pour cette commande.");
  }

  const clientName = resolveOrderClientName(order, customer);
  const phone = normalizePhone(customer.phone);
  const { conversationId } = await findOrCreateOutboundConversation(ctx, {
    phone,
    name: clientName,
    customerId: customer._id,
    customerCity: customer.city,
    orderSource: order.source,
    orderId: order._id,
    orderRef: order.ref,
    source: "Offre commande",
    status: "en_cours",
    staffMessage: message,
  });

  return conversationId;
}

async function recordSendClientOffer(
  ctx: MutationCtx,
  args: { orderId: Id<"orders">; message?: string }
) {
  const staff = await requireAdminPermission(ctx, "quotes.send_to_client");
  const order = await ctx.db.get(args.orderId);
  if (!order) {
    throw new Error("Commande introuvable.");
  }

  const offers = await ctx.db
    .query("clientOffers")
    .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
    .collect();

  const sortedOffers = [...offers].sort((a, b) => b.updatedAt - a.updatedAt);
  let offer =
    sortedOffers.find((item) => item.status === "draft") ??
    sortedOffers.find((item) => item.status === "sent") ??
    null;

  if (!offer) {
    const quote = order.supplierId
      ? await ctx.db
          .query("orderSupplierQuotes")
          .withIndex("by_orderId_supplierId", (q) =>
            q.eq("orderId", args.orderId).eq("supplierId", order.supplierId!)
          )
          .unique()
      : null;

    if (!quote) {
      throw new Error("Aucune offre à envoyer. Enregistrez le prix fournisseur.");
    }

    const customer = await ctx.db.get(order.customerId);
    const pricing = getQuotePricing(quote);
    const now = Date.now();

    const message =
      args.message?.trim() ??
      buildDefaultOfferMessage({
        clientFirstName: resolveOrderClientFirstName(order, customer),
        requestType: order.type,
        item: order.item,
        duration: order.duration,
        finalPrice: pricing.finalPrice,
        desiredDate: order.desiredDate,
        slot: order.slot,
      });

    const offerId = await ctx.db.insert("clientOffers", {
      orderId: args.orderId,
      quoteId: quote._id,
      supplierTotal: pricing.supplierTotal,
      commissionPct: pricing.commissionPct,
      commissionAmount: pricing.commissionAmount,
      finalPrice: pricing.finalPrice,
      message,
      status: "sent",
      createdByStaffId: staff._id,
      sentAt: now,
      createdAt: now,
      updatedAt: now,
    });
    offer = (await ctx.db.get(offerId))!;
  } else if (offer.status === "draft") {
    const now = Date.now();
    await ctx.db.patch(offer._id, {
      message: args.message?.trim() ?? offer.message,
      status: "sent",
      sentAt: now,
      updatedAt: now,
    });
    offer = (await ctx.db.get(offer._id))!;
  } else if (args.message?.trim() && args.message.trim() !== offer.message) {
    const now = Date.now();
    await ctx.db.patch(offer._id, {
      message: args.message.trim(),
      updatedAt: now,
    });
    offer = (await ctx.db.get(offer._id))!;
  }

  const now = Date.now();
  if (order.status !== "offre_envoyee" && order.status !== "acceptee") {
    await ctx.db.patch(args.orderId, {
      status: "offre_envoyee",
      updatedAt: now,
    });
    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "status_change",
      label: formatStatusChange(order.status, "offre_envoyee"),
      fromStatus: order.status,
      toStatus: "offre_envoyee",
      actorStaffId: staff._id,
    });
  }

  await appendOrderEvent(ctx, {
    orderId: args.orderId,
    type: "offer",
    label: `Offre client envoyée · ${offer.finalPrice.toLocaleString("fr-FR")} MAD`,
    actorStaffId: staff._id,
  });

  await pushNotification(ctx, {
    type: "commission",
    title: "Offre client envoyée",
    description: `${order.ref} · ${offer.finalPrice.toLocaleString("fr-FR")} MAD`,
    link: `/admin/orders/${args.orderId}`,
    entityId: args.orderId,
  });

  await logAudit(ctx, {
    actorStaffId: staff._id,
    actorName: staff.name,
    action: "update",
    entityType: "client_offer",
    entityId: offer._id,
    entityLabel: order.ref,
    toValue: "sent",
  });

  return { offer, order };
}

export const getForOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }

    const quotes = await ctx.db
      .query("orderSupplierQuotes")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();

    const offers = await ctx.db
      .query("clientOffers")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();

    const activeQuote =
      (order.supplierId
        ? quotes.find((quote) => quote.supplierId === order.supplierId)
        : null) ??
      quotes
        .filter((quote) => quote.status === "submitted")
        .sort((a, b) => b.updatedAt - a.updatedAt)[0] ??
      null;

    const declinedQuote =
      quotes
        .filter((quote) => quote.status === "rejected")
        .sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;

    const activeOffer =
      offers.sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;

    let supplier = order.supplierId ? await ctx.db.get(order.supplierId) : null;
    if (activeQuote && !supplier) {
      supplier = await ctx.db.get(activeQuote.supplierId);
    }
    const declinedSupplier = declinedQuote
      ? await ctx.db.get(declinedQuote.supplierId)
      : null;

    const pricing = activeQuote ? getQuotePricing(activeQuote) : null;
    const customer = await ctx.db.get(order.customerId);
    const suggestedMessage =
      activeQuote?.status === "submitted" && pricing && customer
        ? buildDefaultOfferMessage({
            clientFirstName: resolveOrderClientFirstName(order, customer),
            requestType: order.type,
            item: order.item,
            duration: order.duration,
            finalPrice: pricing.finalPrice,
            desiredDate: order.desiredDate,
            slot: order.slot,
          })
        : null;

    return {
      activeQuote,
      activeOffer,
      supplier,
      declinedQuote,
      declinedSupplier,
      suggestedMessage,
      pricing: pricing
        ? {
            ...pricing,
            usesDeclaredCommission: pricing.usesDeclaredCommission,
          }
        : null,
    };
  },
});

export const prepareClientOffer = mutation({
  args: {
    orderId: v.id("orders"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "quotes.validate_final_price");
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Commande introuvable.");
    }

    const customer = await ctx.db.get(order.customerId);
    const quote = order.supplierId
      ? await ctx.db
          .query("orderSupplierQuotes")
          .withIndex("by_orderId_supplierId", (q) =>
            q.eq("orderId", args.orderId).eq("supplierId", order.supplierId!)
          )
          .unique()
      : null;

    if (!quote || quote.status !== "submitted") {
      throw new Error("Enregistrez d'abord le prix fournisseur.");
    }

    const pricing = getQuotePricing(quote);
    const clientFirstName = resolveOrderClientFirstName(order, customer);

    const message =
      args.message?.trim() ??
      buildDefaultOfferMessage({
        clientFirstName,
        requestType: order.type,
        item: order.item,
        duration: order.duration,
        finalPrice: pricing.finalPrice,
        desiredDate: order.desiredDate,
        slot: order.slot,
      });

    const now = Date.now();
    const existingOffer = await ctx.db
      .query("clientOffers")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();

    const draft = existingOffer.find((offer) => offer.status === "draft");

    if (draft) {
      await ctx.db.patch(draft._id, {
        quoteId: quote._id,
        supplierTotal: pricing.supplierTotal,
        commissionPct: pricing.commissionPct,
        commissionAmount: pricing.commissionAmount,
        finalPrice: pricing.finalPrice,
        message,
        updatedAt: now,
      });
      return draft._id;
    }

    const offerId = await ctx.db.insert("clientOffers", {
      orderId: args.orderId,
      quoteId: quote._id,
      supplierTotal: pricing.supplierTotal,
      commissionPct: pricing.commissionPct,
      commissionAmount: pricing.commissionAmount,
      finalPrice: pricing.finalPrice,
      message,
      status: "draft",
      createdByStaffId: staff._id,
      createdAt: now,
      updatedAt: now,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "create",
      entityType: "client_offer",
      entityId: offerId,
      entityLabel: order.ref,
      toValue: "draft",
    });

    return offerId;
  },
});

export const sendClientOffer = mutation({
  args: {
    orderId: v.id("orders"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { offer } = await recordSendClientOffer(ctx, args);
    return offer._id;
  },
});

export const sendClientOfferForWhatsApp = mutation({
  args: {
    orderId: v.id("orders"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();
    if (settings?.whatsappProvider !== "360messenger") {
      throw new Error(
        "360Messenger n'est pas connecté. Activez-le dans Paramètres."
      );
    }

    const { offer, order } = await recordSendClientOffer(ctx, args);
    const conversationId = await deliverOfferViaWhatsApp(ctx, order, offer.message);
    return {
      offerId: offer._id,
      conversationId,
      message: offer.message,
    };
  },
});

export const sendClientOfferWithWhatsApp = action({
  args: {
    orderId: v.id("orders"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result: {
      offerId: Id<"clientOffers">;
      conversationId: Id<"conversations">;
      message: string;
    } = await ctx.runMutation(api.quotes.sendClientOfferForWhatsApp, {
      orderId: args.orderId,
      message: args.message,
    });

    const context = await ctx.runQuery(internal.whatsappMessenger.getReplyContext, {
      conversationId: result.conversationId,
      text: result.message,
    });

    if (!context || context.provider !== "360messenger") {
      throw new Error(
        "Impossible d'envoyer via 360Messenger : ligne WhatsApp non connectée."
      );
    }

    await send360Message(context.apiKey, context.phone, context.text);

    return result.offerId;
  },
});

export const acceptClientOffer = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "orders.validate_quote");
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Commande introuvable.");
    }

    const offers = await ctx.db
      .query("clientOffers")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();

    const offer = offers.sort((a, b) => b.updatedAt - a.updatedAt)[0];
    if (!offer || offer.status !== "sent") {
      throw new Error("Marquez d'abord l'offre comme envoyée.");
    }

    const now = Date.now();
    await ctx.db.patch(offer._id, {
      status: "accepted",
      updatedAt: now,
    });

    if (order.status !== "acceptee") {
      await ctx.db.patch(args.orderId, {
        status: "acceptee",
        updatedAt: now,
      });
      await appendOrderEvent(ctx, {
        orderId: args.orderId,
        type: "status_change",
        label: formatStatusChange(order.status, "acceptee"),
        fromStatus: order.status,
        toStatus: "acceptee",
        actorStaffId: staff._id,
      });
    }

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "system",
      label: "Client a accepté l'offre",
      actorStaffId: staff._id,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "status_change",
      entityType: "order",
      entityId: args.orderId,
      entityLabel: order.ref,
      fromValue: order.status,
      toValue: "acceptee",
    });

    await notifyStaff(ctx, "client_accepted", {
      type: "order",
      title: "Client a accepté l'offre",
      description: order.ref,
      link: `/admin/orders/${args.orderId}`,
      entityId: args.orderId,
    });

    await closeConversationForOrder(ctx, args.orderId);

    return offer._id;
  },
});
