"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "source", label: "Source" },
  { key: "client", label: "Client" },
  { key: "demande", label: "Demande" },
  { key: "affectation", label: "Affectation" },
  { key: "resume", label: "Résumé" },
];

const SOURCES = [
  "Formulaire site",
  "WhatsApp manuel",
  "Appel téléphonique",
  "Google Maps",
  "Réseaux sociaux",
  "Autre",
];

const CITIES = [
  { value: "Agadir", label: "Agadir" },
  { value: "Inezgane", label: "Inezgane" },
  { value: "Dcheira", label: "Dcheira" },
  { value: "Aourir", label: "Aourir" },
  { value: "Biougra", label: "Biougra" },
  { value: "Autre", label: "Autre" },
];

const REQUEST_TYPES = [
  { value: "Location matériel médical", label: "Location matériel médical" },
  { value: "Livraison matériel", label: "Livraison matériel" },
  { value: "Aide à domicile", label: "Aide à domicile" },
  { value: "Garde-malade", label: "Garde-malade" },
  { value: "Soin à domicile", label: "Soin à domicile" },
  { value: "Autre", label: "Autre" },
];

const SLOTS = [
  { value: "Matin (9h-12h)", label: "Matin (9h-12h)" },
  { value: "Après-midi (14h-18h)", label: "Après-midi (14h-18h)" },
  { value: "Soir (18h-20h)", label: "Soir (18h-20h)" },
  { value: "Flexible", label: "Flexible" },
];

type AssignmentMode = "create_only" | "assign_self" | "assign_staff";

type FormState = {
  source: string;
  client: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  district: string;
  address: string;
  type: string;
  item: string;
  duration: string;
  desiredDate: string;
  slot: string;
  message: string;
  assignmentMode: AssignmentMode;
  assignedStaffId: string;
  supplierId: string;
};

const INITIAL_FORM: FormState = {
  source: "WhatsApp manuel",
  client: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "Agadir",
  district: "",
  address: "",
  type: "Location matériel médical",
  item: "",
  duration: "",
  desiredDate: "",
  slot: "Matin (9h-12h)",
  message: "",
  assignmentMode: "assign_self",
  assignedStaffId: "",
  supplierId: "",
};

const CHANNEL_ORDER_TYPE: Record<string, string> = {
  location_materiel: "Location matériel médical",
  aide_domicile: "Aide à domicile",
  garde_soins: "Garde-malade / soins à domicile",
  general: "Demande générale",
};

