import { ABOUT_PATH } from "@/lib/about-content";
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
  locationRentalProductPath,
} from "@/lib/routes";
import {
  locationCatalogCityLinks,
  locationProductCityLinks,
  type CareServicesBannerService,
  type PillarCityProductLinks,
} from "@/lib/pillar-city-product-links";
import {
  locationPillarSidebar,
  type PillarProductSidebarConfig,
} from "@/lib/pillar-sidebar-products";

export type LocationPillarLink = {
  label: string;
  href: string;
  description?: string;
};

export type LocationPillarContent = {
  path: string;
  /** Full-bleed hero image under `/public`. Location keeps the brand hero. */
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
  secondaryCtaLabel: string;
  /** Defaults to `#equipements` when omitted. */
  secondaryCtaHref?: string;
  primaryCtaLabel: string;
  reassurance: string[];
  whatsappMessage: string;
  introTitle: string;
  intro: string[];
  /**
   * Optional single 16:9 images placed under selected H2 sections
   * (spaced apart — not a consecutive gallery).
   */
  sectionImages?: Partial<
    Record<
      | "intro"
      | "why"
      | "situations"
      | "equipment"
      | "choose"
      | "process"
      | "duration"
      | "cities"
      | "compare"
      | "whyUs",
      {
        src: string;
        alt: string;
        title?: string;
        caption: string;
      }
    >
  >;
  whyTitle: string;
  whyParagraphs: string[];
  situationsTitle: string;
  situationsIntro: string;
  situations: {
    title: string;
    paragraphs: string[];
    link?: LocationPillarLink;
  }[];
  midCtaTitle: string;
  midCtaText: string;
  /**
   * Optional mid-page block linking to city money pages.
   * When set, replaces the WhatsApp mid CTA.
   */
  /**
   * Optional mid-page block linking to city money pages or care services.
   * When set, replaces the WhatsApp mid CTA.
   */
  cityMoneyBlock?: {
    title: string;
    text: string;
    /** Optional landscape photo for the block (add when ready). */
    image?: {
      src: string;
      alt: string;
      title?: string;
    };
    cities?: {
      name: string;
      href: string;
      label: string;
      icon?: string;
    }[];
    /** When set, shows the five care services with city buttons. */
    services?: CareServicesBannerService[];
  };
  equipmentTitle: string;
  equipmentIntro: string;
  equipment: {
    id: string;
    title: string;
    icon: string;
    paragraphs: string[];
    link: LocationPillarLink;
    /** When set, shows city buttons to product money pages instead of a single link. */
    cityProductLinks?: PillarCityProductLinks;
  }[];
  chooseTitle: string;
  chooseIntro: string;
  chooseBlocks: {
    title: string;
    paragraphs: string[];
    link?: LocationPillarLink;
  }[];
  processTitle: string;
  processIntro: string;
  processSteps: { title: string; text: string }[];
  durationTitle: string;
  durationIntro: string;
  durationBlocks: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
    link?: LocationPillarLink;
  }[];
  citiesTitle: string;
  citiesIntro: string;
  cities: {
    name: string;
    title: string;
    paragraphs: string[];
    hubHref: string;
    hubLabel: string;
    locationHref: string;
    locationLabel: string;
  }[];
  otherCitiesTitle: string;
  otherCitiesParagraphs: string[];
  otherCitiesLink: LocationPillarLink;
  compareTitle: string;
  compareIntro: string;
  compareBlocks: {
    title: string;
    paragraphs: string[];
    link?: LocationPillarLink;
  }[];
  whyUsTitle: string;
  whyUsIntro: string;
  whyUsBlocks: { title: string; text: string }[];
  relatedTitle: string;
  relatedPillars: LocationPillarLink[];
  blogTitle: string;
  blogIntro: string;
  blogLinks: LocationPillarLink[];
  /** Optional product shortcuts shown in a sticky sidebar. */
  productSidebar?: PillarProductSidebarConfig;
  faqs: { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
};

