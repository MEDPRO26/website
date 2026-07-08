"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Smartphone } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { LOGO } from "@/lib/brand";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.matchMedia("(max-width: 768px)").matches
  );
}

export function SupplierWebappInstallPrompt({
  supplier,
}: {
  supplier: Doc<"suppliers">;
}) {
  const dismissPrompt = useMutation(api.supplierPortal.dismissPwaInstallPrompt);

  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissing, setDismissing] = useState(false);
  const [installing, setInstalling] = useState(false);

  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
  }, []);

  const shouldShow =
    supplier.pwaInstallPromptDismissed !== true &&
    isMobileDevice() &&
    !isStandaloneMode();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const installEvent = event as BeforeInstallPromptEvent;
      installEvent.preventDefault();
      setDeferredPrompt(installEvent);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!shouldShow) {
      setOpen(false);
      return;
    }

    const timer = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [shouldShow]);

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
    if (!deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") {
        await dismissOnce();
      }
    } finally {
      setInstalling(false);
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setOpen(false);
        }
      }}
    >
      <DialogContent className="gap-5 border-border/60 bg-white p-6 sm:max-w-md">
        <DialogHeader className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft">
              <Image
                src={LOGO.crm}
                alt="SOS Santé"
                width={32}
                height={32}
                className="size-8 object-contain"
              />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg leading-snug">
                Installer l&apos;application
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Ajoutez SOS Santé sur votre téléphone pour ouvrir votre espace
                fournisseur en un clic.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 rounded-2xl bg-muted/50 p-4 text-sm text-foreground">
          {deferredPrompt ? (
            <p>
              Appuyez sur <strong>Installer l&apos;application</strong> pour
              ajouter l&apos;icône sur votre écran d&apos;accueil.
            </p>
          ) : isIos ? (
            <ol className="list-decimal space-y-2 pl-4">
              <li>
                Appuyez sur <strong>Partager</strong> en bas de Safari.
              </li>
              <li>
                Choisissez <strong>Sur l&apos;écran d&apos;accueil</strong>.
              </li>
              <li>
                Confirmez avec <strong>Ajouter</strong>.
              </li>
            </ol>
          ) : (
            <p className="inline-flex items-start gap-2">
              <Smartphone className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>
                Ouvrez le menu de votre navigateur, puis choisissez{" "}
                <strong>Installer l&apos;application</strong> ou{" "}
                <strong>Ajouter à l&apos;écran d&apos;accueil</strong>.
              </span>
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:flex-col">
          {deferredPrompt || isIos ? (
            <Button
              className="w-full rounded-xl"
              onClick={() => void (deferredPrompt ? handleInstall() : undefined)}
              disabled={installing || dismissing}
            >
              {installing ? "Installation…" : "Installer l'application"}
            </Button>
          ) : null}
          <Button
            variant={deferredPrompt || isIos ? "outline" : "default"}
            className="w-full rounded-xl"
            onClick={() => void dismissOnce()}
            disabled={dismissing || installing}
          >
            Plus tard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