export function AdminOrdersNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canQueryAdmin, staff } = useAdminSession();
  const createManual = useMutation(api.orders.createManual);
  const staffList = useQuery(api.staff.list, canQueryAdmin ? {} : "skip");
  const suppliers = useQuery(
    api.suppliers.list,
    canQueryAdmin ? { status: "actif" } : "skip"
  );

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  useEffect(() => {
    const phone = searchParams.get("phone");
    const name = searchParams.get("name");
    const source = searchParams.get("source");
    const channelPurpose = searchParams.get("channelPurpose");
    const convId = searchParams.get("conversationId");

    if (!phone && !name && !source && !channelPurpose && !convId) {
      return;
    }

    setForm((current) => ({
      ...current,
      ...(phone ? { phone, whatsapp: phone } : {}),
      ...(name ? { client: name } : {}),
      ...(source ? { source } : {}),
      ...(channelPurpose && CHANNEL_ORDER_TYPE[channelPurpose]
        ? { type: CHANNEL_ORDER_TYPE[channelPurpose] }
        : {}),
    }));

    if (convId) {
      setConversationId(convId);
    }
  }, [searchParams]);

  const assignableStaff = useMemo(
    () =>
      (staffList ?? []).filter(
        (member) =>
          member.status === "actif" &&
          (member.role === "assistant" ||
            member.role === "admin" ||
            member.role === "super_admin")
      ),
    [staffList]
  );

  const patch = (updates: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...updates }));
  };

  const assignmentLabel = useMemo(() => {
    if (form.assignmentMode === "create_only") {
      return "Créer seulement (sans affectation)";
    }
    if (form.assignmentMode === "assign_self") {
      return staff?.name ?? "Moi";
    }
    const selected = assignableStaff.find((m) => m._id === form.assignedStaffId);
    return selected?.name ?? "Assistant non sélectionné";
  }, [form.assignmentMode, form.assignedStaffId, assignableStaff, staff]);

  const supplierLabel = useMemo(() => {
    if (!form.supplierId) {
      return "—";
    }
    return (
      suppliers?.find((row) => row._id === form.supplierId)?.name ??
      "Fournisseur"
    );
  }, [form.supplierId, suppliers]);

  const validateStep = (index: number): string | null => {
    if (index === 0 && !form.source.trim()) {
      return "Choisissez une source.";
    }
    if (index === 1) {
      if (!form.client.trim()) return "Le nom du client est obligatoire.";
      if (!form.phone.trim()) return "Le téléphone est obligatoire.";
      if (!form.city.trim()) return "La ville est obligatoire.";
    }
    if (index === 2) {
      if (!form.type.trim()) return "Le type de demande est obligatoire.";
      if (!form.item.trim()) return "Le matériel ou service est obligatoire.";
    }
    if (index === 3) {
      if (
        form.assignmentMode === "assign_staff" &&
        !form.assignedStaffId
      ) {
        return "Choisissez un assistant.";
      }
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep(step);
    if (error) {
      toast.error(error);
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handleSubmit = async () => {
    for (let i = 0; i < STEPS.length - 1; i += 1) {
      const error = validateStep(i);
      if (error) {
        toast.error(error);
        setStep(i);
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await createManual({
        source: form.source,
        client: form.client,
        phone: form.phone,
        whatsapp: form.whatsapp.trim() || undefined,
        email: form.email.trim() || undefined,
        city: form.city,
        district: form.district.trim() || undefined,
        address: form.address.trim() || undefined,
        type: form.type,
        item: form.item,
        duration: form.duration.trim() || undefined,
        desiredDate: form.desiredDate.trim() || undefined,
        slot: form.slot.trim() || undefined,
        message: form.message.trim() || undefined,
        assignToSelf: form.assignmentMode === "assign_self",
        assignedStaffId:
          form.assignmentMode === "assign_staff"
            ? (form.assignedStaffId as Id<"staff">)
            : undefined,
        supplierId: form.supplierId
          ? (form.supplierId as Id<"suppliers">)
          : undefined,
        conversationId: conversationId
          ? (conversationId as Id<"conversations">)
          : undefined,
      });

      toast.success(`Commande ${result.ref} créée.`);
      router.push(`/admin/orders/${result.orderId}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de créer la commande."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Nouvelle commande"
        description="Créer une commande manuelle en 5 étapes (site, WhatsApp, appel…)."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/orders">Annuler</Link>
          </Button>
        }
      />

      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => i < step && setStep(i)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
              i === step
                ? "border-brand bg-brand-soft text-brand-deep"
                : i < step
                  ? "border-success/30 bg-success-soft text-success"
                  : "border-border bg-card text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full text-[10px]",
                i === step
                  ? "bg-brand text-primary-foreground"
                  : i < step
                    ? "bg-success text-primary-foreground"
                    : "bg-muted"
              )}
            >
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div>
            <h3 className="mb-1 text-base font-semibold">Source de la demande</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Comment cette demande nous est-elle parvenue ?
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => patch({ source: s })}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition-colors",
                    form.source === s
                      ? "border-brand bg-brand-soft text-brand-deep"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet *">
              <Input
                value={form.client}
                onChange={(e) => patch({ client: e.target.value })}
                placeholder="Mohamed El Amrani"
              />
            </Field>
            <Field label="Téléphone *">
              <Input
                value={form.phone}
                onChange={(e) => patch({ phone: e.target.value })}
                placeholder="+212 6 ..."
              />
            </Field>
            <Field label="WhatsApp">
              <Input
                value={form.whatsapp}
                onChange={(e) => patch({ whatsapp: e.target.value })}
                placeholder="Laisser vide = même que téléphone"
              />
            </Field>
            <Field label="Email (optionnel)">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="exemple@email.com"
              />
            </Field>
            <Field label="Ville *">
              <Select value={form.city} onValueChange={(value) => patch({ city: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Quartier">
              <Input
                value={form.district}
                onChange={(e) => patch({ district: e.target.value })}
                placeholder="Hay Mohammadi"
              />
            </Field>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Adresse complète</Label>
              <Textarea
                value={form.address}
                onChange={(e) => patch({ address: e.target.value })}
                placeholder="Rue, immeuble, étage, point de repère…"
                rows={2}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type de demande *">
              <Select value={form.type} onValueChange={(value) => patch({ type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Matériel ou service *">
              <Input
                value={form.item}
                onChange={(e) => patch({ item: e.target.value })}
                placeholder="Lit médicalisé électrique"
              />
            </Field>
            <Field label="Durée">
              <Input
                value={form.duration}
                onChange={(e) => patch({ duration: e.target.value })}
                placeholder="1 mois"
              />
            </Field>
            <Field label="Date souhaitée">
              <Input
                type="date"
                value={form.desiredDate}
                onChange={(e) => patch({ desiredDate: e.target.value })}
              />
            </Field>
            <Field label="Créneau">
              <Select value={form.slot} onValueChange={(value) => patch({ slot: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SLOTS.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Message du client</Label>
              <Textarea
                value={form.message}
                onChange={(e) => patch({ message: e.target.value })}
                rows={3}
                placeholder="Contexte, précisions, contraintes…"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="mb-1 text-base font-semibold">Affectation</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Qui prend en charge cette demande ?
            </p>
            <div className="space-y-2">
              {[
                {
                  value: "create_only" as const,
                  label: "Créer seulement (sans affectation)",
                  hint: "Statut : Nouvelle demande",
                },
                {
                  value: "assign_self" as const,
                  label: `M'affecter (${staff?.name ?? "moi"})`,
                  hint: "Statut : Nouvelle demande",
                },
                {
                  value: "assign_staff" as const,
                  label: "Affecter un autre assistant",
                  hint: "Statut : Nouvelle demande",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted"
                >
                  <input
                    type="radio"
                    name="assignment"
                    className="mt-1 accent-brand"
                    checked={form.assignmentMode === opt.value}
                    onChange={() => patch({ assignmentMode: opt.value })}
                  />
                  <span>
                    <span className="block text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {form.assignmentMode === "assign_staff" ? (
              <div className="mt-4">
                <Label className="mb-1.5 block">Assistant *</Label>
                <Select
                  value={form.assignedStaffId || undefined}
                  onValueChange={(value) => patch({ assignedStaffId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un assistant" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableStaff.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <p className="mt-4 text-xs text-muted-foreground">
              Optionnel : envoyez directement au fournisseur lors de la création.
            </p>
            <div className="mt-4">
              <Label className="mb-1.5 block">Fournisseur (optionnel)</Label>
              <Select
                value={form.supplierId || "none"}
                onValueChange={(value) =>
                  patch({ supplierId: value === "none" ? "" : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Affecter plus tard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Affecter plus tard</SelectItem>
                  {(suppliers ?? []).map((row) => (
                    <SelectItem key={row._id} value={row._id}>
                      {row.name} · {row.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="mb-3 text-base font-semibold">Résumé de la commande</h3>
            <div className="divide-y divide-border rounded-lg border border-border">
              {[
                ["Source", form.source],
                ["Client", form.client],
                ["Téléphone", form.phone],
                ["WhatsApp", form.whatsapp || form.phone],
                ["Email", form.email || "—"],
                ["Ville", `${form.city}${form.district ? ` · ${form.district}` : ""}`],
                ["Adresse", form.address || "—"],
                ["Type", form.type],
                ["Matériel", form.item],
                ["Durée", form.duration || "—"],
                ["Date souhaitée", form.desiredDate || "—"],
                ["Créneau", form.slot || "—"],
                ["Affectation", assignmentLabel],
                ["Fournisseur", supplierLabel],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[140px_minmax(0,1fr)] px-4 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            {form.message ? (
              <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Message</p>
                {form.message}
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0 || submitting}
            onClick={() => setStep((current) => current - 1)}
          >
            Précédent
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Suivant <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button type="button" disabled={submitting} onClick={() => void handleSubmit()}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Création…
                </>
              ) : (
                "Créer la commande"
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
