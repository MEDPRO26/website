import { ABOUT_PATH } from "@/lib/about-content";
import {
  LIVRAISON_PILLAR_PATH,
  LOCATION_PILLAR_PATH,
} from "@/lib/pillar-pages";
import {
  hubCityPath,
  locationRentalProductPath,
  venteCityPath,
} from "@/lib/routes";

export type LocationCitySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LocationCityEnrichment = {
  processTitle: string;
  processIntro: string;
  processSteps: { title: string; text: string }[];
  useCasesTitle: string;
  useCases: { title: string; description: string }[];
  sections: LocationCitySection[];
  relatedLinks: { label: string; href: string; description?: string }[];
};

function productLinks(citySlug: string) {
  return [
    {
      label: "Lit médicalisé électrique",
      href: locationRentalProductPath(
        "lit-medicalise-electrique-matelas-location",
        citySlug
      ),
      description: "Confort et maintien alité à domicile",
    },
    {
      label: "Fauteuil roulant",
      href: locationRentalProductPath("fauteuil-roulant-location", citySlug),
      description: "Mobilité réduite, convalescence",
    },
    {
      label: "Concentrateur d'oxygène 5L",
      href: locationRentalProductPath(
        "concentrateur-oxygene-5l-nebuliseur-location",
        citySlug
      ),
      description: "Oxygène à domicile selon disponibilité",
    },
    {
      label: "Lève-personne électrique",
      href: locationRentalProductPath(
        "leve-personne-electrique-location",
        citySlug
      ),
      description: "Transferts sécurisés",
    },
  ];
}

function sharedRelated(citySlug: string, cityName: string) {
  return [
    {
      label: "Location de matériel médical au Maroc",
      href: LOCATION_PILLAR_PATH,
      description: "Vue d'ensemble nationale",
    },
    {
      label: "Livraison de matériel médical à domicile",
      href: LIVRAISON_PILLAR_PATH,
      description: "Délais, installation et récupération",
    },
    {
      label: `Hub ${cityName}`,
      href: hubCityPath(citySlug),
      description: `Location, vente et services à ${cityName}`,
    },
    {
      label: `Vente de matériel médical à ${cityName}`,
      href: venteCityPath(citySlug),
      description: "Catalogue vente local",
    },
    {
      label: "À propos de SOS Santé",
      href: ABOUT_PATH,
      description: "Locaux, rôle et fonctionnement",
    },
    ...productLinks(citySlug),
  ];
}

const processStepsBase = [
  {
    title: "Contactez-nous",
    text: "WhatsApp ou téléphone : indiquez la ville, le quartier, le matériel et le délai souhaité.",
  },
  {
    title: "Confirmation & devis",
    text: "Un conseiller vérifie la disponibilité, précise le tarif et le créneau de livraison.",
  },
  {
    title: "Préparation du matériel",
    text: "Le matériel est préparé depuis nos locaux, contrôlé et organisé pour la tournée.",
  },
  {
    title: "Livraison & installation",
    text: "Mise en place à domicile selon l'équipement, avec explications de prise en main.",
  },
  {
    title: "Suivi & récupération",
    text: "Nous restons joignables pendant la location et organisons la récupération en fin de période.",
  },
];

