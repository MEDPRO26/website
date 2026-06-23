import { products } from "./products";

export type SeoCategory = {
  slug: string;
  label: string;
  value: string;
  icon: string;
  title: string;
  description: string;
  longDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
};

export type SeoCity = {
  slug: string;
  name: string;
  region: string;
  title: string;
  description: string;
  longDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  deliveryText: string;
  faqs: { question: string; answer: string }[];
};

export const seoCategories: SeoCategory[] = [
  {
    slug: "materiel-mobilite",
    label: "Mobilier Médical",
    value: "Mobilier Médical",
    icon: "accessible",
    title: "Location de matériel de mobilité à Agadir",
    description:
      "Louez des fauteuils roulants, rollators et soulève-malade à Agadir et au Maroc. Livraison et installation incluses.",
    longDescription: `Notre gamme de matériel de mobilité vous aide à retrouver votre autonomie au quotidien, que ce soit pour une convalescence temporaire, un maintien à domicile ou des déplacements en intérieur comme en extérieur. Nous proposons des fauteuils roulants légers et pliables, des rollators 4 roues avec siège, ainsi que des soulève-malade électriques pour les transferts sécurisés.

Chaque équipement est vérifié, entretenu et désinfecté avant location. Notre équipe vous accompagne pour choisir le matériel adapté à votre situation et organise la livraison à domicile à Agadir et dans toute la région.`,
    metaTitle:
      "Location matériel mobilité Agadir | Fauteuil roulant, rollator, soulève-malade",
    metaDescription:
      "Louez du matériel de mobilité à Agadir : fauteuil roulant, rollator, soulève-malade. Livraison, installation et désinfection incluses. Devis 15 min.",
    keywords: [
      "location fauteuil roulant Agadir",
      "location rollator Agadir",
      "location soulève malade Agadir",
      "matériel mobilité Maroc",
      "déambulateur location Agadir",
    ],
    faqs: [
      {
        question: "Quel fauteuil roulant choisir pour une location courte durée ?",
        answer:
          "Pour une location courte durée, privilégiez un fauteuil roulant léger et pliable en aluminium. Il est maniable, facile à transporter et suffisant pour les déplacements intérieurs et courts trajets. Nous vous conseillons selon le poids et la morphologie de l’utilisateur.",
      },
      {
        question: "La livraison d’un rollator est-elle incluse à Agadir ?",
        answer:
          "Oui, la livraison du rollator ou de tout autre matériel de mobilité est incluse à Agadir et ses environs. Nous vous expliquons également le fonctionnement des freins et du siège de repos lors de l’installation.",
      },
      {
        question: "Puis-je louer un soulève-malade pour un transfert sécurisé ?",
        answer:
          "Oui, nous louons des soulève-malade électriques avec sangle pour les transferts lit-fauteuil en toute sécurité. Cet équipement est particulièrement utile pour les personnes à mobilité réduite et les aidants.",
      },
    ],
  },
  {
    slug: "materiel-respiratoire",
    label: "Respiratoire",
    value: "Respiratoire",
    icon: "air",
    title: "Location de matériel respiratoire à Agadir",
    description:
      "Concentrateurs d'oxygène et matériel respiratoire en location à Agadir et au Maroc. Livraison rapide et conseil personnalisé.",
    longDescription: `Notre matériel respiratoire à domicile permet d’assurer une oxygénothérapie continue ou ponctuelle dans les meilleures conditions. Le concentrateur d’oxygène que nous proposons est silencieux, performant et adapté à un usage prolongé à domicile.

Nous vous accompagnons dans la prise en main de l’appareil, le réglage du débit et l’entretien du matériel. La livraison est assurée à Agadir et dans les principales villes du Maroc, avec un suivi disponible 24h/24 pour les urgences.`,
    metaTitle:
      "Location matériel respiratoire Agadir | Concentrateur d'oxygène",
    metaDescription:
      "Louez un concentrateur d'oxygène à Agadir. Matériel respiratoire silencieux, livraison et installation à domicile. Devis gratuit en 15 minutes.",
    keywords: [
      "location concentrateur oxygène Agadir",
      "matériel respiratoire location Maroc",
      "oxygène thérapie domicile Agadir",
      "location oxygène médical Agadir",
    ],
    faqs: [
      {
        question: "Comment fonctionne un concentrateur d’oxygène à domicile ?",
        answer:
          "Un concentrateur d’oxygène aspire l’air ambiant, le filtre et concentre l’oxygène pour le restituer au patient via une tubulure. L’appareil se branche sur une prise électrique standard et reste allumé en continu selon les recommandations médicales.",
      },
      {
        question: "Quel est le débit d’oxygène disponible sur vos concentrateurs ?",
        answer:
          "Nos concentrateurs d’oxygène permettent un débit réglable généralement entre 1 et 5 litres par minute, adapté aux prescriptions des patients souffrant d’insuffisance respiratoire ou de BPCO.",
      },
      {
        question: "Livrez-vous le matériel respiratoire en urgence ?",
        answer:
          "Oui, nous assurons des livraisons urgentes à Agadir et dans les villes proches. Pour les besoins immédiats, contactez-nous par WhatsApp ou téléphone pour une mise à disposition rapide.",
      },
    ],
  },
  {
    slug: "materiel-confort",
    label: "Confort",
    value: "Confort",
    icon: "bed",
    title: "Location de matériel de confort médical à Agadir",
    description:
      "Lits médicalisés électriques et matelas anti-escarres en location à Agadir. Confort et sécurité pour le maintien à domicile.",
    longDescription: `Le matériel de confort médical améliore la qualité de vie des patients alités ou en convalescence. Nos lits médicalisés électriques permettent de régler la hauteur, le dossier et les jambes pour faciliter les soins et le repos. Les matelas à air anti-escarres préviennent les plaies de pression lors d’un alitement prolongé.

Tous nos équipements sont livrés, installés et vérifiés par nos soins à Agadir et dans tout le Maroc. Nous vous expliquons le fonctionnement et restons disponibles pendant toute la durée de la location.`,
    metaTitle:
      "Location lit médicalisé Agadir | Matelas anti-escarres | Confort",
    metaDescription:
      "Louez un lit médicalisé électrique ou un matelas anti-escarres à Agadir. Livraison, installation et conseil. Devis gratuit sous 15 minutes.",
    keywords: [
      "location lit médicalisé Agadir",
      "location matelas anti escarres Agadir",
      "lit médicalisé électrique Maroc",
      "matériel confort médical domicile",
    ],
    faqs: [
      {
        question: "Quelles sont les dimensions d’un lit médicalisé électrique ?",
        answer:
          "Nos lits médicalisés électriques standards mesurent 90 × 200 cm, compatibles avec la plupart des matelas et literies médicalisées. Nous pouvons vous conseiller sur les options selon l’espace disponible dans la chambre.",
      },
      {
        question: "Le matelas anti-escarres est-il inclus avec le lit médicalisé ?",
        answer:
          "Le matelas anti-escarres peut être loué séparément ou en complément du lit médicalisé. Il est particulièrement recommandé pour les personnes alitées longtemps afin de prévenir les plaies de pression.",
      },
      {
        question: "Installez-vous le lit médicalisé chez moi ?",
        answer:
          "Oui, l’installation du lit médicalisé est incluse à Agadir. Notre équipe monte le lit, vérifie les réglages électriques et vous explique le fonctionnement des télécommandes.",
      },
    ],
  },
];

