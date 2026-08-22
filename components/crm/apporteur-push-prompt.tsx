"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupplierPush } from "@/hooks/use-supplier-push";

/** Same push stack as fournisseurs — subscriptions are scoped to apporteurId. */
export function ApporteurPushPrompt({ enabled }: { enabled: boolean }) {
  const push = useSupplierPush(enabled);

  if (!enabled || !push.supported || !push.configured) {
    return null;
  }

  if (push.subscribed) {
    return (
      <Card className="mb-4 flex items-center gap-3 border-brand/20 bg-brand-soft/30 p-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
          <Bell className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            Notifications système activées
          </p>
          <p className="text-xs text-muted-foreground">
            Vous recevrez les alertes S2MBO même si l&apos;app est fermée.
          </p>
        </div>
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
            : "Recevez les alertes S2MBO (acomptes, messages) même si l'app est fermée."}
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
