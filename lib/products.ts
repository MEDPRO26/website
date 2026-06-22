export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductUseCase = {
  icon: string;
  title: string;
  description: string;
};

export type RelatedProduct = {
  slug: string;
  name: string;
  description: string;
  priceLabel: string;
  image: string;
  alt: string;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categoryStyle: string;
  city: string;
  tagline: string;
  description: string;
  extendedDescription: string;
  image: string;
  gallery?: string[];
  alt: string;
  badges: string[];
  specs: ProductSpec[];
  included: string[];
  useCases: ProductUseCase[];
  related: RelatedProduct[];
  seoTitle: string;
  seoDescription: string;
};

export const CONTACT_EMAIL = "contact@medidomicile.ma";
export const WHATSAPP_NUMBER = "212000000000";

export const products: Product[] = [
  {
    slug: "lit-medicalise-agadir",
    name: "Lit médicalisé électrique",
    shortName: "Lit Médicalisé",
    category: "Confort",
    categoryStyle: "bg-tertiary-container text-on-tertiary-container",
    city: "Agadir",
    tagline: "Livraison et installation à domicile par nos experts à Agadir.",
    description:
      "Notre service de location de lits médicalisés à Agadir offre une solution sécurisée et confortable pour le maintien à domicile. Ce lit électrique 3 fonctions est spécialement conçu pour faciliter le travail des soignants et améliorer l'autonomie du patient.",
    extendedDescription:
      "Doté d'un design élégant s'intégrant parfaitement dans une chambre résidentielle, il permet un réglage précis de la hauteur, du relève-buste et du relève-jambes par télécommande simple.",
    image: "/products/lit-medicalise-hero.jpg",
    gallery: [
      "/products/lit-medicalise-hero.jpg",
      "/products/lit-medicalise-electrique.jpg",
    ],
    alt: "Lit médicalisé électrique haut de gamme dans un domicile lumineux à Agadir",
    badges: ["Nouveau modèle", "Disponibilité Agadir"],
    specs: [
      { label: "Poids max supporté", value: "170 kg" },
      { label: "Hauteur variable", value: "30 à 80 cm" },
      { label: "Dimensions matelas", value: "90 × 200 cm" },
    ],
    included: [
      "Barrières de sécurité",
      "Potence de lit",
      "Télécommande verrouillable",
    ],
    useCases: [
      {
        icon: "healing",
        title: "Post-opératoire",
        description:
          "Convalescence temporaire nécessitant une position surélevée.",
      },
      {
        icon: "elderly",
        title: "Maintien à domicile",
        description: "Sécurisation du sommeil pour les personnes âgées.",
      },
      {
        icon: "accessible",
        title: "Mobilité réduite",
        description: "Aide au transfert lit/fauteuil en toute sécurité.",
      },
    ],
    related: [
      {
        slug: "matelas-air-anti-escarres",
        name: "Matelas Anti-escarres",
        description:
          "Système à air motorisé pour la prévention des plaies de pression.",
        priceLabel: "À partir de 15 DH/jour",
        image: "/products/matelas-air-anti-escarres.jpg",
        alt: "Matelas à air anti-escarres pour lit médicalisé",
      },
      {
        slug: "table-lit-inclinable",
        name: "Table de lit inclinable",
        description:
          "Idéale pour les repas et la lecture en position allongée.",
        priceLabel: "À partir de 5 DH/jour",
        image: "/products/table-lit-inclinable.jpg",
        alt: "Table de lit inclinable à roulettes",
      },
      {
        slug: "fauteuil-roulant-leger",
        name: "Fauteuil Roulant Léger",
        description:
          "Structure en aluminium pour un transfert facile et confortable.",
        priceLabel: "À partir de 25 DH/jour",
        image: "/products/fauteuil-roulant-detail.jpg",
        alt: "Fauteuil roulant léger en aluminium",
      },
    ],
    seoTitle: "Location de lit médicalisé à Agadir | MediDomicile",
    seoDescription:
      "Louez un lit médicalisé électrique à Agadir. Livraison, installation et conseil gratuit. Vérifiez la disponibilité en ligne avec MediDomicile.",
  },
  {
    slug: "concentrateur-oxygene",
    name: "Concentrateur d'Oxygène",
    shortName: "Concentrateur d'Oxygène",
    category: "Respiratoire",
    categoryStyle: "bg-primary text-on-primary",
    city: "Agadir",
    tagline: "Oxygénothérapie continue à domicile, livraison incluse à Agadir.",
    description:
      "Appareil silencieux et performant pour l'oxygénothérapie continue à domicile. Débit ajustable et consommation énergétique optimisée.",
    extendedDescription:
      "Idéal pour les patients nécessitant un apport d'oxygène régulier, avec un fonctionnement discret adapté au domicile.",
    image: "/products/concentrateur-oxygene.jpg",
    alt: "Concentrateur d'oxygène blanc sur un fond médical épuré",
    badges: ["Respiratoire", "Disponibilité Agadir"],
    specs: [
      { label: "Débit", value: "1–5 L/min" },
      { label: "Niveau sonore", value: "< 45 dB" },
      { label: "Consommation", value: "350 W" },
    ],
    included: ["Tubulure", "Filtre de rechange"],
    useCases: [
      {
        icon: "air",
        title: "Oxygénothérapie",
        description: "Apport d'oxygène continu à domicile.",
      },
      {
        icon: "pulmonology",
        title: "Pathologies respiratoires",
        description: "BPCO, insuffisance respiratoire chronique.",
      },
      {
        icon: "healing",
        title: "Convalescence",
        description: "Support post-hospitalisation.",
      },
    ],
    related: [],
    seoTitle: "Location concentrateur d'oxygène à Agadir | MediDomicile",
    seoDescription:
      "Louez un concentrateur d'oxygène à Agadir. Livraison et mise en service à domicile avec MediDomicile.",
  },
  {
    slug: "souleve-malade-electrique",
    name: "Soulève-malade électrique",
    shortName: "Soulève-malade",
    category: "Mobilité",
    categoryStyle: "bg-status-info text-white",
    city: "Agadir",
    tagline: "Transfert sécurisé avec installation par nos techniciens.",
    description:
      "Système de transfert sécurisé avec sangle grand confort pour les personnes à mobilité réduite.",
    extendedDescription:
      "Le soulève-malade électrique facilite les transferts lit/fauteuil en réduisant les risques pour le patient et le soignant.",
    image: "/products/souleve-malade-electrique.jpg",
    alt: "Soulève-malade électrique avec sangle dans une chambre médicale",
    badges: ["Mobilité", "Disponibilité Agadir"],
    specs: [
      { label: "Charge max", value: "150 kg" },
      { label: "Hauteur de levage", value: "105–185 cm" },
      { label: "Base", value: "4 roues avec freins" },
    ],
    included: ["Sangle universelle", "Télécommande"],
    useCases: [
      {
        icon: "accessible",
        title: "Transferts quotidiens",
        description: "Lit, fauteuil et chaise percée.",
      },
      {
        icon: "elderly",
        title: "Dépendance",
        description: "Accompagnement des personnes alitées.",
      },
      {
        icon: "personal_injury",
        title: "Prévention",
        description: "Réduction des risques de chute.",
      },
    ],
    related: [],
    seoTitle: "Location soulève-malade à Agadir | MediDomicile",
    seoDescription:
      "Louez un soulève-malade électrique à Agadir. Installation et formation incluses avec MediDomicile.",
  },
  {
    slug: "table-lit-inclinable",
    name: "Table de lit inclinable",
    shortName: "Table de lit",
    category: "Confort",
    categoryStyle: "bg-tertiary-container text-on-tertiary-container",
    city: "Agadir",
    tagline: "Accessoire complémentaire pour lit médicalisé.",
    description:
      "Table de lit à roulettes inclinable, idéale pour les repas et la lecture en position allongée.",
    extendedDescription:
      "Surface stable et réglable en hauteur, elle s'adapte à la position du lit médicalisé pour un confort optimal.",
    image: "/products/table-lit-inclinable.jpg",
    alt: "Table de lit inclinable à roulettes",
    badges: ["Accessoire", "Disponibilité Agadir"],
    specs: [
      { label: "Hauteur réglable", value: "72–110 cm" },
      { label: "Plateau", value: "40 × 60 cm" },
      { label: "Roulettes", value: "4 avec freins" },
    ],
    included: ["Plateau inclinable", "Roulettes verrouillables"],
    useCases: [
      {
        icon: "restaurant",
        title: "Repas au lit",
        description: "Prise de repas confortable.",
      },
      {
        icon: "menu_book",
        title: "Lecture & loisirs",
        description: "Support pour tablette et livres.",
      },
      {
        icon: "bed",
        title: "Complément lit",
        description: "Associé au lit médicalisé.",
      },
    ],
    related: [],
    seoTitle: "Location table de lit à Agadir | MediDomicile",
    seoDescription:
      "Louez une table de lit inclinable à Agadir. Livraison rapide avec MediDomicile.",
  },
  {
    slug: "rollator-4-roues",
    name: "Rollator 4 roues",
    shortName: "Rollator",
    category: "Mobilité",
    categoryStyle: "bg-status-info text-white",
    city: "Agadir",
    tagline: "Déambulateur avec siège et panier, livraison à Agadir.",
    description:
      "Déambulateur avec siège de repos et panier, freins sécurisés pour une marche stable.",
    extendedDescription:
      "Le rollator 4 roues favorise l'autonomie lors des déplacements intérieurs et extérieurs avec un appui sécurisé.",
    image: "/products/rollator-4-roues.jpg",
    alt: "Rollator quatre roues sur une allée extérieure ensoleillée",
    badges: ["Mobilité", "Disponibilité Agadir"],
    specs: [
      { label: "Charge max", value: "120 kg" },
      { label: "Roues", value: "4 avec freins" },
      { label: "Poids", value: "7,5 kg" },
    ],
    included: ["Siège de repos", "Panier de transport"],
    useCases: [
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Stabilité et confiance à la marche.",
      },
      {
        icon: "park",
        title: "Sorties extérieures",
        description: "Promenades et rééducation.",
      },
      {
        icon: "elderly",
        title: "Seniors actifs",
        description: "Maintien de l'autonomie.",
      },
    ],
    related: [],
    seoTitle: "Location rollator 4 roues à Agadir | MediDomicile",
    seoDescription:
      "Louez un rollator 4 roues à Agadir. Livraison à domicile avec MediDomicile.",
  },
  {
    slug: "fauteuil-roulant-leger",
    name: "Fauteuil roulant léger",
    shortName: "Fauteuil Roulant",
    category: "Mobilité",
    categoryStyle: "bg-status-info text-white",
    city: "Agadir",
    tagline: "Location avec livraison rapide à Agadir et dans la région.",
    description:
      "Fauteuil roulant en aluminium, pliable et maniable pour un usage intérieur et extérieur. Idéal pour les déplacements quotidiens et les sorties.",
    extendedDescription:
      "Léger et robuste, ce fauteuil facilite l'autonomie des personnes à mobilité réduite tout en offrant un confort d'assise optimal.",
    image: "/products/fauteuil-roulant-leger.jpg",
    alt: "Fauteuil roulant léger noir dans un intérieur clair",
    badges: ["Mobilité", "Disponibilité Agadir"],
    specs: [
      { label: "Poids du fauteuil", value: "12 kg" },
      { label: "Charge max", value: "100 kg" },
      { label: "Largeur assise", value: "42 cm" },
    ],
    included: ["Repose-pieds réglables", "Freins sur les roues arrière"],
    useCases: [
      {
        icon: "accessible",
        title: "Mobilité intérieure",
        description: "Déplacements fluides dans le domicile.",
      },
      {
        icon: "directions_walk",
        title: "Sorties courtes",
        description: "Promenades et rendez-vous médicaux.",
      },
      {
        icon: "healing",
        title: "Convalescence",
        description: "Support temporaire après une intervention.",
      },
    ],
    related: [],
    seoTitle: "Location fauteuil roulant à Agadir | MediDomicile",
    seoDescription:
      "Louez un fauteuil roulant léger à Agadir. Livraison à domicile et tarifs transparents avec MediDomicile.",
  },
  {
    slug: "matelas-air-anti-escarres",
    name: "Matelas à air anti-escarres",
    shortName: "Matelas Anti-escarres",
    category: "Confort",
    categoryStyle: "bg-tertiary-container text-on-tertiary-container",
    city: "Agadir",
    tagline: "Prévention efficace des escarres avec compresseur silencieux.",
    description:
      "Matelas à air alterné pour la prévention et le traitement des escarres. Compresseur silencieux adapté à un usage prolongé à domicile.",
    extendedDescription:
      "Compatible avec la plupart des lits médicalisés, il distribue la pression de manière dynamique pour protéger les zones à risque.",
    image: "/products/matelas-air-anti-escarres.jpg",
    alt: "Matelas à air anti-escarres bleu pour lit médicalisé",
    badges: ["Confort", "Disponibilité Agadir"],
    specs: [
      { label: "Type", value: "Alternance dynamique" },
      { label: "Niveau sonore", value: "< 30 dB" },
      { label: "Dimensions", value: "90 × 200 cm" },
    ],
    included: ["Compresseur silencieux", "Housse lavable"],
    useCases: [
      {
        icon: "bed",
        title: "Alitement prolongé",
        description: "Prévention des plaies de pression.",
      },
      {
        icon: "elderly",
        title: "Personnes âgées",
        description: "Confort nocturne renforcé.",
      },
      {
        icon: "healing",
        title: "Post-opératoire",
        description: "Complément idéal au lit médicalisé.",
      },
    ],
    related: [],
    seoTitle: "Location matelas anti-escarres à Agadir | MediDomicile",
    seoDescription:
      "Louez un matelas à air anti-escarres à Agadir. Livraison et installation avec MediDomicile.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCatalogProducts() {
  return products.map(
    ({
      slug,
      name,
      category,
      categoryStyle,
      description,
      image,
      alt,
    }) => ({
      slug,
      name,
      category,
      categoryStyle,
      description,
      image,
      alt,
    })
  );
}
