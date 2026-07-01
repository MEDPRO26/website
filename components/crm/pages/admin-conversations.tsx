"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus, Send, Settings } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { whatsAppUrl } from "@/lib/crm/phone-links";

const ALL_CHANNELS = "all";

export function AdminConversationsPage() {
  const { canQueryAdmin } = useAdminSession();
  const ensureChannels = useMutation(api.whatsappChannels.ensureDefaults);
  const migrateChannels = useMutation(api.conversations.migrateUnassignedChannels);

  const [channelFilter, setChannelFilter] = useState<string>(ALL_CHANNELS);
  const [activeId, setActiveId] = useState<Id<"conversations"> | null>(null);
  const [reply, setReply] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [newChannelId, setNewChannelId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const channels = useQuery(
    api.whatsappChannels.list,
    canQueryAdmin ? {} : "skip"
  );
  const conversations = useQuery(
    api.conversations.list,
    canQueryAdmin
      ? {
          channelId:
            channelFilter === ALL_CHANNELS
              ? undefined
              : (channelFilter as Id<"whatsappChannels">),
        }
      : "skip"
  );
  const createConversation = useMutation(api.conversations.create);
  const sendReply = useMutation(api.conversations.sendReply);
  const updateStatus = useMutation(api.conversations.updateStatus);
  const updateNotes = useMutation(api.conversations.updateNotes);

  const activeData = useQuery(
    api.conversations.get,
    canQueryAdmin && activeId ? { id: activeId } : "skip"
  );

  useEffect(() => {
    if (!canQueryAdmin || bootstrapped) {
      return;
    }
    void (async () => {
      await ensureChannels({});
      await migrateChannels({});
      setBootstrapped(true);
    })();
  }, [bootstrapped, canQueryAdmin, ensureChannels, migrateChannels]);

  useEffect(() => {
    if (channels?.length && !newChannelId) {
      const defaultChannel =
        channels.find((channel) => channel.isDefault) ?? channels[0];
      setNewChannelId(defaultChannel._id);
    }
  }, [channels, newChannelId]);

  useEffect(() => {
    if (conversations?.length && !activeId) {
      setActiveId(conversations[0]._id);
    }
    if (conversations && activeId && !conversations.some((c) => c._id === activeId)) {
      setActiveId(conversations[0]?._id ?? null);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    setNotes(activeData?.conversation.notes ?? "");
  }, [activeData?.conversation.notes, activeId]);

  const totalUnread = useMemo(
    () => (channels ?? []).reduce((sum, channel) => sum + channel.unreadCount, 0),
    [channels]
  );

  const handleCreate = async () => {
    if (!newChannelId || !newName.trim() || !newPhone.trim() || !newMessage.trim()) {
      toast.error("Ligne, nom, téléphone et message obligatoires.");
      return;
    }
    setSubmitting(true);
    try {
      const id = await createConversation({
        channelId: newChannelId as Id<"whatsappChannels">,
        name: newName,
        phone: newPhone,
        message: newMessage,
      });
      setActiveId(id);
      setChannelFilter(newChannelId);
      setCreateOpen(false);
      setNewName("");
      setNewPhone("");
      setNewMessage("");
      toast.success("Conversation créée.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!activeId || !reply.trim()) return;
    setSubmitting(true);
    try {
      await sendReply({ conversationId: activeId, text: reply });
      setReply("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  const active = activeData?.conversation;
  const replyUrl = active
    ? whatsAppUrl(active.phone, reply.trim() || active.lastMessage)
    : "#";

  const createOrderHref = useMemo(() => {
    if (!active) {
      return "/admin/orders/new";
    }
    const params = new URLSearchParams({
      phone: active.phone,
      name: active.name,
      source: `WhatsApp · ${active.channelLabel}`,
      conversationId: active._id,
    });
    if (active.channelId) {
      params.set("channelId", active.channelId);
    }
    if (activeData?.channel?.purpose) {
      params.set("channelPurpose", activeData.channel.purpose);
    }
    return `/admin/orders/new?${params.toString()}`;
  }, [active, activeData?.channel?.purpose]);

  return (
    <div>
      <PageHeader
        title="Conversations WhatsApp"
        description="4 lignes WhatsApp regroupées — saisie manuelle jusqu'à connexion API."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/settings">
                <Settings className="size-4" /> Configurer les lignes
              </Link>
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" /> Nouvelle conversation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Ligne WhatsApp reçue *</Label>
                    <Select value={newChannelId} onValueChange={setNewChannelId}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Choisir une ligne" />
                      </SelectTrigger>
                      <SelectContent>
                        {(channels ?? []).map((channel) => (
                          <SelectItem key={channel._id} value={channel._id}>
                            {channel.label}
                            {channel.phone ? ` · ${channel.phone}` : " · numéro à configurer"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nom client</Label>
                    <Input
                      className="mt-1.5"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Téléphone client</Label>
                    <Input
                      className="mt-1.5"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Message reçu (copié depuis WhatsApp)</Label>
                    <Textarea
                      className="mt-1.5"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Annuler
                  </Button>
                  <Button disabled={submitting} onClick={() => void handleCreate()}>
                    {submitting ? <Loader2 className="size-4 animate-spin" /> : "Créer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <Card className="min-h-[500px] overflow-hidden p-0 h-[calc(100vh-220px)]">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[200px_260px_minmax(0,1fr)_280px]">
          <aside className="hidden border-r border-border bg-muted/20 lg:block">
            <div className="border-b border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Lignes WhatsApp
              </p>
            </div>
            <ul className="p-2 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setChannelFilter(ALL_CHANNELS)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted/60 ${channelFilter === ALL_CHANNELS ? "bg-brand-soft/70 font-medium" : ""}`}
                >
                  <span>Toutes</span>
                  {totalUnread > 0 ? (
                    <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-primary-foreground">
                      {totalUnread}
                    </span>
                  ) : null}
                </button>
              </li>
              {(channels ?? []).map((channel) => (
                <li key={channel._id}>
                  <button
                    type="button"
                    onClick={() => setChannelFilter(channel._id)}
                    className={`flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm hover:bg-muted/60 ${channelFilter === channel._id ? "bg-brand-soft/70" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{channel.label}</span>
                      {channel.unreadCount > 0 ? (
                        <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-primary-foreground">
                          {channel.unreadCount}
                        </span>
                      ) : null}
                    </div>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {channel.phone || "Numéro à configurer"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <aside className="border-r border-border overflow-y-auto">
            <div className="border-b border-border p-3 lg:hidden">
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CHANNELS}>Toutes les lignes</SelectItem>
                  {(channels ?? []).map((channel) => (
                    <SelectItem key={channel._id} value={channel._id}>
                      {channel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ul>
              {(conversations ?? []).map((c) => (
                <li key={c._id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c._id)}
                    className={`w-full border-b border-border px-3 py-3 text-left hover:bg-muted/50 ${activeId === c._id ? "bg-brand-soft/60" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {c.timeLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {c.lastMessage}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <Tag tone="info">{c.channelLabel}</Tag>
                      {c.unreadCount > 0 ? (
                        <span className="grid size-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
              {conversations?.length === 0 ? (
                <li className="p-4 text-sm text-muted-foreground">
                  Aucune conversation sur cette ligne.
                </li>
              ) : null}
            </ul>
          </aside>

          <section className="flex min-w-0 flex-col">
            {active ? (
              <>
                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{active.name}</p>
                    <p className="text-xs text-muted-foreground">{active.phone}</p>
                    <p className="mt-1 text-xs text-brand-deep">
                      Ligne : {active.channelLabel}
                      {active.channelPhone ? ` (${active.channelPhone})` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={createOrderHref}>Créer commande</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={replyUrl} target="_blank" rel="noopener noreferrer">
                        Ouvrir WhatsApp
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        void updateStatus({ id: active._id, status: "traite" })
                      }
                    >
                      Traité
                    </Button>
                  </div>
                </header>
                <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
                  {(activeData?.messages ?? []).map((m) => (
                    <div
                      key={m._id}
                      className={`flex ${m.from === "staff" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "staff" ? "rounded-br-sm bg-brand text-primary-foreground" : "rounded-bl-sm border border-border bg-card"}`}
                      >
                        {m.text}
                        <p
                          className={`mt-0.5 text-[10px] ${m.from === "staff" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border p-3">
                  <Textarea
                    placeholder="Tapez votre réponse (puis Ouvrir WhatsApp pour envoyer)…"
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={replyUrl} target="_blank" rel="noopener noreferrer">
                        Ouvrir WhatsApp
                      </a>
                    </Button>
                    <Button size="sm" disabled={submitting} onClick={() => void handleReply()}>
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      Enregistrer réponse
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Sélectionnez une conversation
              </p>
            )}
          </section>

          <aside className="hidden overflow-y-auto border-l border-border p-4 md:block">
            {active ? (
              <>
                <h3 className="mb-3 text-sm font-semibold">Infos client</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Ligne WhatsApp</p>
                    <p className="font-medium">{active.channelLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {active.channelPhone || "Configurez le numéro dans Paramètres"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone client</p>
                    <p className="font-medium">{active.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <Tag tone="brand">{active.source}</Tag>
                  </div>
                  {activeData?.customer ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Client CRM</p>
                      <p className="font-medium">{activeData.customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activeData.customer.city}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Notes internes</p>
                    <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        void updateNotes({ id: active._id, notes }).then(() =>
                          toast.success("Notes enregistrées.")
                        )
                      }
                    >
                      Enregistrer notes
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </aside>
        </div>
      </Card>
    </div>
  );
}
