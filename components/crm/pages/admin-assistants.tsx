"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";

const STATUS_LABEL: Record<string, string> = {
  actif: "Actif",
  suspendu: "Suspendu",
  en_attente: "En attente",
};

type AssistantRow = Doc<"staff"> & {
  supplierName: string | null;
  createdLabel: string;
  updatedLabel: string;
};

export function AdminAssistantsPage() {
  const { canQuery, staff: currentStaff } = useAdminSession();
  const canManage = canQuery("users.invite");
  const staffList = useQuery(api.staff.list, canManage ? {} : "skip");
  const removeStaffUser = useMutation(api.staff.removeStaffUser);
  const inviteAssistant = useMutation(api.staffInvitations.inviteAssistant);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<AssistantRow | null>(null);
  const [removing, setRemoving] = useState(false);

  const assistants = useMemo(
    () => (staffList ?? []).filter((member) => member.role === "assistant"),
    [staffList]
  );

  const openDelete = (member: AssistantRow) => {
    setDeleting(member);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setRemoving(true);
    try {
      await removeStaffUser({ staffId: deleting._id });
      toast.success(`${deleting.name} a été supprimé.`);
      setDeleteOpen(false);
      setDeleting(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de supprimer l'assistant."
      );
    } finally {
      setRemoving(false);
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

  if (!canManage) {
    return (
      <div>
        <PageHeader
          title="Assistants"
          description="Gestion des comptes assistant du CRM."
        />
        <Card className="border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seuls les administrateurs peuvent gérer les assistants.
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Assistants"
        description={
          staffList === undefined
            ? "Chargement…"
            : `${assistants.length} assistant${assistants.length > 1 ? "s" : ""} · équipe CRM`
        }
        actions={
          <Button className="rounded-xl" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Ajouter un assistant
          </Button>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Nom</th>
                <th className="py-2.5 font-medium">Email</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="py-2.5 font-medium">Créé le</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {staffList === undefined ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              ) : assistants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun assistant pour le moment. Envoyez une invitation pour commencer.
                  </td>
                </tr>
              ) : (
                assistants.map((member) => (
                  <tr key={member._id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{member.name}</td>
                    <td className="py-3 text-muted-foreground">{member.email}</td>
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
                      {member._id !== currentStaff?._id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDelete(member)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
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
              {inviting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Envoyer l'invitation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) {
            setDeleting(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet assistant ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de <strong>{deleting?.name}</strong> ({deleting?.email})
              sera définitivement supprimé du CRM et de la base de données. Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={removing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {removing ? <Loader2 className="size-4 animate-spin" /> : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
