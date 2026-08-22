import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getStaffProfile,
  requireAdminPermission,
  requireApporteurStaff,
  requireSupplierOnboarding,
} from "./lib/authz";
import { resolveSupplierPartnerKind } from "../lib/supplier-activity-types";

export const vapidPublicKey = query({
  args: {},
  handler: async () => {
    return process.env.VAPID_PUBLIC_KEY?.trim() || null;
  },
});

export const myStatus = query({
  args: {},
  handler: async (ctx) => {
    const configured = Boolean(process.env.VAPID_PUBLIC_KEY?.trim());
    const staff = await getStaffProfile(ctx);
    if (!staff) {
      return { subscribed: false, count: 0, configured };
    }

    if (staff.role === "supplier" && staff.supplierId) {
      const subscriptions = await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", staff.supplierId!))
        .collect();
      return {
        subscribed: subscriptions.length > 0,
        count: subscriptions.length,
        configured,
      };
    }

    if (staff.role === "apporteur" && staff.apporteurId) {
      const subscriptions = await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_apporteurId", (q) =>
          q.eq("apporteurId", staff.apporteurId!)
        )
        .collect();
      return {
        subscribed: subscriptions.length > 0,
        count: subscriptions.length,
        configured,
      };
    }

    return { subscribed: false, count: 0, configured };
  },
});

export const saveSubscription = mutation({
  args: {
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await getStaffProfile(ctx);
    if (!staff || staff.status !== "actif") {
      throw new Error("Accès refusé.");
    }

    const endpoint = args.endpoint.trim();
    const p256dh = args.p256dh.trim();
    const auth = args.auth.trim();
    if (!endpoint || !p256dh || !auth) {
      throw new Error("Abonnement push invalide.");
    }

    let supplierId: typeof staff.supplierId | undefined;
    let apporteurId: typeof staff.apporteurId | undefined;

    if (staff.role === "supplier") {
      const { supplier } = await requireSupplierOnboarding(ctx);
      supplierId = supplier._id;
    } else if (staff.role === "apporteur") {
      const { apporteur } = await requireApporteurStaff(ctx);
      apporteurId = apporteur._id;
    } else {
      throw new Error("Notifications réservées aux partenaires S2MBO.");
    }

    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        supplierId,
        apporteurId,
        p256dh,
        auth,
        userAgent: args.userAgent?.trim() || existing.userAgent,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("pushSubscriptions", {
      ...(supplierId ? { supplierId } : {}),
      ...(apporteurId ? { apporteurId } : {}),
      endpoint,
      p256dh,
      auth,
      userAgent: args.userAgent?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const removeSubscription = mutation({
  args: {
    endpoint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await getStaffProfile(ctx);
    if (!staff || staff.status !== "actif") {
      throw new Error("Accès refusé.");
    }

    const owns = (sub: {
      supplierId?: typeof staff.supplierId;
      apporteurId?: typeof staff.apporteurId;
    }) => {
      if (staff.role === "supplier" && staff.supplierId) {
        return sub.supplierId === staff.supplierId;
      }
      if (staff.role === "apporteur" && staff.apporteurId) {
        return sub.apporteurId === staff.apporteurId;
      }
      return false;
    };

    if (args.endpoint?.trim()) {
      const existing = await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint!.trim()))
        .unique();
      if (existing && owns(existing)) {
        await ctx.db.delete(existing._id);
      }
      return;
    }

    if (staff.role === "supplier" && staff.supplierId) {
      const all = await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", staff.supplierId!))
        .collect();
      for (const sub of all) {
        await ctx.db.delete(sub._id);
      }
      return;
    }

    if (staff.role === "apporteur" && staff.apporteurId) {
      const all = await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_apporteurId", (q) =>
          q.eq("apporteurId", staff.apporteurId!)
        )
        .collect();
      for (const sub of all) {
        await ctx.db.delete(sub._id);
      }
    }
  },
});

export const assertAdminCanBroadcast = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "notifications.view");
    return null;
  },
});

export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "notifications.view");
    const subscriptions = await ctx.db.query("pushSubscriptions").collect();
    const suppliers = await ctx.db.query("suppliers").collect();
    const bySupplier = new Map(suppliers.map((s) => [s._id, s] as const));

    let materiel = 0;
    let soins = 0;
    let apporteurs = 0;
    const uniquePartners = new Set<string>();

    for (const sub of subscriptions) {
      if (sub.apporteurId) {
        uniquePartners.add(`a:${sub.apporteurId}`);
        apporteurs += 1;
        continue;
      }
      if (!sub.supplierId) continue;
      uniquePartners.add(`s:${sub.supplierId}`);
      const supplier = bySupplier.get(sub.supplierId);
      if (!supplier) continue;
      const kind =
        resolveSupplierPartnerKind(supplier) ??
        supplier.partnerKind ??
        "materiel";
      if (kind === "soins") soins += 1;
      else materiel += 1;
    }

    return {
      devices: subscriptions.length,
      partners: uniquePartners.size,
      materielDevices: materiel,
      soinsDevices: soins,
      apporteurDevices: apporteurs,
      configured: Boolean(
        process.env.VAPID_PUBLIC_KEY?.trim() &&
          process.env.VAPID_PRIVATE_KEY?.trim()
      ),
    };
  },
});
