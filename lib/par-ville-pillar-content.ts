import { ABOUT_PATH } from "@/lib/about-content";
import { activeCities, type City } from "@/lib/cities";
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
import { hubCityPath, locationCityPath, venteCityPath } from "@/lib/routes";
import { careServicesPillarSidebar } from "@/lib/pillar-sidebar-products";
import type { PillarProductSidebarConfig } from "@/lib/pillar-sidebar-products";

export type ParVilleLink = {
  label: string;
  href: string;
  description?: string;
};

export type ParVilleCityCard = {
  name: string;
  slug: string;
  summary: string;
  hubHref: string;
  hubLabel: string;
  locationHref: string;
  locationLabel: string;
  venteHref: string;
  venteLabel: string;
  zonesHint?: string;
};

const citySummaries: Record<string, string> = {
  casablanca:
    "Matériel médical à Casablanca : location, vente, livraison à domicile, lit médicalisé, fauteuil roulant, aide à domicile et garde-malade selon disponibilité.",
  agadir:
    "Matériel médical à Agadir : location, livraison à domicile, fauteuil roulant, lit médicalisé, concentrateur d’oxygène et aide à domicile selon disponibilité.",
  rabat:
    "Matériel médical à Rabat : équipements médicaux, aide à domicile, soins à domicile et coordination selon disponibilité (Salé et Témara selon possibilités).",
  marrakech:
    "Matériel médical à Marrakech : location, vente, livraison, lit médicalisé, fauteuil roulant, oxygène à domicile et accompagnement selon disponibilité.",
  tanger:
    "Matériel médical à Tanger : solutions pour personnes âgées, patients à domicile, mobilité réduite, livraison et assistance selon disponibilité.",
};

const cityPriority = [
  "casablanca",
  "agadir",
  "rabat",
  "marrakech",
  "tanger",
] as const;

function buildCityCard(city: City): ParVilleCityCard {
  return {
    name: city.name,
    slug: city.slug,
    summary:
      citySummaries[city.slug] ??
      `Matériel médical à ${city.name} : location, vente, livraison et coordination selon disponibilité.`,
    hubHref: hubCityPath(city.slug),
    hubLabel: `Voir la page ${city.name}`,
    locationHref: locationCityPath(city.slug),
    locationLabel: `Catalogue location ${city.name}`,
    venteHref: venteCityPath(city.slug),
    venteLabel: `Catalogue vente ${city.name}`,
    zonesHint: city.zones.slice(0, 6).join(", "),
  };
}

