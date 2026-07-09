import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { linkSupplierStaff } from "./lib/linkSupplierStaff";
import { requireAdminPermission, requireAdminStaff } from "./lib/authz";
import { logAudit } from "./lib/auditLog";
import { purgeAuthUserById } from "./lib/purgeAuthUser";
import { roleValidator, staffStatusValidator } from "./validators";
import type { QueryCtx } from "./_generated/server";

async function hasPendingSupplierInvite(ctx: QueryCtx, email: string) {
  const invites = await ctx.db
    .query("supplierInvitations")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();
  return invites.some(
    (invite) => invite.status === "pending" && invite.expiresAt > Date.now()
  );
}

async function hasPendingStaffInvite(ctx: QueryCtx, email: string) {
  const invites = await ctx.db
    .query("staffInvitations")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();
  return invites.some(
    (invite) => invite.status === "pending" && invite.expiresAt > Date.now()
  );
}

export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non authentifié.");
    }

    const existing = await ctx.db
      .query("staff")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      return existing._id;
    }

    const authUser = await ctx.db.get(userId);
    const email = authUser?.email?.trim().toLowerCase();
    if (email && (await hasPendingSupplierInvite(ctx, email))) {
      throw new Error(
        "Acceptez d'abord votre invitation fournisseur reçue par email."
      );
    }

    if (email && (await hasPendingStaffInvite(ctx, email))) {
      throw new Error(
        "Acceptez d'abord votre invitation assistant reçue par email."
      );
    }

    const staffCount = (await ctx.db.query("staff").collect()).length;
    if (staffCount > 0) {
      throw new Error(
        "Accès réservé. Utilisez le lien d'invitation envoyé par un administrateur."
      );
    }

    const now = Date.now();

    return await ctx.db.insert("staff", {
      userId,
      name: authUser?.name ?? authUser?.email ?? "Utilisateur",
      email: authUser?.email ?? "",
      role: "super_admin",
      status: "actif",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("staff")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    const rows = await ctx.db.query("staff").collect();

    const enriched = await Promise.all(
      rows.map(async (member) => {
        const supplier = member.supplierId
          ? await ctx.db.get(member.supplierId)
          : null;
        return {
          ...member,
          supplierName: supplier?.name ?? null,
          createdLabel: new Date(member.createdAt).toLocaleDateString("fr-FR"),
          updatedLabel: new Date(member.updatedAt).toLocaleDateString("fr-FR"),
        };
      })
    );

    return enriched.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  },
});

export const updateRole = mutation({
  args: {
    staffId: v.id("staff"),
    role: roleValidator,
    supplierId: v.optional(v.id("suppliers")),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdminStaff(ctx);
    if (actor.role !== "super_admin" && actor.role !== "admin") {
      throw new Error("Seuls les administrateurs peuvent modifier les rôles.");
    }

    const target = await ctx.db.get(args.staffId);
    if (!target) {
      throw new Error("Utilisateur introuvable.");
    }

    if (args.role === "supplier" && !args.supplierId && !target.supplierId) {
      throw new Error("Liez un fournisseur pour le rôle fournisseur.");
    }

    if (args.role !== "supplier" && target.role === "supplier") {
      await ctx.db.patch(args.staffId, {
        role: args.role,
        supplierId: undefined,
        updatedAt: Date.now(),
      });
      return;
    }

    await ctx.db.patch(args.staffId, {
      role: args.role,
      supplierId:
        args.role === "supplier"
          ? args.supplierId ?? target.supplierId
          : undefined,
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: actor._id,
      actorName: actor.name,
      action: "update",
      entityType: "staff",
      entityId: args.staffId,
      entityLabel: target.name,
      fromValue: target.role,
      toValue: args.role,
    });
  },
});

export const updateStatus = mutation({
  args: {
    staffId: v.id("staff"),
    status: staffStatusValidator,
  },
  handler: async (ctx, args) => {
    const actor = await requireAdminStaff(ctx);
    if (actor.role !== "super_admin" && actor.role !== "admin") {
      throw new Error("Seuls les administrateurs peuvent modifier le statut.");
    }

    if (actor._id === args.staffId && args.status !== "actif") {
      throw new Error("Vous ne pouvez pas désactiver votre propre compte.");
    }

    const target = await ctx.db.get(args.staffId);
    if (!target) {
      throw new Error("Utilisateur introuvable.");
    }

    await ctx.db.patch(args.staffId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: actor._id,
      actorName: actor.name,
      action: "status_change",
      entityType: "staff",
      entityId: args.staffId,
      entityLabel: target.name,
      fromValue: target.status,
      toValue: args.status,
    });
  },
});

