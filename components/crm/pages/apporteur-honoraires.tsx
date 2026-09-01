"use client";

import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Handshake,
  Loader2,
  Receipt,
  Wallet,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tag } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { resolveApportCommissionDue, formatDh, parseAmountInput } from "@/lib/apport-affaires";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  S2MBO_BANK_LOGO,
  S2MBO_BANK_NAME,
  S2MBO_COMMISSION_RIB,
  S2MBO_COMMISSION_RIB_COMPACT,
} from "@/lib/s2mbo-bank";

const unpaidLockBanner = (count: number) =>
  `Vous avez ${count} projet${count > 1 ? "s" : ""} non payé${count > 1 ? "s" : ""}. Réglez-les tous dans Honoraires S2MBO pour ouvrir les prochains projets.`;

function isAllowedReceipt(file: File) {
  const type = file.type || "";
  return (
    type.startsWith("image/") ||
    type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export function ApporteurHonorairesPage() {
  const rows = useQuery(api.apportDemandes.list);
  const generatePaymentUploadUrl = useMutation(
    api.apportDemandes.generatePaymentUploadUrl
  );
  const submitPaymentReceipt = useMutation(
    api.apportDemandes.submitPaymentReceipt
  );

  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [receiptFiles, setReceiptFiles] = useState<
    Record<string, File | null>
  >({});
  const [amountTexts, setAmountTexts] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const opened = useMemo(
    () => (rows ?? []).filter((row) => Boolean(row.openedAt)),
    [rows]
  );

  const unpaidCount = rows?.[0]?.unpaidCount ?? 0;

  const stats = useMemo(() => {
    return opened.reduce(
      (acc, row) => {
        const due = resolveApportCommissionDue({
          commissionDue: row.commissionDue,
          contractAmount: row.contractAmount,
          customRate: row.customRate,
        });
        if (due != null) acc.due += due;
        if (row.paymentStatus === "paid") acc.paid += 1;
        else if (row.paymentStatus === "pending_review") acc.pending += 1;
        else acc.unpaid += 1;
        acc.count += 1;
        return acc;
      },
      { count: 0, due: 0, unpaid: 0, pending: 0, paid: 0 }
    );
  }, [opened]);

  const copyRib = async () => {
    try {
      await navigator.clipboard.writeText(S2MBO_COMMISSION_RIB_COMPACT);
      toast.success("RIB copié.");
    } catch {
      toast.error("Impossible de copier le RIB.");
    }
  };

  const handleSubmitReceipt = async (id: Id<"apportDemandes">) => {
    const file = receiptFiles[id];
    if (!file) {
      toast.error("Ajoutez un reçu (image ou PDF) avant d’envoyer.");
      return;
    }
    if (!isAllowedReceipt(file)) {
      toast.error("Reçu : image (JPG, PNG, WebP) ou PDF uniquement.");
      return;
    }
    const row = opened.find((item) => item._id === id);
    const amountSent = parseAmountInput(
      amountTexts[id] ??
        (row?.paymentAmountSent != null ? String(row.paymentAmountSent) : "")
    );
    if (amountSent == null || amountSent <= 0) {
      toast.error("Indiquez le montant envoyé (DH).");
      return;
    }

    setSubmittingId(id);
    try {
      const contentType =
        file.type ||
        (file.name.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg");
      const uploadUrl = await generatePaymentUploadUrl({});
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: file,
      });
      if (!uploadResult.ok) {
        throw new Error(`Impossible d’envoyer « ${file.name} ».`);
      }
      const payload = (await uploadResult.json()) as {
        storageId: Id<"_storage">;
      };
      await submitPaymentReceipt({
        id,
        receiptStorageId: payload.storageId,
        fileName: file.name,
        amountSent,
      });
      toast.success(
        "Reçu envoyé. S2MBO confirmera le paiement après vérification bancaire."
      );
      setReceiptFiles((prev) => ({ ...prev, [id]: null }));
      setAmountTexts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      const input = fileInputRefs.current[id];
      if (input) input.value = "";
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d’envoyer le reçu."
      );
    } finally {
      setSubmittingId(null);
    }
  };

  if (rows === undefined) {
    return (
      <p className="text-sm text-muted-foreground">
        Chargement des honoraires…
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-4 sm:gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#2890e0] sm:text-3xl">
          Honoraires S2MBO
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Effectuez le virement, joignez le reçu, puis attendez la confirmation
          S2MBO.
        </p>
      </div>

      <Card className="border-primary/15 bg-primary/[0.03] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-stretch gap-3 sm:gap-4">
            <div className="flex w-28 shrink-0 items-center justify-center self-stretch overflow-hidden rounded-xl bg-white p-2 shadow-sm ring-1 ring-border/60 sm:w-36">
              <Image
                src={S2MBO_BANK_LOGO}
                alt={S2MBO_BANK_NAME}
                width={180}
                height={100}
                className="h-auto w-full object-contain object-center"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Virement bancaire — honoraire de S2MBO
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Merci d&apos;effectuer le virement de l&apos;honoraire de S2MBO
                sur le compte {S2MBO_BANK_NAME} ci-dessous, puis de téléverser
                le reçu. Le paiement sera confirmé dans le CRM après
                vérification du compte bancaire.
              </p>
              <p className="mt-2 font-mono text-sm font-semibold tracking-wide text-foreground sm:text-base">
                RIB {S2MBO_BANK_NAME} : {S2MBO_COMMISSION_RIB}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 rounded-xl"
            onClick={() => void copyRib()}
          >
            <Copy className="size-4" />
            Copier le RIB
          </Button>
        </div>
      </Card>

      {unpaidCount >= 2 ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p>{unpaidLockBanner(unpaidCount)}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label="Affaires"
          value={stats.count}
          icon={Handshake}
          tone="info"
        />
        <StatCard
          label="Commission due"
          value={formatDh(stats.due)}
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="À régler / en attente"
          value={stats.unpaid + stats.pending}
          tone={stats.unpaid + stats.pending > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Payées"
          value={stats.paid}
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {opened.length === 0 ? (
        <Card className="p-5 text-sm text-muted-foreground">
          Aucun honoraire pour le moment. Ouvrez une demande pour suivre la
          commission.
        </Card>
      ) : (
        <div className="space-y-3">
          {opened.map((row) => {
            const due = resolveApportCommissionDue({
              commissionDue: row.commissionDue,
              contractAmount: row.contractAmount,
              customRate: row.customRate,
            });
            const isPaid = row.paymentStatus === "paid";
            const isPending = row.paymentStatus === "pending_review";
            const selectedFile = receiptFiles[row._id] ?? null;
            const amountText =
              amountTexts[row._id] ??
              (row.paymentAmountSent != null
                ? String(row.paymentAmountSent)
                : "");
            const parsedAmount = parseAmountInput(amountText);

            return (
              <Card key={row._id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">
                      {row.clientName.trim() || "Client sans nom"}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      <span className="text-muted-foreground">Type : </span>
                      {row.projectType}
                    </p>
                    {row.phone ? (
                      <p className="mt-0.5 text-sm text-foreground">
                        <span className="text-muted-foreground">
                          Téléphone :{" "}
                        </span>
                        <a
                          href={`tel:${row.phone.replace(/\s+/g, "")}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {row.phone}
                        </a>
                      </p>
                    ) : null}
                  </div>
                  <Tag
                    tone={
                      isPaid ? "success" : isPending ? "info" : "warning"
                    }
                  >
                    {isPaid
                      ? "Payé"
                      : isPending
                        ? "En attente S2MBO"
                        : "À payer"}
                  </Tag>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-[#d7deea] bg-[#eef8f1] px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    Commission due
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {due == null ? "—" : formatDh(due)}
                  </span>
                </div>

                {isPaid ? (
                  <div className="space-y-2">
                    {row.paymentAmountSent != null ? (
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                        <span className="text-xs text-muted-foreground">
                          Montant envoyé
                        </span>
                        <span className="text-sm font-semibold tabular-nums">
                          {formatDh(row.paymentAmountSent)}
                        </span>
                      </div>
                    ) : null}
                    {row.paymentReceiptUrl ? (
                      <a
                        href={row.paymentReceiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#2890e0] underline-offset-2 hover:underline"
                      >
                        <Receipt className="size-4" />
                        Voir le reçu
                        {row.paymentReceiptFileName
                          ? ` (${row.paymentReceiptFileName})`
                          : ""}
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Paiement confirmé par S2MBO.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
                    {isPending ? (
                      <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
                        <Clock className="mt-0.5 size-4 shrink-0 text-sky-600" />
                        <div className="min-w-0 space-y-1">
                          <p>
                            Reçu envoyé — en attente de confirmation S2MBO
                            (vérification du virement en banque).
                          </p>
                          {row.paymentAmountSent != null ? (
                            <p className="font-semibold tabular-nums">
                              Montant déclaré : {formatDh(row.paymentAmountSent)}
                            </p>
                          ) : null}
                          {row.paymentReceiptUrl ? (
                            <a
                              href={row.paymentReceiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 font-medium text-[#2890e0] underline-offset-2 hover:underline"
                            >
                              <Receipt className="size-3.5" />
                              Voir le reçu envoyé
                              {row.paymentReceiptFileName
                                ? ` (${row.paymentReceiptFileName})`
                                : ""}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <Label
                        htmlFor={`amount-sent-${row._id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Montant envoyé (DH)
                      </Label>
                      <Input
                        id={`amount-sent-${row._id}`}
                        inputMode="decimal"
                        className="mt-1 h-9 tabular-nums"
                        placeholder={
                          due == null ? "0" : String(due)
                        }
                        value={amountText}
                        disabled={submittingId === row._id}
                        onChange={(e) =>
                          setAmountTexts((prev) => ({
                            ...prev,
                            [row._id]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <input
                      ref={(el) => {
                        fileInputRefs.current[row._id] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.pdf"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setReceiptFiles((prev) => ({
                          ...prev,
                          [row._id]: file,
                        }));
                      }}
                    />
                    <button
                      type="button"
                      disabled={submittingId === row._id}
                      onClick={() =>
                        fileInputRefs.current[row._id]?.click()
                      }
                      className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-background px-3 py-3 text-left text-sm transition-colors hover:border-[#2890e0]/40 hover:bg-[#2890e0]/5 disabled:opacity-60"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#2890e0]/10 text-[#2890e0]">
                        <Receipt className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="font-medium text-foreground">
                          {selectedFile
                            ? selectedFile.name
                            : isPending
                              ? "Remplacer le reçu bancaire"
                              : "Joindre le reçu bancaire"}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Image ou PDF requis
                        </span>
                      </span>
                    </button>
                    <Button
                      size="sm"
                      disabled={
                        submittingId === row._id ||
                        !selectedFile ||
                        parsedAmount == null ||
                        parsedAmount <= 0
                      }
                      onClick={() => void handleSubmitReceipt(row._id)}
                    >
                      {submittingId === row._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                      {isPending ? "Renvoyer le reçu" : "Envoyer le reçu"}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
