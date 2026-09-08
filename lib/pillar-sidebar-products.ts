import { activeCities } from "@/lib/cities";
import { careServices } from "@/lib/care-services";
import { getProductBySlug } from "@/lib/products";
import { getLocationRentalProductBySlug } from "@/lib/location-rental-products";
import {
  locationCatalogCityLinks,
  locationProductCityLinks,
  venteCatalogCityLinks,
  venteCategoryCityLinks,
  venteProductCityLinks,
  careServiceCityLinks,
  type PillarCityProductLinks,
} from "@/lib/pillar-city-product-links";
import { hubCityPath } from "@/lib/routes";

export type PillarSidebarProduct = {
  name: string;
  image: string;
  alt: string;
  badge: string;
  cityLinks: PillarCityProductLinks;
};

export type PillarProductSidebarConfig = {
  title: string;
  description?: string;
  catalogLabel: string;
  /** City buttons for the catalog CTA (location hub, vente hub, or category). */
  catalogCityLinks: PillarCityProductLinks;
  items: PillarSidebarProduct[];
};

export function venteSidebarProduct(
  slug: string,
  badge = "Vente"
): PillarSidebarProduct | null {
  const product = getProductBySlug(slug);
  if (!product) return null;
  return {
    name: product.shortName || product.name,
    image: product.image,
    alt: product.alt,
    badge,
    cityLinks: venteProductCityLinks(
      product.slug,
      "Voir à l’achat dans votre ville :"
    ),
  };
}

export function locationSidebarProduct(
  slug: string,
  badge = "Location"
): PillarSidebarProduct | null {
  const product = getLocationRentalProductBySlug(slug);
  if (!product) return null;
  return {
    name: product.shortName || product.name,
    image: product.image,
    alt: product.alt,
    badge,
    cityLinks: locationProductCityLinks(
      product.slug,
      "Voir en location dans votre ville :"
    ),
  };
}

function compact(
  items: Array<PillarSidebarProduct | null>
): PillarSidebarProduct[] {
  return items.filter((item): item is PillarSidebarProduct => item !== null);
}

/** Featured products for the national location pillar. */
export function locationPillarSidebar(): PillarProductSidebarConfig {
  return {
    title: "Exemples en location",
    description:
      "Quelques équipements souvent demandés à louer, selon disponibilité.",
    catalogLabel: "Catalogue location",
    catalogCityLinks: locationCatalogCityLinks(
      "Voir le catalogue location dans votre ville :"
    ),
    items: compact([
      locationSidebarProduct("lit-medicalise-electrique-matelas-location"),
      locationSidebarProduct("fauteuil-roulant-location"),
      locationSidebarProduct("leve-personne-electrique-location"),
      locationSidebarProduct("concentrateur-oxygene-5l-nebuliseur-location"),
      locationSidebarProduct("resmed-airsense-s10-autoset"),
    ]),
  };
}

/** Featured products for the national vente pillar. */
export function ventePillarSidebar(): PillarProductSidebarConfig {
  return {
    title: "Exemples à l’achat",
    description:
      "Sélection de matériel médical disponible à la vente selon stock.",
    catalogLabel: "Catalogue vente",
    catalogCityLinks: venteCatalogCityLinks(
      "Voir le catalogue vente dans votre ville :"
    ),
    items: compact([
      venteSidebarProduct("lit-electrique-3-positions"),
      venteSidebarProduct("fauteuil-roulant-pliable-classique"),
      venteSidebarProduct("deambulateur-pliable-roues"),
      venteSidebarProduct("matelas-anti-escarre-air-compresseur"),
      venteSidebarProduct("concentrateur-oxygene-5l"),
      venteSidebarProduct("bequille-s-m-l"),
    ]),
  };
}

export function respiratoirePillarSidebar(): PillarProductSidebarConfig {
  return {
    title: "Matériel respiratoire",
    description: "Concentrateurs, CPAP et accessoires selon disponibilité.",
    catalogLabel: "Catalogue respiratoire",
    catalogCityLinks: venteCategoryCityLinks(
      "respiratoire",
      "Voir le catalogue respiratoire dans votre ville :"
    ),
    items: compact([
      venteSidebarProduct("concentrateur-oxygene-5l"),
      venteSidebarProduct("concentrateur-oxygene-10l-nebuliseur"),
      venteSidebarProduct("inogen-rove-g6"),
      venteSidebarProduct("resmed-airsense-s11-autoset-cpap"),
      locationSidebarProduct("resmed-airsense-s10-autoset", "Location"),
    ]),
  };
}

