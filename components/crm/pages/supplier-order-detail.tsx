"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { StatusBadge, Tag } from "@/components/dashboard/status-badge";
import { SupplierQuoteForm } from "@/components/crm/supplier-quote-form";
import { OrderClientRemarks } from "@/components/crm/order-client-remarks";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { resolveOrderItemPreview } from "@/lib/crm/resolve-order-item-link";
import { orderShowsSchedulingFields, supplierShouldDeliverOrder } from "@/lib/crm/order-scheduling";
import { SupplierDeliveryPrompt, SupplierDeliveredBanner } from "@/components/crm/supplier-delivery-prompt";
import { SUPPLIER_STATUS_LABELS } from "@/lib/crm/order-status";
import type { OrderStatus } from "@/lib/mock-data";
import {
  MapPin,
  ArrowLeft,
  Package,
  Info,
  User,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SupplierOrderDetailPageProps = { orderId: string };

function formatReceivedAgo(createdAt: number) {
  const diffMs = Date.now() - createdAt;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Reçu à l'instant";
  if (minutes < 60) return `Reçu il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Reçu il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Reçu il y a ${days} j`;
}

function isUrgent(status: string) {
  return status === "envoyee_fournisseur" || status === "vue_fournisseur";
}

function durationLabel(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("location")) return "Durée de location";
  if (lower.includes("service")) return "Durée de prestation";
  return "Durée";
}

