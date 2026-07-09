"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
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
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { useQuery } from "convex/react";

import {
  buildSupplierTypes,
  splitSupplierTypes,
  SUPPLIER_ACTIVITY_TYPES,
  SUPPLIER_OTHER_TYPE,
} from "@/lib/supplier-activity-types";

const CITIES = ["Agadir", "Inezgane", "Dcheira", "Aourir", "Biougra", "Autre"];

function parseLines(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function SupplierProfilePage() {
  const { supplier, staff, canQuerySupplier } = useSupplierSession();
  const stats = useQuery(
    api.supplierPortal.dashboardStats,
    canQuerySupplier ? {} : "skip"
  );
  const updateProfile = useMutation(api.supplierPortal.updateProfile);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [otherTypeText, setOtherTypeText] = useState("");
  const [city, setCity] = useState("Agadir");
  const [zonesText, setZonesText] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supplier) return;
    setName(supplier.name);
    const storedTypes =
      supplier.types?.length
        ? supplier.types
        : supplier.type && supplier.type !== "—"
          ? supplier.type.split(",").map((item) => item.trim()).filter(Boolean)
          : [];
    const parsed = splitSupplierTypes(storedTypes);
    setTypes(parsed.selected);
    setOtherTypeText(parsed.otherText);
    setCity(supplier.city);
    setZonesText(supplier.zones.join(", "));
    setPhone(supplier.phone === "—" ? "" : supplier.phone);
    setWhatsapp(supplier.whatsapp ?? "");
  }, [supplier]);

  const toggleType = (value: string, checked: boolean) => {
    setTypes((current) => {
      if (checked) {
        return current.includes(value) ? current : [...current, value];
      }
      if (value === SUPPLIER_OTHER_TYPE) {
        setOtherTypeText("");
      }
      return current.filter((item) => item !== value);
    });
  };

  if (!supplier || !staff) {
    return (
      <p className="text-sm text-muted-foreground">Chargement du profil…</p>
    );
  }

  const initials = supplier.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleSave = async () => {
    const resolvedTypes = buildSupplierTypes(types, otherTypeText);
    if (!resolvedTypes) {
      toast.error(
        types.includes(SUPPLIER_OTHER_TYPE) && !otherTypeText.trim()
          ? "Précisez votre activité dans le champ Autre."
          : "Sélectionnez au moins un type."
      );
      return;
    }
    setSubmitting(true);
    try {
      await updateProfile({
        name,
        types: resolvedTypes,
        city,
        zones: parseLines(zonesText),
        phone,
        whatsapp,
        items: supplier.items,
        services: supplier.services,
      });
      toast.success("Profil mis à jour.");
      setEditing(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'enregistrer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-8">
      <PageHeader
        title="Mon profil"
        description="Informations visibles par l'équipe SOS Santé"
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Annuler
              </Button>
              <Button disabled={submitting} onClick={() => void handleSave()}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="size-4" /> Modifier
            </Button>
          )
        }
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
                {supplier.verified ? (
                  <Tag tone="success">
                    <BadgeCheck className="size-3" /> Certifié
                  </Tag>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {supplier.types?.join(", ") ?? supplier.type}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5 text-brand" />
                {supplier.city} · {supplier.zones.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
          <div className="px-4 py-3 text-center">
            <p className="text-xl font-bold text-brand">{stats?.total ?? "—"}</p>
            <p className="text-[11px] text-muted-foreground">Commandes affectées</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-xl font-bold text-foreground">{supplier.responseAvg ?? "—"}</p>
            <p className="text-[11px] text-muted-foreground">Délai moyen</p>
          </div>
        </div>
      </Card>

      {editing ? (
        <Card className="space-y-4 p-5">
          <div>
            <Label>Nom de l&apos;entreprise *</Label>
            <Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Type *</Label>
            <div className="mt-2 space-y-2 rounded-xl border border-border p-3">
              {SUPPLIER_ACTIVITY_TYPES.map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-3 text-sm">
                  <Checkbox
                    checked={types.includes(item)}
                    onCheckedChange={(checked) => toggleType(item, checked === true)}
                  />
                  {item}
                </label>
              ))}
            </div>
            {types.includes(SUPPLIER_OTHER_TYPE) ? (
              <div className="mt-3">
                <Label htmlFor="other-type">Précisez l&apos;autre activité *</Label>
                <Input
                  id="other-type"
                  className="mt-1.5"
                  value={otherTypeText}
                  onChange={(e) => setOtherTypeText(e.target.value)}
                  placeholder="Ex. Transport médical, orthoprothèse…"
                />
              </div>
            ) : null}
          </div>
          <div>
            <Label>Ville *</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Zones couvertes (optionnel)</Label>
            <Input className="mt-1.5" value={zonesText} onChange={(e) => setZonesText(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Téléphone *</Label>
              <Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label>WhatsApp *</Label>
              <Input className="mt-1.5" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="space-y-4 p-5">
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
              {supplier.whatsapp ? (
                <div className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">WhatsApp</dt>
                    <dd className="font-medium">{supplier.whatsapp}</dd>
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Email compte</dt>
                  <dd className="font-medium">{staff.email}</dd>
                </div>
              </div>
            </dl>
          </Card>

          {supplier.items.length > 0 ? (
            <Card className="space-y-3 p-5">
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
          ) : null}

          {supplier.services.length > 0 ? (
            <Card className="space-y-3 p-5">
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
          ) : null}

          <Card className="space-y-3 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Truck className="size-4 text-brand" />
              Zones couvertes
            </h3>
            <div className="flex flex-wrap gap-2">
              {supplier.zones.map((zone) => (
                <span key={zone} className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium">
                  {zone}
                </span>
              ))}
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Commission SOS Santé déclarée à chaque devis (MAD)
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
