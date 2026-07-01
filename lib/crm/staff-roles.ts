export const ADMIN_STAFF_ROLES = ["super_admin", "admin", "assistant"] as const;

export type AdminStaffRole = (typeof ADMIN_STAFF_ROLES)[number];

export function isAdminStaffRole(role: string | undefined | null): role is AdminStaffRole {
  return (
    role !== undefined &&
    role !== null &&
    (ADMIN_STAFF_ROLES as readonly string[]).includes(role)
  );
}
