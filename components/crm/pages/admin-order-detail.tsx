"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone, MessageCircle, Mail, MapPin, User, Calendar, Clock,
  Truck, Copy, Send, Edit3, CheckCircle2, ArrowLeft,
} from "lucide-react";
import { ORDERS } from "@/lib/mock-data";

type AdminOrderDetailPageProps = { orderId: string };

export function AdminOrderDetailPage({ orderId }: AdminOrderDetailPageProps) {
  const o = ORDERS.find((order) => order.id === orderId);
  if (!o) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Commande introuvable.</p>
        <Button asChild variant="link"><Link href="/admin/orders">Retour aux commandes</Link></Button>
      </div>
    );
  }
  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/admin/orders"><ArrowLeft className="size-4" /> Retour</Link>
      </Button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-xl font-semibold tracking-tight">{o.ref}</h1>
            <StatusBadge status={o.status} />
            <Tag tone="neutral">{o.source}</Tag>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Créée le {o.createdAt} · Assistant : <span className="font-medium text-foreground">{o.assistant}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><Edit3 className="size-4" /> Modifier</Button>
          <Button variant="outline" size="sm">Changer statut</Button>
          <Button size="sm" className="bg-success hover:bg-success/90 text-primary-foreground">
            <Send className="size-4" /> Envoyer offre client
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2"><User className="size-4" /> Client</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Nom" value={o.client} />
              <Info label="Téléphone" value={o.phone} icon={Phone} />
              <Info label="WhatsApp" value={o.whatsapp} icon={MessageCircle} />
              <Info label="Email" value="—" icon={Mail} />
              <Info label="Ville · quartier" value={`${o.city} · ${o.district}`} icon={MapPin} />
              <Info label="Adresse" value={o.address} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline"><Phone className="size-4" /> Appeler</Button>
              <Button size="sm" variant="outline"><MessageCircle className="size-4" /> WhatsApp</Button>
              <Button size="sm" variant="ghost">Voir historique</Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Demande</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Type" value={o.type} />
              <Info label="Matériel / service" value={o.item} />
              <Info label="Durée" value={o.duration} />
              <Info label="Date souhaitée" value={o.desiredDate} icon={Calendar} />
              <Info label="Créneau" value={o.slot} icon={Clock} />
            </div>
            <Separator className="my-4" />
            <Label className="mb-1.5 block">Message du client</Label>
            <p className="rounded-lg bg-muted p-3 text-sm">{o.message}</p>
            {o.notes && (
              <>
                <Label className="mb-1.5 mt-4 block">Notes internes</Label>
                <p className="rounded-lg border border-warning/30 bg-warning-soft/50 p-3 text-sm">{o.notes}</p>
              </>
            )}
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Truck className="size-4" /> Affectation fournisseur</h3>
              <Button size="sm" variant="outline">Affecter à un autre</Button>
            </div>
            {o.supplier ? (
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{o.supplier}</p>
                    <p className="text-xs text-muted-foreground">Envoyée le {o.createdAt} · Vue il y a 12 min · Acceptée</p>
                  </div>
                  <Tag tone="success">Accepté</Tag>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Aucun fournisseur affecté</p>
                <div className="flex justify-center gap-2">
                  <Button size="sm">Envoyer à un fournisseur</Button>
                  <Button size="sm" variant="outline">Mise en concurrence</Button>
                </div>
              </div>
            )}
          </Card>

          {o.supplierPrice && (
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Prix fournisseur & commission</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <Row label="Prix fournisseur" value={`${o.supplierPrice} MAD`} />
                  <Row label="Frais livraison" value={`${o.delivery ?? 0} MAD`} />
                  <Row label="Frais installation" value={`${o.install ?? 0} MAD`} />
                  <Row label="Autres frais" value={`${o.other ?? 0} MAD`} />
                  <Separator />
                  <Row label="Total fournisseur" value={`${(o.supplierPrice + (o.delivery ?? 0) + (o.install ?? 0) + (o.other ?? 0)).toLocaleString("fr-FR")} MAD`} bold />
                </div>
                <div className="space-y-2 text-sm rounded-lg bg-brand-soft/50 p-3">
                  <Row label="Commission SOS Santé" value={`${o.commissionPct}%`} />
                  <Row label="Montant commission" value={`${Math.round((o.supplierPrice + (o.delivery ?? 0) + (o.install ?? 0) + (o.other ?? 0)) * (o.commissionPct ?? 0) / 100)} MAD`} />
                  <Separator />
                  <Row label="Prix final client" value={`${o.finalPrice?.toLocaleString("fr-FR")} MAD`} bold highlight />
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">Modifier</Button>
                    <Button size="sm" className="flex-1">Valider offre</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {o.finalPrice && (
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Offre client</h3>
              <Textarea
                rows={5}
                defaultValue={`Bonjour ${o.client.split(" ")[0]},\n\nVoici notre offre pour ${o.item} :\n— Prix : ${o.finalPrice?.toLocaleString("fr-FR")} MAD (livraison & installation incluses)\n— Disponibilité : ${o.desiredDate} (${o.slot})\n\nMerci de confirmer pour planification.\nÉquipe SOS Santé Agadir`}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Tag tone="warning">En attente de réponse client</Tag>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Copy className="size-4" /> Copier WhatsApp</Button>
                  <Button size="sm" variant="outline"><Mail className="size-4" /> Envoyer email</Button>
                  <Button size="sm"><Send className="size-4" /> Envoyer WhatsApp</Button>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Planning</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Date d'intervention" value={o.desiredDate} icon={Calendar} />
              <Info label="Créneau" value={o.slot} icon={Clock} />
              <Info label="Adresse" value={`${o.city} · ${o.district}`} icon={MapPin} />
              <Info label="Contact sur place" value={o.phone} icon={Phone} />
            </div>
          </Card>
        </div>

        <Card className="p-5 h-fit lg:sticky lg:top-20">
          <h3 className="mb-4 text-sm font-semibold">Historique</h3>
          <ol className="relative space-y-4 border-l border-border pl-4">
            {[
              { label: "Commande créée", time: o.createdAt, done: true },
              { label: "Qualifiée", time: "26/06 09:30", done: true },
              { label: "Envoyée au fournisseur", time: "26/06 09:45", done: true },
              { label: "Fournisseur a vu", time: "26/06 09:57", done: true },
              { label: "Prix soumis", time: "26/06 10:14", done: true },
              { label: "Offre envoyée client", time: "—", done: false },
              { label: "Client accepté", time: "—", done: false },
              { label: "Livraison planifiée", time: "—", done: false },
              { label: "Commande terminée", time: "—", done: false },
            ].map((t, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[21px] top-1 grid size-3.5 place-items-center rounded-full border-2 border-card ${t.done ? "bg-success" : "bg-muted"}`}>
                  {t.done && <CheckCircle2 className="size-2.5 text-primary-foreground" />}
                </span>
                <p className={`text-sm ${t.done ? "font-medium text-foreground" : "text-muted-foreground"}`}>{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.time}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-foreground truncate">
        {Icon && <Icon className="size-3.5 text-muted-foreground shrink-0" />}
        {value}
      </p>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${bold ? "font-semibold" : ""} ${highlight ? "text-brand-deep text-base" : ""}`}>{value}</span>
    </div>
  );
}