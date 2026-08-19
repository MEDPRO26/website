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
  contractAmount?: number;
  customRate?: number | null;
  depositReceived: number;
  observation?: string;
}) {
  return (
    !args.date?.trim() &&
    !args.client.trim() &&
    (args.contractAmount == null || args.contractAmount === 0) &&
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
    return normalizeApportRateSettings(existing);
  },
});

export const saveSettings = mutation({
  args: {
    lowMax: v.number(),
    lowRate: v.number(),
    midMax: v.number(),
    midRate: v.number(),
    highRate: v.number(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const settings = normalizeApportRateSettings(args);
    const now = Date.now();
    const existing = await ctx.db
      .query("apportSettings")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...settings,
        updatedAt: now,
        updatedBy: staff._id,
      });
      return settings;
    }
    await ctx.db.insert("apportSettings", {
      key: "default",
      ...settings,
      updatedAt: now,
      updatedBy: staff._id,
    });
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
    return rows.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.createdAt - b.createdAt
    );
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("apportDeals")),
    date: v.optional(v.string()),
    client: v.string(),
    contractAmount: v.optional(v.number()),
    customRate: v.optional(v.union(v.number(), v.null())),
    depositReceived: v.optional(v.number()),
    observation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const viewer = await requireApportViewer(ctx);
    const now = Date.now();
    const date = args.date?.trim() || undefined;
    const client = args.client.trim();
    const isApporteur = viewer.kind === "apporteur";
    const observation = args.observation?.trim() || undefined;
    const customRate = isApporteur
      ? undefined
      : args.customRate == null
        ? undefined
        : Math.min(1, Math.max(0, args.customRate));
    const depositReceived = isApporteur ? 0 : (args.depositReceived ?? 0);

    const payload = {
      date,
      client,
      contractAmount: args.contractAmount,
      customRate,
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
        existing.apporteurId !== viewer.apporteurId
      ) {
        throw new Error("Vous ne pouvez modifier que vos propres affaires.");
      }
      if (isEmptyRow({ ...payload, depositReceived })) {
        await ctx.db.delete(args.id);
        return { id: null, deleted: true };
      }
      await ctx.db.replace(args.id, {
        date,
        client,
        contractAmount: args.contractAmount,
        ...(isApporteur
          ? existing.customRate != null
            ? { customRate: existing.customRate }
            : {}
          : customRate != null
            ? { customRate }
            : {}),
        ...(existing.apporteurId
          ? { apporteurId: existing.apporteurId }
          : isApporteur && viewer.apporteurId
            ? { apporteurId: viewer.apporteurId }
            : {}),
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

    if (isEmptyRow({ ...payload, depositReceived })) {
      return { id: null, deleted: false };
    }

    const id = await ctx.db.insert("apportDeals", {
      date,
      client,
      contractAmount: args.contractAmount,
      ...(customRate != null ? { customRate } : {}),
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
