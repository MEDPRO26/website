"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/dashboard/status-badge";

const LOGS = [
  { date: "12 fév. 14:32", user: "Salma B.", action: "update", entity: "order:SOS-AG-2026-0001", from: "à_affecter", to: "envoyée_fournisseur", ip: "105.66.xx.xx" },
  { date: "12 fév. 13:10", user: "Karim A.", action: "create", entity: "order:SOS-AG-2026-0008", from: "—", to: "nouvelle_demande", ip: "196.12.xx.xx" },
  { date: "12 fév. 11:48", user: "Admin", action: "update", entity: "supplier:s1", from: "non vérifié", to: "vérifié", ip: "105.66.xx.xx" },
  { date: "11 fév. 18:02", user: "Salma B.", action: "delete", entity: "note:n42", from: "Note client", to: "—", ip: "105.66.xx.xx" },
  { date: "11 fév. 09:21", user: "Admin", action: "update", entity: "settings:commission", from: "12%", to: "15%", ip: "105.66.xx.xx" },
];

export function AdminAuditLogsPage() {
  return (
    <div>
      <PageHeader title="Audit logs" description="Historique des actions sur la plateforme" />
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
                <th className="px-4 py-2.5 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {LOGS.map((l, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{l.date}</td>
                  <td className="py-3 font-medium">{l.user}</td>
                  <td className="py-3">
                    <Tag tone={l.action === "create" ? "success" : l.action === "delete" ? "danger" : "info"}>{l.action}</Tag>
                  </td>
                  <td className="py-3 font-mono text-xs">{l.entity}</td>
                  <td className="py-3 text-xs text-muted-foreground">{l.from}</td>
                  <td className="py-3 text-xs">{l.to}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}