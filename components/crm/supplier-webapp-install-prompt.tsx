"use client";

import { useEffect, useMemo, useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function SupplierWebappInstallPrompt({
  supplier,
}: {
  supplier: Doc<"suppliers">;
}) {
  const dismissPrompt = useMutation(api.supplierPortal.dismissPwaInstallPrompt);

  // Only show when explicitly set by onboarding completion.
  // (Existing suppliers won't have this field yet.)
  const shouldShow = supplier.pwaInstallPromptDismissed === false;

  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as BeforeInstallPromptEvent;
      // Required by the browser so we can trigger the install ourselves.
      ev.preventDefault();
      setDeferredPrompt(ev);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!shouldShow) return;
    if (hasOpened) return;
    setHasOpened(true);
    setOpen(true);
  }, [shouldShow, hasOpened]);

  const dismissOnce = async () => {
    if (dismissing) return;
    setDismissing(true);
    try {
      await dismissPrompt({});
    } finally {
      setOpen(false);
      setDismissing(false);
    }
  };

  const handleInstall = async () => {
    try {
      if (deferredPrompt) {
        await deferredPrompt.prompt();
        // Wait so we don't dismiss before the browser registers the install attempt.
        await deferredPrompt.userChoice.catch(() => null);
      }
    } finally {
      await dismissOnce();
    }
  };

  const title = "Ajouter SOS Santé à l’écran d’accueil";
  const canDirectInstall = deferredPrompt !== null;
  const installLabel = canDirectInstall ? "Installer" : "Compris";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          void dismissOnce();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogContent className="border-border/60 bg-[#0f172a] text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            Pour ouvrir facilement votre espace fournisseur depuis votre telephone, installez l'icone webapp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {deferredPrompt ? (
            <p className="text-slate-200">
              Appuyez sur <span className="font-semibold">Installer</span> pour que le navigateur ajoute l’application.
            </p>
          ) : isIos ? (
            <div className="space-y-2">
              <p className="text-slate-200">
                Sur iPhone, utilisez l'action <span className="font-semibold">Partager</span> puis <span className="font-semibold">Ajouter a l'ecran d'accueil</span>.
              </p>
              <p className="text-xs text-slate-400">
                Conseil: apres l'ajout, l'icone ouvrira automatiquement la page de votre tableau de bord.
              </p>
            </div>
          ) : (
            <p className="text-slate-200">
              Si votre navigateur ne propose pas “Installer”, vous pouvez toujours ajouter le site à l’écran d’accueil via le menu du navigateur.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => void (canDirectInstall ? handleInstall() : dismissOnce())}
            disabled={false}
            className="rounded-xl"
          >
            {installLabel}
          </Button>
          <Button variant="secondary" onClick={() => void dismissOnce()} className="rounded-xl bg-slate-800 text-white hover:bg-slate-700">
            Plus tard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

