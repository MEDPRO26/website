import type { City } from "@/lib/cities";
import {
  activeCities,
  comingSoonCities,
  getActiveCityContacts,
  getCityBySlug,
  type CitySlug,
} from "@/lib/cities";
import { hubCityPath, resolveCityFromPath } from "@/lib/routes";
import {
  CONTACT_EMAIL,
  whatsAppHref,
} from "@/lib/products";
import { cityWhatsAppHref } from "@/lib/whatsapp-lines";
import {
  SITE_NATIONAL_DESCRIPTION,
  SITE_NATIONAL_NAME,
  SITE_URL_DEFAULT,
  SITE_WEBSITE,
} from "@/lib/brand";

export type FooterVariant = "national" | "city";

export type FooterCityContact = {
  name: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref?: string;
};

export type FooterContext = {
  variant: FooterVariant;
  city?: City;
  brandTitle: string;
  description: string;
  zones?: string[];
  phone?: string;
  phoneDisplay?: string;
  phoneHref?: string;
  cityContacts?: FooterCityContact[];
  whatsappHref?: string;
  whatsappContacts?: FooterCityContact[];
  email: string;
  websiteLabel: string;
  websiteHref: string;
  showAddress: boolean;
  address?: string;
  copyrightName: string;
};

export function getFooterContextFromPath(pathname: string): FooterContext {
  const city = resolveCityFromPath(pathname);
  if (city) {
    return buildCityFooterContext(city);
  }
  return buildNationalFooterContext();
}

export function buildNationalFooterContext(): FooterContext {
  const cityContacts = getActiveCityContacts().map((city) => ({
    name: city.name,
    phoneDisplay: city.phoneDisplay,
    phoneHref: `tel:${city.phone}`,
    whatsappHref: cityWhatsAppHref(
      { contactReady: true, whatsapp: city.whatsapp },
      `Bonjour SOS Santé ${city.name}, je souhaite des informations.`,
      "general"
    ),
  }));

  return {
    variant: "national",
    brandTitle: SITE_NATIONAL_NAME,
    description: SITE_NATIONAL_DESCRIPTION,
    cityContacts,
    whatsappContacts: cityContacts,
    whatsappHref: whatsAppHref(undefined, "general"),
    email: CONTACT_EMAIL,
    websiteLabel: SITE_WEBSITE,
    websiteHref: SITE_URL_DEFAULT,
    showAddress: false,
    copyrightName: SITE_NATIONAL_NAME,
  };
}

export function buildCityFooterContext(citySlug: CitySlug): FooterContext;
export function buildCityFooterContext(city: City): FooterContext;
export function buildCityFooterContext(cityOrSlug: City | CitySlug): FooterContext {
  const city =
    typeof cityOrSlug === "string" ? getCityBySlug(cityOrSlug)! : cityOrSlug;
  const landingPath = hubCityPath(city.slug);
  const hasLocalContact = city.contactReady && Boolean(city.phone);

  return {
    variant: "city",
    city,
    brandTitle: `${city.brandName} – Matériel Médical & Aide à Domicile`,
    description: `Location, vente et livraison de matériel médical à domicile à ${city.name} selon disponibilité.`,
    zones: city.zones,
    phone: hasLocalContact ? city.phone : undefined,
    phoneDisplay: hasLocalContact ? city.phoneDisplay : undefined,
    phoneHref: hasLocalContact ? `tel:${city.phone}` : undefined,
    whatsappHref:
      hasLocalContact && city.whatsapp
        ? cityWhatsAppHref(
            city,
            `Bonjour ${city.brandName}, je souhaite des informations.`,
            "general"
          )
        : undefined,
    email: city.email,
    websiteLabel: `${SITE_WEBSITE}${landingPath}`,
    websiteHref: `${SITE_URL_DEFAULT}${landingPath}`,
    showAddress: Boolean(city.contactReady && city.showAddress && city.address),
    address: city.address,
    copyrightName: `${city.brandName} – Matériel Médical & Aide à Domicile`,
  };
}

export const footerCityLinks = [
  ...activeCities.map((city) => ({
    label: city.brandName,
    href: hubCityPath(city.slug),
    available: true,
  })),
  ...comingSoonCities.map((city) => ({
    label: city.brandName,
    href: hubCityPath(city.slug),
    available: false,
  })),
];

export { resolveCityFromPath };
