"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ORDERS } from "@/lib/mock-data";

export function AdminCommissionsPage() {
  const rows = ORDERS.filter((o) => o.finalPrice && o.supplierPrice);
  return (
    <div>
      <PageHeader
        title="Commissions"
        description="Suivi des commissions SOS Santé Agadir par commande."
        actions={<Button>Exporter</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <StatCard label="Commission totale due" value="1 840 MAD" icon={Wallet} tone="brand" />
        <StatCard label="Payée ce mois" value="6 250 MAD" icon={CheckCircle2} tone="success" />
        <StatCard label="En attente" value="3 120 MAD" icon={Clock} tone="warning" />
        <StatCard label="Non réglée" value="2" hint="commandes" icon={AlertCircle} tone="danger" />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Commande</th>
                <th className="py-2.5 font-medium">Fournisseur</th>
                <th className="py-2.5 font-medium text-right">Prix fournisseur</th>
                <th className="py-2.5 font-medium text-right">Prix final</th>
                <th className="py-2.5 font-medium text-right">Commission</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o, i) => {
                const commission = Math.round((o.supplierPrice! + (o.delivery ?? 0) + (o.install ?? 0)) * (o.commissionPct ?? 0) / 100);
                const statuses = ["Payée", "En attente", "Due"];
                const tones = ["success", "warning", "danger"] as const;
                const idx = i % 3;
                return (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs text-brand">{o.ref}</td>
                    <td className="py-3">{o.supplier}</td>
                    <td className="py-3 text-right">{o.supplierPrice?.toLocaleString("fr-FR")} MAD</td>
                    <td className="py-3 text-right">{o.finalPrice?.toLocaleString("fr-FR")} MAD</td>
                    <td className="py-3 text-right font-semibold text-brand-deep">{commission.toLocaleString("fr-FR")} MAD</td>
                    <td className="py-3"><Tag tone={tones[idx]}>{statuses[idx]}</Tag></td>
                    <td className="py-3 text-xs text-muted-foreground">{o.createdAt}</td>
                    <td className="px-4 py-3 text-right"><Button size="sm" variant="outline">Marquer payée</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}