export type ParVillePillarContent = {
  path: string;
  /** Full-bleed hero image under `/public`. */
  heroImage: string;
  /** Descriptive alt for accessibility and image search. */
  heroImageAlt: string;
  /** Optional title attribute on the hero image. */
  heroImageTitle?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  badge: string;
  h1: string;
  heroTitleSuffix: string;
  heroLead: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  reassurance: string[];
  whatsappMessage: string;
  introTitle: string;
  intro: string[];
  /** Optional sticky sidebar with care services + city links. */
  productSidebar?: PillarProductSidebarConfig;
  /** Optional single 16:9 images under selected H2 sections (spaced apart). */
  sectionImages?: Partial<
    Record<
      "intro" | "cities" | "structure" | "process" | "architecture" | "related",
      {
        src: string;
        alt: string;
        title?: string;
        caption: string;
      }
    >
  >;
  structureTitle: string;
  structureIntro: string;
  structureBlocks: { title: string; paragraphs: string[] }[];
  processTitle: string;
  processSteps: { title: string; text: string }[];
  citiesTitle: string;
  citiesIntro: string;
  cities: ParVilleCityCard[];
  otherCitiesTitle: string;
  otherCitiesParagraphs: string[];
  architectureTitle: string;
  architectureBlocks: {
    title: string;
    paragraphs: string[];
    link?: ParVilleLink;
  }[];
  relatedTitle: string;
  relatedPillars: ParVilleLink[];
  faqs: { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
};

const orderedCities = [
  ...cityPriority
    .map((slug) => activeCities.find((c) => c.slug === slug))
    .filter((c): c is City => Boolean(c)),
  ...activeCities.filter(
    (c) => !(cityPriority as readonly string[]).includes(c.slug)
  ),
];

export const parVillePillarContent: ParVillePillarContent = {
  path: MATERIEL_PAR_VILLE_PATH,
  heroImage: "/pillars/materiel-medical-par-ville-maroc.webp",
  heroImageAlt:
    "Matériel médical par ville au Maroc — trouver location, vente et services à domicile près de chez vous",
  heroImageTitle: "Matériel médical par ville au Maroc | SOS Santé",
  metaTitle: "Matériel médical par ville | SOS Santé Maroc",
  metaDescription:
    "Trouvez du matériel médical selon votre ville au Maroc : Casablanca, Agadir, Rabat, Marrakech, Tanger, Fès et autres villes.",
  keywords: [
    "matériel médical par ville Maroc",
    "matériel médical dans les villes du Maroc",
    "matériel médical Casablanca",
    "matériel médical Agadir",
    "matériel médical Rabat",
    "matériel médical Marrakech",
    "matériel médical Tanger",
    "SOS Santé Maroc villes",
  ],
  badge: "Hub national · Par ville",
  h1: "Matériel médical par ville au Maroc",
  heroTitleSuffix: "dans votre ville au Maroc",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver du matériel médical, une aide à domicile ou un service de coordination selon la ville, le besoin du patient et la disponibilité locale.",
  primaryCtaLabel: "Choisir ma ville",
  secondaryCtaLabel: "Demander la disponibilité sur WhatsApp",
  reassurance: [
    "Service disponible dans plusieurs villes du Maroc selon disponibilité",
    "Location, vente et livraison de matériel médical à domicile",
    "Aide à domicile et garde-malade selon la ville",
    "Coordination avec fournisseurs et prestataires partenaires",
    "Demande rapide par WhatsApp ou téléphone",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je cherche du matériel médical dans ma ville. Ville et besoin : ",
  introTitle: "Trouver du matériel médical dans votre ville",
  intro: [
    "Chaque ville du Maroc a ses propres disponibilités, ses fournisseurs, ses délais et ses besoins. Une famille à Casablanca ne recherche pas toujours la même organisation qu’une famille à Agadir, Rabat, Marrakech ou Tanger. C’est pourquoi SOS Santé Maroc organise ses services autour d’une approche nationale, mais aussi locale.",
    "Cette page vous permet de trouver rapidement le service SOS Santé Maroc disponible dans votre ville : location de matériel médical, vente de matériel médical, livraison à domicile, installation, récupération après location, aide à domicile, garde-malade ou soins à domicile selon disponibilité.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service marocain de coordination, d’orientation et de mise en relation. Notre rôle est d’aider les familles à trouver une solution adaptée selon la ville, le besoin du patient et les disponibilités locales.",
    "Que vous soyez à Casablanca, Agadir, Rabat, Marrakech, Tanger, Fès ou dans une autre ville du Maroc, vous pouvez contacter SOS Santé Maroc pour vérifier les possibilités et être orienté vers une solution adaptée.",
  ],
  productSidebar: careServicesPillarSidebar({
    title: "Services par ville",
    description:
      "Kinésithérapie, soins infirmiers, médecin, aide-soignant et ambulance selon votre ville.",
    catalogLabel: "Hubs par ville",
  }),
  sectionImages: {
    intro: {
      src: "/pillars/par-ville/par-ville-agadir-cote-maroc.webp",
      alt: "Matériel médical par ville au Maroc — vue d’une ville côtière marocaine desservie par SOS Santé",
      title: "Matériel médical par ville au Maroc",
      caption: "Services disponibles selon votre ville au Maroc",
    },
    structure: {
      src: "/pillars/par-ville/par-ville-fauteuil-location-maroc.webp",
      alt: "Fauteuil roulant en location disponible selon la ville au Maroc",
      title: "Location fauteuil roulant par ville",
      caption: "Exemple : fauteuil roulant selon disponibilité locale",
    },
    architecture: {
      src: "/pillars/par-ville/par-ville-cpap-airsense-s10-maroc.webp",
      alt: "Appareil CPAP AirSense S10 disponible selon la ville au Maroc",
      title: "Matériel respiratoire par ville",
      caption: "Exemple : CPAP selon disponibilité locale",
    },
    related: {
      src: "/pillars/par-ville/par-ville-lumis-vni-location-maroc.webp",
      alt: "Appareil Lumis VNI en location selon la ville au Maroc",
      title: "Équipements spécialisés par ville",
      caption: "Exemple : Lumis VNI selon disponibilité locale",
    },
  },
  structureTitle: "Ce que vous trouverez sur une page ville",
  structureIntro:
    "Chaque page locale présente les services disponibles, les équipements principaux et le fonctionnement. Voici ce qu’il faut retenir avant de choisir votre ville.",
  structureBlocks: [
    {
      title: "Services locaux",
      paragraphs: [
        "Location, vente, livraison à domicile, installation selon disponibilité, récupération après location, aide à domicile, garde-malade et soins à domicile selon disponibilité.",
      ],
    },
    {
      title: "Équipements fréquents",
      paragraphs: [
        "Lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, concentrateur d’oxygène, chaise percée, table de lit et accessoires selon stock local.",
      ],
    },
    {
      title: "Zones et quartiers",
      paragraphs: [
        "Chaque page ville mentionne les zones proches et quartiers utiles pour préciser la demande. Indiquez toujours votre quartier lors du contact WhatsApp.",
      ],
    },
    {
      title: "Comment s’orienter",
      paragraphs: [
        "Choisissez d’abord votre ville, puis le service ou le catalogue (location, vente, livraison, aide ou soins). Les pages nationales restent disponibles si vous cherchez une vue d’ensemble avant de préciser votre ville.",
      ],
    },
  ],
  processTitle: "Comment ça marche ?",
  processSteps: [
    {
      title: "Le client contacte SOS Santé Maroc",
      text: "Par WhatsApp, téléphone ou formulaire, en indiquant la ville et le besoin.",
    },
    {
      title: "Indication du besoin local",
      text: "Ville, quartier, matériel ou service recherché, délai souhaité et informations d’accès si besoin.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé vérifie les options auprès de fournisseurs ou prestataires partenaires selon la ville.",
    },
    {
      title: "Proposition d’une solution",
      text: "Une orientation est proposée selon la ville, le matériel et les conditions disponibles.",
    },
    {
      title: "Coordination locale",
      text: "Livraison, installation ou mise en relation est coordonnée si disponible.",
    },
    {
      title: "Suivi",
      text: "SOS Santé reste disponible pour une prolongation, une récupération ou une nouvelle demande.",
    },
  ],
  citiesTitle: "Villes principales",
  citiesIntro:
    "Choisissez votre ville pour accéder au hub local et aux catalogues. Les résumés ci-dessous restent courts : le détail se trouve sur chaque page ville.",
  cities: orderedCities.map(buildCityCard),
  otherCitiesTitle: "Autres villes du Maroc",
  otherCitiesParagraphs: [
    "SOS Santé Maroc peut aussi traiter des demandes à Fès, Meknès, Salé, Témara, Kénitra, Oujda, Tétouan, Mohammedia, El Jadida, Safi, Essaouira, Laâyoune et d’autres villes selon disponibilité.",
    "Autour d’Agadir, les demandes peuvent aussi concerner Dcheira El Jihadia, Inezgane, Aït Melloul, Tikiouine, Bensergao, Anza, Aourir, Tamraght ou Taghazout selon possibilités.",
    "Les mêmes services ne sont pas toujours disponibles partout. Contactez SOS Santé Maroc avec votre ville exacte pour vérifier ce qui est possible.",
  ],
  architectureTitle: "Pages nationales et services liés",
  architectureBlocks: [
    {
      title: "Location au Maroc",
      paragraphs: [
        "Hub national pour louer du matériel médical temporaire, avec liens vers les catalogues villes.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Vente au Maroc",
      paragraphs: [
        "Hub national pour acheter du matériel médical lorsque le besoin est durable.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
    {
      title: "Livraison à domicile",
      paragraphs: [
        "Organisation de la livraison, installation et récupération selon la ville et le matériel.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
  ],
  relatedTitle: "Autres services SOS Santé",
  relatedPillars: [
    {
      label: "Matériel médical respiratoire au Maroc",
      href: RESPIRATOIRE_MAROC_PATH,
    },
    {
      label: "Matériel de mobilité au Maroc",
      href: MOBILITE_MAROC_PATH,
    },
    {
      label: "Matériel de confort médical au Maroc",
      href: CONFORT_MAROC_PATH,
    },
    {
      label: "Aide à domicile et garde-malade au Maroc",
      href: AIDE_DOMICILE_PATH,
    },
    {
      label: "Soins à domicile au Maroc",
      href: SOINS_DOMICILE_PATH,
    },
    {
      label: "À propos de SOS Santé",
      href: ABOUT_PATH,
    },
  ],
  faqs: [
    {
      question: "Dans quelles villes SOS Santé Maroc peut-il aider ?",
      answer:
        "SOS Santé Maroc peut traiter les demandes dans plusieurs villes du Maroc, notamment Casablanca, Agadir, Rabat, Marrakech, Tanger, Fès et d’autres villes selon disponibilité.",
    },
    {
      question: "Peut-on trouver du matériel médical à Casablanca ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à rechercher du matériel médical à Casablanca selon disponibilité : lit médicalisé, fauteuil roulant, concentrateur d’oxygène, déambulateur, aide à domicile ou garde-malade.",
    },
    {
      question: "Peut-on trouver du matériel médical à Agadir ?",
      answer:
        "Oui, SOS Santé Maroc peut aider les familles à Agadir et environs à trouver du matériel médical selon disponibilité : location, vente, livraison, installation et accompagnement à domicile.",
    },
    {
      question: "Les services sont-ils disponibles partout au Maroc ?",
      answer:
        "SOS Santé Maroc traite les demandes partout au Maroc selon la ville, le besoin, le matériel recherché et les disponibilités des fournisseurs ou prestataires partenaires.",
    },
    {
      question: "Peut-on demander une livraison dans sa ville ?",
      answer:
        "Oui, la livraison peut être organisée selon la ville, le type de matériel et la disponibilité. Le client doit indiquer l’adresse, le quartier, le matériel recherché et le délai souhaité.",
    },
    {
      question: "Les mêmes services sont-ils disponibles dans toutes les villes ?",
      answer:
        "Non. Les disponibilités peuvent varier selon la ville, le matériel, les fournisseurs partenaires et les prestataires disponibles. SOS Santé Maroc vérifie chaque demande avant confirmation.",
    },
    {
      question: "Comment demander la disponibilité dans ma ville ?",
      answer:
        "Contactez SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant votre ville, votre quartier, le matériel ou le service recherché et le délai souhaité.",
    },
    {
      question: "SOS Santé Maroc est-il une clinique ou une pharmacie ?",
      answer:
        "Non. SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service de coordination et de mise en relation pour faciliter l’accès au matériel médical et à l’aide à domicile.",
    },
  ],
  ctaTitle: "Trouvez du matériel médical dans votre ville",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier la disponibilité du matériel médical, d’une aide à domicile, d’un garde-malade ou d’un service de coordination dans votre ville. Notre équipe vous aide à rechercher une solution adaptée selon votre localisation, le besoin du patient et les disponibilités locales.",
};
