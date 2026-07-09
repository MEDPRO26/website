"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatMad, supplierTotal } from "@/lib/crm/pricing";
import { cn } from "@/lib/utils";

type SupplierQuoteFormProps = {
  orderId: Id<"orders">;
  orderType?: string;
  orderDuration?: string;
  existingQuote?: {
    basePrice: number;
    deliveryFee: number;
    installFee: number;
    otherFee: number;
    commissionAmount?: number;
    notes?: string;
    status: string;
  } | null;
  variant?: "default" | "sidebar";
  readOnly?: boolean;
  onSubmitted?: () => void;
  onUnavailable?: () => void;
  onCancelledByClient?: () => void;
};

export function SupplierQuoteForm({
  orderId,
  orderType,
  orderDuration,
  existingQuote,
  variant = "default",
  readOnly = false,
  onSubmitted,
  onUnavailable,
  onCancelledByClient,
}: SupplierQuoteFormProps) {
  const submitQuote = useMutation(api.supplierPortal.submitQuote);
  const markUnavailable = useMutation(api.supplierPortal.markUnavailable);
  const cancelByClient = useMutation(api.supplierPortal.cancelByClient);
  const [basePrice, setBasePrice] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [installFee, setInstallFee] = useState("0");
  const [otherFee, setOtherFee] = useState("0");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted = existingQuote?.status === "submitted" || readOnly;
  const isSidebar = variant === "sidebar";

  useEffect(() => {
    if (!existingQuote) {
      return;
    }
    setBasePrice(String(existingQuote.basePrice));
    setDeliveryFee(String(existingQuote.deliveryFee));
    setInstallFee(String(existingQuote.installFee));
    setOtherFee(String(existingQuote.otherFee));
    setCommissionAmount(
      existingQuote.commissionAmount !== undefined
        ? String(existingQuote.commissionAmount)
        : ""
    );
    setNotes(existingQuote.notes ?? "");
  }, [existingQuote]);

  const preview = useMemo(() => {
    const total = supplierTotal({
      basePrice: Number(basePrice) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      installFee: Number(installFee) || 0,
      otherFee: Number(otherFee) || 0,
    });
    const commission = Number(commissionAmount) || 0;
    return { total, commission, clientPrice: total };
  }, [basePrice, deliveryFee, installFee, otherFee, commissionAmount]);

  const basePriceLabel = useMemo(() => {
    const type = orderType?.toLowerCase() ?? "";
    if (type.includes("location")) {
      return orderDuration
        ? `Prix fournisseur (location ${orderDuration})`
        : "Prix fournisseur (location)";
    }
    if (type.includes("service")) {
      return "Prix fournisseur (prestation)";
    }
    return "Prix fournisseur";
  }, [orderType, orderDuration]);

  const handleUnavailable = async () => {
    setSubmitting(true);
    try {
      await markUnavailable({ orderId });
      toast.success("Indisponibilité signalée à SOS Santé.");
      onUnavailable?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de signaler l'indisponibilité."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelByClient = async () => {
    setSubmitting(true);
    try {
      await cancelByClient({ orderId });
      toast.success("Commande annulée par le client.");
      onCancelledByClient?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'annuler la commande."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const base = Number(basePrice);
    const commission = Number(commissionAmount);
    if (!base || base <= 0) {
      toast.error("Indiquez un prix matériel/service valide.");
      return;
    }
    if (!commissionAmount.trim() || Number.isNaN(commission) || commission <= 0) {
      toast.error(
        "La commission SOS Santé est obligatoire. Indiquez le montant en MAD avant de confirmer la livraison."
      );
      return;
    }

    setSubmitting(true);
    try {
      await submitQuote({
        orderId,
        basePrice: base,
        deliveryFee: Number(deliveryFee) || 0,
        installFee: Number(installFee) || 0,
        otherFee: Number(otherFee) || 0,
        commissionAmount: commission,
        notes: notes.trim() || undefined,
      });
      toast.success("Livraison confirmée — commande clôturée.");
      onSubmitted?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer le prix."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const priceInputClass = cn(
    "mt-1.5 h-11 text-base font-semibold",
    isSidebar && "rounded-xl border-border/70 bg-muted/20 pr-14"
  );

  const fieldLabelClass = cn(
    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
    isSidebar && "text-[10px]"
  );

  return (
    <div className={cn("space-y-4", isSidebar && "space-y-5")}>
      <div className={cn("grid gap-3", isSidebar ? "grid-cols-1" : "grid-cols-2")}>
        <div className={isSidebar ? "" : "col-span-2 sm:col-span-1"}>
          <Label className={fieldLabelClass}>{basePriceLabel} *</Label>
          <div className="relative">
            <Input
              type="number"
              min={0}
              className={priceInputClass}
              value={basePrice}
              disabled={isSubmitted}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="1200"
            />
            {isSidebar ? (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                MAD
              </span>
            ) : null}
          </div>
        </div>

        <div className={cn(isSidebar ? "grid grid-cols-2 gap-3" : "contents")}>
          <div>
            <Label className={fieldLabelClass}>Livraison</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                className={priceInputClass}
                value={deliveryFee}
                disabled={isSubmitted}
                onChange={(e) => setDeliveryFee(e.target.value)}
              />
              {isSidebar ? (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  MAD
                </span>
              ) : null}
            </div>
          </div>
          <div>
            <Label className={fieldLabelClass}>Installation</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                className={priceInputClass}
                value={installFee}
                disabled={isSubmitted}
                onChange={(e) => setInstallFee(e.target.value)}
              />
              {isSidebar ? (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  MAD
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {!isSidebar ? (
          <div>
            <Label className={fieldLabelClass}>Autres frais (MAD)</Label>
            <Input
              type="number"
              min={0}
              className="mt-1.5"
              value={otherFee}
              disabled={isSubmitted}
              onChange={(e) => setOtherFee(e.target.value)}
            />
          </div>
        ) : null}

        <div className={isSidebar ? "" : "col-span-2"}>
          <Label className={fieldLabelClass}>Commission SOS Santé *</Label>
          <div className="relative">
            <Input
              type="number"
              min={0}
              className={priceInputClass}
              value={commissionAmount}
              disabled={isSubmitted}
              onChange={(e) => setCommissionAmount(e.target.value)}
              placeholder="180"
            />
            {isSidebar ? (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                MAD
              </span>
            ) : null}
          </div>
          {isSidebar ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Montant reversé à SOS Santé pour cette commande.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Montant que vous reverserez à SOS Santé pour cette commande.
            </p>
          )}
        </div>
      </div>

      <div>
        <Label className={fieldLabelClass}>
          {isSidebar ? "Commentaires / précisions" : "Commentaire (optionnel)"}
        </Label>
        <Textarea
          rows={isSidebar ? 4 : 3}
          className={cn("mt-1.5", isSidebar && "rounded-xl border-border/70 bg-muted/20")}
          value={notes}
          disabled={isSubmitted}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            isSidebar
              ? "Ex : Matériel de secours inclus…"
              : "Précisions sur le matériel, accessoires inclus…"
          }
        />
      </div>

      <div
        className={cn(
          "space-y-2 text-sm",
          isSidebar
            ? "rounded-xl border border-border/60 bg-muted/20 p-4"
            : "rounded-xl border border-border bg-muted/30 p-4"
        )}
      >
        <Row label="Sous-total" value={formatMad(preview.total)} />
        <Row
          label="Commission SOS Santé"
          value={formatMad(preview.commission)}
        />
        <div className="border-t border-border/60 pt-2">
          <Row
            label="Total TTC"
            value={formatMad(preview.clientPrice)}
            highlight
          />
        </div>
        {!isSidebar ? (
          <p className="pt-1 text-xs text-muted-foreground">
            Le client paie {formatMad(preview.clientPrice)}. La commission SOS
            Santé ({formatMad(preview.commission)}) vous sera réglée séparément.
          </p>
        ) : null}
      </div>

      {isSubmitted ? (
        <p
          className={cn(
            "rounded-xl px-3 py-2.5 text-sm text-success",
            isSidebar ? "bg-success-soft text-center" : "bg-success-soft"
          )}
        >
          {readOnly && !existingQuote
            ? "Cette commande n'accepte plus de nouveau prix."
            : "Livraison confirmée — commande clôturée."}
        </p>
      ) : isSidebar ? (
        <div className="space-y-3">
          <Button
            className="h-12 w-full rounded-xl bg-[#0f172a] text-base font-semibold hover:bg-[#1e293b]"
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Confirmation…
              </>
            ) : (
              <>
                <PackageCheck className="size-4" />
                Confirmer la livraison
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-xl border-brand/30 text-base font-semibold text-brand hover:bg-brand/5"
            disabled={submitting}
            onClick={() => void handleUnavailable()}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Envoi…
              </>
            ) : (
              "Non disponible"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-xl border-status-error/30 text-base font-semibold text-status-error hover:bg-status-error/10 hover:text-status-error"
            disabled={submitting}
            onClick={() => void handleCancelByClient()}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Envoi…
              </>
            ) : (
              "Commande annulée par client"
            )}
          </Button>
        </div>
      ) : (
        <Button className="w-full" disabled={submitting} onClick={() => void handleSubmit()}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Confirmation…
            </>
          ) : (
            "Confirmer la livraison"
          )}
        </Button>
      )}
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
        className={cn(
          bold && "font-semibold",
          highlight && "text-lg font-bold text-brand-deep"
        )}
      >
        {value}
      </span>
    </div>
  );
}