export const locationPillarContent: LocationPillarContent = {
  path: LOCATION_PILLAR_PATH,
  heroImage: "/pillars/location-materiel-medical-maroc-hero.webp",
  heroImageAlt:
    "Location de matériel médical au Maroc avec SOS Santé — équipement médical à domicile pour familles",
  heroImageTitle: "Location de matériel médical au Maroc | SOS Santé",
  metaTitle: "Location matériel médical Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc vous aide à louer du matériel médical au Maroc : lit médicalisé, fauteuil roulant, déambulateur, oxygène et équipements à domicile selon disponibilité.",
  keywords: [
    "location matériel médical Maroc",
    "location de matériel médical au Maroc",
    "louer du matériel médical au Maroc",
    "location matériel médical à domicile Maroc",
    "location lit médicalisé Maroc",
    "location fauteuil roulant Maroc",
    "location déambulateur Maroc",
    "location matelas anti-escarres Maroc",
  ],
  badge: "Service national · Location",
  h1: "Location de matériel médical au Maroc",
  heroTitleSuffix: "pour le maintien à domicile",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver rapidement du matériel médical à louer selon la ville, le besoin du patient et la disponibilité : lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit et concentrateur d’oxygène.",
  secondaryCtaLabel: "Voir le matériel disponible à la location",
  primaryCtaLabel: "Demander la disponibilité sur WhatsApp",
  reassurance: [
    "Location de matériel médical selon disponibilité",
    "Orientation vers l’équipement adapté",
    "Solutions pour personnes âgées, patients en convalescence et mobilité réduite",
    "Coordination avec des fournisseurs partenaires",
    "Service disponible dans plusieurs villes du Maroc",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je souhaite louer du matériel médical au Maroc. Ville et besoin : ",
  introTitle: "Louer du matériel médical à domicile au Maroc",
  intro: [
    "Lorsqu’un proche a besoin d’un équipement médical à domicile, les familles cherchent souvent une solution rapide, pratique et rassurante. Le besoin peut apparaître après une hospitalisation, une opération, une fracture, une perte de mobilité, une période de convalescence ou une situation de dépendance. Dans ces moments, acheter immédiatement un équipement n’est pas toujours nécessaire. La location de matériel médical au Maroc permet d’accéder à une solution adaptée pendant une durée limitée, selon le besoin du patient et la disponibilité du matériel.",
    "SOS Santé Maroc accompagne les familles dans la recherche de matériel médical à louer à domicile. Le service aide à identifier le type d’équipement recherché, vérifier les disponibilités auprès de fournisseurs partenaires, orienter la famille vers une solution adaptée et coordonner la demande selon la ville concernée.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service marocain de coordination, d’orientation et de mise en relation pour faciliter l’accès au matériel médical à domicile. L’objectif est de simplifier la démarche pour les familles qui ont besoin d’un lit médicalisé, d’un fauteuil roulant, d’un déambulateur, de béquilles, d’un matelas anti-escarres, d’un lève-personne, d’une chaise percée, d’une table de lit médicalisée ou d’un concentrateur d’oxygène selon recommandation médicale.",
    "La location peut être une solution souple, surtout quand le besoin est temporaire. Elle permet d’équiper le domicile sans engager immédiatement un achat, tout en gardant la possibilité d’adapter le matériel si la situation évolue. Pour les familles au Maroc, cette approche permet de gagner du temps et de trouver plus facilement une solution disponible dans leur ville.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/location/location-lit-electrique-3-articulations-maroc.webp",
      alt: "Location lit médicalisé électrique à 3 articulations pour maintien à domicile au Maroc",
      title: "Location lit médicalisé électrique au Maroc",
      caption: "Lit médicalisé électrique à 3 articulations",
    },
    equipment: {
      src: "/pillars/location/location-matelas-anti-escarres-maroc.webp",
      alt: "Location matelas anti-escarres à air avec compresseur pour patient à domicile au Maroc",
      title: "Location matelas anti-escarres au Maroc",
      caption: "Matelas anti-escarres à air",
    },
    process: {
      src: "/pillars/location/location-concentrateur-oxygene-5l-maroc.webp",
      alt: "Location concentrateur d’oxygène 5L avec nébuliseur à domicile au Maroc selon avis médical",
      title: "Location concentrateur d’oxygène au Maroc",
      caption: "Concentrateur d’oxygène 5L",
    },
    cities: {
      src: "/pillars/location/location-table-de-lit-maroc.webp",
      alt: "Location table de lit médicalisée pour repas et confort à domicile au Maroc",
      title: "Location table de lit au Maroc",
      caption: "Table de lit médicalisée",
    },
  },
  whyTitle: "Pourquoi louer du matériel médical au Maroc ?",
  whyParagraphs: [
    "La location de matériel médical répond à un besoin très concret : disposer rapidement d’un équipement adapté sans forcément l’acheter. Beaucoup de situations ne nécessitent pas un achat définitif. Le patient peut avoir besoin d’un équipement seulement pendant quelques jours, quelques semaines ou quelques mois.",
    "La location est particulièrement utile lorsque la famille ne connaît pas encore la durée exacte du besoin. Après une opération, par exemple, une personne peut avoir besoin d’un fauteuil roulant, de béquilles ou d’un déambulateur pendant une période courte. Après une hospitalisation, un lit médicalisé ou un matelas anti-escarres peut être nécessaire pour faciliter le retour à domicile. Pour une personne âgée, la location peut aussi permettre de tester une solution avant de décider si un achat est préférable.",
    "La location de matériel médical à domicile au Maroc permet également d’éviter la recherche compliquée auprès de plusieurs fournisseurs. Au lieu de perdre du temps à appeler différents magasins ou prestataires, la famille peut contacter SOS Santé Maroc pour expliquer le besoin. L’équipe oriente ensuite la demande selon la ville, le type de matériel recherché et les disponibilités.",
    "Louer du matériel médical peut aussi être une solution plus flexible. Si le besoin change, la famille peut demander une adaptation, une prolongation ou une autre solution selon les conditions du fournisseur partenaire. Cette flexibilité est importante, car la situation d’un patient peut évoluer rapidement. Enfin, la location limite l’investissement initial et évite de conserver un équipement volumineux une fois le besoin terminé.",
  ],
  situationsTitle: "Dans quelles situations louer du matériel médical ?",
  situationsIntro:
    "Les demandes de location de matériel médical au Maroc concernent le plus souvent le retour à domicile, la convalescence, le maintien à domicile d’une personne âgée, une mobilité réduite ou une personne alitée.",
  situations: [
    {
      title: "Retour à domicile après hospitalisation",
      paragraphs: [
        "Le retour à domicile après une hospitalisation demande souvent une préparation. Le patient peut avoir besoin d’un espace plus adapté, d’un équipement pour se reposer, se déplacer ou être assisté plus facilement par la famille. Un lit médicalisé, un fauteuil roulant, un déambulateur, une chaise percée ou un matelas anti-escarres peuvent devenir nécessaires selon la situation.",
        "La location permet d’organiser une solution sans attendre trop longtemps. SOS Santé Maroc peut aider à vérifier la disponibilité du matériel dans la ville concernée et orienter la famille vers une solution adaptée. Lorsque l’accompagnement humain est aussi nécessaire, la famille peut explorer en complément une aide à domicile.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Convalescence après opération",
      paragraphs: [
        "Après une opération, la mobilité peut être réduite pendant une période temporaire. Certaines personnes ont besoin de béquilles, d’un fauteuil roulant ou d’un déambulateur pour éviter les efforts. D’autres peuvent avoir besoin d’un lit médicalisé ou d’un équipement de confort pendant la récupération.",
        "Dans ce cas, la location est souvent plus logique que l’achat, surtout si le besoin est limité dans le temps. Elle permet de répondre à une situation précise sans conserver du matériel inutile après la convalescence. La durée peut ensuite être prolongée si la récupération prend plus de temps que prévu.",
      ],
    },
    {
      title: "Personne âgée à domicile",
      paragraphs: [
        "Une personne âgée peut avoir besoin d’un équipement médical pour rester à domicile dans de meilleures conditions. Selon le niveau d’autonomie, les besoins peuvent inclure un lit médicalisé, un fauteuil roulant, un déambulateur, une table de lit, une chaise percée ou un matelas anti-escarres.",
        "La location de matériel médical pour personne âgée est utile lorsque la famille veut améliorer le confort et faciliter l’accompagnement quotidien. Elle peut aussi compléter une présence familiale ou une aide à domicile, sans transformer immédiatement le logement en achat définitif d’équipements.",
      ],
      link: {
        label: "Aide à domicile au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Mobilité réduite temporaire ou durable",
      paragraphs: [
        "La mobilité réduite peut être causée par une blessure, une fatigue importante, une pathologie, une opération ou l’âge. Dans ces situations, le matériel de mobilité peut aider la personne à se déplacer plus facilement.",
        "Les équipements souvent demandés sont le fauteuil roulant, le déambulateur, les béquilles ou le lève-personne selon le niveau de dépendance. Pour un besoin temporaire, la location permet d’avoir le matériel pendant la période nécessaire. Pour approfondir les options de mobilité, consultez la page dédiée au matériel de mobilité.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Personne alitée ou dépendante",
      paragraphs: [
        "Lorsqu’une personne reste longtemps au lit, certains équipements deviennent importants pour le confort et l’organisation du quotidien. Le lit médicalisé, le matelas anti-escarres, la table de lit et la chaise percée peuvent aider la famille ou l’accompagnant à mieux gérer la situation à domicile.",
        "Dans les cas plus sensibles, le choix du matériel doit toujours suivre les recommandations d’un professionnel de santé. SOS Santé Maroc peut aider sur la partie recherche et coordination de la location, sans remplacer l’avis médical. Les familles intéressées par le confort à domicile peuvent aussi consulter la page dédiée au matériel de confort.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
  ],
  midCtaTitle: "Besoin d’une solution de location rapidement ?",
  midCtaText:
    "Indiquez votre ville et le matériel recherché : SOS Santé Maroc vérifie la disponibilité et vous oriente vers une solution adaptée.",
  cityMoneyBlock: {
    title: "Louer du matériel médical dans votre ville",
    text: "Choisissez votre ville pour voir le catalogue de location local, vérifier la disponibilité et demander le matériel adapté à domicile.",
    image: {
      src: "/pillars/location/location-villes-catalogue-maroc.webp",
      alt: "Location de matériel médical au Maroc — lit médicalisé et fauteuil roulant livrés à domicile, catalogues par ville",
      title: "Location de matériel médical dans votre ville | SOS Santé",
    },
    cities: [
      {
        name: "Casablanca",
        href: locationCityPath("casablanca"),
        label: "Casablanca",
      },
      {
        name: "Agadir",
        href: locationCityPath("agadir"),
        label: "Agadir",
      },
      {
        name: "Rabat",
        href: locationCityPath("rabat"),
        label: "Rabat",
      },
      {
        name: "Marrakech",
        href: locationCityPath("marrakech"),
        label: "Marrakech",
      },
      {
        name: "Tanger",
        href: locationCityPath("tanger"),
        label: "Tanger",
      },
    ],
  },
  equipmentTitle: "Quels équipements médicaux peut-on louer au Maroc ?",
  equipmentIntro:
    "SOS Santé Maroc aide les familles à trouver différents types de matériel médical à louer selon disponibilité. La liste peut varier selon la ville et les fournisseurs partenaires. Voici les équipements les plus demandés pour le maintien à domicile.",
  equipment: [
    {
      id: "lit-medicalise",
      title: "Location de lit médicalisé au Maroc",
      icon: "bed",
      paragraphs: [
        "Le lit médicalisé est l’un des équipements les plus demandés pour le maintien à domicile. Il peut être utile pour une personne âgée, un patient alité, une personne en convalescence ou une personne ayant besoin d’un meilleur confort au lit.",
        "La location de lit médicalisé au Maroc permet d’installer un équipement adapté à domicile sans acheter directement le lit. Selon les disponibilités, il peut être accompagné d’accessoires comme un matelas, des barrières, une potence, une table de lit ou un matelas anti-escarres.",
        "Le lit médicalisé peut faciliter certaines positions, améliorer le confort du patient et aider la famille dans l’accompagnement quotidien. Cependant, son utilisation doit rester adaptée au besoin réel de la personne. Un conseiller SOS Santé Maroc peut vous aider à préciser le modèle recherché selon la ville.",
      ],
      link: {
        label: "Voir un lit médicalisé en location",
        href: locationRentalProductPath(
          "lit-medicalise-electrique-matelas-location",
          "agadir"
        ),
      },
      cityProductLinks: locationProductCityLinks(
        "lit-medicalise-electrique-matelas-location",
        "Voir le lit médicalisé en location dans votre ville :"
      ),
    },
    {
      id: "fauteuil-roulant",
      title: "Location de fauteuil roulant au Maroc",
      icon: "accessible",
      paragraphs: [
        "Le fauteuil roulant est utile pour les personnes qui ne peuvent pas marcher longtemps ou qui ont besoin d’aide pour se déplacer. Il peut être demandé après une opération, une fracture, une hospitalisation, une fatigue importante ou une perte d’autonomie.",
        "La location de fauteuil roulant au Maroc est une solution pratique lorsque le besoin est temporaire. Elle permet d’avoir rapidement un fauteuil pour les déplacements à domicile, les rendez-vous, les sorties ou la période de récupération.",
        "Selon disponibilité, il peut s’agir d’un fauteuil manuel, pliable ou adapté à l’usage quotidien. SOS Santé Maroc aide la famille à préciser le besoin et à chercher une option disponible dans la ville concernée.",
      ],
      link: {
        label: "Voir un fauteuil roulant en location",
        href: locationRentalProductPath("fauteuil-roulant-location", "agadir"),
      },
      cityProductLinks: locationProductCityLinks(
        "fauteuil-roulant-location",
        "Voir le fauteuil roulant en location dans votre ville :"
      ),
    },
    {
      id: "deambulateur",
      title: "Location de déambulateur au Maroc",
      icon: "elderly",
      paragraphs: [
        "Le déambulateur est destiné aux personnes qui peuvent marcher mais qui ont besoin d’un appui plus stable. Il peut être utile pour les personnes âgées, les patients en rééducation, les personnes fatiguées ou celles qui reprennent progressivement la marche.",
        "La location de déambulateur au Maroc permet de disposer d’une aide à la marche sans achat immédiat. Selon les besoins, la famille peut rechercher un déambulateur simple, pliable ou avec roues, selon disponibilité.",
        "Le déambulateur peut aider à sécuriser les déplacements à domicile, mais le choix dépend toujours de la situation de la personne. Pour explorer davantage les aides à la marche, consultez la page mobilité.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      id: "bequilles",
      title: "Location de béquilles au Maroc",
      icon: "orthopedics",
      paragraphs: [
        "Les béquilles sont souvent utilisées après une blessure, une entorse, une fracture ou une intervention chirurgicale. Elles peuvent aider la personne à se déplacer pendant une période temporaire, en réduisant l’appui sur une jambe.",
        "La location de béquilles au Maroc est particulièrement adaptée aux besoins courts. Au lieu d’acheter une paire de béquilles pour quelques semaines, la famille peut chercher une solution de location selon disponibilité.",
        "SOS Santé Maroc peut aider à trouver des béquilles adaptées selon la ville, la taille souhaitée et la disponibilité.",
      ],
      link: {
        label: "Aides à la marche et mobilité",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      id: "matelas-anti-escarres",
      title: "Location de matelas anti-escarres au Maroc",
      icon: "airline_seat_flat",
      paragraphs: [
        "Le matelas anti-escarres est souvent demandé pour les personnes qui restent longtemps alitées. Il vise à améliorer le confort et à réduire les points de pression, mais son choix doit être adapté à la situation du patient.",
        "La location de matelas anti-escarres au Maroc peut être associée à un lit médicalisé ou demandée séparément. Selon disponibilité, différents modèles peuvent exister. La famille doit toujours tenir compte des recommandations d’un professionnel de santé, surtout pour une personne fragile ou alitée pendant une longue période.",
        "SOS Santé Maroc aide à rechercher un matelas disponible et à coordonner la demande selon la ville.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      id: "leve-personne",
      title: "Location de lève-personne au Maroc",
      icon: "elevator",
      paragraphs: [
        "Le lève-personne est utilisé pour faciliter le transfert d’une personne à mobilité très réduite. Il peut aider à passer du lit au fauteuil ou du fauteuil au lit, selon les conditions d’utilisation.",
        "La location de lève-personne au Maroc peut être utile lorsque la famille accompagne une personne dépendante à domicile. C’est un équipement qui doit être choisi avec prudence, en tenant compte de l’espace, du niveau de dépendance et des capacités de l’aidant.",
        "SOS Santé Maroc peut aider à vérifier la disponibilité d’un lève-personne dans la ville concernée et à préciser les conditions d’utilisation pratiques.",
      ],
      link: {
        label: "Voir un lève-personne en location",
        href: locationRentalProductPath(
          "leve-personne-electrique-location",
          "agadir"
        ),
      },
      cityProductLinks: locationProductCityLinks(
        "leve-personne-electrique-location",
        "Voir le lève-personne en location dans votre ville :"
      ),
    },
    {
      id: "concentrateur-oxygene",
      title: "Location de concentrateur d’oxygène au Maroc",
      icon: "air",
      paragraphs: [
        "Le concentrateur d’oxygène est un équipement respiratoire qui doit être utilisé selon indication et recommandations médicales. La famille ne doit pas choisir seule le débit, la durée d’utilisation ou le modèle. L’avis d’un professionnel de santé est essentiel.",
        "La location de concentrateur d’oxygène au Maroc peut être demandée lorsque le besoin a été identifié par un professionnel. SOS Santé Maroc peut aider à trouver un appareil disponible, mais ne remplace pas le médecin et ne donne pas de prescription.",
        "Pour un contenu plus détaillé sur les équipements respiratoires, consultez la page dédiée au matériel médical respiratoire au Maroc.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
    {
      id: "chaise-percee",
      title: "Location de chaise percée au Maroc",
      icon: "chair_alt",
      paragraphs: [
        "La chaise percée peut être utile pour les personnes qui ont des difficultés à se déplacer jusqu’aux toilettes. Elle est souvent demandée pour les personnes âgées, dépendantes, alitées ou en convalescence.",
        "La location de chaise percée au Maroc permet d’avoir une solution pratique à domicile pendant une période temporaire. SOS Santé Maroc peut aider à vérifier la disponibilité selon la ville et à l’associer éventuellement à d’autres équipements de confort.",
      ],
      link: {
        label: "Catalogue location",
        href: locationCityPath("agadir"),
      },
      cityProductLinks: locationCatalogCityLinks(
        "Voir le catalogue location dans votre ville :"
      ),
    },
    {
      id: "table-de-lit",
      title: "Location de table de lit médicalisée au Maroc",
      icon: "table_restaurant",
      paragraphs: [
        "La table de lit médicalisée facilite les repas, la lecture, l’écriture ou certaines activités quotidiennes pour une personne installée au lit. Elle peut accompagner un lit médicalisé ou être louée séparément.",
        "La location de table de lit médicalisée au Maroc est utile pour améliorer le confort du patient à domicile. SOS Santé Maroc aide à trouver ce type d’accessoire selon disponibilité, souvent dans le cadre d’une installation de chambre médicalisée temporaire.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
  ],
  chooseTitle: "Comment choisir le bon matériel médical à louer ?",
  chooseIntro:
    "Le choix du matériel dépend de plusieurs éléments : la situation du patient, son niveau de mobilité, la durée prévue, l’espace disponible à domicile, la présence d’un aidant et les recommandations éventuelles d’un professionnel de santé. SOS Santé Maroc aide à clarifier ces points pour orienter la demande, sans poser de diagnostic.",
  chooseBlocks: [
    {
      title: "Pour une personne qui ne peut pas rester longtemps debout",
      paragraphs: [
        "Un fauteuil roulant, un déambulateur ou des béquilles peuvent être envisagés selon le niveau d’autonomie. Si la personne peut marcher avec appui, un déambulateur peut parfois suffire. Si elle ne peut pas marcher ou se fatigue rapidement, un fauteuil roulant peut être plus adapté.",
        "Précisez aussi si le matériel servira surtout à l’intérieur, pour des sorties, ou les deux : cela aide à vérifier une option disponible dans votre ville.",
      ],
    },
    {
      title: "Pour une personne alitée",
      paragraphs: [
        "Les équipements les plus fréquents sont le lit médicalisé, le matelas anti-escarres, la table de lit et parfois la chaise percée. Si la personne a besoin d’aide pour les transferts, un lève-personne peut être demandé selon disponibilité.",
        "Pensez également à l’accès au logement (escalier, ascenseur, largeur de porte) : un lit médicalisé nécessite souvent une préparation logistique minimale.",
      ],
    },
    {
      title: "Pour une personne âgée dépendante",
      paragraphs: [
        "La solution peut combiner plusieurs équipements : lit médicalisé, fauteuil roulant, déambulateur, chaise percée et matelas anti-escarres. L’objectif est d’améliorer le confort quotidien tout en restant réaliste sur l’espace et l’accompagnement disponible.",
        "La famille peut aussi avoir besoin d’aide humaine. Ce sujet est traité sur la page dédiée à l’aide à domicile et garde-malade au Maroc.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Pour un besoin respiratoire",
      paragraphs: [
        "Le concentrateur d’oxygène et les équipements respiratoires doivent être abordés avec prudence. Le choix doit suivre les recommandations médicales. SOS Santé Maroc peut aider à rechercher une disponibilité, mais ne prescrit pas et ne règle pas les paramètres médicaux.",
        "Le contenu détaillé sur ce sujet se trouve sur la page Matériel médical respiratoire au Maroc.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc pour la location ?",
  processIntro:
    "Le parcours est conçu pour rester simple pour la famille. L’objectif est de clarifier le besoin, vérifier la disponibilité et coordonner la demande avec des fournisseurs partenaires selon la ville.",
  processSteps: [
    {
      title: "La famille envoie sa demande",
      text: "Le client contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Il indique la ville, le matériel recherché, la durée estimée, l’adresse et les informations pratiques nécessaires.",
    },
    {
      title: "SOS Santé Maroc clarifie le besoin",
      text: "L’équipe pose quelques questions simples pour comprendre la situation : type d’équipement, durée, urgence, étage, accès au logement, besoin d’installation ou de récupération. Cette étape sert à orienter la demande, pas à faire un diagnostic médical.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc vérifie la disponibilité du matériel auprès de fournisseurs partenaires selon la ville concernée. Les conditions peuvent varier selon le matériel, la période et la localisation.",
    },
    {
      title: "Proposition d’une solution",
      text: "Lorsque la disponibilité est confirmée, SOS Santé Maroc propose une solution adaptée : type de matériel, durée de location, conditions, possibilité de livraison ou d’installation si disponible.",
    },
    {
      title: "Coordination de la demande",
      text: "SOS Santé Maroc coordonne la demande entre la famille et le fournisseur partenaire afin de simplifier le processus et limiter les allers-retours.",
    },
    {
      title: "Suivi après la location",
      text: "Selon le besoin, SOS Santé Maroc peut aider pour une prolongation, une récupération du matériel ou une nouvelle demande si la situation évolue.",
    },
  ],
  durationTitle: "Location courte durée ou longue durée : que choisir ?",
  durationIntro:
    "La durée dépend du parcours du patient, de la récupération attendue et du niveau d’autonomie. Voici comment situer rapidement votre besoin.",
  durationBlocks: [
    {
      title: "Location courte durée",
      paragraphs: [
        "La location courte durée peut convenir après une blessure, une opération ou une hospitalisation. Elle est adaptée lorsque le besoin est limité à quelques jours ou quelques semaines.",
      ],
      bullets: [
        "Béquilles après blessure",
        "Fauteuil roulant temporaire",
        "Lit médicalisé après opération",
        "Déambulateur pendant la reprise de marche",
      ],
    },
    {
      title: "Location moyenne durée",
      paragraphs: [
        "La location moyenne durée peut correspondre à une période de convalescence plus longue, à une rééducation ou à une situation où l’autonomie revient progressivement. Elle permet de garder de la souplesse si la durée exacte n’est pas encore connue.",
        "Dans ce cas, SOS Santé Maroc aide à confirmer la disponibilité pour la période estimée et à anticiper une éventuelle prolongation.",
      ],
    },
    {
      title: "Location longue durée",
      paragraphs: [
        "La location longue durée peut être utile pour une personne âgée, dépendante ou alitée pendant plusieurs mois. Dans certains cas, la famille peut aussi comparer location et achat.",
        "Si le besoin devient permanent, il peut être pertinent d’explorer la vente de matériel médical au Maroc. Un conseiller peut aider à situer les deux options selon le budget, la durée et la logistique.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
  ],
  citiesTitle: "Location de matériel médical dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc traite les demandes de location de matériel médical dans plusieurs villes du Maroc selon disponibilité. Les pages villes précisent le catalogue local, les délais et les options de coordination.",
  cities: [
    {
      name: "Casablanca",
      title: "Location de matériel médical à Casablanca",
      paragraphs: [
        "À Casablanca, les familles recherchent souvent du matériel médical à louer pour un proche à domicile : lit médicalisé, fauteuil roulant, déambulateur, matelas anti-escarres ou concentrateur d’oxygène selon recommandation médicale. SOS Santé Maroc aide à vérifier la disponibilité selon les quartiers et les fournisseurs partenaires.",
        "Indiquez votre quartier et le matériel recherché pour accélérer la confirmation. Casablanca dispose d’un hub local et d’un catalogue de location dédié.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: locationCityPath("casablanca"),
      locationLabel: "Catalogue location Casablanca",
    },
    {
      name: "Agadir",
      title: "Location de matériel médical à Agadir",
      paragraphs: [
        "À Agadir, la location de matériel médical peut répondre aux besoins des personnes âgées, des patients en convalescence ou des personnes à mobilité réduite. SOS Santé Maroc accompagne les familles pour trouver une solution adaptée selon disponibilité.",
        "Agadir est également une base opérationnelle importante pour la préparation et l’organisation du matériel. Consultez le hub ville et le catalogue location pour voir les produits les plus demandés.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: locationCityPath("agadir"),
      locationLabel: "Catalogue location Agadir",
    },
    {
      name: "Marrakech",
      title: "Location de matériel médical à Marrakech",
      paragraphs: [
        "À Marrakech, les besoins peuvent concerner un retour à domicile, une assistance temporaire ou un maintien à domicile. SOS Santé Maroc peut aider à rechercher un lit médicalisé, un fauteuil roulant ou d’autres équipements disponibles selon le besoin.",
        "La disponibilité varie selon le matériel et la période : une demande claire avec la ville, le quartier et la durée estimée facilite la réponse.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: locationCityPath("marrakech"),
      locationLabel: "Catalogue location Marrakech",
    },
    {
      name: "Rabat",
      title: "Location de matériel médical à Rabat",
      paragraphs: [
        "À Rabat, SOS Santé Maroc peut accompagner les familles dans la recherche de matériel médical à louer, notamment pour les personnes âgées ou les patients en convalescence. La disponibilité dépend du matériel demandé et des partenaires locaux.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité. Précisez toujours la commune et le type d’équipement.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: locationCityPath("rabat"),
      locationLabel: "Catalogue location Rabat",
    },
    {
      name: "Tanger",
      title: "Location de matériel médical à Tanger",
      paragraphs: [
        "À Tanger, la location de matériel médical peut aider les familles à organiser rapidement le maintien à domicile. SOS Santé Maroc peut orienter vers des solutions de location selon disponibilité.",
        "Comme pour les autres villes, la confirmation dépend du stock partenaire, du délai souhaité et du type d’équipement demandé.",
      ],
      hubHref: hubCityPath("tanger"),
      hubLabel: "Matériel médical Tanger",
      locationHref: locationCityPath("tanger"),
      locationLabel: "Catalogue location Tanger",
    },
  ],
  otherCitiesTitle: "Autres villes du Maroc",
  otherCitiesParagraphs: [
    "SOS Santé Maroc peut aussi traiter des demandes à Fès, Meknès, Salé, Témara, Kénitra, Oujda, Tétouan, Mohammedia, El Jadida, Safi, Essaouira, Laâyoune et d’autres villes selon disponibilité.",
    "Pour une vue d’ensemble des pages locales, consultez le hub national du matériel médical par ville. Indiquez toujours votre ville exacte lors de la demande WhatsApp afin de vérifier ce qui est possible.",
  ],
  otherCitiesLink: {
    label: "Matériel médical par ville au Maroc",
    href: MATERIEL_PAR_VILLE_PATH,
  },
  compareTitle: "Quelle est la différence entre location, vente et livraison ?",
  compareIntro:
    "Cette page se concentre sur la location de matériel médical au Maroc. Les autres sujets sont présentés comme des options complémentaires, avec un lien vers leur page dédiée.",
  compareBlocks: [
    {
      title: "Location",
      paragraphs: [
        "La location est adaptée aux besoins temporaires, incertains ou évolutifs. Elle permet d’utiliser le matériel pendant une durée définie sans l’acheter immédiatement, puis de le restituer ou de prolonger selon disponibilité.",
      ],
    },
    {
      title: "Vente",
      paragraphs: [
        "La vente peut être intéressante lorsque le besoin est durable ou permanent. Ce sujet est développé dans la page dédiée à la vente de matériel médical au Maroc.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
    {
      title: "Livraison",
      paragraphs: [
        "La livraison permet de recevoir le matériel à domicile selon disponibilité. Ce sujet est développé dans la page dédiée à la livraison de matériel médical à domicile au Maroc.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
  ],
  whyUsTitle: "Pourquoi choisir SOS Santé Maroc pour louer du matériel médical ?",
  whyUsIntro:
    "SOS Santé Maroc positionne la location comme un service de coordination et d’orientation : simplifier la demande, clarifier le besoin et faciliter la mise en relation selon la ville.",
  whyUsBlocks: [
    {
      title: "Une demande simplifiée",
      text: "La famille peut envoyer une seule demande au lieu de chercher plusieurs fournisseurs. SOS Santé Maroc aide à clarifier le besoin et à vérifier les solutions disponibles.",
    },
    {
      title: "Une approche orientée famille",
      text: "Le service s’adresse aux familles qui veulent aider un proche rapidement, sans se perdre dans des démarches compliquées. L’échange reste pratique : ville, matériel, durée, accès au logement.",
    },
    {
      title: "Une coordination selon la ville",
      text: "Les disponibilités peuvent varier entre Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes. SOS Santé Maroc adapte la recherche selon la localisation.",
    },
    {
      title: "Une orientation vers le matériel adapté",
      text: "SOS Santé Maroc aide à identifier le type d’équipement recherché : lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne ou autre matériel.",
    },
    {
      title: "Un service prudent et responsable",
      text: "SOS Santé Maroc ne remplace pas un médecin et ne donne pas de diagnostic. Pour les besoins médicaux spécifiques, notamment respiratoires, la famille doit suivre les recommandations d’un professionnel de santé. En urgence vitale, contactez les services d’urgence officiels.",
    },
  ],
  relatedTitle: "Pages et services liés",
  relatedPillars: [
    {
      label: "Livraison de matériel médical à domicile au Maroc",
      href: LIVRAISON_PILLAR_PATH,
      description: "Organisation de la livraison et de l’installation selon disponibilité",
    },
    {
      label: "Vente de matériel médical au Maroc",
      href: VENTE_MAROC_PATH,
      description: "Quand le besoin devient durable",
    },
    {
      label: "Matériel médical respiratoire au Maroc",
      href: RESPIRATOIRE_MAROC_PATH,
      description: "Concentrateurs et équipements respiratoires",
    },
    {
      label: "Matériel de mobilité au Maroc",
      href: MOBILITE_MAROC_PATH,
      description: "Fauteuils, déambulateurs et aides à la marche",
    },
    {
      label: "Matériel de confort médical au Maroc",
      href: CONFORT_MAROC_PATH,
      description: "Lits médicalisés et confort à domicile",
    },
    {
      label: "Aide à domicile et garde-malade au Maroc",
      href: AIDE_DOMICILE_PATH,
      description: "Mise en relation pour l’accompagnement humain",
    },
    {
      label: "Soins à domicile au Maroc",
      href: SOINS_DOMICILE_PATH,
      description: "Coordination avec prestataires partenaires",
    },
    {
      label: "À propos de SOS Santé",
      href: ABOUT_PATH,
      description: "Rôle, locaux et fonctionnement",
    },
  ],
  blogTitle: "Guides et articles utiles",
  blogIntro:
    "Quelques contenus de soutien pour préparer une demande de location ou mieux comprendre certains équipements.",
  blogLinks: [
    {
      label: "Location concentrateur d’oxygène à Agadir",
      href: "/blog/respiratoire/concentreur-oxygene-agadir-avantages",
      description: "Avantages de louer un concentrateur à domicile",
    },
    {
      label: "Concentrateur portable Inogen à Agadir",
      href: "/blog/respiratoire/concentrateur-oxygene-portable-inogen-agadir",
      description: "Guide oxygène portable",
    },
    {
      label: "Appareil CPAP et apnée du sommeil",
      href: "/blog/respiratoire/appareil-cpap-apnee-sommeil-agadir",
      description: "CPAP à domicile",
    },
    {
      label: "Blog respiratoire",
      href: "/blog/respiratoire",
      description: "Tous les guides oxygène et respiratoire",
    },
  ],
  productSidebar: locationPillarSidebar(),
  faqs: [
    {
      question: "Peut-on louer du matériel médical au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc aide les familles à louer du matériel médical au Maroc selon disponibilité : lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit et concentrateur d’oxygène.",
    },
    {
      question: "Quel matériel médical peut-on louer ?",
      answer:
        "Selon disponibilité, il est possible de demander la location de lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit médicalisée ou concentrateur d’oxygène.",
    },
    {
      question: "La location est-elle adaptée pour une courte durée ?",
      answer:
        "Oui, la location de matériel médical est souvent adaptée pour une courte durée après une opération, une blessure, une hospitalisation ou une période de convalescence.",
    },
    {
      question: "Peut-on louer un lit médicalisé au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à trouver un lit médicalisé à louer au Maroc selon disponibilité. Le lit médicalisé peut être utile pour une personne alitée, âgée ou en convalescence.",
    },
    {
      question: "Peut-on louer un fauteuil roulant au Maroc ?",
      answer:
        "Oui, la location de fauteuil roulant au Maroc peut être utile pour une mobilité réduite temporaire ou durable. SOS Santé Maroc aide à vérifier les options disponibles selon la ville.",
    },
    {
      question: "Peut-on louer un concentrateur d’oxygène au Maroc ?",
      answer:
        "Oui, selon disponibilité et recommandation médicale. Le concentrateur d’oxygène doit être utilisé selon les indications d’un professionnel de santé.",
    },
    {
      question: "Est-ce que SOS Santé Maroc est une clinique ?",
      answer:
        "Non. SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service de coordination, d’orientation et de mise en relation pour faciliter l’accès au matériel médical à domicile.",
    },
    {
      question: "Comment demander la disponibilité ?",
      answer:
        "Il suffit de contacter SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant la ville, le matériel recherché, la durée estimée et l’adresse de livraison ou d’utilisation.",
    },
  ],
  ctaTitle: "Besoin de louer du matériel médical au Maroc ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier la disponibilité du matériel médical dans votre ville. Notre équipe vous aide à trouver une solution adaptée pour un proche à domicile : lit médicalisé, fauteuil roulant, déambulateur, matelas anti-escarres, lève-personne, chaise percée, table de lit ou concentrateur d’oxygène selon le besoin.",
};
