"use client";

import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  CheckCircle2,
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
import { computeApportRow, formatDh } from "@/lib/apport-affaires";
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
  const markPaid = useMutation(api.apportDemandes.markPaid);

  const [payingId, setPayingId] = useState<string | null>(null);
  const [receiptFiles, setReceiptFiles] = useState<
    Record<string, File | null>
  >({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const opened = useMemo(
    () => (rows ?? []).filter((row) => Boolean(row.openedAt)),
    [rows]
  );

  const unpaidCount = rows?.[0]?.unpaidCount ?? 0;

  const stats = useMemo(() => {
    return opened.reduce(
      (acc, row) => {
        const computed = computeApportRow({
          contractAmount: row.contractAmount,
          depositReceived: 0,
          customRate: row.customRate,
        });
        if (computed.commissionDue != null) acc.due += computed.commissionDue;
        if (row.isUnpaid) acc.unpaid += 1;
        else acc.paid += 1;
        acc.count += 1;
        return acc;
      },
      { count: 0, due: 0, unpaid: 0, paid: 0 }
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

  const handleMarkPaid = async (id: Id<"apportDemandes">) => {
    const file = receiptFiles[id];
    if (!file) {
      toast.error("Ajoutez un reçu (image ou PDF) avant de marquer payé.");
      return;
    }
    if (!isAllowedReceipt(file)) {
      toast.error("Reçu : image (JPG, PNG, WebP) ou PDF uniquement.");
      return;
    }

    setPayingId(id);
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
      await markPaid({
        id,
        receiptStorageId: payload.storageId,
        fileName: file.name,
      });
      toast.success("Honoraire marqué payé.");
      setReceiptFiles((prev) => ({ ...prev, [id]: null }));
      const input = fileInputRefs.current[id];
      if (input) input.value = "";
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de marquer payé."
      );
    } finally {
      setPayingId(null);
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
          Suivi des commissions dues sur vos demandes ouvertes.
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
                le reçu lors du règlement.
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
          label="Impayées"
          value={stats.unpaid}
          tone={stats.unpaid > 0 ? "warning" : "success"}
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
            const computed = computeApportRow({
              contractAmount: row.contractAmount,
              depositReceived: 0,
              customRate: row.customRate,
            });
            const isPaid = row.paymentStatus === "paid";
            const selectedFile = receiptFiles[row._id] ?? null;

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
                  <Tag tone={isPaid ? "success" : "warning"}>
                    {isPaid ? "Payé" : "À payer"}
                  </Tag>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-[#d7deea] bg-[#eef8f1] px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    Commission due
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {computed.commissionDue == null
                      ? "—"
                      : formatDh(computed.commissionDue)}
                  </span>
                </div>

                {isPaid ? (
                  row.paymentReceiptUrl ? (
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
                      Paiement enregistré.
                    </p>
                  )
                ) : (
                  <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
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
                      disabled={payingId === row._id}
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
                            : "Joindre le reçu bancaire"}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Image ou PDF requis
                        </span>
                      </span>
                    </button>
                    <Button
                      size="sm"
                      disabled={payingId === row._id || !selectedFile}
                      onClick={() => void handleMarkPaid(row._id)}
                    >
                      {payingId === row._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                      Marquer payé
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
