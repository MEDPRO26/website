export type DeliveryCity = {
  name: string;
  slug: string;
  deliveryText: string;
  active: boolean;
};

export const deliveryCities: DeliveryCity[] = [
  {
    name: "Agadir",
    slug: "location-materiel-medical-agadir",
    deliveryText:
      "Livraison et installation incluses à Agadir et environs. Délai sous 24h.",
    active: true,
  },
  {
    name: "Rabat",
    slug: "location-materiel-medical-rabat",
    deliveryText:
      "Livraison à Rabat, Salé, Temara et environs sous 24–48h.",
    active: true,
  },
  {
    name: "Marrakech",
    slug: "location-materiel-medical-marrakech",
    deliveryText:
      "Livraison rapide à Marrakech centre, Guéliz, Hivernage et environs.",
    active: false,
  },
  {
    name: "Casablanca",
    slug: "location-materiel-medical-casablanca",
    deliveryText:
      "Livraison 24–48h à Casablanca et sa métropole. Frais selon distance.",
    active: false,
  },
  {
    name: "Tanger",
    slug: "location-materiel-medical-tanger",
    deliveryText: "Livraison à Tanger et sa région sous 48–72h.",
    active: false,
  },
];

export const activeDeliveryCities = deliveryCities.filter((c) => c.active);

export const comingSoonDeliveryCities = deliveryCities.filter((c) => !c.active);

export const DEFAULT_DELIVERY_CITY =
  activeDeliveryCities[0]?.name ?? "Agadir";

export const activeDeliveryCityLabel = activeDeliveryCities
  .map((c) => c.name)
  .join(" et ");

export function getCoverageAreas() {
  return {
    active: activeDeliveryCities.map((c) => ({
      name: c.name,
      slug: c.slug,
    })),
    comingSoon: comingSoonDeliveryCities.map((c) => c.name),
  };
}
