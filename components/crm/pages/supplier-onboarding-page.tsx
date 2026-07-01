"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useSupplierSession } from "@/hooks/use-supplier-session";
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

const SUPPLIER_TYPES = [
  "Matériel médical",
  "Aide à domicile",
  "Soins à domicile",
  "Garde-malade",
  "Autre",
];

const CITIES = ["Agadir", "Inezgane", "Dcheira", "Aourir", "Biougra", "Autre"];

function parseLines(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function SupplierOnboardingPage() {
  const router = useRouter();
  const { supplier, profileComplete, sessionLoading } = useSupplierSession();
  const completeProfile = useMutation(api.supplierPortal.completeProfile);

  const [name, setName] = useState("");
  const [types, setTypes] = useState<string[]>(["Matériel médical"]);
  const [city, setCity] = useState("Agadir");
  const [zonesText, setZonesText] = useState("Agadir");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [itemsText, setItemsText] = useState("");
  const [servicesText, setServicesText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleType = (value: string, checked: boolean) => {
    setTypes((current) => {
      if (checked) {
        return current.includes(value) ? current : [...current, value];
      }
      return current.filter((item) => item !== value);
    });
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (profileComplete) {
    router.replace("/supplier");
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (types.length === 0) {
      toast.error("Sélectionnez au moins un type d'activité.");
      return;
    }

    if (!whatsapp.trim()) {
      toast.error("WhatsApp est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      await completeProfile({
        name,
        types,
        city,
        zones: parseLines(zonesText),
        phone,
        whatsapp,
        items: parseLines(itemsText),
        services: parseLines(servicesText),
      });
      toast.success("Profil enregistré. Bienvenue !");
      router.replace("/supplier");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'enregistrer le profil."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-foreground">Complétez votre profil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ces informations seront visibles par l&apos;équipe SOS Santé avant d&apos;accéder
          à vos commandes.
        </p>
        {supplier?.email ? (
          <p className="mt-1 text-xs text-muted-foreground">Compte : {supplier.email}</p>
        ) : null}

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <Label>Nom de l&apos;entreprise *</Label>
            <Input
              className="mt-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Type *</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Vous pouvez en sélectionner plusieurs.
            </p>
            <div className="mt-2 space-y-2 rounded-xl border border-border p-3">
              {SUPPLIER_TYPES.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
                >
                  <Checkbox
                    checked={types.includes(item)}
                    onCheckedChange={(checked) => toggleType(item, checked === true)}
                  />
                  {item}
                </label>
              ))}
            </div>
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
            <Label>Zones couvertes *</Label>
            <Input
              className="mt-1.5"
              value={zonesText}
              onChange={(e) => setZonesText(e.target.value)}
              placeholder="Agadir, Inezgane, Dcheira"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Téléphone *</Label>
              <Input
                className="mt-1.5"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>WhatsApp *</Label>
              <Input
                className="mt-1.5"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Matériels proposés *</Label>
            <Input
              className="mt-1.5"
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="Lit médicalisé, Fauteuil roulant"
              required
            />
          </div>

          <div>
            <Label>Services proposés *</Label>
            <Input
              className="mt-1.5"
              value={servicesText}
              onChange={(e) => setServicesText(e.target.value)}
              placeholder="Livraison, Installation"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Accéder à mon espace fournisseur"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
