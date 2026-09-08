import { activeCities } from "@/lib/cities";
import {
  AIDE_DOMICILE_PATH,
  CONFORT_MAROC_PATH,
  MATERIEL_PAR_VILLE_PATH,
  MOBILITE_MAROC_PATH,
  RESPIRATOIRE_MAROC_PATH,
  SOINS_DOMICILE_PATH,
  VENTE_MAROC_PATH,
} from "@/lib/national-pillars";
import {
  LIVRAISON_PILLAR_PATH,
  LOCATION_PILLAR_PATH,
} from "@/lib/pillar-pages";
import {
  hubCityPath,
  locationCityPath,
  venteCategoryPath,
  venteCityPath,
} from "@/lib/routes";

export type BlogSupportLink = {
  label: string;
  href: string;
};

/**
 * Cluster support links for blog articles:
 * parent pillar + relevant city money pages.
 */
export function blogClusterSupportLinks(categorySlug: string): {
  pillar: BlogSupportLink;
  relatedPillars: BlogSupportLink[];
  cityMoney: BlogSupportLink[];
} {
  const slug = categorySlug.trim().toLowerCase();

  const byCategory: Record<
    string,
    {
      pillar: BlogSupportLink;
      relatedPillars: BlogSupportLink[];
      moneyKind: "location" | "vente" | "vente-category" | "hub";
      categoryParam?: string;
    }
  > = {
    respiratoire: {
      pillar: {
        label: "Matériel respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
      relatedPillars: [
        { label: "Location de matériel médical au Maroc", href: LOCATION_PILLAR_PATH },
        { label: "Vente de matériel médical au Maroc", href: VENTE_MAROC_PATH },
      ],
      moneyKind: "vente-category",
      categoryParam: "respiratoire",
    },
    mobilite: {
      pillar: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
      relatedPillars: [
        { label: "Location de matériel médical au Maroc", href: LOCATION_PILLAR_PATH },
      ],
      moneyKind: "vente-category",
      categoryParam: "mobilier-medical",
    },
    confort: {
      pillar: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
      relatedPillars: [
        { label: "Location de matériel médical au Maroc", href: LOCATION_PILLAR_PATH },
      ],
      moneyKind: "vente-category",
      categoryParam: "confort",
    },
    location: {
      pillar: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
      relatedPillars: [
        {
          label: "Livraison de matériel médical à domicile",
          href: LIVRAISON_PILLAR_PATH,
        },
      ],
      moneyKind: "location",
    },
    soins: {
      pillar: {
        label: "Soins à domicile au Maroc",
        href: SOINS_DOMICILE_PATH,
      },
      relatedPillars: [
        { label: "Aide à domicile et garde-malade au Maroc", href: AIDE_DOMICILE_PATH },
      ],
      moneyKind: "hub",
    },
    "famille-aidants": {
      pillar: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
      relatedPillars: [
        { label: "Soins à domicile au Maroc", href: SOINS_DOMICILE_PATH },
      ],
      moneyKind: "hub",
    },
    guide: {
      pillar: {
        label: "Matériel médical par ville au Maroc",
        href: MATERIEL_PAR_VILLE_PATH,
      },
      relatedPillars: [
        { label: "Location de matériel médical au Maroc", href: LOCATION_PILLAR_PATH },
        { label: "Vente de matériel médical au Maroc", href: VENTE_MAROC_PATH },
      ],
      moneyKind: "hub",
    },
  };

  const config = byCategory[slug] ?? byCategory.guide;

  const cityMoney: BlogSupportLink[] = activeCities.map((city) => {
    if (config.moneyKind === "location") {
      return {
        label: `Location à ${city.name}`,
        href: locationCityPath(city.slug),
      };
    }
    if (config.moneyKind === "vente-category" && config.categoryParam) {
      const catLabel =
        config.categoryParam === "respiratoire"
          ? "Respiratoire"
          : config.categoryParam === "mobilier-medical"
            ? "Mobilité"
            : config.categoryParam === "confort"
              ? "Confort"
              : "Catalogue";
      return {
        label: `${catLabel} à ${city.name}`,
        href: venteCategoryPath(config.categoryParam, city.slug),
      };
    }
    if (config.moneyKind === "vente") {
      return {
        label: `Vente à ${city.name}`,
        href: venteCityPath(city.slug),
      };
    }
    return {
      label: `Hub ${city.name}`,
      href: hubCityPath(city.slug),
    };
  });

  return {
    pillar: config.pillar,
    relatedPillars: config.relatedPillars,
    cityMoney,
  };
}
