import { getCityBySlug, type City, type CitySlug } from "@/lib/cities";

export type CityProductOverlay = {
  /** Short zone list for on-page copy. */
  zonesLabel: string;
  /** City delivery / availability sentence. */
  deliveryNote: string;
  /** How the city is served (local office vs national line). */
  opsNote: string;
  /** Unique vente intro lead (before product sentence). */
  venteLead: string;
  /** Unique location intro lead. */
  locationLead: string;
  /** Extra nuance for vente delivery FAQ. */
  venteDeliveryDetail: string;
  /** Extra nuance for location delivery FAQ. */
  locationDeliveryDetail: string;
};

function zonesLabelFromCity(city: City, max = 4): string {
  const zones = city.zones.filter((z) => !z.toLowerCase().includes("autres"));
  const picked = zones.slice(0, max);
  if (picked.length === 0) return city.name;
  if (picked.length === 1) return picked[0];
  if (picked.length === 2) return `${picked[0]} et ${picked[1]}`;
  return `${picked.slice(0, -1).join(", ")} et ${picked[picked.length - 1]}`;
}

const OVERLAYS: Record<
  CitySlug,
  Omit<CityProductOverlay, "zonesLabel" | "deliveryNote">
> = {
  agadir: {
    opsNote:
      "Demande traitée depuis le local opérationnel SOS Santé Agadir, avec vérification de disponibilité auprès de fournisseurs partenaires.",
    venteLead:
      "À Agadir, SOS Santé prépare l'orientation achat depuis son local : devis, options disponibles et organisation de la suite selon stock.",
    locationLead:
      "À Agadir, SOS Santé coordonne la location depuis son local opérationnel : vérification du matériel disponible, devis et organisation de la livraison selon disponibilité.",
    venteDeliveryDetail:
      "Pour Agadir et communes proches (Inezgane, Aït Melloul, Dcheira, Anza…), la livraison peut être organisée selon le produit et la disponibilité.",
    locationDeliveryDetail:
      "Pour Agadir et environs, la livraison et la récupération en fin de location peuvent être organisées selon disponibilité du matériel et de la zone.",
  },
  casablanca: {
    opsNote:
      "Demande traitée depuis le local opérationnel SOS Santé Casablanca (Boulevard Anoual), avec vérification de disponibilité auprès de fournisseurs partenaires.",
    venteLead:
      "À Casablanca, SOS Santé oriente votre achat depuis son local de la métropole : devis, options disponibles et coordination de la livraison selon stock.",
    locationLead:
      "À Casablanca, SOS Santé coordonne la location depuis son local métropolitain : devis, disponibilité et organisation de la livraison selon votre zone.",
    venteDeliveryDetail:
      "Pour Casablanca et sa métropole (Maarif, Anfa, Sidi Maarouf, Ain Diab…), la livraison peut être organisée selon distance, produit et disponibilité.",
    locationDeliveryDetail:
      "Pour Casablanca et sa métropole, la livraison et la récupération peuvent être organisées selon disponibilité, distance et type de matériel.",
  },
  rabat: {
    opsNote:
      "Demande orientée via le numéro national Casablanca, avec coordination pour Rabat–Salé–Témara selon disponibilité des fournisseurs partenaires.",
    venteLead:
      "À Rabat, SOS Santé aide les familles de Rabat, Salé et Témara à trouver le bon matériel à l'achat : devis et orientation selon disponibilité.",
    locationLead:
      "À Rabat, SOS Santé coordonne la location pour Rabat, Salé et Témara : devis, disponibilité et organisation de la livraison selon votre zone.",
    venteDeliveryDetail:
      "Pour Rabat, Salé, Témara et quartiers comme Hay Riad ou Agdal, la livraison peut être organisée selon disponibilité et zone.",
    locationDeliveryDetail:
      "Pour Rabat–Salé–Témara, la livraison et la récupération en fin de location peuvent être organisées selon disponibilité du matériel.",
  },
  marrakech: {
    opsNote:
      "Demande orientée via le numéro national Casablanca, avec coordination pour Marrakech et environs selon disponibilité des fournisseurs partenaires.",
    venteLead:
      "À Marrakech, SOS Santé oriente votre achat pour Guéliz, Hivernage, Médina et environs : devis et options selon disponibilité.",
    locationLead:
      "À Marrakech, SOS Santé coordonne la location pour le centre, Guéliz, Hivernage et environs : devis et livraison selon disponibilité.",
    venteDeliveryDetail:
      "Pour Marrakech (Guéliz, Hivernage, Médina, Massira…), la livraison peut être organisée selon le produit et la disponibilité.",
    locationDeliveryDetail:
      "Pour Marrakech et environs, la livraison et la récupération peuvent être organisées selon disponibilité du matériel et de la zone.",
  },
  tanger: {
    opsNote:
      "Demande orientée via le numéro national Casablanca, avec coordination pour Tanger et sa région selon disponibilité des fournisseurs partenaires.",
    venteLead:
      "À Tanger, SOS Santé oriente votre achat pour le centre-ville, Malabata, Boukhalef et environs : devis et options selon disponibilité.",
    locationLead:
      "À Tanger, SOS Santé coordonne la location pour le centre et la région : devis, disponibilité et organisation de la livraison selon votre zone.",
    venteDeliveryDetail:
      "Pour Tanger et sa région (Malabata, Boukhalef, Iberia…), la livraison peut être organisée selon distance, produit et disponibilité.",
    locationDeliveryDetail:
      "Pour Tanger et sa région, la livraison et la récupération peuvent être organisées selon disponibilité du matériel et de la zone.",
  },
};

export function getCityProductOverlay(citySlug: CitySlug): CityProductOverlay {
  const city = getCityBySlug(citySlug)!;
  const base = OVERLAYS[citySlug];
  return {
    ...base,
    zonesLabel: zonesLabelFromCity(city),
    deliveryNote: city.deliveryText,
  };
}

export function formatZonesLine(citySlug: CitySlug): string {
  const city = getCityBySlug(citySlug)!;
  const overlay = getCityProductOverlay(citySlug);
  return `Orientation et devis pour ${city.name} et environs (${overlay.zonesLabel}).`;
}