export const removeStaffUser = mutation({
  args: {
    staffId: v.id("staff"),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdminStaff(ctx);
    if (actor.role !== "super_admin" && actor.role !== "admin") {
      throw new Error("Seuls les administrateurs peuvent supprimer un utilisateur.");
    }

    if (actor._id === args.staffId) {
      throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
    }

    const target = await ctx.db.get(args.staffId);
    if (!target) {
      throw new Error("Utilisateur introuvable.");
    }

    if (target.role !== "assistant" && target.role !== "supplier") {
      throw new Error(
        "Seuls les comptes assistant et fournisseur peuvent être supprimés ici."
      );
    }

    const email = target.email.trim().toLowerCase();

    if (target.role === "assistant") {
      const pendingInvites = await ctx.db
        .query("staffInvitations")
        .withIndex("by_email", (q) => q.eq("email", email))
        .collect();

      for (const invite of pendingInvites) {
        if (invite.status === "pending") {
          await ctx.db.patch(invite._id, { status: "cancelled" });
        }
      }
    }

    if (target.role === "supplier") {
      const supplierInvites = target.supplierId
        ? await ctx.db
            .query("supplierInvitations")
            .withIndex("by_supplierId", (q) =>
              q.eq("supplierId", target.supplierId!)
            )
            .collect()
        : [];

      for (const invite of supplierInvites) {
        if (invite.status === "pending" && invite.email === email) {
          await ctx.db.patch(invite._id, { status: "cancelled" });
        }
      }
    }

    await logAudit(ctx, {
      actorStaffId: actor._id,
      actorName: actor.name,
      action: "delete",
      entityType: "staff",
      entityId: args.staffId,
      entityLabel: target.name,
      fromValue: target.role,
      toValue: "supprimé",
    });

    const result = await purgeAuthUserById(ctx, target.userId);
    if (!result.deleted) {
      await ctx.db.delete(args.staffId);
    }

    return {
      email: result.email || email,
      role: target.role,
      staffRemoved: result.staffRemoved || 1,
    };
  },
});

/** Links an existing auth user to a supplier record for portal access. */
export const inviteSupplier = mutation({
  args: {
    email: v.string(),
    supplierId: v.id("suppliers"),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const supplier = await ctx.db.get(args.supplierId);
    if (!supplier) {
      throw new Error("Fournisseur introuvable.");
    }

    const email = args.email.trim().toLowerCase();
    const authUser = (await ctx.db.query("users").collect()).find(
      (user) => user.email?.toLowerCase() === email
    );

    if (!authUser) {
      throw new Error(
        `Aucun compte auth pour ${email}. Envoyez une invitation par email depuis la fiche fournisseur.`
      );
    }

    return await linkSupplierStaff(ctx, {
      userId: authUser._id,
      supplierId: args.supplierId,
      email: authUser.email ?? email,
      name: authUser.name ?? supplier.name,
    });
  },
});

/** Dev CLI — link a signed-up auth user to the demo Agadir supplier. */
export const linkDemoSupplierLogin = internalMutation({
  args: {
    email: v.string(),
    supplierName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const supplierName = args.supplierName ?? "Fournisseur Démo Agadir";

    const supplier = (await ctx.db.query("suppliers").collect()).find(
      (row) => row.name === supplierName
    );
    if (!supplier) {
      throw new Error(
        `Fournisseur "${supplierName}" introuvable. Créez les fournisseurs démo d'abord.`
      );
    }

    const authUser = (await ctx.db.query("users").collect()).find(
      (user) => user.email?.toLowerCase() === email
    );
    if (!authUser) {
      throw new Error(`Aucun compte auth pour ${email}. Inscrivez-vous d'abord.`);
    }

    const existing = await ctx.db
      .query("staff")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        role: "supplier",
        supplierId: supplier._id,
        name: authUser.name ?? supplier.name,
        email: authUser.email ?? email,
        updatedAt: now,
      });
      return {
        staffId: existing._id,
        supplierId: supplier._id,
        supplierName: supplier.name,
        email,
      };
    }

    const staffId = await ctx.db.insert("staff", {
      userId: authUser._id,
      name: authUser.name ?? supplier.name,
      email: authUser.email ?? email,
      role: "supplier",
      status: "actif",
      supplierId: supplier._id,
      createdAt: now,
      updatedAt: now,
    });

    return {
      staffId,
      supplierId: supplier._id,
      supplierName: supplier.name,
      email,
    };
  },
});

/** Dev/admin CLI only — creates a staff profile for an existing auth user. */
export const seedStaffProfile = internalMutation({
  args: {
    email: v.string(),
    role: v.optional(roleValidator),
    supplierId: v.optional(v.id("suppliers")),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const authUser = (await ctx.db.query("users").collect()).find(
      (user) => user.email?.toLowerCase() === email
    );

    if (!authUser) {
      throw new Error(`Aucun utilisateur auth pour ${email}.`);
    }

    const existing = await ctx.db
      .query("staff")
      .withIndex("by_userId", (q) => q.eq("userId", authUser._id))
      .unique();

    if (existing) {
      if (args.supplierId && !existing.supplierId) {
        await ctx.db.patch(existing._id, {
          role: args.role ?? existing.role,
          supplierId: args.supplierId,
          updatedAt: Date.now(),
        });
      }
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert("staff", {
      userId: authUser._id,
      name: authUser.name ?? authUser.email ?? "Utilisateur",
      email: authUser.email ?? email,
      role: args.role ?? "assistant",
      status: "actif",
      supplierId: args.supplierId,
      createdAt: now,
      updatedAt: now,
    });
  },
});
