import { query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdminPermission } from "./lib/authz";

const ONLINE_THRESHOLD_MS = 60_000;
const FAST_CLAIM_MS = 5 * 60 * 1000;

type SupplierAccumulator = {
  supplierId: Id<"suppliers">;
  claims: number;
  fastClaims: number;
  responseTimes: number[];
  missed: number;
  delivered: number;
};

function emptySupplierStats(supplierId: Id<"suppliers">): SupplierAccumulator {
  return {
    supplierId,
    claims: 0,
    fastClaims: 0,
    responseTimes: [],
    missed: 0,
    delivered: 0,
  };
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function formatRelativeTime(ts: number, now: number) {
  const delta = now - ts;
  if (delta < 30_000) return "À l'instant";
  if (delta < 60_000) return "Il y a moins d'une minute";
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `Il y a ${hours} h`;
}

export const overview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "statistics.view");

    const now = Date.now();
    const onlineCutoff = now - ONLINE_THRESHOLD_MS;

    const [supplierSessions, visitorSessions, staffSessions] = await Promise.all([
      ctx.db
        .query("presenceSessions")
        .withIndex("by_kind_lastSeen", (q) =>
          q.eq("kind", "supplier").gt("lastSeenAt", onlineCutoff)
        )
        .collect(),
      ctx.db
        .query("presenceSessions")
        .withIndex("by_kind_lastSeen", (q) =>
          q.eq("kind", "visitor").gt("lastSeenAt", onlineCutoff)
        )
        .collect(),
      ctx.db
        .query("presenceSessions")
        .withIndex("by_kind_lastSeen", (q) =>
          q.eq("kind", "staff").gt("lastSeenAt", onlineCutoff)
        )
        .collect(),
    ]);

    const suppliers = await ctx.db.query("suppliers").collect();
    const supplierById = new Map(suppliers.map((supplier) => [supplier._id, supplier]));

    const supplierStaff = await ctx.db
      .query("staff")
      .withIndex("by_role", (q) => q.eq("role", "supplier"))
      .collect();
    const supplierIdByStaffId = new Map(
      supplierStaff
        .filter((row) => row.supplierId)
        .map((row) => [row._id, row.supplierId!])
    );

    const statsBySupplier = new Map<Id<"suppliers">, SupplierAccumulator>();
    for (const supplier of suppliers) {
      statsBySupplier.set(supplier._id, emptySupplierStats(supplier._id));
    }

    const orderEvents = await ctx.db.query("orderEvents").collect();
    const eventsByOrder = new Map<Id<"orders">, Doc<"orderEvents">[]>();
    for (const event of orderEvents) {
      const list = eventsByOrder.get(event.orderId) ?? [];
      list.push(event);
      eventsByOrder.set(event.orderId, list);
    }
    for (const list of eventsByOrder.values()) {
      list.sort((a, b) => a.createdAt - b.createdAt);
    }

    for (const events of eventsByOrder.values()) {
      for (const event of events) {
        if (
          event.toStatus !== "vue_fournisseur" ||
          event.fromStatus !== "envoyee_fournisseur" ||
          !event.actorStaffId
        ) {
          continue;
        }

        const supplierId = supplierIdByStaffId.get(event.actorStaffId);
        if (!supplierId) continue;

        const assignEvent = [...events]
          .filter(
            (row) =>
              row.createdAt <= event.createdAt &&
              row.toStatus === "envoyee_fournisseur"
          )
          .at(-1);

        if (!assignEvent) continue;

        const responseMs = event.createdAt - assignEvent.createdAt;
        const bucket = statsBySupplier.get(supplierId) ?? emptySupplierStats(supplierId);
        bucket.claims += 1;
        bucket.responseTimes.push(responseMs);
        if (responseMs <= FAST_CLAIM_MS) {
          bucket.fastClaims += 1;
        }
        statsBySupplier.set(supplierId, bucket);
      }
    }

    const missedOrders = await ctx.db.query("supplierMissedOrders").collect();
    for (const missed of missedOrders) {
      const bucket =
        statsBySupplier.get(missed.supplierId) ?? emptySupplierStats(missed.supplierId);
      bucket.missed += 1;
      statsBySupplier.set(missed.supplierId, bucket);
    }

    const completedOrders = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "terminee"))
      .collect();
    for (const order of completedOrders) {
      if (!order.supplierId) continue;
      const bucket =
        statsBySupplier.get(order.supplierId) ?? emptySupplierStats(order.supplierId);
      bucket.delivered += 1;
      statsBySupplier.set(order.supplierId, bucket);
    }

    const onlineSupplierIds = new Set(
      supplierSessions
        .map((session) => session.supplierId)
        .filter((id): id is Id<"suppliers"> => id !== undefined)
    );

    const supplierPerformance = suppliers
      .map((supplier) => {
        const bucket = statsBySupplier.get(supplier._id) ?? emptySupplierStats(supplier._id);
        const opportunities = bucket.claims + bucket.missed;
        const avgResponseMs = average(bucket.responseTimes);
        const responseRate =
          opportunities > 0 ? Math.round((bucket.claims / opportunities) * 100) : null;

        return {
          supplierId: supplier._id,
          name: supplier.name,
          city: supplier.city,
          status: supplier.status,
          isOnline: onlineSupplierIds.has(supplier._id),
          claims: bucket.claims,
          fastClaims: bucket.fastClaims,
          missed: bucket.missed,
          delivered: bucket.delivered,
          avgResponseMs,
          responseRate,
        };
      })
      .sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        if ((b.responseRate ?? -1) !== (a.responseRate ?? -1)) {
          return (b.responseRate ?? -1) - (a.responseRate ?? -1);
        }
        return a.name.localeCompare(b.name, "fr");
      });

    const visitorPages = new Map<string, number>();
    for (const session of visitorSessions) {
      const path = session.path ?? "/";
      visitorPages.set(path, (visitorPages.get(path) ?? 0) + 1);
    }

    return {
      generatedAt: now,
      online: {
        suppliers: supplierSessions.length,
        visitors: visitorSessions.length,
        staff: staffSessions.length,
      },
      onlineSuppliers: supplierSessions
        .map((session) => {
          const supplier = session.supplierId
            ? supplierById.get(session.supplierId)
            : undefined;
          return {
            sessionKey: session.sessionKey.slice(0, 8),
            name: session.label ?? supplier?.name ?? "Fournisseur",
            city: supplier?.city ?? "—",
            path: session.path ?? "—",
            lastSeenAt: session.lastSeenAt,
            lastSeenLabel: formatRelativeTime(session.lastSeenAt, now),
          };
        })
        .sort((a, b) => b.lastSeenAt - a.lastSeenAt),
      onlineVisitors: visitorSessions
        .map((session) => ({
          sessionKey: session.sessionKey.slice(0, 8),
          path: session.path ?? "/",
          lastSeenAt: session.lastSeenAt,
          lastSeenLabel: formatRelativeTime(session.lastSeenAt, now),
        }))
        .sort((a, b) => b.lastSeenAt - a.lastSeenAt),
      onlineStaff: staffSessions
        .map((session) => ({
          name: session.label ?? "Équipe CRM",
          path: session.path ?? "—",
          lastSeenAt: session.lastSeenAt,
          lastSeenLabel: formatRelativeTime(session.lastSeenAt, now),
        }))
        .sort((a, b) => b.lastSeenAt - a.lastSeenAt),
      topVisitorPages: [...visitorPages.entries()]
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      supplierPerformance,
      totals: {
        assignmentsResponded: supplierPerformance.reduce((sum, row) => sum + row.claims, 0),
        assignmentsMissed: supplierPerformance.reduce((sum, row) => sum + row.missed, 0),
        fastClaims: supplierPerformance.reduce((sum, row) => sum + row.fastClaims, 0),
        deliveries: supplierPerformance.reduce((sum, row) => sum + row.delivered, 0),
      },
    };
  },
});
