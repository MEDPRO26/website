"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import type { ReactNode } from "react";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { ApporteurShell } from "@/components/dashboard/apporteur-shell";
import { api } from "@/convex/_generated/api";
import {
  ADMIN_LOGIN_PATH,
  APPORT_AFFAIRES_HOME_PATH,
  SUPPLIER_HOME_PATH,
} from "@/lib/auth-routes";
import {
  isAdminStaffRole,
  isApporteurStaffRole,
} from "@/lib/crm/staff-roles";

/** Auth gate + sidebar shell for apporteur-only pages. */
export function ApporteurPortalGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const staff = useQuery(api.staff.current, isAuthenticated ? {} : "skip");

  if (isLoading || (isAuthenticated && staff === undefined)) {
    return (
      <div className="crm-app flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!isAuthenticated || !staff) {
    return <StaffLoginPage audience="apporteur" />;
  }

  if (isApporteurStaffRole(staff.role)) {
    return <ApporteurShell>{children}</ApporteurShell>;
  }

  if (isAdminStaffRole(staff.role)) {
    router.replace(APPORT_AFFAIRES_HOME_PATH);
    return null;
  }

  if (staff.role === "supplier") {
    router.replace(SUPPLIER_HOME_PATH);
    return null;
  }

  router.replace(ADMIN_LOGIN_PATH);
  return null;
}
