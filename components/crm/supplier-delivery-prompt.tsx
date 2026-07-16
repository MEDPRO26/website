import Link from "next/link";
import { PackageCheck, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const whatsappIntro = orderStatus && supplierIsEarlyClientContactPhase(orderStatus)
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
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 sm:text-sm">{message}</p>
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

export function SupplierDeliveredBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-success/25 bg-success-soft/50 p-4",
        className
      )}
    >
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
  );
}