export function mobilitePillarSidebar(): PillarProductSidebarConfig {
  return {
    title: "Matériel de mobilité",
    description: "Fauteuils, déambulateurs et aides à la marche.",
    catalogLabel: "Catalogue mobilité",
    catalogCityLinks: venteCategoryCityLinks(
      "mobilier-medical",
      "Voir le catalogue mobilité dans votre ville :"
    ),
    items: compact([
      venteSidebarProduct("fauteuil-roulant-pliable-classique"),
      venteSidebarProduct("fauteuil-roulant-electrique-classique"),
      venteSidebarProduct("deambulateur-pliable-roues"),
      venteSidebarProduct("deambulateur-articule-pliable"),
      venteSidebarProduct("bequille-s-m-l"),
      locationSidebarProduct("fauteuil-roulant-location", "Location"),
    ]),
  };
}

export function confortPillarSidebar(): PillarProductSidebarConfig {
  return {
    title: "Matériel de confort",
    description: "Lits, matelas et équipements pour le maintien à domicile.",
    catalogLabel: "Catalogue confort",
    catalogCityLinks: venteCategoryCityLinks(
      "confort",
      "Voir le catalogue confort dans votre ville :"
    ),
    items: compact([
      venteSidebarProduct("lit-electrique-3-positions"),
      venteSidebarProduct("lit-electrique-3-articulations"),
      venteSidebarProduct("matelas-anti-escarre-air-compresseur"),
      venteSidebarProduct("table-manger"),
      locationSidebarProduct(
        "lit-medicalise-electrique-matelas-location",
        "Location"
      ),
    ]),
  };
}

export function livraisonPillarSidebar(): PillarProductSidebarConfig {
  return {
    title: "Matériel livré à domicile",
    description: "Exemples d’équipements souvent livrés et installés.",
    catalogLabel: "Catalogue location",
    catalogCityLinks: locationCatalogCityLinks(
      "Voir le catalogue location dans votre ville :"
    ),
    items: compact([
      locationSidebarProduct("lit-medicalise-electrique-matelas-location"),
      locationSidebarProduct("fauteuil-roulant-location"),
      locationSidebarProduct("concentrateur-oxygene-5l-nebuliseur-location"),
      venteSidebarProduct("lit-electrique-3-positions", "Vente"),
      venteSidebarProduct("fauteuil-roulant-pliable-classique", "Vente"),
    ]),
  };
}

const CARE_SERVICE_SIDEBAR_LABELS: Record<string, string> = {
  "kinesitherapie-a-domicile": "Kinésithérapie",
  "soins-infirmiers-a-domicile": "Soins infirmiers",
  "medecin-a-domicile": "Médecin",
  "aide-soignant-a-domicile": "Aide-soignant",
  "ambulance-maroc": "Ambulance",
};

function hubCatalogCityLinks(prompt: string): PillarCityProductLinks {
  return {
    prompt,
    cities: activeCities.map((city) => ({
      name: city.name,
      label: city.name,
      href: hubCityPath(city.slug),
    })),
  };
}

export function careServiceSidebarItem(
  serviceSlug: string,
  badge = "Service"
): PillarSidebarProduct | null {
  const service = careServices.find((item) => item.slug === serviceSlug);
  if (!service) return null;
  return {
    name: CARE_SERVICE_SIDEBAR_LABELS[service.slug] ?? service.title,
    image: service.images.hero,
    alt: service.images.alt,
    badge,
    cityLinks: careServiceCityLinks(
      service.slug,
      "Voir dans votre ville :"
    ),
  };
}

/** Five care services for aide / soins / par-ville pillars. */
export function careServicesPillarSidebar(options?: {
  title?: string;
  description?: string;
  catalogLabel?: string;
}): PillarProductSidebarConfig {
  return {
    title: options?.title ?? "Services à domicile",
    description:
      options?.description ??
      "Kinésithérapie, soins infirmiers, médecin, aide-soignant et ambulance selon disponibilité.",
    catalogLabel: options?.catalogLabel ?? "Hubs par ville",
    catalogCityLinks: hubCatalogCityLinks(
      "Voir le hub matériel & services dans votre ville :"
    ),
    items: compact(
      careServices.map((service) => careServiceSidebarItem(service.slug))
    ),
  };
}
