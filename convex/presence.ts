import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { getStaffProfile } from "./lib/authz";
import type { Doc } from "./_generated/dataModel";

const ADMIN_ROLES = new Set(["super_admin", "admin", "assistant"]);

async function resolvePresenceProfile(
  ctx: Parameters<typeof getStaffProfile>[0],
  staff: Doc<"staff"> | null
) {
  if (!staff || staff.status !== "actif") {
    return { kind: "visitor" as const };
  }

  if (staff.role === "supplier" && staff.supplierId) {
    const supplier = await ctx.db.get(staff.supplierId);
    return {
      kind: "supplier" as const,
      staffId: staff._id,
      supplierId: staff.supplierId,
      label: supplier?.name ?? staff.name,
    };
  }

  if (ADMIN_ROLES.has(staff.role)) {
    return {
      kind: "staff" as const,
      staffId: staff._id,
      label: staff.name,
    };
  }

  return { kind: "visitor" as const };
}

/** Heartbeat for any site visitor; authenticated users are classified server-side. */
export const heartbeat = mutation({
  args: {
    sessionKey: v.string(),
    path: v.optional(v.string()),
  },
  handler: async (ctx, { sessionKey, path }) => {
    const now = Date.now();
    const staff = await getStaffProfile(ctx);
    const profile = await resolvePresenceProfile(ctx, staff);

    const existing = await ctx.db
      .query("presenceSessions")
      .withIndex("by_sessionKey", (q) => q.eq("sessionKey", sessionKey))
      .unique();

    const patch = {
      kind: profile.kind,
      lastSeenAt: now,
      path,
      staffId: profile.kind !== "visitor" ? profile.staffId : undefined,
      supplierId: profile.kind === "supplier" ? profile.supplierId : undefined,
      label: profile.kind !== "visitor" ? profile.label : undefined,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await ctx.db.insert("presenceSessions", {
      sessionKey,
      ...patch,
      createdAt: now,
    });
  },
});

/** Removes presence rows inactive for more than 24 hours. */
export const cleanupStaleSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const stale = await ctx.db
      .query("presenceSessions")
      .filter((q) => q.lt(q.field("lastSeenAt"), cutoff))
      .collect();

    for (const row of stale) {
      await ctx.db.delete(row._id);
    }

    return { deleted: stale.length };
  },
});
