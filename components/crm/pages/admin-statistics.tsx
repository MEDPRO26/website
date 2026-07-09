"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import {
  Activity,
  BarChart3,
  Clock3,
  Globe,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";
import { VisitorHistoryChart } from "@/components/crm/visitor-history-chart";
import { VisitorLocationsCard } from "@/components/crm/visitor-locations-card";

function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  if (ms < 60_000) return `${Math.round(ms / 1000)} s`;
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.round((ms % 60_000) / 1000);
  return seconds > 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
}

function OnlineDot({ online }: { online: boolean }) {
  return (
    <span
      className={
        online
          ? "inline-block size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]"
          : "inline-block size-2 rounded-full bg-muted-foreground/40"
      }
      aria-hidden
    />
  );
}

export function AdminStatisticsPage() {
  const { canQuery } = useAdminSession();
  const data = useQuery(
    api.statistics.overview,
    canQuery("statistics.view") ? {} : "skip"
  );

  if (data === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement des statistiques…</p>
    );
  }

  const { online, totals } = data;

  return (
    <div>
      <PageHeader
        title="Statistiques"
        description="Présence en temps réel et performance des fournisseurs."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Fournisseurs en ligne"
          value={online.suppliers}
          icon={Truck}
          tone="success"
        />
        <StatCard
          label="Visiteurs sur le site"
          value={online.visitors}
          icon={Globe}
          tone="brand"
        />
        <StatCard
          label="Équipe CRM en ligne"
          value={online.staff}
          icon={Users}
          tone="info"
        />
        <StatCard
          label="Réclamations rapides"
          value={totals.fastClaims}
          hint="< 5 min"
          icon={Zap}
          tone="success"
        />
      </div>

      <VisitorHistoryChart enabled={canQuery("statistics.view")} />

      <VisitorLocationsCard enabled={canQuery("statistics.view")} />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border/60 px-4 py-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Truck className="size-4 text-emerald-600" />
              Fournisseurs en ligne
            </h2>
          </div>
          {data.onlineSuppliers.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Aucun fournisseur connecté pour le moment.
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {data.onlineSuppliers.map((row) => (
                <div
                  key={row.sessionKey}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium flex items-center gap-2">
                      <OnlineDot online />
                      {row.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {row.city} · {row.path}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {row.lastSeenLabel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border/60 px-4 py-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="size-4 text-brand" />
              Visiteurs en ligne
            </h2>
          </div>
          {data.onlineVisitors.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Aucun visiteur actif sur le site public.
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {data.onlineVisitors.map((row) => (
                <div
                  key={row.sessionKey}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium flex items-center gap-2">
                      <OnlineDot online />
                      Visiteur ···{row.sessionKey}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {row.location} · {row.path}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {row.lastSeenLabel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {data.topVisitorPages.length > 0 ? (
        <Card className="mb-6 p-4">
          <h2 className="mb-3 text-sm font-semibold flex items-center gap-2">
            <Activity className="size-4" />
            Pages consultées (visiteurs en ligne)
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.topVisitorPages.map((row) => (
              <span
                key={row.path}
                className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs"
              >
                <span className="font-medium">{row.path}</span>
                <span className="text-muted-foreground">{row.count}</span>
              </span>
            ))}
          </div>
        </Card>
      ) : null}

      <Card className="mb-6 p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="size-4" />
            Performance fournisseurs
          </h2>
          <p className="text-xs text-muted-foreground">
            {totals.assignmentsResponded} réclamées · {totals.assignmentsMissed} manquées ·{" "}
            {totals.deliveries} livrées
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Fournisseur</th>
                <th className="px-4 py-2.5 font-medium">En ligne</th>
                <th className="px-4 py-2.5 font-medium">Réclamées</th>
                <th className="px-4 py-2.5 font-medium">Rapides (&lt;5 min)</th>
                <th className="px-4 py-2.5 font-medium">Délai moyen</th>
                <th className="px-4 py-2.5 font-medium">Manquées</th>
                <th className="px-4 py-2.5 font-medium">Taux réponse</th>
                <th className="px-4 py-2.5 font-medium">Livrées</th>
              </tr>
            </thead>
            <tbody>
              {data.supplierPerformance.map((row) => (
                <tr key={row.supplierId} className="border-t border-border/40">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">{row.city}</div>
                  </td>
                  <td className="px-4 py-3">
                    {row.isOnline ? (
                      <Tag tone="success">En ligne</Tag>
                    ) : (
                      <Tag tone="neutral">Hors ligne</Tag>
                    )}
                  </td>
                  <td className="px-4 py-3">{row.claims}</td>
                  <td className="px-4 py-3">{row.fastClaims}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5 text-muted-foreground" />
                      {formatDuration(row.avgResponseMs)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.missed > 0 ? (
                      <span className="text-[var(--danger)] font-medium">{row.missed}</span>
                    ) : (
                      row.missed
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.responseRate === null ? "—" : `${row.responseRate} %`}
                  </td>
                  <td className="px-4 py-3">{row.delivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 bg-muted/20">
        <h2 className="mb-2 text-sm font-semibold">Pistes à ajouter plus tard</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Heures de pointe (visiteurs et réclamations par créneau horaire)</li>
          <li>Délai moyen entre réclamation et confirmation de livraison</li>
          <li>Taux de règlement des commissions SOS par fournisseur</li>
          <li>Alertes si un fournisseur actif laisse expirer plusieurs commandes d&apos;affilée</li>
        </ul>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/suppliers">Voir les fournisseurs</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
