"use client";

import { useMemo, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { BellRing, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/dashboard/app-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { APPORT_AFFAIRES_HOME_PATH } from "@/lib/auth-routes";
import { useAdminSession } from "@/hooks/use-admin-session";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";

function ApportPushForm() {
  const { staff, canQueryAdmin } = useAdminSession();
  const stats = useQuery(
    api.pushSubscriptions.adminStats,
    canQueryAdmin ? {} : "skip"
  );
  const apporteurs = useQuery(
    api.apporteurInvitations.list,
    canQueryAdmin ? {} : "skip"
  );
  const sendBroadcast = useAction(api.webPush.sendBroadcast);

  const [apporteurId, setApporteurId] = useState<string>("all");
  const [title, setTitle] = useState("Message S2MBO");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState(APPORT_AFFAIRES_HOME_PATH);
  const [sending, setSending] = useState(false);

  const activeApporteurs = useMemo(() => {
    return (apporteurs ?? [])
      .filter((row) => row.status === "actif")
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [apporteurs]);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Titre et message sont obligatoires.");
      return;
    }
    setSending(true);
    try {
      const result = await sendBroadcast({
        audience: "apporteurs",
        apporteurId:
          apporteurId !== "all"
            ? (apporteurId as Id<"apporteurs">)
            : undefined,
        title,
        body,
        url: url.trim() || undefined,
      });
      if (result.total === 0) {
        toast.message(
          "Aucun appareil apporteur abonné pour cette cible."
        );
      } else {
        toast.success(
          `Notification envoyée : ${result.sent}/${result.total} appareil(s).`
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setSending(false);
    }
  };

  if (staff && !isAdminStaffRole(staff.role)) {
    return (
      <p className="text-sm text-muted-foreground">
        Accès réservé à l’équipe S2MBO.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Push mobile — Apporteurs"
        description="Envoyez une alerte aux apporteurs d’affaires qui ont installé l’app S2MBO."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Appareils apporteurs</p>
          <p className="mt-1 text-2xl font-bold">
            {stats?.apporteurDevices ?? "—"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Apporteurs actifs</p>
          <p className="mt-1 text-2xl font-bold">
            {activeApporteurs.length}
          </p>
        </Card>
        <Card className="col-span-2 p-4 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Push configuré</p>
          <p className="mt-1 text-2xl font-bold">
            {stats == null ? "—" : stats.configured ? "Oui" : "Non"}
          </p>
        </Card>
      </div>

      {stats && !stats.configured ? (
        <Card className="border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p className="font-medium">Clés VAPID manquantes</p>
          <p className="mt-1 text-amber-900/90">
            Ajoutez <code className="font-mono">VAPID_PUBLIC_KEY</code>,{" "}
            <code className="font-mono">VAPID_PRIVATE_KEY</code> et{" "}
            <code className="font-mono">VAPID_SUBJECT</code> sur le
            déploiement Convex Production.
          </p>
        </Card>
      ) : null}

      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <BellRing className="size-4 text-brand" />
          <h2 className="text-sm font-semibold">Envoyer une notification</h2>
        </div>

        <div>
          <Label>Apporteur</Label>
          <Select value={apporteurId} onValueChange={setApporteurId}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les apporteurs</SelectItem>
              {activeApporteurs.map((row) => (
                <SelectItem key={row._id} value={row._id}>
                  {row.name} · {row.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Titre</Label>
          <Input
            className="mt-1.5"
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Label>Message</Label>
          <Textarea
            className="mt-1.5 min-h-[100px]"
            value={body}
            maxLength={240}
            placeholder="Ex. Un acompte a été enregistré sur votre affaire…"
            onChange={(e) => setBody(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {body.length}/240
          </p>
        </div>

        <div>
          <Label>Lien (optionnel)</Label>
          <Input
            className="mt-1.5"
            value={url}
            placeholder="/apport-affaires ou /apport-affaires/honoraires"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <Button
          disabled={sending || stats?.configured === false}
          onClick={() => void handleSend()}
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Envoyer aux apporteurs
        </Button>
      </Card>
    </div>
  );
}

export default function ApportAffairesPushPage() {
  return (
    <AdminShell variant="apport">
      <ApportPushForm />
    </AdminShell>
  );
}
