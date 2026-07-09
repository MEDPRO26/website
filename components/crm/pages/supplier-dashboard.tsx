"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Clock3,
  Inbox,
  MapPin,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { resolveOrderItemPreview } from "@/lib/crm/resolve-order-item-link";
import { supplierShouldDeliverOrder } from "@/lib/crm/order-scheduling";
import { SupplierDeliveryPrompt } from "@/components/crm/supplier-delivery-prompt";
import {
  SupplierResponseCountdown,
  isSupplierResponseExpired,
} from "@/components/crm/supplier-response-countdown";
import { StatusBadge, Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PENDING_STATUSES: OrderStatus[] = [
  "envoyee_fournisseur",
  "vue_fournisseur",
  "prix_recu",
];

const AWAITING_CLIENT_STATUSES: OrderStatus[] = ["offre_envoyee"];

const INTERVENTION_STATUSES: OrderStatus[] = [
  "acceptee",
  "planifiee",
  "en_cours",
  "location_active",
];

function formatMad(amount: number) {
  return new Intl.NumberFormat("fr-MA", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function priorityTone(order: {
  status: string;
  type: string;
  hasQuote: boolean;
}) {
  if (
    order.status === "envoyee_fournisseur" ||
    order.status === "vue_fournisseur"
  ) {
    return "danger" as const;
  }
  if (
    order.type.toLowerCase().includes("location") ||
    order.status === "location_active"
  ) {
    return "success" as const;
  }
  return "warning" as const;
}

function priorityLabel(order: {
  status: string;
  type: string;
  hasQuote: boolean;
}) {
  const tone = priorityTone(order);
  if (tone === "danger") return "URGENT";
  if (tone === "success") return "RENOUVELLEMENT";
  return "STANDARD";
}

function ProductThumbnail({
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
        className="size-11 shrink-0 rounded-xl border border-border/60 bg-white object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted">
      <Package className="size-5 text-muted-foreground" />
    </div>
  );
}

function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "light",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <Card
      className={cn(
        "p-4 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]",
        isDark ? "bg-[#111827] text-white" : "bg-white"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-xs truncate",
              isDark ? "text-slate-300" : "text-muted-foreground"
            )}
          >
            {label}
          </p>
          <p className="mt-1 text-xl font-bold tracking-tight">{value}</p>
          {hint ? (
            <p
              className={cn(
                "mt-1 text-[11px] leading-snug",
                isDark ? "text-slate-400" : "text-muted-foreground"
              )}
            >
              {hint}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-2xl",
            isDark
              ? "bg-white/10 text-white"
              : "bg-brand-soft text-brand-deep"
          )}
        >
          <Icon className="size-[18px]" />
        </div>
      </div>
    </Card>
  );
}

type PriorityOrder = {
  _id: string;
  ref: string;
  type: string;
  item: string;
  city: string;
  district?: string;
  status: string;
  hasQuote: boolean;
  supplierAssignedAt?: number;
};

function PriorityOrderItem({ order }: { order: PriorityOrder }) {
  const router = useRouter();
  const claimOrder = useMutation(api.supplierPortal.claimOrder);
  const [claiming, setClaiming] = useState(false);

  const needsClaim =
    order.status === "envoyee_fournisseur" && !order.hasQuote;
  const hasDeadline = needsClaim && Boolean(order.supplierAssignedAt);
  const [expired, setExpired] = useState(
    () =>
      hasDeadline &&
      isSupplierResponseExpired(order.supplierAssignedAt!)
  );

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

  const actionButton = needsClaim ? (
    <Button
      size="sm"
      className="w-full rounded-xl sm:w-auto"
      disabled={claiming || expired}
      onClick={() => void handleClaim()}
    >
      {claiming ? "Réclamation…" : "Réclamer la commande"}
    </Button>
  ) : (
    <Button asChild size="sm" className="w-full rounded-xl sm:w-auto">
      <Link href={`/supplier/orders/${order._id}`}>
        {order.hasQuote ? "Voir détail" : "Voir la commande"}
      </Link>
    </Button>
  );

  const expiredBadge = (
    <span className="inline-flex w-full items-center justify-center rounded-xl bg-status-error/10 px-4 py-2.5 text-sm font-semibold text-status-error sm:w-auto">
      Commande épuisée
    </span>
  );

  return (
    <li className="px-5 py-4">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <ProductThumbnail type={order.type} item={order.item} city={order.city} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Tag tone={priorityTone(order)}>{priorityLabel(order)}</Tag>
            <span className="font-mono text-xs font-semibold text-brand">
              {order.ref}
            </span>
          </div>
          <p className="truncate font-medium">{order.item}</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            {order.district || order.city}
            {order.district ? ` · ${order.city}` : ""}
          </p>
        </div>

        <div className="hidden shrink-0 sm:flex sm:items-center sm:gap-4">
          {expired ? (
            expiredBadge
          ) : (
            <>
              {hasDeadline ? (
                <SupplierResponseCountdown
                  assignedAt={order.supplierAssignedAt!}
                  size="lg"
                  onExpire={() => setExpired(true)}
                />
              ) : null}
              {actionButton}
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:hidden">
        {expired ? (
          expiredBadge
        ) : (
          <>
            {hasDeadline ? (
              <SupplierResponseCountdown
                assignedAt={order.supplierAssignedAt!}
                size="lg"
                className="w-full"
                onExpire={() => setExpired(true)}
              />
            ) : null}
            {actionButton}
          </>
        )}
      </div>
    </li>
  );
}

function MissedOrderItem({
  order,
}: {
  order: {
    ref: string;
    type: string;
    item: string;
    city: string;
    district?: string;
    missedAt: number;
  };
}) {
  return (
    <li className="px-5 py-4 opacity-80">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <ProductThumbnail type={order.type} item={order.item} city={order.city} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Tag tone="danger">MANQUÉE</Tag>
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {order.ref}
            </span>
          </div>
          <p className="truncate font-medium text-muted-foreground">{order.item}</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            {order.district || order.city}
            {order.district ? ` · ${order.city}` : ""}
          </p>
        </div>
        <span className="hidden shrink-0 rounded-xl bg-status-error/10 px-4 py-2.5 text-sm font-semibold text-status-error sm:inline-flex">
          Commande épuisée
        </span>
      </div>
      <div className="mt-3 sm:hidden">
        <span className="inline-flex w-full items-center justify-center rounded-xl bg-status-error/10 px-4 py-2.5 text-sm font-semibold text-status-error">
          Commande épuisée
        </span>
      </div>
    </li>
  );
}

export function SupplierDashboardPage() {
  const { supplier, canQuerySupplier } = useSupplierSession();
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const stats = useQuery(
    api.supplierPortal.dashboardStats,
    canQuerySupplier ? { range } : "skip"
  );
  const allOrders = useQuery(
    api.supplierPortal.listOrders,
    canQuerySupplier ? {} : "skip"
  );
  const missedOrders = useQuery(
    api.supplierPortal.listMissedOrders,
    canQuerySupplier ? {} : "skip"
  );

  const priorityOrders = useMemo(() => {
    if (!allOrders) return [];
    return allOrders
      .filter((o) => PENDING_STATUSES.includes(o.status as OrderStatus))
      .sort((a, b) => {
        const aUrgent = priorityTone(a) === "danger" ? 0 : 1;
        const bUrgent = priorityTone(b) === "danger" ? 0 : 1;
        return aUrgent - bUrgent || b.createdAt - a.createdAt;
      })
      .slice(0, 5);
  }, [allOrders]);

  const awaitingClientOrders = useMemo(() => {
    if (!allOrders) return [];
    return allOrders
      .filter((o) => AWAITING_CLIENT_STATUSES.includes(o.status as OrderStatus))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 4);
  }, [allOrders]);

  const interventions = useMemo(() => {
    if (!allOrders) return [];
    return allOrders
      .filter((o) => INTERVENTION_STATUSES.includes(o.status as OrderStatus))
      .slice(0, 4);
  }, [allOrders]);

  const deliveryOrders = useMemo(() => {
    if (!allOrders) return [];
    return allOrders.filter(
      (order) =>
        order.clientContactVisible && supplierShouldDeliverOrder(order.status)
    );
  }, [allOrders]);

  if (stats === undefined || allOrders === undefined || missedOrders === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement du tableau de bord…</p>
    );
  }

  const rangeLabel =
    range === "7d"
      ? "7 derniers jours"
      : range === "30d"
        ? "Derniers 30 jours"
        : range === "90d"
          ? "Derniers 90 jours"
          : "Tout";

  const revenueHint =
    range === "all"
      ? "Commandes terminées (total)"
      : `Commandes terminées (${range.replace("d", " j")})`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Bonjour, {supplier?.name ?? "Fournisseur"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Voici l&apos;état de votre activité pour aujourd&apos;hui.
          </p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
          <SelectTrigger className="w-[220px] rounded-xl border-border/60 bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm">
            <SelectValue>{rangeLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">Derniers 30 jours</SelectItem>
            <SelectItem value="90d">Derniers 90 jours</SelectItem>
            <SelectItem value="all">Tout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashboardStatCard
          label="Nouvelles demandes"
          value={String(stats.newRequests).padStart(2, "0")}
          hint={
            stats.newRequests > 0
              ? `${stats.newRequests} à traiter`
              : "Aucune nouvelle demande"
          }
          icon={Inbox}
        />
        <DashboardStatCard
          label="Offres en attente"
          value={String(stats.pendingOffers).padStart(2, "0")}
          hint="En attente de validation"
          icon={Clock3}
        />
        <DashboardStatCard
          label="Commandes actives"
          value={String(stats.activeOrders).padStart(2, "0")}
          hint="En cours de livraison"
          icon={Truck}
        />
        <DashboardStatCard
          label="CA mensuel"
          value={`${formatMad(stats.monthlyRevenue)} MAD`}
          hint={
            stats.monthlyRevenue > 0
              ? revenueHint
              : "Aucun revenu ce mois"
          }
          icon={TrendingUp}
          tone="dark"
        />
      </div>

      {deliveryOrders.length > 0 ? (
        <div className="space-y-3">
          <SupplierDeliveryPrompt
            variant="banner"
            orderRef={deliveryOrders[0].ref}
            orderId={deliveryOrders[0]._id}
            clientName={deliveryOrders[0].clientName}
            item={deliveryOrders[0].item}
          />
          {deliveryOrders.length > 1 ? (
            <p className="text-center text-xs text-muted-foreground">
              {deliveryOrders.length} commande{deliveryOrders.length > 1 ? "s" : ""}{" "}
              à livrer —{" "}
              <Link href="/supplier/orders" className="font-medium text-brand hover:underline">
                voir toutes les commandes
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] xl:col-span-2">
          <div className="relative border-b border-border/60 px-5 py-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Demandes prioritaires
            </h2>
            <p className="mx-auto mt-2 max-w-md text-base font-medium text-muted-foreground sm:text-lg">
              Répondez rapidement pour gagner la commande
            </p>
            <Link
              href="/supplier/orders"
              className="absolute right-5 top-5 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              Voir tout
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {priorityOrders.length === 0 && missedOrders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Package className="mx-auto mb-3 size-10 text-muted-foreground/40" />
              <p className="font-medium">Aucune demande prioritaire</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Les nouvelles demandes apparaîtront ici.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {priorityOrders.map((order) => (
                <PriorityOrderItem key={order._id} order={order} />
              ))}
              {missedOrders.length > 0 ? (
                <>
                  {priorityOrders.length > 0 ? (
                    <li className="border-t border-border/60 bg-muted/20 px-5 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Commandes manquées ({missedOrders.length})
                      </p>
                    </li>
                  ) : null}
                  {missedOrders.slice(0, 5).map((order) => (
                    <MissedOrderItem key={order._id} order={order} />
                  ))}
                </>
              ) : null}
            </ul>
          )}
        </Card>

        <Card className="border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="text-base font-semibold">Suivi commandes</h2>
            <p className="text-xs text-muted-foreground">
              Offres envoyées et livraisons
            </p>
          </div>

          <div className="space-y-4 px-5 py-4">
            {awaitingClientOrders.length > 0 ? (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  En attente du client
                </p>
                <ul className="space-y-3">
                  {awaitingClientOrders.map((order) => (
                    <li key={order._id}>
                      <Link
                        href={`/supplier/orders/${order._id}`}
                        className="block rounded-xl border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted/60"
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-brand">
                            {order.ref}
                          </span>
                          <StatusBadge
                            status={order.status as OrderStatus}
                            labels={{
                              offre_envoyee: "Offre envoyée au client",
                            }}
                          />
                        </div>
                        <p className="text-sm font-medium leading-snug">
                          {order.item}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {order.city}
                          {order.district ? ` · ${order.district}` : ""}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {interventions.length > 0 ? (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  À livrer au client
                </p>
                <ul className="space-y-3">
                  {interventions.map((order) => (
                    <li key={order._id}>
                      <Link
                        href={`/supplier/orders/${order._id}`}
                        className="block rounded-xl border border-success/20 bg-success-soft/30 p-3 transition-colors hover:bg-success-soft/50"
                      >
                        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                          <Truck className="size-3.5" />
                          Livrer la commande au client
                        </p>
                        <p className="mt-1 font-mono text-[11px] font-semibold text-brand">
                          {order.ref}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-snug">
                          {order.item}
                        </p>
                        {order.clientContactVisible && order.clientName ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {order.clientName}
                            {order.clientPhone ? ` · ${order.clientPhone}` : ""}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {order.city}
                            {order.district ? ` · ${order.district}` : ""}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {awaitingClientOrders.length === 0 && interventions.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Aucun suivi en cours.
              </div>
            ) : null}
          </div>

          <div className="border-t border-dashed border-border/60 px-5 py-4">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl border-dashed"
            >
              <Link href="/supplier/orders">Voir toutes les commandes</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
