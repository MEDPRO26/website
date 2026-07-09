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
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  User,
  Calendar,
  Clock,
  Truck,
  ArrowLeft,
  StickyNote,
  GitBranch,
  UserCheck,
  Receipt,
  Send,
  ClipboardList,
  CalendarClock,
  History,
  UserCog,
  ExternalLink,
  Package,
} from "lucide-react";
import { formatOrderOriginDisplay, getOrderSourceLabel } from "@/lib/crm/format-page-path";
import {
  resolveOrderItemPreview,
  resolveOrderTypeWebsiteLink,
} from "@/lib/crm/resolve-order-item-link";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatEventTime, mapConvexOrderToUi } from "@/lib/crm/map-convex-order";
import { adminConversationHref } from "@/lib/crm/conversation-links";
import { telUrl } from "@/lib/crm/phone-links";
import { OrderClientRemarks } from "@/components/crm/order-client-remarks";
import { orderShowsSchedulingFields } from "@/lib/crm/order-scheduling";
import { cn } from "@/lib/utils";

type AdminOrderDetailPageProps = { orderId: string };

type SectionTone = "client" | "demande" | "supplier" | "quote" | "planning" | "history" | "workflow";

const SECTION_TONE: Record<
  SectionTone,
  { icon: string; ring: string }
> = {
  workflow: {
    icon: "bg-brand/12 text-brand ring-brand/20",
    ring: "border-l-brand",
  },
  client: {
    icon: "bg-info/12 text-info ring-info/20",
    ring: "border-l-info",
  },
  demande: {
    icon: "bg-secondary/10 text-secondary ring-secondary/15",
    ring: "border-l-secondary",
  },
  supplier: {
    icon: "bg-warning-soft text-[color:oklch(0.45_0.13_60)] ring-warning/25",
    ring: "border-l-warning",
  },
  quote: {
    icon: "bg-success-soft text-success ring-success/20",
    ring: "border-l-success",
  },
  planning: {
    icon: "bg-brand-soft text-brand-deep ring-brand/15",
    ring: "border-l-brand-deep",
  },
  history: {
    icon: "bg-muted text-muted-foreground ring-border",
    ring: "border-l-border",
  },
};

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
        <Button asChild variant="link">
          <Link href="/admin/orders">Retour aux commandes</Link>
        </Button>
      </div>
    );
  }

  const o = mapConvexOrderToUi({
    ...data.order,
    customer: data.customer,
    assignedStaffName: data.assignedStaff?.name ?? null,
  });
  const customer = data.customer;
  const events = [...data.events].reverse();
  const typeWebsiteLink = resolveOrderTypeWebsiteLink(o.type, o.city);
  const itemPreview = resolveOrderItemPreview(o.type, o.item, o.city);
  const itemLinkLabel = getItemLinkLabel(o.type);
  const showScheduling = orderShowsSchedulingFields(o.type);

  return (
    <div className="pb-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3 text-muted-foreground hover:text-foreground">
        <Link href="/admin/orders">
          <ArrowLeft className="size-4" /> Retour aux commandes
        </Link>
      </Button>

      <div className="mb-5 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-white via-white to-brand-soft/25 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-xl font-bold tracking-tight text-secondary sm:text-2xl">
                {o.ref}
              </h1>
              <StatusBadge status={o.status} />
              <Tag tone="neutral">
                {getOrderSourceLabel(o.source, data.order.pagePath)}
              </Tag>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-brand" />
                Créée le {o.createdAt}
              </span>
              <span className="hidden text-border sm:inline">·</span>
              <span className="inline-flex items-center gap-1.5">
                <UserCog className="size-3.5 text-brand" />
                Assistant :{" "}
                <span className="font-medium text-foreground">{o.assistant}</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <SectionCard tone="workflow" icon={UserCog} title="Suivi & affectation" className="mb-4">
        <div className="space-y-4">
          <OrderAssignStaff
            orderId={data.order._id}
            assignedStaffId={data.order.assignedStaffId}
          />
          <Separator />
          <OrderWorkflowActions
            orderId={data.order._id}
            currentStatus={data.order.status}
          />
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard tone="client" icon={User} title="Infos client">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Nom complet" value={o.client} highlight />
              <Info label="Téléphone" value={o.phone} icon={Phone} />
              <Info label="WhatsApp" value={o.whatsapp} icon={MessageCircle} />
              <Info label="Email" value={customer?.email ?? "—"} icon={Mail} />
              <Info
                label="Ville · quartier"
                value={`${o.city}${o.district ? ` · ${o.district}` : ""}`}
                icon={MapPin}
              />
              <Info label="Adresse de livraison" value={o.address || "—"} icon={MapPin} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild className="border-border/80">
                <a href={telUrl(o.phone)}>
                  <Phone className="size-4 text-brand" /> Appeler
                </a>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-status-success text-white hover:bg-status-success/90"
              >
                <Link
                  href={adminConversationHref({
                    phone: o.whatsapp || o.phone,
                    name: o.client,
                    city: o.city,
                    orderSource: o.source,
                    orderId: data.order._id,
                    orderRef: o.ref,
                  })}
                >
                  <MessageCircle className="size-4" /> WhatsApp client
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild className="text-brand">
                <Link href={`/admin/customers/${customer?._id ?? data.order.customerId}`}>
                  Voir historique
                </Link>
              </Button>
            </div>
          </SectionCard>

          <SectionCard tone="demande" icon={ClipboardList} title="Détail de la demande">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Type
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Tag tone="brand">{o.type}</Tag>
                  {typeWebsiteLink ? (
                    <WebsiteLink href={typeWebsiteLink} label={getTypeLinkLabel(o.type)} />
                  ) : null}
                </div>
              </div>
              {showScheduling ? (
                <Info label="Durée" value={o.duration || "—"} icon={Clock} />
              ) : null}
              <div className="min-w-0 sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Matériel sollicité
                </p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/35 px-3 py-2.5">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <ItemThumbnail
                      image={itemPreview.image}
                      alt={itemPreview.alt}
                      href={itemPreview.href}
                    />
                    <p className="text-sm font-semibold text-foreground">{o.item}</p>
                  </div>
                  {itemPreview.href ? (
                    <WebsiteLink href={itemPreview.href} label={itemLinkLabel} />
                  ) : null}
                </div>
              </div>
              {showScheduling ? (
                <>
                  <Info label="Date souhaitée" value={o.desiredDate || "—"} icon={Calendar} />
                  <Info label="Créneau" value={o.slot || "—"} icon={Clock} />
                </>
              ) : null}
              <Info
                label="Origine"
                value={formatOrderOriginDisplay(o.source, data.order.pagePath)}
                className="sm:col-span-2"
              />
            </div>
            <Separator className="my-4" />
            <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Remarques client
            </Label>
            <OrderClientRemarks message={o.message} />
          </SectionCard>

          <SectionCard tone="supplier" icon={Truck} title="Affectation fournisseur">
            <OrderAssignSupplier
              orderId={data.order._id}
              supplierId={data.order.supplierId}
              supplierName={data.supplier?.name ?? null}
            />
          </SectionCard>

          <SectionCard tone="quote" icon={Receipt} title="Prix fournisseur & SOS commission">
            <OrderQuotePanel
              orderId={data.order._id}
              supplierId={data.order.supplierId}
            />
          </SectionCard>

          {showScheduling ? (
            <SectionCard tone="planning" icon={CalendarClock} title="Planning">
              <div className="grid gap-4 sm:grid-cols-2">
                <Info label="Date d'intervention" value={o.desiredDate} icon={Calendar} />
                <Info label="Créneau" value={o.slot} icon={Clock} />
                <Info label="Adresse" value={`${o.city} · ${o.district}`} icon={MapPin} />
                <Info label="Contact sur place" value={o.phone} icon={Phone} />
              </div>
            </SectionCard>
          ) : null}
        </div>

        <SectionCard
          tone="history"
          icon={History}
          title="Suivi d'activité"
          className="h-fit lg:sticky lg:top-20"
        >
          <ol className="relative space-y-5 border-l-2 border-brand/15 pl-5">
            {events.map((event, index) => (
              <li key={event._id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[26px] top-0.5 grid size-4 place-items-center rounded-full border-2 border-card shadow-sm",
                    index === 0 ? "bg-brand text-white" : "bg-background"
                  )}
                >
                  <EventIcon type={event.type} active={index === 0} />
                </span>
                <p className="text-sm font-semibold text-foreground">{event.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatEventTime(event.createdAt)}
                </p>
              </li>
            ))}
          </ol>
          <OrderNoteForm orderId={data.order._id} />
        </SectionCard>
      </div>
    </div>
  );
}

