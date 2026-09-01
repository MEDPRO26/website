"use client";

import { useQuery } from "convex/react";
import { Handshake, Wallet } from "lucide-react";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { ApportAffairesSheet } from "@/components/crm/apport-affaires-sheet";
import { StatCard } from "@/components/dashboard/stat-card";
import { resolveApportCommissionDue, formatDh, remainingToPay } from "@/lib/apport-affaires";

function dealCommissionDue(row: {
  commissionDue?: number;
  contractAmount?: number;
  customRate?: number;
  depositReceived: number;
}) {
  return resolveApportCommissionDue({
    commissionDue: row.commissionDue,
    contractAmount: row.contractAmount,
    customRate: row.customRate,
    depositReceived: row.depositReceived,
  });
}

export function ApportAffairesPage({
  variant = "admin",
}: {
  variant?: "admin" | "apporteur";
}) {
  const saved = useQuery(api.apportAffaires.list);

  const stats = useMemo(() => {
    const rows = saved ?? [];
    const totals = rows.reduce(
      (acc, row) => {
        const due = dealCommissionDue(row);
        if (row.contractAmount) acc.contracts += row.contractAmount;
        if (due != null) acc.due += due;
        acc.deposits += row.depositReceived;
        const remaining =
          due == null ? null : remainingToPay(due, row.depositReceived);
        if (remaining != null) acc.remaining += remaining;
        acc.count += 1;
        return acc;
      },
      { contracts: 0, due: 0, deposits: 0, remaining: 0, count: 0 }
    );
    return {
      ...totals,
      net: totals.contracts - totals.remaining,
    };
  }, [saved]);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-4 sm:gap-6">
      <div>
        <h1 className="text-xl font-bold leading-snug tracking-tight text-[#2890e0] sm:text-3xl">
          Tableau de Suivi des Commissions – Apport d’Affaires
        </h1>
      </div>

      <div
        className={
          variant === "admin"
            ? "grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5"
            : "grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5"
        }
      >
        <StatCard
          label="Affaires"
          value={stats.count}
          icon={Handshake}
          tone="info"
        />
        <StatCard
          label="Chiffre d’affaires"
          value={formatDh(stats.contracts)}
          tone="info"
        />
        <StatCard
          label="Commission due"
          value={formatDh(stats.due)}
          icon={Wallet}
          tone="brand"
        />
        {variant === "admin" ? (
          <StatCard
            label="Acomptes reçus"
            value={formatDh(stats.deposits)}
            tone="success"
          />
        ) : null}
        <StatCard
          label="Reste à payer"
          value={formatDh(stats.remaining)}
          tone={stats.remaining > 0 ? "warning" : "success"}
        />
        {variant === "apporteur" ? (
          <StatCard
            label="Net"
            value={formatDh(stats.net)}
            tone="success"
          />
        ) : null}
      </div>

      <ApportAffairesSheet variant={variant} />
    </div>
  );
}
