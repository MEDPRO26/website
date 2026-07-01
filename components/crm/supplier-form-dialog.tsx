"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPLIER_TYPES = [
  "Matériel médical",
  "Aide à domicile",
  "Soins à domicile",
  "Garde-malade",
  "Autre",
];

const CITIES = ["Agadir", "Inezgane", "Dcheira", "Aourir", "Biougra", "Autre"];

export type SupplierFormValues = {
  name: string;
  type: string;
  city: string;
  zonesText: string;
  phone: string;
  whatsapp: string;
  email: string;
  itemsText: string;
  servicesText: string;
  notes: string;
  verified: boolean;
};

const EMPTY_INVITE = {
  email: "",
};

const EMPTY_EDIT: SupplierFormValues = {
  name: "",
  type: "Matériel médical",
  city: "Agadir",
  zonesText: "Agadir",
  phone: "",
  whatsapp: "",
  email: "",
  itemsText: "",
  servicesText: "",
  notes: "",
  verified: false,
};

function parseLines(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function supplierToForm(supplier: Doc<"suppliers">): SupplierFormValues {
  return {
    name: supplier.name,
    type: supplier.type,
    city: supplier.city,
    zonesText: supplier.zones.join(", "),
    phone: supplier.phone === "—" ? "" : supplier.phone,
    whatsapp: supplier.whatsapp ?? "",
    email: supplier.email ?? "",
    itemsText: supplier.items.join(", "),
    servicesText: supplier.services.join(", "),
    notes: supplier.notes ?? "",
    verified: supplier.verified,
  };
}

type SupplierFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Doc<"suppliers"> | null;
  onSuccess?: () => void;
};

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSuccess,
}: SupplierFormDialogProps) {
  const inviteByEmail = useMutation(api.suppliers.inviteByEmail);
  const updateSupplier = useMutation(api.suppliers.update);
  const [inviteForm, setInviteForm] = useState(EMPTY_INVITE);
  const [editForm, setEditForm] = useState<SupplierFormValues>(EMPTY_EDIT);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (supplier) {
        setEditForm(supplierToForm(supplier));
      } else {
        setInviteForm(EMPTY_INVITE);
      }
    }
  }, [open, supplier]);

  const handleInvite = async () => {
    const email = inviteForm.email.trim();
    if (!email) {
      toast.error("L'email est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      await inviteByEmail({ email });
      toast.success("Invitation envoyée. Le fournisseur complétera son profil.");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer l'invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!supplier) {
      return;
    }

    if (!editForm.name.trim() || !editForm.phone.trim()) {
      toast.error("Nom et téléphone sont obligatoires.");
      return;
    }

    const payload = {
      name: editForm.name,
      type: editForm.type,
      city: editForm.city,
      zones: parseLines(editForm.zonesText),
      phone: editForm.phone,
      whatsapp: editForm.whatsapp.trim() || undefined,
      email: editForm.email.trim() || undefined,
      commissionPct: supplier.commissionPct,
      items: parseLines(editForm.itemsText),
      services: parseLines(editForm.servicesText),
      notes: editForm.notes.trim() || undefined,
      verified: editForm.verified,
    };

    setSubmitting(true);
    try {
      await updateSupplier({ id: supplier._id, ...payload });
      toast.success(
        editForm.email.trim() &&
          editForm.email.trim().toLowerCase() !==
            (supplier.email?.toLowerCase() ?? "")
          ? "Fournisseur mis à jour. Nouvelle invitation envoyée."
          : "Fournisseur mis à jour."
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'enregistrer le fournisseur."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Modifier le fournisseur" : "Inviter un fournisseur"}
          </DialogTitle>
        </DialogHeader>

        {!supplier ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Saisissez l&apos;email du partenaire. Il recevra un lien pour créer
              son mot de passe et compléter sa fiche (nom, téléphone, matériels…).
              La commission sera déclarée par le fournisseur à chaque devis.
            </p>
            <div>
              <Label>Email *</Label>
              <Input
                className="mt-1.5"
                type="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((current) => ({ ...current, email: e.target.value }))
                }
                placeholder="contact@fournisseur.ma"
                required
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nom *</Label>
              <Input
                className="mt-1.5"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((current) => ({ ...current, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) =>
                  setEditForm((current) => ({ ...current, type: value }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ville *</Label>
              <Select
                value={editForm.city}
                onValueChange={(value) =>
                  setEditForm((current) => ({ ...current, city: value }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Zones couvertes</Label>
              <Input
                className="mt-1.5"
                value={editForm.zonesText}
                onChange={(e) =>
                  setEditForm((current) => ({ ...current, zonesText: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Téléphone *</Label>
              <Input
                className="mt-1.5"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((current) => ({ ...current, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input
                className="mt-1.5"
                value={editForm.whatsapp}
                onChange={(e) =>
                  setEditForm((current) => ({ ...current, whatsapp: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Email</Label>
              <Input
                className="mt-1.5"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((current) => ({ ...current, email: e.target.value }))
                }
              />
            </div>
            <div className="flex items-end sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-brand"
                  checked={editForm.verified}
                  onChange={(e) =>
                    setEditForm((current) => ({
                      ...current,
                      verified: e.target.checked,
                    }))
                  }
                />
                Compte vérifié
              </label>
            </div>
            <div className="sm:col-span-2">
              <Label>Matériels proposés</Label>
              <Input
                className="mt-1.5"
                value={editForm.itemsText}
                onChange={(e) =>
                  setEditForm((current) => ({ ...current, itemsText: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Services proposés</Label>
              <Input
                className="mt-1.5"
                value={editForm.servicesText}
                onChange={(e) =>
                  setEditForm((current) => ({
                    ...current,
                    servicesText: e.target.value,
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Notes internes</Label>
              <Textarea
                className="mt-1.5"
                rows={3}
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm((current) => ({ ...current, notes: e.target.value }))
                }
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            disabled={submitting}
            onClick={() => void (supplier ? handleUpdate() : handleInvite())}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Envoi…
              </>
            ) : supplier ? (
              "Enregistrer"
            ) : (
              "Envoyer l'invitation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