function getTypeLinkLabel(type: string) {
  const normalized = type.toLowerCase();
  if (normalized.includes("vente")) {
    return "Catalogue vente";
  }
  if (normalized.includes("location")) {
    return "Page location";
  }
  if (normalized.includes("service") || normalized.includes("domicile")) {
    return "Nos services";
  }
  return "Voir sur le site";
}

function getItemLinkLabel(type: string) {
  const normalized = type.toLowerCase();
  if (normalized.includes("service") || normalized.includes("domicile")) {
    return "Voir le service";
  }
  if (normalized.includes("vente")) {
    return "Voir le produit";
  }
  if (normalized.includes("location")) {
    return "Voir le matériel";
  }
  return "Voir sur le site";
}

function ItemThumbnail({
  image,
  alt,
  href,
}: {
  image: string | null;
  alt: string;
  href: string | null;
}) {
  const className =
    "size-14 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-white object-cover shadow-sm";

  if (image) {
    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" title={alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} className={className} />
        </a>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={alt} className={className} />
    );
  }

  return (
    <div
      className={`flex ${className} items-center justify-center text-muted-foreground`}
      aria-hidden
    >
      <Package className="size-5" />
    </div>
  );
}

function WebsiteLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-brand/25 bg-brand-soft/40 px-2.5 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand-soft hover:text-brand-deep"
    >
      <ExternalLink className="size-3" />
      {label}
    </a>
  );
}

function SectionCard({
  tone,
  icon: Icon,
  title,
  children,
  className,
}: {
  tone: SectionTone;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const styles = SECTION_TONE[tone];
  return (
    <Card
      className={cn(
        "overflow-hidden border-border/70 shadow-sm",
        `border-l-4 ${styles.ring}`,
        className
      )}
    >
      <div className="border-b border-border/50 bg-muted/20 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
              styles.icon
            )}
          >
            <Icon className="size-4" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

function EventIcon({ type, active }: { type: string; active?: boolean }) {
  const className = cn("size-2.5", active ? "text-white" : "text-brand");
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

function Info({
  label,
  value,
  icon: Icon,
  highlight,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 flex items-center gap-2 text-sm text-foreground",
          highlight ? "font-semibold" : "font-medium"
        )}
      >
        {Icon ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
            <Icon className="size-3.5" />
          </span>
        ) : null}
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}
