"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { CheckCircle2, ClipboardList, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";
import { formatMad } from "@/lib/crm/pricing";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminCommissionsPage() {
  const { canQuery } = useAdminSession();
  const rows = useQuery(api.commissions.list, canQuery("commissions.view") ? {} : "skip");
  const stats = useQuery(api.commissions.stats, canQuery("commissions.view") ? {} : "skip");

  if (rows === undefined || stats === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement des commissions…</p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Commissions"
        description="Suivi des commissions déclarées par les fournisseurs."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Commission totale (devis confirmés)"
          value={formatMad(stats.totalCommission)}
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="Commissions réglées"
          value={formatMad(stats.paidCommission)}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Non réglées"
          value={formatMad(stats.unpaidCommission)}
          icon={ClipboardList}
          tone="danger"
        />
        <StatCard
          label="Devis fournisseur"
          value={stats.quoteCount}
          hint="confirmés"
          icon={ClipboardList}
          tone="info"
        />
      </div>

      {rows.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Aucune commission — les fournisseurs doivent d&apos;abord confirmer leurs prix.
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Commande</th>
                  <th className="px-4 py-2.5 font-medium">Fournisseur</th>
                  <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">
                    Prix client
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">
                    Commission
                  </th>
                  <th className="px-4 py-2.5 font-medium whitespace-nowrap">Règlement</th>
                  <th className="px-4 py-2.5 font-medium whitespace-nowrap">Date</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                    <tr key={row.quoteId} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-xs text-brand">
                        {row.orderRef}
                      </td>
                      <td className="px-4 py-3">{row.supplierName}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {formatMad(row.finalPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-deep whitespace-nowrap">
                        {formatMad(row.commissionAmount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.commissionPaid ? (
                          <Tag tone="success">Réglé</Tag>
                        ) : (
                          <Tag tone="warning">Non réglé</Tag>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(row.submittedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/orders/${row.orderId}`}>Voir</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
