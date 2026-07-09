import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdminPermission } from "./lib/authz";
import { dateKeyInSiteTimezone } from "./presence";
import { formatVisitorLocation, isMorocco } from "../lib/visitor-geo";

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
          location: formatVisitorLocation(session),
          city: session.city ?? null,
          country: session.country ?? null,
          countryCode: session.countryCode ?? null,
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

const visitorGranularityValidator = v.union(
  v.literal("day"),
  v.literal("month"),
  v.literal("year")
);

function periodKey(dateKey: string, granularity: "day" | "month" | "year") {
  if (granularity === "day") return dateKey;
  if (granularity === "month") return dateKey.slice(0, 7);
  return dateKey.slice(0, 4);
}

function formatPeriodLabel(period: string, granularity: "day" | "month" | "year") {
  if (granularity === "year") return period;
  if (granularity === "month") {
    const [year, month] = period.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  }
  const date = new Date(`${period}T12:00:00`);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return dateKeyInSiteTimezone(date.getTime());
}

function addMonths(dateKey: string, months: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1 + months, day);
  return dateKeyInSiteTimezone(date.getTime());
}

function defaultVisitorRange(granularity: "day" | "month" | "year") {
  const today = dateKeyInSiteTimezone();
  if (granularity === "year") {
    const year = Number(today.slice(0, 4));
    return {
      startDate: `${year - 4}-01-01`,
      endDate: today,
    };
  }
  if (granularity === "month") {
    return {
      startDate: addMonths(today, -11).slice(0, 7) + "-01",
      endDate: today,
    };
  }
  return {
    startDate: addDays(today, -29),
    endDate: today,
  };
}

function buildPeriodSeries(
  startDate: string,
  endDate: string,
  granularity: "day" | "month" | "year"
) {
  const periods: string[] = [];
  if (granularity === "year") {
    const startYear = Number(startDate.slice(0, 4));
    const endYear = Number(endDate.slice(0, 4));
    for (let year = startYear; year <= endYear; year += 1) {
      periods.push(String(year));
    }
    return periods;
  }

  if (granularity === "month") {
    const [startYear, startMonth] = startDate.slice(0, 7).split("-").map(Number);
    const [endYear, endMonth] = endDate.slice(0, 7).split("-").map(Number);
    let cursor = new Date(startYear, startMonth - 1, 1);
    const end = new Date(endYear, endMonth - 1, 1);
    while (cursor <= end) {
      periods.push(
        `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`
      );
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    return periods;
  }

  let cursor = startDate;
  while (cursor <= endDate) {
    periods.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return periods;
}

export const visitorHistory = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    granularity: visitorGranularityValidator,
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "statistics.view");

    const defaults = defaultVisitorRange(args.granularity);
    const startDate = args.startDate ?? defaults.startDate;
    const endDate = args.endDate ?? defaults.endDate;

    if (startDate > endDate) {
      return {
        startDate,
        endDate,
        granularity: args.granularity,
        totalUniqueVisitors: 0,
        points: [] as { period: string; label: string; visitors: number }[],
      };
    }

    const rows = await ctx.db
      .query("visitorDailySessions")
      .withIndex("by_dateKey", (q) =>
        q.gte("dateKey", startDate).lte("dateKey", endDate)
      )
      .collect();

    const counts = new Map<string, number>();
    const sessionSets = new Map<string, Set<string>>();

    for (const row of rows) {
      const period = periodKey(row.dateKey, args.granularity);
      if (args.granularity === "day") {
        counts.set(period, (counts.get(period) ?? 0) + 1);
        continue;
      }

      const bucket = sessionSets.get(period) ?? new Set<string>();
      bucket.add(row.sessionKey);
      sessionSets.set(period, bucket);
    }

    if (args.granularity !== "day") {
      for (const [period, sessions] of sessionSets) {
        counts.set(period, sessions.size);
      }
    }

    const periods = buildPeriodSeries(startDate, endDate, args.granularity);
    const points = periods.map((period) => ({
      period,
      label: formatPeriodLabel(period, args.granularity),
      visitors: counts.get(period) ?? 0,
    }));

    const totalUniqueVisitors =
      args.granularity === "day"
        ? points.reduce((sum, point) => sum + point.visitors, 0)
        : new Set(rows.map((row) => row.sessionKey)).size;

    return {
      startDate,
      endDate,
      granularity: args.granularity,
      totalUniqueVisitors,
      points,
    };
  },
});

export const visitorLocations = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "statistics.view");

    const today = dateKeyInSiteTimezone();
    const startDate = args.startDate ?? addDays(today, -29);
    const endDate = args.endDate ?? today;

    if (startDate > endDate) {
      return {
        startDate,
        endDate,
        moroccoCities: [] as { city: string; visitors: number }[],
        abroad: [] as { location: string; visitors: number }[],
        totals: { morocco: 0, abroad: 0, unknown: 0 },
      };
    }

    const rows = await ctx.db
      .query("visitorDailySessions")
      .withIndex("by_dateKey", (q) =>
        q.gte("dateKey", startDate).lte("dateKey", endDate)
      )
      .collect();

    const moroccoCities = new Map<string, Set<string>>();
    const abroad = new Map<string, Set<string>>();
    const moroccoSessions = new Set<string>();
    const abroadSessions = new Set<string>();
    const unknownSessions = new Set<string>();

    for (const row of rows) {
      const code = row.countryCode?.toUpperCase();
      const city = row.city?.trim() || "Ville inconnue";

      if (!code && !row.city && !row.country) {
        unknownSessions.add(row.sessionKey);
        continue;
      }

      if (isMorocco(code)) {
        moroccoSessions.add(row.sessionKey);
        const bucket = moroccoCities.get(city) ?? new Set<string>();
        bucket.add(row.sessionKey);
        moroccoCities.set(city, bucket);
        continue;
      }

      abroadSessions.add(row.sessionKey);
      const location = formatVisitorLocation(row);
      const bucket = abroad.get(location) ?? new Set<string>();
      bucket.add(row.sessionKey);
      abroad.set(location, bucket);
    }

    return {
      startDate,
      endDate,
      moroccoCities: [...moroccoCities.entries()]
        .map(([city, sessions]) => ({ city, visitors: sessions.size }))
        .sort((a, b) => b.visitors - a.visitors),
      abroad: [...abroad.entries()]
        .map(([location, sessions]) => ({ location, visitors: sessions.size }))
        .sort((a, b) => b.visitors - a.visitors),
      totals: {
        morocco: moroccoSessions.size,
        abroad: abroadSessions.size,
        unknown: unknownSessions.size,
      },
    };
  },
});
