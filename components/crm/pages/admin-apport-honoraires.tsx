"use client";

import { useMutation, useQuery } from "convex/react";
import {
  CheckCircle2,
  Clock,
  Handshake,
  Loader2,
  Receipt,
  Trash2,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tag } from "@/components/dashboard/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { resolveApportCommissionDue, formatDh } from "@/lib/apport-affaires";

export function AdminApportHonorairesPage() {
  const rows = useQuery(api.apportDemandes.list);
  const confirmPaid = useMutation(api.apportDemandes.confirmPaid);
  const removeDemande = useMutation(api.apportDemandes.remove);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<Id<"apportDemandes"> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const opened = useMemo(
    () => (rows ?? []).filter((row) => Boolean(row.openedAt)),
    [rows]
  );

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

  const sorted = useMemo(() => {
    const rank = (status: string | undefined) => {
      if (status === "pending_review") return 0;
      if (status === "paid") return 2;
      return 1;
    };
    return [...opened].sort((a, b) => {
      const byStatus = rank(a.paymentStatus) - rank(b.paymentStatus);
      if (byStatus !== 0) return byStatus;
      return (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt);
    });
  }, [opened]);

  const handleConfirmPaid = async (id: Id<"apportDemandes">) => {
    setConfirmingId(id);
    try {
      await confirmPaid({ id });
      toast.success(
        "Paiement confirmé — montant reporté en Acompte reçu."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de confirmer le paiement."
      );
    } finally {
      setConfirmingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await removeDemande({ id: deleteId });
      toast.success("Ligne supprimée.");
      setDeleteId(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de supprimer."
      );
    } finally {
      setDeleting(false);
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
          Honoraires
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vérifiez le virement sur votre compte bancaire, consultez le reçu,
          puis confirmez le paiement.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label="Affaires ouvertes"
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
          label="À confirmer"
          value={stats.pending}
          icon={Clock}
          tone={stats.pending > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Payées"
          value={stats.paid}
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {sorted.length === 0 ? (
        <Card className="p-5 text-sm text-muted-foreground">
          Aucun honoraire pour le moment. Les demandes ouvertes par les
          apporteurs apparaissent ici.
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((row) => {
            const due = resolveApportCommissionDue({
              commissionDue: row.commissionDue,
              contractAmount: row.contractAmount,
              customRate: row.customRate,
            });
            const isPaid = row.paymentStatus === "paid";
            const isPending = row.paymentStatus === "pending_review";

            return (
              <Card key={row._id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">
                      {row.clientName.trim() || "Client sans nom"}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Apporteur : {row.apporteurName}
                      {row.apporteurEmail ? ` · ${row.apporteurEmail}` : ""}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      <span className="text-muted-foreground">Type : </span>
                      {row.projectType}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-start gap-2">
                    <Tag
                      tone={
                        isPaid ? "success" : isPending ? "warning" : "neutral"
                      }
                    >
                      {isPaid
                        ? "Payé"
                        : isPending
                          ? "Reçu à vérifier"
                          : "Sans reçu"}
                    </Tag>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={deleting || confirmingId === row._id}
                      aria-label="Supprimer"
                      onClick={() => setDeleteId(row._id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-[#d7deea] bg-[#eef8f1] px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    Commission due
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {due == null ? "—" : formatDh(due)}
                  </span>
                </div>

                {row.paymentAmountSent != null ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground">
                      Montant déclaré par l’apporteur
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
                    Aucun reçu joint pour le moment.
                  </p>
                )}

                {isPending ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Après contrôle du montant
                      {row.paymentAmountSent != null
                        ? ` (${formatDh(row.paymentAmountSent)})`
                        : ""}{" "}
                      sur votre compte bancaire, confirmez le paiement — il sera
                      reporté en Acompte reçu.
                    </p>
                    <Button
                      size="sm"
                      disabled={confirmingId === row._id}
                      onClick={() => void handleConfirmPaid(row._id)}
                    >
                      {confirmingId === row._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                      Confirmer payé
                    </Button>
                  </div>
                ) : null}

                {isPaid && row.paymentConfirmedAt ? (
                  <p className="text-xs text-emerald-700">
                    Confirmé le{" "}
                    {new Date(row.paymentConfirmedAt).toLocaleString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette ligne ?</AlertDialogTitle>
            <AlertDialogDescription>
              La demande, le reçu bancaire et la ligne du tableau de suivi
              seront définitivement supprimés. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
