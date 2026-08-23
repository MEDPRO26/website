"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type PrestataireDocumentKind = "cin" | "diploma" | "contract";

type PrestataireDocumentUploadProps = {
  kind: PrestataireDocumentKind;
  title: string;
  description: string;
  url: string | null | undefined;
  contentType?: string | null;
  compact?: boolean;
  /** When false, hide the remove action (e.g. required CIN for aide-soignant). */
  allowRemove?: boolean;
};

function isPdf(contentType?: string | null, url?: string | null) {
  if (contentType === "application/pdf") return true;
  if (url?.toLowerCase().includes(".pdf")) return true;
  return false;
}

function isImage(contentType?: string | null) {
  return Boolean(contentType?.startsWith("image/"));
}

export function PrestataireDocumentUpload({
  kind,
  title,
  description,
  url,
  contentType,
  compact = false,
  allowRemove = true,
}: PrestataireDocumentUploadProps) {
  const generateUploadUrl = useMutation(
    api.supplierPortal.generatePrestataireDocumentUploadUrl
  );
  const updateDocument = useMutation(api.supplierPortal.updatePrestataireDocument);
  const removeDocument = useMutation(api.supplierPortal.removePrestataireDocument);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const type = file.type || "";
      const allowed =
        type.startsWith("image/") ||
        type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!allowed) {
        throw new Error("Le fichier doit être une image (JPG, PNG, WebP) ou un PDF.");
      }
      if (file.size > 8 * 1024 * 1024) {
        throw new Error("Le fichier ne doit pas dépasser 8 Mo.");
      }
      const contentTypeHeader =
        type ||
        (file.name.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg");
      const uploadUrl = await generateUploadUrl({});
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": contentTypeHeader },
        body: file,
      });
      if (!uploadResult.ok) {
        throw new Error("Impossible d'envoyer le document.");
      }
      const payload = (await uploadResult.json()) as {
        storageId: Id<"_storage">;
      };
      await updateDocument({ kind, storageId: payload.storageId });
      toast.success(
        kind === "cin"
          ? "CIN enregistrée."
          : kind === "diploma"
            ? "Diplôme / certificat enregistré."
            : "Contrat signé enregistré."
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'ajouter le document."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await removeDocument({ kind });
      toast.success("Document supprimé.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de supprimer le document."
      );
    } finally {
      setUploading(false);
    }
  };

  const showAsPdf = isPdf(contentType, url);
  const showAsImage = !showAsPdf && (isImage(contentType) || !contentType);

  return (
    <div
      className={
        compact
          ? "space-y-2 rounded-xl border border-border p-3"
          : "space-y-3 rounded-xl border border-border bg-muted/30 p-4"
      }
    >
      <div>
        <Label className="text-sm font-semibold text-foreground">{title}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.pdf"
        className="sr-only"
        onChange={(e) => void handleUpload(e.target.files?.[0] ?? null)}
      />

      {url ? (
        <div className="flex items-start gap-3">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white"
          >
            {showAsImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={title}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <span className="flex flex-col items-center gap-1 text-brand">
                <FileText className="size-7" />
                <span className="text-[11px] font-semibold">
                  {showAsPdf ? "PDF" : "Document"}
                </span>
              </span>
            )}
          </a>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              Remplacer
            </Button>
            {allowRemove ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                disabled={uploading}
                onClick={() => void handleRemove()}
              >
                <Trash2 className="size-3.5" />
                Supprimer
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-background px-3 py-3 text-left text-sm transition-colors hover:border-brand/40 hover:bg-brand-soft/30 disabled:opacity-60"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
          </span>
          <span>
            <span className="font-medium text-foreground">
              {uploading ? "Envoi en cours…" : "Ajouter un fichier"}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              JPG, PNG, WebP ou PDF · max 8 Mo
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
