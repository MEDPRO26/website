"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ORDERS } from "@/lib/mock-data";
import { MapPin, Calendar, Clock, ArrowLeft, Check, X, HelpCircle } from "lucide-react";

type SupplierOrderDetailPageProps = { orderId: string };

export function SupplierOrderDetailPage({ orderId }: SupplierOrderDetailPageProps) {
  const o = ORDERS.find((x) => x.id === orderId);
  if (!o) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Commande introuvable.
        <div className="mt-2"><Link href="/supplier/orders" className="text-brand hover:underline">Retour aux commandes</Link></div>
      </div>
    );
  }
  return (
    <div className="space-y-4 pb-8">
      <Link href="/supplier/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
        <ArrowLeft className="size-4" /> Mes commandes
      </Link>
      <PageHeader
        title={o.ref}
        description={`${o.type} · à livrer le ${o.desiredDate ?? "—"}`}
        actions={<StatusBadge status={o.status} />}
      />

      <Card className="p-4 space-y-2">
        <h3 className="font-semibold text-sm">Demande</h3>
        <p className="font-medium">{o.item}</p>
        <p className="text-sm text-muted-foreground">Durée : {o.duration ?? "—"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {o.city} · {o.district}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> {o.desiredDate ?? "—"}</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {o.slot ?? "—"}</span>
        </div>
        <div className="rounded-lg bg-muted/40 p-3 text-sm">
          <p className="text-xs text-muted-foreground mb-1">Message client (filtré)</p>
          Patient sortant d'hôpital, installation rapide souhaitée. Ascenseur disponible, 2e étage.
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" className="h-auto py-3 flex-col gap-1"><Check className="size-4 text-status-success-fg" /><span className="text-xs">Accepter</span></Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1"><X className="size-4 text-status-danger-fg" /><span className="text-xs">Refuser</span></Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1"><HelpCircle className="size-4 text-status-warning-fg" /><span className="text-xs">Plus d'infos</span></Button>
      </div>

      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-sm">Soumettre votre prix</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="mb-1.5 block text-xs">Prix matériel/service (MAD)</Label><Input type="number" placeholder="1200" /></div>
          <div><Label className="mb-1.5 block text-xs">Frais livraison (MAD)</Label><Input type="number" placeholder="100" /></div>
          <div><Label className="mb-1.5 block text-xs">Frais installation (MAD)</Label><Input type="number" placeholder="0" /></div>
          <div><Label className="mb-1.5 block text-xs">Autres frais (MAD)</Label><Input type="number" placeholder="0" /></div>
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Disponibilité / créneau</Label>
          <Input placeholder="Demain matin 9h-11h" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Commentaire</Label>
          <Textarea rows={3} placeholder="Précisions sur le matériel, accessoires inclus…" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Validité du prix</Label>
          <Input placeholder="48 heures" />
        </div>
        <div className="rounded-xl bg-brand-soft/60 p-3 flex items-center justify-between">
          <span className="text-sm font-medium">Total fournisseur</span>
          <span className="text-lg font-semibold text-brand-deep">1 300 MAD</span>
        </div>
        <Button className="w-full">Soumettre le prix</Button>
      </Card>
    </div>
  );
}