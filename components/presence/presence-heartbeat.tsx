"use client";

import { useMutation } from "convex/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import type { VisitorGeo } from "@/lib/visitor-geo";

const SESSION_KEY_STORAGE = "sos_presence_sk";
const GEO_STORAGE = "sos_visitor_geo";
const HEARTBEAT_INTERVAL_MS = 30_000;

function getOrCreateSessionKey() {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(SESSION_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY_STORAGE, key);
  }
  return key;
}

async function loadVisitorGeo(): Promise<VisitorGeo | null> {
  if (typeof window === "undefined") return null;

  const cached = sessionStorage.getItem(GEO_STORAGE);
  if (cached) {
    try {
      return JSON.parse(cached) as VisitorGeo;
    } catch {
      sessionStorage.removeItem(GEO_STORAGE);
    }
  }

  try {
    const response = await fetch("/api/visitor-geo");
    if (!response.ok) return null;
    const data = (await response.json()) as VisitorGeo;
    sessionStorage.setItem(GEO_STORAGE, JSON.stringify(data));
    return data;
  } catch {
    return null;
  }
}

export function PresenceHeartbeat() {
  const pathname = usePathname();
  const heartbeat = useMutation(api.presence.heartbeat);
  const sessionKeyRef = useRef("");
  const geoRef = useRef<VisitorGeo | null>(null);

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
