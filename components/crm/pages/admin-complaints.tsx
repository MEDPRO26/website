"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COMPLAINTS } from "@/lib/mock-data";

export function AdminComplaintsPage() {
  return (
    <div>
      <PageHeader title="Réclamations" description="Suivi des réclamations clients et fournisseurs." actions={<Button>+ Nouvelle réclamation</Button>} />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Référence</th>
                <th className="py-2.5 font-medium">Commande</th>
                <th className="py-2.5 font-medium">Client</th>
                <th className="py-2.5 font-medium">Fournisseur</th>
                <th className="py-2.5 font-medium">Type</th>
                <th className="py-2.5 font-medium">Priorité</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="py-2.5 font-medium">Responsable</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {COMPLAINTS.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-brand">{c.ref}</td>
                  <td className="py-3 font-mono text-xs">{c.order}</td>
                  <td className="py-3">{c.client}</td>
                  <td className="py-3 text-muted-foreground">{c.supplier}</td>
                  <td className="py-3">{c.type}</td>
                  <td className="py-3">
                    <Tag tone={c.priority === "Haute" ? "danger" : c.priority === "Moyenne" ? "warning" : "neutral"}>{c.priority}</Tag>
                  </td>
                  <td className="py-3">
                    <Tag tone={c.status === "Résolue" ? "success" : c.status === "Ouverte" ? "danger" : "warning"}>{c.status}</Tag>
                  </td>
                  <td className="py-3">{c.assignee}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}