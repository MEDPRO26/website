"use client";

import { useQuery } from "convex/react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock3,
  Globe,
  Monitor,
  Package,
  Smartphone,
  Truck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";
import { VisitorHistoryChart } from "@/components/crm/visitor-history-chart";
import { VisitorLocationsCard } from "@/components/crm/visitor-locations-card";
import { PeakHoursChart } from "@/components/crm/peak-hours-chart";
import { formatMad } from "@/lib/crm/pricing";

function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  if (ms < 60_000) return `${Math.round(ms / 1000)} s`;
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 60) {
    const seconds = Math.round((ms % 60_000) / 1000);
    return seconds > 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours < 24) {
    return remMinutes > 0 ? `${hours} h ${remMinutes} min` : `${hours} h`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours > 0 ? `${days} j ${remHours} h` : `${days} j`;
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

  const { online, totals, deviceStats30d, commissionSettlement, commissionTotals, supplierMissedAlerts } =
    data;

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

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Mobile en ligne"
          value={online.mobile}
          icon={Smartphone}
          tone="info"
        />
        <StatCard
          label="Desktop en ligne"
          value={online.desktop}
          icon={Monitor}
          tone="brand"
        />
        <StatCard
          label="Visiteurs mobile"
          value={deviceStats30d.mobile}
          hint="30 derniers jours"
          icon={Smartphone}
          tone="info"
        />
        <StatCard
          label="Visiteurs desktop"
          value={deviceStats30d.desktop}
          hint="30 derniers jours"
          icon={Monitor}
          tone="brand"
        />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Délai livraison moyen"
          value={formatDuration(totals.avgDeliveryMs)}
          hint={`${totals.deliveryConfirmations} confirmation${totals.deliveryConfirmations > 1 ? "s" : ""}`}
          icon={Package}
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
                      <Tag tone={row.deviceType === "mobile" ? "info" : "neutral"}>
                        {row.deviceLabel}
                      </Tag>
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
            {totals.deliveries} livrées · livraison moy.{" "}
            {formatDuration(totals.avgDeliveryMs)}
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
                <th className="px-4 py-2.5 font-medium">Réclamation</th>
                <th className="px-4 py-2.5 font-medium">Livraison moy.</th>
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
                    <span className="inline-flex items-center gap-1">
                      <Package className="size-3.5 text-muted-foreground" />
                      {formatDuration(row.avgDeliveryMs)}
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

      <Card className="mb-6 p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Wallet className="size-4 text-brand" />
            Règlement des commissions SOS
          </h2>
          <p className="text-xs text-muted-foreground">
            Taux global :{" "}
            {commissionTotals.settlementRate === null
              ? "—"
              : `${commissionTotals.settlementRate} %`}{" "}
            · {formatMad(commissionTotals.paidAmount)} réglé ·{" "}
            {formatMad(commissionTotals.unpaidAmount)} en attente
          </p>
        </div>

        {commissionSettlement.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Aucune commission sur commandes livrées pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Fournisseur</th>
                  <th className="px-4 py-2.5 font-medium text-right">Commissions</th>
                  <th className="px-4 py-2.5 font-medium text-right">Réglées</th>
                  <th className="px-4 py-2.5 font-medium text-right">Montant total</th>
                  <th className="px-4 py-2.5 font-medium text-right">Réglé</th>
                  <th className="px-4 py-2.5 font-medium text-right">En attente</th>
                  <th className="px-4 py-2.5 font-medium text-right">Taux</th>
                </tr>
              </thead>
              <tbody>
                {commissionSettlement.map((row) => (
                  <tr key={row.supplierId} className="border-t border-border/40">
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.name}</div>
                      <div className="text-xs text-muted-foreground">{row.city}</div>
                    </td>
                    <td className="px-4 py-3 text-right">{row.commissionCount}</td>
                    <td className="px-4 py-3 text-right">{row.paidCount}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {formatMad(row.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-success">
                      {formatMad(row.paidAmount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {row.unpaidAmount > 0 ? (
                        <span className="font-medium text-[var(--danger)]">
                          {formatMad(row.unpaidAmount)}
                        </span>
                      ) : (
                        formatMad(0)
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {row.settlementRate === null ? (
                        "—"
                      ) : row.settlementRate === 100 ? (
                        <Tag tone="success">{row.settlementRate} %</Tag>
                      ) : row.settlementRate >= 50 ? (
                        <Tag tone="warning">{row.settlementRate} %</Tag>
                      ) : (
                        <Tag tone="danger">{row.settlementRate} %</Tag>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card
        className={`mb-6 p-0 overflow-hidden ${
          supplierMissedAlerts.length > 0 ? "border-[var(--danger)]/40" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle
              className={`size-4 ${
                supplierMissedAlerts.length > 0
                  ? "text-[var(--danger)]"
                  : "text-muted-foreground"
              }`}
            />
            Alertes fournisseurs
          </h2>
          <p className="text-xs text-muted-foreground">
            Fournisseurs en ligne ayant laissé expirer {2}+ commandes d&apos;affilée
          </p>
        </div>

        {supplierMissedAlerts.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Aucune alerte — aucun fournisseur connecté n&apos;a manqué plusieurs
            commandes consécutives.
          </p>
        ) : (
          <div className="divide-y divide-border/50">
            {supplierMissedAlerts.map((row) => (
              <div
                key={row.supplierId}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium flex items-center gap-2">
                    <OnlineDot online />
                    {row.name}
                    <Tag tone="danger">
                      {row.currentConsecutiveMisses} expirations d&apos;affilée
                    </Tag>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {row.city}
                    {row.lastMissedOrderRef
                      ? ` · dernière : ${row.lastMissedOrderRef}`
                      : ""}
                    {row.lastMissedLabel ? ` · ${row.lastMissedLabel}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{row.totalMissed} manquée{row.totalMissed > 1 ? "s" : ""} au total</span>
                  <span>·</span>
                  <span>max. {row.maxConsecutiveMisses} d&apos;affilée</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <PeakHoursChart enabled={canQuery("statistics.view")} />
    </div>
  );
}
