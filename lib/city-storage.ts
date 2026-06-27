import { DEFAULT_CITY_SLUG, type CitySlug } from "@/lib/cities";

export const CITY_STORAGE_KEY = "sos-sante-selected-city";

export function isCitySlug(value: string): value is CitySlug {
  return ["agadir", "rabat", "casablanca", "marrakech", "tanger"].includes(
    value
  );
}

export function readStoredCitySlug(): CitySlug {
  if (typeof window === "undefined") return DEFAULT_CITY_SLUG;

  try {
    const stored = window.localStorage.getItem(CITY_STORAGE_KEY);
    if (stored && isCitySlug(stored)) return stored;
  } catch {
    // ignore storage errors
  }

  return DEFAULT_CITY_SLUG;
}

export function writeStoredCitySlug(citySlug: CitySlug) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CITY_STORAGE_KEY, citySlug);
  } catch {
    // ignore storage errors
  }
}
