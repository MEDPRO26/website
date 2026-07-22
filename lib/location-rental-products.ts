import type { Product } from "@/lib/product-types";

export const LOCATION_PRICE_LABEL = "Tarif sur demande";

const respiratoryStyle = "bg-white text-primary shadow-sm";
const mobilityStyle = "bg-white text-secondary shadow-sm";
const confortStyle = "bg-white text-primary shadow-sm";

function rentalProduct(
  data: Omit<Product, "city" | "priceLabel" | "badges"> & {
    badges?: string[];
  }
): Product {
  return {
    ...data,
    city: "Maroc",
    priceLabel: LOCATION_PRICE_LABEL,
    badges: data.badges ?? [data.category, "Disponible à la location"],
  };
}

/**
 * Products available for rental on city location pages only.
 * Kept separate from the vente catalog (`catalogProducts`).
 */
export const locationRentalProducts: Product[] = [
  rentalProduct({
    slug: "resmed-airsense-s10-autoset",
    name: "CPAP ResMed AirSense 10 AutoSet",
    shortName: "AirSense 10 AutoSet",
    category: "Respiratoire",
    categoryStyle: respiratoryStyle,
    tagline:
      "Traitement automatique de l’apnée du sommeil, silencieux et confortable à domicile.",
    description:
      "Louez l’appareil CPAP ResMed AirSense 10 AutoSet pour le traitement de l’apnée obstructive du sommeil. Pression AutoSet™ adaptée toute la nuit, humidificateur HumidAir™ et moteur Easy-Breathe™ très silencieux.",
    extendedDescription: `L’AirSense 10 AutoSet de ResMed est une solution de PPC (pression positive continue) conçue pour un usage nocturne à domicile. L’algorithme AutoSet™ démarre à basse pression pour faciliter l’endormissement, puis ajuste la pression selon vos besoins respiratoires.

L’humidificateur HumidAir™ limite la sécheresse des voies aériennes. En option, un circuit chauffant ClimateLineAir™ peut réduire la condensation. L’écran s’adapte à la lumière ambiante pour une utilisation discrète la nuit.

Idéal pour une location courte ou longue durée après prescription médicale, avec livraison et prise en main à domicile selon votre ville.`,
    image: "/products/location/resmed-airsense-s10-autoset.webp",
    alt: "Appareil CPAP ResMed AirSense 10 AutoSet pour le traitement de l’apnée du sommeil",
    specs: [
      { label: "Type", value: "CPAP AutoSet™" },
      { label: "Marque", value: "ResMed" },
      { label: "Humidification", value: "HumidAir™ intégrée" },
      { label: "Confort", value: "Moteur Easy-Breathe™ silencieux" },
    ],
    included: [
      "Appareil AirSense 10 AutoSet",
      "Humidificateur HumidAir™",
      "Alimentation secteur",
      "Conseil à la mise en service",
    ],
    useCases: [
      {
        icon: "nightlight",
        title: "Apnée du sommeil",
        description: "Traitement du SAOS à domicile selon prescription.",
      },
      {
        icon: "hotel",
        title: "Confort nocturne",
        description: "Pression progressive et humidification pour mieux dormir.",
      },
      {
        icon: "home",
        title: "Location domicile",
        description: "Solution temporaire ou longue durée livrée chez vous.",
      },
    ],
    related: [],
    seoTitle: "Location CPAP AirSense 10 AutoSet | SOS Santé Maroc",
    seoDescription:
      "Louez un CPAP ResMed AirSense 10 AutoSet au Maroc. Traitement de l’apnée du sommeil, livraison à domicile. Devis gratuit SOS Santé.",
  }),

  rentalProduct({
    slug: "concentrateur-oxygene-10l-nebuliseur-location",
    name: "Concentrateur d’oxygène 10 L/min avec nébuliseur",
    shortName: "Concentrateur 10L",
    category: "Respiratoire",
    categoryStyle: respiratoryStyle,
    tagline:
      "Oxygénothérapie à haut débit avec port nébuliseur pour les soins à domicile.",
    description:
      "Louez un concentrateur d’oxygène 10 litres/minute avec nébuliseur. Concentration en O₂ d’environ 93 %, fonctionnement silencieux et adapté à une oxygénothérapie continue à domicile.",
    extendedDescription: `Ce concentrateur d’oxygène 10 L/min fournit un débit élevé pour les patients nécessitant une oxygénothérapie intensive à domicile. La concentration en oxygène se situe autour de 93 ± 3 %, avec une pression de sortie adaptée aux usages médicaux courants.

Le port nébuliseur permet d’associer, selon prescription, des séances d’aérosolthérapie. L’appareil est conçu pour un usage prolongé, avec un niveau sonore contenu (environ ≤ 36 dBA selon modèle).

SOS Santé organise la livraison, l’installation et le conseil de prise en main dans votre ville, pour une mise en place rapide et sécurisée.`,
    image: "/products/location/concentrateur-oxygene-10l-nebuliseur-location.webp",
    alt: "Concentrateur d’oxygène 10 litres par minute avec nébuliseur en location",
    specs: [
      { label: "Débit", value: "Jusqu’à 10 L/min" },
      { label: "Concentration O₂", value: "93 ± 3 %" },
      { label: "Niveau sonore", value: "≤ 36 dBA (selon modèle)" },
      { label: "Alimentation", value: "220 V / 50 Hz" },
    ],
    included: [
      "Concentrateur 10 L/min",
      "Port nébuliseur",
      "Accessoires de base",
      "Livraison et installation",
    ],
    useCases: [
      {
        icon: "air",
        title: "Oxygénothérapie",
        description: "Apport d’oxygène continu à domicile.",
      },
      {
        icon: "medical_services",
        title: "Nébulisation",
        description: "Séances d’aérosol selon prescription médicale.",
      },
      {
        icon: "local_hospital",
        title: "Post-hospitalisation",
        description: "Relais à domicile après une sortie d’hôpital.",
      },
    ],
    related: [],
    seoTitle: "Location concentrateur oxygène 10L | SOS Santé Maroc",
    seoDescription:
      "Louez un concentrateur d’oxygène 10 L/min avec nébuliseur au Maroc. Livraison et installation à domicile. Devis SOS Santé.",
  }),

  rentalProduct({
    slug: "concentrateur-oxygene-5l-nebuliseur-location",
    name: "Concentrateur d’oxygène 5 L/min avec nébuliseur",
    shortName: "Concentrateur 5L",
    category: "Respiratoire",
    categoryStyle: respiratoryStyle,
    tagline:
      "Concentrateur 5 litres silencieux avec nébuliseur pour l’oxygène à domicile.",
    description:
      "Louez un concentrateur d’oxygène 5 L/min (type AERTI / AE-5-N) avec nébuliseur. Concentration en oxygène d’environ 93 %, compact et adapté au maintien à domicile.",
    extendedDescription: `Le concentrateur 5 L/min est la solution la plus demandée pour une oxygénothérapie à domicile lorsque le débit prescrit reste dans cette plage. Il délivre une concentration en oxygène d’environ 93 ± 3 % et dispose d’un port nébuliseur pour les traitements en aérosol.

Silencieux et conçu pour un usage quotidien, il s’installe facilement dans une chambre ou un salon. Nos équipes vous accompagnent pour le réglage du débit selon la prescription et vérifient le bon fonctionnement à la livraison.

Location à la semaine ou au mois, avec récupération du matériel en fin de période.`,
    image: "/products/location/concentrateur-oxygene-5l-nebuliseur-location.webp",
    alt: "Concentrateur d’oxygène 5 litres avec nébuliseur pour location à domicile",
    specs: [
      { label: "Débit", value: "Jusqu’à 5 L/min" },
      { label: "Concentration O₂", value: "93 ± 3 %" },
      { label: "Niveau sonore", value: "≤ 36 dBA (selon modèle)" },
      { label: "Modèle type", value: "AE-5-N / équivalent" },
    ],
    included: [
      "Concentrateur 5 L/min",
      "Port nébuliseur",
      "Accessoires de base",
      "Livraison et installation",
    ],
    useCases: [
      {
        icon: "air",
        title: "Oxygène domicile",
        description: "Oxygénothérapie quotidienne selon prescription.",
      },
      {
        icon: "spa",
        title: "Confort respiratoire",
        description: "Appareil silencieux pour un usage prolongé.",
      },
      {
        icon: "schedule",
        title: "Location flexible",
        description: "Durée adaptée à votre convalescence.",
      },
    ],
    related: [],
    seoTitle: "Location concentrateur oxygène 5L | SOS Santé Maroc",
    seoDescription:
      "Louez un concentrateur d’oxygène 5 L/min avec nébuliseur au Maroc. Livraison à domicile, devis gratuit SOS Santé.",
  }),

  rentalProduct({
    slug: "fauteuil-roulant-location",
    name: "Fauteuil roulant manuel (location)",
    shortName: "Fauteuil roulant",
    category: "Mobilier Médical",
    categoryStyle: mobilityStyle,
    tagline:
      "Fauteuil roulant classique pour retrouver mobilité et autonomie à domicile.",
    description:
      "Louez un fauteuil roulant manuel pliable pour une convalescence, une mobilité réduite temporaire ou un maintien à domicile. Livraison rapide et conseil pour le bon réglage.",
    extendedDescription: `Le fauteuil roulant manuel en location est une solution simple et économique lorsqu’un besoin de mobilité est temporaire : post-opératoire, blessure, fatigue liée à une pathologie, ou accompagnement d’une personne âgée.

Le modèle proposé est un fauteuil classique, maniable en intérieur comme pour de courts déplacements extérieurs. Sa structure pliable facilite le transport en voiture et le rangement.

SOS Santé vous livre le fauteuil, vérifie les freins et les repose-pieds, et vous explique les gestes de sécurité pour l’aidant comme pour l’utilisateur.`,
    image: "/products/location/fauteuil-roulant-location.webp",
    alt: "Fauteuil roulant manuel en location à domicile",
    specs: [
      { label: "Type", value: "Manuel, pliable" },
      { label: "Usage", value: "Intérieur / extérieur court" },
      { label: "Transport", value: "Pliable pour véhicule" },
    ],
    included: [
      "Fauteuil roulant manuel",
      "Repose-pieds",
      "Livraison à domicile",
    ],
    useCases: [
      {
        icon: "accessible",
        title: "Mobilité",
        description: "Déplacements sécurisés pendant la convalescence.",
      },
      {
        icon: "elderly",
        title: "Maintien à domicile",
        description: "Aide à l’autonomie des personnes âgées.",
      },
      {
        icon: "local_hospital",
        title: "Post-opératoire",
        description: "Solution temporaire après une intervention.",
      },
    ],
    related: [],
    seoTitle: "Location fauteuil roulant | SOS Santé Maroc",
    seoDescription:
      "Louez un fauteuil roulant manuel au Maroc. Livraison à domicile, devis rapide avec SOS Santé.",
  }),

  rentalProduct({
    slug: "leve-personne-electrique-location",
    name: "Lève-personne électrique mobile",
    shortName: "Lève-personne",
    category: "Mobilier Médical",
    categoryStyle: mobilityStyle,
    tagline:
      "Transferts lit-fauteuil sécurisés pour le patient et soulagement du dos de l’aidant.",
    description:
      "Louez un lève-personne (lève-malade) électrique mobile pour faciliter les transferts en toute sécurité. Réduit les risques de chute et les douleurs dorsales des aidants.",
    extendedDescription: `Le lève-personne électrique mobile permet de transférer une personne à mobilité réduite du lit au fauteuil, ou vers les soins d’hygiène, sans portage manuel dangereux.

Il préserve la dignité du patient tout en protégeant le dos de l’aidant familial ou professionnel. Indispensable lors d’un handicap temporaire, d’une dépendance importante ou après une hospitalisation.

Nos conseillers vous aident à choisir le modèle adapté à votre logement et organisent la livraison avec démonstration des gestes de base.`,
    image: "/products/location/leve-personne-electrique-location.webp",
    alt: "Lève-personne électrique mobile en location pour transferts à domicile",
    specs: [
      { label: "Type", value: "Électrique, mobile" },
      { label: "Usage", value: "Transferts lit / fauteuil" },
      { label: "Public", value: "Patients et aidants" },
    ],
    included: [
      "Lève-personne électrique",
      "Sangle / harnais selon modèle",
      "Livraison et démonstration",
    ],
    useCases: [
      {
        icon: "accessibility_new",
        title: "Transferts sécurisés",
        description: "Lit, fauteuil et soins d’hygiène sans portage.",
      },
      {
        icon: "volunteer_activism",
        title: "Aidants",
        description: "Prévention des lombalgies et des accidents.",
      },
      {
        icon: "home",
        title: "Domicile",
        description: "Maintien à domicile dans de meilleures conditions.",
      },
    ],
    related: [],
    seoTitle: "Location lève-personne électrique | SOS Santé Maroc",
    seoDescription:
      "Louez un lève-personne électrique mobile au Maroc. Transferts sécurisés à domicile. Devis SOS Santé.",
  }),

  rentalProduct({
    slug: "lit-medicalise-electrique-matelas-location",
    name: "Lit médicalisé électrique avec matelas",
    shortName: "Lit médicalisé",
    category: "Confort",
    categoryStyle: confortStyle,
    tagline:
      "Lit médicalisé électrique livré avec matelas pour le confort et les soins à domicile.",
    description:
      "Louez un lit médicalisé électrique avec matelas pour le maintien à domicile ou la sortie d’hospitalisation. Réglages de hauteur et de positions pour le patient et l’aidant.",
    extendedDescription: `Le lit médicalisé électrique facilite le quotidien des personnes alitées ou en convalescence : relève du dossier, positionnement des jambes, et souvent réglage de la hauteur pour les soins et les transferts.

Loué avec matelas adapté, il améliore le confort du patient et réduit la fatigue de l’aidant. Il convient aux adultes en post-opératoire, aux seniors dépendants et aux situations de soins prolongés à domicile.

SOS Santé livre, monte et explique les télécommandes. La récupération du lit est organisée en fin de location.`,
    image: "/products/location/lit-medicalise-electrique-matelas-location.webp",
    alt: "Lit médicalisé électrique avec matelas en location à domicile",
    specs: [
      { label: "Type", value: "Électrique" },
      { label: "Inclus", value: "Matelas" },
      { label: "Positions", value: "Dossier / jambes / hauteur (selon modèle)" },
    ],
    included: [
      "Lit médicalisé électrique",
      "Matelas",
      "Télécommande",
      "Livraison et installation",
    ],
    useCases: [
      {
        icon: "bed",
        title: "Maintien à domicile",
        description: "Confort et sécurité pour les personnes alitées.",
      },
      {
        icon: "healing",
        title: "Convalescence",
        description: "Après hospitalisation ou intervention chirurgicale.",
      },
      {
        icon: "medical_services",
        title: "Soins",
        description: "Positions adaptées pour les gestes de nursing.",
      },
    ],
    related: [],
    seoTitle: "Location lit médicalisé électrique | SOS Santé Maroc",
    seoDescription:
      "Louez un lit médicalisé électrique avec matelas au Maroc. Livraison et installation à domicile. Devis SOS Santé.",
  }),

  rentalProduct({
    slug: "lumis-150-vni-resmed-location",
    name: "Lumis 150 VNI ResMed",
    shortName: "Lumis 150 VNI",
    category: "Respiratoire",
    categoryStyle: respiratoryStyle,
    tagline:
      "Ventilation non invasive ResMed pour pathologies respiratoires à domicile.",
    description:
      "Louez le ventilateur non invasif Lumis 150 VPAP ST de ResMed. Modes avancés (iVAPS, AutoEPAP) pour patients non dépendants atteints de pathologies obstructives ou restrictives.",
    extendedDescription: `Le Lumis 150 VPAP ST est un appareil de ventilation non invasive (VNI) de la plateforme Air10 ResMed. Il intègre le mode iVAPS visant une ventilation alvéolaire cible, ainsi que des fonctions de synchronisation (iBR) et AutoEPAP selon configuration.

Conçu pour faciliter la titration et le suivi, il peut être associé à l’humidification et, selon les cas, au télésuivi. La location est destinée aux patients disposant d’une prescription médicale adaptée.

Nos équipes organisent la livraison et la prise en main à domicile, en lien avec les consignes de votre médecin ou pneumologue.`,
    image: "/products/location/lumis-150-vni-resmed-location.webp",
    alt: "Appareil de ventilation non invasive Lumis 150 VNI ResMed en location",
    specs: [
      { label: "Type", value: "VNI / VPAP ST" },
      { label: "Marque", value: "ResMed Lumis 150" },
      { label: "Modes", value: "iVAPS, AutoEPAP (selon config.)" },
      { label: "Plateforme", value: "Air10" },
    ],
    included: [
      "Appareil Lumis 150",
      "Alimentation",
      "Conseil de mise en service",
    ],
    useCases: [
      {
        icon: "air",
        title: "VNI domicile",
        description: "Ventilation non invasive selon prescription.",
      },
      {
        icon: "monitoring",
        title: "Suivi",
        description: "Plateforme pensée pour titration et confort.",
      },
      {
        icon: "bedtime",
        title: "Nuit & jour",
        description: "Traitement respiratoire au domicile du patient.",
      },
    ],
    related: [],
    seoTitle: "Location Lumis 150 VNI ResMed | SOS Santé Maroc",
    seoDescription:
      "Louez un Lumis 150 VNI ResMed au Maroc. Ventilation non invasive à domicile. Devis et livraison SOS Santé.",
  }),

  rentalProduct({
    slug: "resmed-airsense-s11-location",
    name: "CPAP ResMed AirSense 11 AutoSet",
    shortName: "AirSense 11 AutoSet",
    category: "Respiratoire",
    categoryStyle: respiratoryStyle,
    tagline:
      "Dernière génération CPAP AutoSet™ ResMed, écran tactile et confort Climate Control.",
    description:
      "Louez l’AirSense 11 AutoSet™ de ResMed pour le traitement du SAOS. Plus léger, écran tactile, humidificateur HumidAir™ 11 et algorithme AutoSet (dont AutoSet for Her).",
    extendedDescription: `L’AirSense 11 AutoSet est l’appareil PPC de dernière génération ResMed. Il combine réglage automatique de la pression, interface tactile simple (marche/arrêt dédié) et humidification chauffante HumidAir™ 11.

Compatible avec le mode Climate Control et le circuit chauffant ClimateLineAir 11 (option), il vise un meilleur confort tout au long de la nuit. Des filtres standard ou hypoallergéniques sont disponibles selon besoin.

La fonction Care Check-In peut accompagner le patient dans le suivi de sa qualité de vie sous traitement. Location avec livraison et conseils SOS Santé, sur présentation d’une prescription adaptée.`,
    image: "/products/location/resmed-airsense-s11-location.webp",
    alt: "Appareil CPAP ResMed AirSense 11 AutoSet en location pour l’apnée du sommeil",
    specs: [
      { label: "Type", value: "CPAP AutoSet™" },
      { label: "Marque", value: "ResMed AirSense 11" },
      { label: "Interface", value: "Écran tactile" },
      { label: "Humidification", value: "HumidAir™ 11" },
    ],
    included: [
      "Appareil AirSense 11 AutoSet",
      "Humidificateur HumidAir™ 11",
      "Alimentation",
      "Conseil à la mise en service",
    ],
    useCases: [
      {
        icon: "nightlight",
        title: "SAOS",
        description: "Traitement de l’apnée obstructive du sommeil.",
      },
      {
        icon: "touch_app",
        title: "Simple d’usage",
        description: "Écran tactile et démarrage en un geste.",
      },
      {
        icon: "home",
        title: "Location",
        description: "Idéal pour débuter ou prolonger un traitement à domicile.",
      },
    ],
    related: [],
    seoTitle: "Location CPAP AirSense 11 AutoSet | SOS Santé Maroc",
    seoDescription:
      "Louez un CPAP ResMed AirSense 11 AutoSet au Maroc. Apnée du sommeil, livraison à domicile. Devis SOS Santé.",
  }),
];

export function getLocationRentalProducts(): Product[] {
  return locationRentalProducts;
}

export function getLocationRentalProductBySlug(
  slug: string
): Product | undefined {
  return locationRentalProducts.find((product) => product.slug === slug);
}

export function getAllLocationRentalSlugs(): string[] {
  return locationRentalProducts.map((product) => product.slug);
}
