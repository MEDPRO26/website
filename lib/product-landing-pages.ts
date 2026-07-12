import { getProductBySlug, type Product } from "@/lib/products";
import { nationalProductPath } from "@/lib/routes";

export type ProductLandingBenefit = {
  icon: string;
  title: string;
  description: string;
};

export type ProductLandingSpecRow = {
  label: string;
  value: string;
};

export type ProductLandingSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
};

export type ProductLandingFaq = {
  question: string;
  answer: string;
};

export type ProductLandingContent = {
  slug: string;
  path: string;
  product: Product;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  h1Accent?: string;
  heroBadge: string;
  heroIntro: string;
  heroImage: string;
  heroImageAlt: string;
  benefits: ProductLandingBenefit[];
  trustBadges: { icon: string; label: string; sub: string }[];
  sections: ProductLandingSection[];
  fullSpecs: ProductLandingSpecRow[];
  included: string[];
  faqs: ProductLandingFaq[];
  ctaTitle: string;
  ctaDescription: string;
  comparisonTitle: string;
  comparisonRows: { feature: string; portable: string; fixed: string }[];
};

const INOGEN_LANDING_SLUG = "inogen-rove-g6";

function buildInogenLanding(): ProductLandingContent {
  const product = getProductBySlug(INOGEN_LANDING_SLUG)!;

  return {
    slug: INOGEN_LANDING_SLUG,
    path: nationalProductPath(INOGEN_LANDING_SLUG),
    product,
    metaTitle:
      "Inogen Rove G6 - concentrateur portable au Maroc | SOS Santé",
    metaDescription:
      "Achetez l'Inogen Rove G6 au Maroc : concentrateur d'oxygène portable ultra-léger (2,6 kg), 6 réglages, jusqu'à 13 h d'autonomie. Livraison nationale, conseil médical et devis gratuit.",
    keywords: [
      "Inogen Rove G6 Maroc",
      "concentrateur oxygène portable Maroc",
      "Inogen G6 prix Maroc",
      "oxygénothérapie portable",
      "concentrateur oxygène léger",
      "Inogen One Maroc",
      "achat concentrateur portable",
    ],
    h1: "Inogen Rove G6",
    h1Accent: "Liberté & autonomie partout au Maroc",
    heroBadge: "Concentrateur portable · Livraison nationale",
    heroIntro:
      "Le concentrateur d'oxygène portable le plus avancé d'Inogen : seulement 2,6 kg, 6 réglages de débit pulsé et jusqu'à 13 heures d'autonomie. Retrouvez une vie active - sorties, voyages et oxygénothérapie sans contrainte, avec l'accompagnement SOS Santé.",
    heroImage: product.image,
    heroImageAlt: product.alt,
    benefits: [
      {
        icon: "fitness_center",
        title: "Ultra-léger : 2,6 kg",
        description:
          "L'un des concentrateurs portables les plus légers du marché. Se porte en bandoulière ou dans le sac fourni pour des sorties sans effort.",
      },
      {
        icon: "air",
        title: "6 réglages pulsés",
        description:
          "Débit pulsé de 1 à 6, jusqu'à 1 260 ml/min d'oxygène médical. S'adapte à votre prescription et à votre rythme respiratoire.",
      },
      {
        icon: "battery_charging_full",
        title: "Jusqu'à 13 h d'autonomie",
        description:
          "Batterie lithium 16 cellules : jusqu'à 12 h 45 en réglage 1. Recharge AC (100-240 V) ou en voiture via prise 12 V.",
      },
      {
        icon: "volume_off",
        title: "Silencieux : 37 dBA",
        description:
          "Plus discret qu'une bibliothèque. Utilisable 24 h/24 à domicile, en visite ou en déplacement sans gêner votre entourage.",
      },
      {
        icon: "flight",
        title: "Agréé avion (FAA)",
        description:
          "Conforme aux critères FAA pour les vols commerciaux. Voyagez au Maroc et à l'international en toute sérénité.",
      },
      {
        icon: "psychology",
        title: "Intelligent Delivery",
        description:
          "Capte votre inspiration et délivre l'oxygène au bon moment. Économise la batterie et optimise chaque bolus d'oxygène.",
      },
    ],
    trustBadges: [
      { icon: "verified", label: "Dispositif médical", sub: "Classe II · FDA 510(k)" },
      { icon: "local_shipping", label: "Livraison Maroc", sub: "Agadir, Rabat & plus" },
      { icon: "support_agent", label: "Conseil gratuit", sub: "Réponse sous 15 min" },
      { icon: "health_and_safety", label: "Mise en service", sub: "Accompagnement inclus" },
    ],
    sections: [
      {
        title: "Oxygénothérapie mobile pour une vie active",
        paragraphs: [
          "L'Inogen Rove G6 (successeur de l'Inogen One G5) est conçu pour les patients nécessitant une oxygénothérapie à domicile ou en déplacement : BPCO, emphysème, fibrose pulmonaire ou insuffisance respiratoire chronique.",
          "Contrairement à un concentrateur fixe 5 L/min, le Rove 6 vous accompagne partout - courses, promenade, visite familiale ou voyage - sans bouteilles d'oxygène encombrantes.",
        ],
        bullets: [
          "Utilisation 24 h/24, 7 j/7",
          "Écran digital lumineux et boutons simples",
          "Application Inogen Connect (Bluetooth)",
          "Tamis moléculaires remplaçables par l'utilisateur",
          "Durée de vie attendue jusqu'à 8 ans",
        ],
        image: "/products/inogen-rove-g6-femme-domicile.webp",
        imageAlt:
          "Femme utilisant un concentrateur d'oxygène portable Inogen Rove G6 à domicile",
        imagePosition: "right",
      },
      {
        title: "Voyagez et sortez l'esprit tranquille",
        paragraphs: [
          "Le format compact (18 × 8 × 21 cm) tient dans un sac à bandoulière. La batterie double capacité (16 cellules) offre une autonomie record parmi les concentrateurs portables.",
          "Alimentation universelle 100-240 V : compatible avec les prises marocaines et européennes. Chargez aussi en voiture pour vos déplacements inter-villes.",
        ],
        bullets: [
          "Agréé FAA pour vols commerciaux",
          "Chargeur voiture 12 V inclus",
          "Sac de transport rembourré",
          "Fonctionne de 0 à 3 000 m d'altitude",
        ],
        image: "/products/inogen-rove-g6.webp",
        imageAlt: "Concentrateur d'oxygène portable Inogen Rove G6 sur fond blanc",
        imagePosition: "left",
      },
    ],
    fullSpecs: [
      { label: "Modèle", value: "Inogen Rove 6 (IS-501)" },
      { label: "Type", value: "Concentrateur portable à débit pulsé" },
      { label: "Poids (batterie 8 cellules)", value: "2,2 kg (4,8 lbs)" },
      { label: "Poids (batterie 16 cellules)", value: "2,6 kg (5,8 lbs)" },
      { label: "Dimensions", value: "18,2 × 8,3 × 20,7 cm (batterie standard)" },
      { label: "Réglages de débit", value: "Pulsé 1 à 6" },
      { label: "Débit maximal", value: "Jusqu'à 1 260 ml/min" },
      { label: "Concentration O₂", value: "90 % ± 3 %" },
      { label: "Niveau sonore", value: "37 dBA (réglage 1)" },
      { label: "Autonomie (batterie 8 cellules)", value: "Jusqu'à 6 h 15 (réglage 1)" },
      { label: "Autonomie (batterie 16 cellules)", value: "Jusqu'à 12 h 45 (réglage 1)" },
      { label: "Alimentation secteur", value: "100-240 V, 50-60 Hz (auto)" },
      { label: "Alimentation voiture", value: "12 V DC" },
      { label: "Altitude max.", value: "3 000 m (10 000 ft)" },
      { label: "Durée de vie", value: "Jusqu'à 8 ans" },
      { label: "Agrément FAA", value: "Oui" },
      { label: "Connectivité", value: "Bluetooth · App Inogen Connect" },
    ],
    included: [
      "Concentrateur Inogen Rove 6",
      "Batterie lithium (8 ou 16 cellules selon configuration)",
      "Chargeur secteur 100-240 V",
      "Câble allume-cigare 12 V",
      "Cannule nasale",
      "Sac de transport rembourré",
      "Notice et guide de démarrage",
    ],
    comparisonTitle: "Portable vs concentrateur fixe 5 L/min",
    comparisonRows: [
      {
        feature: "Mobilité",
        portable: "Bandoulière, sorties & voyages",
        fixed: "Stationnaire à domicile",
      },
      {
        feature: "Poids",
        portable: "2,6 kg",
        fixed: "15 à 20 kg",
      },
      {
        feature: "Alimentation",
        portable: "Batterie + secteur + voiture",
        fixed: "Secteur uniquement",
      },
      {
        feature: "Idéal pour",
        portable: "Déplacements, vie active",
        fixed: "Oxygène continu 24 h/24",
      },
    ],
    faqs: [
      {
        question: "Qu'est-ce que l'Inogen Rove G6 ?",
        answer:
          "L'Inogen Rove G6 est un concentrateur d'oxygène portable à débit pulsé. Il extrait l'oxygène de l'air ambiant et le délivre via une cannule nasale, uniquement à l'inspiration. C'est le successeur de l'Inogen One G5, avec 6 réglages et une autonomie record.",
      },
      {
        question: "Livrez-vous l'Inogen G6 partout au Maroc ?",
        answer:
          "Oui. SOS Santé livre à Agadir, Rabat et dans les principales villes du Maroc. Contactez-nous pour confirmer la disponibilité dans votre ville et obtenir un délai de livraison.",
      },
      {
        question: "Faut-il une ordonnance pour acheter un Inogen Rove G6 ?",
        answer:
          "L'oxygénothérapie est un traitement médical qui nécessite une prescription. Notre équipe vous guide sur la documentation requise et vérifie que le débit pulsé convient à votre situation clinique.",
      },
      {
        question: "Quelle autonomie réelle avec la batterie 16 cellules ?",
        answer:
          "Jusqu'à 12 h 45 au réglage 1, selon le fabricant. L'autonomie diminue aux réglages supérieurs et selon votre fréquence respiratoire. Nous vous conseillons sur la configuration batterie adaptée à votre usage quotidien.",
      },
      {
        question: "Puis-je prendre l'avion avec l'Inogen Rove G6 ?",
        answer:
          "Oui. L'appareil est conforme aux critères FAA pour l'usage à bord des vols commerciaux. Vérifiez toujours la politique de votre compagnie aérienne avant le départ.",
      },
      {
        question: "Quelle différence avec un concentrateur fixe 5 L/min ?",
        answer:
          "Le Rove 6 est portable (2,6 kg) et fonctionne sur batterie pour les déplacements. Un concentrateur 5 L/min est conçu pour un débit continu à domicile. Les deux peuvent se compléter : fixe la nuit, portable le jour.",
      },
      {
        question: "Comment obtenir un devis pour l'Inogen Rove G6 ?",
        answer:
          "Remplissez le formulaire sur cette page, contactez-nous par WhatsApp ou appelez le 07 00 97 58 88. Nous établissons un devis personnalisé avec la configuration batterie et les accessoires adaptés.",
      },
    ],
    ctaTitle: "Obtenez votre devis Inogen Rove G6",
    ctaDescription:
      "Réponse sous 15 minutes · Conseil personnalisé · Livraison au Maroc",
  };
}

const landingPages: Record<string, ProductLandingContent> = {
  [INOGEN_LANDING_SLUG]: buildInogenLanding(),
};

export function getProductLandingContent(
  slug: string
): ProductLandingContent | undefined {
  return landingPages[slug];
}

export function getAllProductLandingSlugs(): string[] {
  return Object.keys(landingPages);
}

export function isProductLandingSlug(slug: string): boolean {
  return slug in landingPages;
}
