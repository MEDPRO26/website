import type { VisitorGeo } from "@/lib/visitor-geo";
import { detectVisitorDevice } from "@/lib/visitor-device";

export const SESSION_KEY_STORAGE = "sos_presence_sk";
export const GEO_STORAGE = "sos_visitor_geo";

export function getOrCreateSessionKey() {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(SESSION_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY_STORAGE, key);
  }
  return key;
}

export async function loadVisitorGeo(): Promise<VisitorGeo | null> {
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

export function getCachedVisitorGeo(): VisitorGeo | null {
  if (typeof window === "undefined") return null;
  const cached = sessionStorage.getItem(GEO_STORAGE);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as VisitorGeo;
  } catch {
    return null;
  }
}

export function getVisitorDeviceType() {
  return detectVisitorDevice();
}
