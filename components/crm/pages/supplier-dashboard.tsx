"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  CheckCircle2,
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
import { Tag } from "@/components/dashboard/status-badge";
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
        "p-3 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]",
        isDark ? "bg-[#111827] text-white" : "bg-white"
      )}
    >
      <div className="flex flex-col items-center text-center">
        <p
          className={cn(
            "w-full text-[11px] font-medium leading-snug",
            isDark ? "text-slate-300" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
        <div
          className={cn(
            "mt-1.5 grid size-8 place-items-center rounded-xl",
            isDark
              ? "bg-white/10 text-white"
              : "bg-brand-soft text-brand-deep"
          )}
        >
          <Icon className="size-4" />
        </div>
        <p className="mt-1.5 text-lg font-bold tracking-tight leading-none">{value}</p>
        {hint ? (
          <p
            className={cn(
              "mt-1 text-[10px] leading-snug line-clamp-1",
              isDark ? "text-slate-400" : "text-muted-foreground"
            )}
          >
            {hint}
          </p>
        ) : null}
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

  const orderStatusCounts = useMemo(() => {
    const list = allOrders ?? [];
    return {
      nouvelle: list.filter((o) =>
        ["envoyee_fournisseur", "vue_fournisseur", "prix_recu"].includes(o.status)
      ).length,
      enContact: list.filter((o) => o.status === "en_contact_client").length,
      enLivraison: list.filter((o) =>
        ["en_cours", "acceptee", "planifiee", "location_active"].includes(o.status)
      ).length,
      livree: list.filter((o) => o.status === "terminee").length,
    };
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

  const deliveredHint =
    range === "all"
      ? "Toutes les commandes livrées"
      : `Livrées sur ${range.replace("d", " j")}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
            Bonjour, {supplier?.name ?? "Fournisseur"}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Voici l&apos;état de votre activité pour aujourd&apos;hui.
          </p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
          <SelectTrigger className="w-[220px] rounded-xl border-border/60 bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm">
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

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
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
          label="En attente de livraison"
          value={String(stats.awaitingDelivery).padStart(2, "0")}
          hint={
            stats.awaitingDelivery > 0
              ? `${stats.awaitingDelivery} à livrer`
              : "Aucune livraison en attente"
          }
          icon={Truck}
        />
        <DashboardStatCard
          label="Commandes livrées"
          value={String(stats.delivered).padStart(2, "0")}
          hint={
            stats.delivered > 0
              ? deliveredHint
              : "Aucune commande livrée"
          }
          icon={CheckCircle2}
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] xl:col-span-2">
          <div className="relative border-b border-border/60 px-4 py-4 text-center sm:px-5 sm:py-5">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Demandes prioritaires
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm font-medium text-muted-foreground sm:text-base">
              Répondez rapidement pour gagner la commande
            </p>
            <Link
              href="/supplier/orders"
              className="absolute right-4 top-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline sm:right-5 sm:top-5"
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
              Nombre de commandes par statut
            </p>
          </div>

          <ul className="divide-y divide-border/60 px-2 py-1">
            {[
              {
                label: "Nouvelle commande",
                count: orderStatusCounts.nouvelle,
                href: "/supplier/orders?status=envoyee_fournisseur",
                tone: "text-brand",
                bg: "bg-brand/10",
              },
              {
                label: "En contact avec le client",
                count: orderStatusCounts.enContact,
                href: "/supplier/orders?status=en_contact_client",
                tone: "text-info",
                bg: "bg-info-soft",
              },
              {
                label: "En cours de livraison",
                count: orderStatusCounts.enLivraison,
                href: "/supplier/orders?status=en_cours",
                tone: "text-success",
                bg: "bg-success-soft",
              },
              {
                label: "Commande livrée",
                count: orderStatusCounts.livree,
                href: "/supplier/orders?status=terminee",
                tone: "text-muted-foreground",
                bg: "bg-muted",
              },
            ].map((row) => (
              <li key={row.label}>
                <Link
                  href={row.href}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-muted/40"
                >
                  <span className="text-sm font-medium text-foreground">
                    {row.label}
                  </span>
                  <span
                    className={cn(
                      "inline-flex min-w-8 items-center justify-center rounded-full px-2.5 py-1 text-sm font-bold tabular-nums",
                      row.bg,
                      row.tone
                    )}
                  >
                    {String(row.count).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

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
