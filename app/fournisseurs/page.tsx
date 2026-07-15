import { Suspense } from "react";
import type { Metadata } from "next";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { getPrivateRobotsMetadata } from "@/lib/indexing";
import "@/app/admin/crm.css";

export const metadata: Metadata = {
  title: "Espace fournisseurs",
  robots: getPrivateRobotsMetadata(),
};

export default function FournisseursLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="crm-app flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Chargement…
        </div>
      }
    >
      <StaffLoginPage audience="supplier" />
    </Suspense>
  );
}
