"use client";

import { useEffect, useMemo, useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.matchMedia("(max-width: 768px)").matches
  );
}

export function useSupplierPwaInstall(supplier: Doc<"suppliers"> | null) {
  const dismissPrompt = useMutation(api.supplierPortal.dismissPwaInstallPrompt);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissing, setDismissing] = useState(false);
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
  }, []);

  const canInstall = isMobile && !isStandalone;
  const showAutoPopup =
    canInstall && supplier !== null && supplier.pwaInstallPromptDismissed !== true;
  const showNavInstall =
    canInstall && supplier !== null && supplier.pwaInstallPromptDismissed === true;

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
    if (!showAutoPopup) return;

    const timer = window.setTimeout(() => setDialogOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [showAutoPopup]);

  const dismissOnce = async () => {
    if (dismissing) return;
    setDismissing(true);
    try {
      await dismissPrompt({});
    } finally {
      setDialogOpen(false);
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

  const openInstallDialog = () => setDialogOpen(true);

  return {
    dialogOpen,
    setDialogOpen,
    openInstallDialog,
    showAutoPopup,
    showNavInstall,
    deferredPrompt,
    isIos,
    installing,
    dismissing,
    handleInstall,
    dismissOnce,
    canInstall,
  };
}
