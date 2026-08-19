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
import {
  estimatePrestationTotalHours,
  isServiceOrderType,
  parseDurationDays,
  parseSlotHoursPerDay,
  prestationModeLabel,
  type PrestationPricingMode,
} from "@/lib/crm/order-scheduling";
import { cn } from "@/lib/utils";

type SupplierQuoteFormProps = {
  orderId: Id<"orders">;
  orderType?: string;
  orderDuration?: string;
  orderSlot?: string;
  existingQuote?: {
    basePrice: number;
    deliveryFee: number;
    installFee: number;
    otherFee: number;
    commissionAmount?: number;
    pricingMode?: PrestationPricingMode;
    unitPrice?: number;
    quantity?: number;
    serviceInclusions?: string;
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
  orderSlot,
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

  const isService = isServiceOrderType(orderType);
  const durationDays = parseDurationDays(orderDuration);
  const hoursPerDay = parseSlotHoursPerDay(orderSlot);
  const estimatedTotalHours = estimatePrestationTotalHours(
    orderDuration,
    null,
    orderSlot
  );

  const [pricingMode, setPricingMode] = useState<PrestationPricingMode>("day");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [installFee, setInstallFee] = useState("0");
  const [otherFee, setOtherFee] = useState("0");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [serviceInclusions, setServiceInclusions] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quantityTouched, setQuantityTouched] = useState(false);

  const isSubmitted = existingQuote?.status === "submitted" || readOnly;
  const isSidebar = variant === "sidebar";

  const defaultQuantityForMode = (mode: PrestationPricingMode) => {
    if (mode === "hour" && estimatedTotalHours != null) {
      return String(estimatedTotalHours);
    }
    if (mode === "day" && durationDays != null) {
      return String(durationDays);
    }
    if (mode === "flat") {
      return "1";
    }
    return "";
  };

  useEffect(() => {
    if (!existingQuote) {
      if (isService) {
        setQuantity(defaultQuantityForMode(pricingMode));
        setQuantityTouched(false);
      }
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
    setServiceInclusions(existingQuote.serviceInclusions ?? "");
    if (existingQuote.pricingMode) {
      setPricingMode(existingQuote.pricingMode);
    }
    if (existingQuote.unitPrice !== undefined) {
      setUnitPrice(String(existingQuote.unitPrice));
    }
    if (existingQuote.quantity !== undefined) {
      setQuantity(String(existingQuote.quantity));
      setQuantityTouched(true);
    } else if (isService) {
      setQuantity(
        defaultQuantityForMode(existingQuote.pricingMode ?? pricingMode)
      );
      setQuantityTouched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per quote
  }, [existingQuote, isService, durationDays, estimatedTotalHours]);

  useEffect(() => {
    if (!isService || isSubmitted || existingQuote || quantityTouched) {
      return;
    }
    const next = defaultQuantityForMode(pricingMode);
    if (next) {
      setQuantity(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isService,
    isSubmitted,
    existingQuote,
    pricingMode,
    durationDays,
    estimatedTotalHours,
    quantityTouched,
  ]);

  const computedServiceTotal = useMemo(() => {
    if (!isService) {
      return 0;
    }
    if (pricingMode === "flat") {
      return Number(unitPrice) || 0;
    }
    const unit = Number(unitPrice) || 0;
    const qty = Number(quantity) || 0;
    return Math.round(unit * qty);
  }, [isService, pricingMode, unitPrice, quantity]);

  const preview = useMemo(() => {
    const resolvedBase = isService ? computedServiceTotal : Number(basePrice) || 0;
    const total = supplierTotal({
      basePrice: resolvedBase,
      deliveryFee: isService ? 0 : Number(deliveryFee) || 0,
      installFee: isService ? 0 : Number(installFee) || 0,
      otherFee: isService ? 0 : Number(otherFee) || 0,
    });
    const commission = Number(commissionAmount) || 0;
    const supplierKeep = Math.max(0, total - commission);
    return { total, commission, clientPrice: total, supplierKeep, resolvedBase };
  }, [
    isService,
    computedServiceTotal,
    basePrice,
    deliveryFee,
    installFee,
    otherFee,
    commissionAmount,
  ]);

  const basePriceLabel = useMemo(() => {
    const type = orderType?.toLowerCase() ?? "";
    if (type.includes("location")) {
      return orderDuration
        ? `Prix fournisseur (location ${orderDuration})`
        : "Prix fournisseur (location)";
    }
    if (isService) {
      return "Prix de la prestation";
    }
    return "Prix fournisseur";
  }, [orderType, orderDuration, isService]);

  const handleUnavailable = async () => {
    setSubmitting(true);
    try {
      await markUnavailable({ orderId });
      toast.success("Indisponibilité signalée à S2MBO.");
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
    const commission = Number(commissionAmount);
    let base = 0;
    let qty: number | undefined;
    let unit: number | undefined;

    if (isService) {
      unit = Number(unitPrice);
      if (!unit || unit <= 0) {
        toast.error(
          pricingMode === "flat"
            ? "Indiquez le montant forfaitaire de la prestation."
            : "Indiquez le tarif unitaire de la prestation."
        );
        return;
      }
      if (pricingMode === "flat") {
        base = unit;
        qty = 1;
      } else {
        qty = Number(quantity);
        if (!qty || qty <= 0) {
          toast.error(
            pricingMode === "hour"
              ? "Indiquez le nombre d'heures."
              : "Indiquez le nombre de jours."
          );
          return;
        }
        base = Math.round(unit * qty);
      }
      if (!serviceInclusions.trim()) {
        toast.error(
          "Décrivez ce que comprend votre prestation (soins, durée journalière, matériel…)."
        );
        return;
      }
    } else {
      base = Number(basePrice);
      if (!base || base <= 0) {
        toast.error("Indiquez un prix matériel/service valide.");
        return;
      }
    }

    if (!commissionAmount.trim() || Number.isNaN(commission) || commission <= 0) {
      toast.error(
        isService
          ? "L'honoraire de S2MBO est obligatoire. Indiquez le montant en MAD avant de confirmer la prestation."
          : "L'honoraire de S2MBO est obligatoire. Indiquez le montant en MAD avant de confirmer la livraison."
      );
      return;
    }

    setSubmitting(true);
    try {
      await submitQuote({
        orderId,
        basePrice: base,
        deliveryFee: isService ? 0 : Number(deliveryFee) || 0,
        installFee: isService ? 0 : Number(installFee) || 0,
        otherFee: isService ? 0 : Number(otherFee) || 0,
        commissionAmount: commission,
        pricingMode: isService ? pricingMode : undefined,
        unitPrice: isService ? unit : undefined,
        quantity: isService ? qty : undefined,
        serviceInclusions: isService
          ? serviceInclusions.trim() || undefined
          : undefined,
        notes: notes.trim() || undefined,
      });
      toast.success(
        isService
          ? "Prestation confirmée — commande clôturée."
          : "Livraison confirmée — commande clôturée."
      );
      onSubmitted?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer le prix."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmLabel = isService
    ? "Confirmer la prestation"
    : "Confirmer la livraison";
  const confirmedLabel = isService
    ? "Prestation confirmée — commande clôturée."
    : "Livraison confirmée — commande clôturée.";

  const priceInputClass = cn(
    "mt-1.5 h-11 text-base font-semibold",
    isSidebar && "rounded-xl border-border/70 bg-muted/20 pr-14"
  );

  const fieldLabelClass = cn(
    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
    isSidebar && "text-[10px]"
  );

  const modeButtons: { mode: PrestationPricingMode; label: string }[] = [
    { mode: "hour", label: "À l'heure" },
    { mode: "day", label: "À la journée" },
    { mode: "flat", label: "Forfait" },
  ];

  return (
    <div className={cn("space-y-4", isSidebar && "space-y-5")}>
      {isService ? (
        <div className="space-y-4">
          <div>
            <Label className={fieldLabelClass}>Type de tarif *</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {modeButtons.map(({ mode, label }) => (
                <button
                  key={mode}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => {
                    setPricingMode(mode);
                    if (!quantityTouched || !quantity) {
                      const next = defaultQuantityForMode(mode);
                      if (next) {
                        setQuantity(next);
                        setQuantityTouched(false);
                      }
                    }
                  }}
                  className={cn(
                    "rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors",
                    pricingMode === mode
                      ? "border-brand bg-brand/10 text-brand-deep"
                      : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/40",
                    isSubmitted && "opacity-60"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {orderDuration || hoursPerDay != null ? (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {orderDuration ? (
                  <>
                    Durée : <strong>{orderDuration}</strong>
                    {durationDays ? ` (${durationDays} j)` : null}
                  </>
                ) : null}
                {hoursPerDay != null ? (
                  <>
                    {orderDuration ? " · " : null}
                    Créneau : <strong>{hoursPerDay} h/jour</strong>
                  </>
                ) : null}
                {estimatedTotalHours != null ? (
                  <>
                    {" "}
                    → total estimé : <strong>{estimatedTotalHours} h</strong>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>

          <div className={cn(pricingMode === "flat" ? "" : "grid grid-cols-2 gap-3")}>
            <div>
              <Label className={fieldLabelClass}>
                {pricingMode === "hour"
                  ? "Tarif / heure *"
                  : pricingMode === "day"
                    ? "Tarif / jour *"
                    : "Montant forfaitaire *"}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  className={priceInputClass}
                  value={unitPrice}
                  disabled={isSubmitted}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder={pricingMode === "flat" ? "Ex. 1200" : "Ex. 80"}
                />
                {isSidebar ? (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    MAD
                  </span>
                ) : null}
              </div>
            </div>

            {pricingMode !== "flat" ? (
              <div>
                <Label className={fieldLabelClass}>
                  {pricingMode === "hour" ? "Nombre d'heures *" : "Nombre de jours *"}
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={pricingMode === "hour" ? 0.25 : 1}
                  className={priceInputClass}
                  value={quantity}
                  disabled={isSubmitted}
                  onChange={(e) => {
                    setQuantityTouched(true);
                    setQuantity(e.target.value);
                  }}
                  placeholder={
                    pricingMode === "hour" && estimatedTotalHours != null
                      ? String(estimatedTotalHours)
                      : pricingMode === "day" && durationDays
                        ? String(durationDays)
                        : "Ex. 8"
                  }
                />
              </div>
            ) : null}
          </div>

          {pricingMode === "hour" &&
          hoursPerDay != null &&
          durationDays != null &&
          !quantityTouched ? (
            <p className="text-xs text-muted-foreground">
              Calculé automatiquement : {hoursPerDay} h/jour × {durationDays}{" "}
              jours = {estimatedTotalHours} h (modifiable).
            </p>
          ) : null}

          {pricingMode !== "flat" && (Number(unitPrice) > 0 || Number(quantity) > 0) ? (
            <p className="rounded-lg bg-brand/5 px-3 py-2 text-xs text-brand-deep">
              {Number(unitPrice) || 0} MAD {prestationModeLabel(pricingMode)} ×{" "}
              {Number(quantity) || 0}{" "}
              {pricingMode === "hour" ? "h" : "j"} ={" "}
              <strong>{formatMad(computedServiceTotal)}</strong>
            </p>
          ) : null}

          <div>
            <Label className={fieldLabelClass}>Prestation comprise *</Label>
            <Textarea
              rows={isSidebar ? 4 : 3}
              className={cn(
                "mt-1.5",
                isSidebar && "rounded-xl border-border/70 bg-muted/20"
              )}
              value={serviceInclusions}
              disabled={isSubmitted}
              onChange={(e) => setServiceInclusions(e.target.value)}
              placeholder="Ex. : Soins infirmiers à domicile, pansements, injections, 4 h/jour, matériel de base inclus…"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Précisez ce que vous incluez — cela varie selon chaque prestataire.
            </p>
          </div>
        </div>
      ) : (
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
                placeholder="Ex. 1200"
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
        </div>
      )}

      <div>
        <Label className={fieldLabelClass}>Honoraire de S2MBO *</Label>
        <div className="relative">
          <Input
            type="number"
            min={0}
            className={priceInputClass}
            value={commissionAmount}
            disabled={isSubmitted}
            onChange={(e) => setCommissionAmount(e.target.value)}
            placeholder="Ex. 180"
          />
          {isSidebar ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              MAD
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Montant reversé à S2MBO pour cette commande.
        </p>
      </div>

      <div>
        <Label className={fieldLabelClass}>
          {isService
            ? "Commentaire (optionnel)"
            : isSidebar
              ? "Commentaires / précisions"
              : "Commentaire (optionnel)"}
        </Label>
        <Textarea
          rows={isSidebar ? (isService ? 2 : 4) : 3}
          className={cn("mt-1.5", isSidebar && "rounded-xl border-border/70 bg-muted/20")}
          value={notes}
          disabled={isSubmitted}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            isService
              ? "Précisions pour S2MBO ou le client…"
              : isSidebar
                ? "Ex. : Matériel de secours inclus…"
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
        {isService && pricingMode !== "flat" ? (
          <Row
            label={`Prestation (${prestationModeLabel(pricingMode)})`}
            value={formatMad(preview.resolvedBase)}
          />
        ) : (
          <Row label="Sous-total" value={formatMad(preview.total)} />
        )}
        <Row
          label="Honoraire de S2MBO"
          value={formatMad(preview.commission)}
        />
        <Row
          label="Votre part"
          value={formatMad(preview.supplierKeep)}
          bold
        />
        <div className="border-t border-border/60 pt-2">
          <Row
            label="Total TTC (client)"
            value={formatMad(preview.clientPrice)}
            highlight
          />
        </div>
        <p className="pt-1 text-xs text-muted-foreground">
          Vous conservez {formatMad(preview.supplierKeep)} après honoraire.
        </p>
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
            : confirmedLabel}
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
                {confirmLabel}
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
            confirmLabel
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