export const seoCities: SeoCity[] = [
  {
    slug: "location-materiel-medical-casablanca",
    name: "Casablanca",
    region: "Casablanca-Settat",
    title: "Location de matériel médical à Casablanca",
    description:
      "Louez du matériel médical à Casablanca avec livraison à domicile. Lits médicalisés, fauteuils roulants, oxygène médical et plus encore.",
    longDescription: `SOS Santé étend son service de location de matériel médical à Casablanca et sa région. Que vous soyez à Bourgogne, Anfa, Ain Diab, Sidi Maarouf ou ailleurs dans la métropole, nous livrons et installons le matériel nécessaire au maintien à domicile.

Nos délais de livraison à Casablanca sont généralement de 24 à 48 heures selon la disponibilité du matériel. Chaque équipement est contrôlé, nettoyé et désinfecté avant expédition. Contactez-nous pour un devis personnalisé et une mise à disposition rapide.`,
    metaTitle: "Location matériel médical Casablanca | Livraison à domicile",
    metaDescription:
      "Louez du matériel médical à Casablanca : lit médicalisé, fauteuil roulant, concentrateur d'oxygène. Livraison et installation à domicile. Devis 15 min.",
    keywords: [
      "location matériel médical Casablanca",
      "lit médicalisé Casablanca",
      "fauteuil roulant Casablanca",
      "concentrateur oxygène Casablanca",
    ],
    deliveryText:
      "Livraison 24-48h à Casablanca et sa métropole. Frais de transport selon distance.",
    faqs: [
      {
        question: "Livrez-vous du matériel médical à Casablanca ?",
        answer:
          "Oui, nous livrons à Casablanca et dans les communes environnantes. Les délais sont de 24 à 48h selon le matériel choisi.",
      },
      {
        question: "Quels sont les frais de livraison à Casablanca ?",
        answer:
          "Les frais de livraison à Casablanca dépendent de la zone exacte. Nous vous communiquons un devis transparent avant toute confirmation.",
      },
    ],
  },
  {
    slug: "location-materiel-medical-marrakech",
    name: "Marrakech",
    region: "Marrakech-Safi",
    title: "Location de matériel médical à Marrakech",
    description:
      "Location de matériel médical à Marrakech et sa région. Livraison rapide de lits, fauteuils roulants et matériel respiratoire.",
    longDescription: `Vous cherchez à louer du matériel médical à Marrakech ? SOS Santé vous accompagne avec une gamme complète : lits médicalisés, fauteuils roulants, concentrateurs d’oxygène, matelas anti-escarres et rollators. Nous desservons le centre-ville, Guéliz, Hivernage, Sidi Ghanem et les environs.

Nos équipements sont livrés dans des délais courts et installés par nos soins. Profitez d’un service réactif et d’un conseil personnalisé pour choisir le matériel adapté à votre besoin de santé à domicile.`,
    metaTitle: "Location matériel médical Marrakech | Livraison à domicile",
    metaDescription:
      "Louez du matériel médical à Marrakech. Lit médicalisé, fauteuil roulant, oxygène médical. Livraison rapide et installation à domicile.",
    keywords: [
      "location matériel médical Marrakech",
      "lit médicalisé Marrakech",
      "fauteuil roulant Marrakech",
      "oxygène médical Marrakech",
    ],
    deliveryText:
      "Livraison rapide à Marrakech centre, Guéliz, Hivernage et environs.",
    faqs: [
      {
        question: "Intervenez-vous à Marrakech pour la location de matériel médical ?",
        answer:
          "Oui, nous livrons et installons du matériel médical à Marrakech et dans les zones environnantes avec des délais rapides.",
      },
      {
        question: "Quels produits sont disponibles à Marrakech ?",
        answer:
          "Nous proposons lits médicalisés, fauteuils roulants, concentrateurs d’oxygène, matelas anti-escarres, rollators et soulève-malade à Marrakech.",
      },
    ],
  },
  {
    slug: "location-materiel-medical-rabat",
    name: "Rabat",
    region: "Rabat-Salé-Kénitra",
    title: "Location de matériel médical à Rabat",
    description:
      "Location de matériel médical à Rabat et Salé. Livraison à domicile de matériel de confort, mobilité et respiratoire.",
    longDescription: `SOS Santé propose la location de matériel médical à Rabat, Salé, Temara et les communes avoisinantes. Notre service s’adresse aux familles, aux aidants et aux structures de soins qui recherchent un équipement fiable pour le maintien à domicile.

Nous assurons la livraison, l’installation et la récupération du matériel à Rabat. Tous nos produits sont vérifiés et désinfectés selon les normes en vigueur. Demandez votre devis gratuit et recevez une réponse sous 15 minutes.`,
    metaTitle: "Location matériel médical Rabat | Livraison Rabat-Salé",
    metaDescription:
      "Louez du matériel médical à Rabat et Salé. Lits, fauteuils roulants, oxygène. Livraison et installation à domicile. Devis rapide.",
    keywords: [
      "location matériel médical Rabat",
      "lit médicalisé Rabat",
      "fauteuil roulant Rabat",
      "location oxygène Rabat",
    ],
    deliveryText:
      "Livraison à Rabat, Salé, Temara et environs sous 24-48h.",
    faqs: [
      {
        question: "Livrez-vous à Salé et Temara depuis Rabat ?",
        answer:
          "Oui, nous assurons la livraison à Rabat, Salé, Temara et les communes avoisinantes avec un service rapide et fiable.",
      },
      {
        question: "Puis-je louer du matériel médical à Rabat pour une courte durée ?",
        answer:
          "Oui, nous proposons des locations à la semaine ou au mois à Rabat. La durée minimale dépend du matériel choisi.",
      },
    ],
  },
  {
    slug: "location-materiel-medical-tanger",
    name: "Tanger",
    region: "Tanger-Tétouan-Al Hoceïma",
    title: "Location de matériel médical à Tanger",
    description:
      "Louez du matériel médical à Tanger. Livraison à domicile de lits médicalisés, fauteuils roulants et matériel respiratoire.",
    longDescription: `Nous étendons notre service de location de matériel médical à Tanger et sa région. Que vous soyez dans le centre-ville, Malabata, Boukhalef ou aux alentours, nous livrons et installons le matériel nécessaire au confort et à l’autonomie à domicile.

Notre catalogue comprend des lits médicalisés, fauteuils roulants, concentrateurs d’oxygène, matelas anti-escarres et rollators. Chaque équipement est contrôlé et désinfecté avant expédition.`,
    metaTitle: "Location matériel médical Tanger | Livraison à domicile",
    metaDescription:
      "Louez du matériel médical à Tanger. Lit médicalisé, fauteuil roulant, oxygène. Livraison et installation à domicile. Devis 15 min.",
    keywords: [
      "location matériel médical Tanger",
      "lit médicalisé Tanger",
      "fauteuil roulant Tanger",
      "oxygène médical Tanger",
    ],
    deliveryText: "Livraison à Tanger et sa région sous 48-72h.",
    faqs: [
      {
        question: "Livrez-vous à Tanger ?",
        answer:
          "Oui, nous livrons à Tanger et dans sa région. Les délais varient selon la disponibilité du matériel et la zone de livraison.",
      },
      {
        question: "Quel matériel médical peut-on louer à Tanger ?",
        answer:
          "Nous proposons à Tanger lits médicalisés, fauteuils roulants, concentrateurs d’oxygène, matelas anti-escarres et rollators.",
      },
    ],
  },
  {
    slug: "location-materiel-medical-fes",
    name: "Fès",
    region: "Fès-Meknès",
    title: "Location de matériel médical à Fès",
    description:
      "Location de matériel médical à Fès et Meknès. Livraison rapide de matériel de mobilité, confort et respiratoire.",
    longDescription: `SOS Santé propose la location de matériel médical à Fès, Meknès et les villes environnantes. Notre service couvre les besoins en matériel de mobilité, de confort et respiratoire pour le maintien à domicile.

Nous livrons et installons le matériel directement chez vous à Fès. Tous nos équipements sont vérifiés, entretenus et désinfectés. Demandez un devis personnalisé et recevez une réponse rapide.`,
    metaTitle: "Location matériel médical Fès | Livraison Fès-Meknès",
    metaDescription:
      "Louez du matériel médical à Fès et Meknès. Lit médicalisé, fauteuil roulant, oxygène. Livraison et installation. Devis rapide.",
    keywords: [
      "location matériel médical Fès",
      "lit médicalisé Fès",
      "fauteuil roulant Fès",
      "oxygène médical Fès",
    ],
    deliveryText: "Livraison à Fès, Meknès et environs sous 48-72h.",
    faqs: [
      {
        question: "Pouvez-vous livrer du matériel médical à Fès ?",
        answer:
          "Oui, nous assurons la livraison de matériel médical à Fès, Meknès et les villes voisines. Contactez-nous pour connaître les délais exacts.",
      },
      {
        question: "Quels sont les délais de livraison à Fès ?",
        answer:
          "Les délais de livraison à Fès sont généralement de 48 à 72 heures selon le matériel demandé et la zone de livraison.",
      },
    ],
  },
];

