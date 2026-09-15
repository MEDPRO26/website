import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { requireAdminStaff } from "./lib/authz";
import { logAudit } from "./lib/auditLog";
import { linkSupplierStaff } from "./lib/linkSupplierStaff";
import { siteUrl } from "./lib/siteUrl";
import { resolveSupplierPartnerKind } from "../lib/supplier-activity-types";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function invitePathForSupplier(supplier: {
  partnerKind?: "materiel" | "soins";
  type: string;
  types?: string[];
}, token: string) {
  const kind = resolveSupplierPartnerKind(supplier) ?? "materiel";
  return kind === "soins"
    ? `/prestataire/invite/${token}`
    : `/supplier/invite/${token}`;
}

function inviteUrlForSupplier(
  supplier: {
    partnerKind?: "materiel" | "soins";
    type: string;
    types?: string[];
  },
  token: string
) {
  return `${siteUrl()}${invitePathForSupplier(supplier, token)}`;
}

export async function createSupplierInvite(
  ctx: MutationCtx,
  args: {
    supplierId: Id<"suppliers">;
    email: string;
    invitedByStaffId?: Id<"staff">;
    skipEmail?: boolean;
  }
) {
  const email = normalizeEmail(args.email);
  const supplier = await ctx.db.get(args.supplierId);
  if (!supplier) {
    throw new Error("Fournisseur introuvable.");
  }

  const pending = await ctx.db
    .query("supplierInvitations")
    .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
    .collect();

  for (const invite of pending) {
    if (invite.email === email && invite.status === "pending") {
      await ctx.db.patch(invite._id, { status: "cancelled" });
    }
  }

  const token = crypto.randomUUID();
  const now = Date.now();

  await ctx.db.insert("supplierInvitations", {
    token,
    email,
    supplierId: args.supplierId,
    status: "pending",
    invitedByStaffId: args.invitedByStaffId,
    expiresAt: now + INVITE_TTL_MS,
    createdAt: now,
  });

  const inviteUrl = inviteUrlForSupplier(supplier, token);

  if (!args.skipEmail) {
    await ctx.scheduler.runAfter(0, internal.email.sendSupplierInvitation, {
      to: email,
      supplierName: supplier.name,
      inviteUrl,
    });
  }

  return { token, inviteUrl };
}

export const createAndSendInvite = internalMutation({
  args: {
    supplierId: v.id("suppliers"),
    email: v.string(),
    invitedByStaffId: v.optional(v.id("staff")),
  },
  handler: async (ctx, args) => {
    return await createSupplierInvite(ctx, args);
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
      .query("supplierInvitations")
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

    if (invite.status !== "pending") {
      return { valid: false as const, reason: "expired" as const };
    }

    if (invite.expiresAt < Date.now()) {
      return { valid: false as const, reason: "expired" as const };
    }

    const supplier = await ctx.db.get(invite.supplierId);
    if (!supplier) {
      return { valid: false as const, reason: "not_found" as const };
    }

    return {
      valid: true as const,
      email: invite.email,
      supplierName: supplier.name,
      supplierType: supplier.type,
      expiresAt: invite.expiresAt,
    };
  },
});

export const getLatestForSupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const invites = await ctx.db
      .query("supplierInvitations")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();

    return invites.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;
  },
});

export const accept = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Connectez-vous pour accepter l'invitation.");
    }

    const token = args.token.trim();
    const invite = await ctx.db
      .query("supplierInvitations")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (!invite || invite.status !== "pending") {
      throw new Error("Invitation invalide ou déjà utilisée.");
    }

    if (invite.expiresAt < Date.now()) {
      await ctx.db.patch(invite._id, { status: "expired" });
      throw new Error("Cette invitation a expiré. Demandez un nouvel envoi à S2MBO.");
    }

    const authUser = await ctx.db.get(userId);
    const userEmail = authUser?.email?.toLowerCase();
    if (!userEmail || userEmail !== invite.email) {
      throw new Error(
        "Cette invitation est liée à une autre adresse email. Connectez-vous avec l'email invité."
      );
    }

    const supplier = await ctx.db.get(invite.supplierId);
    if (!supplier) {
      throw new Error("Fournisseur introuvable.");
    }

    const now = Date.now();
    await linkSupplierStaff(ctx, {
      userId,
      supplierId: invite.supplierId,
      email: invite.email,
      name: authUser?.name ?? supplier.name,
    });

    await ctx.db.patch(invite._id, {
      status: "accepted",
      acceptedAt: now,
      acceptedByUserId: userId,
    });

    return { supplierId: invite.supplierId, supplierName: supplier.name };
  },
});

