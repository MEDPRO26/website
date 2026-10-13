"use client";

import { useMutation, useQuery } from "convex/react";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/dashboard/app-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function MaxUnpaidInput({
  apporteurId,
  value,
}: {
  apporteurId: Id<"apporteurs">;
  value: number;
}) {
  const updateMaxUnpaidOpened = useMutation(
    api.apporteurInvitations.updateMaxUnpaidOpened
  );
  const [local, setLocal] = useState(String(value));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocal(String(value));
  }, [value]);

  const save = async () => {
    const parsed = Math.floor(Number(local));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
      toast.error("Limite invalide (0–100). 100 = illimité.");
      setLocal(String(value));
      return;
    }
    if (parsed === value) return;
    setSaving(true);
    try {
      await updateMaxUnpaidOpened({
        apporteurId,
        maxUnpaidOpened: parsed,
      });
      toast.success(
        parsed >= 100
          ? "Limite illimitée enregistrée."
          : `Limite fixée à ${parsed} projet${parsed > 1 ? "s" : ""} non payé${parsed > 1 ? "s" : ""}.`
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d’enregistrer."
      );
      setLocal(String(value));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={0}
        max={100}
        className="h-8 w-16"
        value={local}
        disabled={saving}
        onChange={(event) => setLocal(event.target.value)}
        onBlur={() => void save()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        aria-label="Projets ouverts non payés max"
      />
      {saving ? <Loader2 className="size-3.5 animate-spin text-muted-foreground" /> : null}
    </div>
  );
}

function InviteForm() {
  const list = useQuery(api.apporteurInvitations.list);
  const invite = useMutation(api.apporteurInvitations.inviteByEmail);
  const resend = useMutation(api.apporteurInvitations.resend);
  const remove = useMutation(api.apporteurInvitations.remove);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await invite({ name, email });
      toast.success("Invitation envoyée.");
      setName("");
      setEmail("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d’envoyer l’invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (apporteurId: Id<"apporteurs">, label: string) => {
    if (
      !window.confirm(
        `Supprimer ${label} ? Son compte ne pourra plus se connecter.`
      )
    ) {
      return;
    }
    setDeleting(apporteurId);
    try {
      await remove({ apporteurId });
      toast.success("Apporteur supprimé.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de supprimer."
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleResend = async (apporteurId: Id<"apporteurs">) => {
    setResending(apporteurId);
    try {
      await resend({ apporteurId });
      toast.success("Invitation renvoyée.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de renvoyer l’invitation."
      );
    } finally {
      setResending(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-6">
      <PageHeader
        title="Apport d’Affaires"
        description="Invitez un apporteur d’affaires. Il créera son compte et saisira date, client et montant du contrat."
      />

      <form
        onSubmit={(event) => void handleInvite(event)}
        className="space-y-4 rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="apporteur-name">Nom</Label>
            <Input
              id="apporteur-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Nom de l’apporteur"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apporteur-email">Email</Label>
            <Input
              id="apporteur-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="email@exemple.com"
            />
          </div>
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
          Envoyer l’invitation
        </Button>
      </form>

      {/* Mobile: stacked cards so every field stays readable */}
      <div className="space-y-3 md:hidden">
        {(list ?? []).map((row) => {
          const statusLabel =
            row.status === "en_attente"
              ? "En attente"
              : row.status === "actif"
                ? "Actif"
                : row.status;
          return (
            <div
              key={row._id}
              className="space-y-3 rounded-[1.5rem] border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{row.name}</p>
                  <p className="mt-0.5 break-all text-sm text-muted-foreground">
                    {row.email}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {statusLabel}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Max non payés
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    100 = illimité
                  </p>
                </div>
                <MaxUnpaidInput
                  apporteurId={row._id}
                  value={row.maxUnpaidOpened}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {row.status !== "actif" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={resending === row._id || deleting === row._id}
                    onClick={() => void handleResend(row._id)}
                  >
                    Renvoyer
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={deleting === row._id}
                  onClick={() => void handleDelete(row._id, row.name)}
                >
                  {deleting === row._id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Supprimer
                </Button>
              </div>
            </div>
          );
        })}
        {list?.length === 0 ? (
          <div className="rounded-[1.5rem] border border-border/60 bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            Aucun apporteur invité pour le moment.
          </div>
        ) : null}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-[1.5rem] border border-border/60 bg-card md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">
                <span className="block">Max non payés</span>
                <span className="mt-0.5 block normal-case tracking-normal text-[10px] font-normal text-muted-foreground">
                  Après ce nombre, paiement requis (100 = illimité)
                </span>
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(list ?? []).map((row) => (
              <tr key={row._id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                <td className="px-4 py-3 capitalize">
                  {row.status === "en_attente"
                    ? "En attente"
                    : row.status === "actif"
                      ? "Actif"
                      : row.status}
                </td>
                <td className="px-4 py-3">
                  <MaxUnpaidInput
                    apporteurId={row._id}
                    value={row.maxUnpaidOpened}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {row.status !== "actif" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={resending === row._id || deleting === row._id}
                        onClick={() => void handleResend(row._id)}
                      >
                        Renvoyer
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={deleting === row._id}
                      onClick={() => void handleDelete(row._id, row.name)}
                    >
                      {deleting === row._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {list?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Aucun apporteur invité pour le moment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ApportAffairesPropositionsPage() {
  return (
    <AdminShell variant="apport">
      <InviteForm />
    </AdminShell>
  );
}
