"use client";

import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Tag } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatMad } from "@/lib/crm/pricing";

type OrderQuotePanelProps = {
  orderId: Id<"orders">;
  orderStatus?: string;
  supplierId?: Id<"suppliers">;
  clientName: string;
  item: string;
  desiredDate?: string;
  slot?: string;
};

export function OrderQuotePanel({
  orderId,
  orderStatus,
  supplierId,
  clientName,
  item,
}: OrderQuotePanelProps) {
  const { canQueryAdmin } = useAdminSession();
  const quoteData = useQuery(
    api.quotes.getForOrder,
    canQueryAdmin ? { orderId } : "skip"
  );
  const prepareOffer = useMutation(api.quotes.prepareClientOffer);
  const sendOffer = useMutation(api.quotes.sendClientOffer);
  const sendOfferWhatsApp = useAction(api.quotes.sendClientOfferWithWhatsApp);
  const acceptOffer = useMutation(api.quotes.acceptClientOffer);

  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  useEffect(() => {
    const message =
      quoteData?.activeOffer?.message?.trim() ||
      quoteData?.suggestedMessage ||
      "";
    if (message) {
      setOfferMessage(message);
    }
  }, [quoteData?.activeOffer, quoteData?.suggestedMessage]);

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
  const activeOffer = quoteData.activeOffer;
  const offerSent = activeOffer?.status === "sent";
  const offerAccepted = activeOffer?.status === "accepted";
  const canSendOffer =
    !offerAccepted && (!offerSent || orderStatus === "prix_recu");
  const waitingForSupplier = !quote || quote.status !== "submitted";
  const usesDeclaredCommission = pricing?.usesDeclaredCommission ?? false;

  const handlePrepareOffer = async () => {
    setSubmittingOffer(true);
    try {
      await prepareOffer({
        orderId,
        message: offerMessage.trim() || undefined,
      });
      toast.success("Offre client préparée.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de préparer l'offre."
      );
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleSendOffer = async (viaWhatsApp?: boolean) => {
    if (viaWhatsApp && !offerMessage.trim()) {
      toast.error("Préparez d'abord le message client.");
      return;
    }
    setSubmittingOffer(true);
    try {
      if (viaWhatsApp) {
        await sendOfferWhatsApp({
          orderId,
          message: offerMessage.trim() || undefined,
        });
        toast.success("Offre envoyée au client via WhatsApp.");
      } else {
        await sendOffer({
          orderId,
          message: offerMessage.trim() || undefined,
        });
        toast.success("Offre marquée comme envoyée.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer l'offre."
      );
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptOffer = async () => {
    setSubmittingOffer(true);
    try {
      await acceptOffer({ orderId });
      toast.success("Commande acceptée — commission enregistrée.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'enregistrer l'acceptation."
      );
    } finally {
      setSubmittingOffer(false);
    }
  };


  return (
    <div className="space-y-5">
      {waitingForSupplier ? (
        <div className="rounded-lg border border-dashed border-warning/40 bg-warning-soft/30 p-4 text-sm">
          <p className="font-medium text-foreground">En attente du prix fournisseur</p>
          <p className="mt-1 text-muted-foreground">
            {quoteData.supplier?.name ?? "Le fournisseur"} doit confirmer son prix
            depuis l&apos;espace <strong>/supplier</strong>. Vous pourrez ensuite
            préparer l&apos;offre client.
          </p>
        </div>
      ) : (
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
      )}

      {!waitingForSupplier && (
        <>
          <Separator />
          <div>
            <Label className="mb-2 block text-sm font-semibold">Offre client</Label>
            <Textarea
              rows={6}
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              placeholder={`Bonjour ${clientName.split(" ")[0]},\n\nSuite à votre demande…`}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              {offerAccepted ? (
                <Tag tone="success">Client a accepté</Tag>
              ) : offerSent ? (
                <Tag tone="success">Offre envoyée</Tag>
              ) : (
                <Tag tone="warning">Prête à envoyer</Tag>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={submittingOffer || !canSendOffer}
                  onClick={() => void handlePrepareOffer()}
                >
                  Préparer
                </Button>
                <Button
                  size="sm"
                  disabled={submittingOffer || !canSendOffer}
                  onClick={() => void handleSendOffer(true)}
                >
                  {submittingOffer ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Envoyer sur WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={submittingOffer || !canSendOffer}
                  onClick={() => void handleSendOffer()}
                >
                  Marquer comme envoyée
                </Button>
                {offerSent && !offerAccepted ? (
                  <Button
                    size="sm"
                    variant="default"
                    disabled={submittingOffer}
                    onClick={() => void handleAcceptOffer()}
                  >
                    {submittingOffer ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                    Client a accepté
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </>
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
        className={`${bold ? "font-semibold" : ""} ${highlight ? "text-base font-semibold text-brand" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
