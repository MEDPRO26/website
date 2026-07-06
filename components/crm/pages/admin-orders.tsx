"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useAdminSession } from "@/hooks/use-admin-session";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { mapConvexOrderToUi } from "@/lib/crm/map-convex-order";
import { STATUS_LABEL, type Order, type OrderStatus } from "@/lib/mock-data";
import { cities } from "@/lib/cities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatOrderPagePath } from "@/lib/crm/format-page-path";
import {
  Search, LayoutGrid, List, Filter, X, Clock, MapPin, BriefcaseMedical, MoreHorizontal, Plus, Trash2,
} from "lucide-react";
import { toast } from "sonner";

type KanbanOrder = Order & { createdAtTs: number };

type DeleteTarget = {
  id: Id<"orders">;
  ref: string;
  client: string;
};

const KANBAN_COLUMNS: OrderStatus[] = [
  "nouvelle", "a_qualifier", "a_affecter", "envoyee_fournisseur",
  "prix_recu", "offre_envoyee", "acceptee", "en_cours", "terminee", "annulee",
];

const SOURCE_FILTERS = [
  { value: "site", label: "Formulaire site", match: (source: string) =>
    source.toLowerCase().includes("formulaire") },
  { value: "whatsapp", label: "WhatsApp", match: (source: string) =>
    source.toLowerCase().includes("whatsapp") },
  { value: "call", label: "Appel", match: (source: string) =>
    source.toLowerCase().includes("appel") },
] as const;

function filterOrders(
  orders: Order[],
  searchQuery: string,
  statusFilter: string,
  cityFilter: string,
  sourceFilter: string
) {
  const q = searchQuery.trim().toLowerCase();
  const sourceMatcher = SOURCE_FILTERS.find((item) => item.value === sourceFilter)?.match;

  return orders.filter((order) => {
    const matchesSearch =
      !q ||
      order.ref.toLowerCase().includes(q) ||
      order.client.toLowerCase().includes(q) ||
      order.phone.replace(/\s+/g, "").includes(q.replace(/\s+/g, ""));

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    const matchesCity =
      cityFilter === "all" ||
      order.city.toLowerCase().includes(cityFilter);

    const matchesSource =
      sourceFilter === "all" || (sourceMatcher?.(order.source) ?? false);

    return matchesSearch && matchesStatus && matchesCity && matchesSource;
  });
}

