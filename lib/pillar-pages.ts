import { ABOUT_PATH } from "@/lib/about-content";
import { locationRentalProductPath } from "@/lib/routes";

export type PillarLink = {
  label: string;
  href: string;
  description?: string;
};

export type PillarSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PillarPageContent = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  badge: string;
  h1: string;
  h1Accent?: string;
  heroLead: string;
  intro: string;
  sections: PillarSection[];
  useCases: { title: string; description: string }[];
  cityLinks: PillarLink[];
  moneyLinks: PillarLink[];
  blogLinks: PillarLink[];
  relatedPillars: PillarLink[];
  faqs: { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
  whatsappMessage: string;
  /** Optional visual samples (not a full catalogue). */
  showcase?: {
    title: string;
    intro?: string;
    items: {
      name: string;
      href: string;
      image: string;
      alt: string;
    }[];
  };
};

export const LOCATION_PILLAR_PATH = "/location-materiel-medical";
export const LIVRAISON_PILLAR_PATH = "/livraison-materiel-medical-domicile";

export const locationMaterielMedicalPillar: PillarPageContent = {
  path: LOCATION_PILLAR_PATH,
  metaTitle: "Location matériel médical Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc vous aide à louer du matériel médical au Maroc : lit médicalisé, fauteuil roulant, déambulateur, oxygène et équipements à domicile selon disponibilité.",
  keywords: [
    "location matériel médical Maroc",
    "location lit médicalisé Maroc",
    "location fauteuil roulant Maroc",
    "location concentrateur oxygène Maroc",
    "matériel médical à domicile",
  ],
  badge: "Hub national location",
  h1: "Location de matériel médical au Maroc",
  h1Accent: "matériel médical",
  heroLead:
    "Louez lit médicalisé, fauteuil, oxygène et confort à domicile. Livraison et installation selon disponibilité depuis Agadir et Casablanca.",
  intro:
    "SOS Santé organise la location de matériel médical à domicile au Maroc pour les familles, les aidants et les personnes en convalescence. Depuis nos locaux opérationnels à Agadir et Casablanca, nous préparons le matériel, planifions la livraison et l'installation selon la ville, et restons disponibles pour le suivi. Nous ne sommes ni un hôpital, ni un cabinet médical, ni un service d'urgence vitale : nous facilitons l'accès au matériel adapté et, si besoin, la coordination avec des prestataires partenaires.",
  sections: [
    {
      id: "quoi",
      title: "Qu'est-ce que la location de matériel médical à domicile ?",
      paragraphs: [
        "Louer du matériel médical permet de disposer d'équipements adaptés au maintien à domicile sans engager immédiatement un achat. Familles, aidants et patients recherchent souvent une solution rapide après une hospitalisation, une opération, une période de mobilité réduite ou un besoin respiratoire prescrit par un professionnel de santé.",
        "Chez SOS Santé, la location couvre les grandes familles d'équipements : confort (lits médicalisés, matelas anti-escarres), mobilité (fauteuils, déambulateurs, lève-personne) et respiratoire (concentrateurs d'oxygène, CPAP selon disponibilité). Le matériel est préparé depuis nos locaux, contrôlé et organisé pour une mise en place à domicile selon la zone de livraison.",
        "La location est particulièrement utile lorsque le besoin est temporaire, lorsque le budget doit rester flexible, ou lorsque la famille souhaite tester une solution avant d'acheter. Dans tous les cas, le choix du matériel doit rester cohérent avec l'avis du professionnel de santé qui suit la personne.",
      ],
    },
    {
      id: "equipements",
      title: "Quels équipements louer avec SOS Santé ?",
      paragraphs: [
        "Le catalogue de location est structuré pour répondre aux besoins les plus fréquents à domicile. Vous pouvez démarrer depuis une page ville (Agadir, Casablanca, Rabat) pour voir les produits disponibles localement, ou depuis une catégorie pour explorer une famille d'équipements.",
      ],
      bullets: [
        "Lit médicalisé électrique et matelas anti-escarres pour le confort et le maintien alité",
        "Fauteuil roulant, déambulateur, béquilles et lève-personne pour la mobilité",
        "Concentrateur d'oxygène et matériel respiratoire selon disponibilité et prescription",
        "Chaise percée, table de lit et accessoires de chambre médicalisée",
        "CPAP et solutions respiratoires nocturnes selon disponibilité",
      ],
    },
    {
      id: "deroulement",
      title: "Comment se déroule une location avec SOS Santé ?",
      paragraphs: [
        "Le parcours est conçu pour rester simple pour la famille. Vous nous contactez par WhatsApp, téléphone ou formulaire en précisant la ville, le type de matériel, le délai souhaité et le contexte (retour d'hospitalisation, personne âgée, convalescence, besoin respiratoire, etc.).",
        "Un conseiller SOS Santé qualifie la demande, vérifie la disponibilité et vous oriente vers l'équipement le plus adapté. Nous organisons ensuite la préparation depuis nos locaux, puis la livraison et l'installation à domicile selon la ville et le créneau confirmé.",
        "Pendant la location, vous pouvez nous recontacter pour le suivi, un échange de matériel si nécessaire, ou la récupération en fin de période. Pour les soins médicaux (infirmier, kiné, médecin), SOS Santé peut coordonner une mise en relation avec des prestataires partenaires : le prestataire reste responsable de sa prestation.",
      ],
      bullets: [
        "1. Contact WhatsApp ou téléphone avec ville + besoin",
        "2. Confirmation disponibilité, tarif et délai",
        "3. Préparation du matériel depuis nos locaux",
        "4. Livraison et installation à domicile selon ville",
        "5. Suivi pendant la location et récupération en fin de période",
      ],
    },
    {
      id: "villes",
      title: "Location de matériel médical par ville au Maroc",
      paragraphs: [
        "Le besoin est souvent local : les familles cherchent une solution livrable rapidement à Casablanca, Agadir, Rabat ou dans une autre ville desservie. SOS Santé s'appuie sur des pages villes et des pages location dédiées pour clarifier l'offre, les délais et les produits disponibles.",
        "Agadir et Casablanca disposent de locaux opérationnels. Les autres villes sont organisées en lien avec ces bases, selon disponibilité. Pour une demande urgente, indiquez toujours la ville et le quartier afin que nous puissions confirmer un créneau réaliste.",
      ],
    },
    {
      id: "tarifs",
      title: "Tarifs et durée de location",
      paragraphs: [
        "Les tarifs dépendent du type d'équipement, de la durée et de la ville de livraison. Un lit médicalisé, un fauteuil ou un concentrateur n'ont pas le même coût ni le même rythme de location. Nous communiquons un devis clair avant toute livraison.",
        "La durée peut être courte (quelques jours après une opération) ou plus longue (maintien à domicile). Vous pouvez prolonger selon disponibilité. En cas de doute entre location et achat, un conseiller vous aide à comparer sans pression commerciale.",
      ],
    },
    {
      id: "preparer",
      title: "Comment préparer votre demande",
      paragraphs: [
        "Pour accélérer la réponse, préparez : la ville et le quartier, le type de matériel (ou le besoin concret : lit, fauteuil, oxygène…), le délai souhaité, et si un professionnel de santé a déjà orienté le choix.",
        "Pour un lit médicalisé, précisez si l'accès (escalier, ascenseur, largeur de porte) est contraignant. Pour l'oxygène, indiquez si une prescription existe. Ces détails permettent de confirmer un créneau réaliste et d'éviter les allers-retours.",
      ],
    },
    {
      id: "acheter-ou-louer",
      title: "Louer ou acheter du matériel médical ?",
      paragraphs: [
        "La location convient surtout aux besoins temporaires, aux périodes d'essai et aux situations où la famille veut limiter l'investissement initial. L'achat peut être préférable pour un usage très long terme, un équipement spécifique ou un matériel déjà validé par le parcours de soins.",
        "SOS Santé propose aussi la vente de matériel médical selon les catalogues villes. Un conseiller peut vous aider à comparer les deux options selon la durée estimée, le budget et la logistique (livraison, installation, entretien).",
        "Dans tous les cas, nous restons une entreprise de matériel et de coordination : nous n'établissons pas de diagnostic et nous ne remplaçons pas l'avis d'un professionnel de santé.",
      ],
    },
    {
      id: "confiance",
      title: "Pourquoi passer par SOS Santé ?",
      paragraphs: [
        "SOS Santé combine locaux physiques, préparation du matériel, livraison organisée et coordination. L'objectif est de réduire le stress des familles face à un besoin urgent ou complexe à domicile.",
        "Nos locaux d'Agadir et de Casablanca ne sont pas de simples adresses : c'est là que le matériel est stocké, préparé et contrôlé avant tournée. Pour en savoir plus sur notre rôle, consultez notre page À propos.",
      ],
      bullets: [
        "Locaux opérationnels à Agadir et Casablanca",
        "Livraison et installation selon disponibilité",
        "Orientation sur le matériel adapté à domicile",
        "Coordination possible avec prestataires partenaires",
        "Réponse rapide par WhatsApp et téléphone",
      ],
    },
  ],
  useCases: [
    {
      title: "Retour à domicile après hospitalisation",
      description:
        "Organiser rapidement un lit médicalisé, un fauteuil ou un équipement de confort pour sécuriser le retour à la maison.",
    },
    {
      title: "Personne âgée en maintien à domicile",
      description:
        "Faciliter le quotidien avec des aides à la mobilité, un lit adapté et, si besoin, une mise en relation pour l'aide à domicile.",
    },
    {
      title: "Convalescence temporaire",
      description:
        "Louer pour quelques semaines sans acheter : béquilles, déambulateur, fauteuil ou matelas anti-escarres selon le besoin.",
    },
    {
      title: "Besoin respiratoire à domicile",
      description:
        "Orienter vers un concentrateur d'oxygène ou un matériel respiratoire selon disponibilité et prescription médicale.",
    },
  ],
  cityLinks: [
    {
      label: "Location matériel médical Agadir",
      href: "/location-materiel-medical-agadir",
      description: "Catalogue location, livraison et installation à Agadir",
    },
    {
      label: "Location matériel médical Casablanca",
      href: "/location-materiel-medical-casablanca",
      description: "Location et livraison à Casablanca",
    },
    {
      label: "Location matériel médical Rabat",
      href: "/location-materiel-medical-rabat",
      description: "Location de matériel médical à Rabat",
    },
    {
      label: "Hub Agadir",
      href: "/agadir",
      description: "Location, vente et services à Agadir",
    },
    {
      label: "Hub Casablanca",
      href: "/casablanca",
      description: "Matériel médical et coordination à Casablanca",
    },
    {
      label: "Hub Rabat",
      href: "/rabat",
      description: "Matériel médical à Rabat",
    },
  ],
  moneyLinks: [
    {
      label: "Lit médicalisé électrique (location)",
      href: locationRentalProductPath(
        "lit-medicalise-electrique-matelas-location",
        "agadir"
      ),
      description: "Lit médicalisé et matelas pour le maintien à domicile",
    },
    {
      label: "Fauteuil roulant (location)",
      href: locationRentalProductPath("fauteuil-roulant-location", "agadir"),
      description: "Fauteuil roulant pour mobilité réduite",
    },
    {
      label: "Concentrateur d'oxygène 5L",
      href: locationRentalProductPath(
        "concentrateur-oxygene-5l-nebuliseur-location",
        "agadir"
      ),
      description: "Oxygène à domicile selon disponibilité",
    },
    {
      label: "Lève-personne électrique",
      href: locationRentalProductPath(
        "leve-personne-electrique-location",
        "agadir"
      ),
      description: "Transferts sécurisés à domicile",
    },
    {
      label: "Catégorie respiratoire",
      href: "/materiel-respiratoire-maroc",
      description: "Concentrateurs, CPAP et matériel respiratoire",
    },
    {
      label: "Catégorie mobilité",
      href: "/materiel-mobilite-maroc",
      description: "Fauteuils, déambulateurs et aides à la marche",
    },
    {
      label: "Catégorie confort",
      href: "/materiel-confort-maroc",
      description: "Lits médicalisés et matelas anti-escarres",
    },
  ],
  blogLinks: [
    {
      label: "Location concentrateur d'oxygène à Agadir",
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
  relatedPillars: [
    {
      label: "Livraison de matériel médical à domicile",
      href: "/livraison-materiel-medical-domicile",
      description: "Délais, installation et récupération",
    },
    {
      label: "Services et soins à domicile",
      href: "/services",
      description: "Coordination avec prestataires partenaires",
    },
    {
      label: "À propos de SOS Santé",
      href: ABOUT_PATH,
      description: "Locaux, rôle et fonctionnement",
    },
  ],
  faqs: [
    {
      question: "Quels matériels médicaux peut-on louer au Maroc avec SOS Santé ?",
      answer:
        "Selon disponibilité : lit médicalisé, matelas anti-escarres, fauteuil roulant, déambulateur, lève-personne, concentrateur d'oxygène, CPAP et accessoires de confort à domicile. Un conseiller confirme le stock pour votre ville.",
    },
    {
      question: "La livraison et l'installation sont-elles incluses ?",
      answer:
        "Oui, selon la ville et le type d'équipement. Nous organisons la livraison à domicile et l'installation lorsque cela est nécessaire (par exemple un lit médicalisé). Les délais dépendent de la disponibilité et de la zone.",
    },
    {
      question: "Dans quelles villes SOS Santé intervient-il ?",
      answer:
        "Prioritairement Agadir, Casablanca et Rabat, avec des pages dédiées. Marrakech et Tanger sont aussi présentes sur le site. Indiquez toujours votre ville pour une confirmation précise.",
    },
    {
      question: "Faut-il une ordonnance pour louer un concentrateur d'oxygène ?",
      answer:
        "Le matériel respiratoire s'inscrit généralement dans un parcours prescrit par un professionnel de santé. SOS Santé oriente et livre selon disponibilité ; nous ne remplaçons pas l'avis médical.",
    },
    {
      question: "SOS Santé est-il un hôpital ou un cabinet médical ?",
      answer:
        "Non. SOS Santé prépare et livre du matériel médical depuis ses locaux, et peut coordonner une mise en relation avec des prestataires partenaires pour les soins à domicile. En urgence vitale, composez les numéros d'urgence officiels.",
    },
    {
      question: "Comment obtenir un devis rapidement ?",
      answer:
        "Contactez-nous sur WhatsApp ou par téléphone en précisant la ville, le matériel et le délai. Un conseiller répond en général sous 15 minutes.",
    },
  ],
  ctaTitle: "Besoin de louer du matériel médical ?",
  ctaText:
    "Indiquez votre ville et le matériel recherché : un conseiller SOS Santé vous répond rapidement avec disponibilité et délai.",
  whatsappMessage:
    "Bonjour SOS Santé, je souhaite louer du matériel médical à domicile au Maroc. Ville : ",
};

