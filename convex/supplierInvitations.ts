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

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function siteUrl() {
  return process.env.SITE_URL ?? "http://localhost:3000";
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

  const inviteUrl = `${siteUrl()}/supplier/invite/${token}`;

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
    const invite = await ctx.db
      .query("supplierInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invite) {
      return { valid: false as const, reason: "not_found" as const };
    }

    if (invite.status === "accepted") {
      return { valid: false as const, reason: "already_accepted" as const };
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

    const invite = await ctx.db
      .query("supplierInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invite || invite.status !== "pending") {
      throw new Error("Invitation invalide ou déjà utilisée.");
    }

    if (invite.expiresAt < Date.now()) {
      await ctx.db.patch(invite._id, { status: "expired" });
      throw new Error("Cette invitation a expiré. Demandez un nouvel envoi à SOS Santé.");
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
