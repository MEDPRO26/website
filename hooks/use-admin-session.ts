"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";
import {
  hasPermission,
  type Permission,
  type Role,
} from "@/lib/permissions";

export function useAdminSession() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const staff = useQuery(
    api.staff.current,
    isAuthenticated ? {} : "skip"
  );

  const isAdminStaff = isAdminStaffRole(staff?.role);
  const role = (staff?.role ?? "assistant") as Role;

  const can = useMemo(
    () => (permission: Permission) => hasPermission(role, permission),
    [role]
  );

  const sessionLoading =
    authLoading ||
    !isAuthenticated ||
    (isAuthenticated && staff === undefined);

  const canQueryAdmin = isAuthenticated && isAdminStaff;

  const canQuery = (permission: Permission) =>
    canQueryAdmin && can(permission);

  return {
    isAuthenticated,
    authLoading,
    staff,
    isAdminStaff,
    sessionLoading,
    canQueryAdmin,
    can,
    canQuery,
  };
}
