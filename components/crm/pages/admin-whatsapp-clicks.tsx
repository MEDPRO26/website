"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { WhatsappClicksCard } from "@/components/crm/whatsapp-clicks-card";
import { useAdminSession } from "@/hooks/use-admin-session";

export function AdminWhatsappClicksPage() {
  const { canQuery } = useAdminSession();

  return (
    <div>
      <PageHeader
        title="Clics WhatsApp"
        description="Détail des clics sur les boutons WhatsApp du site : bouton, page, ville et localisation."
        actions={
          <Link
            href="/admin/statistics"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour aux statistiques
          </Link>
        }
      />

      <WhatsappClicksCard
        enabled={canQuery("statistics.view")}
        recentLimit={150}
      />
    </div>
  );
}
