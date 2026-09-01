"use client";

import { useMutation, useQuery } from "convex/react";
import {
  ClipboardList,
  FileText,
  History,
  Loader2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  APPORT_DEMANDE_WORKFLOW_OPTIONS,
  apportDemandeStatusLabel,
  apportDemandeStatusTone,
  type ApportDemandeStatus,
} from "@/lib/apport-demande-status";
import {
  formatAmountInput,
  formatDh,
  parseAmountInput,
} from "@/lib/apport-affaires";

const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

function formatWhen(ts: number) {
  return new Date(ts).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function todayInputValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isAllowedFile(file: File) {
  const type = file.type || "";
  return (
    type.startsWith("image/") ||
    type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

function isPdf(contentType?: string | null, fileName?: string) {
  if (contentType === "application/pdf") return true;
  return Boolean(fileName?.toLowerCase().endsWith(".pdf"));
}

function isImage(contentType?: string | null) {
  return Boolean(contentType?.startsWith("image/"));
}

function CommissionAmountInput({
  value,
  readOnly,
  onCommit,
}: {
  value: number | null | undefined;
  readOnly?: boolean;
  onCommit: (next: number | null) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(formatAmountInput(value));
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (!focused) setText(formatAmountInput(value));
  }, [focused, value]);

  if (readOnly) {
    return (
      <div className="flex h-9 items-center rounded-lg border border-border bg-muted/40 px-2.5 text-sm tabular-nums">
        {value == null ? "—" : formatAmountInput(value)}
      </div>
    );
  }

  return (
    <Input
      inputMode="decimal"
      className="h-9 text-right tabular-nums"
      placeholder="0"
      value={focused ? text : formatAmountInput(value)}
      onFocus={() => {
        setFocused(true);
        setText(value == null || value === 0 ? "" : String(value));
      }}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        setFocused(false);
        const parsed = parseAmountInput(textRef.current);
        setText(formatAmountInput(parsed));
        onCommit(parsed);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

function DemandeHistory({ id }: { id: Id<"apportDemandes"> }) {
  const [open, setOpen] = useState(false);
  const events = useQuery(
    api.apportDemandes.listHistory,
    open ? { id } : "skip"
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <History className="size-3.5 shrink-0" />
          Historique
          <span className="ml-auto text-xs">
            {open ? "Masquer" : "Afficher"}
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {events === undefined ? (
          <p className="px-1 py-2 text-xs text-muted-foreground">
            Chargement…
          </p>
        ) : events.length === 0 ? (
          <p className="px-1 py-2 text-xs text-muted-foreground">
            Aucun événement.
          </p>
        ) : (
          <ol className="mt-1 space-y-2 border-l border-border pl-3">
            {events.map((event) => (
              <li key={event._id} className="relative">
                <span className="absolute -left-[13px] top-1.5 size-1.5 rounded-full bg-brand" />
                <p className="text-sm text-foreground">{event.label}</p>
                <p className="text-xs text-muted-foreground">
                  {formatWhen(event.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function DemandeCommissionPanel({
  contractAmount,
  commissionDue,
  observation,
  readOnly,
  onSave,
}: {
  contractAmount?: number;
  commissionDue?: number;
  observation?: string;
  readOnly?: boolean;
  onSave: (patch: {
    contractAmount?: number | null;
    commissionDue?: number | null;
    observation?: string | null;
  }) => void;
}) {
  const [obs, setObs] = useState(observation ?? "");
  const obsFocused = useRef(false);

  useEffect(() => {
    if (!obsFocused.current) setObs(observation ?? "");
  }, [observation]);

  return (
    <div className="space-y-2.5">
      <div>
        <Label className="text-xs text-muted-foreground">Montant contrat</Label>
        <div className="mt-1">
          <CommissionAmountInput
            value={contractAmount}
            readOnly={readOnly}
            onCommit={(next) => onSave({ contractAmount: next })}
          />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Commission due</Label>
        <div className="mt-1">
          <CommissionAmountInput
            value={commissionDue}
            readOnly={readOnly}
            onCommit={(next) => onSave({ commissionDue: next })}
          />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Observation</Label>
        {readOnly ? (
          <p className="mt-1 min-h-9 whitespace-pre-wrap rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm">
            {observation?.trim() || "—"}
          </p>
        ) : (
          <Textarea
            className="mt-1 min-h-[72px] resize-y text-sm"
            placeholder="Note…"
            value={obs}
            maxLength={2000}
            onFocus={() => {
              obsFocused.current = true;
            }}
            onChange={(e) => setObs(e.target.value)}
            onBlur={() => {
              obsFocused.current = false;
              const next = obs.trim() || null;
              if ((observation ?? null) !== next) {
                onSave({ observation: next });
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

function DemandeDevisPanel({
  devisUrl,
  devisFileName,
  devisContentType,
  canUpload,
  uploading,
  onUpload,
}: {
  devisUrl?: string | null;
  devisFileName?: string;
  devisContentType?: string;
  canUpload: boolean;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pdf = isPdf(devisContentType, devisFileName);
  const image = !pdf && isImage(devisContentType);

  return (
    <div className="mt-3 space-y-2 border-t border-border pt-3">
      <Label className="text-xs text-muted-foreground">
        Devis envoyé au client
      </Label>
      {devisUrl ? (
        <a
          href={devisUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-24 w-full max-w-[11rem] items-center justify-center overflow-hidden rounded-lg border border-border bg-white transition-opacity hover:opacity-90"
          title={devisFileName || "Devis"}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={devisUrl}
              alt={devisFileName || "Devis"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex flex-col items-center gap-1 px-2 text-center text-brand">
              <FileText className="size-7" />
              <span className="line-clamp-2 text-[11px] font-semibold">
                {devisFileName || (pdf ? "Devis PDF" : "Devis")}
              </span>
            </span>
          )}
        </a>
      ) : (
        <p className="text-xs text-muted-foreground">
          {canUpload
            ? "Joignez le devis que vous avez envoyé au client."
            : "Aucun devis joint."}
        </p>
      )}
      {canUpload ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {devisUrl ? "Remplacer le devis" : "Joindre le devis"}
          </Button>
        </>
      ) : null}
    </div>
  );
}

export function ApportDemandesPage({
  variant,
}: {
  variant: "admin" | "apporteur";
}) {
  const rows = useQuery(api.apportDemandes.list);
  const apporteurs = useQuery(
    api.apporteurInvitations.list,
    variant === "admin" ? {} : "skip"
  );
  const generateUploadUrl = useMutation(api.apportDemandes.generateUploadUrl);
  const generatePaymentUploadUrl = useMutation(
    api.apportDemandes.generatePaymentUploadUrl
  );
  const submitDevis = useMutation(api.apportDemandes.submitDevis);
  const createForApporteur = useMutation(api.apportDemandes.createForApporteur);
  const assignApporteur = useMutation(api.apportDemandes.assignApporteur);
  const markOpened = useMutation(api.apportDemandes.markOpened);
  const markTreated = useMutation(api.apportDemandes.markTreated);
  const updateDemandeStatus = useMutation(api.apportDemandes.updateDemandeStatus);
  const reopen = useMutation(api.apportDemandes.reopen);
  const removeDemande = useMutation(api.apportDemandes.remove);
  const updateCommission = useMutation(api.apportDemandes.updateCommission);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState(todayInputValue);
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [apporteurId, setApporteurId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [devisUploadingId, setDevisUploadingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<Id<"apportDemandes"> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  /** UI-only collapse for demande cards. */
  const [uiCollapsed, setUiCollapsed] = useState<Record<string, boolean>>({});

  const setCardCollapsed = (id: string, collapsed: boolean) => {
    setUiCollapsed((prev) => ({ ...prev, [id]: collapsed }));
  };

  const activeApporteurs = useMemo(() => {
    return (apporteurs ?? [])
      .filter((row) => row.status === "actif")
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [apporteurs]);

  const resetForm = () => {
    setDate(todayInputValue());
    setClientName("");
    setProjectType("");
    setLocalisation("");
    setPhone("");
    setNote("");
    setFiles([]);
    setApporteurId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_ATTACHMENTS) {
        toast.error(`Maximum ${MAX_ATTACHMENTS} fichiers par demande.`);
        break;
      }
      if (!isAllowedFile(file)) {
        toast.error(`« ${file.name} » : image (JPG, PNG, WebP) ou PDF uniquement.`);
        continue;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error(`« ${file.name} » ne doit pas dépasser 10 Mo.`);
        continue;
      }
      next.push(file);
    }
    setFiles(next);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadAttachments = async () => {
    const uploaded: {
      storageId: Id<"_storage">;
      fileName: string;
      contentType: string;
    }[] = [];

    for (const file of files) {
      const contentType =
        file.type ||
        (file.name.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg");
      const uploadUrl = await generateUploadUrl({});
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: file,
      });
      if (!uploadResult.ok) {
        throw new Error(`Impossible d’envoyer « ${file.name} ».`);
      }
      const payload = (await uploadResult.json()) as {
        storageId: Id<"_storage">;
      };
      uploaded.push({
        storageId: payload.storageId,
        fileName: file.name,
        contentType,
      });
    }

    return uploaded;
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (variant !== "admin") return;
    setSubmitting(true);
    try {
      if (!apporteurId) {
        toast.error("Sélectionnez un apporteur.");
        return;
      }
      const attachments = await uploadAttachments();
      await createForApporteur({
        apporteurId: apporteurId as Id<"apporteurs">,
        date: date || undefined,
        clientName,
        projectType,
        localisation: localisation || undefined,
        phone: phone || undefined,
        note,
        attachments: attachments.length ? attachments : undefined,
      });
      toast.success("Demande créée et affectée.");
      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d’enregistrer la demande."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (
    id: Id<"apportDemandes">,
    nextApporteurId: string
  ) => {
    if (!nextApporteurId) return;
    setActingId(id);
    try {
      await assignApporteur({
        id,
        apporteurId: nextApporteurId as Id<"apporteurs">,
      });
      toast.success("Apporteur mis à jour.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d’affecter."
      );
    } finally {
      setActingId(null);
    }
  };

  const handleOpen = async (
    id: Id<"apportDemandes">,
    options?: { canOpen?: boolean; lockMessage?: string | null }
  ) => {
    if (options?.canOpen === false) {
      setLockMessage(
        options.lockMessage ??
          "Vous avez des projets non payés. Réglez-les dans Honoraires S2MBO pour ouvrir les prochains projets."
      );
      return;
    }
    setActingId(id);
    try {
      await markOpened({ id });
      setCardCollapsed(id, false);
      toast.success("Demande ouverte.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible d’ouvrir.";
      if (message.includes("non payé")) {
        setLockMessage(message);
      } else {
        toast.error(message);
      }
    } finally {
      setActingId(null);
    }
  };

  const handleTreat = async (id: Id<"apportDemandes">) => {
    setActingId(id);
    try {
      await markTreated({ id });
      toast.success("Demande marquée comme traitée.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de mettre à jour."
      );
    } finally {
      setActingId(null);
    }
  };

  const handleDemandeStatusChange = async (
    id: Id<"apportDemandes">,
    status: ApportDemandeStatus
  ) => {
    setActingId(id);
    try {
      await updateDemandeStatus({ id, status });
      toast.success("Statut mis à jour.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de mettre à jour."
      );
    } finally {
      setActingId(null);
    }
  };

  const handleReopen = async (id: Id<"apportDemandes">) => {
    setActingId(id);
    try {
      await reopen({ id });
      toast.success("Demande rouverte.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de rouvrir."
      );
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await removeDemande({ id: deleteId });
      toast.success("Demande supprimée.");
      setDeleteId(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de supprimer."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCommissionSave = async (
    id: Id<"apportDemandes">,
    patch: {
      contractAmount?: number | null;
      commissionDue?: number | null;
      observation?: string | null;
    }
  ) => {
    try {
      await updateCommission({ id, ...patch });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible d’enregistrer la commission."
      );
    }
  };

  const handleDevisUpload = async (
    id: Id<"apportDemandes">,
    file: File
  ) => {
    if (!isAllowedFile(file)) {
      toast.error("Devis : image (JPG, PNG, WebP) ou PDF uniquement.");
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      toast.error("Le devis ne doit pas dépasser 10 Mo.");
      return;
    }

    setDevisUploadingId(id);
    try {
      const contentType =
        file.type ||
        (file.name.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg");
      const uploadUrl = await generatePaymentUploadUrl({});
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: file,
      });
      if (!uploadResult.ok) {
        throw new Error(`Impossible d’envoyer « ${file.name} ».`);
      }
      const payload = (await uploadResult.json()) as {
        storageId: Id<"_storage">;
      };
      await submitDevis({
        id,
        devisStorageId: payload.storageId,
        fileName: file.name,
      });
      toast.success("Devis enregistré.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible d’envoyer le devis."
      );
    } finally {
      setDevisUploadingId(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Demandes"
        description={
          variant === "admin"
            ? "Créez une demande et affectez-la à un apporteur d’affaires."
            : "Demandes qui vous ont été affectées par S2MBO."
        }
      />

      {variant === "admin" ? (
        <Card className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4 text-brand" />
            <h2 className="text-sm font-semibold">Nouvelle demande</h2>
          </div>
          <form className="space-y-3" onSubmit={(e) => void handleCreate(e)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="demande-date">Date</Label>
                <Input
                  id="demande-date"
                  type="date"
                  className="mt-1.5"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="demande-client">Nom du client</Label>
                <Input
                  id="demande-client"
                  className="mt-1.5"
                  value={clientName}
                  maxLength={120}
                  placeholder="Nom du client"
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="demande-project">Type de projet</Label>
                <Input
                  id="demande-project"
                  className="mt-1.5"
                  value={projectType}
                  maxLength={120}
                  placeholder="Ex. villa, bâtiment R+5…"
                  onChange={(e) => setProjectType(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Apporteur</Label>
                <Select value={apporteurId} onValueChange={setApporteurId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Affecter à…" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeApporteurs.map((row) => (
                      <SelectItem key={row._id} value={row._id}>
                        {row.name} · {row.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="demande-localisation">Localisation</Label>
                <Input
                  id="demande-localisation"
                  className="mt-1.5"
                  value={localisation}
                  maxLength={300}
                  placeholder="Adresse du projet"
                  onChange={(e) => setLocalisation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="demande-phone">Numéro de téléphone</Label>
                <Input
                  id="demande-phone"
                  type="tel"
                  className="mt-1.5"
                  value={phone}
                  maxLength={40}
                  placeholder="Ex. 06 12 34 56 78"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="demande-note">Note</Label>
              <Textarea
                id="demande-note"
                className="mt-1.5 min-h-[110px]"
                value={note}
                maxLength={2000}
                placeholder="Détails de la demande…"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
              <div>
                <Label className="text-sm font-semibold">
                  Plan / documents
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Plans d’architecture, photos ou PDF pour l’apporteur · max{" "}
                  {MAX_ATTACHMENTS} fichiers · 10 Mo chacun
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.pdf"
                multiple
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
              />

              {files.length > 0 ? (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <FileText className="size-4 shrink-0 text-brand" />
                      <span className="min-w-0 flex-1 truncate">{file.name}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="shrink-0 text-muted-foreground"
                        onClick={() =>
                          setFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {files.length < MAX_ATTACHMENTS ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-background px-3 py-3 text-left text-sm transition-colors hover:border-brand/40 hover:bg-brand-soft/30 disabled:opacity-60"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <Upload className="size-4" />
                  </span>
                  <span>
                    <span className="font-medium text-foreground">
                      {files.length
                        ? "Ajouter un autre fichier"
                        : "Ajouter un fichier"}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      JPG, PNG, WebP ou PDF
                    </span>
                  </span>
                </button>
              ) : null}
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Créer et affecter
            </Button>
          </form>
        </Card>
      ) : null}

      {rows === undefined ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : rows.length === 0 ? (
        <Card className="p-5 text-sm text-muted-foreground">
          {variant === "admin"
            ? "Aucune demande pour le moment."
            : "Aucune demande ne vous a encore été affectée."}
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const neverOpened = variant === "apporteur" && !row.openedAt;
            const uiHidden = uiCollapsed[row._id] === true;
            const isCollapsedApporteur = neverOpened || uiHidden;

            if (isCollapsedApporteur) {
              return (
                <Card key={row._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-semibold text-foreground">
                        {variant === "admin" && row.openedAt ? (
                          <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
                        ) : null}
                        {neverOpened
                          ? "Nouvelle demande"
                          : row.clientName}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Type de projet :{" "}
                        <span className="text-foreground">
                          {row.projectType}
                        </span>
                        {variant === "admin" ? (
                          <span> · {row.apporteurName}</span>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <p className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatWhen(row.createdAt)}
                      </p>
                      {neverOpened ? (
                        <Button
                          size="sm"
                          disabled={actingId === row._id}
                          onClick={() =>
                            void handleOpen(row._id, {
                              canOpen: row.canOpen,
                              lockMessage: row.lockMessage,
                            })
                          }
                        >
                          {actingId === row._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : null}
                          Ouvrir
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCardCollapsed(row._id, false)}
                        >
                          Afficher
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            }

            return (
            <Card key={row._id} className="p-4">
              <div className="mb-3 flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => setCardCollapsed(row._id, true)}
                >
                  Réduire
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1.2fr)_1px_minmax(0,0.9fr)] sm:gap-0">
                <div className="min-w-0 space-y-3 sm:pr-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-bold text-foreground">
                        {variant === "admin" && row.openedAt ? (
                          <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
                        ) : null}
                        <span>
                          <span className="font-normal text-muted-foreground">
                            Nom client :{" "}
                          </span>
                          {row.clientName}
                        </span>
                      </p>
                      {row.phone ? (
                        <p className="mt-0.5 text-sm text-foreground">
                          <span className="text-muted-foreground">
                            Téléphone :{" "}
                          </span>
                          <a
                            href={`tel:${row.phone.replace(/\s+/g, "")}`}
                            className="underline-offset-2 hover:underline"
                          >
                            {row.phone}
                          </a>
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <p className="whitespace-nowrap text-right text-xs text-muted-foreground">
                        {formatWhen(row.createdAt)}
                      </p>
                      <Tag tone={apportDemandeStatusTone(row.status)}>
                        {row.openedAt
                          ? apportDemandeStatusLabel(row.status)
                          : "En cours"}
                      </Tag>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-foreground">
                    <p>
                      <span className="text-muted-foreground">Type : </span>
                      {row.projectType}
                      {variant === "admin" ? (
                        <span className="text-muted-foreground">
                          {" "}
                          · {row.apporteurName}
                        </span>
                      ) : null}
                    </p>
                    {row.localisation ? (
                      <p>
                        <span className="text-muted-foreground">
                          Localisation :{" "}
                        </span>
                        {row.localisation}
                      </p>
                    ) : null}
                    {row.note ? (
                      <p className="whitespace-pre-wrap">
                        <span className="text-muted-foreground">Note : </span>
                        {row.note}
                      </p>
                    ) : null}
                  </div>

                  {row.attachments && row.attachments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {row.attachments.map((file) => {
                        if (!file.url) return null;
                        const pdf = isPdf(file.contentType, file.fileName);
                        const image = !pdf && isImage(file.contentType);
                        return (
                          <a
                            key={file.storageId}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-24 w-36 items-center justify-center overflow-hidden rounded-lg border border-border bg-white transition-opacity hover:opacity-90"
                            title={file.fileName}
                          >
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={file.url}
                                alt={file.fileName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex flex-col items-center gap-1 px-2 text-center text-brand">
                                <FileText className="size-7" />
                                <span className="line-clamp-2 text-[11px] font-semibold">
                                  {pdf ? "PDF" : "Document"}
                                </span>
                              </span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                  {row.adminNote ? (
                    <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                      Note S2MBO : {row.adminNote}
                    </p>
                  ) : null}
                  {variant === "admin" ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <Select
                        value={row.apporteurId}
                        onValueChange={(value) =>
                          void handleAssign(row._id, value)
                        }
                        disabled={actingId === row._id}
                      >
                        <SelectTrigger className="sm:max-w-xs">
                          <SelectValue placeholder="Affecter à…" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeApporteurs.map((item) => (
                            <SelectItem key={item._id} value={item._id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {row.status !== "traitee" ? (
                        <Button
                          size="sm"
                          disabled={actingId === row._id}
                          onClick={() => void handleTreat(row._id)}
                        >
                          {actingId === row._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : null}
                          Marquer traitée
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actingId === row._id}
                          onClick={() => void handleReopen(row._id)}
                        >
                          Rouvrir
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={actingId === row._id || deleting}
                        onClick={() => setDeleteId(row._id)}
                      >
                        <Trash2 className="size-3.5" />
                        Supprimer
                      </Button>
                    </div>
                  ) : row.openedAt ? (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Statut de la demande
                      </Label>
                      <Select
                        value={row.status}
                        disabled={actingId === row._id}
                        onValueChange={(value) =>
                          void handleDemandeStatusChange(
                            row._id,
                            value as ApportDemandeStatus
                          )
                        }
                      >
                        <SelectTrigger className="h-9 w-full sm:max-w-xs">
                          <SelectValue placeholder="Choisir un statut…" />
                        </SelectTrigger>
                        <SelectContent>
                          {APPORT_DEMANDE_WORKFLOW_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                </div>

                <div className="hidden bg-border sm:block" aria-hidden />
                <div className="border-t border-border pt-4 sm:border-t-0 sm:pl-4 sm:pt-0">
                  <DemandeCommissionPanel
                    contractAmount={row.contractAmount}
                    commissionDue={row.commissionDue ?? undefined}
                    observation={row.observation}
                    readOnly={variant === "admin"}
                    onSave={(patch) =>
                      void handleCommissionSave(row._id, patch)
                    }
                  />
                  {row.openedAt ? (
                    <DemandeDevisPanel
                      devisUrl={row.devisUrl}
                      devisFileName={row.devisFileName}
                      devisContentType={row.devisContentType}
                      canUpload={variant === "apporteur"}
                      uploading={devisUploadingId === row._id}
                      onUpload={(file) =>
                        void handleDevisUpload(row._id, file)
                      }
                    />
                  ) : null}
                  {variant === "admin" &&
                  row.paymentStatus === "pending_review" ? (
                    <p className="mt-3 text-xs font-medium text-amber-700">
                      Reçu envoyé — à confirmer dans{" "}
                      <a
                        href="/apport-affaires/honoraires"
                        className="underline underline-offset-2"
                      >
                        Honoraires
                      </a>
                      {row.paymentReceiptUrl ? (
                        <>
                          {" · "}
                          <a
                            href={row.paymentReceiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-2"
                          >
                            Voir le reçu
                          </a>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                  {variant === "admin" && row.paymentStatus === "paid" ? (
                    <p className="mt-3 text-xs font-medium text-emerald-700">
                      Honoraire payé
                      {row.paymentReceiptUrl ? (
                        <>
                          {" · "}
                          <a
                            href={row.paymentReceiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-2"
                          >
                            Voir le reçu
                          </a>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <DemandeHistory id={row._id} />
              </div>
            </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle>
            <AlertDialogDescription>
              La demande et ses fichiers joints seront définitivement
              supprimés. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={lockMessage != null}
        onOpenChange={(open) => {
          if (!open) setLockMessage(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Projets non payés</AlertDialogTitle>
            <AlertDialogDescription>
              {lockMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fermer</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.location.href = "/apport-affaires/honoraires";
              }}
            >
              Voir Honoraires
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
