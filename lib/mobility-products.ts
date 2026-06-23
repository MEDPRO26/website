import type { Product } from "@/lib/product-types";
import { PRICE_ON_REQUEST } from "@/lib/respiratory-products";

const mobilityStyle = "bg-secondary/15 text-secondary";
const city = "Agadir";

function mobilityProduct(
  data: Omit<Product, "category" | "categoryStyle" | "city" | "badges" | "priceLabel">
): Product {
  return {
    ...data,
    priceLabel: PRICE_ON_REQUEST,
    category: "Mobilier Médical",
    categoryStyle: mobilityStyle,
    city,
    badges: ["Mobilier Médical", "Disponible à la vente"],
  };
}

export const mobilityProducts: Product[] = [
  mobilityProduct({
    slug: "bequille-s-m-l",
    name: "Béquille S M L",
    shortName: "Béquille S M L",
    tagline: "Béquille d'aide à la marche disponible en trois tailles.",
    description:
      "Béquille d'appui pour faciliter la marche pendant une convalescence, une entorse ou une fracture. Proposée en tailles S, M et L pour s'adapter à la morphologie de l'utilisateur.",
    extendedDescription:
      "La béquille aide à décharger un membre inférieur tout en conservant une marche plus stable au quotidien. Elle convient à un usage intérieur comme extérieur sur sol plat. Nos conseillers vous orientent vers la taille adaptée à votre taille et à votre besoin.",
    image: "/products/bequille-s-m-l.webp",
    alt: "Béquille d'aide à la marche tailles S M L",
    specs: [
      { label: "Tailles disponibles", value: "S, M, L" },
      { label: "Usage", value: "Aide à la marche" },
      { label: "Vendu", value: "À l'unité" },
    ],
    included: ["Béquille (taille au choix)"],
    useCases: [
      {
        icon: "accessible",
        title: "Convalescence",
        description: "Soutien temporaire après blessure ou intervention.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Déplacements plus sûrs dans la maison.",
      },
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Appui complémentaire pour limiter la charge sur une jambe.",
      },
    ],
    related: [],
    seoTitle: "Achat béquille S M L | SOS Santé",
    seoDescription:
      "Achetez une béquille en taille S, M ou L au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "brancard-pliable-portable",
    name: "Brancard pliable et portable",
    shortName: "Brancard pliable",
    tagline: "Brancard léger en aluminium, pliable pour le transport et le rangement.",
    description:
      "Brancard pliable conçu pour le transfert et le transport d'un patient en position allongée. Structure en aluminium avec toile résistante, facile à nettoyer.",
    extendedDescription:
      "Ce brancard se replie en largeur et en longueur pour un rangement compact. Il est équipé de poignées de préhension et de pieds stables. Adapté aux structures de soins, aux cabinets et aux besoins de transport ponctuel à domicile.",
    image: "/products/brancard-pliable-portable.webp",
    alt: "Brancard pliable et portable en aluminium",
    specs: [
      { label: "Charge maximale", value: "159 kg" },
      { label: "Poids", value: "6 kg" },
      { label: "Structure", value: "Aluminium pliable" },
    ],
    included: [
      "Brancard pliable",
      "Toile plastifiée imperméable",
      "4 poignées et 4 pieds",
    ],
    useCases: [
      {
        icon: "local_hospital",
        title: "Transfert patient",
        description: "Transport allongé entre deux points de soins.",
      },
      {
        icon: "emergency",
        title: "Urgences & secours",
        description: "Évacuation ou mise en position allongée.",
      },
      {
        icon: "home_health",
        title: "Structures de soins",
        description: "Usage en cabinet, clinique ou à domicile.",
      },
    ],
    related: [],
    seoTitle: "Achat brancard pliable et portable | SOS Santé",
    seoDescription:
      "Achetez un brancard pliable et portable au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "canne-3eme-age-pliable",
    name: "Canne 3ème âge pliable",
    shortName: "Canne pliable",
    tagline: "Canne pliable en aluminium, légère et réglable en hauteur.",
    description:
      "Canne de marche pliable en aluminium, pensée pour offrir un appui stable au quotidien. Se range facilement dans un sac pour les déplacements.",
    extendedDescription:
      "Cette canne constitue un soutien pratique pour les personnes qui ont besoin d'un appui supplémentaire en marchant. Sa hauteur est réglable et sa conception pliable facilite le transport. Idéale pour un usage intérieur et extérieur.",
    image: "/products/canne-3eme-age-pliable.webp",
    alt: "Canne pliable 3ème âge en aluminium",
    specs: [
      { label: "Hauteur réglable", value: "82–92 cm" },
      { label: "Poids", value: "0,3 kg" },
      { label: "Matériau", value: "Aluminium" },
    ],
    included: ["Canne pliable"],
    useCases: [
      {
        icon: "elderly",
        title: "Seniors",
        description: "Appui léger pour les déplacements quotidiens.",
      },
      {
        icon: "luggage",
        title: "Transport",
        description: "Format pliable pour emporter facilement.",
      },
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Soutien complémentaire à la marche.",
      },
    ],
    related: [],
    seoTitle: "Achat canne 3ème âge pliable | SOS Santé",
    seoDescription:
      "Achetez une canne pliable pour seniors au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "canne-anglaise-reglages",
    name: "Canne anglaise réglages",
    shortName: "Canne anglaise",
    tagline: "Canne anglaise avec réglages pour un appui personnalisé.",
    description:
      "Canne anglaise à réglages pour accompagner la marche avec un appui latéral. Convient aux personnes en convalescence ou ayant besoin d'un soutien ponctuel.",
    extendedDescription:
      "La canne anglaise permet de décharger partiellement un membre inférieur tout en conservant une bonne stabilité. Ses réglages facilitent l'adaptation à la morphologie de l'utilisateur. Nos conseillers vous aident à choisir le modèle adapté à votre situation.",
    image: "/products/canne-anglaise-reglages.webp",
    alt: "Canne anglaise avec réglages",
    specs: [
      { label: "Type", value: "Canne anglaise" },
      { label: "Réglages", value: "Hauteur ajustable" },
      { label: "Usage", value: "Aide à la marche" },
    ],
    included: ["Canne anglaise"],
    useCases: [
      {
        icon: "accessible",
        title: "Convalescence",
        description: "Soutien après blessure ou intervention.",
      },
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Appui latéral pour décharger une jambe.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Déplacements plus confortables au quotidien.",
      },
    ],
    related: [],
    seoTitle: "Achat canne anglaise réglages | SOS Santé",
    seoDescription:
      "Achetez une canne anglaise réglable au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "canne-quadripode",
    name: "Canne quadripode",
    shortName: "Canne quadripode",
    tagline: "Canne à quatre pieds pour une marche plus stable.",
    description:
      "Canne en aluminium à base quadripode, offrant un appui élargi pour une meilleure stabilité à la marche. Hauteur réglable selon la taille de l'utilisateur.",
    extendedDescription:
      "Grâce à ses quatre points d'appui, cette canne convient aux personnes recherchant plus de sécurité en se déplaçant. Elle s'utilise en intérieur comme en extérieur sur surfaces planes. Réglable en hauteur pour un positionnement confortable.",
    image: "/products/canne-quadripode.webp",
    alt: "Canne quadripode en aluminium",
    specs: [
      { label: "Hauteur réglable", value: "72,5–95 cm" },
      { label: "Poids", value: "1,1 kg" },
      { label: "Base", value: "4 pieds" },
    ],
    included: ["Canne quadripode"],
    useCases: [
      {
        icon: "elderly",
        title: "Seniors",
        description: "Stabilité renforcée pour les déplacements.",
      },
      {
        icon: "balance",
        title: "Équilibre",
        description: "Base élargie pour limiter les risques de chute.",
      },
      {
        icon: "home",
        title: "Quotidien",
        description: "Usage courant à domicile ou en extérieur.",
      },
    ],
    related: [],
    seoTitle: "Achat canne quadripode | SOS Santé",
    seoDescription:
      "Achetez une canne quadripode au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "canne-seat-aluminium-pliable",
    name: "Canne seat en aluminium pliable",
    shortName: "Canne seat",
    tagline: "Canne pliable avec assise intégrée pour se reposer en déplacement.",
    description:
      "Canne en aluminium pliable équipée d'une assise et de trois pieds, pour alterner marche et repos. Poignée ergonomique pour un usage confortable.",
    extendedDescription:
      "Cette canne seat combine aide à la marche et siège de pause, pratique lors des files d'attente ou des promenades. L'assise permet de s'asseoir brièvement sans chercher un banc. Vérifiez la capacité de charge avant utilisation.",
    image: "/products/canne-seat-aluminium-pliable.webp",
    alt: "Canne seat pliable en aluminium avec assise",
    specs: [
      { label: "Capacité de charge", value: "80 kg" },
      { label: "Hauteur d'assise", value: "50 cm" },
      { label: "Assise", value: "21 cm" },
    ],
    included: ["Canne seat pliable", "Assise intégrée"],
    useCases: [
      {
        icon: "elderly",
        title: "Seniors",
        description: "Marche et repos ponctuel en un seul équipement.",
      },
      {
        icon: "event_seat",
        title: "Pauses",
        description: "Assise disponible lors des déplacements.",
      },
      {
        icon: "luggage",
        title: "Transport",
        description: "Format pliable pour le rangement.",
      },
    ],
    related: [],
    seoTitle: "Achat canne seat aluminium pliable | SOS Santé",
    seoDescription:
      "Achetez une canne seat pliable avec assise au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "canne-tripode",
    name: "Canne tripode",
    shortName: "Canne tripode",
    tagline: "Canne à trois pieds pour un appui stable et léger.",
    description:
      "Canne tripode à base élargie pour une meilleure stabilité à la marche. Réglable en hauteur avec une poignée confortable.",
    extendedDescription:
      "La base tripode offre un appui plus large qu'une canne classique, ce qui peut rassurer les personnes à mobilité réduite. Sa conception vise un bon compromis entre légèreté et solidité. Adaptée à un usage quotidien en intérieur et en extérieur.",
    image: "/products/canne-tripode.webp",
    alt: "Canne tripode à trois pieds",
    specs: [
      { label: "Base", value: "3 pieds" },
      { label: "Hauteur", value: "Réglable" },
      { label: "Usage", value: "Aide à la marche" },
    ],
    included: ["Canne tripode"],
    useCases: [
      {
        icon: "balance",
        title: "Stabilité",
        description: "Base tripode pour un appui élargi.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Soutien adapté aux déplacements quotidiens.",
      },
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Complément utile pour la marche autonome.",
      },
    ],
    related: [],
    seoTitle: "Achat canne tripode | SOS Santé",
    seoDescription:
      "Achetez une canne tripode au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "canne-tripode-reglable",
    name: "Canne tripode réglable",
    shortName: "Canne tripode réglable",
    tagline: "Canne tripode en aluminium, réglable en hauteur.",
    description:
      "Canne tripode en aluminium avec réglage de hauteur, pour un appui stable adapté à la taille de l'utilisateur.",
    extendedDescription:
      "Ce modèle tripode combine la stabilité d'une base à trois pieds avec un réglage de hauteur pour un positionnement confortable. Convient aux personnes recherchant un appui sécurisant au quotidien, en intérieur comme en extérieur sur sol plat.",
    image: "/products/canne-tripode-reglable.webp",
    alt: "Canne tripode réglable en aluminium",
    specs: [
      { label: "Matériau", value: "Aluminium" },
      { label: "Hauteur", value: "Réglable" },
      { label: "Base", value: "3 pieds" },
    ],
    included: ["Canne tripode réglable"],
    useCases: [
      {
        icon: "accessible",
        title: "Mobilité",
        description: "Appui stable pour la marche quotidienne.",
      },
      {
        icon: "tune",
        title: "Réglage",
        description: "Hauteur ajustable selon l'utilisateur.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Usage courant dans la maison et aux alentours.",
      },
    ],
    related: [],
    seoTitle: "Achat canne tripode réglable | SOS Santé",
    seoDescription:
      "Achetez une canne tripode réglable au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "chariot-pansement-inox-2-plateaux",
    name: "Chariot à pansement inox à 2 plateaux",
    shortName: "Chariot à pansement",
    tagline: "Chariot de soins en inox avec deux plateaux et rangements intégrés.",
    description:
      "Chariot à pansement entièrement en inox, conçu pour organiser le matériel de soins en cabinet ou à domicile. Deux plateaux à bords relevés, tiroir et accessoires pratiques pour les pansements.",
    extendedDescription:
      "Équipé d'une poubelle extérieure, d'une cuvette sur support pivotant et de roulettes avec galets pare-choc, ce chariot facilite les déplacements lors des soins. Sa structure en inox se nettoie facilement.",
    image: "/products/chariot-pansement-inox-2-plateaux.webp",
    alt: "Chariot à pansement inox à deux plateaux",
    specs: [
      { label: "Dimensions", value: "71 × 42 × 86 cm" },
      { label: "Plateaux", value: "2 (bords relevés)" },
      { label: "Matériau", value: "Inox" },
    ],
    included: [
      "2 plateaux",
      "1 tiroir",
      "Poubelle extérieure",
      "Cuvette sur support pivotant",
    ],
    useCases: [
      {
        icon: "medical_services",
        title: "Soins à domicile",
        description: "Organisation du matériel de pansement.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Chariot mobile pour les soins courants.",
      },
      {
        icon: "cleaning_services",
        title: "Hygiène",
        description: "Surface inox facile à désinfecter.",
      },
    ],
    related: [],
    seoTitle: "Achat chariot à pansement inox | SOS Santé",
    seoDescription:
      "Achetez un chariot à pansement inox à 2 plateaux au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "deambulateur-articule-pliable",
    name: "Déambulateur articulé pliable",
    shortName: "Déambulateur articulé",
    tagline: "Déambulateur pliable en aluminium, réglable en hauteur.",
    description:
      "Déambulateur articulé pliable en aluminium léger, avec embouts antidérapants. Offre un appui stable pour marcher en intérieur ou en extérieur sur sol plat.",
    extendedDescription:
      "Ce déambulateur se replie pour un rangement compact. Sa hauteur est réglable pour s'adapter à l'utilisateur. Convient aux adultes recherchant un soutien renforcé à la marche pendant une convalescence ou au quotidien.",
    image: "/products/deambulateur-articule-pliable.webp",
    alt: "Déambulateur articulé pliable en aluminium",
    specs: [
      { label: "Hauteur réglable", value: "74,5–92 cm" },
      { label: "Dimensions replié", value: "56 × 57 cm" },
      { label: "Capacité de charge", value: "100 kg" },
    ],
    included: ["Déambulateur articulé pliable"],
    useCases: [
      {
        icon: "accessible",
        title: "Convalescence",
        description: "Soutien après blessure ou intervention.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Marche plus sûre au quotidien.",
      },
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Appui sur les deux côtés pour plus de stabilité.",
      },
    ],
    related: [],
    seoTitle: "Achat déambulateur articulé pliable | SOS Santé",
    seoDescription:
      "Achetez un déambulateur articulé pliable au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "deambulateur-pliable-roues",
    name: "Déambulateur pliable à roues",
    shortName: "Déambulateur à roues",
    tagline: "Déambulateur pliable avec deux roues avant pour faciliter la marche.",
    description:
      "Déambulateur pliable en aluminium léger, muni de deux roues à l'avant. Hauteur réglable, adapté aux adultes ayant besoin d'un appui mobile.",
    extendedDescription:
      "Les roues avant permettent de faire rouler le déambulateur sans le soulever à chaque pas, tout en conservant la stabilité des appuis latéraux. Format pliable pour le transport et le rangement.",
    image: "/products/deambulateur-pliable-roues.webp",
    alt: "Déambulateur pliable à roues avant",
    specs: [
      { label: "Roues", value: "2 à l'avant" },
      { label: "Hauteur", value: "Réglable" },
      { label: "Capacité de charge", value: "100 kg" },
    ],
    included: ["Déambulateur pliable à roues"],
    useCases: [
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Déplacements plus fluides grâce aux roues avant.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Appui stable pour les trajets quotidiens.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Usage intérieur et extérieur sur sol plat.",
      },
    ],
    related: [],
    seoTitle: "Achat déambulateur pliable à roues | SOS Santé",
    seoDescription:
      "Achetez un déambulateur pliable à roues au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "divan-examen-mecanique-2-sections",
    name: "Divan d'examen mécanique 2 sections",
    shortName: "Divan 2 sections",
    tagline: "Divan d'examen à dossier réglable, adapté aux consultations.",
    description:
      "Divan d'examen mécanique à deux sections avec dossier réglable à crémaillère. Structure robuste et assise rembourrée pour le confort du patient.",
    extendedDescription:
      "Le divan est équipé de pieds réglables en caoutchouc et d'un porte-rouleau à l'arrière. Son revêtement lavable et son rembourrage dense conviennent à un usage professionnel en cabinet médical ou paramédical.",
    image: "/products/divan-examen-mecanique-2-sections.webp",
    alt: "Divan d'examen mécanique deux sections",
    specs: [
      { label: "Dimensions", value: "177 × 60 × 75 cm (H)" },
      { label: "Sections", value: "2" },
      { label: "Dossier", value: "Réglable à crémaillère" },
    ],
    included: ["Divan d'examen", "Porte-rouleau"],
    useCases: [
      {
        icon: "medical_services",
        title: "Consultation",
        description: "Examen et soins en position allongée ou semi-assise.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Équipement pour professionnels de santé.",
      },
      {
        icon: "healing",
        title: "Soins",
        description: "Confort du patient pendant l'examen.",
      },
    ],
    related: [],
    seoTitle: "Achat divan d'examen 2 sections | SOS Santé",
    seoDescription:
      "Achetez un divan d'examen mécanique 2 sections au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "divan-examen-mecanique-gynecologique-3-sections",
    name: "Divan d'examen mécanique gynécologique 3 sections",
    shortName: "Divan gynécologique",
    tagline: "Divan d'examen à trois sections avec accessoires gynécologiques.",
    description:
      "Divan d'examen mécanique à trois sections, avec dossier et partie antérieure réglables. Conçu pour les examens gynécologiques et les consultations spécialisées.",
    extendedDescription:
      "Livré avec genouillères anatomiques réglables, porte-rouleau et cuvette en inox. Les pieds réglables en caoutchouc assurent une bonne stabilité. Format démontable pour faciliter le transport et l'installation.",
    image: "/products/divan-examen-mecanique-gynecologique-3-sections.webp",
    alt: "Divan d'examen mécanique gynécologique trois sections",
    specs: [
      { label: "Dimensions", value: "181 × 60 × 78 cm (H)" },
      { label: "Sections", value: "3" },
      { label: "Cuvette", value: "Inox Ø 32 cm" },
    ],
    included: [
      "Divan 3 sections",
      "Genouillères réglables",
      "Porte-rouleau",
      "Cuvette inox",
    ],
    useCases: [
      {
        icon: "medical_services",
        title: "Gynécologie",
        description: "Examen en position adaptée avec accessoires dédiés.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet spécialisé",
        description: "Équipement pour consultations professionnelles.",
      },
      {
        icon: "healing",
        title: "Confort patient",
        description: "Sections réglables pour l'examen.",
      },
    ],
    related: [],
    seoTitle: "Achat divan d'examen gynécologique 3 sections | SOS Santé",
    seoDescription:
      "Achetez un divan d'examen gynécologique 3 sections au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "escabeau-2-marches",
    name: "Escabeau à 2 marches",
    shortName: "Escabeau 2 marches",
    tagline: "Escabeau en inox à deux marches antidérapantes.",
    description:
      "Escabeau à deux marches en acier inoxydable, avec marches recouvertes d'une surface antidérapante. Utile pour atteindre une hauteur en toute sécurité.",
    extendedDescription:
      "Compact et stable, cet escabeau convient aux environnements médicaux ou à domicile lorsque un petit dénivelé doit être franchi. Sa structure en inox se nettoie facilement.",
    image: "/products/escabeau-2-marches.webp",
    alt: "Escabeau à deux marches en inox",
    specs: [
      { label: "Marches", value: "2" },
      { label: "Hauteur", value: "38 cm" },
      { label: "Matériau", value: "Acier inoxydable" },
    ],
    included: ["Escabeau 2 marches"],
    useCases: [
      {
        icon: "home",
        title: "À domicile",
        description: "Accès à une hauteur modérée en sécurité.",
      },
      {
        icon: "local_hospital",
        title: "Structures de soins",
        description: "Usage en cabinet ou salle de soins.",
      },
      {
        icon: "stairs",
        title: "Accès facilité",
        description: "Deux marches antidérapantes.",
      },
    ],
    related: [],
    seoTitle: "Achat escabeau 2 marches inox | SOS Santé",
    seoDescription:
      "Achetez un escabeau à 2 marches au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "fauteuil-roulant-electrique-classique",
    name: "Fauteuil roulant électrique classique",
    shortName: "Fauteuil électrique",
    tagline: "Fauteuil roulant électrique pliable pour une mobilité autonome.",
    description:
      "Fauteuil roulant électrique classique, pliable pour faciliter le transport. Équipé d'accoudoirs fixes et de repose-pieds détachables.",
    extendedDescription:
      "Ce fauteuil permet une utilisation motorisée avec un indicateur d'autonomie de batterie. Il convient aux personnes ayant besoin d'une aide à la propulsion pour leurs déplacements quotidien. Nos conseillers vous accompagnent pour le choix et la mise en service.",
    image: "/products/fauteuil-roulant-electrique-classique.webp",
    alt: "Fauteuil roulant électrique classique pliable",
    specs: [
      { label: "Type", value: "Fauteuil roulant électrique" },
      { label: "Pliant", value: "Oui" },
      { label: "Repose-pieds", value: "Détachables" },
    ],
    included: ["Fauteuil roulant électrique", "Batterie avec indicateur"],
    useCases: [
      {
        icon: "accessible",
        title: "Mobilité autonome",
        description: "Déplacements motorisés sans effort de propulsion.",
      },
      {
        icon: "elderly",
        title: "Usage quotidien",
        description: "Trajets intérieurs et extérieurs adaptés.",
      },
      {
        icon: "battery_charging_full",
        title: "Autonomie",
        description: "Indicateur de charge de la batterie.",
      },
    ],
    related: [],
    seoTitle: "Achat fauteuil roulant électrique | SOS Santé",
    seoDescription:
      "Achetez un fauteuil roulant électrique classique au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "fauteuil-roulant-pliable-classique",
    name: "Fauteuil roulant pliable classique",
    shortName: "Fauteuil pliable",
    tagline: "Fauteuil roulant manuel pliable en acier chromé.",
    description:
      "Fauteuil roulant pliable classique avec siège et dossier en toile nylon, appuie-bras rembourrés et repose-pieds escamotables amovibles.",
    extendedDescription:
      "Sa structure en acier chromé et son format pliable en font un équipement pratique pour les déplacements temporaires ou quotidiens. Le dossier est équipé d'une poche arrière pour les petits effets personnels.",
    image: "/products/fauteuil-roulant-pliable-classique.webp",
    alt: "Fauteuil roulant pliable classique",
    specs: [
      { label: "Structure", value: "Acier chromé" },
      { label: "Siège & dossier", value: "Toile nylon" },
      { label: "Repose-pieds", value: "Escamotables et amovibles" },
    ],
    included: ["Fauteuil roulant pliable"],
    useCases: [
      {
        icon: "accessible",
        title: "Mobilité",
        description: "Déplacements manuels en intérieur et extérieur.",
      },
      {
        icon: "luggage",
        title: "Transport",
        description: "Format pliable pour le rangement en voiture.",
      },
      {
        icon: "accessible",
        title: "Convalescence",
        description: "Solution temporaire après blessure ou opération.",
      },
    ],
    related: [],
    seoTitle: "Achat fauteuil roulant pliable | SOS Santé",
    seoDescription:
      "Achetez un fauteuil roulant pliable classique au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "garde-robe-fixe-pliable",
    name: "Garde-robe fixe et pliable",
    shortName: "Chaise percée fixe",
    tagline: "Chaise percée 3 en 1 avec cadre en inox et seau inclus.",
    description:
      "Équipement 3 en 1 : chaise percée, cadre de toilettes et rehausseur de toilettes réglable en hauteur. Structure en acier inoxydable, seau fourni.",
    extendedDescription:
      "Cette solution facilite l'hygiène au quotidien pour les personnes à mobilité réduite. Le format pliable permet un rangement plus compact lorsqu'il n'est pas utilisé. Nos conseillers vous aident à choisir la configuration adaptée à votre espace.",
    image: "/products/garde-robe-fixe-pliable.webp",
    alt: "Chaise percée fixe et pliable en inox",
    specs: [
      { label: "Fonctions", value: "Chaise percée / cadre WC / rehausseur" },
      { label: "Matériau", value: "Acier inoxydable" },
      { label: "Seau", value: "Inclus" },
    ],
    included: ["Chaise percée 3 en 1", "Seau"],
    useCases: [
      {
        icon: "accessible",
        title: "Mobilité réduite",
        description: "Facilite l'accès aux toilettes à domicile.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Usage dans la salle de bain ou la chambre.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Confort et sécurité pour l'hygiène quotidienne.",
      },
    ],
    related: [],
    seoTitle: "Achat chaise percée fixe et pliable | SOS Santé",
    seoDescription:
      "Achetez une chaise percée 3 en 1 au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "garde-robe-pliable-roues",
    name: "Garde-robe pliable avec roues",
    shortName: "Chaise percée à roues",
    tagline: "Chaise percée mobile avec roues et hauteur réglable.",
    description:
      "Chaise percée pliable sur roues, avec accoudoirs fixes, poignée de poussée et hauteur réglable. Seau ergonomique amovible latéralement ou par le dessus.",
    extendedDescription:
      "Les roues arrière avec frein facilitent les déplacements et le positionnement. Le seau se retire par les côtés ou en soulevant l'assise. Adaptée à un usage à domicile pour les personnes ayant besoin d'aide pour se déplacer jusqu'aux toilettes.",
    image: "/products/garde-robe-pliable-roues.webp",
    alt: "Chaise percée pliable avec roues",
    specs: [
      { label: "Roues", value: "4 (2 avec frein)" },
      { label: "Hauteur", value: "Réglable" },
      { label: "Seau", value: "Amovible" },
    ],
    included: ["Chaise percée sur roues", "Seau ergonomique"],
    useCases: [
      {
        icon: "accessible",
        title: "Déplacements",
        description: "Transport facilité grâce aux roues.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Usage quotidien dans les pièces de vie.",
      },
      {
        icon: "elderly",
        title: "Autonomie",
        description: "Aide à l'hygiène avec plus de mobilité.",
      },
    ],
    related: [],
    seoTitle: "Achat chaise percée pliable avec roues | SOS Santé",
    seoDescription:
      "Achetez une chaise percée pliable sur roues au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "gueridon-inox",
    name: "Guéridon inox",
    shortName: "Guéridon inox",
    tagline: "Guéridon médical en inox à deux plateaux sur roulettes.",
    description:
      "Guéridon entièrement fabriqué en inox, avec deux plateaux et roulettes équipées de galets pare-choc. Pratique pour le matériel de soins en cabinet ou à domicile.",
    extendedDescription:
      "Mobile et facile à nettoyer, ce guéridon sert de support lors des soins et des consultations. Sa structure en inox résiste bien à l'usage intensif et à la désinfection.",
    image: "/products/gueridon-inox.webp",
    alt: "Guéridon médical inox à deux plateaux",
    specs: [
      { label: "Dimensions", value: "72 × 42,5 × 86,5 cm" },
      { label: "Plateaux", value: "2" },
      { label: "Matériau", value: "Inox" },
    ],
    included: ["Guéridon inox", "2 plateaux", "Roulettes"],
    useCases: [
      {
        icon: "medical_services",
        title: "Soins",
        description: "Support pour le matériel lors des soins.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet",
        description: "Équipement mobile pour les professionnels.",
      },
      {
        icon: "cleaning_services",
        title: "Hygiène",
        description: "Surface inox facile à entretenir.",
      },
    ],
    related: [],
    seoTitle: "Achat guéridon inox | SOS Santé",
    seoDescription:
      "Achetez un guéridon inox à 2 plateaux au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "lampe-chirurgical-led",
    name: "Lampe chirurgicale LED",
    shortName: "Lampe chirurgicale LED",
    tagline: "Éclairage LED haute intensité pour actes chirurgicaux et soins.",
    description:
      "Lampe chirurgicale à technologie LED avec bras flexible orientable. Plusieurs modes de fixation possibles selon l'installation.",
    extendedDescription:
      "Conçue pour fournir un éclairage précis lors d'interventions et d'actes médicaux. La source LED offre une longue durée de vie et une température de couleur adaptée aux environnements de soins.",
    image: "/products/lampe-chirurgical-led.webp",
    alt: "Lampe chirurgicale LED avec bras flexible",
    specs: [
      { label: "Source", value: "6 LEDs" },
      { label: "Intensité", value: "59 000 lx (à 30 cm)" },
      { label: "Bras flexible", value: "76 cm" },
    ],
    included: ["Lampe chirurgicale LED"],
    useCases: [
      {
        icon: "medical_services",
        title: "Chirurgie & soins",
        description: "Éclairage ciblé pour les actes médicaux.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Installation murale, sur table ou sur pied.",
      },
      {
        icon: "light_mode",
        title: "LED",
        description: "Éclairage durable et performant.",
      },
    ],
    related: [],
    seoTitle: "Achat lampe chirurgicale LED | SOS Santé",
    seoDescription:
      "Achetez une lampe chirurgicale LED au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "lampe-examen-led",
    name: "Lampe d'examen LED",
    shortName: "Lampe d'examen LED",
    tagline: "Lampe d'examen LED à intensité variable et bras orientable.",
    description:
      "Lampe d'examen à LED avec variateur d'intensité et bras flexible orientable dans toutes les directions. Adaptée aux consultations et examens cliniques.",
    extendedDescription:
      "L'éclairage LED assure une bonne visibilité lors des examens médicaux. Le bras flexible de 76 cm permet de positionner la lumière précisément sur la zone à examiner.",
    image: "/products/lampe-examen-led.webp",
    alt: "Lampe d'examen LED avec bras flexible",
    specs: [
      { label: "Source", value: "1 LED" },
      { label: "Intensité", value: "89 000 lx (à 30 cm)" },
      { label: "Bras flexible", value: "76 cm" },
    ],
    included: ["Lampe d'examen LED"],
    useCases: [
      {
        icon: "medical_services",
        title: "Examen clinique",
        description: "Éclairage précis pour les consultations.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Équipement pour professionnels de santé.",
      },
      {
        icon: "light_mode",
        title: "Intensité variable",
        description: "Réglage de la luminosité selon le besoin.",
      },
    ],
    related: [],
    seoTitle: "Achat lampe d'examen LED | SOS Santé",
    seoDescription:
      "Achetez une lampe d'examen LED au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "lit-electrique-3-articulations",
    name: "Lit électrique 3 articulations",
    shortName: "Lit électrique 3 artic.",
    tagline: "Lit médicalisé électrique à trois positions et hauteur variable.",
    description:
      "Lit électrique à 3 positions avec relève buste et relève jambes motorisés, hauteur réglable et barrières latérales amovibles. Livré avec potence à sérum.",
    extendedDescription:
      "Le plan de couchage en quatre sections et la structure en acier peint époxy offrent confort et robustesse. Les roulettes facilitent les déplacements du lit. Convient au maintien à domicile et aux structures de soins.",
    image: "/products/lit-electrique-3-articulations.webp",
    alt: "Lit médicalisé électrique trois articulations",
    specs: [
      { label: "Plan de couchage", value: "192,5 × 90 cm" },
      { label: "Hauteur variable", value: "43,5–74 cm" },
      { label: "Relève buste", value: "75° ± 10°" },
    ],
    included: ["Lit électrique", "Potence à sérum", "Barrières latérales"],
    useCases: [
      {
        icon: "bed",
        title: "Maintien à domicile",
        description: "Confort et positionnement électrique du patient.",
      },
      {
        icon: "elderly",
        title: "Personnes alitées",
        description: "Facilite les soins et le repos.",
      },
      {
        icon: "healing",
        title: "Convalescence",
        description: "Relève buste et jambes pour plus de confort.",
      },
    ],
    related: [],
    seoTitle: "Achat lit électrique 3 articulations | SOS Santé",
    seoDescription:
      "Achetez un lit médicalisé électrique 3 articulations au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "lit-electrique-3-positions",
    name: "Lit électrique 3 positions",
    shortName: "Lit électrique 3 pos.",
    tagline: "Lit électrique à trois positions avec barrières latérales pliantes.",
    description:
      "Lit électrique à 3 positions avec relève buste et relève jambes, barrières latérales pliantes en aluminium et roulettes avec frein à pédale.",
    extendedDescription:
      "Le plan de couchage amovible en quatre sections et le cadre en acier laminé époxy assurent solidité et entretien facilité. Capacité de levage jusqu'à 175 kg. Adapté au confort du patient à domicile ou en structure de soins.",
    image: "/products/lit-electrique-3-positions.webp",
    alt: "Lit médicalisé électrique trois positions",
    specs: [
      { label: "Dimensions", value: "212 × 96 cm" },
      { label: "Capacité de charge", value: "175 kg" },
      { label: "Relève buste", value: "0–80°" },
    ],
    included: ["Lit électrique", "Barrières latérales", "Roulettes avec frein"],
    useCases: [
      {
        icon: "bed",
        title: "Maintien à domicile",
        description: "Positions électriques pour le confort nocturne.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Facilite les soins et les changements de position.",
      },
      {
        icon: "home_health",
        title: "Soins à domicile",
        description: "Équipement adapté aux aidants et aux familles.",
      },
    ],
    related: [],
    seoTitle: "Achat lit électrique 3 positions | SOS Santé",
    seoDescription:
      "Achetez un lit médicalisé électrique 3 positions au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "lit-mecanique-2-articulations",
    name: "Lit mécanique 2 articulations",
    shortName: "Lit mécanique 2 artic.",
    tagline: "Lit médicalisé manuel à deux positions de relève.",
    description:
      "Lit mécanique à 2 positions avec relève buste et relève jambes manuels, barrières rabattables et roulettes avec frein. Livré avec potence à sérum.",
    extendedDescription:
      "Solution économique pour le maintien à domicile, sans motorisation. Les réglages manuels permettent d'adapter la position du patient. Tête et pied amovibles en ABS, porte-chaussures inclus.",
    image: "/products/lit-mecanique-2-articulations.webp",
    alt: "Lit médicalisé mécanique deux articulations",
    specs: [
      { label: "Plan de couchage", value: "192,5 × 83 cm" },
      { label: "Relève buste", value: "0–75° ± 10°" },
      { label: "Relève jambes", value: "0–35° ± 10°" },
    ],
    included: [
      "Lit mécanique",
      "Potence à sérum",
      "Barrières rabattables",
      "Porte-chaussures",
    ],
    useCases: [
      {
        icon: "bed",
        title: "Maintien à domicile",
        description: "Lit médicalisé sans alimentation électrique.",
      },
      {
        icon: "healing",
        title: "Convalescence",
        description: "Relève manuel pour plus de confort.",
      },
      {
        icon: "savings",
        title: "Solution accessible",
        description: "Alternative manuelle au lit électrique.",
      },
    ],
    related: [],
    seoTitle: "Achat lit mécanique 2 articulations | SOS Santé",
    seoDescription:
      "Achetez un lit médicalisé mécanique 2 articulations au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "matelas-anti-escarre-air-compresseur",
    name: "Matelas anti-escarre à air avec compresseur",
    shortName: "Matelas à air",
    tagline: "Matelas à cellules d'air avec compresseur pour la prévention des escarres.",
    description:
      "Matelas à air conçu pour aider à prévenir les escarres liées à un alitement prolongé. Comprend un compresseur et des cellules en PVC, avec fixation au lit par rabats.",
    extendedDescription:
      "Le compresseur peut être suspendu à l'extrémité du lit. Ce type de matelas alterne la pression sur les zones d'appui pour améliorer le confort du patient alité. À utiliser en complément d'un lit adapté et des conseils médicaux.",
    image: "/products/matelas-anti-escarre-air-compresseur.webp",
    alt: "Matelas anti-escarre à air avec compresseur",
    specs: [
      { label: "Type", value: "Matelas à cellules d'air" },
      { label: "Compresseur", value: "Inclus" },
      { label: "Matériau", value: "PVC" },
    ],
    included: ["Matelas à air", "Compresseur", "Fixations pour lit"],
    useCases: [
      {
        icon: "bed",
        title: "Alitement prolongé",
        description: "Aide à prévenir les escarres au lit.",
      },
      {
        icon: "home_health",
        title: "À domicile",
        description: "Complément d'un lit médicalisé.",
      },
      {
        icon: "healing",
        title: "Convalescence",
        description: "Confort pour les patients alités.",
      },
    ],
    related: [],
    seoTitle: "Achat matelas anti-escarre à air | SOS Santé",
    seoDescription:
      "Achetez un matelas anti-escarre à air avec compresseur au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "matelas-tubulaire-anti-escarres-air",
    name: "Next matelas tubulaire anti-escarres à air",
    shortName: "Matelas tubulaire",
    tagline: "Matelas à air à cellules alternées pour patients à risque moyen à élevé.",
    description:
      "Matelas tubulaire à air avec système de cellules indépendantes en alternance (1 sur 2). Pression ajustable selon le poids et le confort du patient.",
    extendedDescription:
      "Le cycle pré-réglé de 12 minutes contribue à soulager les pressions prolongées. Les cellules en polyester enduit polyuréthane offrent confort et durabilité. Destiné à la prévention active des escarres chez les patients alités.",
    image: "/products/matelas-tubulaire-anti-escarres-air.webp",
    alt: "Matelas tubulaire anti-escarres à air Next",
    specs: [
      { label: "Alternance", value: "1 cellule sur 2" },
      { label: "Cycle", value: "12 minutes" },
      { label: "Pression", value: "Ajustable" },
    ],
    included: ["Matelas tubulaire à air"],
    useCases: [
      {
        icon: "bed",
        title: "Patients alités",
        description: "Prévention active des escarres.",
      },
      {
        icon: "home_health",
        title: "Maintien à domicile",
        description: "Usage avec lit médicalisé.",
      },
      {
        icon: "healing",
        title: "Risque élevé",
        description: "Adapté aux patients à risque moyen à élevé.",
      },
    ],
    related: [],
    seoTitle: "Achat matelas tubulaire anti-escarres | SOS Santé",
    seoDescription:
      "Achetez un matelas tubulaire anti-escarres à air au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "paravent",
    name: "Paravent",
    shortName: "Paravent",
    tagline: "Paravent médical sur roulettes pour l'intimité des soins.",
    description:
      "Paravent à structure en tube chromé, panneaux lisses lavables en polyester. Disponible en version 2 ou 3 volets selon les besoins d'espace.",
    extendedDescription:
      "Monté sur roulettes pour un déplacement facile en cabinet, clinique ou à domicile. Les panneaux blancs en polyester se nettoient aisément. Utile pour créer une séparation lors des soins ou des examens.",
    image: "/products/paravent.webp",
    alt: "Paravent médical sur roulettes",
    specs: [
      { label: "2 volets", value: "100 × 187 cm" },
      { label: "3 volets", value: "150 × 187 cm" },
      { label: "Panneaux", value: "Polyester lavable" },
    ],
    included: ["Paravent sur roulettes"],
    useCases: [
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Intimité lors des soins et examens.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Séparation d'espace pour les soins.",
      },
      {
        icon: "cleaning_services",
        title: "Entretien",
        description: "Panneaux lisses faciles à nettoyer.",
      },
    ],
    related: [],
    seoTitle: "Achat paravent médical | SOS Santé",
    seoDescription:
      "Achetez un paravent médical sur roulettes au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "potence-perfusion-mobile",
    name: "Potence à perfusion mobile",
    shortName: "Potence perfusion",
    tagline: "Potence à perfusion mobile en inox, hauteur réglable.",
    description:
      "Potence à perfusion mobile en acier inoxydable, avec hauteur réglable et base à 5 branches sur roulettes. Équipée de 4 crochets pour suspendre les poches de perfusion.",
    extendedDescription:
      "Sa structure résistante à la corrosion et sa mobilité facilitent l'administration des thérapies intraveineuses en cabinet, à domicile ou en structure de soins. Hauteur ajustable pour s'adapter aux différentes situations.",
    image: "/products/potence-perfusion-mobile.webp",
    alt: "Potence à perfusion mobile standard",
    specs: [
      { label: "Hauteur réglable", value: "110–210 cm" },
      { label: "Crochets", value: "4 (inox)" },
      { label: "Base", value: "5 branches avec roulettes" },
    ],
    included: ["Potence à perfusion mobile", "4 crochets"],
    useCases: [
      {
        icon: "medical_services",
        title: "Perfusion",
        description: "Administration sécurisée de sérums.",
      },
      {
        icon: "local_hospital",
        title: "Structures de soins",
        description: "Usage en clinique ou à domicile.",
      },
      {
        icon: "home_health",
        title: "Soins à domicile",
        description: "Mobile et facile à déplacer.",
      },
    ],
    related: [],
    seoTitle: "Achat potence à perfusion mobile | SOS Santé",
    seoDescription:
      "Achetez une potence à perfusion mobile au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "potence-serum",
    name: "Potence à sérum",
    shortName: "Potence à sérum",
    tagline: "Potence à sérum en inox avec crochets détachables.",
    description:
      "Potence à sérum avec tige en inox et deux crochets détachables pour suspendre les poches de perfusion au chevet du patient.",
    extendedDescription:
      "Équipement simple et robuste, adapté à un usage au lit ou en complément d'un lit médicalisé équipé d'emplacements pour potence. Convient aux soins à domicile sous prescription médicale.",
    image: "/products/potence-serum.webp",
    alt: "Potence à sérum en inox",
    specs: [
      { label: "Matériau", value: "Inox" },
      { label: "Crochets", value: "2 détachables" },
      { label: "Usage", value: "Perfusion au lit" },
    ],
    included: ["Potence à sérum", "2 crochets"],
    useCases: [
      {
        icon: "medical_services",
        title: "Perfusion",
        description: "Suspension de poches de sérum.",
      },
      {
        icon: "bed",
        title: "Au chevet",
        description: "Complément d'un lit médicalisé.",
      },
      {
        icon: "home_health",
        title: "Domicile",
        description: "Soins intraveineux à domicile.",
      },
    ],
    related: [],
    seoTitle: "Achat potence à sérum | SOS Santé",
    seoDescription:
      "Achetez une potence à sérum en inox au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "rollator-aluminium-4-roues",
    name: "Rollator aluminium 4 roues",
    shortName: "Rollator 4 roues",
    tagline: "Rollator pliable en aluminium avec siège et panier.",
    description:
      "Rollator en aluminium pliable et démontable, équipé d'un siège, de freins à main et d'un panier. Hauteur des poignées réglable pour un usage confortable.",
    extendedDescription:
      "Ce déambulateur à quatre roues permet de marcher en sécurité tout en offrant un siège pour se reposer. Les freins à main facilitent l'immobilisation. Adapté aux seniors et aux personnes en convalescence pour les déplacements intérieurs et extérieurs.",
    image: "/products/rollator-aluminium-4-roues.webp",
    alt: "Rollator en aluminium à quatre roues avec siège",
    specs: [
      { label: "Hauteur poignées", value: "77–87 cm (réglable)" },
      { label: "Hauteur assise", value: "54 cm" },
      { label: "Freins", value: "2 freins à main" },
    ],
    included: ["Rollator 4 roues", "Siège", "Panier"],
    useCases: [
      {
        icon: "directions_walk",
        title: "Marche assistée",
        description: "Déplacements avec appui et siège de repos.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Autonomie renforcée au quotidien.",
      },
      {
        icon: "luggage",
        title: "Transport",
        description: "Format pliable et démontable.",
      },
    ],
    related: [],
    seoTitle: "Achat rollator aluminium 4 roues | SOS Santé",
    seoDescription:
      "Achetez un rollator aluminium à 4 roues au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "table-manger",
    name: "Table à manger",
    shortName: "Table à manger",
    tagline: "Table de lit réglable en hauteur sur roulettes.",
    description:
      "Table à manger en bois sur piétement en acier forme H, avec hauteur réglable et roulettes à frein. Disponible en version 1 ou 2 plateaux réglables.",
    extendedDescription:
      "Facilite les repas au lit ou au fauteuil pour les personnes à mobilité réduite. Les roulettes avec frein à pédale permettent de positionner la table en toute sécurité. Nos conseillers vous orientent vers le modèle adapté.",
    image: "/products/table-manger.webp",
    alt: "Table à manger médicale réglable sur roulettes",
    specs: [
      { label: "Hauteur", value: "Réglable" },
      { label: "Roulettes", value: "Avec frein à pédale (45 mm)" },
      { label: "Plateaux", value: "1 ou 2 (selon modèle)" },
    ],
    included: ["Table à manger sur roulettes"],
    useCases: [
      {
        icon: "restaurant",
        title: "Repas au lit",
        description: "Prise de repas en position allongée ou assise.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Confort alimentaire à domicile.",
      },
      {
        icon: "home",
        title: "Maintien à domicile",
        description: "Accessoire pour lit médicalisé.",
      },
    ],
    related: [],
    seoTitle: "Achat table à manger médicale | SOS Santé",
    seoDescription:
      "Achetez une table à manger réglable au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "table-examen",
    name: "Table d'examen",
    shortName: "Table d'examen",
    tagline: "Table d'examen avec dossier réglable et assise rembourrée.",
    description:
      "Table d'examen à structure en acier avec revêtement époxy, dossier réglable par crémaillère et assise en mousse haute densité. Pieds antidérapants.",
    extendedDescription:
      "Conçue pour les consultations et examens en position allongée ou semi-assise. Les dimensions généreuses et le dossier réglable offrent confort au patient et praticité au praticien.",
    image: "/products/table-examen.webp",
    alt: "Table d'examen médicale avec dossier réglable",
    specs: [
      { label: "Dimensions", value: "190 × 60 × 68 cm" },
      { label: "Dossier", value: "0–60° (crémaillère)" },
      { label: "Mousse", value: "Haute densité (30 kg/m³)" },
    ],
    included: ["Table d'examen"],
    useCases: [
      {
        icon: "medical_services",
        title: "Consultation",
        description: "Examen en cabinet médical.",
      },
      {
        icon: "local_hospital",
        title: "Professionnels",
        description: "Équipement pour cabinets et cliniques.",
      },
      {
        icon: "healing",
        title: "Confort patient",
        description: "Assise rembourrée et dossier réglable.",
      },
    ],
    related: [],
    seoTitle: "Achat table d'examen | SOS Santé",
    seoDescription:
      "Achetez une table d'examen au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  mobilityProduct({
    slug: "tabouret",
    name: "Tabouret",
    shortName: "Tabouret",
    tagline: "Tabouret médical sur roulettes avec siège rembourré.",
    description:
      "Tabouret à base en acier inoxydable, siège en cuir PU avec éponge haute densité. Équipé de cinq roulettes pour une mobilité fluide.",
    extendedDescription:
      "Ce tabouret convient aux professionnels de santé lors des soins et des consultations, ou comme assise mobile à domicile. La base stable et les roulettes facilitent les déplacements courts.",
    image: "/products/tabouret.webp",
    alt: "Tabouret médical sur cinq roulettes",
    specs: [
      { label: "Base", value: "Inox Ø 45 cm" },
      { label: "Roulettes", value: "5" },
      { label: "Assise", value: "Cuir PU, éponge haute densité" },
    ],
    included: ["Tabouret sur roulettes"],
    useCases: [
      {
        icon: "medical_services",
        title: "Soins",
        description: "Assise mobile pour les professionnels.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet",
        description: "Usage lors des consultations.",
      },
      {
        icon: "home",
        title: "Domicile",
        description: "Assise pratique et mobile.",
      },
    ],
    related: [],
    seoTitle: "Achat tabouret médical | SOS Santé",
    seoDescription:
      "Achetez un tabouret médical sur roulettes au Maroc. Livraison et conseil avec SOS Santé.",
  }),
];
