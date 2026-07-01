"use client";

import { useQuery } from "convex/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/dashboard/status-badge";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";

const ACTION_TONE: Record<string, "success" | "danger" | "info" | "neutral"> = {
  create: "success",
  delete: "danger",
  update: "info",
  status_change: "info",
  system: "neutral",
};

export function AdminAuditLogsPage() {
  const { canQueryAdmin } = useAdminSession();
  const logs = useQuery(api.auditLogs.list, canQueryAdmin ? {} : "skip");

  return (
    <div>
      <PageHeader
        title="Audit logs"
        description="Historique des actions enregistrées sur la plateforme."
      />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="py-2.5 font-medium">Utilisateur</th>
                <th className="py-2.5 font-medium">Action</th>
                <th className="py-2.5 font-medium">Entité</th>
                <th className="py-2.5 font-medium">Ancienne</th>
                <th className="py-2.5 font-medium">Nouvelle</th>
              </tr>
            </thead>
            <tbody>
              {logs === undefined ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun log pour l&apos;instant. Les actions CRM apparaîtront ici.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-t border-border">
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {log.dateLabel}
                    </td>
                    <td className="py-3 font-medium">{log.actorName}</td>
                    <td className="py-3">
                      <Tag tone={ACTION_TONE[log.action] ?? "neutral"}>
                        {log.action}
                      </Tag>
                    </td>
                    <td className="py-3 font-mono text-xs">
                      {log.entityType}:{log.entityLabel}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {log.fromValue ?? "—"}
                    </td>
                    <td className="py-3">{log.toValue ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