export function AdminOrdersPage() {
  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { canQueryAdmin, staff } = useAdminSession();
  const canDeleteOrder = staff?.role === "super_admin";
  const removeOrder = useMutation(api.orders.remove);
  const ordersData = useQuery(api.orders.list, canQueryAdmin ? {} : "skip");
  const orders = useMemo<KanbanOrder[]>(
    () =>
      ordersData
        ? ordersData.map((order) => ({
            ...mapConvexOrderToUi(order),
            createdAtTs: order.createdAt,
          }))
        : [],
    [ordersData]
  );
  const filteredOrders = useMemo(
    () => filterOrders(orders, searchQuery, statusFilter, cityFilter, sourceFilter),
    [orders, searchQuery, statusFilter, cityFilter, sourceFilter]
  );
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    cityFilter !== "all" ||
    sourceFilter !== "all";
  const isLoading = ordersData === undefined;

  const description = isLoading
    ? "Chargement des demandes…"
    : hasActiveFilters
      ? `${filteredOrders.length} sur ${orders.length} demande${orders.length > 1 ? "s" : ""}`
      : `${orders.length} demande${orders.length > 1 ? "s" : ""} reçue${orders.length > 1 ? "s" : ""} via le site`;

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setCityFilter("all");
    setSourceFilter("all");
  }

  const requestDelete = (order: Pick<Order, "id" | "ref" | "client">) => {
    setDeleteTarget({
      id: order.id as Id<"orders">,
      ref: order.ref,
      client: order.client,
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await removeOrder({ id: deleteTarget.id });
      toast.success(`${deleteTarget.ref} a été supprimée.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer cette commande."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Commandes"
        description={description}
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
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (référence, client, téléphone)…"
              className="h-9 pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[170px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {KANBAN_COLUMNS.map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.slug} value={city.slug}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sources</SelectItem>
              {SOURCE_FILTERS.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="size-3.5" /> Effacer
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <Filter className="size-3.5" /> Plus de filtres
            </Button>
          )}
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Chargement des demandes…
        </Card>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Aucune demande pour le moment. Les formulaires du site apparaîtront ici
          en temps réel.
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Aucune demande ne correspond à ces filtres.
          {hasActiveFilters ? (
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            </div>
          ) : null}
        </Card>
      ) : view === "table" ? (
        <OrdersTable
          orders={filteredOrders}
          canDeleteOrder={canDeleteOrder}
          onDelete={requestDelete}
        />
      ) : (
        <OrdersKanban
          orders={filteredOrders}
          canDeleteOrder={canDeleteOrder}
          onDelete={requestDelete}
        />
      )}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette commande ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  La commande{" "}
                  <span className="font-medium text-foreground">{deleteTarget.ref}</span>{" "}
                  ({deleteTarget.client}) sera définitivement supprimée avec son
                  historique, devis et offres associés.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-status-error text-white hover:bg-status-error/90"
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function OrdersTable({
  orders,
  canDeleteOrder,
  onDelete,
}: {
  orders: Order[];
  canDeleteOrder: boolean;
  onDelete: (order: Pick<Order, "id" | "ref" | "client">) => void;
}) {
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
              <th className="py-2.5 font-medium">Statut</th>
              <th className="py-2.5 font-medium text-right">Date</th>
              {canDeleteOrder ? (
                <th className="px-4 py-2.5 font-medium text-right">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
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
                  {o.district ? (
                    <div className="text-xs text-muted-foreground">{o.district}</div>
                  ) : null}
                </td>
                <td className="py-3 text-muted-foreground">{o.type}</td>
                <td className="py-3 text-xs">{o.source}</td>
                <td className="py-3"><StatusBadge status={o.status} /></td>
                <td className="py-3 text-right text-xs text-muted-foreground whitespace-nowrap">{o.createdAt}</td>
                {canDeleteOrder ? (
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-status-error hover:bg-status-error/10 hover:text-status-error"
                      onClick={() => onDelete(o)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function OrdersKanban({
  orders,
  canDeleteOrder,
  onDelete,
}: {
  orders: KanbanOrder[];
  canDeleteOrder: boolean;
  onDelete: (order: Pick<Order, "id" | "ref" | "client">) => void;
}) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {KANBAN_COLUMNS.map((status) => {
          const items = orders.filter((order) => order.status === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              orders={items}
              canDeleteOrder={canDeleteOrder}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-blue-500 text-white",
  "bg-orange-500 text-white",
  "bg-emerald-500 text-white",
  "bg-violet-500 text-white",
];

function formatTimeAgo(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}j`;
}

function initials(name: string) {
  if (!name || name === "Non assigné") {
    return "";
  }
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function avatarColor(name: string) {
  let hash = 0;
  for (const char of name) {
    hash = (hash + char.charCodeAt(0)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash];
}

function priorityBarClass(status: OrderStatus, createdAtTs: number) {
  const ageHours = (Date.now() - createdAtTs) / 3_600_000;
  if (status === "nouvelle" && ageHours < 2) {
    return "bg-red-500";
  }
  if (status === "nouvelle" || status === "a_qualifier") {
    return "bg-amber-400";
  }
  if (status === "a_affecter") {
    return "bg-orange-400";
  }
  return "bg-brand";
}

function KanbanColumn({
  status,
  orders,
  canDeleteOrder,
  onDelete,
}: {
  status: OrderStatus;
  orders: KanbanOrder[];
  canDeleteOrder: boolean;
  onDelete: (order: Pick<Order, "id" | "ref" | "client">) => void;
}) {
  return (
    <div className="flex w-[300px] shrink-0 flex-col">
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <h3 className="text-sm font-semibold text-foreground">{STATUS_LABEL[status]}</h3>
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {orders.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {orders.map((order) => (
          <KanbanCard
            key={order.id}
            order={order}
            canDeleteOrder={canDeleteOrder}
            onDelete={onDelete}
          />
        ))}

        <Link
          href="/admin/orders/new"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/80 bg-card/50 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-brand/30 hover:bg-brand-soft/20 hover:text-brand-deep"
        >
          <Plus className="size-3.5" />
          Nouvelle fiche
        </Link>
      </div>
    </div>
  );
}

function KanbanCard({
  order,
  canDeleteOrder,
  onDelete,
}: {
  order: KanbanOrder;
  canDeleteOrder: boolean;
  onDelete: (order: Pick<Order, "id" | "ref" | "client">) => void;
}) {
  const assignees = [order.assistant, order.supplier].filter(
    (name): name is string => Boolean(name && name !== "Non assigné")
  );
  const location = order.district
    ? `${order.city} · ${order.district}`
    : order.city;

  return (
    <div className="group flex overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("w-1 shrink-0", priorityBarClass(order.status, order.createdAtTs))} />
      <div className="min-w-0 flex-1">
        <Link href={`/admin/orders/${order.id}`} className="block p-3 pb-2.5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-[11px] font-medium text-muted-foreground">
              {order.ref}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              {formatTimeAgo(order.createdAtTs)}
            </span>
          </div>

          <p className="mt-1.5 truncate text-sm font-semibold text-foreground">{order.client}</p>

          <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <BriefcaseMedical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/80" />
            <div className="min-w-0 flex-1">
              <span className="block truncate">{order.item || order.type}</span>
              {order.pagePath ? (
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground/70">
                  {formatOrderPagePath(order.pagePath)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground/80" />
            <span className="truncate">{location}</span>
          </div>
        </Link>

        <div className="flex items-center justify-between border-t border-border/60 px-3 pb-3 pt-2.5">
          <div className="flex -space-x-2">
            {assignees.length > 0 ? (
              assignees.slice(0, 2).map((name) => (
                <Avatar key={name} className="size-7 border-2 border-card">
                  <AvatarFallback
                    className={cn("text-[10px] font-semibold", avatarColor(name))}
                  >
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground/70">Non assigné</span>
            )}
          </div>
          {canDeleteOrder ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
                  aria-label="Actions commande"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/orders/${order.id}`}>Voir la commande</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-status-error focus:text-status-error"
                  onSelect={() => onDelete(order)}
                >
                  <Trash2 className="size-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={`/admin/orders/${order.id}`}
              className="rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
              aria-label="Voir la commande"
            >
              <MoreHorizontal className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
