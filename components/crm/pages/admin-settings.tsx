"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2 } from "lucide-react";

const PROVIDERS = [
  { id: "manual", label: "Manuel seulement", desc: "Copier/coller WhatsApp web", state: "Actif", tone: "success" as const },
  { id: "meta", label: "Meta WhatsApp Cloud API", desc: "API officielle Meta Business", state: "Non configuré", tone: "neutral" as const },
  { id: "360", label: "360dialog", desc: "BSP partenaire", state: "Erreur", tone: "danger" as const },
  { id: "off", label: "Désactivé", desc: "Aucune intégration", state: "—", tone: "neutral" as const },
];

export function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="Paramètres" description="Configuration plateforme SOS Santé Agadir" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold">Général</h3>
          <div><Label className="mb-1.5 block">Ville par défaut</Label><Input defaultValue="Agadir" /></div>
          <div><Label className="mb-1.5 block">Numéro WhatsApp principal</Label><Input defaultValue="+212 6 00 00 00 00" /></div>
          <div><Label className="mb-1.5 block">Email contact</Label><Input defaultValue="contact@sossante.ma" /></div>
          <div><Label className="mb-1.5 block">Commission par défaut (%)</Label><Input defaultValue="15" type="number" /></div>
          <Button>Enregistrer</Button>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold">Notifications</h3>
          {["Nouvelle demande", "Fournisseur a répondu", "Client a accepté", "Réclamation ouverte", "Location bientôt terminée"].map((n) => (
            <div key={n} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">{n}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                Email <Switch defaultChecked />
                WhatsApp <Switch />
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-3 lg:col-span-2">
          <h3 className="font-semibold">WhatsApp provider</h3>
          <p className="text-sm text-muted-foreground">Choisir comment SOS Santé envoie les messages WhatsApp.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROVIDERS.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4 hover:border-brand/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{p.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                  <Tag tone={p.tone}>{p.state}</Tag>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">Configurer</Button>
                  {p.state === "Actif" && <span className="inline-flex items-center gap-1 text-xs text-status-success-fg"><CheckCircle2 className="size-3.5" /> Sélectionné</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold">Sécurité</h3>
          <div className="flex items-center justify-between rounded-lg border border-border p-3"><span className="text-sm">Double authentification</span><Switch defaultChecked /></div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3"><span className="text-sm">Logs d'audit</span><Switch defaultChecked /></div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold">SEO global</h3>
          <div><Label className="mb-1.5 block">Titre site</Label><Input defaultValue="SOS Santé Agadir — Matériel médical et aide à domicile" /></div>
          <div><Label className="mb-1.5 block">Description</Label><Input defaultValue="Coordination locale pour location matériel médical, garde-malade et aide à domicile à Agadir." /></div>
        </Card>
      </div>
    </div>
  );
}