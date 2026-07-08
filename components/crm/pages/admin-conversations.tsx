"use client";

import Link from "next/link";
import {
  assertWhatsAppAudioContentType,
  isWebmAudio,
} from "@/lib/crm/audio-upload";
import { prepareAudioForWhatsApp } from "@/lib/crm/convert-audio";
import { resolveMessageMediaKind, shouldRenderAudioPlayer, shouldShowMessageText } from "@/lib/crm/media-message";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useAction } from "convex/react";
import { Loader2, Mic, Paperclip, Plus, Send, Settings, Square, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  mixHexWithWhite,
  resolveChannelColor,
  resolveClientColor,
  rgbaFromHex,
} from "@/lib/crm/whatsapp-colors";

const ALL_CHANNELS = "all";

export function AdminConversationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canQueryAdmin } = useAdminSession();
  const ensureChannels = useMutation(api.whatsappChannels.ensureDefaults);
  const migrateChannels = useMutation(api.conversations.migrateUnassignedChannels);

  const [channelFilter, setChannelFilter] = useState<string>(ALL_CHANNELS);
  const [activeId, setActiveId] = useState<Id<"conversations"> | null>(null);
  const [reply, setReply] = useState("");
  const [notes, setNotes] = useState("");
  const [clientColor, setClientColor] = useState("#db2777");
  const [submitting, setSubmitting] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const deepLinkHandled = useRef(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [newChannelId, setNewChannelId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [pendingAudioBlob, setPendingAudioBlob] = useState<Blob | null>(null);
  const [convertingAudio, setConvertingAudio] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recorderStreamRef = useRef<MediaStream | null>(null);
  const recorderChunksRef = useRef<Blob[]>([]);

  const channels = useQuery(
    api.whatsappChannels.list,
    canQueryAdmin ? {} : "skip"
  );
  const settings = useQuery(
    api.platformSettings.get,
    canQueryAdmin ? {} : "skip"
  );
  const is360Connected = settings?.whatsappProvider === "360messenger";
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
  const ensureForContact = useMutation(api.conversations.ensureForContact);
  const sendReplyWithWhatsApp = useAction(api.conversations.sendReplyWithWhatsApp);
  const syncFrom360 = useAction(api.conversations.syncFrom360);
  const generateAudioUploadUrl = useMutation(api.conversations.generateAudioUploadUrl);
  const sendAudioReply = useMutation(api.conversations.sendAudioReply);
  const deleteMessageMedia = useMutation(api.conversations.deleteMessageMedia);
  const updateStatus = useMutation(api.conversations.updateStatus);
  const acceptClientOffer = useMutation(api.quotes.acceptClientOffer);
  const updateNotes = useMutation(api.conversations.updateNotes);
  const updateClientAccentColor = useMutation(api.conversations.updateClientAccentColor);
  const purgeAll = useMutation(api.conversations.purgeAll);
  const pruneThread = useMutation(api.conversations.pruneThread);
  const [purging, setPurging] = useState(false);
  const [purgeDialogOpen, setPurgeDialogOpen] = useState(false);

  const activeData = useQuery(
    api.conversations.get,
    canQueryAdmin && activeId ? { id: activeId } : "skip"
  );
  const linkedOrders = useQuery(
    api.conversations.getLinkedOrder,
    canQueryAdmin && activeId ? { conversationId: activeId } : "skip"
  );
  const offreEnvoyeeOrder = linkedOrders?.offreEnvoyee ?? null;
  const acceptedOrder = linkedOrders?.acceptee ?? null;
  const pipelineOrder = linkedOrders?.primary ?? linkedOrders?.latest ?? null;

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
    if (!canQueryAdmin || !bootstrapped || deepLinkHandled.current) {
      return;
    }

    const phone = searchParams.get("phone");
    if (!phone?.trim()) {
      return;
    }

    deepLinkHandled.current = true;

    void (async () => {
      try {
        const result = await ensureForContact({
          phone: phone.trim(),
          name: searchParams.get("name")?.trim() || `Client ${phone.trim()}`,
          city: searchParams.get("city")?.trim() || undefined,
          message: searchParams.get("message")?.trim() || undefined,
          source: "Commande CRM",
          orderSource: searchParams.get("orderSource")?.trim() || undefined,
          orderId: searchParams.get("orderId")?.trim()
            ? (searchParams.get("orderId")!.trim() as Id<"orders">)
            : undefined,
        });
        setActiveId(result.conversationId);
        setChannelFilter(result.channelId);
        router.replace("/admin/conversations", { scroll: false });
      } catch (error) {
        deepLinkHandled.current = false;
        toast.error(
          error instanceof Error ? error.message : "Impossible d'ouvrir la conversation."
        );
      }
    })();
  }, [
    bootstrapped,
    canQueryAdmin,
    ensureForContact,
    router,
    searchParams,
  ]);

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

  useEffect(() => {
    const conversation = activeData?.conversation;
    if (!conversation) {
      return;
    }
    setClientColor(
      resolveClientColor(conversation.clientAccentColor, conversation.phone)
    );
  }, [
    activeData?.conversation?.clientAccentColor,
    activeData?.conversation?.phone,
    activeId,
  ]);

  useEffect(() => {
    if (!canQueryAdmin || !activeId) {
      return;
    }

    if (!activeData?.conversation?.orderId) {
      return;
    }

    void (async () => {
      await pruneThread({ conversationId: activeId });
      if (is360Connected) {
        await syncFrom360({ conversationId: activeId });
      }
    })();
  }, [
    activeId,
    activeData?.conversation?.orderId,
    canQueryAdmin,
    is360Connected,
    pruneThread,
    syncFrom360,
  ]);

  useEffect(() => {
    if (!canQueryAdmin || !activeId || !is360Connected) {
      return;
    }

    if (activeData?.conversation?.orderId) {
      return;
    }

    let cancelled = false;

    const pullMessages = async () => {
      try {
        await syncFrom360({ conversationId: activeId });
      } catch {
        if (!cancelled) {
          // Background sync — avoid noisy toasts on transient API errors.
        }
      }
    };

    void pullMessages();
    const interval = window.setInterval(pullMessages, 20_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeId, activeData?.conversation?.orderId, canQueryAdmin, is360Connected, syncFrom360]);

  const channelColorById = useMemo(() => {
    const map = new Map<string, string>();
    for (const channel of channels ?? []) {
      map.set(
        channel._id,
        resolveChannelColor(channel.accentColor, channel.slug, channel.sortOrder)
      );
    }
    return map;
  }, [channels]);

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

  const handleAcceptPrice = async () => {
    const orderId = offreEnvoyeeOrder?._id ?? active?.orderId;
    if (!orderId) {
      return;
    }
    setSubmitting(true);
    try {
      await acceptClientOffer({ orderId });
      toast.success(
        `Prix accepté pour ${offreEnvoyeeOrder?.ref ?? active?.orderRef ?? "la commande"}. Conversation clôturée.`
      );
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
      await sendReplyWithWhatsApp({ conversationId: activeId, text: reply });
      setReply("");
      if (is360Connected) {
        toast.success("Message envoyé via WhatsApp.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearAudioPreview = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioPreviewUrl(null);
    setPendingAudioBlob(null);
  };

  const uploadAndSendAudio = async (blob: Blob) => {
    if (!activeId) {
      return;
    }

    setSubmitting(true);
    setConvertingAudio(true);
    try {
      const prepared = await prepareAudioForWhatsApp(blob);
      assertWhatsAppAudioContentType(prepared.contentType);

      const uploadUrl = await generateAudioUploadUrl();
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": prepared.contentType },
        body: prepared.blob,
      });
      if (!uploadResult.ok) {
        throw new Error("Échec du téléversement audio.");
      }
      const { storageId } = (await uploadResult.json()) as {
        storageId: Id<"_storage">;
      };
      await sendAudioReply({
        conversationId: activeId,
        storageId,
        contentType: prepared.contentType,
        text: reply.trim() || undefined,
      });
      setReply("");
      clearAudioPreview();
      toast.success("Message vocal envoyé via WhatsApp.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setConvertingAudio(false);
      setSubmitting(false);
    }
  };

  const handleAudioFile = async (file: File | null) => {
    if (!file) {
      return;
    }
    if (!file.type.startsWith("audio/")) {
      toast.error("Choisissez un fichier audio (MP3, OGG, M4A, WAV…).");
      return;
    }
    clearAudioPreview();
    setPendingAudioBlob(file);
    setAudioPreviewUrl(URL.createObjectURL(file));
  };

  const startRecording = async () => {
    if (!is360Connected || recording) {
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderStreamRef.current = stream;
      recorderChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recorderChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        recorderStreamRef.current = null;
        const blob = new Blob(recorderChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (blob.size === 0) {
          return;
        }
        clearAudioPreview();
        setPendingAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("Microphone inaccessible. Autorisez l'accès au micro.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  };

  const handleSendAudio = async () => {
    if (!pendingAudioBlob) {
      return;
    }
    await uploadAndSendAudio(pendingAudioBlob);
  };

  const handleDeleteMessageMedia = async (
    messageId: Id<"conversationMessages">
  ) => {
    if (!window.confirm("Supprimer cet audio du CRM ?")) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteMessageMedia({ messageId });
      toast.success("Audio supprimé du CRM.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePurgeAll = async () => {
    setPurging(true);
    try {
      const result = await purgeAll({});
      setActiveId(null);
      setPurgeDialogOpen(false);
      toast.success(
        `${result.conversationsDeleted} conversation(s) et ${result.messagesDeleted} message(s) supprimés.`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible de tout supprimer.");
    } finally {
      setPurging(false);
    }
  };

  const active = activeData?.conversation;
  const activeLineColor = active
    ? resolveChannelColor(
        active.channelAccentColor,
        active.channelSlug,
        active.channelSortOrder
      )
    : "#2563eb";
  const activeClientColor = active
    ? resolveClientColor(active.clientAccentColor, active.phone)
    : "#db2777";
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
        description={
          is360Connected
            ? "Messages WhatsApp reçus automatiquement via 360Messenger."
            : "4 lignes WhatsApp — saisie manuelle ou connectez 360Messenger dans Paramètres."
        }
        actions={
          <div className="flex gap-2">
            <AlertDialog
              open={purgeDialogOpen}
              onOpenChange={(open) => {
                if (!purging) {
                  setPurgeDialogOpen(open);
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-danger hover:text-danger">
                  <Trash2 className="size-4" /> Tout supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer toutes les conversations ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action efface définitivement toutes les conversations WhatsApp
                    et leurs messages du CRM. Elle est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={purging}>Annuler</AlertDialogCancel>
                  <Button
                    type="button"
                    className="bg-status-error text-white hover:bg-status-error/90"
                    disabled={purging}
                    onClick={() => void handlePurgeAll()}
                  >
                    {purging ? "Suppression…" : "Tout supprimer"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

      <Card className="h-[calc(100vh-220px)] min-h-[500px] overflow-hidden p-0">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[200px_260px_minmax(0,1fr)_280px]">
          <aside className="hidden min-h-0 overflow-y-auto border-r border-border bg-muted/20 lg:block">
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
              {(channels ?? []).map((channel) => {
                const lineColor = channelColorById.get(channel._id) ?? "#2563eb";
                const isActive = channelFilter === channel._id;
                return (
                <li key={channel._id}>
                  <button
                    type="button"
                    onClick={() => setChannelFilter(channel._id)}
                    className={`flex w-full flex-col rounded-lg border border-transparent px-3 py-2 text-left text-sm hover:bg-muted/60 ${isActive ? "font-medium" : ""}`}
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: lineColor,
                      backgroundColor: isActive
                        ? mixHexWithWhite(lineColor, 0.9)
                        : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{channel.label}</span>
                      {channel.unreadCount > 0 ? (
                        <span
                          className="grid min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: lineColor }}
                        >
                          {channel.unreadCount}
                        </span>
                      ) : null}
                    </div>
                    <span
                      className="truncate text-[11px] font-medium"
                      style={{ color: lineColor }}
                    >
                      {channel.phone || "Numéro à configurer"}
                    </span>
                  </button>
                </li>
              );
              })}
            </ul>
          </aside>

          <aside className="min-h-0 overflow-y-auto border-r border-border">
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
              {(conversations ?? []).map((c) => {
                const lineColor = resolveChannelColor(
                  c.channelAccentColor,
                  c.channelSlug,
                  c.channelSortOrder
                );
                const clientColor = resolveClientColor(c.clientAccentColor, c.phone);
                const isActive = activeId === c._id;
                return (
                <li key={c._id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c._id)}
                    className={`w-full border-b border-border px-3 py-3 text-left hover:bg-muted/50 ${isActive ? "" : ""}`}
                    style={{
                      backgroundColor: isActive
                        ? mixHexWithWhite(clientColor, 0.94)
                        : undefined,
                      borderLeftWidth: 3,
                      borderLeftColor: clientColor,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-medium"
                          style={{ color: clientColor }}
                        >
                          {c.name}
                        </p>
                        {c.orderRef ? (
                          <p className="truncate font-mono text-[10px] font-semibold text-muted-foreground">
                            {c.orderRef}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {c.starColor === "yellow" ? (
                          <Star
                            className="size-3.5 fill-amber-400 text-amber-400"
                            aria-label="Prix accepté"
                          />
                        ) : null}
                        <span className="text-[11px] text-muted-foreground">
                          {c.timeLabel}
                        </span>
                      </div>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {c.lastMessage}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span
                        className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          color: lineColor,
                          backgroundColor: mixHexWithWhite(lineColor, 0.88),
                          borderColor: rgbaFromHex(lineColor, 0.25),
                        }}
                      >
                        {c.channelLabel}
                      </span>
                      {c.unreadCount > 0 ? (
                        <span
                          className="grid size-4 place-items-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: lineColor }}
                        >
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
              })}
              {conversations?.length === 0 ? (
                <li className="p-4 text-sm text-muted-foreground">
                  Aucune conversation sur cette ligne.
                </li>
              ) : null}
            </ul>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            {active ? (
              <>
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: activeClientColor }}>
                        {active.name}
                      </p>
                      {(active.orderRef || pipelineOrder?.ref) ? (
                        <span className="rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground">
                          {active.orderRef ?? pipelineOrder?.ref}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs font-medium" style={{ color: activeClientColor }}>
                      {active.phone}
                    </p>
                    <p className="mt-1 text-xs font-medium" style={{ color: activeLineColor }}>
                      Ligne : {active.channelLabel}
                      {active.channelPhone ? ` (${active.channelPhone})` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-start gap-2">
                    <div className="flex flex-col gap-1">
                      {pipelineOrder ? (
                        acceptedOrder && !offreEnvoyeeOrder ? (
                          <Button
                            size="sm"
                            disabled
                            className="bg-amber-400 text-white hover:bg-amber-400 disabled:opacity-100"
                          >
                            <Star className="size-3.5 fill-white text-white" />
                            Prix accepté · {acceptedOrder.ref}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={submitting || !offreEnvoyeeOrder}
                            className="border-gray-200 bg-gray-50 text-gray-600 shadow-none hover:bg-gray-100 hover:text-gray-700 disabled:opacity-100 disabled:text-gray-400"
                            onClick={() => void handleAcceptPrice()}
                          >
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            Prix Accepte {pipelineOrder.ref}
                          </Button>
                        )
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pipelineOrder ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/orders/${pipelineOrder._id}`}>
                            Commande
                          </Link>
                        </Button>
                      ) : null}
                      {!pipelineOrder ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={createOrderHref}>Créer commande</Link>
                        </Button>
                      ) : null}
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
                  </div>
                </header>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
                  {(activeData?.messages ?? []).map((m) => {
                    const mediaKind = resolveMessageMediaKind(
                      m.mediaUrl,
                      m.mediaKind,
                      m.text
                    );
                    return (
                    <div
                      key={m._id}
                      className={`flex ${m.from === "staff" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "staff" ? "rounded-br-sm bg-brand text-primary-foreground" : "rounded-bl-sm border"}`}
                        style={
                          m.from === "staff"
                            ? undefined
                            : {
                                backgroundColor: mixHexWithWhite(activeLineColor, 0.9),
                                borderColor: rgbaFromHex(activeLineColor, 0.28),
                                color: activeLineColor,
                              }
                        }
                      >
                        {m.mediaUrl ? (
                          <div className="mb-1 space-y-1">
                            {shouldRenderAudioPlayer(m.mediaUrl, mediaKind, m.text) ? (
                              <div className="flex items-center gap-2">
                                <audio
                                  controls
                                  src={m.mediaUrl}
                                  className="w-56 max-w-full"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="size-8 shrink-0 border-border bg-white text-primary hover:bg-muted/40"
                                  disabled={submitting}
                                  title="Supprimer l'audio du CRM"
                                  onClick={() => void handleDeleteMessageMedia(m._id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            ) : mediaKind === "image" ? (
                              <a
                                href={m.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={m.mediaUrl}
                                  alt="Image reçue"
                                  className="max-h-60 w-auto rounded-lg"
                                />
                              </a>
                            ) : mediaKind === "video" ? (
                              <video
                                controls
                                src={m.mediaUrl}
                                className="max-h-60 w-full rounded-lg"
                              />
                            ) : (
                              <a
                                href={m.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-current/30 px-2.5 py-1.5 text-xs font-medium underline"
                              >
                                <Paperclip className="size-3.5" />
                                Ouvrir le fichier
                              </a>
                            )}
                          </div>
                        ) : null}
                        {shouldShowMessageText(m.text, m.mediaUrl) ? (
                          <span>{m.text}</span>
                        ) : null}
                        <p
                          className={`mt-0.5 text-[10px] ${m.from === "staff" ? "text-primary-foreground/70" : ""}`}
                          style={
                            m.from === "staff"
                              ? undefined
                              : { color: rgbaFromHex(activeLineColor, 0.7) }
                          }
                        >
                          {new Date(m.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    );
                  })}
                </div>
                <div className="shrink-0 border-t border-border p-3">
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*,.mp3,.m4a,.ogg,.oga,.wav,.aac,.amr"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      void handleAudioFile(file);
                      event.target.value = "";
                    }}
                  />
                  {audioPreviewUrl ? (
                    <div className="mb-2 space-y-2 rounded-lg border border-border bg-muted/30 p-2.5">
                      <audio controls src={audioPreviewUrl} className="w-full" />
                      {pendingAudioBlob && isWebmAudio(pendingAudioBlob.type) ? (
                        <p className="text-xs text-muted-foreground">
                          Le vocal sera converti en MP3 avant l&apos;envoi WhatsApp.
                        </p>
                      ) : null}
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={submitting || convertingAudio}
                          onClick={clearAudioPreview}
                        >
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          disabled={submitting || convertingAudio}
                          onClick={() => void handleSendAudio()}
                        >
                          {submitting || convertingAudio ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Send className="size-4" />
                          )}
                          {convertingAudio ? "Conversion…" : "Envoyer vocal"}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  <Textarea
                    placeholder={
                      is360Connected
                        ? "Répondre au client — envoi direct via WhatsApp…"
                        : "Tapez votre réponse (puis Ouvrir WhatsApp pour envoyer)…"
                    }
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    {is360Connected ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={submitting || convertingAudio || recording}
                          onClick={() => audioInputRef.current?.click()}
                          title="Joindre un fichier audio"
                        >
                          <Paperclip className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={recording ? "destructive" : "outline"}
                          disabled={submitting || convertingAudio}
                          onClick={() => (recording ? stopRecording() : void startRecording())}
                          title={recording ? "Arrêter l'enregistrement" : "Enregistrer un vocal"}
                        >
                          {recording ? (
                            <Square className="size-4 fill-current" />
                          ) : (
                            <Mic className="size-4" />
                          )}
                        </Button>
                      </>
                    ) : null}
                    {!is360Connected ? (
                      <Button size="sm" variant="outline" asChild>
                        <a href={replyUrl} target="_blank" rel="noopener noreferrer">
                          Ouvrir WhatsApp
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      disabled={submitting || !reply.trim()}
                      onClick={() => void handleReply()}
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      {is360Connected ? "Envoyer" : "Enregistrer réponse"}
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

          <aside className="hidden min-h-0 overflow-y-auto border-l border-border p-4 md:block">
            {active ? (
              <>
                <h3 className="mb-3 text-sm font-semibold">Infos client</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Ligne WhatsApp</p>
                    <p className="font-medium" style={{ color: activeLineColor }}>
                      {active.channelLabel}
                    </p>
                    <p className="text-xs font-medium" style={{ color: activeLineColor }}>
                      {active.channelPhone || "Configurez le numéro dans Paramètres"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone client</p>
                    <p className="font-medium" style={{ color: activeClientColor }}>
                      {active.phone}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">Couleur client</Label>
                      <input
                        type="color"
                        value={clientColor}
                        onChange={(e) => setClientColor(e.target.value)}
                        onBlur={() =>
                          void updateClientAccentColor({
                            id: active._id,
                            accentColor: clientColor,
                          }).then(() => toast.success("Couleur client enregistrée."))
                        }
                        className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-card p-1"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <span
                      className="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        color: activeLineColor,
                        backgroundColor: mixHexWithWhite(activeLineColor, 0.88),
                        borderColor: rgbaFromHex(activeLineColor, 0.25),
                      }}
                    >
                      {active.source}
                    </span>
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
