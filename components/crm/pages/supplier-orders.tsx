"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Package,
  Search,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import type { OrderStatus } from "@/lib/mock-data";

type FilterTab = "all" | "pending" | "active" | "done";

const PENDING_STATUSES: OrderStatus[] = [
  "envoyee_fournisseur",
  "vue_fournisseur",
  "prix_recu",
];

const ACTIVE_STATUSES: OrderStatus[] = [
  "offre_envoyee",
  "acceptee",
  "planifiee",
  "en_cours",
  "location_active",
];

const DONE_STATUSES: OrderStatus[] = ["terminee", "annulee"];

function isUrgent(status: OrderStatus) {
  return status === "envoyee_fournisseur" || status === "vue_fournisseur";
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "pending", label: "À répondre" },
  { id: "active", label: "En cours" },
  { id: "done", label: "Terminées" },
];

export function SupplierOrdersPage() {
  const { supplier, canQuerySupplier } = useSupplierSession();
  const allOrders = useQuery(
    api.supplierPortal.listOrders,
    canQuerySupplier ? {} : "skip"
  );
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");

  const orders = useMemo(() => {
    if (!allOrders) {
      return [];
    }
    const q = query.trim().toLowerCase();
    return allOrders.filter((order) => {
      const matchesTab =
        tab === "all" ||
        (tab === "pending" && PENDING_STATUSES.includes(order.status as OrderStatus)) ||
        (tab === "active" && ACTIVE_STATUSES.includes(order.status as OrderStatus)) ||
        (tab === "done" && DONE_STATUSES.includes(order.status as OrderStatus));

      const matchesQuery =
        !q ||
        order.ref.toLowerCase().includes(q) ||
        order.item.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q);

      return matchesTab && matchesQuery;
    });
  }, [allOrders, tab, query]);

  const counts = useMemo(() => {
    const list = allOrders ?? [];
    return {
      all: list.length,
      pending: list.filter((o) => PENDING_STATUSES.includes(o.status as OrderStatus)).length,
      active: list.filter((o) => ACTIVE_STATUSES.includes(o.status as OrderStatus)).length,
      done: list.filter((o) => DONE_STATUSES.includes(o.status as OrderStatus)).length,
    };
  }, [allOrders]);

  if (allOrders === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement des commandes…</p>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <PageHeader
        title="Mes commandes"
        description={`${supplier?.name ?? "Fournisseur"} · ${allOrders.length} demande${allOrders.length > 1 ? "s" : ""} affectée${allOrders.length > 1 ? "s" : ""}`}
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par référence, matériel, ville…"
          className="h-10 pl-9 bg-card"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === item.id
                ? "bg-brand text-white shadow-sm"
                : "bg-card text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            {item.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                tab === item.id ? "bg-white/20" : "bg-muted"
              }`}
            >
              {counts[item.id]}
            </span>
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="mx-auto mb-3 size-10 text-muted-foreground/50" />
          <p className="font-medium text-foreground">Aucune commande trouvée</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Modifiez le filtre ou la recherche.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden p-0">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {isUrgent(order.status as OrderStatus) ? (
                        <Tag tone="danger">URGENT</Tag>
                      ) : (
                        <Tag tone="neutral">STANDARD</Tag>
                      )}
                      <span className="font-mono text-xs font-semibold text-brand">
                        {order.ref}
                      </span>
                      {order.hasQuote ? (
                        <Tag tone="success">Prix envoyé</Tag>
                      ) : null}
                    </div>
                    <p className="font-semibold text-foreground">{order.item}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {order.type} · {order.duration ?? "—"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Options"
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0 text-brand" />
                    {order.city}
                    {order.district ? ` (${order.district})` : ""}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Calendar className="size-3.5 shrink-0 text-brand" />
                    {order.desiredDate ?? "Dès que possible"}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock className="size-3.5 shrink-0 text-brand" />
                    Reçue le {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="mt-3">
                  <StatusBadge status={order.status as OrderStatus} />
                </div>
              </div>

              <div className="border-t border-border bg-muted/30 px-4 py-3">
                {PENDING_STATUSES.includes(order.status as OrderStatus) &&
                !order.hasQuote ? (
                  <Button asChild className="w-full">
                    <Link href={`/supplier/orders/${order._id}`}>
                      Voir et répondre
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/supplier/orders/${order._id}`}>Voir détails</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
