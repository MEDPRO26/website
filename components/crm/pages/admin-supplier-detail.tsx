"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag, StatusBadge } from "@/components/dashboard/status-badge";
import { SupplierFormDialog } from "@/components/crm/supplier-form-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";

type AdminSupplierDetailPageProps = { supplierId: string };

export function AdminSupplierDetailPage({ supplierId }: AdminSupplierDetailPageProps) {
  const { canQueryAdmin } = useAdminSession();
  const updateStatus = useMutation(api.suppliers.updateStatus);
  const resendInvite = useMutation(api.supplierInvitations.resendForSupplier);
  const createInviteLink = useMutation(api.supplierInvitations.createInviteLink);
  const data = useQuery(
    api.suppliers.get,
    canQueryAdmin ? { id: supplierId as Id<"suppliers"> } : "skip"
  );
  const latestInvite = useQuery(
    api.supplierInvitations.getLatestForSupplier,
    canQueryAdmin ? { supplierId: supplierId as Id<"suppliers"> } : "skip"
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [copyingLink, setCopyingLink] = useState(false);

  if (data === undefined) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Chargement du fournisseur…
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Fournisseur introuvable.
      </div>
    );
  }

  const s = data.supplier;

  const handleStatusChange = async (status: "actif" | "suspendu" | "en_attente") => {
    try {
      await updateStatus({ id: s._id, status });
      toast.success("Statut mis à jour.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de changer le statut."
      );
    }
  };

  const handleResendInvite = async () => {
    setResending(true);
    try {
      await resendInvite({ supplierId: s._id });
      toast.success("Invitation renvoyée par email.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de renvoyer l'invitation."
      );
    } finally {
      setResending(false);
    }
  };

  const handleCopyInviteLink = async () => {
    setCopyingLink(true);
    try {
      const { inviteUrl } = await createInviteLink({ supplierId: s._id });
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Lien d'invitation copié.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de générer le lien."
      );
    } finally {
      setCopyingLink(false);
    }
  };

  const inviteLabel =
    latestInvite?.status === "accepted"
      ? "Compte activé"
      : latestInvite?.status === "pending"
        ? "Invitation en attente"
        : latestInvite?.status === "expired"
          ? "Invitation expirée"
          : "Aucune invitation";

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/admin/suppliers">
          <ArrowLeft className="size-4" /> Retour
        </Link>
      </Button>

      <PageHeader
        title={s.name}
        description={`${s.type} · ${s.city}`}
        actions={
          <>
            <Select
              value={s.status}
              onValueChange={(value) =>
                void handleStatusChange(value as "actif" | "suspendu" | "en_attente")
              }
            >
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              Modifier
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-xl bg-brand-soft text-base font-bold text-brand-deep">
                {s.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{s.name}</p>
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
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 text-muted-foreground" /> {s.phone}
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="size-3.5 text-muted-foreground" />{" "}
                {s.whatsapp ?? s.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 text-muted-foreground" /> {s.email ?? "—"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-3.5 text-muted-foreground" />{" "}
                {s.zones.join(", ")}
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Performance</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold">{data.ordersCount}</p>
                <p className="text-[11px] text-muted-foreground">Commandes</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{s.responseAvg ?? "—"}</p>
                <p className="text-[11px] text-muted-foreground">Réponse</p>
              </div>
              <div>
                <p className="text-lg font-semibold">MAD</p>
                <p className="text-[11px] text-muted-foreground">Commission / devis</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Accès fournisseur</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Profil complété</span>
                <Tag tone={s.profileComplete === false ? "warning" : "success"}>
                  {s.profileComplete === false ? "En attente" : "Complet"}
                </Tag>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Statut invitation</span>
                <Tag
                  tone={
                    latestInvite?.status === "accepted"
                      ? "success"
                      : latestInvite?.status === "pending"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {inviteLabel}
                </Tag>
              </div>
              {latestInvite?.email ? (
                <p className="text-xs text-muted-foreground">
                  Email invité : {latestInvite.email}
                </p>
              ) : null}
              {s.email ? (
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    disabled={resending}
                    onClick={() => void handleResendInvite()}
                  >
                    {resending ? "Envoi…" : "Renvoyer l'invitation"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    disabled={copyingLink}
                    onClick={() => void handleCopyInviteLink()}
                  >
                    <Copy className="size-4" />
                    {copyingLink ? "Génération…" : "Copier le lien d'invitation"}
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Ajoutez un email pour inviter le fournisseur.
                </p>
              )}
            </div>
          </Card>

          {s.notes ? (
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Notes internes</h3>
              <p className="text-sm text-muted-foreground">{s.notes}</p>
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Matériels & services proposés</h3>
            <div className="flex flex-wrap gap-1.5">
              {s.items.map((item) => (
                <Tag key={item} tone="info">
                  {item}
                </Tag>
              ))}
              {s.services.map((service) => (
                <Tag key={service} tone="brand">
                  {service}
                </Tag>
              ))}
              {s.items.length === 0 && s.services.length === 0 ? (
                <p className="text-sm text-muted-foreground">Non renseigné.</p>
              ) : null}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Commission SOS Santé</h3>
            <div className="rounded-lg border border-border p-4 text-sm">
              <p className="text-muted-foreground">
                Le fournisseur déclare la commission (MAD) à chaque devis. Le client
                paie le prix des prestations ; la commission est réglée séparément.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Historique commandes ({data.orders.length})
              </h3>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/orders">Toutes les commandes</Link>
              </Button>
            </div>
            {data.orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune commande affectée à ce fournisseur pour le moment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="py-2 font-medium">Réf.</th>
                      <th className="py-2 font-medium">Client</th>
                      <th className="py-2 font-medium">Statut</th>
                      <th className="py-2 text-right font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((order) => (
                      <tr key={order._id} className="border-b border-border last:border-0">
                        <td className="py-2.5 font-mono text-xs">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="text-brand hover:underline"
                          >
                            {order.ref}
                          </Link>
                        </td>
                        <td className="py-2.5">{order.customerName}</td>
                        <td className="py-2.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-2.5 text-right text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
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

      <SupplierFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        supplier={s}
      />
    </div>
  );
}
