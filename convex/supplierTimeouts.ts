import { internalMutation } from "./_generated/server";
import { appendOrderEvent } from "./lib/orderEvents";
import { notifyStaff } from "./lib/notifications";
import { logAudit } from "./lib/auditLog";

export const SUPPLIER_RESPONSE_DEADLINE_MS = 30 * 60 * 1000;

const PENDING_ASSIGNMENT_STATUSES = [
  "envoyee_fournisseur",
] as const;

/**
 * Resets orders back to "nouvelle" when the assigned supplier does not submit a
 * price within the 30 minute response window. Runs on a cron every minute.
 */
export const expireStaleAssignments = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let expired = 0;

    for (const status of PENDING_ASSIGNMENT_STATUSES) {
      const orders = await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();

      for (const order of orders) {
        if (!order.supplierId) {
          continue;
        }

        const quote = await ctx.db
          .query("orderSupplierQuotes")
          .withIndex("by_orderId_supplierId", (q) =>
            q.eq("orderId", order._id).eq("supplierId", order.supplierId!)
          )
          .unique();

        if (quote?.status === "submitted") {
          continue;
        }

        const events = await ctx.db
          .query("orderEvents")
          .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
          .collect();
        const assignedAt =
          events
            .filter((event) => event.toStatus === "envoyee_fournisseur")
            .sort((a, b) => b.createdAt - a.createdAt)[0]?.createdAt ??
          order.updatedAt;

        if (now - assignedAt < SUPPLIER_RESPONSE_DEADLINE_MS) {
          continue;
        }

        const supplier = await ctx.db.get(order.supplierId);
        const fromStatus = order.status;
        const customer = await ctx.db.get(order.customerId);

        const existingMissed = await ctx.db
          .query("supplierMissedOrders")
          .withIndex("by_orderId_supplierId", (q) =>
            q.eq("orderId", order._id).eq("supplierId", order.supplierId!)
          )
          .unique();

        if (!existingMissed) {
          await ctx.db.insert("supplierMissedOrders", {
            supplierId: order.supplierId,
            orderId: order._id,
            orderRef: order.ref,
            orderType: order.type,
            orderItem: order.item,
            city: customer?.city ?? "—",
            district: customer?.district,
            assignedAt,
            missedAt: now,
            createdAt: now,
          });
        }

        await ctx.db.patch(order._id, {
          status: "nouvelle",
          supplierId: undefined,
          updatedAt: now,
        });

        await appendOrderEvent(ctx, {
          orderId: order._id,
          type: "status_change",
          label: `Délai dépassé — ${supplier?.name ?? "le fournisseur"} n'a pas répondu dans les 30 min. Commande remise en nouvelle demande.`,
          fromStatus,
          toStatus: "nouvelle",
        });

        await notifyStaff(ctx, "supplier_response", {
          type: "order",
          title: `Délai fournisseur dépassé — ${order.ref}`,
          description: `${supplier?.name ?? "Le fournisseur"} n'a pas répondu en 30 min · commande remise en nouvelle demande`,
          link: `/admin/orders/${order._id}`,
          entityId: order._id,
        });

        await logAudit(ctx, {
          actorName: "Système (délai fournisseur)",
          action: "status_change",
          entityType: "order",
          entityId: order._id,
          entityLabel: order.ref,
          fromValue: fromStatus,
          toValue: "nouvelle",
        });

        expired += 1;
      }
    }

    return { expired };
  },
});

/**
 * Backfills supplierMissedOrders from CRM order history (for expiries that
 * happened before missed-order records were introduced).
 */
export const backfillMissedOrdersFromHistory = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allEvents = await ctx.db.query("orderEvents").collect();
    const suppliers = await ctx.db.query("suppliers").collect();

    const expiryEvents = allEvents.filter(
      (event) =>
        event.toStatus === "nouvelle" &&
        event.label.includes("Délai dépassé") &&
        event.label.includes("n'a pas répondu")
    );

    let created = 0;

    for (const expiryEvent of expiryEvents) {
      const order = await ctx.db.get(expiryEvent.orderId);
      if (!order) {
        continue;
      }

      const nameMatch = expiryEvent.label.match(
        /^Délai dépassé — (.+?) n'a pas répondu/
      );
      const supplierName = nameMatch?.[1]?.trim();
      if (!supplierName || supplierName === "le fournisseur") {
        continue;
      }

      const supplier = suppliers.find((row) => row.name === supplierName);
      if (!supplier) {
        continue;
      }

      const existing = await ctx.db
        .query("supplierMissedOrders")
        .withIndex("by_orderId_supplierId", (q) =>
          q.eq("orderId", order._id).eq("supplierId", supplier._id)
        )
        .unique();
      if (existing) {
        continue;
      }

      const orderEvents = allEvents
        .filter((event) => event.orderId === order._id)
        .sort((a, b) => a.createdAt - b.createdAt);

      const assignmentEvents = orderEvents.filter(
        (event) =>
          event.toStatus === "envoyee_fournisseur" &&
          event.createdAt <= expiryEvent.createdAt
      );
      const assignedAt =
        assignmentEvents[assignmentEvents.length - 1]?.createdAt ??
        expiryEvent.createdAt - SUPPLIER_RESPONSE_DEADLINE_MS;

      const customer = await ctx.db.get(order.customerId);
      const now = Date.now();

      await ctx.db.insert("supplierMissedOrders", {
        supplierId: supplier._id,
        orderId: order._id,
        orderRef: order.ref,
        orderType: order.type,
        orderItem: order.item,
        city: customer?.city ?? "—",
        district: customer?.district,
        assignedAt,
        missedAt: expiryEvent.createdAt,
        createdAt: now,
      });

      created += 1;
    }

    return { created };
  },
});

export const cleanupOrphanMissedOrders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const missedOrders = await ctx.db.query("supplierMissedOrders").collect();
    let deleted = 0;

    for (const missed of missedOrders) {
      const order = await ctx.db.get(missed.orderId);
      if (order) {
        continue;
      }

      await ctx.db.delete(missed._id);
      deleted += 1;
    }

    return { deleted };
  },
});
