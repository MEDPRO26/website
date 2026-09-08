import { ABOUT_PATH } from "@/lib/about-content";
import { activeCities } from "@/lib/cities";
import { careServiceCityPath } from "@/lib/care-services";
import {
  LIVRAISON_PILLAR_PATH,
  LOCATION_PILLAR_PATH,
  type PillarPageContent,
} from "@/lib/pillar-pages";
import {
  hubCityPath,
  locationCityPath,
  venteCategoryPath,
  venteCityPath,
} from "@/lib/routes";

export const VENTE_MAROC_PATH = "/vente-materiel-medical";
export const RESPIRATOIRE_MAROC_PATH = "/materiel-respiratoire-maroc";
export const MOBILITE_MAROC_PATH = "/materiel-mobilite-maroc";
export const CONFORT_MAROC_PATH = "/materiel-confort-maroc";
export const AIDE_DOMICILE_PATH = "/aide-a-domicile";
export const SOINS_DOMICILE_PATH = "/soins-a-domicile";
export const MATERIEL_PAR_VILLE_PATH = "/materiel-medical-par-ville";

export const NATIONAL_PILLAR_PATHS = [
  LOCATION_PILLAR_PATH,
  LIVRAISON_PILLAR_PATH,
  VENTE_MAROC_PATH,
  RESPIRATOIRE_MAROC_PATH,
  MOBILITE_MAROC_PATH,
  CONFORT_MAROC_PATH,
  AIDE_DOMICILE_PATH,
  SOINS_DOMICILE_PATH,
  MATERIEL_PAR_VILLE_PATH,
] as const;

function cityVenteCategoryLinks(categoryParam: string, label: string) {
  return activeCities.map((city) => ({
    label: `${label} — ${city.name}`,
    href: venteCategoryPath(categoryParam, city.slug),
    description: `Catalogue vente ${label.toLowerCase()} à ${city.name}`,
  }));
}

function cityLocationLinks() {
  return activeCities.map((city) => ({
    label: `Location à ${city.name}`,
    href: locationCityPath(city.slug),
    description: `Catalogue location ${city.name}`,
  }));
}

function cityVenteLinks() {
  return activeCities.map((city) => ({
    label: `Vente à ${city.name}`,
    href: venteCityPath(city.slug),
    description: `Catalogue vente ${city.name}`,
  }));
}

function cityHubLinks() {
  return activeCities.map((city) => ({
    label: `SOS Santé ${city.name}`,
    href: hubCityPath(city.slug),
    description: `Hub location, vente et services à ${city.name}`,
  }));
}

function cityAideLinks() {
  return activeCities.map((city) => ({
    label: `Aide-soignant à ${city.name}`,
    href: careServiceCityPath("aide-soignant-a-domicile", city.slug),
    description: `Mise en relation aide à domicile / garde-malade à ${city.name}`,
  }));
}

function citySoinsLinks() {
  const services = [
    { slug: "soins-infirmiers-a-domicile", label: "Soins infirmiers" },
    { slug: "kinesitherapie-a-domicile", label: "Kinésithérapie" },
    { slug: "medecin-a-domicile", label: "Médecin" },
  ] as const;
  return activeCities.flatMap((city) =>
    services.map((service) => ({
      label: `${service.label} — ${city.name}`,
      href: careServiceCityPath(service.slug, city.slug),
      description: `${service.label} à domicile à ${city.name}`,
    }))
  );
}

function categoryMarocPillar(opts: {
  path: string;
  h1: string;
  badge: string;
  categoryParam: string;
  categoryLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  heroLead: string;
  what: {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
  };
}): PillarPageContent {
  return {
    path: opts.path,
    metaTitle: opts.metaTitle,
    metaDescription: opts.metaDescription,
    keywords: opts.keywords,
    badge: opts.badge,
    h1: opts.h1,
    heroLead: opts.heroLead,
    intro: opts.intro,
    sections: [
      opts.what,
      {
        id: "par-ville",
        title: `${opts.categoryLabel} : pages catalogue par ville`,
        paragraphs: [
          `Chaque ville a sa page catégorie vente dédiée. Choisissez votre ville pour voir les produits ${opts.categoryLabel.toLowerCase()} disponibles localement.`,
          "Les pages catégorie produit par ville (ex. Agadir / Respiratoire) restent les pages catalogue. Ce hub national sert d'entrée Maroc et de lien interne.",
        ],
      },
    ],
    useCases: [
      {
        title: "Trouver le catalogue de ma ville",
        description: `Accéder rapidement à la page ${opts.categoryLabel.toLowerCase()} Agadir, Casablanca, Rabat…`,
      },
      {
        title: "Comparer location et vente",
        description:
          "Selon la durée du besoin, un conseiller aide à choisir location ou achat.",
      },
      {
        title: "Livraison à domicile",
        description:
          "Une fois le produit choisi sur la page ville, nous organisons la livraison selon disponibilité.",
      },
      {
        title: "Besoin multi-équipements",
        description:
          "Combiner avec mobilité, confort ou respiratoire via les autres hubs Maroc.",
      },
    ],
    cityLinks: cityVenteCategoryLinks(opts.categoryParam, opts.categoryLabel),
    moneyLinks: [
      ...cityLocationLinks().slice(0, 3),
      { label: "Vente au Maroc", href: VENTE_MAROC_PATH },
      { label: "Location au Maroc", href: LOCATION_PILLAR_PATH },
      { label: "Livraison à domicile", href: LIVRAISON_PILLAR_PATH },
      { label: "Matériel par ville", href: MATERIEL_PAR_VILLE_PATH },
    ],
    blogLinks:
      opts.categoryParam === "respiratoire"
        ? [
            {
              label: "Blog respiratoire",
              href: "/blog/respiratoire",
            },
            {
              label: "Concentrateur à Agadir",
              href: "/blog/respiratoire/concentreur-oxygene-agadir-avantages",
            },
          ]
        : [],
    relatedPillars: [
      { label: "Respiratoire Maroc", href: RESPIRATOIRE_MAROC_PATH },
      { label: "Mobilité Maroc", href: MOBILITE_MAROC_PATH },
      { label: "Confort Maroc", href: CONFORT_MAROC_PATH },
      { label: "Vente Maroc", href: VENTE_MAROC_PATH },
    ].filter((l) => l.href !== opts.path),
    faqs: [
      {
        question: `Où voir les produits ${opts.categoryLabel.toLowerCase()} de ma ville ?`,
        answer: `Utilisez les liens « ${opts.categoryLabel} — [ville] » sur cette page. Chaque lien ouvre le catalogue catégorie de cette ville.`,
      },
      {
        question: `Quelle est la différence avec /materiel-${opts.categoryParam === "mobilier-medical" ? "mobilite" : opts.categoryParam} ?`,
        answer:
          "La page courte /materiel-… est une page catégorie produit (catalogue). Cette page …-maroc est le hub national qui pointe vers chaque page catégorie par ville.",
      },
      {
        question: "Puis-je louer plutôt qu'acheter ?",
        answer:
          "Oui. Consultez aussi les pages location par ville et le hub location Maroc.",
      },
    ],
    ctaTitle: `Besoin de matériel ${opts.categoryLabel.toLowerCase()} ?`,
    ctaText:
      "Indiquez votre ville : nous vous orientons vers le bon catalogue et confirmons disponibilité.",
    whatsappMessage: `Bonjour SOS Santé, je cherche du matériel ${opts.categoryLabel.toLowerCase()} au Maroc. Ville : `,
  };
}
