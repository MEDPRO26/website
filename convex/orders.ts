import { internalMutation, mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission, requireAdminStaff } from "./lib/authz";
import { createOrderRecord } from "./lib/createOrder";
import { appendOrderEvent } from "./lib/orderEvents";
import { formatStatusChange } from "./lib/orderStatus";
import { parseRentalDurationMs } from "./lib/rentalDates";
import { upsertSupplierQuote } from "./lib/submitSupplierQuote";
import { pushNotification } from "./lib/notifications";
import { logAudit } from "./lib/auditLog";
import {
  buildDefaultOfferMessage,
} from "./lib/pricing";
import { getQuotePricing } from "./lib/quotePricing";
import { orderStatusValidator } from "./validators";

const submitFromWebsiteArgs = {
  client: v.string(),
  phone: v.string(),
  email: v.optional(v.string()),
  city: v.string(),
  district: v.optional(v.string()),
  type: v.string(),
  item: v.string(),
  message: v.optional(v.string()),
  pagePath: v.optional(v.string()),
  source: v.optional(v.string()),
};

export const submitFromWebsite = mutation({
  args: submitFromWebsiteArgs,
  handler: async (ctx, args) => {
    return await createOrderRecord(ctx, {
      client: args.client,
      phone: args.phone,
      email: args.email,
      city: args.city,
      district: args.district,
      type: args.type,
      item: args.item,
      message: args.message,
      pagePath: args.pagePath,
      source: args.source?.trim() || "Formulaire site",
      createdLabel: "Commande créée via le site",
    });
  },
});

