"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CUSTOMERS } from "@/lib/mock-data";

export function AdminCustomersPage() {
  return (
    <div>
      <PageHeader title="Clients" description={`${CUSTOMERS.length} clients référencés`} />
      <Card className="p-3 mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher par nom, téléphone, ville…" className="h-9 pl-9" />
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Nom</th>
                <th className="py-2.5 font-medium">Téléphone</th>
                <th className="py-2.5 font-medium">Ville / Quartier</th>
                <th className="py-2.5 font-medium text-center">Commandes</th>
                <th className="py-2.5 font-medium">Source</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5 font-medium">Dernière demande</th>
              </tr>
            </thead>
            <tbody>
              {CUSTOMERS.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand-deep text-xs font-semibold">
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs">{c.phone}</td>
                  <td className="py-3">
                    <div>{c.city}</div>
                    <div className="text-xs text-muted-foreground">{c.district}</div>
                  </td>
                  <td className="py-3 text-center font-medium">{c.orders}</td>
                  <td className="py-3 text-xs text-muted-foreground">{c.source}</td>
                  <td className="py-3">
                    {c.status === "vip" && <Tag tone="brand">VIP</Tag>}
                    {c.status === "actif" && <Tag tone="success">Actif</Tag>}
                    {c.status === "inactif" && <Tag tone="neutral">Inactif</Tag>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}