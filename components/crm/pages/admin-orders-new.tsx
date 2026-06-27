"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "source", label: "Source" },
  { key: "client", label: "Client" },
  { key: "demande", label: "Demande" },
  { key: "affectation", label: "Affectation" },
  { key: "resume", label: "Résumé" },
];

const SOURCES = [
  "Formulaire site", "WhatsApp manuel", "Appel téléphonique",
  "Google Maps", "Réseaux sociaux", "Autre",
];

export function AdminOrdersNewPage() {
  const [step, setStep] = useState(0);
  const [source, setSource] = useState("WhatsApp manuel");

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Nouvelle commande"
        description="Créer une commande manuelle en 5 étapes."
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
            onClick={() => setStep(i)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
              i === step ? "border-brand bg-brand-soft text-brand-deep"
              : i < step ? "border-success/30 bg-success-soft text-success"
              : "border-border bg-card text-muted-foreground",
            )}
          >
            <span className={cn(
              "grid size-5 place-items-center rounded-full text-[10px]",
              i === step ? "bg-brand text-primary-foreground"
              : i < step ? "bg-success text-primary-foreground"
              : "bg-muted",
            )}>
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div>
            <h3 className="text-base font-semibold mb-1">Source de la demande</h3>
            <p className="text-sm text-muted-foreground mb-4">Comment cette demande nous est-elle parvenue ?</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition-colors",
                    source === s ? "border-brand bg-brand-soft text-brand-deep" : "border-border hover:bg-muted",
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
            <Field label="Nom complet" placeholder="Mohamed El Amrani" />
            <Field label="Téléphone" placeholder="+212 6 ..." />
            <Field label="WhatsApp" placeholder="+212 6 ..." />
            <Field label="Email (optionnel)" placeholder="exemple@email.com" />
            <Field label="Ville">
              <Select defaultValue="agadir">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="agadir">Agadir</SelectItem>
                  <SelectItem value="inezgane">Inezgane</SelectItem>
                  <SelectItem value="dcheira">Dcheira</SelectItem>
                  <SelectItem value="aourir">Aourir</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Quartier" placeholder="Hay Mohammadi" />
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Adresse complète</Label>
              <Textarea placeholder="Rue, immeuble, étage, point de repère…" rows={2} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type de demande">
              <Select defaultValue="location">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="location">Location matériel médical</SelectItem>
                  <SelectItem value="livraison">Livraison matériel</SelectItem>
                  <SelectItem value="aide">Aide à domicile</SelectItem>
                  <SelectItem value="garde">Garde-malade</SelectItem>
                  <SelectItem value="soin">Soin à domicile</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Matériel ou service" placeholder="Lit médicalisé électrique" />
            <Field label="Durée" placeholder="1 mois" />
            <Field label="Date souhaitée" placeholder="2026-06-28" />
            <Field label="Créneau">
              <Select defaultValue="matin">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="matin">Matin (9h-12h)</SelectItem>
                  <SelectItem value="aprem">Après-midi (14h-18h)</SelectItem>
                  <SelectItem value="soir">Soir (18h-20h)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Message du client</Label>
              <Textarea rows={3} placeholder="Contexte, précisions, contraintes…" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-base font-semibold mb-1">Affectation</h3>
            <p className="text-sm text-muted-foreground mb-4">Que faire de cette commande ?</p>
            <div className="space-y-2">
              {[
                "Créer seulement (sans affecter)",
                "Affecter un fournisseur maintenant",
                "Envoyer à un fournisseur",
                "Envoyer à plusieurs fournisseurs (mise en concurrence)",
              ].map((opt, i) => (
                <label key={opt} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted cursor-pointer">
                  <input type="radio" name="aff" defaultChecked={i === 1} className="accent-brand" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-base font-semibold mb-3">Résumé de la commande</h3>
            <div className="rounded-lg border border-border divide-y divide-border">
              {[
                ["Source", source],
                ["Client", "Mohamed El Amrani"],
                ["Ville", "Agadir · Hay Mohammadi"],
                ["Type", "Location matériel médical"],
                ["Matériel", "Lit médicalisé électrique"],
                ["Durée", "1 mois"],
                ["Affectation", "Fournisseur Démo Agadir"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_minmax(0,1fr)] px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Précédent
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Suivant <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button asChild>
              <Link href="/admin/orders">Créer la commande</Link>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, placeholder, children }: { label: string; placeholder?: string; children?: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children ?? <Input placeholder={placeholder} />}
    </div>
  );
}