export const createManual = mutation({
  args: {
    source: v.string(),
    client: v.string(),
    phone: v.string(),
    whatsapp: v.optional(v.string()),
    email: v.optional(v.string()),
    city: v.string(),
    district: v.optional(v.string()),
    address: v.optional(v.string()),
    type: v.string(),
    item: v.string(),
    duration: v.optional(v.string()),
    desiredDate: v.optional(v.string()),
    slot: v.optional(v.string()),
    message: v.optional(v.string()),
    assignToSelf: v.optional(v.boolean()),
    assignedStaffId: v.optional(v.id("staff")),
    supplierId: v.optional(v.id("suppliers")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdminPermission(ctx, "orders.create_manual");

    let assignedStaffId = args.assignedStaffId;
    if (args.assignToSelf) {
      assignedStaffId = actor._id;
    }

    if (assignedStaffId) {
      const assignee = await ctx.db.get(assignedStaffId);
      if (!assignee || assignee.status !== "actif") {
        throw new Error("Assistant introuvable ou inactif.");
      }
    }

    if (args.supplierId) {
      const supplier = await ctx.db.get(args.supplierId);
      if (!supplier) {
        throw new Error("Fournisseur introuvable.");
      }
      if (supplier.status !== "actif") {
        throw new Error("Ce fournisseur n'est pas actif.");
      }
    }

    const result = await createOrderRecord(ctx, {
      client: args.client,
      phone: args.phone,
      whatsapp: args.whatsapp,
      email: args.email,
      city: args.city,
      district: args.district,
      address: args.address,
      type: args.type,
      item: args.item,
      duration: args.duration,
      desiredDate: args.desiredDate,
      slot: args.slot,
      message: args.message,
      source: args.source,
      assignedStaffId,
      actorStaffId: actor._id,
      createdLabel: `Commande créée manuellement (${args.source.trim()})`,
    });

    if (args.supplierId) {
      const order = await ctx.db.get(result.orderId);
      if (order) {
        const supplier = await ctx.db.get(args.supplierId);
        const shouldSend = ["nouvelle", "a_qualifier", "a_affecter"].includes(
          order.status
        );

        await ctx.db.patch(result.orderId, {
          supplierId: args.supplierId,
          status: shouldSend ? "envoyee_fournisseur" : order.status,
          updatedAt: Date.now(),
        });

        await appendOrderEvent(ctx, {
          orderId: result.orderId,
          type: "system",
          label: `Envoyée au fournisseur ${supplier?.name ?? ""}`,
          actorStaffId: actor._id,
        });

        if (shouldSend) {
          await appendOrderEvent(ctx, {
            orderId: result.orderId,
            type: "status_change",
            label: formatStatusChange(order.status, "envoyee_fournisseur"),
            fromStatus: order.status,
            toStatus: "envoyee_fournisseur",
            actorStaffId: actor._id,
          });
        }

        await pushNotification(ctx, {
          type: "supplier",
          title: `Commande envoyée à ${supplier?.name ?? "fournisseur"}`,
          description: result.ref,
          link: `/admin/orders/${result.orderId}`,
          entityId: result.orderId,
        });
      }
    }

    if (args.conversationId) {
      const conversation = await ctx.db.get(args.conversationId);
      if (conversation) {
        const order = await ctx.db.get(result.orderId);
        await ctx.db.patch(args.conversationId, {
          customerId: conversation.customerId ?? order?.customerId,
          status: "en_cours",
          updatedAt: Date.now(),
        });
      }
    }

    return result;
  },
});

export const list = query({
  args: {
    status: v.optional(orderStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const orders = args.status
      ? await ctx.db
          .query("orders")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("orders").collect();

    const enriched = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        const assignedStaff = order.assignedStaffId
          ? await ctx.db.get(order.assignedStaffId)
          : null;
        const supplier = order.supplierId
          ? await ctx.db.get(order.supplierId)
          : null;

        return {
          ...order,
          customer,
          assignedStaffName: assignedStaff?.name ?? null,
          supplierName: supplier?.name ?? null,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const search = query({
  args: { q: v.string() },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const q = args.q.trim().toLowerCase();
    if (q.length < 2) {
      return [];
    }

    const orders = await ctx.db.query("orders").collect();
    const matches: Array<{
      _id: (typeof orders)[0]["_id"];
      ref: string;
      status: string;
      item: string;
      clientName: string;
    }> = [];

    for (const order of orders) {
      if (!order.ref.toLowerCase().includes(q)) {
        continue;
      }
      const customer = await ctx.db.get(order.customerId);
      matches.push({
        _id: order._id,
        ref: order.ref,
        status: order.status,
        item: order.item,
        clientName: customer?.name ?? "—",
      });
      if (matches.length >= 15) {
        break;
      }
    }

    return matches;
  },
});

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const order = await ctx.db.get(args.id);
    if (!order) {
      return null;
    }

    const customer = await ctx.db.get(order.customerId);
    const assignedStaff = order.assignedStaffId
      ? await ctx.db.get(order.assignedStaffId)
      : null;
    const supplier = order.supplierId
      ? await ctx.db.get(order.supplierId)
      : null;
    const events = await ctx.db
      .query("orderEvents")
      .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
      .collect();

    return {
      order,
      customer,
      assignedStaff,
      supplier,
      events: events.sort((a, b) => a.createdAt - b.createdAt),
    };
  },
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);

    const orders = await ctx.db.query("orders").collect();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const dayStart = startOfDay.getTime();

    const newToday = orders.filter((order) => order.createdAt >= dayStart).length;
    const confirmedStatuses = new Set([
      "acceptee",
      "planifiee",
      "en_cours",
      "location_active",
      "terminee",
    ]);
    const offerStatuses = new Set([
      "offre_envoyee",
      "acceptee",
      "planifiee",
      "en_cours",
      "location_active",
      "terminee",
    ]);

    return {
      total: orders.length,
      newToday,
      toAssign: orders.filter((order) => order.status === "a_affecter").length,
      nouvelle: orders.filter((order) => order.status === "nouvelle").length,
      offersSent: orders.filter((order) => offerStatuses.has(order.status)).length,
      confirmed: orders.filter((order) => confirmedStatuses.has(order.status)).length,
      activeRentals: orders.filter((order) => order.status === "location_active")
        .length,
      openComplaints: (await ctx.db.query("complaints").collect()).filter(
        (row) => row.status === "ouverte" || row.status === "en_traitement"
      ).length,
    };
  },
});

