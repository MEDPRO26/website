"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";

export function useAdminSession() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const ensureProfile = useMutation(api.staff.ensureProfile);
  const staff = useQuery(
    api.staff.current,
    isAuthenticated ? {} : "skip"
  );

  const isAdminStaff = isAdminStaffRole(staff?.role);

  useEffect(() => {
    if (isAuthenticated && staff === null) {
      void ensureProfile();
    }
  }, [isAuthenticated, staff, ensureProfile]);

  const sessionLoading =
    authLoading ||
    !isAuthenticated ||
    (isAuthenticated && staff === undefined);

  const canQueryAdmin = isAuthenticated && isAdminStaff;

  return {
    isAuthenticated,
    authLoading,
    staff,
    isAdminStaff,
    sessionLoading,
    canQueryAdmin,
  };
}
