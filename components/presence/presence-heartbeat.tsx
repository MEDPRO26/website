"use client";

import { useMutation } from "convex/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import type { VisitorGeo } from "@/lib/visitor-geo";
import { detectVisitorDevice } from "@/lib/visitor-device";
import {
  getOrCreateSessionKey,
  loadVisitorGeo,
} from "@/lib/visitor-session";

const HEARTBEAT_INTERVAL_MS = 30_000;

export function PresenceHeartbeat() {
  const pathname = usePathname();
  const heartbeat = useMutation(api.presence.heartbeat);
  const sessionKeyRef = useRef("");
  const geoRef = useRef<VisitorGeo | null>(null);
  const deviceTypeRef = useRef(detectVisitorDevice());

  useEffect(() => {
    sessionKeyRef.current = getOrCreateSessionKey();
    void loadVisitorGeo().then((geo) => {
      geoRef.current = geo;
    });
  }, []);

  useEffect(() => {
    const send = () => {
      const sessionKey = sessionKeyRef.current;
      if (!sessionKey) return;

      const geo = geoRef.current;
      void heartbeat({
        sessionKey,
        path: pathname,
        city: geo?.city ?? undefined,
        country: geo?.country ?? undefined,
        countryCode: geo?.countryCode ?? undefined,
        deviceType: deviceTypeRef.current,
      }).catch(() => {
        // Ignore transient network errors; next interval will retry.
      });
    };

    send();
    const intervalId = window.setInterval(send, HEARTBEAT_INTERVAL_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") send();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname, heartbeat]);

  return null;
}