export const dashboardAnalytics = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);

    const orders = await ctx.db.query("orders").collect();
    const customers = await ctx.db.query("customers").collect();
    const customerById = new Map(customers.map((customer) => [customer._id, customer]));

    const orders7d: { day: string; count: number }[] = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - offset);
      const start = day.getTime();
      const end = start + 24 * 60 * 60 * 1000;
      orders7d.push({
        day: day.toLocaleDateString("fr-FR", { weekday: "short" }),
        count: orders.filter(
          (order) => order.createdAt >= start && order.createdAt < end
        ).length,
      });
    }

    const sourceCounts = new Map<string, number>();
    for (const order of orders) {
      const source = order.source.trim() || "Autre";
      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
    }

    const cityCounts = new Map<string, number>();
    for (const order of orders) {
      const customer = customerById.get(order.customerId);
      const city = customer?.city?.trim() || "Autre";
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    }

    const typeCounts = new Map<string, number>();
    for (const order of orders) {
      const type = order.type.trim() || "Autre";
      typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
    }

    const toChart = (entries: Map<string, number>, key: "name" | "city") =>
      [...entries.entries()]
        .map(([label, count]) =>
          key === "city" ? { city: label, count } : { name: label, value: count }
        )
        .sort((a, b) => {
          const left = ("count" in a ? a.count : a.value) ?? 0;
          const right = ("count" in b ? b.count : b.value) ?? 0;
          return right - left;
        })
        .slice(0, 8);

    const pendingSupplierOrders = orders.filter((order) =>
      ["envoyee_fournisseur", "vue_fournisseur"].includes(order.status)
    );
    const supplierIds = [...new Set(pendingSupplierOrders.map((o) => o.supplierId).filter(Boolean))];
    const suppliersToFollowUp = await Promise.all(
      supplierIds.slice(0, 5).map(async (supplierId) => {
        const supplier = await ctx.db.get(supplierId!);
        const pending = pendingSupplierOrders.filter(
          (order) => order.supplierId === supplierId
        ).length;
        return supplier
          ? {
              id: supplier._id,
              name: supplier.name,
              type: supplier.type,
              city: supplier.city,
              pending,
            }
          : null;
      })
    );

    return {
      orders7d,
      bySource: toChart(sourceCounts, "name"),
      byCity: toChart(cityCounts, "city"),
      byType: toChart(typeCounts, "name"),
      suppliersToFollowUp: suppliersToFollowUp.filter(Boolean),
      chartTotal7d: orders7d.reduce((sum, row) => sum + row.count, 0),
    };
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: orderStatusValidator,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "orders.update_status");
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Commande introuvable.");
    }
    if (order.status === args.status) {
      throw new Error("La commande a déjà ce statut.");
    }

    const now = Date.now();
    const patch: {
      status: typeof args.status;
      updatedAt: number;
      rentalStartAt?: number;
      rentalEndAt?: number;
      rentalEndingNotifiedAt?: undefined;
    } = {
      status: args.status,
      updatedAt: now,
    };

    if (args.status === "location_active" && order.status !== "location_active") {
      const rentalStartAt = now;
      const durationMs = parseRentalDurationMs(order.duration);
      patch.rentalStartAt = rentalStartAt;
      if (durationMs) {
        patch.rentalEndAt = rentalStartAt + durationMs;
        patch.rentalEndingNotifiedAt = undefined;
      }
    }

    await ctx.db.patch(args.orderId, patch);

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "status_change",
      label: formatStatusChange(order.status, args.status),
      fromStatus: order.status,
      toStatus: args.status,
      actorStaffId: staff._id,
    });

    const note = args.note?.trim();
    if (note) {
      await appendOrderEvent(ctx, {
        orderId: args.orderId,
        type: "note",
        label: note,
        actorStaffId: staff._id,
      });
    }

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "status_change",
      entityType: "order",
      entityId: args.orderId,
      entityLabel: order.ref,
      fromValue: order.status,
      toValue: args.status,
    });
  },
});

export const assignStaff = mutation({
  args: {
    orderId: v.id("orders"),
    staffId: v.optional(v.id("staff")),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdminPermission(ctx, "orders.update_status");
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Commande introuvable.");
    }

    let assigneeName: string | null = null;
    if (args.staffId) {
      const assignee = await ctx.db.get(args.staffId);
      if (!assignee || assignee.status !== "actif") {
        throw new Error("Assistant introuvable ou inactif.");
      }
      assigneeName = assignee.name;
    }

    await ctx.db.patch(args.orderId, {
      assignedStaffId: args.staffId,
      updatedAt: Date.now(),
    });

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "assignment",
      label: assigneeName
        ? `Affectée à ${assigneeName}`
        : "Affectation retirée",
      actorStaffId: actor._id,
    });

    await logAudit(ctx, {
      actorStaffId: actor._id,
      actorName: actor.name,
      action: "update",
      entityType: "order",
      entityId: args.orderId,
      entityLabel: order.ref,
      toValue: assigneeName ?? "unassigned",
    });
  },
});

