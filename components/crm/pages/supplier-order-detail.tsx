"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SupplierQuoteForm } from "@/components/crm/supplier-quote-form";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import type { OrderStatus } from "@/lib/mock-data";
import { MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";

type SupplierOrderDetailPageProps = { orderId: string };

export function SupplierOrderDetailPage({ orderId }: SupplierOrderDetailPageProps) {
  const { canQuerySupplier } = useSupplierSession();
  const markViewed = useMutation(api.supplierPortal.markViewed);
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

  const { order, customer, quote } = data;
  const canSubmitPrice = ["envoyee_fournisseur", "vue_fournisseur", "prix_recu"].includes(
    order.status
  );

  return (
    <div className="space-y-4 pb-8">
      <Link
        href="/supplier/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" /> Mes commandes
      </Link>
      <PageHeader
        title={order.ref}
        description={`${order.type} · à livrer le ${order.desiredDate ?? "—"}`}
        actions={<StatusBadge status={order.status as OrderStatus} />}
      />

      <Card className="space-y-2 p-4">
        <h3 className="text-sm font-semibold">Demande</h3>
        <p className="font-medium">{order.item}</p>
        <p className="text-sm text-muted-foreground">
          Durée : {order.duration ?? "—"}
        </p>
        <div className="grid grid-cols-1 gap-2 pt-1 text-sm text-muted-foreground sm:grid-cols-2">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {customer?.city ?? "—"}
            {customer?.district ? ` · ${customer.district}` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" /> {order.desiredDate ?? "—"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {order.slot ?? "—"}
          </span>
        </div>
        {order.message ? (
          <div className="rounded-lg bg-muted/40 p-3 text-sm">
            <p className="mb-1 text-xs text-muted-foreground">Message client (filtré)</p>
            {order.message}
          </div>
        ) : null}
      </Card>

      {canSubmitPrice ? (
        <Card className="space-y-3 p-4">
          <div>
            <h3 className="text-sm font-semibold">Prix fournisseur & offre client</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Saisissez vos frais et la commission SOS Santé que vous nous reverserez.
            </p>
          </div>
          <SupplierQuoteForm
            orderId={order._id}
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
          />
        </Card>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">
          Cette commande n&apos;accepte plus de nouveau prix fournisseur.
        </Card>
      )}
    </div>
  );
}
