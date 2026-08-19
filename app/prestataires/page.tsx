import { Suspense } from "react";
import type { Metadata } from "next";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { crmPageMetadata } from "@/lib/crm-metadata";
import "@/app/admin/crm.css";

export const metadata: Metadata = crmPageMetadata("Espace prestataires");

export default function PrestatairesLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="crm-app flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Chargement…
        </div>
      }
    >
      <StaffLoginPage audience="prestataire" />
    </Suspense>
  );
}
