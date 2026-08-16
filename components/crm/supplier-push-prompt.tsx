"use client";

import { Bell, BellOff, Loader2, Send } from "lucide-react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupplierPush } from "@/hooks/use-supplier-push";

type SupplierPushPromptProps = {
  enabled: boolean;
};

export function SupplierPushPrompt({ enabled }: SupplierPushPromptProps) {
  const push = useSupplierPush(enabled);
  const requestSelfTest = useMutation(api.pushSubscriptions.requestSelfTest);
  const [testing, setTesting] = useState(false);

  if (!enabled || !push.supported || !push.configured) {
    return null;
  }

  const handleTest = async () => {
    setTesting(true);
    try {
      await requestSelfTest({});
      toast.success(
        "Test envoyé. Fermez complètement l'app, attendez 10–20 s, puis regardez la barre de notifications."
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer le test."
      );
    } finally {
      setTesting(false);
    }
  };

  if (push.subscribed) {
    return (
      <Card className="mb-4 space-y-3 border-brand/20 bg-brand-soft/30 p-3">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
            <Bell className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              Notifications système activées
            </p>
            <p className="text-xs text-muted-foreground">
              Pour qu&apos;elles arrivent app fermée : laissez Chrome/l&apos;app
              en batterie &quot;Non restreinte&quot; (Réglages → Apps), et ne
              forcez pas l&apos;arrêt de l&apos;app.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={testing || push.busy}
            onClick={() => void handleTest()}
          >
            {testing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Tester (puis fermer l&apos;app)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={push.busy}
            onClick={() => void push.disablePush()}
          >
            {push.busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <BellOff className="size-4" />
            )}
            Désactiver
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-4 flex items-center gap-3 border-amber-200 bg-amber-50/80 p-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-400 text-white">
        <Bell className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-amber-950">
          Activer les notifications système
        </p>
        <p className="text-xs text-amber-900/80">
          {push.needsHomeScreen
            ? "Sur iPhone : installez d'abord l'app (Partager → Sur l'écran d'accueil), ouvrez-la depuis l'icône, puis activez ici."
            : "Alerte dans la barre du téléphone même si l'app est fermée. Sur Android, autorisez la batterie non restreinte pour Chrome."}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        disabled={push.busy}
        onClick={() => void push.enablePush()}
      >
        {push.busy ? <Loader2 className="size-4 animate-spin" /> : null}
        Activer
      </Button>
    </Card>
  );
}
