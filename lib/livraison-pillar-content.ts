import { ABOUT_PATH } from "@/lib/about-content";
import type { LocationPillarContent } from "@/lib/location-pillar-content";
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
  venteProductPath,
} from "@/lib/routes";
import { livraisonPillarSidebar } from "@/lib/pillar-sidebar-products";
import { venteProductCityLinks } from "@/lib/pillar-city-product-links";

export const livraisonPillarContent: LocationPillarContent = {
  path: LIVRAISON_PILLAR_PATH,
  heroImage: "/pillars/livraison-materiel-medical-domicile-maroc.webp",
  heroImageAlt:
    "Livraison de matériel médical à domicile au Maroc — lit médicalisé électrique et matelas livrés chez le patient",
  heroImageTitle: "Livraison de matériel médical à domicile | SOS Santé",
  metaTitle: "Livraison matériel médical Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc organise la livraison de matériel médical à domicile : lit médicalisé, fauteuil roulant, oxygène et équipements selon disponibilité.",
  keywords: [
    "livraison matériel médical Maroc",
    "livraison de matériel médical au Maroc",
    "livraison matériel médical à domicile Maroc",
    "installation matériel médical à domicile Maroc",
    "livraison lit médicalisé Maroc",
    "livraison fauteuil roulant Maroc",
    "livraison concentrateur d'oxygène Maroc",
    "récupération matériel médical après location Maroc",
  ],
  badge: "Service national · Livraison",
  h1: "Livraison de matériel médical à domicile au Maroc",
  heroTitleSuffix: "partout au Maroc selon disponibilité",
  heroLead:
    "SOS Santé Maroc aide les familles à organiser la livraison de matériel médical à domicile : lit médicalisé, fauteuil roulant, déambulateur, matelas anti-escarres, chaise percée, table de lit, concentrateur d’oxygène et autres équipements selon la ville et la disponibilité.",
  secondaryCtaLabel: "Voir les équipements livrables",
  primaryCtaLabel: "Demander une livraison sur WhatsApp",
  reassurance: [
    "Livraison de matériel médical à domicile",
    "Coordination avec fournisseurs partenaires",
    "Installation possible selon le matériel",
    "Récupération après location selon disponibilité",
    "Service disponible dans plusieurs villes du Maroc",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je souhaite une livraison de matériel médical à domicile. Ville, adresse et matériel : ",
  introTitle: "Faire livrer du matériel médical à domicile",
  intro: [
    "Lorsqu’un proche a besoin d’un équipement médical à domicile, la livraison devient souvent aussi importante que le matériel lui-même. Une famille peut trouver un lit médicalisé, un fauteuil roulant ou un concentrateur d’oxygène, mais ne pas savoir comment transporter l’équipement, comment l’installer, ni comment organiser la récupération après utilisation.",
    "La livraison de matériel médical à domicile au Maroc permet de simplifier cette étape. Elle aide les familles à recevoir l’équipement directement à l’adresse du patient, selon la ville, la disponibilité du matériel et les conditions du fournisseur partenaire.",
    "SOS Santé Maroc accompagne les familles dans cette organisation. Le service reçoit la demande, identifie le matériel recherché, vérifie les disponibilités, coordonne la livraison et peut aider à organiser l’installation ou la récupération lorsque cela est possible.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service marocain de coordination, d’orientation et de mise en relation. Son rôle est d’aider les familles à trouver une solution pratique pour recevoir du matériel médical à domicile, sans multiplier les appels et les déplacements.",
    "Cette page est dédiée à la livraison. Pour la location ou l’achat du matériel, consultez les pages dédiées : Location de matériel médical au Maroc et Vente de matériel médical au Maroc.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/livraison/livraison-lit-mecanique-maroc.webp",
      alt: "Livraison lit médicalisé mécanique à domicile au Maroc",
      title: "Livraison lit médicalisé au Maroc",
      caption: "Lit médicalisé mécanique livré à domicile",
    },
    equipment: {
      src: "/pillars/livraison/livraison-leve-personne-maroc.webp",
      alt: "Livraison lève-personne électrique pour transfert patient à domicile au Maroc",
      title: "Livraison lève-personne au Maroc",
      caption: "Lève-personne électrique",
    },
    process: {
      src: "/pillars/livraison/livraison-brancard-pliable-maroc.webp",
      alt: "Livraison brancard pliable portable pour transport patient au Maroc",
      title: "Livraison brancard au Maroc",
      caption: "Brancard pliable portable",
    },
    cities: {
      src: "/pillars/livraison/livraison-potence-perfusion-maroc.webp",
      alt: "Livraison potence de perfusion mobile à domicile au Maroc",
      title: "Livraison potence de perfusion au Maroc",
      caption: "Potence de perfusion mobile",
    },
  },
  whyTitle: "Pourquoi la livraison de matériel médical est importante ?",
  whyParagraphs: [
    "La livraison de matériel médical répond à un besoin très concret : les familles ne peuvent pas toujours se déplacer, transporter un équipement volumineux ou l’installer seules.",
    "Un lit médicalisé, un matelas anti-escarres, un lève-personne ou un concentrateur d’oxygène ne sont pas toujours faciles à récupérer dans un magasin ou chez un fournisseur. Même un fauteuil roulant ou une chaise percée peut devenir difficile à transporter si la famille est pressée, si le patient est déjà à domicile ou si le besoin arrive rapidement après une hospitalisation.",
    "La livraison permet de gagner du temps, d’éviter les déplacements inutiles et d’organiser une solution directement chez le patient. Elle est particulièrement utile lorsque la famille doit préparer un retour à domicile, accompagner une personne âgée ou répondre à une situation de mobilité réduite.",
    "Avec SOS Santé Maroc, la famille peut expliquer son besoin une seule fois. L’équipe aide ensuite à vérifier si le matériel est disponible et si une livraison peut être organisée dans la ville concernée.",
  ],
  situationsTitle: "Dans quelles situations demander une livraison de matériel médical ?",
  situationsIntro:
    "La livraison de matériel médical à domicile au Maroc est surtout demandée pour un retour après hospitalisation, une personne âgée, une convalescence, une mobilité réduite ou un besoin respiratoire confirmé.",
  situations: [
    {
      title: "Retour à domicile après hospitalisation",
      paragraphs: [
        "Après une hospitalisation, le retour à domicile doit souvent être organisé rapidement. Le patient peut avoir besoin d’un lit médicalisé, d’un fauteuil roulant, d’un matelas anti-escarres ou d’une chaise percée avant même son arrivée à la maison.",
        "La livraison permet de préparer le domicile à l’avance. SOS Santé Maroc peut aider à coordonner la demande selon le matériel recherché et la disponibilité locale.",
      ],
    },
    {
      title: "Personne âgée à domicile",
      paragraphs: [
        "Pour une personne âgée, certains équipements peuvent devenir nécessaires progressivement : déambulateur, fauteuil roulant, lit médicalisé, table de lit ou chaise percée. La livraison évite à la famille de devoir se déplacer avec un matériel parfois lourd ou encombrant.",
        "Si une présence humaine est aussi nécessaire, la famille peut compléter l’équipement par une aide à domicile ou une garde-malade via la page dédiée.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Convalescence après opération",
      paragraphs: [
        "Après une opération, une personne peut avoir besoin temporairement d’un fauteuil roulant, de béquilles ou d’un déambulateur. Une livraison à domicile permet de recevoir rapidement l’équipement nécessaire pendant la période de récupération.",
        "Pour un besoin temporaire, la location reste souvent la meilleure option ; cette page se concentre sur l’organisation logistique de la livraison.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Mobilité réduite",
      paragraphs: [
        "Lorsque la personne a des difficultés à se déplacer, il est plus logique que le matériel arrive directement à domicile. La livraison peut concerner les fauteuils roulants, les déambulateurs, les béquilles, les lève-personnes ou les équipements de confort.",
        "Pour explorer les équipements de déplacement, consultez la page Matériel de mobilité au Maroc.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Besoin respiratoire confirmé",
      paragraphs: [
        "Pour un concentrateur d’oxygène ou un autre matériel respiratoire, la livraison peut être organisée selon disponibilité. Le choix et l’utilisation de ce matériel doivent toujours suivre les recommandations d’un professionnel de santé.",
        "SOS Santé Maroc peut aider à coordonner la recherche et la livraison, sans donner de prescription. Le détail des équipements respiratoires se trouve sur la page dédiée.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
  ],
  midCtaTitle: "Besoin d’organiser une livraison rapidement ?",
  midCtaText:
    "Indiquez votre ville, votre adresse et le matériel recherché : SOS Santé Maroc vérifie la disponibilité et les possibilités de livraison.",
  cityMoneyBlock: {
    title: "Faire livrer du matériel médical dans votre ville",
    text: "Choisissez votre ville pour voir le matériel disponible localement et demander une livraison à domicile selon disponibilité.",
    image: {
      src: "/pillars/livraison/livraison-villes-catalogue-maroc.webp",
      alt: "Livraison de matériel médical à domicile au Maroc — installation et catalogues par ville",
      title: "Livraison de matériel médical dans votre ville | SOS Santé",
    },
    cities: [
      {
        name: "Casablanca",
        href: hubCityPath("casablanca"),
        label: "Casablanca",
      },
      {
        name: "Agadir",
        href: hubCityPath("agadir"),
        label: "Agadir",
      },
      {
        name: "Rabat",
        href: hubCityPath("rabat"),
        label: "Rabat",
      },
      {
        name: "Marrakech",
        href: hubCityPath("marrakech"),
        label: "Marrakech",
      },
      {
        name: "Tanger",
        href: hubCityPath("tanger"),
        label: "Tanger",
      },
    ],
  },
  equipmentTitle: "Quels équipements peuvent être livrés à domicile ?",
  equipmentIntro:
    "SOS Santé Maroc peut aider à organiser la livraison de plusieurs types de matériel médical selon disponibilité dans la ville concernée. Les modèles, délais et conditions varient selon les fournisseurs partenaires.",
  equipment: [
    {
      id: "lit-medicalise",
      title: "Livraison de lit médicalisé au Maroc",
      icon: "bed",
      paragraphs: [
        "Le lit médicalisé est un équipement volumineux. Il est difficile à transporter sans organisation. La livraison de lit médicalisé à domicile permet à la famille de recevoir le matériel directement dans la chambre du patient selon les conditions du fournisseur.",
        "Selon disponibilité, l’installation peut aussi être coordonnée. Pour louer ou acheter le lit, consultez les pages location et vente, ainsi que le hub confort médical.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      id: "fauteuil-roulant",
      title: "Livraison de fauteuil roulant au Maroc",
      icon: "accessible",
      paragraphs: [
        "Le fauteuil roulant peut être livré à domicile pour une personne âgée, un patient en convalescence ou une personne à mobilité réduite. Cette solution évite à la famille de se déplacer, surtout lorsque le besoin est urgent ou temporaire.",
        "Selon le besoin, la famille peut ensuite être orientée vers la location ou la vente. Pour une vue d’ensemble des aides à la mobilité, consultez la page dédiée.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      id: "deambulateur",
      title: "Livraison de déambulateur au Maroc",
      icon: "elderly",
      paragraphs: [
        "Le déambulateur est un équipement d’aide à la marche. La livraison peut être utile pour les personnes âgées ou les patients qui reprennent progressivement la marche après une période de fatigue, blessure ou rééducation.",
        "SOS Santé Maroc aide à vérifier la disponibilité et à organiser la livraison selon la ville.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      id: "bequilles",
      title: "Livraison de béquilles au Maroc",
      icon: "orthopedics",
      paragraphs: [
        "Les béquilles sont souvent demandées après une blessure ou une opération. La livraison à domicile peut être pratique lorsque la personne ne peut pas se déplacer facilement ou lorsque la famille souhaite une solution rapide.",
        "Pour un besoin court, la location de béquilles reste souvent la solution la plus logique ; cette page couvre surtout l’organisation de la livraison.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      id: "matelas-anti-escarres",
      title: "Livraison de matelas anti-escarres au Maroc",
      icon: "airline_seat_flat",
      paragraphs: [
        "Le matelas anti-escarres est souvent associé à un lit médicalisé ou demandé pour une personne alitée. Sa livraison permet d’équiper le domicile sans difficulté de transport.",
        "Le choix de ce type de matelas doit rester adapté à la situation du patient. En cas de besoin médical sensible, la famille doit suivre l’avis d’un professionnel de santé.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      id: "leve-personne",
      title: "Livraison de lève-personne au Maroc",
      icon: "elevator",
      paragraphs: [
        "Le lève-personne est un matériel de transfert souvent volumineux. Sa livraison doit être organisée avec attention, en tenant compte de l’accès au logement, de l’espace disponible et des conditions d’utilisation.",
        "Indiquer l’étage, l’ascenseur et la largeur des portes lors de la demande facilite la coordination.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      id: "chaise-percee",
      title: "Livraison de chaise percée au Maroc",
      icon: "chair_alt",
      paragraphs: [
        "La chaise percée peut être livrée à domicile pour une personne âgée, dépendante, alitée ou en convalescence. C’est un équipement pratique qui facilite l’organisation du quotidien à domicile.",
        "Elle peut être demandée seule ou avec d’autres équipements de confort selon disponibilité.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      id: "table-de-lit",
      title: "Livraison de table de lit médicalisée au Maroc",
      icon: "table_restaurant",
      paragraphs: [
        "La table de lit médicalisée peut être livrée avec un lit médicalisé ou séparément selon disponibilité. Elle permet de faciliter les repas, la lecture ou certaines activités quotidiennes du patient installé au lit.",
        "SOS Santé Maroc aide à vérifier si cet accessoire peut être associé à la livraison principale.",
      ],
      link: {
        label: "Voir une table de lit (vente)",
        href: venteProductPath("table-manger", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "table-manger",
        "Voir la table de lit à l’achat dans votre ville :"
      ),
    },
    {
      id: "concentrateur-oxygene",
      title: "Livraison de concentrateur d’oxygène au Maroc",
      icon: "air",
      paragraphs: [
        "Le concentrateur d’oxygène peut être livré selon disponibilité lorsque le besoin est confirmé. Ce matériel doit être utilisé selon les recommandations d’un professionnel de santé.",
        "SOS Santé Maroc peut aider à organiser la recherche et la livraison, sans donner de prescription médicale. Pour le détail des équipements respiratoires, consultez la page dédiée.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
  ],
  chooseTitle: "Installation de matériel médical à domicile",
  chooseIntro:
    "Certains équipements nécessitent une installation ou au minimum une bonne mise en place. C’est notamment le cas des lits médicalisés, des matelas anti-escarres, des lève-personnes ou de certains équipements respiratoires. L’installation dépend du type de matériel, de la ville, du fournisseur partenaire et de la disponibilité.",
  chooseBlocks: [
    {
      title: "Installation coordonnée avec la livraison",
      paragraphs: [
        "SOS Santé Maroc peut aider à vérifier si l’installation est possible et à coordonner cette étape avec la livraison. L’objectif est que la famille puisse utiliser le matériel dans de bonnes conditions dès l’arrivée, sans improviser le montage seule.",
        "Ce n’est pas un service médical : l’installation concerne la mise en place pratique de l’équipement selon les conditions du partenaire.",
      ],
    },
    {
      title: "Informations utiles avant l’installation",
      paragraphs: [
        "Pour faciliter la livraison et l’installation, préparez : ville et quartier, adresse exacte, étage et présence d’ascenseur, largeur des portes ou accès difficile, emplacement prévu pour le matériel, type de matériel demandé, besoin d’installation ou simple livraison, et durée estimée si le matériel est loué.",
        "Ces informations permettent de mieux organiser la demande et d’éviter les imprévus le jour de la livraison.",
      ],
    },
    {
      title: "Équipements souvent concernés",
      paragraphs: [
        "Les demandes d’installation concernent surtout le lit médicalisé, le matelas anti-escarres, le lève-personne et certains équipements respiratoires. Un fauteuil roulant ou un déambulateur nécessitent souvent une simple livraison avec prise en main.",
        "Précisez toujours si vous avez besoin d’une installation complète ou uniquement d’une livraison à l’adresse.",
      ],
    },
    {
      title: "Lien avec la location ou la vente",
      paragraphs: [
        "L’installation peut accompagner une location temporaire ou un achat durable. La logistique reste le sujet de cette page ; le choix location / vente se traite sur les pages dédiées.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc pour la livraison ?",
  processIntro:
    "Le parcours est conçu pour rester simple : clarifier l’adresse et le matériel, vérifier la disponibilité, confirmer les modalités, puis organiser la livraison et le suivi.",
  processSteps: [
    {
      title: "Le client envoie sa demande",
      text: "La famille contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Elle indique la ville, le matériel recherché, l’adresse et le délai souhaité.",
    },
    {
      title: "SOS Santé Maroc vérifie les informations",
      text: "L’équipe clarifie les éléments pratiques : étage, accès, besoin d’installation, disponibilité du patient ou de la famille, type d’équipement et urgence de la demande.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc contacte ou vérifie auprès des fournisseurs partenaires disponibles dans la ville concernée. Les délais et conditions peuvent varier selon la localisation et le matériel.",
    },
    {
      title: "Confirmation de la solution",
      text: "Lorsque la disponibilité est confirmée, SOS Santé Maroc communique les informations nécessaires à la famille : matériel disponible, conditions, délai possible, installation éventuelle et modalités.",
    },
    {
      title: "Livraison à domicile",
      text: "La livraison est organisée à l’adresse indiquée selon disponibilité. Pour certains équipements, l’installation peut être prévue en même temps.",
    },
    {
      title: "Suivi après livraison",
      text: "SOS Santé Maroc peut rester disponible pour le suivi, une demande complémentaire, une prolongation, une récupération ou un autre équipement.",
    },
  ],
  durationTitle: "Récupération du matériel et préparation de la livraison",
  durationIntro:
    "La livraison ne s’arrête pas à l’arrivée du matériel. La récupération après location et la préparation des informations pratiques font partie de la logistique à domicile.",
  durationBlocks: [
    {
      title: "Récupération après location",
      paragraphs: [
        "Après une période de location, la famille peut avoir besoin de faire récupérer le matériel médical à domicile. Cette étape est importante, surtout pour les équipements volumineux comme un lit médicalisé, un matelas anti-escarres, un fauteuil roulant ou un lève-personne.",
        "SOS Santé Maroc peut aider à organiser la récupération selon disponibilité et conditions du fournisseur partenaire. La récupération peut dépendre de la ville, de l’adresse, du type de matériel et de la date souhaitée.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Adresse et accès",
      paragraphs: [
        "Indiquez l’adresse exacte, le quartier, l’étage, l’existence d’un ascenseur et les éventuelles difficultés d’accès. Ces détails sont importants pour les équipements volumineux.",
      ],
      bullets: [
        "Ville et quartier",
        "Adresse exacte",
        "Étage et ascenseur",
        "Accès difficile éventuel",
      ],
    },
    {
      title: "Matériel, délai et installation",
      paragraphs: [
        "Précisez le matériel souhaité, le délai souhaité, le besoin d’installation et, si le matériel est loué, la durée prévue. Ces éléments aident à mieux organiser la location, une prolongation éventuelle et la récupération.",
      ],
      bullets: [
        "Type de matériel demandé",
        "Délai souhaité",
        "Installation ou simple livraison",
        "Durée estimée si location",
      ],
    },
  ],
  citiesTitle: "Livraison de matériel médical dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc peut traiter les demandes de livraison de matériel médical dans plusieurs villes du Maroc selon disponibilité. Les pages villes précisent le contexte local sans remplacer ce hub national.",
  cities: [
    {
      name: "Casablanca",
      title: "Livraison de matériel médical à Casablanca",
      paragraphs: [
        "À Casablanca, la demande de livraison de matériel médical à domicile peut concerner un lit médicalisé, un fauteuil roulant, un déambulateur, un matelas anti-escarres ou un concentrateur d’oxygène. SOS Santé Maroc aide à vérifier les disponibilités selon les quartiers et fournisseurs partenaires.",
        "Indiquez votre quartier, l’étage et le matériel recherché pour accélérer la confirmation.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: locationCityPath("casablanca"),
      locationLabel: "Catalogue location Casablanca",
    },
    {
      name: "Agadir",
      title: "Livraison de matériel médical à Agadir",
      paragraphs: [
        "À Agadir, SOS Santé Maroc peut aider les familles à organiser la livraison de matériel médical pour une personne âgée, un patient en convalescence ou une personne à mobilité réduite. Les disponibilités dépendent du matériel recherché et de la zone.",
        "Agadir est aussi une base opérationnelle importante pour la préparation du matériel. Consultez le hub ville et le catalogue local.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: locationCityPath("agadir"),
      locationLabel: "Catalogue location Agadir",
    },
    {
      name: "Marrakech",
      title: "Livraison de matériel médical à Marrakech",
      paragraphs: [
        "À Marrakech, la livraison de matériel médical peut être utile après une hospitalisation, pour équiper une chambre à domicile ou pour accompagner un proche en convalescence. SOS Santé Maroc traite la demande selon disponibilité.",
        "Précisez toujours la zone et le type d’équipement pour faciliter la vérification.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: locationCityPath("marrakech"),
      locationLabel: "Catalogue location Marrakech",
    },
    {
      name: "Rabat",
      title: "Livraison de matériel médical à Rabat",
      paragraphs: [
        "À Rabat, les familles peuvent demander la livraison de fauteuil roulant, lit médicalisé, matériel de mobilité ou équipement de confort selon disponibilité. SOS Santé Maroc aide à organiser la coordination avec les partenaires locaux.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: locationCityPath("rabat"),
      locationLabel: "Catalogue location Rabat",
    },
    {
      name: "Tanger",
      title: "Livraison de matériel médical à Tanger",
      paragraphs: [
        "À Tanger, la livraison à domicile permet aux familles de recevoir le matériel sans déplacement. SOS Santé Maroc peut aider à vérifier la disponibilité selon le type d’équipement demandé.",
        "Comme pour les autres villes, la confirmation dépend du stock partenaire, du délai souhaité et de l’accès au logement.",
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
    "Pour une vue d’ensemble des pages locales, consultez le hub national du matériel médical par ville. Indiquez toujours votre ville exacte lors de la demande WhatsApp.",
  ],
  otherCitiesLink: {
    label: "Matériel médical par ville au Maroc",
    href: MATERIEL_PAR_VILLE_PATH,
  },
  compareTitle: "Livraison, location ou vente : comment organiser la demande ?",
  compareIntro:
    "Cette page cible la livraison de matériel médical à domicile au Maroc. Le client peut aussi avoir besoin de louer ou d’acheter le matériel : ces sujets renvoient vers leurs pages dédiées.",
  compareBlocks: [
    {
      title: "Si le besoin est temporaire",
      paragraphs: [
        "La famille peut être orientée vers la location de matériel médical au Maroc. La location convient souvent après une opération, une hospitalisation, une blessure ou une période de convalescence.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Si le besoin est durable",
      paragraphs: [
        "La famille peut être orientée vers la vente de matériel médical au Maroc. L’achat peut être utile pour une personne âgée, une personne dépendante ou un besoin permanent.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
    {
      title: "Si le besoin est uniquement logistique",
      paragraphs: [
        "La famille peut simplement demander si une livraison, installation ou récupération est possible selon la ville et le matériel. C’est le cœur de cette page service.",
      ],
    },
  ],
  whyUsTitle: "Pourquoi choisir SOS Santé Maroc pour la livraison ?",
  whyUsIntro:
    "SOS Santé Maroc positionne la livraison comme un service de coordination logistique : centraliser la demande, vérifier les options et faciliter la mise en place à domicile.",
  whyUsBlocks: [
    {
      title: "Une coordination plus simple",
      text: "La famille n’a pas besoin d’appeler plusieurs fournisseurs. SOS Santé Maroc aide à centraliser la demande et à vérifier les solutions disponibles.",
    },
    {
      title: "Une approche orientée domicile",
      text: "Le service est pensé pour les familles qui veulent recevoir le matériel directement chez le patient, sans déplacement compliqué.",
    },
    {
      title: "Une adaptation selon la ville",
      text: "Les délais, équipements disponibles et conditions peuvent varier entre Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes. SOS Santé Maroc adapte la demande selon la localisation.",
    },
    {
      title: "Un accompagnement rassurant",
      text: "Le service accompagne la famille avec un ton simple, humain et rassurant. L’objectif est de faciliter une situation souvent urgente ou stressante.",
    },
    {
      title: "Un suivi possible",
      text: "Après livraison, SOS Santé Maroc peut aider pour une question, une prolongation, une récupération ou une nouvelle demande selon disponibilité. Ce n’est pas une clinique ni un service d’urgence médicale officiel.",
    },
  ],
  relatedTitle: "Pages et services liés",
  relatedPillars: [
    {
      label: "Location de matériel médical au Maroc",
      href: LOCATION_PILLAR_PATH,
      description: "Quand le besoin est temporaire",
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
    "Quelques contenus de soutien pour préparer un retour à domicile ou mieux comprendre certains équipements livrés.",
  blogLinks: [
    {
      label: "Location concentrateur d’oxygène à Agadir",
      href: "/blog/respiratoire/concentreur-oxygene-agadir-avantages",
      description: "Usage à domicile et organisation pratique",
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
  productSidebar: livraisonPillarSidebar(),
  faqs: [
    {
      question:
        "SOS Santé Maroc propose-t-il la livraison de matériel médical à domicile ?",
      answer:
        "Oui, SOS Santé Maroc aide à organiser la livraison de matériel médical à domicile selon la ville, le matériel demandé et la disponibilité des fournisseurs partenaires.",
    },
    {
      question: "Quel matériel médical peut être livré à domicile ?",
      answer:
        "Selon disponibilité, la livraison peut concerner un lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit ou concentrateur d’oxygène.",
    },
    {
      question: "Peut-on faire livrer un lit médicalisé à domicile ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à organiser la livraison d’un lit médicalisé à domicile selon disponibilité. L’installation peut aussi être coordonnée selon le fournisseur et la ville.",
    },
    {
      question: "La livraison est-elle disponible partout au Maroc ?",
      answer:
        "SOS Santé Maroc traite les demandes dans plusieurs villes du Maroc, notamment Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et d’autres villes selon disponibilité.",
    },
    {
      question: "Peut-on demander l’installation du matériel médical ?",
      answer:
        "Oui, l’installation peut être organisée pour certains équipements selon disponibilité, notamment les lits médicalisés, matelas anti-escarres ou autres équipements nécessitant une mise en place.",
    },
    {
      question: "Peut-on récupérer le matériel après location ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à organiser la récupération du matériel médical après location selon disponibilité et conditions du fournisseur partenaire.",
    },
    {
      question: "Quels détails faut-il donner pour organiser une livraison ?",
      answer:
        "Il faut indiquer la ville, l’adresse, le quartier, l’étage, la présence d’un ascenseur, le matériel souhaité, le délai souhaité et le besoin éventuel d’installation.",
    },
    {
      question: "SOS Santé Maroc est-il une clinique ou une pharmacie ?",
      answer:
        "Non. SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service de coordination pour faciliter l’accès au matériel médical à domicile.",
    },
    {
      question: "Comment demander une livraison de matériel médical ?",
      answer:
        "Contactez SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant votre ville, le matériel recherché et l’adresse de livraison. L’équipe vérifie ensuite les disponibilités.",
    },
  ],
  ctaTitle: "Besoin d’une livraison de matériel médical à domicile ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier la disponibilité du matériel médical dans votre ville et organiser une livraison à domicile selon les possibilités locales. Notre équipe vous aide à coordonner la demande pour un lit médicalisé, un fauteuil roulant, un déambulateur, un matelas anti-escarres, une chaise percée, une table de lit ou un concentrateur d’oxygène.",
};
