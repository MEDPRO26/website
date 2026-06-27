"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, Clock, CheckCircle2, Activity, MapPin, Calendar } from "lucide-react";
import { getDemoSupplier, getDemoSupplierOrders } from "@/lib/mock-data";

export function SupplierDashboardPage() {
  const supplier = getDemoSupplier();
  const allOrders = getDemoSupplierOrders();
  const pending = allOrders
    .filter((o) =>
      ["envoyee_fournisseur", "vue_fournisseur", "prix_recu"].includes(o.status)
    )
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Bonjour 👋"
        description={`${supplier.name} · ${supplier.type} · données démo`}
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <StatCard
          label="Nouvelles demandes"
          value={allOrders.filter((o) => o.status === "envoyee_fournisseur").length}
          icon={Inbox}
          tone="brand"
        />
        <StatCard
          label="En attente de réponse"
          value={allOrders.filter((o) => ["envoyee_fournisseur", "vue_fournisseur"].includes(o.status)).length}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Confirmées"
          value={allOrders.filter((o) => ["acceptee", "planifiee", "location_active"].includes(o.status)).length}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Terminées"
          value={allOrders.filter((o) => o.status === "terminee").length}
          icon={Activity}
          tone="info"
        />
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
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
          <Card key={o.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-brand">{o.ref}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1.5 font-medium truncate">{o.item}</p>
                <p className="text-xs text-muted-foreground">{o.type} · {o.duration ?? "—"}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {o.city} · {o.district}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> {o.desiredDate ?? "Dès que possible"}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/supplier/orders/${o.id}`}>Voir détail</Link>
              </Button>
              <Button size="sm" variant="outline" className="flex-1">Refuser</Button>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}