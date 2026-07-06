import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminStaff } from "./lib/authz";
import { normalizePhone } from "./lib/refs";
import { ensurePlatformSettings } from "./platformSettings";
import {
  whatsappChannelStatusValidator,
  whatsappProviderValidator,
} from "./validators";

const DEFAULT_CHANNELS = [
  {
    slug: "materiel-medical",
    label: "Matériel médical",
    purpose: "location_materiel",
    city: "Agadir",
    phone: "212700975888",
    sortOrder: 0,
    isDefault: true,
  },
  {
    slug: "aide-domicile",
    label: "Aide à domicile",
    purpose: "aide_domicile",
    city: "Agadir",
    phone: "",
    sortOrder: 1,
    isDefault: false,
  },
  {
    slug: "garde-soins",
    label: "Garde-malade & soins",
    purpose: "garde_soins",
    city: "Agadir",
    phone: "",
    sortOrder: 2,
    isDefault: false,
  },
  {
    slug: "contact-general",
    label: "Contact général",
    purpose: "general",
    city: "Agadir",
    phone: "",
    sortOrder: 3,
    isDefault: false,
  },
] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    const channels = await ctx.db.query("whatsappChannels").collect();
    const conversations = await ctx.db.query("conversations").collect();

    return channels
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((channel) => {
        const channelConversations = conversations.filter(
          (row) => row.channelId === channel._id
        );
        return {
          ...channel,
          conversationCount: channelConversations.length,
          unreadCount: channelConversations.reduce(
            (sum, row) => sum + row.unreadCount,
            0
          ),
        };
      });
  },
});

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    return (
      settings ?? {
        key: "global" as const,
        whatsappProvider: "manual" as const,
        updatedAt: Date.now(),
      }
    );
  },
});

export const ensureDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    await ensurePlatformSettings(ctx);

    const existing = await ctx.db.query("whatsappChannels").collect();
    if (existing.length > 0) {
      return { seeded: false, count: existing.length };
    }

    const now = Date.now();
    for (const channel of DEFAULT_CHANNELS) {
      await ctx.db.insert("whatsappChannels", {
        ...channel,
        phone: channel.phone ? normalizePhone(channel.phone) : "",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
    }

    return { seeded: true, count: DEFAULT_CHANNELS.length };
  },
});

export const update = mutation({
  args: {
    id: v.id("whatsappChannels"),
    label: v.optional(v.string()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    status: v.optional(whatsappChannelStatusValidator),
    metaPhoneNumberId: v.optional(v.string()),
    metaWabaId: v.optional(v.string()),
    messenger360ApiKey: v.optional(v.string()),
    accentColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const channel = await ctx.db.get(args.id);
    if (!channel) {
      throw new Error("Ligne WhatsApp introuvable.");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.label !== undefined) {
      patch.label = args.label.trim();
    }
    if (args.phone !== undefined) {
      patch.phone = args.phone.trim() ? normalizePhone(args.phone) : "";
    }
    if (args.city !== undefined) {
      patch.city = args.city.trim() || undefined;
    }
    if (args.status !== undefined) {
      patch.status = args.status;
    }
    if (args.metaPhoneNumberId !== undefined) {
      patch.metaPhoneNumberId = args.metaPhoneNumberId.trim() || undefined;
    }
    if (args.metaWabaId !== undefined) {
      patch.metaWabaId = args.metaWabaId.trim() || undefined;
    }
    if (args.messenger360ApiKey !== undefined) {
      patch.messenger360ApiKey = args.messenger360ApiKey.trim() || undefined;
    }
    if (args.accentColor !== undefined) {
      const color = args.accentColor.trim();
      patch.accentColor = color || undefined;
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const updateProvider = mutation({
  args: { whatsappProvider: whatsappProviderValidator },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    await ensurePlatformSettings(ctx);

    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

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
  },
});
