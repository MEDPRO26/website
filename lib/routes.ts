import {
  cities,
  DEFAULT_CITY_SLUG,
  getCityBySlug,
  type CitySlug,
} from "@/lib/cities";

export const LEGACY_VENTE_PAGE_PATH = "/vente-materiel-medical";

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

/** URL segment for a city product page: `{productSlug}-{citySlug}`. */
export function cityProductUrlSlug(
  productSlug: string,
  citySlug: string = DEFAULT_CITY_SLUG
): string {
  const suffix = `-${citySlug}`;
  if (productSlug.endsWith(suffix)) return productSlug;
  return `${productSlug}${suffix}`;
}

/**
 * Catalog product slug from a city product URL param.
 * Returns null when the param is missing the required `-{city}` suffix.
 */
export function parseCityProductUrlSlug(
  urlSlug: string,
  citySlug: string
): string | null {
  const suffix = `-${citySlug}`;
  if (!urlSlug.endsWith(suffix)) return null;
  const baseSlug = urlSlug.slice(0, -suffix.length);
  return baseSlug.length > 0 ? baseSlug : null;
}

/** @deprecated Prefer cityProductUrlSlug — same format for vente & location. */
export const venteProductUrlSlug = cityProductUrlSlug;

/** @deprecated Prefer parseCityProductUrlSlug. */
export const parseVenteProductUrlSlug = parseCityProductUrlSlug;

export function venteProductPath(
  productSlug: string,
  citySlug: string = DEFAULT_CITY_SLUG
): string {
  return `${venteCityPath(citySlug)}/produits/${cityProductUrlSlug(productSlug, citySlug)}`;
}

/** National product landing page (e.g. /inogen-rove-g6). */
export function nationalProductPath(productSlug: string): string {
  return `/${productSlug}`;
}

/** Rental product detail: `/location-materiel-medical-{city}/produits/{slug}-{city}` */
export function locationRentalProductPath(
  productSlug: string,
  citySlug: string = DEFAULT_CITY_SLUG
): string {
  return `${locationCityPath(citySlug)}/produits/${cityProductUrlSlug(productSlug, citySlug)}`;
}

export function hubCityPath(citySlug: string): string {
  const city = getCityBySlug(citySlug);
  return city ? `/${city.slug}` : `/${DEFAULT_CITY_SLUG}`;
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

export function getCityFromLocationPath(pathname: string) {
  return cities.find(
    (city) =>
      pathname === `/${city.locationSlug}` ||
      pathname.startsWith(`/${city.locationSlug}/`)
  );
}

export function isVenteCatalogPath(pathname: string): boolean {
  return getCityFromVentePath(pathname) !== undefined;
}

export function getCitySlugFromPath(pathname: string): CitySlug | undefined {
  return resolveCityFromPath(pathname)?.slug;
}

/** Detect which city a URL belongs to (for footer NAP, breadcrumbs, etc.). */
export function resolveCityFromPath(pathname: string) {
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/";

  for (const city of cities) {
    if (path === `/${city.slug}` || path.startsWith(`/${city.slug}/`)) {
      return city;
    }
  }

  const venteCity = getCityFromVentePath(path);
  if (venteCity) {
    return venteCity;
  }

  for (const city of cities) {
    if (
      path === `/${city.hubSlug}` ||
      path.startsWith(`/${city.hubSlug}/`) ||
      path === `/${city.locationSlug}` ||
      path.startsWith(`/${city.locationSlug}/`)
    ) {
      return city;
    }

    const citySuffix = `-${city.slug}`;
    if (path.endsWith(citySuffix) || path.includes(`${citySuffix}/`)) {
      return city;
    }
  }

  return undefined;
}

/** @deprecated Use venteCityPath(citySlug) */
export const VENTE_PAGE_PATH = LEGACY_VENTE_PAGE_PATH;