export const addNote = mutation({
  args: {
    orderId: v.id("orders"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "orders.update_status");
    const note = args.note.trim();
    if (!note) {
      throw new Error("La note ne peut pas être vide.");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Commande introuvable.");
    }

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "note",
      label: note,
      actorStaffId: staff._id,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "order",
      entityId: args.orderId,
      entityLabel: order.ref,
      toValue: "note",
    });
  },
});

export const assignSupplier = mutation({
  args: {
    orderId: v.id("orders"),
    supplierId: v.optional(v.id("suppliers")),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdminPermission(ctx, "orders.assign_supplier");
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Commande introuvable.");
    }

    let supplierName: string | null = null;
    if (args.supplierId) {
      const supplier = await ctx.db.get(args.supplierId);
      if (!supplier) {
        throw new Error("Fournisseur introuvable.");
      }
      if (supplier.status !== "actif") {
        throw new Error("Ce fournisseur n'est pas actif.");
      }
      supplierName = supplier.name;
    }

    const shouldSend =
      Boolean(args.supplierId) &&
      ["nouvelle", "a_qualifier", "a_affecter"].includes(order.status);

    await ctx.db.patch(args.orderId, {
      supplierId: args.supplierId,
      status: shouldSend ? "envoyee_fournisseur" : order.status,
      updatedAt: Date.now(),
    });

    await appendOrderEvent(ctx, {
      orderId: args.orderId,
      type: "system",
      label: supplierName
        ? `Envoyée au fournisseur ${supplierName}`
        : "Fournisseur retiré",
      actorStaffId: actor._id,
    });

    if (shouldSend) {
      await appendOrderEvent(ctx, {
        orderId: args.orderId,
        type: "status_change",
        label: formatStatusChange(order.status, "envoyee_fournisseur"),
        fromStatus: order.status,
        toStatus: "envoyee_fournisseur",
        actorStaffId: actor._id,
      });
    }

    if (args.supplierId && supplierName) {
      await pushNotification(ctx, {
        type: "supplier",
        title: `Commande envoyée à ${supplierName}`,
        description: order.ref,
        link: `/admin/orders/${args.orderId}`,
        entityId: args.orderId,
      });
    }

    await logAudit(ctx, {
      actorStaffId: actor._id,
      actorName: actor.name,
      action: "update",
      entityType: "order",
      entityId: args.orderId,
      entityLabel: order.ref,
      toValue: supplierName ?? "removed",
    });
  },
});

