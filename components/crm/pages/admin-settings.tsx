"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { crmWhatsAppWebhookUrl } from "@/lib/whatsapp-lines";
import { defaultChannelColor } from "@/lib/crm/whatsapp-colors";
import { activeCities } from "@/lib/cities";

const PROVIDERS = [
  {
    id: "manual" as const,
    label: "Manuel (WhatsApp Web)",
    desc: "Copier/coller — mode actuel",
  },
  {
    id: "meta" as const,
    label: "Meta WhatsApp Cloud API",
    desc: "Nécessite Phone Number ID + token",
  },
  {
    id: "360messenger" as const,
    label: "360Messenger",
    desc: "API WhatsApp — inbox CRM automatique",
  },
  {
    id: "360dialog" as const,
    label: "360dialog",
    desc: "BSP partenaire Meta",
  },
  {
    id: "disabled" as const,
    label: "Désactivé",
    desc: "Aucune action WhatsApp",
  },
];

export function AdminSettingsPage() {
  const { canQueryAdmin } = useAdminSession();
  const ensureChannels = useMutation(api.whatsappChannels.ensureDefaults);
  const ensureSettings = useMutation(api.platformSettings.ensureDefaults);
  const updateChannel = useMutation(api.whatsappChannels.update);
  const updateProvider = useMutation(api.platformSettings.updateWhatsappProvider);
  const updateGeneral = useMutation(api.platformSettings.updateGeneral);
  const updateNotifications = useMutation(api.platformSettings.updateNotifications);
  const updateSeo = useMutation(api.platformSettings.updateSeo);
  const updateSecurity = useMutation(api.platformSettings.updateSecurity);
  const connect360 = useMutation(api.whatsappMessenger.connectChannel);

  const channels = useQuery(
    api.whatsappChannels.list,
    canQueryAdmin ? {} : "skip"
  );
  const settings = useQuery(
    api.platformSettings.get,
    canQueryAdmin ? {} : "skip"
  );
  const webhookUrl = crmWhatsAppWebhookUrl();

  const [drafts, setDrafts] = useState<
    Record<
      string,
      { label: string; phone: string; city: string; metaPhoneNumberId: string; messenger360ApiKey: string; accentColor: string }
    >
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [generalSaving, setGeneralSaving] = useState(false);
  const [seoSaving, setSeoSaving] = useState(false);

  const [defaultCity, setDefaultCity] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifySupplier, setNotifySupplier] = useState(true);
  const [notifyAccepted, setNotifyAccepted] = useState(true);
  const [notifyComplaint, setNotifyComplaint] = useState(true);
  const [notifyRental, setNotifyRental] = useState(false);
  const [auditEnabled, setAuditEnabled] = useState(true);

  useEffect(() => {
    if (!canQueryAdmin || bootstrapped) {
      return;
    }
    void Promise.all([ensureChannels({}), ensureSettings({})]).finally(() =>
      setBootstrapped(true)
    );
  }, [bootstrapped, canQueryAdmin, ensureChannels, ensureSettings]);

  useEffect(() => {
    if (!channels) {
      return;
    }
    const next: Record<
      string,
      { label: string; phone: string; city: string; metaPhoneNumberId: string; messenger360ApiKey: string; accentColor: string }
    > = {};
    for (const channel of channels) {
      next[channel._id] = {
        label: channel.label,
        phone: channel.phone,
        city: channel.city ?? "",
        metaPhoneNumberId: channel.metaPhoneNumberId ?? "",
        messenger360ApiKey: channel.messenger360ApiKey ?? "",
        accentColor: channel.accentColor ?? defaultChannelColor(channel.slug, channel.sortOrder),
      };
    }
    setDrafts(next);
  }, [channels]);

  useEffect(() => {
    if (!settings) {
      return;
    }
    setDefaultCity(settings.defaultCity);
    setContactEmail(settings.contactEmail);
    setSeoTitle(settings.seoSiteTitle);
    setSeoDescription(settings.seoSiteDescription);
    setNotifyNewOrder(settings.notifyNewOrderEmail);
    setNotifySupplier(settings.notifySupplierResponseEmail);
    setNotifyAccepted(settings.notifyClientAcceptedEmail);
    setNotifyComplaint(settings.notifyComplaintEmail);
    setNotifyRental(settings.notifyRentalEndingEmail);
    setAuditEnabled(settings.auditLogsEnabled);
  }, [settings]);

  const handleSaveGeneral = async () => {
    setGeneralSaving(true);
    try {
      await updateGeneral({ defaultCity, contactEmail });
      toast.success("Paramètres généraux enregistrés.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setGeneralSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotifications({
        notifyNewOrderEmail: notifyNewOrder,
        notifySupplierResponseEmail: notifySupplier,
        notifyClientAcceptedEmail: notifyAccepted,
        notifyComplaintEmail: notifyComplaint,
        notifyRentalEndingEmail: notifyRental,
      });
      toast.success("Préférences notifications enregistrées.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    }
  };

  const handleSaveSeo = async () => {
    setSeoSaving(true);
    try {
      await updateSeo({ seoSiteTitle: seoTitle, seoSiteDescription: seoDescription });
      toast.success("SEO enregistré.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSeoSaving(false);
    }
  };

  const handleAuditToggle = async (enabled: boolean) => {
    setAuditEnabled(enabled);
    try {
      await updateSecurity({ auditLogsEnabled: enabled });
      toast.success(enabled ? "Audit logs activés." : "Audit logs désactivés.");
    } catch (err) {
      setAuditEnabled(!enabled);
      toast.error(err instanceof Error ? err.message : "Erreur.");
    }
  };

  const handleSaveChannel = async (id: Id<"whatsappChannels">) => {
    const draft = drafts[id];
    if (!draft) {
      return;
    }
    setSavingId(id);
    try {
      await updateChannel({
        id,
        label: draft.label,
        phone: draft.phone,
        city: draft.city,
        metaPhoneNumberId: draft.metaPhoneNumberId,
        accentColor: draft.accentColor,
      });
      toast.success("Ligne WhatsApp enregistrée.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSavingId(null);
    }
  };

  const handleConnect360 = async (id: Id<"whatsappChannels">) => {
    const draft = drafts[id];
    if (!draft?.messenger360ApiKey.trim()) {
      toast.error("Collez d'abord la clé API 360Messenger.");
      return;
    }
    if (!draft.phone.trim()) {
      toast.error("Renseignez le numéro WhatsApp de cette ligne (212…).");
      return;
    }
    setConnectingId(id);
    try {
      await updateChannel({
        id,
        label: draft.label,
        phone: draft.phone,
      });
      await connect360({
        channelId: id,
        apiKey: draft.messenger360ApiKey.trim(),
      });
      toast.success("360Messenger connecté — les messages arriveront dans le CRM.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setConnectingId(null);
    }
  };

  const handleSelectProvider = async (
    provider: "manual" | "meta" | "360dialog" | "360messenger" | "disabled"
  ) => {
    try {
      await updateProvider({ whatsappProvider: provider });
      toast.success(
        provider === "manual"
          ? "Mode manuel activé."
          : provider === "disabled"
            ? "WhatsApp désactivé."
            : provider === "360messenger"
              ? "360Messenger sélectionné — connectez une ligne ci-dessous."
              : "Provider enregistré — complétez les identifiants API par ligne."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    }
  };

  const activeProvider = settings?.whatsappProvider ?? "manual";

  return (
    <div>
      <PageHeader
        title="Paramètres"
        description="Configuration plateforme SOS Santé — général, notifications, WhatsApp, SEO."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">Général</h3>
          <div>
            <Label className="mb-1.5 block">Ville par défaut</Label>
            <Input value={defaultCity} onChange={(e) => setDefaultCity(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Email contact</Label>
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <Button disabled={generalSaving} onClick={() => void handleSaveGeneral()}>
            {generalSaving ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
          </Button>
        </Card>

        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">Notifications email staff</h3>
          <p className="text-xs text-muted-foreground">
            Envoie un email aux admins/assistants actifs (nécessite RESEND_API_KEY).
          </p>
          {[
            { label: "Nouvelle demande", value: notifyNewOrder, set: setNotifyNewOrder },
            { label: "Fournisseur a répondu", value: notifySupplier, set: setNotifySupplier },
            { label: "Client a accepté", value: notifyAccepted, set: setNotifyAccepted },
            { label: "Réclamation ouverte", value: notifyComplaint, set: setNotifyComplaint },
            { label: "Location bientôt terminée", value: notifyRental, set: setNotifyRental },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="text-sm">{item.label}</span>
              <Switch
                checked={item.value}
                onCheckedChange={(checked) => {
                  item.set(checked);
                }}
              />
            </div>
          ))}
          <Button onClick={() => void handleSaveNotifications()}>Enregistrer</Button>
        </Card>

        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">Sécurité</h3>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm">Logs d&apos;audit</span>
            <Switch checked={auditEnabled} onCheckedChange={(v) => void handleAuditToggle(v)} />
          </div>
        </Card>

        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">SEO global</h3>
          <div>
            <Label className="mb-1.5 block">Titre site</Label>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Description</Label>
            <Input value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
          </div>
          <Button disabled={seoSaving} onClick={() => void handleSaveSeo()}>
            {seoSaving ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
          </Button>
        </Card>
      </div>

      <div className="mt-4 grid gap-4">
        <Card className="space-y-4 p-5">
          <div>
            <h3 className="font-semibold">Lignes WhatsApp (4 numéros)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Chaque ligne correspond à un numéro WhatsApp. Les messages reçus via
              360Messenger apparaissent dans l&apos;inbox{" "}
              <strong>/admin/conversations</strong>.
            </p>
            {webhookUrl ? (
              <p className="mt-2 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                Webhook CRM (à coller dans 360Messenger si besoin) :{" "}
                <code className="font-mono text-foreground">{webhookUrl}</code>
              </p>
            ) : null}
          </div>

          {channels === undefined ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : (
            <div className="grid gap-3">
              {channels.map((channel) => {
                const draft = drafts[channel._id];
                const is360Active = Boolean(channel.messenger360ConnectedAt);
                return (
                  <div
                    key={channel._id}
                    className="rounded-xl border border-border p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{channel.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {channel.purpose} · {channel.city ?? "—"}
                        </p>
                      </div>
                      <Tag tone={is360Active ? "success" : "warning"}>
                        {is360Active ? "Active" : "Not active"}
                      </Tag>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs">Libellé inbox</Label>
                        <Input
                          className="mt-1.5"
                          value={draft?.label ?? ""}
                          onChange={(e) =>
                            setDrafts((current) => ({
                              ...current,
                              [channel._id]: {
                                label: e.target.value,
                                phone: current[channel._id]?.phone ?? channel.phone,
                                city: current[channel._id]?.city ?? channel.city ?? "",
                                metaPhoneNumberId:
                                  current[channel._id]?.metaPhoneNumberId ??
                                  channel.metaPhoneNumberId ??
                                  "",
                                messenger360ApiKey:
                                  current[channel._id]?.messenger360ApiKey ??
                                  channel.messenger360ApiKey ??
                                  "",
                                accentColor:
                                  current[channel._id]?.accentColor ??
                                  channel.accentColor ??
                                  defaultChannelColor(channel.slug, channel.sortOrder),
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Numéro (format 212…)</Label>
                        <Input
                          className="mt-1.5"
                          placeholder="212700975888"
                          value={draft?.phone ?? ""}
                          onChange={(e) =>
                            setDrafts((current) => ({
                              ...current,
                              [channel._id]: {
                                label: current[channel._id]?.label ?? channel.label,
                                phone: e.target.value,
                                city: current[channel._id]?.city ?? channel.city ?? "",
                                metaPhoneNumberId:
                                  current[channel._id]?.metaPhoneNumberId ??
                                  channel.metaPhoneNumberId ??
                                  "",
                                messenger360ApiKey:
                                  current[channel._id]?.messenger360ApiKey ??
                                  channel.messenger360ApiKey ??
                                  "",
                                accentColor:
                                  current[channel._id]?.accentColor ??
                                  channel.accentColor ??
                                  defaultChannelColor(channel.slug, channel.sortOrder),
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Ville représentée</Label>
                        <Select
                          value={draft?.city || "none"}
                          onValueChange={(value) =>
                            setDrafts((current) => ({
                              ...current,
                              [channel._id]: {
                                label: current[channel._id]?.label ?? channel.label,
                                phone: current[channel._id]?.phone ?? channel.phone,
                                city: value === "none" ? "" : value,
                                metaPhoneNumberId:
                                  current[channel._id]?.metaPhoneNumberId ??
                                  channel.metaPhoneNumberId ??
                                  "",
                                messenger360ApiKey:
                                  current[channel._id]?.messenger360ApiKey ??
                                  channel.messenger360ApiKey ??
                                  "",
                                accentColor:
                                  current[channel._id]?.accentColor ??
                                  channel.accentColor ??
                                  defaultChannelColor(channel.slug, channel.sortOrder),
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Choisir une ville" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Non assignée</SelectItem>
                            {activeCities.map((city) => (
                              <SelectItem key={city.slug} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Les commandes de cette ville ouvriront cette ligne WhatsApp.
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs">Couleur inbox</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <input
                            type="color"
                            value={draft?.accentColor ?? defaultChannelColor(channel.slug, channel.sortOrder)}
                            onChange={(e) =>
                              setDrafts((current) => ({
                                ...current,
                                [channel._id]: {
                                  label: current[channel._id]?.label ?? channel.label,
                                  phone: current[channel._id]?.phone ?? channel.phone,
                                  city: current[channel._id]?.city ?? channel.city ?? "",
                                  metaPhoneNumberId:
                                    current[channel._id]?.metaPhoneNumberId ??
                                    channel.metaPhoneNumberId ??
                                    "",
                                  messenger360ApiKey:
                                    current[channel._id]?.messenger360ApiKey ??
                                    channel.messenger360ApiKey ??
                                    "",
                                  accentColor: e.target.value,
                                },
                              }))
                            }
                            className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-card p-1"
                          />
                          <span className="font-mono text-xs text-muted-foreground">
                            {draft?.accentColor ?? defaultChannelColor(channel.slug, channel.sortOrder)}
                          </span>
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Clé API 360Messenger</Label>
                        <Input
                          className="mt-1.5 font-mono text-xs"
                          type="password"
                          placeholder="Coller la clé depuis le panneau 360Messenger"
                          value={draft?.messenger360ApiKey ?? ""}
                          onChange={(e) =>
                            setDrafts((current) => ({
                              ...current,
                              [channel._id]: {
                                label: current[channel._id]?.label ?? channel.label,
                                phone: current[channel._id]?.phone ?? channel.phone,
                                city: current[channel._id]?.city ?? channel.city ?? "",
                                metaPhoneNumberId:
                                  current[channel._id]?.metaPhoneNumberId ??
                                  channel.metaPhoneNumberId ??
                                  "",
                                messenger360ApiKey: e.target.value,
                                accentColor:
                                  current[channel._id]?.accentColor ??
                                  channel.accentColor ??
                                  defaultChannelColor(channel.slug, channel.sortOrder),
                              },
                            }))
                          }
                        />
                        {channel.messenger360ConnectedAt ? (
                          <p className="mt-1 text-xs text-success">
                            Connecté le{" "}
                            {new Date(channel.messenger360ConnectedAt).toLocaleString("fr-FR")}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Not active — connectez cette ligne avec 360Messenger.
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2 hidden">
                        <Label className="text-xs">
                          Meta Phone Number ID (360dialog / Meta)
                        </Label>
                        <Input
                          className="mt-1.5"
                          placeholder="Optionnel"
                          value={draft?.metaPhoneNumberId ?? ""}
                          onChange={(e) =>
                            setDrafts((current) => ({
                              ...current,
                              [channel._id]: {
                                label: current[channel._id]?.label ?? channel.label,
                                phone: current[channel._id]?.phone ?? channel.phone,
                                city: current[channel._id]?.city ?? channel.city ?? "",
                                metaPhoneNumberId: e.target.value,
                                messenger360ApiKey:
                                  current[channel._id]?.messenger360ApiKey ??
                                  channel.messenger360ApiKey ??
                                  "",
                                accentColor:
                                  current[channel._id]?.accentColor ??
                                  channel.accentColor ??
                                  defaultChannelColor(channel.slug, channel.sortOrder),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>
                        {channel.conversationCount} conversation
                        {channel.conversationCount > 1 ? "s" : ""} ·{" "}
                        {channel.unreadCount} non lu
                        {channel.unreadCount > 1 ? "s" : ""}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={connectingId === channel._id}
                          onClick={() => void handleConnect360(channel._id)}
                        >
                          {connectingId === channel._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Connecter 360Messenger"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          disabled={savingId === channel._id}
                          onClick={() => void handleSaveChannel(channel._id)}
                        >
                          {savingId === channel._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Enregistrer"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">Mode d&apos;envoi WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Mode <strong>360Messenger</strong> : réception automatique dans le CRM et envoi
            depuis l&apos;inbox. Mode manuel : copier/coller + WhatsApp Web.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROVIDERS.map((provider) => {
              const isActive = activeProvider === provider.id;
              const apiReady =
                provider.id === "manual" ||
                provider.id === "disabled" ||
                provider.id === "360messenger";
              return (
                <div
                  key={provider.id}
                  className={`rounded-xl border p-4 transition ${isActive ? "border-brand bg-brand-soft/30" : "border-border"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{provider.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{provider.desc}</p>
                    </div>
                    {isActive ? (
                      <Tag tone="success">
                        <CheckCircle2 className="size-3" /> Actif
                      </Tag>
                    ) : null}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    disabled={!apiReady && provider.id !== activeProvider}
                    onClick={() => void handleSelectProvider(provider.id)}
                  >
                    {apiReady ? "Sélectionner" : "Bientôt disponible"}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
