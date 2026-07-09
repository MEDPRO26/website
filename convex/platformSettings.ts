import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission, requireAdminStaff } from "./lib/authz";
import { logAudit } from "./lib/auditLog";
import { whatsappProviderValidator } from "./validators";

const DEFAULTS = {
  defaultCity: "Agadir",
  contactEmail: "contact@sossante.ma",
  seoSiteTitle: "SOS Santé Agadir — Matériel médical et aide à domicile",
  seoSiteDescription:
    "Coordination locale pour location matériel médical, garde-malade et aide à domicile à Agadir.",
  notifyNewOrderEmail: true,
  notifySupplierResponseEmail: true,
  notifyClientAcceptedEmail: true,
  notifyComplaintEmail: true,
  notifyRentalEndingEmail: false,
  auditLogsEnabled: true,
  whatsappProvider: "manual" as const,
};

export async function ensurePlatformSettings(ctx: MutationCtx) {
  const existing = await ctx.db
    .query("platformSettings")
    .withIndex("by_key", (q) => q.eq("key", "global"))
    .unique();

  if (!existing) {
    await ctx.db.insert("platformSettings", {
      key: "global",
      ...DEFAULTS,
      updatedAt: Date.now(),
    });
    return;
  }

  const patch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(DEFAULTS)) {
    if (existing[key as keyof typeof existing] === undefined) {
      patch[key] = value;
    }
  }
  if (Object.keys(patch).length > 0) {
    patch.updatedAt = Date.now();
    await ctx.db.patch(existing._id, patch);
  }
}

function withDefaults(
  settings: Awaited<ReturnType<typeof getSettingsDoc>>
) {
  return {
    ...DEFAULTS,
    ...settings,
  };
}

async function getSettingsDoc(ctx: QueryCtx | MutationCtx) {
  return await ctx.db
    .query("platformSettings")
    .withIndex("by_key", (q) => q.eq("key", "global"))
    .unique();
}

export const ensureDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "settings.manage");
    await ensurePlatformSettings(ctx);
    return { ok: true };
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "settings.manage");
    const settings = await getSettingsDoc(ctx);
    return withDefaults(settings);
  },
});

export const getWhatsappIntegration = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminPermission(ctx, "whatsapp.view_conversations");
    const settings = await getSettingsDoc(ctx);
    const merged = withDefaults(settings);
    return {
      whatsappProvider: merged.whatsappProvider,
    };
  },
});

/** Public read for site metadata (no auth). */
export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    const settings = await getSettingsDoc(ctx);
    const merged = withDefaults(settings);
    return {
      seoSiteTitle: merged.seoSiteTitle,
      seoSiteDescription: merged.seoSiteDescription,
      contactEmail: merged.contactEmail,
      defaultCity: merged.defaultCity,
    };
  },
});

export const updateGeneral = mutation({
  args: {
    defaultCity: v.string(),
    contactEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "settings.manage");
    await ensurePlatformSettings(ctx);
    const settings = await getSettingsDoc(ctx);
    if (!settings) {
      throw new Error("Paramètres introuvables.");
    }

    await ctx.db.patch(settings._id, {
      defaultCity: args.defaultCity.trim(),
      contactEmail: args.contactEmail.trim(),
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "settings",
      entityLabel: "Paramètres généraux",
      toValue: `${args.defaultCity} · ${args.contactEmail}`,
    });
  },
});

export const updateNotifications = mutation({
  args: {
    notifyNewOrderEmail: v.boolean(),
    notifySupplierResponseEmail: v.boolean(),
    notifyClientAcceptedEmail: v.boolean(),
    notifyComplaintEmail: v.boolean(),
    notifyRentalEndingEmail: v.boolean(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "settings.manage");
    await ensurePlatformSettings(ctx);
    const settings = await getSettingsDoc(ctx);
    if (!settings) {
      throw new Error("Paramètres introuvables.");
    }

    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "settings",
      entityLabel: "Notifications email",
    });
  },
});

export const updateSeo = mutation({
  args: {
    seoSiteTitle: v.string(),
    seoSiteDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "settings.manage");
    await ensurePlatformSettings(ctx);
    const settings = await getSettingsDoc(ctx);
    if (!settings) {
      throw new Error("Paramètres introuvables.");
    }

    await ctx.db.patch(settings._id, {
      seoSiteTitle: args.seoSiteTitle.trim(),
      seoSiteDescription: args.seoSiteDescription.trim(),
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "settings",
      entityLabel: "SEO global",
    });
  },
});

export const updateSecurity = mutation({
  args: {
    auditLogsEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "settings.manage");
    await ensurePlatformSettings(ctx);
    const settings = await getSettingsDoc(ctx);
    if (!settings) {
      throw new Error("Paramètres introuvables.");
    }

    await ctx.db.patch(settings._id, {
      auditLogsEnabled: args.auditLogsEnabled,
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "settings",
      entityLabel: "Audit logs",
      toValue: args.auditLogsEnabled ? "activés" : "désactivés",
    });
  },
});

export const updateWhatsappProvider = mutation({
  args: { whatsappProvider: whatsappProviderValidator },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "settings.manage");
    await ensurePlatformSettings(ctx);
    const settings = await getSettingsDoc(ctx);
    if (!settings) {
      throw new Error("Paramètres introuvables.");
    }

    if (
      args.whatsappProvider !== "manual" &&
      args.whatsappProvider !== "disabled" &&
      args.whatsappProvider !== "360messenger"
    ) {
      throw new Error(
        "Meta Cloud API et 360dialog seront disponibles après configuration des identifiants API."
      );
    }

    await ctx.db.patch(settings._id, {
      whatsappProvider: args.whatsappProvider,
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "settings",
      entityLabel: "Provider WhatsApp",
      toValue: args.whatsappProvider,
    });
  },
});
