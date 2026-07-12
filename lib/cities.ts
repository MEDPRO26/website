export const CONTACT_EMAIL = "contact@sossante.ma";
export const WHATSAPP_NUMBER = "212700975888";
export const PHONE_NUMBER = "+212700975888";
export const PHONE_DISPLAY = "07 00 97 58 88";

export type CitySlug = "agadir" | "rabat" | "casablanca" | "marrakech" | "tanger";

export type City = {
  slug: CitySlug;
  name: string;
  brandName: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  /** When true, footer and contact blocks show local phone / address. */
  contactReady: boolean;
  address?: string;
  showAddress?: boolean;
  available: boolean;
  zones: string[];
  deliveryText: string;
  locationSlug: string;
  venteSlug: string;
  hubSlug: string;
};

export type LocationService = {
  slug: string;
  name: string;
  keywords: string[];
};

export const locationServices: LocationService[] = [
  {
    slug: "location-lit-medicalise",
    name: "Location de lit médicalisé",
    keywords: ["location lit médicalisé", "lit médicalisé à domicile"],
  },
  {
    slug: "location-fauteuil-roulant",
    name: "Location de fauteuil roulant",
    keywords: ["location fauteuil roulant", "fauteuil roulant à domicile"],
  },
  {
    slug: "location-deambulateur",
    name: "Location de déambulateur",
    keywords: ["déambulateur", "location déambulateur"],
  },
  {
    slug: "location-bequilles",
    name: "Location de béquilles",
    keywords: ["béquilles", "location béquilles"],
  },
  {
    slug: "location-matelas-anti-escarres",
    name: "Location de matelas anti-escarres",
    keywords: ["matelas anti-escarres", "location matelas anti-escarres"],
  },
  {
    slug: "location-concentrateur-oxygene",
    name: "Location de concentrateur d'oxygène",
    keywords: ["concentrateur d'oxygène", "oxygène à domicile"],
  },
];

export const cities: City[] = [
  {
    slug: "agadir",
    name: "Agadir",
    brandName: "SOS Santé Agadir",
    phone: PHONE_NUMBER,
    phoneDisplay: PHONE_DISPLAY,
    whatsapp: WHATSAPP_NUMBER,
    email: CONTACT_EMAIL,
    contactReady: true,
    address: "Lerac, Avenue Abderrahim Bouabid, 8000, Agadir 80000",
    showAddress: true,
    available: true,
    zones: [
      "Agadir",
      "Dcheira El Jihadia",
      "Inezgane",
      "Aït Melloul",
      "Tikiouine",
      "Bensergao",
      "Anza",
      "Aourir",
      "Tamraght",
      "Taghazout",
    ],
    deliveryText:
      "Livraison et installation incluses à Agadir et environs. Délai sous 24h.",
    locationSlug: "location-materiel-medical-agadir",
    venteSlug: "vente-de-materiel-medical-agadir",
    hubSlug: "location-vente-materiel-medical-agadir",
  },
  {
    slug: "rabat",
    name: "Rabat",
    brandName: "SOS Santé Rabat",
    phone: "",
    phoneDisplay: "",
    whatsapp: "",
    email: CONTACT_EMAIL,
    contactReady: false,
    available: true,
    zones: ["Rabat", "Salé", "Témara", "Hay Riad", "Agdal", "Souissi"],
    deliveryText:
      "Livraison à Rabat, Salé, Temara et environs. Délai sous 24h.",
    locationSlug: "location-materiel-medical-rabat",
    venteSlug: "vente-de-materiel-medical-rabat",
    hubSlug: "location-vente-materiel-medical-rabat",
  },
  {
    slug: "casablanca",
    name: "Casablanca",
    brandName: "SOS Santé Casablanca",
    phone: "",
    phoneDisplay: "",
    whatsapp: "",
    email: CONTACT_EMAIL,
    contactReady: false,
    available: true,
    zones: [
      "Casablanca",
      "Bourgogne",
      "Anfa",
      "Ain Diab",
      "Sidi Maarouf",
      "Maarif",
      "Hay Hassani",
      "Ain Sebaâ",
    ],
    deliveryText:
      "Livraison 24–48h à Casablanca et sa métropole. Frais selon distance.",
    locationSlug: "location-materiel-medical-casablanca",
    venteSlug: "vente-de-materiel-medical-casablanca",
    hubSlug: "location-vente-materiel-medical-casablanca",
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    brandName: "SOS Santé Marrakech",
    phone: "",
    phoneDisplay: "",
    whatsapp: "",
    email: CONTACT_EMAIL,
    contactReady: false,
    available: false,
    zones: ["Marrakech", "Guéliz", "Hivernage"],
    deliveryText:
      "Livraison rapide à Marrakech centre, Guéliz, Hivernage et environs.",
    locationSlug: "location-materiel-medical-marrakech",
    venteSlug: "vente-de-materiel-medical-marrakech",
    hubSlug: "location-vente-materiel-medical-marrakech",
  },
  {
    slug: "tanger",
    name: "Tanger",
    brandName: "SOS Santé Tanger",
    phone: "",
    phoneDisplay: "",
    whatsapp: "",
    email: CONTACT_EMAIL,
    contactReady: false,
    available: false,
    zones: ["Tanger"],
    deliveryText: "Livraison à Tanger et sa région sous 48–72h.",
    locationSlug: "location-materiel-medical-tanger",
    venteSlug: "vente-de-materiel-medical-tanger",
    hubSlug: "location-vente-materiel-medical-tanger",
  },
];

export const DEFAULT_CITY_SLUG: CitySlug = "agadir";

export const activeCities = cities.filter((city) => city.available);

export const comingSoonCities = cities.filter((city) => !city.available);

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

export function isActiveCitySlug(slug: string): slug is CitySlug {
  const city = getCityBySlug(slug);
  return Boolean(city?.available);
}