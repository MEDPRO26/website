"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { SupplierFormDialog } from "@/components/crm/supplier-form-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Search, ShieldCheck, Plus, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  partnerKindTypeOptions,
  type SupplierPartnerKind,
} from "@/lib/supplier-activity-types";

const ALL = "all";

type DeleteTarget = {
  id: Id<"suppliers">;
  name: string;
  ordersCount: number;
};

type AdminSuppliersPageProps = {
  partnerKind?: SupplierPartnerKind;
};

export function AdminSuppliersPage({
  partnerKind = "materiel",
}: AdminSuppliersPageProps) {
  const isSoins = partnerKind === "soins";
  const listBasePath = isSoins ? "/admin/prestataires" : "/admin/suppliers";
  const entityLabel = isSoins ? "prestataire" : "fournisseur";
  const entityLabelPlural = isSoins ? "prestataires" : "fournisseurs";
  const typeFilterOptions = partnerKindTypeOptions(partnerKind).filter(
    (type) => type !== "Autre"
  );

  const { canQueryAdmin, staff } = useAdminSession();
  const canDeleteSupplier = staff?.role === "super_admin";
  const removeSupplier = useMutation(api.suppliers.remove);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const suppliers = useQuery(
    api.suppliers.list,
    canQueryAdmin
      ? {
          search: search.trim() || undefined,
          city: city === ALL ? undefined : city,
          type: type === ALL ? undefined : type,
          partnerKind,
          status:
            status === ALL
              ? undefined
              : (status as "actif" | "suspendu" | "en_attente"),
        }
      : "skip"
  );

  const stats = useMemo(() => {
    const list = suppliers ?? [];
    return {
      total: list.length,
      verified: list.filter((s) => s.verified).length,
    };
  }, [suppliers]);

  const isLoading = suppliers === undefined;

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await removeSupplier({ id: deleteTarget.id });
      toast.success(`${deleteTarget.name} a été supprimé.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Impossible de supprimer ce ${entityLabel}.`
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title={isSoins ? "Prestataires soins" : "Fournisseurs"}
        description={
          isLoading
            ? "Chargement…"
            : isSoins
              ? `${stats.total} prestataires soins à domicile · ${stats.verified} vérifiés`
              : `${stats.total} fournisseurs partenaires · ${stats.verified} vérifiés`
        }
        actions={
          <Button onClick={() => setDialogOpen(true)} className="rounded-xl">
            <Plus className="size-4" />{" "}
            {isSoins ? "Inviter un prestataire" : "Inviter un fournisseur"}
          </Button>
        }
      />

      <Card className="border-0 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Recherche
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  isSoins
                    ? "Rechercher un prestataire…"
                    : "Rechercher un fournisseur…"
                }
                className="h-10 bg-white pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Ville</label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-10 w-full lg:w-[160px]">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Toutes villes</SelectItem>
                <SelectItem value="Agadir">Agadir</SelectItem>
                <SelectItem value="Inezgane">Inezgane</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10 w-full lg:w-[220px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous types</SelectItem>
                {typeFilterOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Statut</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 w-full lg:w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold">
            Liste des {entityLabelPlural}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isLoading
              ? "Chargement…"
              : `${suppliers?.length ?? 0} résultat${(suppliers?.length ?? 0) > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-muted/30">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">
                  {isSoins ? "Prestataire" : "Fournisseur"}
                </th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Ville / Zones</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3 text-center">Commandes</th>
                <th className="px-3 py-3 text-center">Réponse moy.</th>
                <th className="px-3 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    Chargement des {entityLabelPlural}…
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    Aucun {entityLabel} trouvé.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => {
                  const extraZones = s.zones.filter((zone) => zone !== s.city);

                  return (
                    <tr
                      key={s._id}
                      className="border-t border-border/60 transition-colors hover:bg-muted/20"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-xs font-bold text-brand-deep">
                            {s.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`${listBasePath}/${s._id}`}
                              className="font-semibold text-foreground transition-colors hover:text-brand"
                            >
                              {s.name}
                            </Link>
                            {s.verified ? (
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-success">
                                <ShieldCheck className="size-3" /> Vérifié
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-muted-foreground">{s.type}</span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="min-w-[120px] space-y-0.5">
                          <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                            {s.city}
                          </p>
                          {extraZones.length > 0 ? (
                            <p className="pl-5 text-xs leading-relaxed text-muted-foreground">
                              {extraZones.join(", ")}
                            </p>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="min-w-[140px] space-y-1">
                          <p className="inline-flex items-center gap-1.5 text-sm text-foreground">
                            <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                            {s.phone}
                          </p>
                          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="size-3.5 shrink-0" />
                            {s.email ?? "—"}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span className="font-semibold tabular-nums">{s.ordersCount}</span>
                      </td>
                      <td className="px-3 py-4 text-center text-muted-foreground">
                        {s.responseAvg ?? "—"}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {s.status === "actif" && <Tag tone="success">Actif</Tag>}
                          {s.status === "en_attente" && <Tag tone="warning">En attente</Tag>}
                          {s.status === "suspendu" && <Tag tone="danger">Suspendu</Tag>}
                          {s.profileComplete === false ? (
                            <Tag tone="warning">Profil à compléter</Tag>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-3">
                            <Link href={`${listBasePath}/${s._id}`}>Voir</Link>
                          </Button>
                          {canDeleteSupplier ? (
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="size-8 text-status-error hover:bg-status-error/10 hover:text-status-error"
                              onClick={() =>
                                setDeleteTarget({
                                  id: s._id,
                                  name: s.name,
                                  ordersCount: s.ordersCount,
                                })
                              }
                              aria-label={`Supprimer ${s.name}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <SupplierFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        partnerKind={partnerKind}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer ce {entityLabel} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  <span className="font-medium text-foreground">{deleteTarget.name}</span>{" "}
                  sera définitivement supprimé avec ses invitations et devis associés.
                  {deleteTarget.ordersCount > 0 ? (
                    <>
                      {" "}
                      {deleteTarget.ordersCount} commande
                      {deleteTarget.ordersCount > 1 ? "s" : ""} liée
                      {deleteTarget.ordersCount > 1 ? "s" : ""} resteront sans
                      {isSoins ? " prestataire" : " fournisseur"} assigné.
                    </>
                  ) : null}
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-status-error text-white hover:bg-status-error/90"
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
