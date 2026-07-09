"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Tag } from "@/components/dashboard/status-badge";
import { Separator } from "@/components/ui/separator";
import { formatMad } from "@/lib/crm/pricing";

type OrderQuotePanelProps = {
  orderId: Id<"orders">;
  supplierId?: Id<"suppliers">;
};

export function OrderQuotePanel({ orderId, supplierId }: OrderQuotePanelProps) {
  const { canQueryAdmin } = useAdminSession();
  const quoteData = useQuery(
    api.quotes.getForOrder,
    canQueryAdmin ? { orderId } : "skip"
  );

  if (!supplierId) {
    if (quoteData?.declinedSupplier) {
      return (
        <div className="rounded-lg border border-dashed border-warning/40 bg-warning-soft/30 p-4 text-sm">
          <p className="font-medium text-foreground">Fournisseur non disponible</p>
          <p className="mt-1 text-muted-foreground">
            <strong>{quoteData.declinedSupplier.name}</strong> ne peut pas traiter
            cette commande
            {quoteData.declinedQuote?.notes
              ? ` (${quoteData.declinedQuote.notes.toLowerCase()})`
              : ""}
            . Affectez un autre fournisseur dans la section{" "}
            <strong>Affectation fournisseur</strong> ci-dessus.
          </p>
        </div>
      );
    }

    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Affectez un fournisseur — il saisira son prix depuis son espace fournisseur.
      </p>
    );
  }

  if (quoteData === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement des devis…</p>
    );
  }

  if (quoteData === null) {
    return null;
  }

  const quote = quoteData.activeQuote;
  const pricing = quoteData.pricing;
  const waitingForSupplier = !quote || quote.status !== "submitted";
  const usesDeclaredCommission = pricing?.usesDeclaredCommission ?? false;

  if (waitingForSupplier) {
    return (
      <div className="rounded-lg border border-dashed border-warning/40 bg-warning-soft/30 p-4 text-sm">
        <p className="font-medium text-foreground">En attente du prix fournisseur</p>
        <p className="mt-1 text-muted-foreground">
          {quoteData.supplier?.name ?? "Le fournisseur"} doit confirmer son prix et
          la commission depuis l&apos;espace <strong>/supplier</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
      <div className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4 text-sm">
        <Row label="Prix matériel/service" value={formatMad(quote!.basePrice)} />
        <Row label="Livraison" value={formatMad(quote!.deliveryFee)} />
        <Row label="Installation" value={formatMad(quote!.installFee)} />
        <Row label="Autres frais" value={formatMad(quote!.otherFee)} />
        <Separator />
        <Row
          label={
            usesDeclaredCommission
              ? "Commission SOS (déclarée)"
              : `Commission SOS (${pricing!.commissionPct} %)`
          }
          value={formatMad(pricing!.commissionAmount)}
          highlight
        />
        {quote!.notes ? (
          <p className="pt-2 text-xs italic text-muted-foreground">
            Note fournisseur : {quote!.notes}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Confirmé par {quoteData.supplier?.name}
        </p>
        {quote!.commissionPaidAt ? (
          <Tag tone="success">Commission réglée</Tag>
        ) : (
          <Tag tone="warning">Commission en attente</Tag>
        )}
      </div>
      <div className="flex min-w-[200px] flex-col justify-between rounded-2xl bg-secondary p-5 text-white shadow-lg shadow-secondary/25">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              Total client
            </p>
            <p className="mt-2 font-mono text-3xl font-bold leading-none">
              {formatMad(pricing!.finalPrice).replace(" MAD", "")}
            </p>
            <p className="mt-1 text-sm text-white/80">Dirhams</p>
          </div>
          <div className="border-t border-white/15 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              Commission SOS
            </p>
            <p className="mt-2 font-mono text-2xl font-bold leading-none text-white">
              {formatMad(pricing!.commissionAmount).replace(" MAD", "")}
            </p>
            <p className="mt-1 text-sm text-white/80">Dirhams</p>
          </div>
        </div>
        <div className="mt-4 h-1 rounded-full bg-brand" />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`${bold ? "font-semibold" : ""} ${highlight ? "text-base font-semibold text-brand" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
