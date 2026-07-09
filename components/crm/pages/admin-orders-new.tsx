"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrenchDatePicker } from "@/components/ui/french-date-picker";
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
import {
  getOrderRequestKindOptionLabel,
  isOrderRequestKindDisabled,
  ORDER_REQUEST_KIND_LABEL,
  ORDER_REQUEST_KIND_OPTIONS,
  orderRequestItemChoices,
  orderRequestItemLabel,
  orderRequestItemPlaceholder,
  orderRequestOtherItemLabel,
  orderShowsSchedulingForKind,
  type OrderRequestKind,
} from "@/lib/order-request-kinds";
import {
  formatDesiredDateRange,
  formatTimeSlots,
  type TimeSlotInput,
  validateDesiredDateRange,
  validateTimeSlots,
} from "@/lib/crm/order-scheduling";
import { FrenchTimePicker } from "@/components/ui/french-time-picker";
import { cn } from "@/lib/utils";

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

type AssignmentMode = "create_only" | "assign_self" | "assign_staff";

const EMPTY_TIME_SLOT: TimeSlotInput = { from: "", to: "" };

type FormState = {
  source: string;
  client: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  district: string;
  address: string;
  requestKind: OrderRequestKind;
  item: string;
  customItem: string;
  desiredDateFrom: string;
  desiredDateTo: string;
  timeSlots: TimeSlotInput[];
  message: string;
  assignmentMode: AssignmentMode;
  assignedStaffId: string;
  supplierId: string;
};

const ADMIN_REQUEST_OPTIONS = { allowService: true } as const;

const INITIAL_FORM: FormState = {
  source: "WhatsApp manuel",
  client: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "Agadir",
  district: "",
  address: "",
  requestKind: "vente",
  item: "",
  customItem: "",
  desiredDateFrom: "",
  desiredDateTo: "",
  timeSlots: [{ ...EMPTY_TIME_SLOT }],
  message: "",
  assignmentMode: "assign_self",
  assignedStaffId: "",
  supplierId: "",
};

