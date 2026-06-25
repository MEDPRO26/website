import type { Product } from "@/lib/product-types";
import { PRICE_ON_REQUEST } from "@/lib/respiratory-products";

const instrumentsStyle = "bg-secondary/10 text-secondary";
const city = "Agadir";

function instrumentProduct(
  data: Omit<Product, "category" | "categoryStyle" | "city" | "badges" | "priceLabel">
): Product {
  return {
    ...data,
    priceLabel: PRICE_ON_REQUEST,
    category: "Instruments",
    categoryStyle: instrumentsStyle,
    city,
    badges: ["Instruments", "Disponible à la vente"],
  };
}

export const instrumentsProducts: Product[] = [
  instrumentProduct({
    slug: "haricot-inox",
    name: "Haricot inox",
    shortName: "Haricot inox",
    tagline: "Récipient inox pour usage médical et soins.",
    description:
      "Haricot en inox pour le recueil ou le transport de petit matériel lors des soins et des actes médicaux.",
    extendedDescription:
      "Conception en acier inoxydable, facile à nettoyer. Adapté aux cabinets médicaux, infirmeries et structures de soins. Contactez-nous pour connaître la disponibilité et obtenir un devis.",
    image: "/products/haricot-inox.webp",
    alt: "Haricot inox pour instruments médicaux",
    specs: [{ label: "Matériau", value: "Inox" }],
    included: ["Haricot inox"],
    useCases: [
      {
        icon: "medical_services",
        title: "Cabinet médical",
        description: "Manipulation de petit matériel stérile ou à usage unique.",
      },
      {
        icon: "vaccines",
        title: "Soins infirmiers",
        description: "Support pratique lors des pansements et actes courants.",
      },
      {
        icon: "cleaning_services",
        title: "Entretien",
        description: "Surface lisse adaptée au nettoyage et à la désinfection.",
      },
    ],
    related: [],
    seoTitle: "Achat haricot inox | SOS Santé",
    seoDescription:
      "Achetez un haricot inox pour usage médical au Maroc. Devis sur demande avec SOS Santé.",
  }),
  instrumentProduct({
    slug: "marteau-reflexes-taylor",
    name: "Marteau à réflexes Taylor",
    shortName: "Marteau Taylor",
    tagline: "Marteau à réflexes pour l'examen neurologique.",
    description:
      "Marteau à réflexes Taylor pour évaluer les réflexes tendineux lors de l'examen clinique.",
    extendedDescription:
      "Instrument de diagnostic couramment utilisé en consultation. Demandez un devis pour connaître les modèles disponibles et les délais de livraison.",
    image: "/products/marteau-reflexes-taylor.webp",
    alt: "Marteau à réflexes Taylor",
    specs: [{ label: "Usage", value: "Examen des réflexes" }],
    included: ["Marteau à réflexes Taylor"],
    useCases: [
      {
        icon: "neurology",
        title: "Examen neurologique",
        description: "Test des réflexes ostéotendineux en consultation.",
      },
      {
        icon: "stethoscope",
        title: "Cabinet médical",
        description: "Équipement de base pour le diagnostic clinique.",
      },
      {
        icon: "school",
        title: "Formation",
        description: "Utilisé en enseignement et en pratique médicale.",
      },
    ],
    related: [],
    seoTitle: "Achat marteau à réflexes Taylor | SOS Santé",
    seoDescription:
      "Marteau à réflexes Taylor pour examen clinique. Prix sur demande au Maroc avec SOS Santé.",
  }),
  instrumentProduct({
    slug: "pince-bengolea",
    name: "Pince Bengolea",
    shortName: "Pince Bengolea",
    tagline: "Pince chirurgicale Bengolea pour usage professionnel.",
    description:
      "Pince Bengolea conçue pour la préhension et la manipulation de tissus lors d'actes chirurgicaux ou de soins spécialisés.",
    extendedDescription:
      "Instrument destiné aux professionnels de santé. Contactez notre équipe pour vérifier la disponibilité du modèle et obtenir un devis personnalisé.",
    image: "/products/pince-bengolea.webp",
    alt: "Pince Bengolea chirurgicale",
    specs: [{ label: "Type", value: "Pince Bengolea" }],
    included: ["Pince Bengolea"],
    useCases: [
      {
        icon: "medical_services",
        title: "Bloc opératoire",
        description: "Préhension précise lors d'interventions.",
      },
      {
        icon: "health_and_safety",
        title: "Structures de soins",
        description: "Usage réservé au personnel qualifié.",
      },
      {
        icon: "inventory_2",
        title: "Renouvellement",
        description: "Remplacement ou complément du plateau chirurgical.",
      },
    ],
    related: [],
    seoTitle: "Achat pince Bengolea | SOS Santé",
    seoDescription:
      "Pince Bengolea pour usage médical professionnel. Devis sur demande avec SOS Santé.",
  }),
  instrumentProduct({
    slug: "pince-foerster-striee",
    name: "Pince Foerster striée",
    shortName: "Pince Foerster",
    tagline: "Pince Foerster striée droite pour préhension tissulaire.",
    description:
      "Pince Foerster striée droite pour la saisie et le maintien de tissus mous lors d'actes médico-chirurgicaux.",
    extendedDescription:
      "Mâchoires striées pour une meilleure adhérence. Réservée à un usage professionnel. Demandez un devis pour connaître la disponibilité.",
    image: "/products/pince-foerster-striee.webp",
    alt: "Pince Foerster striée droite",
    specs: [
      { label: "Type", value: "Foerster striée" },
      { label: "Forme", value: "Droite" },
    ],
    included: ["Pince Foerster striée"],
    useCases: [
      {
        icon: "medical_services",
        title: "Chirurgie",
        description: "Maintien de tissus lors des gestes opératoires.",
      },
      {
        icon: "healing",
        title: "Soins spécialisés",
        description: "Usage en cabinet ou en structure hospitalière.",
      },
      {
        icon: "verified",
        title: "Qualité pro",
        description: "Instrument adapté aux exigences des professionnels.",
      },
    ],
    related: [],
    seoTitle: "Achat pince Foerster striée | SOS Santé",
    seoDescription:
      "Pince Foerster striée droite pour usage médical. Devis gratuit sur demande.",
  }),
  instrumentProduct({
    slug: "pince-jean-louis-faure",
    name: "Pince Jean-Louis Faure",
    shortName: "Pince J.-L. Faure",
    tagline: "Pince Jean-Louis Faure pour actes gynécologiques et chirurgicaux.",
    description:
      "Pince Jean-Louis Faure utilisée en gynécologie et en chirurgie pour la préhension et la stabilisation des tissus.",
    extendedDescription:
      "Instrument professionnel destiné aux praticiens formés. Contactez SOS Santé pour un devis et les informations de disponibilité.",
    image: "/products/pince-jean-louis-faure.webp",
    alt: "Pince Jean-Louis Faure",
    specs: [{ label: "Type", value: "Jean-Louis Faure" }],
    included: ["Pince Jean-Louis Faure"],
    useCases: [
      {
        icon: "pregnant_woman",
        title: "Gynécologie",
        description: "Actes nécessitant une pince de préhension adaptée.",
      },
      {
        icon: "medical_services",
        title: "Chirurgie",
        description: "Usage en bloc ou en cabinet spécialisé.",
      },
      {
        icon: "inventory_2",
        title: "Équipement cabinet",
        description: "Complément du plateau d'instruments.",
      },
    ],
    related: [],
    seoTitle: "Achat pince Jean-Louis Faure | SOS Santé",
    seoDescription:
      "Pince Jean-Louis Faure pour usage médical professionnel au Maroc.",
  }),
  instrumentProduct({
    slug: "pince-kelly",
    name: "Pince Kelly",
    shortName: "Pince Kelly",
    tagline: "Pince Kelly droite courbe pour hémostase et préhension.",
    description:
      "Pince Kelly droite courbe pour la compression de vaisseaux ou la préhension de tissus lors d'actes chirurgicaux.",
    extendedDescription:
      "Instrument couramment utilisé en chirurgie générale. Usage réservé aux professionnels de santé. Devis sur demande.",
    image: "/products/pince-kelly.webp",
    alt: "Pince Kelly droite courbe",
    specs: [
      { label: "Type", value: "Kelly" },
      { label: "Forme", value: "Droite courbe" },
    ],
    included: ["Pince Kelly"],
    useCases: [
      {
        icon: "medical_services",
        title: "Hémostase",
        description: "Compression temporaire de petits vaisseaux.",
      },
      {
        icon: "health_and_safety",
        title: "Bloc opératoire",
        description: "Instrument standard du plateau chirurgical.",
      },
      {
        icon: "school",
        title: "Formation médicale",
        description: "Outil de référence pour l'apprentissage des gestes.",
      },
    ],
    related: [],
    seoTitle: "Achat pince Kelly | SOS Santé",
    seoDescription:
      "Pince Kelly droite courbe pour usage chirurgical. Prix sur demande avec SOS Santé.",
  }),
  instrumentProduct({
    slug: "plateau-inox",
    name: "Plateau inox",
    shortName: "Plateau inox",
    tagline: "Plateau en inox pour instruments et petit matériel médical.",
    description:
      "Plateau en acier inoxydable pour organiser, transporter ou stériliser du matériel médical selon les protocoles en vigueur.",
    extendedDescription:
      "Plusieurs dimensions peuvent être disponibles selon les références (par exemple 200 × 150 mm, 235 × 190 mm ou 300 × 200 mm). Indiquez vos besoins lors de la demande de devis.",
    image: "/products/plateau-inox.webp",
    alt: "Plateau inox pour instruments médicaux",
    specs: [
      { label: "Matériau", value: "Inox" },
      { label: "Dimensions", value: "Selon référence" },
    ],
    included: ["Plateau inox"],
    useCases: [
      {
        icon: "medical_services",
        title: "Organisation",
        description: "Présentation du matériel avant ou après acte.",
      },
      {
        icon: "cleaning_services",
        title: "Nettoyage",
        description: "Surface adaptée à l'entretien et à la désinfection.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Usage courant en structure de soins.",
      },
    ],
    related: [],
    seoTitle: "Achat plateau inox | SOS Santé",
    seoDescription:
      "Plateau inox pour matériel médical au Maroc. Devis personnalisé sur demande.",
  }),
  instrumentProduct({
    slug: "sterilisateur-air-chaud",
    name: "Stérilisateur à air chaud",
    shortName: "Stérilisateur air chaud",
    tagline: "Étuve de stérilisation à air chaud pour instruments réutilisables.",
    description:
      "Stérilisateur à air chaud avec structure interne en inox, étagères réglables et ventilation pour une diffusion homogène de la chaleur.",
    extendedDescription:
      "Boîtier externe en inox, fermeture sécurisée et commande digitale. Différentes capacités peuvent être proposées selon les modèles (environ 20 L, 60 L ou 120 L). Contactez-nous pour le modèle adapté à votre activité et un devis détaillé.",
    image: "/products/sterilisateur-air-chaud.webp",
    alt: "Stérilisateur à air chaud pour instruments médicaux",
    specs: [
      { label: "Type", value: "Stérilisation à air chaud" },
      { label: "Structure", value: "Inox" },
      { label: "Capacité", value: "Selon modèle" },
    ],
    included: [
      "Stérilisateur à air chaud",
      "Étagères réglables",
      "Manuel d'utilisation",
    ],
    useCases: [
      {
        icon: "medical_services",
        title: "Cabinet médical",
        description: "Stérilisation d'instruments réutilisables.",
      },
      {
        icon: "local_hospital",
        title: "Clinique & laboratoire",
        description: "Équipement pour environnements exigeants.",
      },
      {
        icon: "verified",
        title: "Conformité",
        description: "À utiliser selon les protocoles et normes applicables.",
      },
    ],
    related: [],
    seoTitle: "Achat stérilisateur à air chaud | SOS Santé",
    seoDescription:
      "Stérilisateur à air chaud pour instruments médicaux au Maroc. Devis sur demande.",
  }),
  instrumentProduct({
    slug: "autoclave-sterilisation-vapeur",
    name: "Autoclave stérilisation à la vapeur",
    shortName: "Autoclave vapeur",
    tagline: "Autoclave automatique pour la stérilisation à la vapeur.",
    description:
      "Autoclave à stérilisation par la vapeur avec chambre et porte en acier inoxydable, cycles préprogrammés et écran LCD de suivi.",
    extendedDescription:
      "Équipement automatique conçu pour la stérilisation de matériel emballé ou non emballé selon les cycles disponibles. Des capacités d'environ 18 L ou 23 L peuvent être proposées selon les références. Contactez-nous pour connaître le modèle disponible et obtenir un devis.",
    image: "/products/autoclave-sterilisation-vapeur.webp",
    alt: "Autoclave de stérilisation à la vapeur",
    specs: [
      { label: "Type", value: "Stérilisation à la vapeur" },
      { label: "Chambre", value: "Inox" },
      { label: "Capacité", value: "Selon modèle (≈ 18 L ou 23 L)" },
    ],
    included: ["Autoclave stérilisation vapeur", "Manuel d'utilisation"],
    useCases: [
      {
        icon: "medical_services",
        title: "Cabinet & clinique",
        description: "Stérilisation d'instruments et de dispositifs réutilisables.",
      },
      {
        icon: "local_hospital",
        title: "Structures de soins",
        description: "Usage professionnel avec cycles préprogrammés.",
      },
      {
        icon: "verified",
        title: "Protocoles",
        description: "À utiliser selon les recommandations du fabricant.",
      },
    ],
    related: [],
    seoTitle: "Achat autoclave stérilisation vapeur | SOS Santé",
    seoDescription:
      "Autoclave de stérilisation à la vapeur pour usage médical au Maroc. Devis sur demande.",
  }),
  instrumentProduct({
    slug: "boite-inox-couvercle-instruments",
    name: "Boîte inox avec couvercle pour instruments",
    shortName: "Boîte inox instruments",
    tagline: "Boîte en inox avec couvercle pour ranger les petits instruments.",
    description:
      "Boîte en acier inoxydable avec couvercle pour le rangement et la protection de petits instruments médicaux (pinces, ciseaux, etc.).",
    extendedDescription:
      "Conçue pour un usage en cabinet ou en structure de soins. Plusieurs dimensions peuvent être disponibles selon les références. Indiquez vos besoins lors de la demande de devis.",
    image: "/products/boite-inox-couvercle-instruments.webp",
    alt: "Boîte inox avec couvercle pour instruments médicaux",
    specs: [
      { label: "Matériau", value: "Inox" },
      { label: "Dimensions", value: "Selon référence" },
    ],
    included: ["Boîte inox avec couvercle"],
    useCases: [
      {
        icon: "inventory_2",
        title: "Rangement",
        description: "Organisation des petits instruments sur le plateau.",
      },
      {
        icon: "cleaning_services",
        title: "Protection",
        description: "Couvercle pour limiter la contamination entre les actes.",
      },
      {
        icon: "medical_services",
        title: "Cabinet médical",
        description: "Usage courant en consultation et en soins.",
      },
    ],
    related: [],
    seoTitle: "Achat boîte inox instruments | SOS Santé",
    seoDescription:
      "Boîte inox avec couvercle pour instruments médicaux au Maroc. Prix sur demande.",
  }),
];
