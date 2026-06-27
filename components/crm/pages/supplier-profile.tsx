"use client";

import {
  BadgeCheck,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDemoSupplier, getDemoSupplierOrders } from "@/lib/mock-data";

export function SupplierProfilePage() {
  const supplier = getDemoSupplier();
  const orders = getDemoSupplierOrders();
  const pendingCount = orders.filter((o) =>
    ["envoyee_fournisseur", "vue_fournisseur"].includes(o.status)
  ).length;

  const initials = supplier.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-8">
      <PageHeader
        title="Mon profil"
        description="Informations de votre espace fournisseur partenaire"
      />

      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-brand/10 via-brand-soft/40 to-transparent px-5 py-6">
          <div className="flex items-start gap-4">
            <Avatar className="size-16 border-2 border-white shadow-md">
              <AvatarFallback className="bg-brand text-lg font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{supplier.name}</h2>
                {supplier.verified && (
                  <Tag tone="success">
                    <BadgeCheck className="size-3" /> Certifié
                  </Tag>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{supplier.type}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5 text-brand" />
                {supplier.city} · {supplier.zones.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          <div className="px-4 py-3 text-center">
            <p className="text-xl font-bold text-brand">{orders.length}</p>
            <p className="text-[11px] text-muted-foreground">Commandes</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-xl font-bold text-foreground">{supplier.ordersCount}</p>
            <p className="text-[11px] text-muted-foreground">Total historique</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-xl font-bold text-foreground">{supplier.responseAvg}</p>
            <p className="text-[11px] text-muted-foreground">Délai moyen</p>
          </div>
        </div>
      </Card>

      {pendingCount > 0 && (
        <Card className="border-brand/20 bg-brand-soft/30 p-4">
          <p className="text-sm font-medium text-brand-deep">
            {pendingCount} demande{pendingCount > 1 ? "s" : ""} en attente de votre réponse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Consultez Mes commandes pour accepter ou proposer un prix.
          </p>
        </Card>
      )}

      <Card className="p-5 space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <User className="size-4 text-brand" />
          Coordonnées
        </h3>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">Téléphone</dt>
              <dd className="font-medium">{supplier.phone}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">WhatsApp</dt>
              <dd className="font-medium">{supplier.whatsapp}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="font-medium">{supplier.email}</dd>
            </div>
          </div>
        </dl>
      </Card>

      {supplier.items && supplier.items.length > 0 && (
        <Card className="p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Package className="size-4 text-brand" />
            Matériel disponible
          </h3>
          <div className="flex flex-wrap gap-2">
            {supplier.items.map((item) => (
              <span
                key={item}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </Card>
      )}

      {supplier.services && supplier.services.length > 0 && (
        <Card className="p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Wrench className="size-4 text-brand" />
            Services proposés
          </h3>
          <div className="flex flex-wrap gap-2">
            {supplier.services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-brand/20 bg-brand-soft/50 px-3 py-1 text-xs font-medium text-brand-deep"
              >
                {service}
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Truck className="size-4 text-brand" />
          Zones couvertes
        </h3>
        <div className="flex flex-wrap gap-2">
          {supplier.zones.map((zone) => (
            <span
              key={zone}
              className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium"
            >
              {zone}
            </span>
          ))}
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          Commission SOS Santé par défaut : {supplier.commissionPct}%
        </p>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" disabled>
          Modifier mon profil
        </Button>
        <Button variant="outline" className="flex-1" disabled>
          Contacter SOS Santé
        </Button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">
        Mockup démo · les modifications seront activées après connexion fournisseur.
      </p>
    </div>
  );
}
