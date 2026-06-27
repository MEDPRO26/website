"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONVERSATIONS } from "@/lib/mock-data";
import { Send, Plus, Link2, Copy, CheckCircle2 } from "lucide-react";

const SAMPLE = [
  { from: "client", text: "Bonjour, je voudrais une garde de nuit svp", time: "10:58" },
  { from: "me", text: "Bonjour Fatima, je note votre demande. Pour combien de nuits ?", time: "10:59" },
  { from: "client", text: "7 nuits, à partir de demain.", time: "11:00" },
  { from: "client", text: "Ma mère sort de l'hôpital.", time: "11:01" },
];

export function AdminConversationsPage() {
  const [active, setActive] = useState(CONVERSATIONS[1]);
  return (
    <div>
      <PageHeader title="Conversations WhatsApp" description="Inbox unifiée des messages clients." />
      <Card className="overflow-hidden p-0 h-[calc(100vh-220px)] min-h-[500px]">
        <div className="grid h-full grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)_300px]">
          {/* List */}
          <aside className="border-r border-border overflow-y-auto">
            <div className="border-b border-border p-3">
              <Input placeholder="Rechercher…" className="h-9" />
            </div>
            <ul>
              {CONVERSATIONS.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActive(c)}
                    className={`w-full px-3 py-3 text-left border-b border-border hover:bg-muted/50 ${active.id === c.id ? "bg-brand-soft/60" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{c.name}</p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{c.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{c.last}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{c.status}</span>
                      {c.unread > 0 && (
                        <span className="grid size-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">{c.unread}</span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Thread */}
          <section className="flex flex-col min-w-0">
            <header className="border-b border-border p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{active.name}</p>
                <p className="text-xs text-muted-foreground">{active.phone}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline"><Plus className="size-4" /> Créer commande</Button>
                <Button size="sm" variant="outline"><Link2 className="size-4" /> Lier</Button>
                <Button size="sm" variant="ghost"><CheckCircle2 className="size-4" /> Traité</Button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {SAMPLE.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "me" ? "bg-brand text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                    {m.text}
                    <p className={`mt-0.5 text-[10px] ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <Textarea placeholder="Tapez votre réponse…" rows={2} />
              <div className="mt-2 flex items-center justify-between">
                <Button size="sm" variant="ghost"><Copy className="size-4" /> Copier modèle</Button>
                <Button size="sm"><Send className="size-4" /> Envoyer</Button>
              </div>
            </div>
          </section>

          {/* Right info */}
          <aside className="border-l border-border overflow-y-auto p-4 hidden md:block">
            <h3 className="text-sm font-semibold mb-3">Infos client</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="font-medium">{active.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ville</p>
                <p className="font-medium">Inezgane</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <Tag tone="brand">WhatsApp</Tag>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Commandes liées</p>
                <p className="text-muted-foreground italic text-xs">Aucune commande encore</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes internes</p>
                <Textarea rows={3} placeholder="Ajouter une note…" />
              </div>
            </div>
          </aside>
        </div>
      </Card>
    </div>
  );
}