"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Check, MessageCircle, PackageCheck, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { telUrl, whatsAppUrl } from "@/lib/crm/phone-links";
import { supplierIsEarlyClientContactPhase } from "@/lib/crm/order-scheduling";
import { cn } from "@/lib/utils";

type SupplierDeliveryPromptProps = {
  clientName?: string;
  clientPhone?: string;
  orderRef?: string;
  item?: string;
  orderId?: string;
  orderStatus?: string;
  variant?: "banner" | "card" | "compact" | "delivered";
  className?: string;
};

function contactMessage(clientName?: string, item?: string, orderStatus?: string) {
  const who = clientName?.trim() ? clientName.trim() : "le client";
  const what = item?.trim() ? ` « ${item.trim()} »` : "";
  if (orderStatus && supplierIsEarlyClientContactPhase(orderStatus)) {
    return `Contactez ${who} pour organiser la livraison${what}, puis confirmez-la dans le formulaire.`;
  }
  return `Contactez ${who} pour organiser la livraison${what}.`;
}

function contactTitle(orderStatus?: string) {
  if (orderStatus === "en_cours") {
    return "En cours de livraison";
  }
  if (orderStatus === "en_contact_client") {
    return "En contact avec le client";
  }
  if (orderStatus && supplierIsEarlyClientContactPhase(orderStatus)) {
    return "Contactez le client";
  }
  return "Livrez la commande au client";
}

