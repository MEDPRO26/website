"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  FileText,
  Filter,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  SupplierResponseCountdown,
  isSupplierResponseExpired,
} from "@/components/crm/supplier-response-countdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { resolveOrderItemPreview } from "@/lib/crm/resolve-order-item-link";
import { getSupplierStatusLabel, SUPPLIER_STATUS_LABELS } from "@/lib/crm/order-status";
import { orderShowsSchedulingFields } from "@/lib/crm/order-scheduling";
import { type OrderStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

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

const SUPPLIER_STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "À répondre" },
  { value: "active", label: "En cours de livraison" },
  { value: "missed", label: "Commandes manquées" },
  { value: "done", label: "Terminées" },
  ...[
    "envoyee_fournisseur",
    "vue_fournisseur",
    "prix_recu",
    "offre_envoyee",
    "acceptee",
    "en_cours",
    "terminee",
  ].map((status) => ({
    value: status,
    label: getSupplierStatusLabel(status as OrderStatus),
  })),
];

type SupplierOrder = {
  _id: string;
  ref: string;
  type: string;
  item: string;
  duration?: string;
  desiredDate?: string;
  status: string;
  city: string;
  district: string;
  hasQuote: boolean;
  createdAt: number;
  clientContactVisible?: boolean;
  clientName?: string;
  clientPhone?: string;
  isMissed?: boolean;
  missedAt?: number;
  supplierAssignedAt?: number;
};

function formatOrderDate(ts: number) {
  const date = new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const orderDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const diffDays = Math.floor(
    (today.getTime() - orderDay.getTime()) / 86_400_000
  );
  if (diffDays === 0) return `Aujourd'hui, ${time}`;
  if (diffDays === 1) return `Hier, ${time}`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function typeLabel(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("location")) return "LOCATION";
  if (lower.includes("vente")) return "VENTE";
  if (lower.includes("soin")) return "SOINS";
  if (lower.includes("garde")) return "GARDE";
  if (lower.includes("aide")) return "AIDE";
  return type.slice(0, 12).toUpperCase();
}

function matchesStatusFilter(
  status: string,
  filter: string,
  isMissed?: boolean
) {
  if (filter === "missed") return Boolean(isMissed);
  if (isMissed) return filter === "all";
  if (filter === "all") return true;
  if (filter === "pending") return PENDING_STATUSES.includes(status as OrderStatus);
  if (filter === "active") return ACTIVE_STATUSES.includes(status as OrderStatus);
  if (filter === "done") return DONE_STATUSES.includes(status as OrderStatus);
  return status === filter;
}

function StatSummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  badge,
  badgeTone = "neutral",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  badgeTone?: "success" | "danger" | "neutral";
}) {
  const badgeClass =
    badgeTone === "success"
      ? "bg-success-soft text-success"
      : badgeTone === "danger"
        ? "bg-danger-soft text-danger"
        : "bg-muted text-muted-foreground";

  return (
    <Card className="border-0 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="min-w-0 truncate text-xs text-muted-foreground">{label}</p>
            {badge ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  badgeClass
                )}
              >
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
            {typeof value === "number" ? String(value).padStart(2, "0") : value}
          </p>
          {hint ? (
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-deep">
          <Icon className="size-[18px]" />
        </div>
      </div>
    </Card>
  );
}

export function SupplierOrdersPage() {
  const searchParams = useSearchParams();
  const { supplier, canQuerySupplier } = useSupplierSession();
  const allOrders = useQuery(
    api.supplierPortal.listOrders,
    canQuerySupplier ? {} : "skip"
  );
  const missedOrders = useQuery(
    api.supplierPortal.listMissedOrders,
    canQuerySupplier ? {} : "skip"
  );

  const combinedOrders = useMemo(() => {
    const active = allOrders ?? [];
    const missed = (missedOrders ?? []).map((order) => ({
      ...order,
      _id: order._id,
      duration: undefined as string | undefined,
      desiredDate: undefined as string | undefined,
      clientContactVisible: false,
    }));
    return [...active, ...missed].sort((a, b) => b.createdAt - a.createdAt);
  }, [allOrders, missedOrders]);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("tab") === "active"
      ? "active"
      : searchParams.get("tab") === "pending"
        ? "pending"
        : searchParams.get("tab") === "done"
          ? "done"
          : "all"
  );
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    const tab = searchParams.get("tab");
    if (tab === "active" || tab === "pending" || tab === "done" || tab === "missed") {
      setStatusFilter(tab);
    }
  }, [searchParams]);

  const stats = useMemo(() => {
    const list = allOrders ?? [];
    const missed = missedOrders ?? [];
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const dayStart = startOfDay.getTime();

    const toRespond = list.filter(
      (order) =>
        PENDING_STATUSES.includes(order.status as OrderStatus) && !order.hasQuote
    );
    const urgent = list.filter((order) => order.status === "envoyee_fournisseur");

    return {
      totalToday: list.filter((order) => order.createdAt >= dayStart).length,
      toRespond: toRespond.length,
      urgent: urgent.length,
      active: list.filter((order) =>
        ACTIVE_STATUSES.includes(order.status as OrderStatus)
      ).length,
      pricesSent: list.filter((order) => order.hasQuote).length,
      missed: missed.length,
    };
  }, [allOrders, missedOrders]);

  const filteredOrders = useMemo(() => {
    if (!allOrders || missedOrders === undefined) return [];
    const q = query.trim().toLowerCase();

    return combinedOrders.filter((order) => {
      const matchesQuery =
        !q ||
        order.ref.toLowerCase().includes(q) ||
        order.item.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q) ||
        order.type.toLowerCase().includes(q);

      const matchesStatus = matchesStatusFilter(
        order.status,
        statusFilter,
        order.isMissed
      );

      const dateTs = order.isMissed ? order.missedAt ?? order.createdAt : order.createdAt;
      const matchesDate =
        !dateFilter ||
        new Date(dateTs).toISOString().slice(0, 10) === dateFilter;

      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [combinedOrders, allOrders, missedOrders, query, statusFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, dateFilter]);

  if (allOrders === undefined || missedOrders === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement des commandes…</p>
    );
  }

  const rangeStart =
    filteredOrders.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredOrders.length);

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Gestion des commandes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {supplier?.name ?? "Fournisseur"} · {combinedOrders.length} commande
          {combinedOrders.length > 1 ? "s" : ""} au total
          {stats.missed > 0 ? ` · ${stats.missed} manquée${stats.missed > 1 ? "s" : ""}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatSummaryCard
          label="Total aujourd'hui"
          value={stats.totalToday}
          hint={
            stats.totalToday > 0
              ? "Nouvelles demandes reçues"
              : "Aucune demande aujourd'hui"
          }
          icon={CalendarDays}
          badge={stats.totalToday > 0 ? "+ jour" : undefined}
          badgeTone="success"
        />
        <StatSummaryCard
          label="À répondre"
          value={stats.toRespond}
          hint="En attente de votre prix"
          icon={ClipboardList}
          badge={stats.urgent > 0 ? "Urgent" : undefined}
          badgeTone="danger"
        />
        <StatSummaryCard
          label="Prix envoyés"
          value={stats.pricesSent}
          hint="Devis soumis au client"
          icon={FileText}
        />
        <StatSummaryCard
          label="En cours de livraison"
          value={stats.active}
          hint="Commandes actives"
          icon={Truck}
        />
      </div>

      <Card className="border-0 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Recherche
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une référence, un matériel…"
                className="h-10 bg-white pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Statut
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full lg:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_STATUS_FILTERS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Date
            </label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 w-full lg:w-[160px]"
            />
          </div>
          <Button
            type="button"
            className="h-10 rounded-xl bg-[#1e293b] text-white hover:bg-[#0f172a]"
            onClick={() => setPage(1)}
          >
            <Filter className="size-4" />
            Filtrer
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold">Liste des commandes</h2>
          <p className="text-xs text-muted-foreground">
            {filteredOrders.length} résultat{filteredOrders.length > 1 ? "s" : ""}
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-medium">Aucune commande trouvée</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Modifiez les filtres ou la recherche.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-muted/30">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3">Référence</th>
                    <th className="px-3 py-3">Type / Matériel</th>
                    <th className="px-3 py-3">Ville / Quartier</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Statut</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageOrders.map((order) => (
                    <SupplierOrderRow key={order._id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4">
              <p className="text-xs text-muted-foreground">
                Affichage de {rangeStart} à {rangeEnd} sur {filteredOrders.length}{" "}
                commande{filteredOrders.length > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="size-8"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      type="button"
                      size="sm"
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      className={cn(
                        "size-8 px-0",
                        pageNumber === currentPage && "bg-brand hover:bg-brand-deep"
                      )}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="size-8"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function OrderItemThumbnail({
  type,
  item,
  city,
}: {
  type: string;
  item: string;
  city?: string;
}) {
  const preview = resolveOrderItemPreview(type, item, city);

  if (preview.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={preview.image}
        alt={preview.alt}
        className="size-10 shrink-0 rounded-lg border border-border/60 bg-white object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
      <Package className="size-4 text-muted-foreground" />
    </div>
  );
}

function SupplierOrderRow({ order }: { order: SupplierOrder }) {
  const router = useRouter();
  const claimOrder = useMutation(api.supplierPortal.claimOrder);
  const [claiming, setClaiming] = useState(false);

  const location = order.district
    ? `${order.city} (${order.district})`
    : order.city;

  const needsClaim =
    !order.isMissed &&
    order.status === "envoyee_fournisseur" &&
    !order.hasQuote;
  const showCountdown = needsClaim && Boolean(order.supplierAssignedAt);
  const [expired, setExpired] = useState(
    () =>
      showCountdown &&
      isSupplierResponseExpired(order.supplierAssignedAt!)
  );

  const needsResponse =
    !order.isMissed &&
    PENDING_STATUSES.includes(order.status as OrderStatus) &&
    !order.hasQuote &&
    !expired;
  const showScheduling = orderShowsSchedulingFields(order.type);
  const displayDate = order.isMissed
    ? order.missedAt ?? order.createdAt
    : order.createdAt;

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await claimOrder({ orderId: order._id as Id<"orders"> });
      toast.success("Commande réclamée — vous en prenez charge.");
      router.push(`/supplier/orders/${order._id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de réclamer la commande."
      );
    } finally {
      setClaiming(false);
    }
  };

  return (
    <tr className={cn(
      "border-t border-border/60 transition-colors hover:bg-muted/20",
      order.isMissed && "opacity-75"
    )}>
      <td className="px-5 py-4">
        {order.isMissed ? (
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {order.ref}
          </span>
        ) : (
          <Link
            href={`/supplier/orders/${order._id}`}
            className="font-mono text-xs font-semibold text-brand hover:underline"
          >
            {order.ref}
          </Link>
        )}
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <OrderItemThumbnail
            type={order.type}
            item={order.item}
            city={order.city}
          />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-brand">
              {typeLabel(order.type)}
            </p>
            <p className="mt-0.5 font-medium text-foreground">{order.item}</p>
            {showScheduling && order.duration ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{order.duration}</p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="min-w-0">
          <p className="truncate font-medium">{location}</p>
          {showScheduling && order.desiredDate ? (
            <p className="truncate text-xs text-muted-foreground">
              Souhait : {order.desiredDate}
            </p>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" />
          {formatOrderDate(displayDate)}
        </span>
      </td>
      <td className="px-3 py-4">
        {order.isMissed || (needsClaim && expired) ? (
          <span className="inline-flex rounded-full bg-status-error/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-status-error">
            Commande épuisée
          </span>
        ) : (
          <StatusBadge
            status={order.status as OrderStatus}
            labels={SUPPLIER_STATUS_LABELS}
          />
        )}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          {order.isMissed ? (
            <span className="text-xs text-muted-foreground">—</span>
          ) : needsClaim && expired ? (
            <span className="rounded-lg bg-status-error/10 px-3 py-1.5 text-xs font-semibold text-status-error">
              Commande épuisée
            </span>
          ) : (
            <>
              {showCountdown ? (
                <SupplierResponseCountdown
                  assignedAt={order.supplierAssignedAt!}
                  size="sm"
                  onExpire={() => setExpired(true)}
                />
              ) : null}
              {needsClaim ? (
                <Button
                  type="button"
                  size="sm"
                  className="h-8 rounded-lg px-3 text-xs"
                  disabled={claiming}
                  onClick={() => void handleClaim()}
                >
                  {claiming ? "…" : "Réclamer la commande"}
                </Button>
              ) : needsResponse ? (
                <Button
                  asChild
                  size="sm"
                  className="h-8 rounded-lg px-3 text-xs"
                >
                  <Link href={`/supplier/orders/${order._id}`}>Répondre</Link>
                </Button>
              ) : null}
              <Button
                asChild
                size="icon"
                variant="ghost"
                className="size-8 text-muted-foreground hover:text-brand"
              >
                <Link href={`/supplier/orders/${order._id}`} aria-label="Voir la commande">
                  <Eye className="size-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