/** Dev smoke test — runs create → assign → quote → offer without auth. */
export const smokeTestFlow = internalMutation({
  args: {},
  handler: async (ctx) => {
    const supplier = (await ctx.db.query("suppliers").collect()).find(
      (row) => row.status === "actif"
    );
    if (!supplier) {
      throw new Error("Aucun fournisseur actif pour le test.");
    }

    const adminStaff =
      (await ctx.db.query("staff").collect()).find((row) =>
        ["super_admin", "admin", "assistant"].includes(row.role)
      ) ?? null;

    const stamp = Date.now();
    const { orderId, ref } = await createOrderRecord(ctx, {
      client: "Client Test E2E",
      phone: `06${String(stamp).slice(-8)}`,
      city: "Agadir",
      district: "Talborjt",
      type: "Location matériel médical",
      item: "Lit médicalisé électrique",
      message: "Test automatique du flux commande",
      source: "Test E2E",
      assignedStaffId: adminStaff?._id,
      actorStaffId: adminStaff?._id,
      createdLabel: "Commande test E2E",
    });

    const now = Date.now();
    const orderAfterCreate = await ctx.db.get(orderId);
    const previousStatus = orderAfterCreate?.status ?? "nouvelle";

    await ctx.db.patch(orderId, {
      supplierId: supplier._id,
      status: "envoyee_fournisseur",
      updatedAt: now,
    });
    await appendOrderEvent(ctx, {
      orderId,
      type: "system",
      label: `Envoyée au fournisseur ${supplier.name}`,
      actorStaffId: adminStaff?._id,
    });
    await appendOrderEvent(ctx, {
      orderId,
      type: "status_change",
      label: formatStatusChange(previousStatus, "envoyee_fournisseur"),
      fromStatus: previousStatus,
      toStatus: "envoyee_fournisseur",
      actorStaffId: adminStaff?._id,
    });

    await upsertSupplierQuote(ctx, {
      orderId,
      supplierId: supplier._id,
      basePrice: 3500,
      deliveryFee: 200,
      installFee: 150,
      otherFee: 0,
      commissionPct: 0,
      commissionAmount: 500,
      notes: "Prix test E2E",
      actorStaffId: adminStaff?._id,
      submittedBySupplier: true,
    });

    const quote = await ctx.db
      .query("orderSupplierQuotes")
      .withIndex("by_orderId_supplierId", (q) =>
        q.eq("orderId", orderId).eq("supplierId", supplier._id)
      )
      .unique();
    if (!quote) {
      throw new Error("Devis test introuvable.");
    }

    const order = await ctx.db.get(orderId);
    const customer = order ? await ctx.db.get(order.customerId) : null;
    const pricing = getQuotePricing(quote);

    const offerId = await ctx.db.insert("clientOffers", {
      orderId,
      quoteId: quote._id,
      supplierTotal: pricing.supplierTotal,
      commissionPct: pricing.commissionPct,
      commissionAmount: pricing.commissionAmount,
      finalPrice: pricing.finalPrice,
      message: buildDefaultOfferMessage({
        clientFirstName: customer?.name.split(" ")[0] ?? "client",
        requestType: order?.type ?? "Location matériel médical",
        item: order?.item ?? "Lit médicalisé",
        duration: order?.duration,
        finalPrice: pricing.finalPrice,
        desiredDate: order?.desiredDate,
        slot: order?.slot,
      }),
      status: "sent",
      createdByStaffId: adminStaff?._id,
      sentAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(orderId, {
      status: "offre_envoyee",
      updatedAt: now,
    });
    await appendOrderEvent(ctx, {
      orderId,
      type: "status_change",
      label: formatStatusChange("prix_recu", "offre_envoyee"),
      fromStatus: "prix_recu",
      toStatus: "offre_envoyee",
      actorStaffId: adminStaff?._id,
    });
    await appendOrderEvent(ctx, {
      orderId,
      type: "offer",
      label: `Offre client envoyée · ${pricing.finalPrice.toLocaleString("fr-FR")} MAD`,
      actorStaffId: adminStaff?._id,
    });

    return {
      orderId,
      ref,
      supplierName: supplier.name,
      offerId,
      finalPrice: pricing.finalPrice,
      commissionAmount: pricing.commissionAmount,
      adminUrl: `/admin/orders/${orderId}`,
      supplierUrl: `/supplier/orders/${orderId}`,
    };
  },
});

async function deleteOrderRecord(ctx: MutationCtx, orderId: Id<"orders">) {
  const order = await ctx.db.get(orderId);
  if (!order) {
    throw new Error("Commande introuvable.");
  }

  const events = await ctx.db
    .query("orderEvents")
    .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
    .collect();
  for (const event of events) {
    await ctx.db.delete(event._id);
  }

  const offers = await ctx.db
    .query("clientOffers")
    .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
    .collect();
  for (const offer of offers) {
    await ctx.db.delete(offer._id);
  }

  const quotes = await ctx.db
    .query("orderSupplierQuotes")
    .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
    .collect();
  for (const quote of quotes) {
    await ctx.db.delete(quote._id);
  }

  const complaints = await ctx.db
    .query("complaints")
    .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
    .collect();
  for (const complaint of complaints) {
    await ctx.db.delete(complaint._id);
  }

  await ctx.db.delete(orderId);

  const customer = await ctx.db.get(order.customerId);
  if (customer) {
    const remainingOrders = await ctx.db
      .query("orders")
      .withIndex("by_customerId", (q) => q.eq("customerId", order.customerId))
      .collect();

    await ctx.db.patch(order.customerId, {
      ordersCount: remainingOrders.length,
      lastOrderAt:
        remainingOrders.length > 0
          ? Math.max(...remainingOrders.map((row) => row.createdAt))
          : undefined,
      updatedAt: Date.now(),
    });
  }

  return order;
}

export const remove = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "orders.delete");
    const order = await deleteOrderRecord(ctx, args.id);

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "delete",
      entityType: "order",
      entityId: args.id,
      entityLabel: order.ref,
    });

    return { deleted: true as const, ref: order.ref };
  },
});
