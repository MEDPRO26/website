"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { LogOut } from "lucide-react";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { ApportAffairesPage } from "@/components/crm/apport-affaires-page";
import { ApportAffairesSheet } from "@/components/crm/apport-affaires-sheet";
import { AdminShell } from "@/components/dashboard/app-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import {
  isAdminStaffRole,
  isApporteurStaffRole,
} from "@/lib/crm/staff-roles";
import {
  ADMIN_LOGIN_PATH,
  APPORT_AFFAIRES_LOGIN_PATH,
  SUPPLIER_HOME_PATH,
} from "@/lib/auth-routes";

function ApporteurPortal() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const staff = useQuery(api.staff.current);

  return (
    <div className="crm-app min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-card/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative size-10 overflow-hidden rounded-full bg-white ring-1 ring-border/70">
            <Image
              src={CRM_LOGO}
              alt={CRM_BRAND_NAME}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{CRM_BRAND_NAME}</p>
            <p className="text-[11px] text-muted-foreground">
              {staff?.name ?? "Apporteur d’affaires"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            void signOut().then(() => router.push(APPORT_AFFAIRES_LOGIN_PATH));
          }}
        >
          <LogOut className="size-4" />
          Se déconnecter
        </Button>
      </header>
      <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-[#2890e0] sm:text-3xl">
          Tableau de Suivi des Commissions – Apport d’Affaires
        </h1>
        <ApportAffairesSheet variant="apporteur" />
      </main>
    </div>
  );
}

export function ApportAffairesHome() {
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
    return <ApporteurPortal />;
  }

  if (isAdminStaffRole(staff.role)) {
    return (
      <AdminShell variant="apport">
        <ApportAffairesPage />
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
