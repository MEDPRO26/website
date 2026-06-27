export {
  activeCities,
  cities,
  comingSoonCities,
  DEFAULT_CITY_SLUG,
  getCityBySlug,
  type City,
  type CitySlug,
} from "@/lib/cities";

import { activeCities, comingSoonCities } from "@/lib/cities";

/** @deprecated Prefer activeCities from lib/cities */
export const activeDeliveryCities = activeCities.map((city) => ({
  name: city.name,
  slug: city.locationSlug,
  deliveryText: city.deliveryText,
  active: city.available,
}));

/** @deprecated Prefer comingSoonCities from lib/cities */
export const comingSoonDeliveryCities = comingSoonCities.map((city) => ({
  name: city.name,
  slug: city.locationSlug,
  deliveryText: city.deliveryText,
  active: city.available,
}));

/** @deprecated Use activeCities */
export const deliveryCities = [...activeDeliveryCities, ...comingSoonDeliveryCities];

export const DEFAULT_DELIVERY_CITY =
  activeDeliveryCities[0]?.name ?? "Agadir";

export const activeDeliveryCityLabel = activeDeliveryCities
  .map((city) => city.name)
  .join(" et ");

export function getCoverageAreas() {
  return {
    active: activeDeliveryCities.map((city) => ({
      name: city.name,
      slug: city.slug,
    })),
    comingSoon: comingSoonDeliveryCities.map((city) => city.name),
  };
}