export const createInviteLink = mutation({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const supplier = await ctx.db.get(args.supplierId);
    if (!supplier) {
      throw new Error("Fournisseur introuvable.");
    }
    if (!supplier.email?.trim()) {
      throw new Error("Ajoutez un email sur la fiche fournisseur avant de générer un lien.");
    }

    const email = normalizeEmail(supplier.email);
    const existing = await ctx.db
      .query("supplierInvitations")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
      .collect();
    const pending = existing
      .filter(
        (invite) =>
          invite.status === "pending" &&
          invite.email === email &&
          invite.expiresAt > Date.now()
      )
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    // Reuse the active invite so "Copier le lien" does not invalidate the email.
    if (pending) {
      return {
        token: pending.token,
        inviteUrl: inviteUrlForSupplier(supplier, pending.token),
      };
    }

    const result = await createSupplierInvite(ctx, {
      supplierId: args.supplierId,
      email: supplier.email,
      invitedByStaffId: staff._id,
      skipEmail: true,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "create",
      entityType: "supplier_invite",
      entityId: args.supplierId,
      entityLabel: supplier.name,
      toValue: "link",
    });

    return result;
  },
});

export const resendForSupplier = mutation({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const supplier = await ctx.db.get(args.supplierId);
    if (!supplier) {
      throw new Error("Fournisseur introuvable.");
    }
    if (!supplier.email?.trim()) {
      throw new Error("Ajoutez un email sur la fiche fournisseur avant d'inviter.");
    }

    const result = await createSupplierInvite(ctx, {
      supplierId: args.supplierId,
      email: supplier.email,
      invitedByStaffId: staff._id,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "create",
      entityType: "supplier_invite",
      entityId: args.supplierId,
      entityLabel: supplier.name,
      toValue: "resend",
    });

    return result;
  },
});

/**
 * CLI/admin recovery: if the invitee already created an auth account but
 * never finished Accept, link staff + mark pending invites accepted.
 */
export const activateAccessByEmail = internalMutation({
  args: {
    email: v.string(),
    supplierId: v.optional(v.id("suppliers")),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);

    const authUser = (await ctx.db.query("users").collect()).find(
      (user) => user.email?.toLowerCase() === email
    );
    if (!authUser) {
      return {
        ok: false as const,
        error: "auth_user_missing" as const,
        message:
          `Aucun compte auth pour ${email}. Elle doit d'abord créer son mot de passe via le lien d'invitation, puis relancer cette activation.`,
      };
    }

    let supplier = args.supplierId
      ? await ctx.db.get(args.supplierId)
      : null;

    if (!supplier) {
      const matches = (await ctx.db.query("suppliers").collect()).filter(
        (row) => row.email?.trim().toLowerCase() === email
      );
      if (matches.length === 1) {
        supplier = matches[0];
      } else if (matches.length > 1) {
        return {
          ok: false as const,
          error: "multiple_suppliers" as const,
          message: `Plusieurs fournisseurs avec ${email}. Passez supplierId.`,
          supplierIds: matches.map((row) => row._id),
        };
      }
    }

    if (!supplier) {
      return {
        ok: false as const,
        error: "supplier_missing" as const,
        message: `Aucun fournisseur trouvé pour ${email}.`,
      };
    }

    const staffId = await linkSupplierStaff(ctx, {
      userId: authUser._id,
      supplierId: supplier._id,
      email,
      name: authUser.name ?? supplier.name,
    });

    const invites = await ctx.db
      .query("supplierInvitations")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplier!._id))
      .collect();

    const now = Date.now();
    let invitesAccepted = 0;
    for (const invite of invites) {
      if (invite.status !== "pending") continue;
      if (normalizeEmail(invite.email) !== email) continue;
      await ctx.db.patch(invite._id, {
        status: "accepted",
        acceptedAt: now,
        acceptedByUserId: authUser._id,
      });
      invitesAccepted += 1;
    }

    return {
      ok: true as const,
      email,
      userId: authUser._id,
      staffId,
      supplierId: supplier._id,
      supplierName: supplier.name,
      invitesAccepted,
      message:
        "Compte fournisseur lié. Elle peut se connecter sur /supplier/login avec cet email.",
    };
  },
});
