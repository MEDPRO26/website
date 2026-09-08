import { activeCities, type CitySlug } from "@/lib/cities";
import { careServiceCityPath, careServices } from "@/lib/care-services";
import {
  locationCityPath,
  locationRentalProductPath,
  venteCategoryPath,
  venteCityPath,
  venteProductPath,
} from "@/lib/routes";

export type PillarCityProductLinks = {
  /** e.g. "Voir le lit médicalisé à l’achat dans votre ville :" */
  prompt: string;
  cities: {
    name: string;
    label: string;
    href: string;
  }[];
};

function cityEntries(
  prompt: string,
  hrefForCity: (citySlug: CitySlug) => string
): PillarCityProductLinks {
  return {
    prompt,
    cities: activeCities.map((city) => ({
      name: city.name,
      label: city.name,
      href: hrefForCity(city.slug),
    })),
  };
}

/** City money-page links for a vente product. */
export function venteProductCityLinks(
  productSlug: string,
  prompt: string
): PillarCityProductLinks {
  return cityEntries(prompt, (citySlug) =>
    venteProductPath(productSlug, citySlug)
  );
}

/** City money-page links for a location rental product. */
export function locationProductCityLinks(
  productSlug: string,
  prompt: string
): PillarCityProductLinks {
  return cityEntries(prompt, (citySlug) =>
    locationRentalProductPath(productSlug, citySlug)
  );
}

/** Location catalog hub per city. */
export function locationCatalogCityLinks(
  prompt: string
): PillarCityProductLinks {
  return cityEntries(prompt, (citySlug) => locationCityPath(citySlug));
}

/** Vente catalog hub per city. */
export function venteCatalogCityLinks(prompt: string): PillarCityProductLinks {
  return cityEntries(prompt, (citySlug) => venteCityPath(citySlug));
}

/** Vente category catalog per city (e.g. confort, respiratoire). */
export function venteCategoryCityLinks(
  categoryParam: string,
  prompt: string
): PillarCityProductLinks {
  return cityEntries(prompt, (citySlug) =>
    venteCategoryPath(categoryParam, citySlug)
  );
}

/** Care / services city pages. */
export function careServiceCityLinks(
  serviceSlug: string,
  prompt: string
): PillarCityProductLinks {
  return cityEntries(prompt, (citySlug) =>
    careServiceCityPath(serviceSlug, citySlug)
  );
}

const CARE_SERVICE_BANNER_LABELS: Record<string, string> = {
  "kinesitherapie-a-domicile": "Kinésithérapie",
  "soins-infirmiers-a-domicile": "Soins infirmiers",
  "medecin-a-domicile": "Médecin",
  "aide-soignant-a-domicile": "Aide-soignant",
  "ambulance-maroc": "Ambulance",
};

export type CareServicesBannerService = {
  label: string;
  icon: string;
  cities: { label: string; href: string }[];
};

/** Five care services with city money links for pillar banners. */
export function careServicesBannerServices(): CareServicesBannerService[] {
  return careServices.map((service) => ({
    label: CARE_SERVICE_BANNER_LABELS[service.slug] ?? service.title,
    icon: service.icon,
    cities: activeCities.map((city) => ({
      label: city.name,
      href: careServiceCityPath(service.slug, city.slug),
    })),
  }));
}
