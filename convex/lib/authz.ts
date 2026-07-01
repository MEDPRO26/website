import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import {
  hasPermission,
  type Permission,
  type Role,
} from "../../lib/permissions";

const ADMIN_ROLES = new Set(["super_admin", "admin", "assistant"]);

export async function getStaffProfile(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"staff"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }

  return await ctx.db
    .query("staff")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

export async function requireStaff(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"staff">> {
  const staff = await getStaffProfile(ctx);
  if (!staff || staff.status !== "actif") {
    throw new Error("Accès refusé. Connectez-vous avec un compte CRM actif.");
  }
  return staff;
}

export async function requireAdminStaff(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"staff">> {
  const staff = await requireStaff(ctx);
  if (!ADMIN_ROLES.has(staff.role)) {
    throw new Error("Accès réservé à l'équipe SOS Santé.");
  }
  return staff;
}

export function assertPermission(staff: Doc<"staff">, permission: Permission) {
  if (!hasPermission(staff.role as Role, permission)) {
    throw new Error("Vous n'avez pas la permission pour cette action.");
  }
}

export async function requireAdminPermission(
  ctx: QueryCtx | MutationCtx,
  permission: Permission
): Promise<Doc<"staff">> {
  const staff = await requireAdminStaff(ctx);
  assertPermission(staff, permission);
  return staff;
}

export async function requireSupplierStaff(ctx: QueryCtx | MutationCtx) {
  const staff = await requireStaff(ctx);
  if (staff.role !== "supplier" || !staff.supplierId) {
    throw new Error("Accès réservé aux comptes fournisseur.");
  }

  const supplier = await ctx.db.get(staff.supplierId);
  if (!supplier || supplier.status !== "actif") {
    throw new Error("Compte fournisseur inactif ou introuvable.");
  }

  return { staff, supplier };
}

/** Supplier completing onboarding — allows `en_attente` before profile is filled. */
export async function requireSupplierOnboarding(ctx: QueryCtx | MutationCtx) {
  const staff = await requireStaff(ctx);
  if (staff.role !== "supplier" || !staff.supplierId) {
    throw new Error("Accès réservé aux comptes fournisseur.");
  }

  const supplier = await ctx.db.get(staff.supplierId);
  if (!supplier || supplier.status === "suspendu") {
    throw new Error("Compte fournisseur inactif ou introuvable.");
  }

  return { staff, supplier };
}
