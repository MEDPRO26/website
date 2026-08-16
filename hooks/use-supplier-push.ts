"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { isStandaloneMode } from "@/hooks/use-supplier-pwa-install";

const SW_URL = "/sw.js?v=4";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

async function ensureServiceWorker() {
  const registration = await navigator.serviceWorker.register(SW_URL, {
    scope: "/",
    updateViaCache: "none",
  });

  try {
    await registration.update();
  } catch {
    // ignore update races
  }

  await navigator.serviceWorker.ready;

  // Wait briefly for the new worker to take control (needed after SW upgrades).
  if (!navigator.serviceWorker.controller) {
    await new Promise<void>((resolve) => {
      const onChange = () => {
        navigator.serviceWorker.removeEventListener("controllerchange", onChange);
        resolve();
      };
      navigator.serviceWorker.addEventListener("controllerchange", onChange);
      window.setTimeout(() => {
        navigator.serviceWorker.removeEventListener("controllerchange", onChange);
        resolve();
      }, 2500);
    });
  }

  return registration;
}

export function useSupplierPush(enabled: boolean) {
  const vapidPublicKey = useQuery(
    api.pushSubscriptions.vapidPublicKey,
    enabled ? {} : "skip"
  );
  const status = useQuery(
    api.pushSubscriptions.myStatus,
    enabled ? {} : "skip"
  );
  const saveSubscription = useMutation(api.pushSubscriptions.saveSubscription);
  const removeSubscription = useMutation(
    api.pushSubscriptions.removeSubscription
  );

  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
    );
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  // Keep SW fresh while the partner uses the portal.
  useEffect(() => {
    if (!enabled || !supported) return;
    void ensureServiceWorker().catch(() => undefined);
  }, [enabled, supported]);

  const enablePush = useCallback(async () => {
    if (!supported) {
      toast.error(
        "Les notifications push ne sont pas supportées sur cet appareil."
      );
      return false;
    }
    if (!vapidPublicKey) {
      toast.error(
        "Notifications push non configurées côté serveur. Contactez SOS Santé."
      );
      return false;
    }

    if (isIosDevice() && !isStandaloneMode()) {
      toast.error(
        "Sur iPhone : installez d'abord l'app (Partager → Sur l'écran d'accueil), puis réactivez les notifications depuis l'icône."
      );
      return false;
    }

    setBusy(true);
    try {
      const registration = await ensureServiceWorker();

      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") {
        toast.error(
          "Permission refusée. Activez les notifications dans les réglages du téléphone."
        );
        return false;
      }

      // Refresh subscription against the current SW + VAPID key.
      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        try {
          await existing.unsubscribe();
        } catch {
          // continue and create a fresh one
        }
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error("Abonnement push invalide.");
      }

      await saveSubscription({
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
        userAgent: navigator.userAgent,
      });

      toast.success(
        "Notifications système activées. Elles arriveront même si l'app est fermée."
      );
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible d'activer les notifications."
      );
      return false;
    } finally {
      setBusy(false);
    }
  }, [supported, vapidPublicKey, saveSubscription]);

  const disablePush = useCallback(async () => {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await removeSubscription({ endpoint });
      } else {
        await removeSubscription({});
      }
      toast.success("Notifications désactivées sur cet appareil.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de désactiver les notifications."
      );
    } finally {
      setBusy(false);
    }
  }, [removeSubscription]);

  return {
    supported,
    busy,
    permission,
    subscribed: status?.subscribed ?? false,
    configured: status?.configured ?? Boolean(vapidPublicKey),
    needsHomeScreen: isIosDevice() && !isStandaloneMode(),
    enablePush,
    disablePush,
  };
}
