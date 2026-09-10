import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { dateKeyInSiteTimezone } from "./presence";
import {
  visitorDeviceValidator,
  whatsappPlacementValidator,
} from "./validators";

const DEDUPE_WINDOW_MS = 5_000;

/** Public: record a WhatsApp CTA click from the website. */
export const recordClick = mutation({
  args: {
    sessionKey: v.string(),
    path: v.string(),
    placement: whatsappPlacementValidator,
    pageCitySlug: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    deviceType: v.optional(visitorDeviceValidator),
    line: v.optional(v.string()),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionKey = args.sessionKey.trim().slice(0, 80);
    if (!sessionKey) return { ok: false as const, reason: "missing_session" };

    const path = args.path.trim().slice(0, 300) || "/";
    const now = Date.now();

    const recent = await ctx.db
      .query("whatsappClicks")
      .withIndex("by_clickedAt", (q) => q.gte("clickedAt", now - DEDUPE_WINDOW_MS))
      .collect();

    const duplicate = recent.some(
      (row) =>
        row.sessionKey === sessionKey &&
        row.path === path &&
        row.placement === args.placement
    );
    if (duplicate) {
      return { ok: true as const, deduped: true };
    }

    await ctx.db.insert("whatsappClicks", {
      sessionKey,
      clickedAt: now,
      dateKey: dateKeyInSiteTimezone(now),
      path,
      placement: args.placement,
      pageCitySlug: args.pageCitySlug?.trim().slice(0, 64) || undefined,
      city: args.city?.trim().slice(0, 80) || undefined,
      country: args.country?.trim().slice(0, 80) || undefined,
      countryCode: args.countryCode?.trim().slice(0, 8) || undefined,
      deviceType: args.deviceType,
      line: args.line?.trim().slice(0, 40) || undefined,
      label: args.label?.trim().slice(0, 160) || undefined,
    });

    return { ok: true as const, deduped: false };
  },
});

/** One-shot: delete all WhatsApp click analytics rows. */
export const clearAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("whatsappClicks").collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return { deleted: rows.length };
  },
});
