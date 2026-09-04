import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireAdminStaff } from "./lib/authz";
import { linkApporteurStaff } from "./lib/linkApporteurStaff";
import { purgeAuthUserById } from "./lib/purgeAuthUser";
import { siteUrl } from "./lib/siteUrl";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function inviteUrlForToken(token: string) {
  return `${siteUrl()}/apport-affaires/invite/${token}`;
}

async function createApporteurInvite(
  ctx: MutationCtx,
  args: {
    apporteurId: Id<"apporteurs">;
    email: string;
    invitedByStaffId?: Id<"staff">;
  }
) {
  const email = normalizeEmail(args.email);
  const apporteur = await ctx.db.get(args.apporteurId);
  if (!apporteur) {
    throw new Error("Apporteur introuvable.");
  }

  const pending = await ctx.db
    .query("apporteurInvitations")
    .withIndex("by_apporteurId", (q) => q.eq("apporteurId", args.apporteurId))
    .collect();

  for (const invite of pending) {
    if (invite.email === email && invite.status === "pending") {
      await ctx.db.patch(invite._id, { status: "cancelled" });
    }
  }

  const token = crypto.randomUUID();
  const now = Date.now();

  await ctx.db.insert("apporteurInvitations", {
    token,
    email,
    apporteurId: args.apporteurId,
    status: "pending",
    invitedByStaffId: args.invitedByStaffId,
    expiresAt: now + INVITE_TTL_MS,
    createdAt: now,
  });

  const inviteUrl = inviteUrlForToken(token);
  await ctx.scheduler.runAfter(0, internal.email.sendApporteurInvitation, {
    to: email,
    apporteurName: apporteur.name,
    inviteUrl,
  });

  return { token, inviteUrl };
}

export const inviteByEmail = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const email = normalizeEmail(args.email);
    const name = args.name.trim();
    if (!name) {
      throw new Error("Le nom est obligatoire.");
    }
    if (!email.includes("@")) {
      throw new Error("Email invalide.");
    }

    const existing = await ctx.db
      .query("apporteurs")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      throw new Error("Un apporteur existe déjà avec cet email.");
    }

    const now = Date.now();
    const apporteurId = await ctx.db.insert("apporteurs", {
      name,
      email,
      status: "en_attente",
      createdAt: now,
      updatedAt: now,
    });

    return await createApporteurInvite(ctx, {
      apporteurId,
      email,
      invitedByStaffId: staff._id,
    });
  },
});

export const resend = mutation({
  args: { apporteurId: v.id("apporteurs") },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const apporteur = await ctx.db.get(args.apporteurId);
    if (!apporteur) {
      throw new Error("Apporteur introuvable.");
    }
    return await createApporteurInvite(ctx, {
      apporteurId: args.apporteurId,
      email: apporteur.email,
      invitedByStaffId: staff._id,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    const rows = await ctx.db.query("apporteurs").collect();
    const withInvites = await Promise.all(
      rows.map(async (row) => {
        const invites = await ctx.db
          .query("apporteurInvitations")
          .withIndex("by_apporteurId", (q) => q.eq("apporteurId", row._id))
          .collect();
        const latest = invites.sort((a, b) => b.createdAt - a.createdAt)[0];
        return {
          ...row,
          maxUnpaidOpened: row.maxUnpaidOpened ?? 2,
          inviteStatus: latest?.status ?? null,
          inviteExpiresAt: latest?.expiresAt ?? null,
        };
      })
    );
    return withInvites.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Admin: set how many unpaid opened demandes an apporteur may hold. */
export const updateMaxUnpaidOpened = mutation({
  args: {
    apporteurId: v.id("apporteurs"),
    maxUnpaidOpened: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const apporteur = await ctx.db.get(args.apporteurId);
    if (!apporteur) {
      throw new Error("Apporteur introuvable.");
    }
    const value = Math.floor(args.maxUnpaidOpened);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error("La limite doit être un nombre entre 0 et 100.");
    }
    await ctx.db.patch(args.apporteurId, {
      maxUnpaidOpened: value,
      updatedAt: Date.now(),
    });
    return { ok: true as const, maxUnpaidOpened: value };
  },
});

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const token = args.token.trim();
    if (!token) {
      return { valid: false as const, reason: "not_found" as const };
    }

    const invite = await ctx.db
      .query("apporteurInvitations")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (!invite) {
      return { valid: false as const, reason: "not_found" as const };
    }
    if (invite.status === "accepted") {
      return { valid: false as const, reason: "already_accepted" as const };
    }
    if (invite.status === "cancelled") {
      return { valid: false as const, reason: "cancelled" as const };
    }
    if (invite.status !== "pending" || invite.expiresAt < Date.now()) {
      return { valid: false as const, reason: "expired" as const };
    }

    const apporteur = await ctx.db.get(invite.apporteurId);
    if (!apporteur) {
      return { valid: false as const, reason: "not_found" as const };
    }

    return {
      valid: true as const,
      email: invite.email,
      apporteurName: apporteur.name,
      expiresAt: invite.expiresAt,
    };
  },
});

export const accept = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Connectez-vous pour accepter l'invitation.");
    }

    const invite = await ctx.db
      .query("apporteurInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token.trim()))
      .unique();

    if (!invite || invite.status !== "pending") {
      throw new Error("Invitation invalide ou déjà utilisée.");
    }
    if (invite.expiresAt < Date.now()) {
      await ctx.db.patch(invite._id, { status: "expired" });
      throw new Error("Cette invitation a expiré. Demandez un nouvel envoi.");
    }

    const authUser = await ctx.db.get(userId);
    const userEmail = authUser?.email?.toLowerCase();
    if (!userEmail || userEmail !== invite.email) {
      throw new Error(
        "Cette invitation est liée à une autre adresse email. Connectez-vous avec l'email invité."
      );
    }

    const apporteur = await ctx.db.get(invite.apporteurId);
    if (!apporteur) {
      throw new Error("Apporteur introuvable.");
    }

    const now = Date.now();
    await linkApporteurStaff(ctx, {
      userId,
      apporteurId: invite.apporteurId,
      email: invite.email,
      name: authUser?.name ?? apporteur.name,
    });
    await ctx.db.patch(invite.apporteurId, {
      status: "actif",
      updatedAt: now,
    });
    await ctx.db.patch(invite._id, {
      status: "accepted",
      acceptedAt: now,
      acceptedByUserId: userId,
    });

    return { apporteurId: invite.apporteurId };
  },
});

export const remove = mutation({
  args: { apporteurId: v.id("apporteurs") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const apporteur = await ctx.db.get(args.apporteurId);
    if (!apporteur) {
      throw new Error("Apporteur introuvable.");
    }

    const invites = await ctx.db
      .query("apporteurInvitations")
      .withIndex("by_apporteurId", (q) => q.eq("apporteurId", args.apporteurId))
      .collect();
    for (const invite of invites) {
      await ctx.db.delete(invite._id);
    }

    const staffRows = await ctx.db
      .query("staff")
      .withIndex("by_apporteurId", (q) => q.eq("apporteurId", args.apporteurId))
      .collect();
    for (const staff of staffRows) {
      await purgeAuthUserById(ctx, staff.userId);
    }

    await ctx.db.delete(args.apporteurId);
    return { deleted: true };
  },
});