export function SupplierDeliveryPrompt({
  clientName,
  clientPhone,
  orderRef,
  item,
  orderId,
  orderStatus,
  variant = "card",
  className,
}: SupplierDeliveryPromptProps) {
  const phone = clientPhone?.trim();
  const message = contactMessage(clientName, item, orderStatus);
  const title = contactTitle(orderStatus);
  const whatsappIntro =
    orderStatus && supplierIsEarlyClientContactPhase(orderStatus)
      ? `Bonjour ${clientName?.split(" ")[0] ?? ""}, je vous contacte au sujet de votre demande${orderRef ? ` ${orderRef}` : ""}${item ? ` (${item})` : ""}.`
      : `Bonjour ${clientName?.split(" ")[0] ?? ""}, nous organisons la livraison de votre commande${orderRef ? ` ${orderRef}` : ""}.`;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-lg border border-success/25 bg-success-soft/50 px-2.5 py-2",
          className
        )}
      >
        <p className="inline-flex items-start gap-1.5 text-[11px] font-semibold leading-snug text-success">
          <Truck className="mt-0.5 size-3 shrink-0" />
          À livrer — contactez le client
        </p>
      </div>
    );
  }

  if (variant === "delivered") {
    return (
      <div
        className={cn(
          "rounded-lg border border-success/25 bg-success-soft/50 px-2.5 py-2",
          className
        )}
      >
        <p className="inline-flex items-start gap-1.5 text-[11px] font-semibold leading-snug text-success">
          <PackageCheck className="mt-0.5 size-3 shrink-0" />
          Commande livrée
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex flex-col gap-2.5 rounded-2xl border border-success/25 bg-gradient-to-r from-success-soft/80 to-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4",
          className
        )}
      >
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-success/15 text-success">
            <Truck className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 sm:text-sm">
              {message}
            </p>
          </div>
        </div>
        {orderId ? (
          <Button asChild size="sm" className="h-9 shrink-0 rounded-xl">
            <Link href={`/supplier/orders/${orderId}`}>
              Voir la commande{orderRef ? ` · ${orderRef}` : ""}
            </Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-success/25 bg-success-soft/40 p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-success/15 text-success">
          <Truck className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
          {phone ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-lg">
                <a href={telUrl(phone)}>
                  <Phone className="size-3.5" />
                  Appeler
                </a>
              </Button>
              <Button asChild size="sm" className="rounded-lg">
                <a
                  href={whatsAppUrl(phone, whatsappIntro)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SupplierOrderStatusActions({
  orderId,
  orderStatus,
  size = "default",
  className,
}: {
  orderId: Id<"orders">;
  orderStatus: string;
  size?: "default" | "compact";
  className?: string;
}) {
  const markInContact = useMutation(api.supplierPortal.markInContactWithClient);
  const markInDelivery = useMutation(api.supplierPortal.markInDelivery);
  const [markingContact, setMarkingContact] = useState(false);
  const [markingDelivery, setMarkingDelivery] = useState(false);

  // Closed orders: delivered or cancelled — no status choices.
  if (orderStatus === "terminee" || orderStatus === "annulee") {
    return null;
  }

  const canMarkInContact =
    ![
      "en_contact_client",
      "en_cours",
      "location_active",
    ].includes(orderStatus) &&
    [
      "envoyee_fournisseur",
      "vue_fournisseur",
      "prix_recu",
      "offre_envoyee",
    ].includes(orderStatus);
  const alreadyInContact =
    orderStatus === "en_contact_client" || orderStatus === "en_cours";

  const canMarkInDelivery =
    orderStatus !== "en_cours" &&
    orderStatus !== "location_active" &&
    [
      "envoyee_fournisseur",
      "vue_fournisseur",
      "en_contact_client",
      "prix_recu",
      "offre_envoyee",
      "acceptee",
      "planifiee",
    ].includes(orderStatus);
  const alreadyInDelivery = orderStatus === "en_cours";

  if (!canMarkInContact && !alreadyInContact && !canMarkInDelivery && !alreadyInDelivery) {
    return null;
  }

  const handleMarkInContact = async () => {
    setMarkingContact(true);
    try {
      await markInContact({ orderId });
      toast.success("Statut mis à jour : en contact avec le client.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour le statut."
      );
    } finally {
      setMarkingContact(false);
    }
  };

  const handleMarkInDelivery = async () => {
    setMarkingDelivery(true);
    try {
      await markInDelivery({ orderId });
      toast.success("Statut mis à jour : en cours de livraison.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour le statut."
      );
    } finally {
      setMarkingDelivery(false);
    }
  };

  const compact = size === "compact";
  const buttonClass = compact
    ? "h-8 rounded-lg px-2.5 text-[11px] font-semibold"
    : "h-11 rounded-xl px-4 text-sm font-semibold";
  const badgeClass = compact
    ? "inline-flex h-8 items-center gap-1 rounded-lg border bg-white px-2.5 text-[11px] font-semibold shadow-sm"
    : "inline-flex h-11 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold shadow-sm";
  const iconClass = compact ? "size-3.5" : "size-5";
  const checkClass = compact ? "size-3.5 text-success" : "size-5 text-success";

  return (
    <div className={cn("flex flex-wrap gap-2", !compact && "gap-3", className)}>
      {canMarkInContact ? (
        <Button
          type="button"
          variant="outline"
          className={cn(buttonClass, "border-brand/30 bg-white text-brand hover:bg-brand/5")}
          disabled={markingContact}
          onClick={() => void handleMarkInContact()}
        >
          <MessageCircle className={iconClass} />
          {markingContact ? "…" : "En contact avec le client"}
        </Button>
      ) : alreadyInContact ? (
        <span className={cn(badgeClass, "border-brand/30 text-brand")}>
          <MessageCircle className={iconClass} />
          En contact avec le client
          <Check className={checkClass} strokeWidth={2.5} />
        </span>
      ) : null}
      {canMarkInDelivery ? (
        <Button
          type="button"
          variant="outline"
          className={cn(
            buttonClass,
            "border-success/30 bg-white text-success hover:bg-success/10"
          )}
          disabled={markingDelivery}
          onClick={() => void handleMarkInDelivery()}
        >
          <Truck className={iconClass} />
          {markingDelivery ? "…" : "En cours de livraison"}
        </Button>
      ) : alreadyInDelivery ? (
        <span className={cn(badgeClass, "border-success/30 text-success")}>
          <Truck className={iconClass} />
          En cours de livraison
          <Check className={checkClass} strokeWidth={2.5} />
        </span>
      ) : null}
    </div>
  );
}

export function SupplierOrderStatusBox({
  orderId,
  orderStatus,
  className,
}: {
  orderId: Id<"orders">;
  orderStatus: string;
  className?: string;
}) {
  if (orderStatus === "terminee" || orderStatus === "annulee") {
    return null;
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      <div className="flex flex-col gap-1.5 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">
            <MessageCircle className="size-4" />
          </div>
          <h2 className="text-base font-semibold text-brand">
            Statut de la commande
          </h2>
        </div>
        <p className="text-sm font-medium leading-snug text-success sm:text-right">
          Merci de changer le statut pour nous tenir informés — en contact avec
          le client ou en cours de livraison.
        </p>
      </div>
      <div className="p-5">
        <SupplierOrderStatusActions
          orderId={orderId}
          orderStatus={orderStatus}
        />
      </div>
    </Card>
  );
}

export function SupplierDeliveredBanner({
  className,
  onCancelByClient,
  cancelling = false,
}: {
  className?: string;
  onCancelByClient?: () => void;
  cancelling?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-success/25 bg-success-soft/50 p-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-success/15 text-success">
          <PackageCheck className="size-4" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Commande livrée</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Vous avez confirmé la livraison au client. L&apos;équipe SOS Santé est
            informée.
          </p>
        </div>
      </div>
      {onCancelByClient ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-status-error/30 font-semibold text-status-error hover:bg-status-error/10 hover:text-status-error"
          disabled={cancelling}
          onClick={onCancelByClient}
        >
          {cancelling ? "…" : "Annulée par client"}
        </Button>
      ) : null}
    </div>
  );
}
