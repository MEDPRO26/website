import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getStaffProfile, requireSupplierOnboarding, requireSupplierStaff } from "./lib/authz";
import { isSupplierProfileComplete } from "./lib/supplierProfile";
import { normalizePhone } from "./lib/refs";
import { appendOrderEvent } from "./lib/orderEvents";
import { formatStatusChange, supplierCanSeeClientContact } from "./lib/orderStatus";
import { resolveOrderClientName } from "./lib/orderClient";
import { getQuotePricing } from "./lib/quotePricing";
import { upsertSupplierQuote } from "./lib/submitSupplierQuote";
import { notifyStaff } from "./lib/notifications";
import { logAudit } from "./lib/auditLog";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const staff = await getStaffProfile(ctx);
    if (!staff || staff.role !== "supplier" || !staff.supplierId) {
      return null;
    }

    const supplier = await ctx.db.get(staff.supplierId);
    if (!supplier) {
      return null;
    }

    return { staff, supplier, profileComplete: isSupplierProfileComplete(supplier) };
  },
});

export const listOrders = query({
  args: {},
  handler: async (ctx) => {
    const { staff, supplier } = await requireSupplierStaff(ctx);
    if (!isSupplierProfileComplete(supplier)) {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", staff.supplierId!))
      .collect();

    const enriched = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        const quote = await ctx.db
          .query("orderSupplierQuotes")
          .withIndex("by_orderId_supplierId", (q) =>
            q.eq("orderId", order._id).eq("supplierId", staff.supplierId!)
          )
          .unique();

        const clientContactVisible = supplierCanSeeClientContact(order.status);
        const quoteStatus = quote?.status;

        return {
          ...order,
          city: customer?.city ?? "—",
          district: customer?.district ?? "",
          hasQuote: quoteStatus === "submitted",
          clientContactVisible,
          clientName: clientContactVisible
            ? resolveOrderClientName(order, customer)
            : undefined,
          clientPhone: clientContactVisible ? customer?.phone : undefined,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const { staff, supplier } = await requireSupplierStaff(ctx);

    const order = await ctx.db.get(args.orderId);
    if (!order || order.supplierId !== staff.supplierId) {
      return null;
    }

    const customer = await ctx.db.get(order.customerId);
    const quote = await ctx.db
      .query("orderSupplierQuotes")
      .withIndex("by_orderId_supplierId", (q) =>
        q.eq("orderId", order._id).eq("supplierId", staff.supplierId!)
      )
      .unique();

    const clientContactVisible = supplierCanSeeClientContact(order.status);

    return {
      order,
      clientContactVisible,
      customer: customer
        ? {
            city: customer.city,
            district: customer.district ?? "",
            ...(clientContactVisible
              ? {
                  name: resolveOrderClientName(order, customer),
                  phone: customer.phone,
                }
              : {}),
          }
        : null,
      supplier,
      quote,
      pricing: quote ? getQuotePricing(quote) : null,
    };
  },
});

export const markViewed = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const { staff } = await requireSupplierStaff(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order || order.supplierId !== staff.supplierId) {
      throw new Error("Commande introuvable.");
    }

    if (order.status !== "envoyee_fournisseur") {
      return;
    }

    const now = Date.now();
    await ctx.db.patch(args.orderId, {
      status: "vue_fournisseur",
      updatedAt: now,
    });

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "status_change",
      label: formatStatusChange("envoyee_fournisseur", "vue_fournisseur"),
      fromStatus: "envoyee_fournisseur",
      toStatus: "vue_fournisseur",
      actorStaffId: staff._id,
    });
  },
});

export const submitQuote = mutation({
  args: {
    orderId: v.id("orders"),
    basePrice: v.number(),
    deliveryFee: v.optional(v.number()),
    installFee: v.optional(v.number()),
    otherFee: v.optional(v.number()),
    commissionAmount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { staff, supplier } = await requireSupplierStaff(ctx);
    if (!isSupplierProfileComplete(supplier)) {
      throw new Error("Complétez votre profil fournisseur avant de répondre.");
    }

    if (!args.commissionAmount || args.commissionAmount <= 0) {
      throw new Error(
        "La commission SOS Santé est obligatoire. Indiquez le montant en MAD."
      );
    }

    return await upsertSupplierQuote(ctx, {
      orderId: args.orderId,
      supplierId: supplier._id,
      basePrice: args.basePrice,
      deliveryFee: args.deliveryFee ?? 0,
      installFee: args.installFee ?? 0,
      otherFee: args.otherFee ?? 0,
      commissionPct: 0,
      commissionAmount: args.commissionAmount,
      notes: args.notes?.trim() || undefined,
      actorStaffId: staff._id,
      submittedBySupplier: true,
    });
  },
});

