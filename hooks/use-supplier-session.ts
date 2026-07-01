"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSupplierSession() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const profile = useQuery(
    api.supplierPortal.current,
    isAuthenticated ? {} : "skip"
  );

  const sessionLoading =
    authLoading ||
    !isAuthenticated ||
    (isAuthenticated && profile === undefined);

  const canQuerySupplier =
    isAuthenticated && profile !== undefined && profile !== null;

  return {
    isAuthenticated,
    authLoading,
    profile,
    staff: profile?.staff ?? null,
    supplier: profile?.supplier ?? null,
    profileComplete: profile?.profileComplete ?? false,
    sessionLoading,
    canQuerySupplier,
  };
}
