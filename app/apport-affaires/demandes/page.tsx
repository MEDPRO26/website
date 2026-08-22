"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { ApportDemandesPage } from "@/components/crm/pages/apport-demandes";
import { ApporteurPortalGate } from "@/components/crm/apporteur-portal-gate";
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

export default function ApportDemandesRoute() {
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
        <ApportDemandesPage variant="apporteur" />
      </ApporteurPortalGate>
    );
  }

  if (isAdminStaffRole(staff.role)) {
    return (
      <AdminShell variant="apport">
        <ApportDemandesPage variant="admin" />
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
