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
import { LOGO } from "@/lib/brand";
import type { useSupplierPwaInstall } from "@/hooks/use-supplier-pwa-install";

type InstallState = ReturnType<typeof useSupplierPwaInstall>;

export function SupplierWebappInstallDialog({
  open,
  onOpenChange,
  deferredPrompt,
  isIos,
  installing,
  dismissing,
  onInstall,
  onDismiss,
  showDismissAction = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deferredPrompt: InstallState["deferredPrompt"];
  isIos: boolean;
  installing: boolean;
  dismissing: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  showDismissAction?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
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
              onClick={() => void (deferredPrompt ? onInstall() : undefined)}
              disabled={installing || dismissing}
            >
              {installing ? "Installation…" : "Installer l'application"}
            </Button>
          ) : null}
          {showDismissAction ? (
            <Button
              variant={deferredPrompt || isIos ? "outline" : "default"}
              className="w-full rounded-xl"
              onClick={() => void onDismiss()}
              disabled={dismissing || installing}
            >
              Plus tard
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={dismissing || installing}
            >
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SupplierWebappInstallPrompt({
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
    dismissing,
    handleInstall,
    dismissOnce,
  } = install;

  if (!dialogOpen) {
    return null;
  }

  return (
    <SupplierWebappInstallDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      deferredPrompt={deferredPrompt}
      isIos={isIos}
      installing={installing}
      dismissing={dismissing}
      onInstall={() => void handleInstall()}
      onDismiss={() => void dismissOnce()}
      showDismissAction={showAutoPopup}
    />
  );
}
