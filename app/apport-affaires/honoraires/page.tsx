"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { ApporteurPortalGate } from "@/components/crm/apporteur-portal-gate";
import { AdminApportHonorairesPage } from "@/components/crm/pages/admin-apport-honoraires";
import { ApporteurHonorairesPage } from "@/components/crm/pages/apporteur-honoraires";
import { AdminShell } from "@/components/dashboard/app-shell";
import { api } from "@/convex/_generated/api";
import {
  ADMIN_LOGIN_PATH,
  SUPPLIER_HOME_PATH,
} from "@/lib/auth-routes";
import {
  isAdminStaffRole,
  isApporteurStaffRole,
} from "@/lib/crm/staff-roles";

export default function ApportHonorairesRoute() {
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
    return (
      <ApporteurPortalGate>
        <ApporteurHonorairesPage />
      </ApporteurPortalGate>
    );
  }

  if (isAdminStaffRole(staff.role)) {
    return (
      <AdminShell variant="apport">
        <AdminApportHonorairesPage />
      </AdminShell>
    );
  }

  if (staff.role === "supplier") {
    router.replace(SUPPLIER_HOME_PATH);
    return null;
  }

  router.replace(ADMIN_LOGIN_PATH);
  return null;
}
