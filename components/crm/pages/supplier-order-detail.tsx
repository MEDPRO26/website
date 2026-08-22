"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { StatusBadge, Tag } from "@/components/dashboard/status-badge";
import { SupplierQuoteForm } from "@/components/crm/supplier-quote-form";
import { SupplierOrderSchedulingEditor } from "@/components/crm/supplier-order-scheduling-editor";
import { OrderClientRemarks } from "@/components/crm/order-client-remarks";
import { Card } from "@/components/ui/card";
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
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { resolveOrderItemPreview } from "@/lib/crm/resolve-order-item-link";
import {
  isServiceOrderType,
  orderShowsSchedulingFields,
  resolveOrderDuration,
  serviceOrderSchedulingComplete,
  supplierShouldDeliverOrder,
} from "@/lib/crm/order-scheduling";
import { SupplierDeliveryPrompt, SupplierDeliveredBanner, SupplierOrderStatusBox } from "@/components/crm/supplier-delivery-prompt";
import { getSupplierStatusLabels } from "@/lib/crm/order-status";
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
  AlertTriangle,
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
  const cancelByClient = useMutation(api.supplierPortal.cancelByClient);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
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
  const isService = isServiceOrderType(order.type);
  const statusLabels = getSupplierStatusLabels(isService);
  const canSubmitPrice = [
    "envoyee_fournisseur",
    "vue_fournisseur",
    "en_contact_client",
    ...(isService ? [] : ["en_cours"]),
    "prix_recu",
  ].includes(order.status);
  const supplierName = supplier?.name ?? staff?.name ?? "Fournisseur";
  const preview = resolveOrderItemPreview(order.type, order.item, customer?.city);
  const showScheduling = orderShowsSchedulingFields(order.type);
  const schedulingComplete = serviceOrderSchedulingComplete(order);
  const needsSchedulingInput =
    isService && showScheduling && !schedulingComplete && canSubmitPrice;
  const needsDelivery =
    clientContactVisible && supplierShouldDeliverOrder(order.status);
  const isDelivered = order.status === "terminee";
  const isCancelled = order.status === "annulee";

  const handleCancelByClient = async () => {
    setCancelling(true);
    try {
      await cancelByClient({ orderId: order._id });
      toast.success(
        "Commande annulée par le client — retirée des honoraires S2MBO."
      );
      setCancelOpen(false);
      router.push("/supplier/orders");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de marquer la commande comme annulée."
      );
    } finally {
      setCancelling(false);
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
        <SupplierDeliveredBanner
          orderType={order.type}
          cancelling={cancelling}
          onCancelByClient={() => setCancelOpen(true)}
        />
      ) : needsDelivery && !isCancelled ? (
        <SupplierDeliveryPrompt
          clientName={customer?.name}
          clientPhone={customer?.phone}
          orderRef={order.ref}
          item={order.item}
          orderType={order.type}
          orderId={order._id}
          orderStatus={order.status}
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
                      value={
                        resolveOrderDuration(order.duration, order.desiredDate) ??
                        "À confirmer avec le client"
                      }
                    />
                    <DetailField
                      label="Date souhaitée"
                      value={order.desiredDate?.trim() ? order.desiredDate : "À confirmer avec le client"}
                      icon={Calendar}
                    />
                    <DetailField
                      label="Créneau"
                      value={order.slot?.trim() ? order.slot : "À confirmer avec le client"}
                      icon={Clock}
                    />
                  </>
                ) : null}
              </div>

              {needsSchedulingInput ? (
                <SupplierOrderSchedulingEditor
                  orderId={order._id}
                  desiredDate={order.desiredDate}
                  slot={order.slot}
                />
              ) : null}

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="size-4 text-brand" />
                  {customer?.city ?? "—"}
                  {customer?.district ? ` · ${customer.district}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {clientContactVisible
                    ? "Coordonnées complètes dans la section Informations client."
                    : "Coordonnées client disponibles dès l'affectation au fournisseur."}
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
                  Les coordonnées du client seront visibles dès que la commande
                  vous est affectée par S2MBO.
                </p>
              </div>
            )}
          </Card>

          {!isDelivered && !isCancelled ? (
            <div
              className="space-y-4 rounded-2xl border-2 p-4 sm:p-5"
              style={{ backgroundColor: "#E8F3FE", borderColor: "#0D1220" }}
            >
              <div className="flex items-center justify-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-lg bg-[#2A8CF0]/15 text-[#2A8CF0]">
                  <AlertTriangle className="size-5" />
                </div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#2A8CF0]">
                  Important
                </p>
              </div>

              <SupplierOrderStatusBox
                orderId={order._id}
                orderStatus={order.status}
                orderType={order.type}
              />

              {canSubmitPrice ? (
                <div
                  role="alert"
                  className="flex items-start gap-4 rounded-xl border-2 border-amber-400 bg-amber-50 px-5 py-5 sm:px-6 sm:py-6"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-400/25 text-amber-800">
                    <AlertTriangle className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold leading-snug text-amber-950 sm:text-lg">
                      {isService
                        ? "Ne confirmez la prestation qu\u2019après paiement"
                        : "Ne confirmez la livraison qu\u2019après paiement"}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-amber-900/90 sm:text-[17px]">
                      {isService ? (
                        <>
                          Ne remplissez pas « Votre offre » et ne cliquez pas sur{" "}
                          <span className="font-semibold">
                            Confirmer la prestation
                          </span>{" "}
                          tant que vous n&apos;avez pas terminé le service et reçu
                          le paiement du client. Le client peut encore annuler la
                          commande.
                        </>
                      ) : (
                        <>
                          Ne remplissez pas « Votre offre » et ne cliquez pas sur{" "}
                          <span className="font-semibold">
                            Confirmer la livraison
                          </span>{" "}
                          tant que vous n&apos;avez pas livré le matériel et reçu
                          le paiement du client. Le client peut encore annuler la
                          commande en cours de route.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

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
                    orderDuration={resolveOrderDuration(
                      order.duration,
                      order.desiredDate
                    )}
                    orderSlot={order.slot}
                    schedulingComplete={schedulingComplete}
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
                            pricingMode: quote.pricingMode,
                            unitPrice: quote.unitPrice,
                            quantity: quote.quantity,
                            serviceInclusions: quote.serviceInclusions,
                            notes: quote.notes,
                            status: quote.status,
                          }
                        : null
                    }
                    onUnavailable={() => router.push("/supplier/orders")}
                    onCancelledByClient={() => router.push("/supplier/orders")}
                  />
                ) : (
                  <div className="space-y-4">
                    <StatusBadge
                      status={order.status as OrderStatus}
                      labels={statusLabels}
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

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Marquer comme annulée par le client ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              La commande {order.ref} passera en « Commande annulée par le
              client » et sera retirée de l&apos;onglet Honoraires.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Retour</AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              className="bg-status-error text-white hover:bg-status-error/90"
              onClick={(event) => {
                event.preventDefault();
                void handleCancelByClient();
              }}
            >
              {cancelling ? "…" : "Confirmer l'annulation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
