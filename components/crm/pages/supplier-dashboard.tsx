"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, Clock, CheckCircle2, Activity, MapPin, Calendar } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import type { OrderStatus } from "@/lib/mock-data";

export function SupplierDashboardPage() {
  const { supplier, canQuerySupplier } = useSupplierSession();
  const stats = useQuery(
    api.supplierPortal.dashboardStats,
    canQuerySupplier ? {} : "skip"
  );
  const allOrders = useQuery(
    api.supplierPortal.listOrders,
    canQuerySupplier ? {} : "skip"
  );

  const pending =
    allOrders
      ?.filter((o) =>
        ["envoyee_fournisseur", "vue_fournisseur", "prix_recu"].includes(o.status)
      )
      .slice(0, 6) ?? [];

  if (stats === undefined || allOrders === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement du tableau de bord…</p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Bonjour 👋"
        description={`${supplier?.name ?? "Fournisseur"} · ${supplier?.type ?? ""}`}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Nouvelles demandes"
          value={stats.newRequests}
          icon={Inbox}
          tone="brand"
        />
        <StatCard
          label="En attente de réponse"
          value={stats.pendingResponse}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Confirmées"
          value={stats.confirmed}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Terminées"
          value={stats.completed}
          icon={Activity}
          tone="info"
        />
      </div>

      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold">À répondre rapidement</h2>
        <Link href="/supplier/orders" className="text-xs font-medium text-brand hover:underline">
          Voir tout
        </Link>
      </div>
      {pending.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          Aucune demande en attente pour le moment.
        </Card>
      ) : (
        <div className="space-y-3 pb-4">
          {pending.map((o) => (
            <Card key={o._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-brand">{o.ref}</span>
                    <StatusBadge status={o.status as OrderStatus} />
                  </div>
                  <p className="mt-1.5 truncate font-medium">{o.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.type} · {o.duration ?? "—"}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" /> {o.city}
                  {o.district ? ` · ${o.district}` : ""}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" /> {o.desiredDate ?? "Dès que possible"}
                </span>
              </div>
              <div className="mt-3">
                <Button asChild size="sm" className="w-full">
                  <Link href={`/supplier/orders/${o._id}`}>
                    {o.hasQuote ? "Voir détail" : "Proposer un prix"}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
