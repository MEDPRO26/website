"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  assistant: "Assistant",
  supplier: "Fournisseur",
  customer: "Client",
};

const STATUS_LABEL: Record<string, string> = {
  actif: "Actif",
  suspendu: "Suspendu",
  en_attente: "En attente",
};

type StaffRow = Doc<"staff"> & {
  supplierName: string | null;
  createdLabel: string;
  updatedLabel: string;
};

export function AdminUsersPage() {
  const { canQueryAdmin, staff: currentStaff } = useAdminSession();
  const staffList = useQuery(api.staff.list, canQueryAdmin ? {} : "skip");
  const suppliers = useQuery(
    api.suppliers.list,
    canQueryAdmin ? { status: "actif" } : "skip"
  );
  const updateRole = useMutation(api.staff.updateRole);
  const updateStatus = useMutation(api.staff.updateStatus);
  const inviteAssistant = useMutation(api.staffInvitations.inviteAssistant);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [role, setRole] = useState("assistant");
  const [status, setStatus] = useState("actif");
  const [supplierId, setSupplierId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canManage =
    currentStaff?.role === "super_admin" || currentStaff?.role === "admin";

  const rows = useMemo(() => staffList ?? [], [staffList]);

  const openEdit = (member: StaffRow) => {
    setEditing(member);
    setRole(member.role);
    setStatus(member.status);
    setSupplierId(member.supplierId ?? "");
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSubmitting(true);
    try {
      await updateRole({
        staffId: editing._id,
        role: role as StaffRow["role"],
        supplierId:
          role === "supplier" && supplierId
            ? (supplierId as Id<"suppliers">)
            : undefined,
      });
      if (status !== editing.status) {
        await updateStatus({
          staffId: editing._id,
          status: status as StaffRow["status"],
        });
      }
      toast.success("Utilisateur mis à jour.");
      setEditOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de mettre à jour."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) {
      toast.error("Indiquez une adresse email.");
      return;
    }

    setInviting(true);
    try {
      await inviteAssistant({ email });
      toast.success(`Invitation envoyée à ${email}.`);
      setInviteOpen(false);
      setInviteEmail("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer l'invitation."
      );
    } finally {
      setInviting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Utilisateurs & rôles"
        description={
          staffList === undefined
            ? "Chargement…"
            : `${rows.length} utilisateur${rows.length > 1 ? "s" : ""} · comptes CRM et fournisseurs`
        }
        actions={
          canManage ? (
            <Button className="rounded-xl" onClick={() => setInviteOpen(true)}>
              <UserPlus className="size-4" />
              Ajouter un assistant
            </Button>
          ) : null
        }
      />

      {!canManage ? (
        <Card className="mb-4 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seuls les administrateurs peuvent modifier les rôles et statuts.
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Nom</th>
                <th className="py-2.5 font-medium">Email</th>
                <th className="py-2.5 font-medium">Rôle</th>
                <th className="py-2.5 font-medium">Fournisseur lié</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="py-2.5 font-medium">Créé le</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {staffList === undefined ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun utilisateur pour le moment.
                  </td>
                </tr>
              ) : (
                rows.map((member) => (
                  <tr key={member._id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{member.name}</td>
                    <td className="py-3 text-muted-foreground">{member.email}</td>
                    <td className="py-3">
                      <Tag
                        tone={
                          member.role === "super_admin" || member.role === "admin"
                            ? "brand"
                            : member.role === "supplier"
                              ? "info"
                              : "neutral"
                        }
                      >
                        {ROLE_LABEL[member.role] ?? member.role}
                      </Tag>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {member.supplierName ?? "—"}
                    </td>
                    <td className="py-3">
                      <Tag
                        tone={
                          member.status === "actif"
                            ? "success"
                            : member.status === "en_attente"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {STATUS_LABEL[member.status] ?? member.status}
                      </Tag>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {member.createdLabel}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canManage}
                        onClick={() => openEdit(member)}
                      >
                        Modifier
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Un email d&apos;invitation sera envoyé. La personne pourra créer son
              mot de passe et accéder au CRM.
            </p>
            <div>
              <Label htmlFor="invite-email">Email Gmail</Label>
              <Input
                id="invite-email"
                type="email"
                className="mt-1.5"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="assistant@gmail.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Annuler
            </Button>
            <Button disabled={inviting} onClick={() => void handleInvite()}>
              {inviting ? <Loader2 className="size-4 animate-spin" /> : "Envoyer l'invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier {editing?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="mb-1.5 block">Rôle</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="supplier">Fournisseur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === "supplier" ? (
              <div>
                <Label className="mb-1.5 block">Fournisseur lié</Label>
                <Select value={supplierId || undefined} onValueChange={setSupplierId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {(suppliers ?? []).map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div>
              <Label className="mb-1.5 block">Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button disabled={submitting} onClick={() => void handleSave()}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
