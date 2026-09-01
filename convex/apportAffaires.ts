import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  DEFAULT_APPORT_RATE_SETTINGS,
  normalizeApportRateSettings,
} from "../lib/apport-affaires";
import { requireAdminStaff, requireApportViewer } from "./lib/authz";

function isEmptyRow(args: {
  date?: string;
  client: string;
  phone?: string;
  contractAmount?: number;
  commissionDue?: number | null;
  customRate?: number | null;
  depositReceived: number;
  observation?: string;
}) {
  return (
    !args.date?.trim() &&
    !args.client.trim() &&
    !args.phone?.trim() &&
    (args.contractAmount == null || args.contractAmount === 0) &&
    (args.commissionDue == null || args.commissionDue === 0) &&
    args.customRate == null &&
    args.depositReceived === 0 &&
    !args.observation?.trim()
  );
}

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    await requireApportViewer(ctx);
    const existing = await ctx.db
      .query("apportSettings")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (!existing) {
      return DEFAULT_APPORT_RATE_SETTINGS;
    }
    const settings = normalizeApportRateSettings(existing);
    // Legacy auto defaults (7% / 5% / 3%) — clear so rates are entered manually.
    const isLegacyAutoDefault =
      settings.lowRate === 0.07 &&
      settings.midRate === 0.05 &&
      settings.highRate === 0.03;
    if (isLegacyAutoDefault) {
      return {
        ...settings,
        lowRate: null,
        midRate: null,
        highRate: null,
      };
    }
    return settings;
  },
});

export const saveSettings = mutation({
  args: {
    lowMax: v.number(),
    lowRate: v.union(v.number(), v.null()),
    midMax: v.number(),
    midRate: v.union(v.number(), v.null()),
    highRate: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const settings = normalizeApportRateSettings(args);
    const now = Date.now();
    const existing = await ctx.db
      .query("apportSettings")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    const doc = {
      key: "default" as const,
      lowMax: settings.lowMax,
      midMax: settings.midMax,
      ...(settings.lowRate != null ? { lowRate: settings.lowRate } : {}),
      ...(settings.midRate != null ? { midRate: settings.midRate } : {}),
      ...(settings.highRate != null ? { highRate: settings.highRate } : {}),
      updatedAt: now,
      updatedBy: staff._id,
    };
    if (existing) {
      await ctx.db.replace(existing._id, doc);
      return settings;
    }
    await ctx.db.insert("apportSettings", doc);
    return settings;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await requireApportViewer(ctx);
    const rows =
      viewer.kind === "admin"
        ? await ctx.db.query("apportDeals").collect()
        : await ctx.db
            .query("apportDeals")
            .withIndex("by_apporteurId", (q) =>
              q.eq("apporteurId", viewer.apporteurId!)
            )
            .collect();

    const sorted = rows.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.createdAt - b.createdAt
    );

    return await Promise.all(
      sorted.map(async (row) => {
        const staff = await ctx.db.get(row.createdBy);
        let authorName =
          staff?.name?.trim() || staff?.email?.trim() || "";
        if (row.apporteurId) {
          const apporteur = await ctx.db.get(row.apporteurId);
          const label =
            apporteur?.name?.trim() || apporteur?.email?.trim() || "";
          if (label) authorName = label;
        }
        return { ...row, authorName: authorName || "—" };
      })
    );
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("apportDeals")),
    date: v.optional(v.string()),
    client: v.string(),
    phone: v.optional(v.string()),
    contractAmount: v.optional(v.number()),
    commissionDue: v.optional(v.union(v.number(), v.null())),
    depositReceived: v.optional(v.number()),
    observation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const viewer = await requireApportViewer(ctx);
    const now = Date.now();
    const date = args.date?.trim() || undefined;
    const client = args.client.trim();
    const phone = args.phone?.trim() || undefined;
    const isApporteur = viewer.kind === "apporteur";
    const observation = args.observation?.trim() || undefined;
    const hasCommissionDueArg = args.commissionDue !== undefined;
    const commissionDue =
      args.commissionDue == null
        ? undefined
        : !Number.isFinite(args.commissionDue) || args.commissionDue < 0
          ? undefined
          : Math.round(args.commissionDue);
    if (
      hasCommissionDueArg &&
      args.commissionDue != null &&
      (!Number.isFinite(args.commissionDue) || args.commissionDue < 0)
    ) {
      throw new Error("Commission due invalide.");
    }
    const depositReceived = isApporteur ? 0 : (args.depositReceived ?? 0);

    const payload = {
      date,
      client,
      phone,
      contractAmount: args.contractAmount,
      commissionDue: hasCommissionDueArg ? commissionDue : undefined,
      depositReceived,
      observation,
    };

    if (args.id) {
      const existing = await ctx.db.get(args.id);
      if (!existing) {
        throw new Error("Ligne introuvable.");
      }
      if (
        isApporteur &&
        existing.apporteurId &&
        existing.apporteurId !== viewer.apporteurId
      ) {
        throw new Error("Vous ne pouvez modifier que vos propres affaires.");
      }
      const nextCommissionDue = hasCommissionDueArg
        ? commissionDue
        : existing.commissionDue;
      if (
        isEmptyRow({
          ...payload,
          commissionDue: nextCommissionDue ?? null,
          customRate: existing.customRate ?? null,
          depositReceived: isApporteur
            ? existing.depositReceived
            : depositReceived,
        })
      ) {
        await ctx.db.delete(args.id);
        return { id: null, deleted: true };
      }

      const apporteurId =
        existing.apporteurId ??
        (isApporteur ? viewer.apporteurId : undefined) ??
        undefined;

      await ctx.db.replace(args.id, {
        date,
        client,
        ...(phone ? { phone } : {}),
        contractAmount: args.contractAmount,
        ...(hasCommissionDueArg
          ? commissionDue != null
            ? { commissionDue }
            : {}
          : existing.commissionDue != null
            ? { commissionDue: existing.commissionDue }
            : {}),
        ...(apporteurId ? { apporteurId } : {}),
        ...(existing.demandeId ? { demandeId: existing.demandeId } : {}),
        depositReceived: isApporteur
          ? existing.depositReceived
          : depositReceived,
        observation,
        sortOrder: existing.sortOrder,
        createdBy: existing.createdBy,
        createdAt: existing.createdAt,
        updatedAt: now,
      });
      return { id: args.id, deleted: false };
    }

    if (
      isEmptyRow({
        ...payload,
        commissionDue: commissionDue ?? null,
        customRate: null,
        depositReceived,
      })
    ) {
      return { id: null, deleted: false };
    }

    const id = await ctx.db.insert("apportDeals", {
      date,
      client,
      ...(phone ? { phone } : {}),
      contractAmount: args.contractAmount,
      ...(commissionDue != null ? { commissionDue } : {}),
      ...(isApporteur && viewer.apporteurId
        ? { apporteurId: viewer.apporteurId }
        : {}),
      depositReceived,
      observation,
      sortOrder: now,
      createdBy: viewer.staff._id,
      createdAt: now,
      updatedAt: now,
    });
    return { id, deleted: false };
  },
});

export const remove = mutation({
  args: { id: v.id("apportDeals") },
  handler: async (ctx, args) => {
    const viewer = await requireApportViewer(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) return;
    if (
      viewer.kind === "apporteur" &&
      existing.apporteurId !== viewer.apporteurId
    ) {
      throw new Error("Vous ne pouvez supprimer que vos propres affaires.");
    }
    await ctx.db.delete(args.id);
  },
});
