"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { telUrl, whatsAppUrl } from "@/lib/crm/phone-links";

type AdminCustomerDetailPageProps = { customerId: string };

export function AdminCustomerDetailPage({ customerId }: AdminCustomerDetailPageProps) {
  const { canQueryAdmin } = useAdminSession();
  const data = useQuery(
    api.customers.get,
    canQueryAdmin ? { id: customerId as Id<"customers"> } : "skip"
  );

  if (data === undefined) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        Chargement du client…
      </p>
    );
  }

  if (data === null) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        Client introuvable.
      </p>
    );
  }

  const { customer, orders } = data;

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/admin/customers">
          <ArrowLeft className="size-4" /> Retour
        </Link>
      </Button>

      <PageHeader
        title={customer.name}
        description={`${customer.city}${customer.district ? ` · ${customer.district}` : ""} · ${customer.ordersCount} commande${customer.ordersCount > 1 ? "s" : ""}`}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid size-14 place-items-center rounded-xl bg-brand-soft text-base font-bold text-brand-deep">
              {customer.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              {customer.status === "vip" ? (
                <Tag tone="brand">VIP</Tag>
              ) : customer.status === "actif" ? (
                <Tag tone="success">Actif</Tag>
              ) : (
                <Tag tone="neutral">Inactif</Tag>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Client depuis {customer.createdAtLabel}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="size-3.5 text-muted-foreground" /> {customer.phone}
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="size-3.5 text-muted-foreground" />{" "}
              {customer.whatsapp ?? customer.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-3.5 text-muted-foreground" /> {customer.email ?? "—"}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 text-muted-foreground" />{" "}
              {customer.address ?? "—"}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={telUrl(customer.phone)}>
                <Phone className="size-4" /> Appeler
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a
                href={whatsAppUrl(customer.whatsapp ?? customer.phone)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-border p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source</span>
              <span>{customer.source}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-muted-foreground">Dernière demande</span>
              <span>{customer.lastOrderLabel}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">
            Historique des commandes ({orders.length})
          </h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune commande pour ce client.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-2 font-medium">Réf.</th>
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium">Fournisseur</th>
                    <th className="py-2 font-medium">Statut</th>
                    <th className="py-2 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-mono text-xs">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-brand hover:underline"
                        >
                          {order.ref}
                        </Link>
                      </td>
                      <td className="py-2.5">
                        <div>{order.type}</div>
                        <div className="text-xs text-muted-foreground">{order.item}</div>
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        {order.supplierName ?? "—"}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-2.5 text-right text-xs text-muted-foreground">
                        {order.createdAtLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
