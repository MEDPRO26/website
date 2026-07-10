"use client";

import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { SupplierCommissionSettleDialog } from "@/components/crm/supplier-commission-settle-dialog";
import { formatMad } from "@/lib/crm/pricing";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SupplierCommissionsPage() {
  const { canQuerySupplier } = useSupplierSession();
  const rows = useQuery(
    api.supplierPortal.listCommissions,
    canQuerySupplier ? {} : "skip"
  );
  const [settleTarget, setSettleTarget] = useState<{
    quoteId: Id<"orderSupplierQuotes">;
    orderRef: string;
    commissionAmount: number;
  } | null>(null);

  if (rows === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement des commissions…</p>
    );
  }

  const unpaidTotal = rows
    .filter((row) => !row.commissionPaid)
    .reduce((sum, row) => sum + row.commissionAmount, 0);
  const paidTotal = rows
    .filter((row) => row.commissionPaid)
    .reduce((sum, row) => sum + row.commissionAmount, 0);

  return (
    <div>
      <PageHeader
        title="SOS commission"
        description="Commandes livrées — réglez la commission SOS Santé après paiement au client."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="flex items-center gap-4 p-4">
          <div className="grid size-11 place-items-center rounded-xl bg-status-error/10 text-status-error">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              À régler
            </p>
            <p className="text-2xl font-bold text-foreground">{formatMad(unpaidTotal)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="grid size-11 place-items-center rounded-xl bg-success/10 text-success">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Déjà réglées
            </p>
            <p className="text-2xl font-bold text-foreground">{formatMad(paidTotal)}</p>
          </div>
        </Card>
      </div>

      {rows.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Aucune commission pour le moment. Les commissions apparaissent ici une fois la
          livraison confirmée.
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Commande</th>
                  <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">
                    Prix client
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">
                    Commission SOS
                  </th>
                  <th className="px-4 py-2.5 font-medium whitespace-nowrap">Statut</th>
                  <th className="px-4 py-2.5 font-medium whitespace-nowrap">Mode</th>
                  <th className="px-4 py-2.5 font-medium whitespace-nowrap">Date</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.quoteId} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand">
                      {row.orderRef}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {formatMad(row.finalPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-deep whitespace-nowrap">
                      {formatMad(row.commissionAmount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.commissionPaid ? (
                        <Tag tone="success">Réglé</Tag>
                      ) : (
                        <Tag tone="warning">Non réglé</Tag>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {row.commissionPaid ? row.commissionPaymentLabel : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(row.deliveredAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.commissionPaid ? (
                        <CommissionReceiptButton quoteId={row.quoteId} hasReceipt={row.hasReceipt} />
                      ) : (
                        <Button
                          size="sm"
                          className="rounded-lg"
                          onClick={() =>
                            setSettleTarget({
                              quoteId: row.quoteId,
                              orderRef: row.orderRef,
                              commissionAmount: row.commissionAmount,
                            })
                          }
                        >
                          Régler
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <SupplierCommissionSettleDialog
        open={settleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setSettleTarget(null);
        }}
        target={settleTarget}
        onSettled={() => setSettleTarget(null)}
      />
    </div>
  );
}

function CommissionReceiptButton({
  quoteId,
  hasReceipt,
}: {
  quoteId: Id<"orderSupplierQuotes">;
  hasReceipt: boolean;
}) {
  const receiptUrl = useQuery(api.supplierPortal.getCommissionReceiptUrl, { quoteId });

  if (!hasReceipt) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  if (receiptUrl === undefined) {
    return <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" />;
  }

  if (!receiptUrl) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <Button size="sm" variant="outline" asChild>
      <a href={receiptUrl} target="_blank" rel="noreferrer">
        Voir reçu
      </a>
    </Button>
  );
}