export const agadirHub = {
  slug: "location-materiel-medical-agadir",
  name: "Agadir",
  title: "Location de matériel médical à Agadir",
  description:
    "Location de matériel médical à Agadir et dans la région Souss-Massa. Lits, fauteuils roulants, oxygène, matelas anti-escarres. Livraison incluse.",
  longDescription: `SOS Santé est votre partenaire de confiance pour la location de matériel médical à Agadir. Nous desservons tous les quartiers de la ville : Hay Mohammadi, Taddart, Dakhla, Les Amicales, Islane, le secteur touristique, Anza, Aït Melloul et bien d’autres.

Notre catalogue comprend des lits médicalisés électriques, des fauteuils roulants légers, des concentrateurs d’oxygène, des matelas à air anti-escarres, des rollators et des soulève-malade. Chaque équipement est livré, installé et vérifié par nos soins. La livraison et l’installation sont incluses à Agadir.

Que vous soyez en post-opératoire, en convalescence ou en situation de dépendance, nous vous aidons à choisir le matériel adapté et nous restons disponibles pendant toute la durée de la location.`,
  metaTitle:
    "Location matériel médical Agadir | Livraison & installation incluses",
  metaDescription:
    "Louez du matériel médical à Agadir : lit médicalisé, fauteuil roulant, oxygène, matelas anti-escarres. Livraison et installation à domicile. Devis 15 min.",
  keywords: [
    "location matériel médical Agadir",
    "lit médicalisé Agadir",
    "fauteuil roulant Agadir",
    "concentrateur oxygène Agadir",
    "matelas anti escarres Agadir",
  ],
  neighborhoods: [
    "Hay Mohammadi",
    "Taddart",
    "Dakhla",
    "Les Amicales",
    "Islane",
    "Secteur Touristique",
    "Anza",
    "Aït Melloul",
  ],
  faqs: [
    {
      question: "Livrez-vous dans tous les quartiers d’Agadir ?",
      answer:
        "Oui, nous livrons dans tous les quartiers d’Agadir : Hay Mohammadi, Taddart, Dakhla, Les Amicales, Islane, Anza, Aït Melloul et le secteur touristique. La livraison et l’installation sont incluses.",
    },
    {
      question: "Quel est le délai de livraison à Agadir ?",
      answer:
        "À Agadir, la livraison peut avoir lieu le jour même ou sous 24h selon la disponibilité du matériel et votre quartier.",
    },
    {
      question: "Proposez-vous un service de location longue durée à Agadir ?",
      answer:
        "Oui, nous proposons des tarifs dégressifs pour les locations longue durée à Agadir. Contactez-nous pour un devis personnalisé selon la durée souhaitée.",
    },
  ],
};

export function getProductsByCategory(categoryValue: string) {
  return products.filter((p) => p.category === categoryValue);
}

export function getCategoryBySlug(slug: string) {
  return seoCategories.find((c) => c.slug === slug);
}

export function getCityBySlug(slug: string) {
  return seoCities.find((c) => c.slug === slug);
}

export function getAllSeoSlugs() {
  return [
    agadirHub.slug,
    ...seoCategories.map((c) => c.slug),
    ...seoCities.map((c) => c.slug),
  ];
}