export const markUnavailable = mutation({
  args: {
    orderId: v.id("orders"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { staff, supplier } = await requireSupplierStaff(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order || order.supplierId !== supplier._id) {
      throw new Error("Commande introuvable.");
    }

    if (
      !["envoyee_fournisseur", "vue_fournisseur", "prix_recu"].includes(
        order.status
      )
    ) {
      throw new Error("Cette commande ne peut plus être déclinée.");
    }

    const existing = await ctx.db
      .query("orderSupplierQuotes")
      .withIndex("by_orderId_supplierId", (q) =>
        q.eq("orderId", args.orderId).eq("supplierId", supplier._id)
      )
      .unique();

    if (existing?.status === "submitted") {
      throw new Error("Impossible après avoir soumis un prix.");
    }

    const now = Date.now();
    const declineNote = args.notes?.trim() || "Non disponible";

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "rejected",
        notes: declineNote,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("orderSupplierQuotes", {
        orderId: args.orderId,
        supplierId: supplier._id,
        basePrice: 0,
        deliveryFee: 0,
        installFee: 0,
        otherFee: 0,
        commissionPct: 0,
        notes: declineNote,
        status: "rejected",
        createdAt: now,
        updatedAt: now,
      });
    }

    const previousStatus = order.status;
    await ctx.db.patch(args.orderId, {
      supplierId: undefined,
      status: "a_qualifier",
      updatedAt: now,
    });

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "quote",
      label: `${supplier.name} — non disponible`,
      actorStaffId: staff._id,
    });

    if (previousStatus !== "a_qualifier") {
      await appendOrderEvent(ctx, {
        orderId: args.orderId,
        type: "status_change",
        label: formatStatusChange(previousStatus, "a_qualifier"),
        fromStatus: previousStatus,
        toStatus: "a_qualifier",
        actorStaffId: staff._id,
      });
    }

    await notifyStaff(ctx, "supplier_response", {
      type: "supplier",
      title: `${supplier.name} — non disponible`,
      description: `${order.ref} · choisir un autre fournisseur`,
      link: `/admin/orders/${args.orderId}`,
      entityId: args.orderId,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "supplier_quote",
      entityId: args.orderId,
      entityLabel: order.ref,
      toValue: "unavailable",
    });
  },
});

export const markAsDelivered = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const { staff, supplier } = await requireSupplierStaff(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order || order.supplierId !== supplier._id) {
      throw new Error("Commande introuvable.");
    }

    if (order.status === "terminee") {
      return { alreadyDelivered: true as const };
    }

    const deliverable = new Set([
      "acceptee",
      "planifiee",
      "en_cours",
      "location_active",
    ]);
    if (!deliverable.has(order.status)) {
      throw new Error("Cette commande ne peut pas encore être marquée comme livrée.");
    }

    const now = Date.now();
    const fromStatus = order.status;
    await ctx.db.patch(args.orderId, {
      status: "terminee",
      updatedAt: now,
    });

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "status_change",
      label: `${supplier.name} — commande livrée`,
      fromStatus,
      toStatus: "terminee",
      actorStaffId: staff._id,
    });

    await notifyStaff(ctx, "order_delivered", {
      type: "order",
      title: `${supplier.name} — commande livrée`,
      description: `${order.ref} · livraison confirmée au client`,
      link: `/admin/orders/${args.orderId}`,
      entityId: args.orderId,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "order",
      entityId: args.orderId,
      entityLabel: order.ref,
      fromValue: fromStatus,
      toValue: "terminee",
    });

    return { alreadyDelivered: false as const };
  },
});

