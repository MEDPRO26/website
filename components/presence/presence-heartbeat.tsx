"use client";

import { useMutation } from "convex/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";

const SESSION_KEY_STORAGE = "sos_presence_sk";
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

export function PresenceHeartbeat() {
  const pathname = usePathname();
  const heartbeat = useMutation(api.presence.heartbeat);
  const sessionKeyRef = useRef("");

  useEffect(() => {
    sessionKeyRef.current = getOrCreateSessionKey();
  }, []);

  useEffect(() => {
    const send = () => {
      const sessionKey = sessionKeyRef.current;
      if (!sessionKey) return;
      void heartbeat({ sessionKey, path: pathname }).catch(() => {
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