export function SupplierOrderDetailPage({ orderId }: SupplierOrderDetailPageProps) {
  const router = useRouter();
  const { canQuerySupplier, supplier, staff } = useSupplierSession();
  const markViewed = useMutation(api.supplierPortal.markViewed);
  const markAsDelivered = useMutation(api.supplierPortal.markAsDelivered);
  const [markingDelivered, setMarkingDelivered] = useState(false);
  const data = useQuery(
    api.supplierPortal.getOrder,
    canQuerySupplier ? { orderId: orderId as Id<"orders"> } : "skip"
  );

  useEffect(() => {
    if (!canQuerySupplier || !data?.order) {
      return;
    }
    if (data.order.status === "envoyee_fournisseur") {
      void markViewed({ orderId: data.order._id });
    }
  }, [canQuerySupplier, data?.order, markViewed]);

  if (data === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement de la commande…</p>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Commande introuvable.
        <div className="mt-2">
          <Link href="/supplier/orders" className="text-brand hover:underline">
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  const { order, customer, quote, clientContactVisible } = data;
  const canSubmitPrice = ["envoyee_fournisseur", "vue_fournisseur", "prix_recu"].includes(
    order.status
  );
  const supplierName = supplier?.name ?? staff?.name ?? "Fournisseur";
  const preview = resolveOrderItemPreview(order.type, order.item, customer?.city);
  const showScheduling = orderShowsSchedulingFields(order.type);
  const needsDelivery =
    clientContactVisible && supplierShouldDeliverOrder(order.status);
  const isDelivered = order.status === "terminee";

  const handleMarkDelivered = async () => {
    setMarkingDelivered(true);
    try {
      await markAsDelivered({ orderId: order._id });
      toast.success("Commande marquée comme livrée.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de confirmer la livraison."
      );
    } finally {
      setMarkingDelivered(false);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/supplier/orders"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" />
            Mes commandes
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {order.ref}
            </h1>
            {isUrgent(order.status) ? (
              <Tag tone="danger">URGENT</Tag>
            ) : null}
            <span className="text-sm text-muted-foreground">
              · {formatReceivedAgo(order.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:text-right">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{supplierName}</p>
            <p className="text-xs text-muted-foreground">Fournisseur certifié</p>
          </div>
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
            {supplierName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      </div>

      {isDelivered ? (
        <SupplierDeliveredBanner />
      ) : needsDelivery ? (
        <SupplierDeliveryPrompt
          clientName={customer?.name}
          clientPhone={customer?.phone}
          orderRef={order.ref}
          item={order.item}
          onMarkDelivered={handleMarkDelivered}
          markingDelivered={markingDelivered}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card className="overflow-hidden border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
              <div className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">
                <Info className="size-4" />
              </div>
              <h2 className="text-base font-semibold">Aperçu de la demande</h2>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-start gap-4">
                {preview.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview.image}
                    alt={preview.alt}
                    className="size-16 shrink-0 rounded-xl border border-border/60 bg-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-muted">
                    <Package className="size-6 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {order.type}
                  </p>
                  <p className="mt-0.5 text-lg font-semibold leading-snug">{order.item}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailField
                  label="Équipement"
                  value={order.item}
                  className={showScheduling ? undefined : "sm:col-span-2"}
                />
                {showScheduling ? (
                  <>
                    <DetailField
                      label={durationLabel(order.type)}
                      value={order.duration ?? "—"}
                    />
                    <DetailField
                      label="Date souhaitée"
                      value={order.desiredDate ?? "—"}
                      icon={Calendar}
                    />
                    <DetailField
                      label="Créneau"
                      value={order.slot ?? "—"}
                      icon={Clock}
                    />
                  </>
                ) : null}
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="size-4 text-brand" />
                  {customer?.city ?? "—"}
                  {customer?.district ? ` · ${customer.district}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {clientContactVisible
                    ? "Coordonnées complètes dans la section Informations client."
                    : "Quartier exact communiqué après validation du devis."}
                </p>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
              <div className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                <User className="size-4" />
              </div>
              <h2 className="text-base font-semibold">Informations client</h2>
            </div>

            {clientContactVisible ? (
              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
                <ClientInfoField
                  icon={User}
                  label="Nom"
                  value={customer?.name ?? "—"}
                />
                <ClientInfoField
                  icon={MapPin}
                  label="Ville"
                  value={
                    customer?.city
                      ? `${customer.city}${customer.district ? ` · ${customer.district}` : ""}`
                      : "—"
                  }
                />
                <ClientInfoField
                  icon={Phone}
                  label="Téléphone"
                  value={customer?.phone ?? "—"}
                />
              </div>
            ) : (
              <div className="p-5">
                <p className="text-sm text-muted-foreground">
                  Les coordonnées du client (nom, ville et téléphone) seront
                  visibles ici une fois le prix accepté par le client.
                </p>
              </div>
            )}
          </Card>

          {order.message ? (
            <Card
              id="patient-instructions"
              className="overflow-hidden border-0 bg-amber-50 p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="border-b border-amber-200/80 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                  ! Instructions patient
                </p>
              </div>
              <div className="px-5 py-4">
                <OrderClientRemarks
                  message={order.message}
                  className="border-amber-200/80 bg-white/70"
                  noteClassName="bg-white/40"
                />
              </div>
            </Card>
          ) : null}
        </div>

        <div className="xl:col-span-1">
          <div className="xl:sticky xl:top-6">
            <Card className="overflow-hidden border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <h2 className="text-lg font-semibold">Votre offre</h2>
                {canSubmitPrice ? (
                  <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                    Ouvert
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Fermé
                  </span>
                )}
              </div>

              <div className="p-5">
                {canSubmitPrice || quote ? (
                  <SupplierQuoteForm
                    orderId={order._id}
                    orderType={order.type}
                    orderDuration={order.duration}
                    variant="sidebar"
                    readOnly={!canSubmitPrice}
                    existingQuote={
                      quote
                        ? {
                            basePrice: quote.basePrice,
                            deliveryFee: quote.deliveryFee,
                            installFee: quote.installFee,
                            otherFee: quote.otherFee,
                            commissionAmount: quote.commissionAmount,
                            notes: quote.notes,
                            status: quote.status,
                          }
                        : null
                    }
                    onUnavailable={() => router.push("/supplier/orders")}
                  />
                ) : (
                  <div className="space-y-4">
                    <StatusBadge
                      status={order.status as OrderStatus}
                      labels={SUPPLIER_STATUS_LABELS}
                    />
                    <p className="text-sm text-muted-foreground">
                      Cette commande n&apos;accepte plus de nouveau prix fournisseur.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  icon?: typeof Calendar;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-muted/15 px-4 py-3",
        className
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-sm font-semibold leading-snug",
          Icon && "inline-flex items-center gap-1.5"
        )}
      >
        {Icon ? <Icon className="size-3.5 text-muted-foreground" /> : null}
        {value}
      </p>
    </div>
  );
}

function ClientInfoField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof User;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold leading-snug">
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
        {value}
      </p>
    </div>
  );
}
