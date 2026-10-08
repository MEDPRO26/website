import { Suspense } from "react";
import type { Metadata } from "next";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { crmPageMetadata } from "@/lib/crm-metadata";
import "@/app/admin/crm.css";

export const metadata: Metadata = {
  ...crmPageMetadata("Espace projets"),
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "S2MBO Admin",
    statusBarStyle: "default",
  },
};

export default function AdminMeLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="crm-app flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Chargement…
        </div>
      }
    >
      <StaffLoginPage audience="admin" />
    </Suspense>
  );
}
