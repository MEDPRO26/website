"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatMad, supplierTotal } from "@/lib/crm/pricing";

type SupplierQuoteFormProps = {
  orderId: Id<"orders">;
  existingQuote?: {
    basePrice: number;
    deliveryFee: number;
    installFee: number;
    otherFee: number;
    commissionAmount?: number;
    notes?: string;
    status: string;
  } | null;
  onSubmitted?: () => void;
};

export function SupplierQuoteForm({
  orderId,
  existingQuote,
  onSubmitted,
}: SupplierQuoteFormProps) {
  const submitQuote = useMutation(api.supplierPortal.submitQuote);
  const [basePrice, setBasePrice] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [installFee, setInstallFee] = useState("0");
  const [otherFee, setOtherFee] = useState("0");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted = existingQuote?.status === "submitted";

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

  const handleSubmit = async () => {
    const base = Number(basePrice);
    const commission = Number(commissionAmount);
    if (!base || base <= 0) {
      toast.error("Indiquez un prix matériel/service valide.");
      return;
    }
    if (!commissionAmount.trim() || Number.isNaN(commission) || commission <= 0) {
      toast.error(
        "La commission SOS Santé est obligatoire. Indiquez le montant en MAD avant d'envoyer votre offre."
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
      toast.success("Prix confirmé et envoyé à SOS Santé.");
      onSubmitted?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer le prix."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <Label className="text-xs">Prix matériel/service (MAD) *</Label>
          <Input
            type="number"
            min={0}
            className="mt-1.5"
            value={basePrice}
            disabled={isSubmitted}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="1200"
          />
        </div>
        <div>
          <Label className="text-xs">Frais livraison (MAD)</Label>
          <Input
            type="number"
            min={0}
            className="mt-1.5"
            value={deliveryFee}
            disabled={isSubmitted}
            onChange={(e) => setDeliveryFee(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Frais installation (MAD)</Label>
          <Input
            type="number"
            min={0}
            className="mt-1.5"
            value={installFee}
            disabled={isSubmitted}
            onChange={(e) => setInstallFee(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Autres frais (MAD)</Label>
          <Input
            type="number"
            min={0}
            className="mt-1.5"
            value={otherFee}
            disabled={isSubmitted}
            onChange={(e) => setOtherFee(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Commission SOS Santé (MAD) *</Label>
          <Input
            type="number"
            min={0}
            className="mt-1.5"
            value={commissionAmount}
            disabled={isSubmitted}
            onChange={(e) => setCommissionAmount(e.target.value)}
            placeholder="180"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Montant que vous reverserez à SOS Santé pour cette commande.
          </p>
        </div>
      </div>

      <div>
        <Label className="text-xs">Commentaire (optionnel)</Label>
        <Textarea
          rows={3}
          className="mt-1.5"
          value={notes}
          disabled={isSubmitted}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Précisions sur le matériel, accessoires inclus…"
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm space-y-2">
        <Row label="Prix client (vos frais)" value={formatMad(preview.clientPrice)} bold />
        <Row
          label="Commission SOS Santé"
          value={formatMad(preview.commission)}
        />
        <Separator />
        <p className="text-xs text-muted-foreground pt-1">
          Le client paie {formatMad(preview.clientPrice)}. La commission SOS Santé
          ({formatMad(preview.commission)}) vous sera réglée séparément.
        </p>
      </div>

      {isSubmitted ? (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-sm text-success">
          Prix confirmé — visible par l&apos;équipe SOS Santé.
        </p>
      ) : (
        <Button className="w-full" disabled={submitting} onClick={() => void handleSubmit()}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Envoi…
            </>
          ) : (
            "Confirmer et envoyer le prix"
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
        className={`${bold ? "font-semibold" : ""} ${highlight ? "text-base font-semibold text-brand-deep" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
