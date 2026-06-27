"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ORDERS, STATUS_LABEL, type OrderStatus } from "@/lib/mock-data";
import { Search, LayoutGrid, List, Filter } from "lucide-react";

const KANBAN_COLUMNS: OrderStatus[] = [
  "nouvelle", "a_qualifier", "a_affecter", "envoyee_fournisseur",
  "prix_recu", "offre_envoyee", "acceptee", "en_cours", "terminee", "annulee",
];

export function AdminOrdersPage() {
  const [view, setView] = useState<"table" | "kanban">("table");
  return (
    <div>
      <PageHeader
        title="Commandes"
        description={`${ORDERS.length} commandes au total · mise à jour il y a 2 min`}
        actions={
          <>
            <div className="hidden sm:flex rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${view === "table" ? "bg-brand-soft text-brand-deep" : "text-muted-foreground"}`}
              >
                <List className="size-3.5" /> Tableau
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${view === "kanban" ? "bg-brand-soft text-brand-deep" : "text-muted-foreground"}`}
              >
                <LayoutGrid className="size-3.5" /> Kanban
              </button>
            </div>
            <Button asChild>
              <Link href="/admin/orders/new">+ Nouvelle commande</Link>
            </Button>
          </>
        }
      />

      <Card className="p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher (référence, client, téléphone)…" className="h-9 pl-9" />
          </div>
          <Select>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              {KANBAN_COLUMNS.map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-9 w-[120px]"><SelectValue placeholder="Ville" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="agadir">Agadir</SelectItem>
              <SelectItem value="inezgane">Inezgane</SelectItem>
              <SelectItem value="dcheira">Dcheira</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="site">Formulaire site</SelectItem>
              <SelectItem value="call">Appel</SelectItem>
              <SelectItem value="gmaps">Google Maps</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="size-3.5" /> Plus de filtres
          </Button>
        </div>
      </Card>

      {view === "table" ? <OrdersTable /> : <OrdersKanban />}
    </div>
  );
}

function OrdersTable() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Référence</th>
              <th className="py-2.5 font-medium">Client</th>
              <th className="py-2.5 font-medium">Ville</th>
              <th className="py-2.5 font-medium">Type</th>
              <th className="py-2.5 font-medium">Source</th>
              <th className="py-2.5 font-medium">Fournisseur</th>
              <th className="py-2.5 font-medium">Statut</th>
              <th className="py-2.5 font-medium text-right">Prix final</th>
              <th className="px-4 py-2.5 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand hover:underline">
                    {o.ref}
                  </Link>
                </td>
                <td className="py-3">
                  <div className="font-medium">{o.client}</div>
                  <div className="text-xs text-muted-foreground">{o.phone}</div>
                </td>
                <td className="py-3">
                  <div>{o.city}</div>
                  <div className="text-xs text-muted-foreground">{o.district}</div>
                </td>
                <td className="py-3 text-muted-foreground">{o.type}</td>
                <td className="py-3 text-xs">{o.source}</td>
                <td className="py-3 text-xs">{o.supplier ?? <span className="text-muted-foreground italic">—</span>}</td>
                <td className="py-3"><StatusBadge status={o.status} /></td>
                <td className="py-3 text-right font-medium">
                  {o.finalPrice ? `${o.finalPrice.toLocaleString("fr-FR")} MAD` : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">{o.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function OrdersKanban() {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex gap-3 min-w-max">
        {KANBAN_COLUMNS.map((status) => {
          const items = ORDERS.filter((o) => o.status === status);
          return (
            <div key={status} className="w-72 shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <StatusBadge status={status} />
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2 rounded-xl bg-muted/40 p-2 min-h-[120px]">
                {items.length === 0 && (
                  <div className="grid place-items-center py-6 text-xs text-muted-foreground">Vide</div>
                )}
                {items.map((o) => (
                  <Link
                    key={o.id}
                    href={`/admin/orders/${o.id}`}
                    className="block rounded-lg border border-border bg-card p-3 hover:shadow-sm"
                  >
                    <p className="font-mono text-[11px] text-brand">{o.ref}</p>
                    <p className="mt-0.5 text-sm font-medium truncate">{o.client}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{o.item}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{o.city}</span>
                      {o.finalPrice && (
                        <span className="text-[11px] font-semibold">{o.finalPrice.toLocaleString("fr-FR")} MAD</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}