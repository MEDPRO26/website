import {
  cities,
  DEFAULT_CITY_SLUG,
  getCityBySlug,
  type CitySlug,
} from "@/lib/cities";

export const LEGACY_VENTE_PAGE_PATH = "/vente-de-materiel-medical";

export const seoCategoryToCatalogParam: Record<string, string> = {
  "materiel-mobilite": "mobilier-medical",
  "materiel-respiratoire": "respiratoire",
  "materiel-confort": "confort",
  "materiel-diagnostic": "diagnostic",
  "materiel-instruments": "instruments",
};

export function venteCityPath(citySlug: string = DEFAULT_CITY_SLUG): string {
  const city = getCityBySlug(citySlug);
  return city
    ? `/${city.venteSlug}`
    : `/${getCityBySlug(DEFAULT_CITY_SLUG)!.venteSlug}`;
}

export function venteCategoryPath(
  categoryParam: string,
  citySlug: string = DEFAULT_CITY_SLUG
): string {
  if (categoryParam === "all") return venteCityPath(citySlug);
  return `${venteCityPath(citySlug)}/${categoryParam}`;
}

export function venteProductPath(
  productSlug: string,
  citySlug: string = DEFAULT_CITY_SLUG
): string {
  return `${venteCityPath(citySlug)}/produits/${productSlug}`;
}

export function hubCityPath(citySlug: string): string {
  const city = getCityBySlug(citySlug);
  return city
    ? `/${city.hubSlug}`
    : `/${getCityBySlug(DEFAULT_CITY_SLUG)!.hubSlug}`;
}

export function locationCityPath(citySlug: string): string {
  const city = getCityBySlug(citySlug);
  return city
    ? `/${city.locationSlug}`
    : `/${getCityBySlug(DEFAULT_CITY_SLUG)!.locationSlug}`;
}

export function getCityFromVentePath(pathname: string) {
  return cities.find(
    (city) =>
      pathname === `/${city.venteSlug}` ||
      pathname.startsWith(`/${city.venteSlug}/`)
  );
}

export function isVenteCatalogPath(pathname: string): boolean {
  return getCityFromVentePath(pathname) !== undefined;
}

export function getCitySlugFromPath(pathname: string): CitySlug | undefined {
  return getCityFromVentePath(pathname)?.slug;
}

/** @deprecated Use venteCityPath(citySlug) */
export const VENTE_PAGE_PATH = LEGACY_VENTE_PAGE_PATH;
