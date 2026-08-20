"use client";

import { useQuery } from "convex/react";
import { Handshake, Wallet } from "lucide-react";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import {
  ApportAffairesSheet,
} from "@/components/crm/apport-affaires-sheet";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAdminSession } from "@/hooks/use-admin-session";
import { computeApportRow, formatDh } from "@/lib/apport-affaires";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";

export function ApportAffairesPage() {
  const { staff } = useAdminSession();
  const canQuery = Boolean(staff && isAdminStaffRole(staff.role));
  const saved = useQuery(api.apportAffaires.list, canQuery ? {} : "skip");

  const stats = useMemo(() => {
    const rows = saved ?? [];
    return rows.reduce(
      (acc, row) => {
        const computed = computeApportRow({
          contractAmount: row.contractAmount,
          depositReceived: row.depositReceived,
          customRate: row.customRate,
        });
        if (computed.commissionDue != null) acc.due += computed.commissionDue;
        acc.deposits += row.depositReceived;
        if (computed.remaining != null) acc.remaining += computed.remaining;
        acc.count += 1;
        return acc;
      },
      { due: 0, deposits: 0, remaining: 0, count: 0 }
    );
  }, [saved]);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-4 sm:gap-6">
      <div>
        <h1 className="text-xl font-bold leading-snug tracking-tight text-[#2890e0] sm:text-3xl">
          Tableau de Suivi des Commissions – Apport d’Affaires
        </h1>
      </div>

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
          label="Acomptes reçus"
          value={formatDh(stats.deposits)}
          tone="success"
        />
        <StatCard
          label="Reste à payer"
          value={formatDh(stats.remaining)}
          tone={stats.remaining > 0 ? "warning" : "success"}
        />
      </div>

      <ApportAffairesSheet />
    </div>
  );
}