export const cancelByClient = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const { staff, supplier } = await requireSupplierStaff(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order || order.supplierId !== supplier._id) {
      throw new Error("Commande introuvable.");
    }

    if (order.status === "annulee") {
      return { alreadyCancelled: true as const };
    }
    if (order.status === "terminee") {
      throw new Error("Cette commande est déjà livrée.");
    }

    const now = Date.now();
    const fromStatus = order.status;
    await ctx.db.patch(args.orderId, {
      status: "annulee",
      updatedAt: now,
    });

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "status_change",
      label: `${supplier.name} — commande annulée par le client`,
      fromStatus,
      toStatus: "annulee",
      actorStaffId: staff._id,
    });

    await notifyStaff(ctx, "supplier_response", {
      type: "order",
      title: `${supplier.name} — commande annulée par le client`,
      description: `${order.ref} · annulation signalée par le fournisseur`,
      link: `/admin/orders/${args.orderId}`,
      entityId: args.orderId,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "status_change",
      entityType: "order",
      entityId: args.orderId,
      entityLabel: order.ref,
      fromValue: fromStatus,
      toValue: "annulee",
    });

    return { alreadyCancelled: false as const };
  },
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const { staff, supplier } = await requireSupplierStaff(ctx);
    if (!isSupplierProfileComplete(supplier)) {
      return {
        total: 0,
        newRequests: 0,
        pendingResponse: 0,
        pendingOffers: 0,
        activeOrders: 0,
        confirmed: 0,
        completed: 0,
        monthlyRevenue: 0,
      };
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", staff.supplierId!))
      .collect();

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let monthlyRevenue = 0;

    for (const order of orders) {
      if (order.status !== "terminee" || order.updatedAt < thirtyDaysAgo) {
        continue;
      }
      const quote = await ctx.db
        .query("orderSupplierQuotes")
        .withIndex("by_orderId_supplierId", (q) =>
          q.eq("orderId", order._id).eq("supplierId", staff.supplierId!)
        )
        .unique();
      if (quote?.status === "submitted") {
        monthlyRevenue += getQuotePricing(quote).supplierTotal;
      }
    }

    return {
      total: orders.length,
      newRequests: orders.filter((o) => o.status === "envoyee_fournisseur").length,
      pendingResponse: orders.filter((o) =>
        ["envoyee_fournisseur", "vue_fournisseur"].includes(o.status)
      ).length,
      pendingOffers: orders.filter((o) =>
        ["prix_recu", "offre_envoyee"].includes(o.status)
      ).length,
      activeOrders: orders.filter((o) =>
        ["acceptee", "planifiee", "en_cours", "location_active"].includes(o.status)
      ).length,
      confirmed: orders.filter((o) =>
        ["acceptee", "planifiee", "location_active"].includes(o.status)
      ).length,
      completed: orders.filter((o) => o.status === "terminee").length,
      monthlyRevenue,
    };
  },
});

export const completeProfile = mutation({
  args: {
    name: v.string(),
    types: v.array(v.string()),
    city: v.string(),
    zones: v.array(v.string()),
    phone: v.string(),
    whatsapp: v.string(),
    items: v.array(v.string()),
    services: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { staff, supplier } = await requireSupplierOnboarding(ctx);

    const name = args.name.trim();
    const types = args.types.map((item) => item.trim()).filter(Boolean);
    const city = args.city.trim();
    const phone = normalizePhone(args.phone);
    const whatsapp = normalizePhone(args.whatsapp.trim());
    const zones = args.zones.filter(Boolean);
    const items = args.items.filter(Boolean);
    const services = args.services.filter(Boolean);

    if (!name || !city || !phone) {
      throw new Error("Nom, ville et téléphone sont obligatoires.");
    }
    if (types.length === 0) {
      throw new Error("Sélectionnez au moins un type d'activité.");
    }
    if (!whatsapp) {
      throw new Error("WhatsApp est obligatoire.");
    }
    if (items.length === 0) {
      throw new Error("Indiquez au moins un matériel proposé.");
    }
    if (services.length === 0) {
      throw new Error("Indiquez au moins un service proposé.");
    }

    const now = Date.now();
    await ctx.db.patch(supplier._id, {
      name,
      type: types.join(", "),
      types,
      city,
      zones,
      phone,
      whatsapp,
      items,
      services,
      status: "actif",
      profileComplete: true,
      updatedAt: now,
    });

    await ctx.db.patch(staff._id, {
      name,
      updatedAt: now,
    });

    return supplier._id;
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    types: v.array(v.string()),
    city: v.string(),
    zones: v.array(v.string()),
    phone: v.string(),
    whatsapp: v.string(),
    items: v.array(v.string()),
    services: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { staff, supplier } = await requireSupplierOnboarding(ctx);

    const name = args.name.trim();
    const types = args.types.map((item) => item.trim()).filter(Boolean);
    const city = args.city.trim();
    const phone = normalizePhone(args.phone);
    const whatsapp = normalizePhone(args.whatsapp.trim());
    const zones = args.zones.filter(Boolean);
    const items = args.items.filter(Boolean);
    const services = args.services.filter(Boolean);

    if (!name || !city || !phone || !whatsapp) {
      throw new Error("Nom, ville, téléphone et WhatsApp sont obligatoires.");
    }
    if (types.length === 0) {
      throw new Error("Sélectionnez au moins un type d'activité.");
    }

    const now = Date.now();
    await ctx.db.patch(supplier._id, {
      name,
      type: types.join(", "),
      types,
      city,
      zones,
      phone,
      whatsapp,
      items,
      services,
      profileComplete: true,
      updatedAt: now,
    });

    await ctx.db.patch(staff._id, {
      name,
      updatedAt: now,
    });

    return supplier._id;
  },
});
