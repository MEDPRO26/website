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
  /** Full display address (footer / map section). */
  address?: string;
  streetAddress?: string;
  postalCode?: string;
  /** Region / prefecture when useful for schema (e.g. Souss-Massa). */
  addressRegion?: string;
  /** WGS84 coordinates for LocalBusiness geo schema. */
  geo?: { latitude: number; longitude: number };
  showAddress?: boolean;
  /** Google Maps embed URL shown on the city hub page. */
  mapsEmbedSrc?: string;
  /** Schema.org openingHours, e.g. Mo-Su 00:00-23:59 */
  openingHours?: string;
  available: boolean;
  zones: string[];
  deliveryText: string;
  /** Hero image on location city pages (`/location-materiel-medical-*`). */
  locationHeroImage: string;
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
    streetAddress: "Lerac, Avenue Abderrahim Bouabid",
    postalCode: "80000",
    addressRegion: "Souss-Massa",
    geo: { latitude: 30.4202078, longitude: -9.5600878 },
    showAddress: true,
    openingHours: "Mo-Su 00:00-23:59",
    mapsEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220553.1206055184!2d-9.635340723193156!3d30.261520499588634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b703d6cc5793%3A0xb175e7204470420a!2sSOS%20Sant%C3%A9%20Agadir%20-%20Mat%C3%A9riel%20M%C3%A9dical%20%26%20Aide%20%C3%A0%20Domicile!5e0!3m2!1sen!2sma!4v1784373345505!5m2!1sen!2sma",
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
    locationHeroImage: "/sos-sante-hero.webp",
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
    zones: [
      "Hay Riad",
      "Agdal",
      "Souissi",
      "Hassan",
      "Salé",
      "Témara",
      "Et autres environs…",
    ],
    deliveryText:
      "Livraison à Rabat, Salé, Temara et environs. Délai sous 24h.",
    locationHeroImage: "/products/lit-electrique-3-positions.webp",
    locationSlug: "location-materiel-medical-rabat",
    venteSlug: "vente-de-materiel-medical-rabat",
    hubSlug: "location-vente-materiel-medical-rabat",
  },
  {
    slug: "casablanca",
    name: "Casablanca",
    brandName: "SOS Santé Casablanca",
    phone: "+212603135888",
    phoneDisplay: "06 03 13 58 88",
    whatsapp: "212603135888",
    email: CONTACT_EMAIL,
    contactReady: true,
    address: "Bd Anoual, Casablanca 20102",
    streetAddress: "Boulevard Anoual",
    postalCode: "20102",
    addressRegion: "Casablanca-Settat",
    geo: { latitude: 33.5696459, longitude: -7.6235469 },
    showAddress: true,
    openingHours: "Mo-Su 00:00-23:59",
    mapsEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3529804.4800314493!2d-12.11025012025258!3d30.23494657929752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x25e53d47b5f49bd9%3A0xf4c050234874339b!2sSOS%20Sant%C3%A9%20Casablanca%20-%20Mat%C3%A9riel%20M%C3%A9dical%20%26%20Aide%20%C3%A0%20Domicile!5e0!3m2!1sen!2sma!4v1784373574838!5m2!1sen!2sma",
    available: true,
    zones: [
      "Bourgogne",
      "Anfa",
      "Ain Diab",
      "Sidi Maarouf",
      "Maarif",
      "Hay Hassani",
      "Ain Sebaâ",
      "Californie",
      "Et autres environs…",
    ],
    deliveryText:
      "Livraison 24-48h à Casablanca et sa métropole. Frais selon distance.",
    locationHeroImage: "/cities/casablanca-fauteuil-roulant.webp",
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
    zones: [
      "Guéliz",
      "Hivernage",
      "Médina",
      "Sidi Ghanem",
      "Daoudiate",
      "Massira",
    ],
    deliveryText:
      "Livraison rapide à Marrakech centre, Guéliz, Hivernage et environs.",
    locationHeroImage: "/products/fauteuil-roulant-pliable-classique.webp",
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
    zones: [
      "Centre-ville",
      "Malabata",
      "Boukhalef",
      "Iberia",
      "California",
      "Moussadak",
    ],
    deliveryText: "Livraison à Tanger et sa région sous 48-72h.",
    locationHeroImage: "/products/concentrateur-oxygene-5l.webp",
    locationSlug: "location-materiel-medical-tanger",
    venteSlug: "vente-de-materiel-medical-tanger",
    hubSlug: "location-vente-materiel-medical-tanger",
  },
];

export const DEFAULT_CITY_SLUG: CitySlug = "agadir";

export const activeCities = cities.filter((city) => city.available);

export const comingSoonCities = cities.filter((city) => !city.available);

export type CityContact = {
  name: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
};

export function getActiveCityContacts(): CityContact[] {
  return activeCities
    .filter((city) => city.contactReady && city.phone && city.phoneDisplay)
    .map(({ name, phone, phoneDisplay, whatsapp }) => ({
      name,
      phone,
      phoneDisplay,
      whatsapp,
    }));
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

export function isActiveCitySlug(slug: string): slug is CitySlug {
  const city = getCityBySlug(slug);
  return Boolean(city?.available);
}