export const locationCityEnrichments: Record<string, LocationCityEnrichment> = {
  "location-materiel-medical-agadir": {
    processTitle: "Comment louer du matériel médical à Agadir ?",
    processIntro:
      "Depuis notre local d'Agadir, nous organisons la location pour Agadir, Inezgane, Aït Melloul et les environs. Le parcours reste simple pour la famille.",
    processSteps: processStepsBase,
    useCasesTitle: "Situations fréquentes à Agadir",
    useCases: [
      {
        title: "Retour d'hospitalisation",
        description:
          "Organiser rapidement un lit médicalisé, un fauteuil ou un matelas anti-escarres pour sécuriser le retour à domicile.",
      },
      {
        title: "Maintien à domicile d'un parent",
        description:
          "Faciliter le quotidien avec des aides à la mobilité et, si besoin, une orientation vers des prestataires partenaires.",
      },
      {
        title: "Convalescence temporaire",
        description:
          "Louer pour quelques semaines sans acheter : béquilles, déambulateur, fauteuil ou lit selon le besoin.",
      },
      {
        title: "Besoin respiratoire",
        description:
          "Orienter vers un concentrateur d'oxygène ou un matériel respiratoire selon disponibilité et prescription.",
      },
    ],
    sections: [
      {
        id: "local-agadir",
        title: "Un local opérationnel à Agadir",
        paragraphs: [
          "SOS Santé dispose d'un local à Agadir (Lerac, Avenue Abderrahim Bouabid). Ce n'est pas une simple adresse : c'est là que le matériel est stocké, préparé et contrôlé avant livraison.",
          "Nous ne sommes ni un hôpital, ni un cabinet médical, ni un service d'urgence vitale. Nous facilitons l'accès au matériel adapté à domicile et pouvons coordonner une mise en relation avec des prestataires partenaires pour les soins.",
        ],
        bullets: [
          "Préparation depuis le local Agadir",
          "Livraison et installation souvent sous 24h selon stock",
          "Zones : Agadir, Dcheira, Inezgane, Aït Melloul, Anza, Taghazout…",
          "Suivi WhatsApp / téléphone pendant la location",
        ],
      },
      {
        id: "equipements-agadir",
        title: "Quels équipements louer à Agadir ?",
        paragraphs: [
          "Le catalogue de location couvre les besoins les plus fréquents à domicile : confort (lits médicalisés, matelas), mobilité (fauteuils, lève-personne) et respiratoire (concentrateurs, CPAP selon disponibilité).",
          "Choisissez un produit ci-dessous ou demandez conseil : un conseiller confirme le stock pour votre quartier.",
        ],
      },
    ],
    relatedLinks: sharedRelated("agadir", "Agadir"),
  },
  "location-materiel-medical-casablanca": {
    processTitle: "Comment louer du matériel médical à Casablanca ?",
    processIntro:
      "Depuis notre local de Casablanca (Boulevard Anoual), nous organisons la location pour Casablanca et sa métropole. Indiquez votre quartier pour un créneau réaliste.",
    processSteps: processStepsBase,
    useCasesTitle: "Situations fréquentes à Casablanca",
    useCases: [
      {
        title: "Retour à domicile après opération",
        description:
          "Mettre en place rapidement un lit, un fauteuil ou un équipement de confort dans un appartement ou une maison casablancaise.",
      },
      {
        title: "Personne âgée à domicile",
        description:
          "Sécuriser la mobilité et le confort au quotidien, avec livraison dans les principaux quartiers de la ville.",
      },
      {
        title: "Besoin respiratoire à domicile",
        description:
          "Orienter vers un concentrateur d'oxygène selon disponibilité, en lien avec le parcours prescrit par un professionnel de santé.",
      },
      {
        title: "Location courte ou longue durée",
        description:
          "Adapter la durée à la convalescence ou au maintien à domicile, avec prolongation selon stock.",
      },
    ],
    sections: [
      {
        id: "local-casa",
        title: "Un local opérationnel à Casablanca",
        paragraphs: [
          "SOS Santé Casablanca dispose d'un local sur le Boulevard Anoual. Le matériel est préparé sur place avant tournée dans la métropole.",
          "Les délais sont généralement de 24 à 48 heures selon le stock et la zone (Bourgogne, Anfa, Maarif, Sidi Maarouf, Ain Diab, Californie, etc.). Nous confirmons toujours un créneau avant livraison.",
          "Comme partout au Maroc, SOS Santé reste une entreprise de matériel et de coordination : pas un hôpital, pas un SAMU. En urgence vitale, composez les numéros d'urgence officiels.",
        ],
        bullets: [
          "Local Boulevard Anoual, Casablanca",
          "Livraison métropole 24-48h selon disponibilité",
          "Installation pour équipements volumineux (ex. lit médicalisé)",
          "Récupération organisée en fin de location",
        ],
      },
      {
        id: "equipements-casa",
        title: "Matériel disponible à la location à Casablanca",
        paragraphs: [
          "Lits médicalisés, fauteuils roulants, lève-personne, concentrateurs d'oxygène et accessoires de confort : le catalogue suit les besoins du maintien à domicile.",
          "Pour un devis, précisez le quartier et l'étage / accès : cela accélère la planification de la livraison.",
        ],
      },
    ],
    relatedLinks: sharedRelated("casablanca", "Casablanca"),
  },
  "location-materiel-medical-rabat": {
    processTitle: "Comment louer du matériel médical à Rabat ?",
    processIntro:
      "Nous organisons la location de matériel médical à Rabat, Salé et Témara. La demande est qualifiée avec votre quartier pour confirmer délai et créneau.",
    processSteps: processStepsBase,
    useCasesTitle: "Situations fréquentes à Rabat et Salé",
    useCases: [
      {
        title: "Retour d'hospitalisation à Rabat",
        description:
          "Installer rapidement le matériel nécessaire pour un retour à domicile sécurisé (lit, fauteuil, confort).",
      },
      {
        title: "Famille à Salé ou Témara",
        description:
          "Livraison organisée hors centre-ville selon disponibilité, avec confirmation claire du créneau.",
      },
      {
        title: "Convalescence temporaire",
        description:
          "Location à la semaine ou au mois pour limiter l'investissement pendant une période limitée.",
      },
      {
        title: "Maintien à domicile",
        description:
          "Équipements de mobilité et de confort pour le quotidien d'une personne âgée ou dépendante.",
      },
    ],
    sections: [
      {
        id: "local-rabat",
        title: "Location organisée pour Rabat, Salé et Témara",
        paragraphs: [
          "À Rabat, SOS Santé organise la location et la livraison en lien avec ses bases opérationnelles. Indiquez Hay Riad, Agdal, Souissi, Hassan, Salé, Témara ou votre commune pour une confirmation précise.",
          "Nous préparons le matériel, planifions la livraison et l'installation selon l'équipement, puis la récupération en fin de période. Nous ne remplaçons pas un avis médical : pour l'oxygène ou le respiratoire, le parcours reste celui prescrit par un professionnel de santé.",
        ],
        bullets: [
          "Zones : Rabat, Salé, Témara et environs",
          "Délais souvent sous 24-48h selon stock",
          "Installation et démonstration selon matériel",
          "Coordination possible avec prestataires partenaires",
        ],
      },
      {
        id: "equipements-rabat",
        title: "Équipements à louer à Rabat",
        paragraphs: [
          "Le catalogue inclut lit médicalisé, fauteuil roulant, lève-personne, concentrateur d'oxygène et accessoires de confort selon disponibilité.",
          "Un conseiller vous oriente vers le bon équipement et vous indique si la location ou l'achat est plus pertinent selon la durée estimée.",
        ],
      },
    ],
    relatedLinks: sharedRelated("rabat", "Rabat"),
  },
  "location-materiel-medical-marrakech": {
    processTitle: "Comment louer du matériel médical à Marrakech ?",
    processIntro:
      "Nous organisons la location de matériel médical à Marrakech et environs. Indiquez votre quartier pour confirmer délai, accès et créneau de livraison.",
    processSteps: processStepsBase,
    useCasesTitle: "Situations fréquentes à Marrakech",
    useCases: [
      {
        title: "Retour d'hospitalisation",
        description:
          "Mettre en place rapidement un lit médicalisé, un fauteuil ou un équipement de confort pour le retour à domicile.",
      },
      {
        title: "Maintien à domicile",
        description:
          "Faciliter le quotidien d'une personne âgée ou dépendante avec des aides à la mobilité et au confort.",
      },
      {
        title: "Convalescence temporaire",
        description:
          "Louer pour quelques semaines : béquilles, déambulateur, fauteuil ou lit selon le besoin.",
      },
      {
        title: "Besoin respiratoire",
        description:
          "Orienter vers un concentrateur d'oxygène selon disponibilité et recommandations médicales.",
      },
    ],
    sections: [
      {
        id: "local-marrakech",
        title: "Location organisée pour Marrakech",
        paragraphs: [
          "À Marrakech, SOS Santé organise la location et la livraison selon disponibilité. Précisez Guéliz, Hivernage, Médina, Daoudiate, Massira ou votre zone pour une confirmation réaliste.",
          "Nous préparons le matériel, planifions la livraison et l'installation selon l'équipement, puis la récupération en fin de période. Nous ne remplaçons pas un avis médical.",
        ],
        bullets: [
          "Zones : Marrakech et environs selon disponibilité",
          "Délais souvent sous 24-48h selon stock",
          "Installation pour équipements volumineux",
          "Suivi WhatsApp / téléphone pendant la location",
        ],
      },
      {
        id: "equipements-marrakech",
        title: "Équipements à louer à Marrakech",
        paragraphs: [
          "Le catalogue inclut lit médicalisé, fauteuil roulant, lève-personne, concentrateur d'oxygène et accessoires de confort selon disponibilité.",
          "Un conseiller confirme le stock et oriente vers la location ou l'achat selon la durée estimée.",
        ],
      },
    ],
    relatedLinks: sharedRelated("marrakech", "Marrakech"),
  },
  "location-materiel-medical-tanger": {
    processTitle: "Comment louer du matériel médical à Tanger ?",
    processIntro:
      "Nous organisons la location de matériel médical à Tanger et environs. Indiquez votre quartier pour confirmer délai et créneau.",
    processSteps: processStepsBase,
    useCasesTitle: "Situations fréquentes à Tanger",
    useCases: [
      {
        title: "Retour à domicile",
        description:
          "Installer rapidement le matériel nécessaire après une hospitalisation ou une opération.",
      },
      {
        title: "Personne âgée à domicile",
        description:
          "Sécuriser mobilité et confort au quotidien, avec livraison selon disponibilité.",
      },
      {
        title: "Convalescence temporaire",
        description:
          "Location courte durée pour limiter l'investissement pendant une période limitée.",
      },
      {
        title: "Besoin respiratoire",
        description:
          "Orienter vers un concentrateur d'oxygène selon disponibilité et prescription.",
      },
    ],
    sections: [
      {
        id: "local-tanger",
        title: "Location organisée pour Tanger",
        paragraphs: [
          "À Tanger, SOS Santé organise la location et la livraison selon disponibilité. Précisez votre quartier et l'accès au logement pour accélérer la confirmation.",
          "Comme partout au Maroc, SOS Santé reste une entreprise de matériel et de coordination : pas un hôpital, pas un service d'urgence vitale.",
        ],
        bullets: [
          "Zones : Tanger et environs selon disponibilité",
          "Délais souvent sous 24-48h selon stock",
          "Installation selon type d'équipement",
          "Récupération organisée en fin de location",
        ],
      },
      {
        id: "equipements-tanger",
        title: "Équipements à louer à Tanger",
        paragraphs: [
          "Lits médicalisés, fauteuils roulants, lève-personne, concentrateurs d'oxygène et accessoires de confort selon stock partenaire.",
          "Pour un devis, indiquez le matériel recherché, le quartier et le délai souhaité.",
        ],
      },
    ],
    relatedLinks: sharedRelated("tanger", "Tanger"),
  },
};

export function getLocationCityEnrichment(locationSlug: string) {
  return locationCityEnrichments[locationSlug];
}
