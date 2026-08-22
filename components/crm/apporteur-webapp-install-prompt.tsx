"use client";

import Image from "next/image";
import { Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import type { useApporteurPwaInstall } from "@/hooks/use-apporteur-pwa-install";

type InstallState = ReturnType<typeof useApporteurPwaInstall>;

export function ApporteurWebappInstallPrompt({
  install,
}: {
  install: InstallState;
}) {
  const {
    dialogOpen,
    setDialogOpen,
    showAutoPopup,
    deferredPrompt,
    isIos,
    installing,
    handleInstall,
    dismissOnce,
  } = install;

  if (!dialogOpen) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="gap-5 border-border/60 bg-white p-6 sm:max-w-md">
        <DialogHeader className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border/70">
              <Image
                src={CRM_LOGO}
                alt={CRM_BRAND_NAME}
                width={48}
                height={48}
                className="size-12 object-cover"
              />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg leading-snug">
                Installer l&apos;application
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Ajoutez S2MBO sur votre téléphone pour ouvrir votre espace
                apporteur en un clic.
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
              className="w-full rounded-xl bg-primary text-white hover:bg-primary/90 hover:text-white"
              onClick={() => void (deferredPrompt ? handleInstall() : undefined)}
              disabled={installing}
            >
              {installing ? "Installation…" : "Installer l'application"}
            </Button>
          ) : null}
          {showAutoPopup ? (
            <Button
              variant={deferredPrompt || isIos ? "outline" : "default"}
              className="w-full rounded-xl"
              onClick={dismissOnce}
              disabled={installing}
            >
              Plus tard
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setDialogOpen(false)}
              disabled={installing}
            >
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