const CHANNEL_ORDER_KIND: Record<string, OrderRequestKind> = {
  location_materiel: "location",
  aide_domicile: "service",
  garde_soins: "service",
  general: "vente",
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
      ...(channelPurpose && CHANNEL_ORDER_KIND[channelPurpose]
        ? {
            requestKind: CHANNEL_ORDER_KIND[channelPurpose],
            item: "",
            customItem: "",
          }
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

  const updateTimeSlot = (index: number, updates: Partial<TimeSlotInput>) => {
    setForm((current) => ({
      ...current,
      timeSlots: current.timeSlots.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...updates } : slot
      ),
    }));
  };

  const addTimeSlot = () => {
    patch({ timeSlots: [...form.timeSlots, { ...EMPTY_TIME_SLOT }] });
  };

  const removeTimeSlot = (index: number) => {
    if (form.timeSlots.length <= 1) {
      return;
    }
    patch({
      timeSlots: form.timeSlots.filter((_, slotIndex) => slotIndex !== index),
    });
  };

  const itemChoices = useMemo(
    () => orderRequestItemChoices(form.requestKind, ADMIN_REQUEST_OPTIONS),
    [form.requestKind]
  );

  const otherItemLabel = orderRequestOtherItemLabel(form.requestKind);
  const showItemField = !isOrderRequestKindDisabled(
    form.requestKind,
    ADMIN_REQUEST_OPTIONS
  );
  const showScheduling = orderShowsSchedulingForKind(form.requestKind);
  const isOtherItemSelected = form.item === otherItemLabel;
  const resolvedItem =
    isOtherItemSelected ? form.customItem.trim() : form.item.trim();

  const handleRequestKindChange = (kind: OrderRequestKind) => {
    if (isOrderRequestKindDisabled(kind, ADMIN_REQUEST_OPTIONS)) {
      return;
    }
    patch({
      requestKind: kind,
      item: "",
      customItem: "",
      ...(orderShowsSchedulingForKind(kind)
        ? {}
        : {
            desiredDateFrom: "",
            desiredDateTo: "",
            timeSlots: [{ ...EMPTY_TIME_SLOT }],
          }),
    });
  };

  const validateForm = (): string | null => {
    if (!form.source.trim()) return "Choisissez une source.";
    if (!form.client.trim()) return "Le nom du client est obligatoire.";
    if (!form.phone.trim()) return "Le téléphone est obligatoire.";
    if (!form.city.trim()) return "La ville est obligatoire.";
    if (isOrderRequestKindDisabled(form.requestKind, ADMIN_REQUEST_OPTIONS)) {
      return "Ce type de demande n'est pas encore disponible.";
    }
    if (showItemField && !form.item.trim()) {
      return `Choisissez un ${form.requestKind === "service" ? "service" : "matériel"}.`;
    }
    if (showItemField && form.item === otherItemLabel && !form.customItem.trim()) {
      return `Précisez le ${form.requestKind === "service" ? "service" : "matériel"}.`;
    }
    if (form.assignmentMode === "assign_staff" && !form.assignedStaffId) {
      return "Choisissez un assistant.";
    }
    if (showScheduling) {
      const dateError = validateDesiredDateRange(
        form.desiredDateFrom,
        form.desiredDateTo
      );
      if (dateError) {
        return dateError;
      }
      const timeError = validateTimeSlots(form.timeSlots);
      if (timeError) {
        return timeError;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
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
        type: ORDER_REQUEST_KIND_LABEL[form.requestKind],
        item: resolvedItem,
        duration: undefined,
        desiredDate: showScheduling
          ? formatDesiredDateRange(form.desiredDateFrom, form.desiredDateTo)
          : undefined,
        slot: showScheduling ? formatTimeSlots(form.timeSlots) : undefined,
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
    <div className="mx-auto max-w-4xl pb-8">
      <PageHeader
        title="Nouvelle commande"
        description="Créer une commande manuelle (site, WhatsApp, appel…)."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/orders">Annuler</Link>
          </Button>
        }
      />

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <Card className="p-6">
          <SectionTitle
            title="Source de la demande"
            description="Comment cette demande nous est-elle parvenue ?"
          />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SOURCES.map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => patch({ source })}
                className={cn(
                  "rounded-lg border p-3 text-left text-sm transition-colors",
                  form.source === source
                    ? "border-brand bg-brand-soft text-brand-deep"
                    : "border-border hover:bg-muted"
                )}
              >
                {source}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Client" />
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
        </Card>

        <Card className="p-6">
          <SectionTitle title="Demande" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type de demande *">
              <Select
                value={form.requestKind}
                onValueChange={(value) =>
                  handleRequestKindChange(value as OrderRequestKind)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_REQUEST_KIND_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={isOrderRequestKindDisabled(
                        option.value,
                        ADMIN_REQUEST_OPTIONS
                      )}
                    >
                      {getOrderRequestKindOptionLabel(
                        option.label,
                        option.value,
                        ADMIN_REQUEST_OPTIONS
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {isOrderRequestKindDisabled(form.requestKind, ADMIN_REQUEST_OPTIONS) ? (
              <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {ORDER_REQUEST_KIND_LABEL[form.requestKind]} — bientôt disponible.
              </div>
            ) : showItemField ? (
              <>
                <Field label={`${orderRequestItemLabel(form.requestKind)} *`}>
                  <Select
                    value={form.item || undefined}
                    onValueChange={(value) =>
                      patch({ item: value, customItem: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={orderRequestItemPlaceholder(form.requestKind)}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {itemChoices.map((choice) => (
                        <SelectItem key={choice} value={choice}>
                          {choice}
                        </SelectItem>
                      ))}
                      <SelectItem value={otherItemLabel}>{otherItemLabel}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                {isOtherItemSelected ? (
                  <div className="sm:col-span-2">
                    <Field
                      label={
                        form.requestKind === "service"
                          ? "Nom du service *"
                          : "Nom du matériel *"
                      }
                    >
                      <Input
                        value={form.customItem}
                        onChange={(e) => patch({ customItem: e.target.value })}
                        placeholder={
                          form.requestKind === "service"
                            ? "Ex. Garde de nuit"
                            : "Ex. Matelas anti-escarres"
                        }
                      />
                    </Field>
                  </div>
                ) : null}
              </>
            ) : null}

            {showScheduling ? (
              <>
                <div className="sm:col-span-2">
                  <Label className="mb-1.5 block">Période souhaitée</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 block text-xs text-muted-foreground">
                        Du
                      </Label>
                      <FrenchDatePicker
                        value={form.desiredDateFrom}
                        onChange={(value) => patch({ desiredDateFrom: value })}
                        placeholder="Date de début"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-xs text-muted-foreground">
                        Au
                      </Label>
                      <FrenchDatePicker
                        value={form.desiredDateTo}
                        min={form.desiredDateFrom || undefined}
                        onChange={(value) => patch({ desiredDateTo: value })}
                        placeholder="Date de fin"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <Label className="block">Créneau horaire</Label>
                  {form.timeSlots.map((slot, index) => (
                    <div
                      key={`time-slot-${index}`}
                      className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <span className="w-8 shrink-0 text-sm text-muted-foreground">
                          De
                        </span>
                        <FrenchTimePicker
                          value={slot.from}
                          onChange={(value) => updateTimeSlot(index, { from: value })}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex flex-1 items-center gap-3">
                        <span className="w-8 shrink-0 text-sm text-muted-foreground">
                          à
                        </span>
                        <FrenchTimePicker
                          value={slot.to}
                          min={slot.from || undefined}
                          onChange={(value) => updateTimeSlot(index, { to: value })}
                          className="flex-1"
                        />
                      </div>
                      {form.timeSlots.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeTimeSlot(index)}
                          aria-label={`Supprimer le créneau ${index + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={addTimeSlot}
                  >
                    <Plus className="size-4" />
                    Ajouter un créneau
                  </Button>
                </div>
              </>
            ) : null}

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
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="Affectation"
            description="Qui prend en charge cette demande ?"
          />
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
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/orders">Annuler</Link>
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Création…
              </>
            ) : (
              "Créer la commande"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
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
