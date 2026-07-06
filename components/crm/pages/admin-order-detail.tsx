"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { useAdminSession } from "@/hooks/use-admin-session";
import { StatusBadge, Tag } from "@/components/dashboard/status-badge";
import { OrderAssignStaff } from "@/components/crm/order-assign-staff";
import { OrderAssignSupplier } from "@/components/crm/order-assign-supplier";
import { OrderNoteForm } from "@/components/crm/order-note-form";
import { OrderQuotePanel } from "@/components/crm/order-quote-panel";
import { OrderWorkflowActions } from "@/components/crm/order-workflow-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone, MessageCircle, Mail, MapPin, User, Calendar, Clock,
  Truck, ArrowLeft, StickyNote, GitBranch, UserCheck, Receipt, Send,
} from "lucide-react";
import { formatOrderOriginDisplay, getOrderSourceLabel } from "@/lib/crm/format-page-path";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatEventTime, mapConvexOrderToUi } from "@/lib/crm/map-convex-order";
import { adminConversationHref } from "@/lib/crm/conversation-links";
import { telUrl } from "@/lib/crm/phone-links";

type AdminOrderDetailPageProps = { orderId: string };

export function AdminOrderDetailPage({ orderId }: AdminOrderDetailPageProps) {
  const { canQueryAdmin } = useAdminSession();
  const data = useQuery(
    api.orders.get,
    canQueryAdmin ? { id: orderId as Id<"orders"> } : "skip"
  );

  if (data === undefined) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Chargement de la demande…</p>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Commande introuvable.</p>
        <Button asChild variant="link"><Link href="/admin/orders">Retour aux commandes</Link></Button>
      </div>
    );
  }

  const o = mapConvexOrderToUi({
    ...data.order,
    customer: data.customer,
    assignedStaffName: data.assignedStaff?.name ?? null,
  });
  const customer = data.customer;
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
            <Tag tone="neutral">
              {getOrderSourceLabel(o.source, data.order.pagePath)}
            </Tag>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Créée le {o.createdAt} · Assistant : <span className="font-medium text-foreground">{o.assistant}</span>
          </p>
        </div>
      </div>

      <Card className="mb-4 p-4">
        <div className="space-y-4">
          <OrderAssignStaff
            orderId={data.order._id}
            assignedStaffId={data.order.assignedStaffId}
          />
          <OrderWorkflowActions
            orderId={data.order._id}
            currentStatus={data.order.status}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2"><User className="size-4" /> Client</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Nom" value={o.client} />
              <Info label="Téléphone" value={o.phone} icon={Phone} />
              <Info label="WhatsApp" value={o.whatsapp} icon={MessageCircle} />
              <Info label="Email" value={customer?.email ?? "—"} icon={Mail} />
              <Info label="Ville · quartier" value={`${o.city}${o.district ? ` · ${o.district}` : ""}`} icon={MapPin} />
              <Info label="Adresse" value={o.address || "—"} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <a href={telUrl(o.phone)}>
                  <Phone className="size-4" /> Appeler
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={adminConversationHref({
                    phone: o.whatsapp || o.phone,
                    name: o.client,
                    city: o.city,
                    message: o.message || undefined,
                  })}
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/admin/customers/${customer?._id ?? data.order.customerId}`}>
                  Voir historique
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Demande</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Type" value={o.type} />
              <Info label="Matériel / service" value={o.item} />
              <Info label="Durée" value={o.duration || "—"} />
              <Info label="Date souhaitée" value={o.desiredDate || "—"} icon={Calendar} />
              <Info label="Créneau" value={o.slot || "—"} icon={Clock} />
              <Info
                label="Origine"
                value={formatOrderOriginDisplay(o.source, data.order.pagePath)}
              />
            </div>
            <Separator className="my-4" />
            <Label className="mb-1.5 block">Message du client</Label>
            <p className="rounded-lg bg-muted p-3 text-sm">{o.message || "—"}</p>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Truck className="size-4" /> Affectation fournisseur
            </h3>
            <OrderAssignSupplier
              orderId={data.order._id}
              supplierId={data.order.supplierId}
              supplierName={data.supplier?.name ?? null}
            />
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Receipt className="size-4" /> Prix fournisseur & offre client
            </h3>
            <OrderQuotePanel
              orderId={data.order._id}
              orderStatus={data.order.status}
              supplierId={data.order.supplierId}
              clientName={o.client}
              item={o.item}
              desiredDate={o.desiredDate}
              slot={o.slot}
            />
          </Card>

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
            {[...data.events].reverse().map((event) => (
              <li key={event._id} className="relative">
                <span className="absolute -left-[21px] top-1 grid size-3.5 place-items-center rounded-full border-2 border-card bg-background">
                  <EventIcon type={event.type} />
                </span>
                <p className="text-sm font-medium text-foreground">{event.label}</p>
                <p className="text-xs text-muted-foreground">{formatEventTime(event.createdAt)}</p>
              </li>
            ))}
          </ol>
          <OrderNoteForm orderId={data.order._id} />
        </Card>
      </div>
    </div>
  );
}

function EventIcon({ type }: { type: string }) {
  const className = "size-2.5 text-brand";
  switch (type) {
    case "status_change":
      return <GitBranch className={className} />;
    case "assignment":
      return <UserCheck className={className} />;
    case "note":
      return <StickyNote className={className} />;
    case "quote":
      return <Receipt className={className} />;
    case "offer":
      return <Send className={className} />;
    default:
      return <GitBranch className={className} />;
  }
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
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