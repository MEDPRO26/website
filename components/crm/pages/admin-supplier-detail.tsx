"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag, StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShieldCheck, Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { SUPPLIERS, ORDERS } from "@/lib/mock-data";

type AdminSupplierDetailPageProps = { supplierId: string };

export function AdminSupplierDetailPage({ supplierId }: AdminSupplierDetailPageProps) {
  const s = SUPPLIERS.find((supplier) => supplier.id === supplierId);
  if (!s) {
    return <div className="p-8 text-center text-muted-foreground">Fournisseur introuvable.</div>;
  }
  const supplierOrders = ORDERS.filter((o) => o.supplier === s.name);

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/admin/suppliers"><ArrowLeft className="size-4" /> Retour</Link>
      </Button>

      <PageHeader
        title={s.name}
        description={`${s.type} · ${s.city}`}
        actions={
          <>
            <Button variant="outline" size="sm">Inviter utilisateur</Button>
            <Button variant="outline" size="sm">Suspendre</Button>
            <Button size="sm">Modifier</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-xl bg-brand-soft text-brand-deep text-base font-bold">
                {s.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{s.name}</p>
                {s.verified ? (
                  <p className="flex items-center gap-1 text-xs text-success">
                    <ShieldCheck className="size-3.5" /> Compte vérifié
                  </p>
                ) : (
                  <Tag tone="warning">Non vérifié</Tag>
                )}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="size-3.5 text-muted-foreground" /> {s.phone}</p>
              <p className="flex items-center gap-2"><MessageCircle className="size-3.5 text-muted-foreground" /> {s.whatsapp}</p>
              <p className="flex items-center gap-2"><Mail className="size-3.5 text-muted-foreground" /> {s.email}</p>
              <p className="flex items-center gap-2"><MapPin className="size-3.5 text-muted-foreground" /> {s.zones.join(", ")}</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Performance</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold">{s.ordersCount}</p>
                <p className="text-[11px] text-muted-foreground">Commandes</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{s.responseAvg}</p>
                <p className="text-[11px] text-muted-foreground">Réponse</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{s.commissionPct}%</p>
                <p className="text-[11px] text-muted-foreground">Commission</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Notes internes</h3>
            <p className="text-sm text-muted-foreground">
              Fournisseur fiable · livraisons régulières · réactif sur WhatsApp.
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Matériels & services proposés</h3>
            <div className="flex flex-wrap gap-1.5">
              {(s.items ?? []).map((i: string) => <Tag key={i} tone="info">{i}</Tag>)}
              {(s.services ?? []).map((i: string) => <Tag key={i} tone="brand">{i}</Tag>)}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Règles de commission</h3>
            <div className="rounded-lg border border-border p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">Pourcentage sur prix fournisseur</span></div>
              <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Valeur par défaut</span><span className="font-medium">{s.commissionPct}%</span></div>
              <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Surcouche par type</span><span className="font-medium text-brand">Configurable</span></div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Historique commandes ({supplierOrders.length})</h3>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/orders">Toutes les commandes</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="py-2 font-medium">Réf.</th>
                    <th className="py-2 font-medium">Client</th>
                    <th className="py-2 font-medium">Statut</th>
                    <th className="py-2 font-medium text-right">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-mono text-xs">
                        <Link href={`/admin/orders/${o.id}`} className="text-brand">{o.ref}</Link>
                      </td>
                      <td className="py-2.5">{o.client}</td>
                      <td className="py-2.5"><StatusBadge status={o.status} /></td>
                      <td className="py-2.5 text-right">{o.finalPrice ? `${o.finalPrice.toLocaleString("fr-FR")} MAD` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}