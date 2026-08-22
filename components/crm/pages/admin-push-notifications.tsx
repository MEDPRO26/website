"use client";

import { useMemo, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { BellRing, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
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
import { useAdminSession } from "@/hooks/use-admin-session";
import { resolveSupplierPartnerKind } from "@/lib/supplier-activity-types";

type Audience = "all" | "materiel" | "soins" | "apporteurs";

export function AdminPushNotificationsPage() {
  const { canQueryAdmin } = useAdminSession();
  const stats = useQuery(
    api.pushSubscriptions.adminStats,
    canQueryAdmin ? {} : "skip"
  );
  const suppliers = useQuery(api.suppliers.list, canQueryAdmin ? {} : "skip");
  const sendBroadcast = useAction(api.webPush.sendBroadcast);

  const [audience, setAudience] = useState<Audience>("all");
  const [supplierId, setSupplierId] = useState<string>("all");
  const [title, setTitle] = useState("Message S2MBO");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);

  const partnerOptions = useMemo(() => {
    if (!suppliers || audience === "apporteurs") return [];
    return suppliers
      .filter((s: { status: string }) => s.status === "actif")
      .filter(
        (s: {
          type: string;
          types?: string[];
          partnerKind?: "materiel" | "soins";
        }) => {
          const kind =
            resolveSupplierPartnerKind(s) ?? s.partnerKind ?? "materiel";
          if (audience === "all") return true;
          return kind === audience;
        }
      )
      .sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name, "fr")
      );
  }, [suppliers, audience]);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Titre et message sont obligatoires.");
      return;
    }
    setSending(true);
    try {
      const result = await sendBroadcast({
        audience,
        supplierId:
          audience !== "apporteurs" && supplierId !== "all"
            ? (supplierId as Id<"suppliers">)
            : undefined,
        title,
        body,
        url: url.trim() || undefined,
      });
      if (result.total === 0) {
        toast.message("Aucun appareil abonné pour cette cible.");
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

  return (
    <div>
      <PageHeader
        title="Push notifications"
        description="Envoyez une alerte mobile aux fournisseurs, prestataires et apporteurs qui ont installé l'app"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Appareils abonnés</p>
          <p className="mt-1 text-2xl font-bold">{stats?.devices ?? "—"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Partenaires</p>
          <p className="mt-1 text-2xl font-bold">{stats?.partners ?? "—"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Fournisseurs</p>
          <p className="mt-1 text-2xl font-bold">
            {stats?.materielDevices ?? "—"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Prestataires</p>
          <p className="mt-1 text-2xl font-bold">
            {stats?.soinsDevices ?? "—"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Apporteurs</p>
          <p className="mt-1 text-2xl font-bold">
            {stats?.apporteurDevices ?? "—"}
          </p>
        </Card>
      </div>

      {stats && !stats.configured ? (
        <Card className="mb-4 border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p className="font-medium">
            Clés VAPID manquantes sur ce déploiement Convex
          </p>
          <p className="mt-1 text-amber-900/90">
            Vous les avez peut‑être ajoutées en <strong>Development</strong>,
            mais s2mbo.com utilise <strong>Production</strong>. Ouvrez Convex →
            basculez sur le déploiement Production → Settings → Environment
            Variables, puis ajoutez{" "}
            <code className="font-mono">VAPID_PUBLIC_KEY</code>,{" "}
            <code className="font-mono">VAPID_PRIVATE_KEY</code> et{" "}
            <code className="font-mono">VAPID_SUBJECT</code> (mêmes valeurs).
            Rechargez ensuite cette page.
          </p>
        </Card>
      ) : null}

      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <BellRing className="size-4 text-brand" />
          <h2 className="text-sm font-semibold">Envoyer une notification</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Destinataires</Label>
            <Select
              value={audience}
              onValueChange={(value) => {
                setAudience(value as Audience);
                setSupplierId("all");
              }}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les partenaires</SelectItem>
                <SelectItem value="materiel">Fournisseurs seulement</SelectItem>
                <SelectItem value="soins">Prestataires seulement</SelectItem>
                <SelectItem value="apporteurs">Apporteurs seulement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {audience !== "apporteurs" ? (
            <div>
              <Label>Partenaire précis (optionnel)</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous de la sélection</SelectItem>
                  {partnerOptions.map(
                    (s: { _id: Id<"suppliers">; name: string }) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label>Lien conseillé</Label>
              <p className="mt-2 text-sm text-muted-foreground">
                Ex. <code className="font-mono">/apport-affaires</code> ou{" "}
                <code className="font-mono">/apport-affaires/honoraires</code>
              </p>
            </div>
          )}
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
            placeholder="Ex. Nouvelle commande urgente à traiter…"
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
            placeholder="/apport-affaires ou /supplier/orders/…"
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
          Envoyer la notification
        </Button>
      </Card>
    </div>
  );
}
