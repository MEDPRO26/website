import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { crmPageMetadata } from "@/lib/crm-metadata";
import "@/app/admin/crm.css";

export const metadata: Metadata = crmPageMetadata(
  "Tableau de Suivi des Commissions – Apport d’Affaires"
);

export default function ApportAffairesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="crm-app">
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
