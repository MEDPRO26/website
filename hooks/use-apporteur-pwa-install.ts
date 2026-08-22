"use client";

import { useEffect, useMemo, useState } from "react";
import {
  isMobileDevice,
  isStandaloneMode,
  type BeforeInstallPromptEvent,
} from "@/hooks/use-supplier-pwa-install";

const DISMISS_KEY = "s2mbo-apporteur-pwa-install-dismissed";

export function useApporteurPwaInstall() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    setIsStandalone(isStandaloneMode());
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const canInstall = isMobile && !isStandalone;
  const showAutoPopup = canInstall && !dismissed;
  const showNavInstall = canInstall && dismissed;

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => undefined);
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
    if (!showAutoPopup) return;
    const timer = window.setTimeout(() => setDialogOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [showAutoPopup]);

  const dismissOnce = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
    setDialogOpen(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") {
        dismissOnce();
      }
    } finally {
      setInstalling(false);
    }
  };

  return {
    dialogOpen,
    setDialogOpen,
    openInstallDialog: () => setDialogOpen(true),
    showAutoPopup,
    showNavInstall,
    deferredPrompt,
    isIos,
    installing,
    dismissing: false,
    handleInstall,
    dismissOnce,
    canInstall,
  };
}
