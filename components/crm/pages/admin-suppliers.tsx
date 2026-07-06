"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { Search, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ALL = "all";

type DeleteTarget = {
  id: Id<"suppliers">;
  name: string;
  ordersCount: number;
};

export function AdminSuppliersPage() {
  const { canQueryAdmin, staff } = useAdminSession();
  const canDeleteSupplier = staff?.role === "super_admin";
  const ensureDemo = useMutation(api.suppliers.ensureDemoSuppliers);
  const removeSupplier = useMutation(api.suppliers.remove);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [seedAttempted, setSeedAttempted] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const suppliers = useQuery(
    api.suppliers.list,
    canQueryAdmin
      ? {
          search: search.trim() || undefined,
          city: city === ALL ? undefined : city,
          type: type === ALL ? undefined : type,
          status:
            status === ALL
              ? undefined
              : (status as "actif" | "suspendu" | "en_attente"),
        }
      : "skip"
  );

  useEffect(() => {
    if (!canQueryAdmin || seedAttempted || suppliers === undefined) {
      return;
    }
    if (suppliers.length === 0) {
      void ensureDemo({}).finally(() => setSeedAttempted(true));
    } else {
      setSeedAttempted(true);
    }
  }, [canQueryAdmin, ensureDemo, seedAttempted, suppliers]);

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
          : "Impossible de supprimer ce fournisseur."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Fournisseurs"
        description={
          isLoading
            ? "Chargement…"
            : `${stats.total} fournisseurs partenaires · ${stats.verified} vérifiés`
        }
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" /> Inviter un fournisseur
          </Button>
        }
      />

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un fournisseur…"
              className="h-9 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes villes</SelectItem>
              <SelectItem value="Agadir">Agadir</SelectItem>
              <SelectItem value="Inezgane">Inezgane</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous types</SelectItem>
              <SelectItem value="Matériel médical">Matériel médical</SelectItem>
              <SelectItem value="Aide à domicile">Aide à domicile</SelectItem>
              <SelectItem value="Soins à domicile">Soins à domicile</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[130px]">
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
                <th className="py-2.5 text-center font-medium">Commandes</th>
                <th className="py-2.5 text-center font-medium">Réponse moy.</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement des fournisseurs…
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun fournisseur trouvé.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s._id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-xs font-semibold text-brand-deep">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/suppliers/${s._id}`}
                            className="font-medium text-foreground hover:text-brand"
                          >
                            {s.name}
                          </Link>
                          {s.verified ? (
                            <p className="flex items-center gap-1 text-[11px] text-success">
                              <ShieldCheck className="size-3" /> Vérifié
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{s.type}</td>
                    <td className="py-3">
                      <div>{s.city}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.zones.join(", ")}
                      </div>
                    </td>
                    <td className="py-3 text-xs">
                      <div>{s.phone}</div>
                      <div className="text-muted-foreground">{s.email ?? "—"}</div>
                    </td>
                    <td className="py-3 text-center font-medium">{s.ordersCount}</td>
                    <td className="py-3 text-center text-muted-foreground">
                      {s.responseAvg ?? "—"}
                    </td>
                    <td className="py-3">
                      {s.status === "actif" && <Tag tone="success">Actif</Tag>}
                      {s.status === "en_attente" && <Tag tone="warning">En attente</Tag>}
                      {s.status === "suspendu" && <Tag tone="danger">Suspendu</Tag>}
                      {s.profileComplete === false ? (
                        <Tag tone="warning">Profil à compléter</Tag>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/suppliers/${s._id}`}>Voir</Link>
                        </Button>
                        {canDeleteSupplier ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-status-error hover:bg-status-error/10 hover:text-status-error"
                            onClick={() =>
                              setDeleteTarget({
                                id: s._id,
                                name: s.name,
                                ordersCount: s.ordersCount,
                              })
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <SupplierFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce fournisseur ?</AlertDialogTitle>
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
                      fournisseur assigné.
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
