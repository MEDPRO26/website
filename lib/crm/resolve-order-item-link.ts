import { catalogProducts } from "@/lib/catalog-products";
import { careServices, careServiceCityPath } from "@/lib/care-services";
import {
  cities,
  DEFAULT_CITY_SLUG,
  locationServices,
  type CitySlug,
} from "@/lib/cities";
import {
  locationCityPath,
  venteCityPath,
  venteProductPath,
} from "@/lib/routes";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function citySlugFromName(cityName?: string): CitySlug {
  if (!cityName) {
    return DEFAULT_CITY_SLUG;
  }
  const match = cities.find(
    (city) => normalize(city.name) === normalize(cityName)
  );
  return match?.slug ?? DEFAULT_CITY_SLUG;
}

function findProductByItemName(item: string) {
  const needle = normalize(item);
  return catalogProducts.find((product) => normalize(product.name) === needle);
}

function findProductByItemKeyword(item: string) {
  const needle = normalize(item);
  if (needle.includes("lit") && (needle.includes("médical") || needle.includes("électrique"))) {
    return catalogProducts.find((product) => normalize(product.name).startsWith("lit "));
  }
  if (needle.includes("fauteuil")) {
    return catalogProducts.find((product) => normalize(product.name).includes("fauteuil"));
  }
  if (needle.includes("concentrateur") || needle.includes("oxygène")) {
    return catalogProducts.find((product) =>
      normalize(product.name).includes("concentrateur")
    );
  }
  if (needle.includes("nébuliseur")) {
    return catalogProducts.find((product) =>
      normalize(product.name).includes("nébuliseur")
    );
  }
  if (needle.includes("déambulateur")) {
    return catalogProducts.find((product) =>
      normalize(product.name).includes("déambulateur")
    );
  }
  if (needle.includes("béquill")) {
    return catalogProducts.find((product) =>
      normalize(product.name).includes("béquill")
    );
  }
  if (needle.includes("matelas")) {
    return catalogProducts.find((product) =>
      normalize(product.name).includes("matelas")
    );
  }
  return undefined;
}

function findProductForItem(item: string) {
  return findProductByItemName(item) ?? findProductByItemKeyword(item);
}

function findCareServiceByItemName(item: string) {
  const needle = normalize(item);
  return careServices.find(
    (service) =>
      normalize(service.title) === needle ||
      normalize(service.formLabel) === needle
  );
}

function findLocationServiceByItemName(item: string) {
  const needle = normalize(item);
  return locationServices.find((service) => normalize(service.name) === needle);
}

/** Keyword fallbacks when the form label differs from catalog/SEO names. */
function guessLocationPath(item: string, citySlug: CitySlug): string | null {
  const needle = normalize(item);
  if (needle.includes("lit") && needle.includes("médical")) {
    return locationCityPath(citySlug);
  }
  if (needle.includes("fauteuil")) {
    return locationCityPath(citySlug);
  }
  if (needle.includes("concentrateur") || needle.includes("oxygène")) {
    const product = findProductByItemKeyword(item);
    if (product) {
      return venteProductPath(product.slug, citySlug);
    }
    return locationCityPath(citySlug);
  }
  if (needle.includes("nébuliseur")) {
    const product = findProductByItemKeyword(item);
    if (product) {
      return venteProductPath(product.slug, citySlug);
    }
  }
  if (needle.includes("déambulateur") || needle.includes("béquill")) {
    return locationCityPath(citySlug);
  }
  return null;
}

export function resolveOrderTypeWebsiteLink(
  type: string,
  cityName?: string
): string | null {
  const citySlug = citySlugFromName(cityName);
  const normalized = normalize(type);

  if (normalized.includes("vente")) {
    return venteCityPath(citySlug);
  }
  if (normalized.includes("location")) {
    return locationCityPath(citySlug);
  }
  if (normalized.includes("service") || normalized.includes("domicile")) {
    return "/services";
  }
  if (normalized.includes("général")) {
    return "/contact";
  }

  return null;
}

export function resolveOrderItemWebsiteLink(
  type: string,
  item: string,
  cityName?: string
): string | null {
  const trimmed = item.trim();
  if (!trimmed || trimmed === "—") {
    return null;
  }

  if (/^autre (matériel|service)$/i.test(trimmed)) {
    return null;
  }

  const citySlug = citySlugFromName(cityName);
  const normalizedType = normalize(type);

  const product = findProductForItem(trimmed);
  if (product) {
    return venteProductPath(product.slug, citySlug);
  }

  if (
    normalizedType.includes("service") ||
    normalizedType.includes("domicile")
  ) {
    const service = findCareServiceByItemName(trimmed);
    if (service) {
      return careServiceCityPath(service.slug, citySlug);
    }
    return "/services";
  }

  if (normalizedType.includes("vente")) {
    return venteCityPath(citySlug);
  }

  if (normalizedType.includes("location")) {
    const locationService = findLocationServiceByItemName(trimmed);
    if (locationService) {
      return locationCityPath(citySlug);
    }
    return guessLocationPath(trimmed, citySlug) ?? locationCityPath(citySlug);
  }

  const service = findCareServiceByItemName(trimmed);
  if (service) {
    return careServiceCityPath(service.slug, citySlug);
  }

  return null;
}

export type OrderItemPreview = {
  href: string | null;
  image: string | null;
  alt: string;
};

export function resolveOrderItemPreview(
  type: string,
  item: string,
  cityName?: string
): OrderItemPreview {
  const trimmed = item.trim();
  const href = resolveOrderItemWebsiteLink(type, item, cityName);

  if (!trimmed || trimmed === "—") {
    return { href, image: null, alt: "Matériel" };
  }

  const product = findProductForItem(trimmed);
  if (product) {
    return {
      href,
      image: product.image,
      alt: product.alt,
    };
  }

  const service = findCareServiceByItemName(trimmed);
  if (service) {
    return {
      href,
      image: service.images.hero,
      alt: service.images.alt,
    };
  }

  return { href, image: null, alt: trimmed };
}
