"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPLIERS } from "@/lib/mock-data";
import { Search, ShieldCheck, Plus } from "lucide-react";

export function AdminSuppliersPage() {
  return (
    <div>
      <PageHeader
        title="Fournisseurs"
        description={`${SUPPLIERS.length} fournisseurs partenaires · ${SUPPLIERS.filter((s) => s.verified).length} vérifiés`}
        actions={<Button><Plus className="size-4" /> Ajouter fournisseur</Button>}
      />

      <Card className="p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un fournisseur…" className="h-9 pl-9" />
          </div>
          <Select><SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="Ville" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="agadir">Agadir</SelectItem>
              <SelectItem value="inezgane">Inezgane</SelectItem>
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mat">Matériel médical</SelectItem>
              <SelectItem value="aide">Aide à domicile</SelectItem>
              <SelectItem value="soin">Soins à domicile</SelectItem>
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="susp">Suspendu</SelectItem>
              <SelectItem value="att">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Fournisseur</th>
                <th className="py-2.5 font-medium">Type</th>
                <th className="py-2.5 font-medium">Ville / Zones</th>
                <th className="py-2.5 font-medium">Contact</th>
                <th className="py-2.5 font-medium text-center">Commandes</th>
                <th className="py-2.5 font-medium text-center">Réponse moy.</th>
                <th className="py-2.5 font-medium text-center">Commission</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-deep text-xs font-semibold">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/suppliers/${s.id}`} className="font-medium text-foreground hover:text-brand">
                          {s.name}
                        </Link>
                        {s.verified && (
                          <p className="flex items-center gap-1 text-[11px] text-success">
                            <ShieldCheck className="size-3" /> Vérifié
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{s.type}</td>
                  <td className="py-3">
                    <div>{s.city}</div>
                    <div className="text-xs text-muted-foreground">{s.zones.join(", ")}</div>
                  </td>
                  <td className="py-3 text-xs">
                    <div>{s.phone}</div>
                    <div className="text-muted-foreground">{s.email}</div>
                  </td>
                  <td className="py-3 text-center font-medium">{s.ordersCount}</td>
                  <td className="py-3 text-center text-muted-foreground">{s.responseAvg}</td>
                  <td className="py-3 text-center">{s.commissionPct}%</td>
                  <td className="py-3">
                    {s.status === "actif" && <Tag tone="success">Actif</Tag>}
                    {s.status === "en_attente" && <Tag tone="warning">En attente</Tag>}
                    {s.status === "suspendu" && <Tag tone="danger">Suspendu</Tag>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/suppliers/${s.id}`}>Voir</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}