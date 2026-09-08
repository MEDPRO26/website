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
  venteCategoryPath,
  venteCityPath,
  venteProductPath,
} from "@/lib/routes";
import { ventePillarSidebar } from "@/lib/pillar-sidebar-products";
import {
  venteCategoryCityLinks,
  venteProductCityLinks,
} from "@/lib/pillar-city-product-links";

export const ventePillarContent: LocationPillarContent = {
  path: VENTE_MAROC_PATH,
  heroImage: "/pillars/vente-materiel-medical-lit-medicalise-maroc.webp",
  heroImageAlt:
    "Vente de matériel médical au Maroc — lit médicalisé pour maintien à domicile avec SOS Santé",
  heroImageTitle: "Vente de matériel médical au Maroc | SOS Santé",
  metaTitle: "Vente matériel médical Maroc | SOS Santé",
  metaDescription:
    "Achetez du matériel médical au Maroc avec SOS Santé : lit médicalisé, fauteuil roulant, oxygène, équipements à domicile et orientation selon disponibilité.",
  keywords: [
    "vente matériel médical Maroc",
    "vente de matériel médical au Maroc",
    "acheter matériel médical au Maroc",
    "achat matériel médical Maroc",
    "vente lit médicalisé Maroc",
    "vente fauteuil roulant Maroc",
    "vente concentrateur d'oxygène Maroc",
    "matériel médical pour maintien à domicile Maroc",
  ],
  badge: "Service national · Vente",
  h1: "Vente de matériel médical au Maroc",
  heroTitleSuffix: "pour particuliers et familles",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver du matériel médical à acheter selon la ville, le besoin du patient et la disponibilité : lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit et concentrateur d’oxygène.",
  secondaryCtaLabel: "Voir les équipements disponibles à l’achat",
  primaryCtaLabel: "Demander la disponibilité sur WhatsApp",
  reassurance: [
    "Achat de matériel médical selon disponibilité",
    "Orientation vers l’équipement adapté",
    "Solutions pour personnes âgées, patients en convalescence et mobilité réduite",
    "Coordination avec des fournisseurs partenaires",
    "Service disponible dans plusieurs villes du Maroc",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je souhaite acheter du matériel médical au Maroc. Ville et besoin : ",
  introTitle: "Acheter du matériel médical au Maroc",
  intro: [
    "Lorsqu’un besoin médical ou d’assistance à domicile devient durable, l’achat peut être une solution plus adaptée que la location. Une personne âgée, une personne à mobilité réduite, un patient en convalescence longue ou une famille qui accompagne un proche au quotidien peut avoir besoin d’un équipement disponible en permanence à la maison.",
    "La vente de matériel médical au Maroc concerne plusieurs types d’équipements : lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit médicalisée, concentrateur d’oxygène et autres équipements médicaux à domicile selon disponibilité.",
    "SOS Santé Maroc accompagne les familles dans la recherche de matériel médical à acheter selon la ville, le besoin du patient et les disponibilités des fournisseurs partenaires. Le service aide à clarifier la demande, orienter vers le type d’équipement adapté, vérifier la disponibilité et coordonner la solution avec le fournisseur.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service marocain de coordination, d’orientation et de mise en relation. Son rôle est de faciliter l’accès au matériel médical à domicile, tout en respectant les recommandations médicales lorsqu’un équipement nécessite l’avis d’un professionnel de santé.",
    "Que vous soyez à Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès ou dans une autre ville du Maroc, SOS Santé Maroc peut vous aider à rechercher du matériel médical à vendre selon disponibilité locale.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/vente/vente-lit-electrique-3-positions-maroc.webp",
      alt: "Vente lit médicalisé électrique à 3 positions pour maintien à domicile au Maroc",
      title: "Vente lit médicalisé au Maroc",
      caption: "Lit médicalisé électrique à 3 positions",
    },
    equipment: {
      src: "/pillars/vente/vente-fauteuil-roulant-pliable-maroc.webp",
      alt: "Vente fauteuil roulant pliable classique pour mobilité réduite au Maroc",
      title: "Vente fauteuil roulant au Maroc",
      caption: "Fauteuil roulant pliable",
    },
    process: {
      src: "/pillars/vente/vente-rollator-aluminium-maroc.webp",
      alt: "Vente rollator aluminium 4 roues pour aide à la marche au Maroc",
      title: "Vente rollator au Maroc",
      caption: "Rollator aluminium 4 roues",
    },
    cities: {
      src: "/pillars/vente/vente-deambulateur-articule-maroc.webp",
      alt: "Vente déambulateur articulé pliable pour personnes âgées au Maroc",
      title: "Vente déambulateur au Maroc",
      caption: "Déambulateur articulé pliable",
    },
  },
  whyTitle: "Pourquoi acheter du matériel médical au Maroc ?",
  whyParagraphs: [
    "L’achat de matériel médical devient intéressant lorsque le besoin est régulier, durable ou permanent. Contrairement à la location, qui convient surtout aux besoins temporaires, l’achat permet à la famille de disposer du matériel à tout moment, sans limite de durée.",
    "Pour une personne âgée qui utilise un fauteuil roulant tous les jours, pour un patient qui a besoin d’un lit médicalisé sur une longue période, ou pour une famille qui souhaite équiper une chambre à domicile, acheter peut être plus pratique sur le long terme.",
    "L’achat peut aussi être utile lorsque plusieurs membres de la famille utilisent le même équipement, ou lorsque le matériel doit rester disponible à domicile sans interruption. Dans ce cas, la famille cherche souvent une solution fiable, adaptée au besoin du patient, facile à utiliser et disponible dans sa ville.",
    "La vente de matériel médical au Maroc permet aussi de répondre à des besoins professionnels ou semi-professionnels : cabinets, prestataires de soins à domicile, aides-soignants, petites structures de santé ou familles qui souhaitent s’équiper correctement.",
    "SOS Santé Maroc aide les clients à comprendre les options disponibles, sans imposer une solution. Si le besoin est temporaire, la location peut être plus logique. Si le besoin est durable, l’achat peut être plus adapté. Le service oriente selon la situation, la ville et la disponibilité.",
  ],
  situationsTitle: "Dans quelles situations acheter du matériel médical ?",
  situationsIntro:
    "L’achat de matériel médical au Maroc concerne surtout les besoins durables : maintien à domicile, personne âgée, mobilité réduite permanente, chambre médicalisée, besoin respiratoire confirmé ou équipement pour prestataires.",
  situations: [
    {
      title: "Besoin durable à domicile",
      paragraphs: [
        "Lorsque le patient doit utiliser le matériel pendant une longue période, l’achat peut être plus intéressant. C’est le cas pour un lit médicalisé, un fauteuil roulant, un matelas anti-escarres ou un déambulateur utilisé au quotidien.",
        "Disposer du matériel en permanence évite de dépendre d’une période de location et simplifie l’organisation de la famille au fil des semaines.",
      ],
    },
    {
      title: "Maintien à domicile d’une personne âgée",
      paragraphs: [
        "Pour une personne âgée qui reste à domicile, certains équipements deviennent essentiels pour le confort, les déplacements et l’accompagnement. Acheter un fauteuil roulant, un lit médicalisé, une chaise percée ou une table de lit peut permettre à la famille de mieux organiser le quotidien.",
        "Si une présence humaine est aussi nécessaire, la famille peut compléter l’équipement par une aide à domicile ou une garde-malade, via la page dédiée.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Mobilité réduite permanente",
      paragraphs: [
        "Si la personne a une mobilité réduite permanente ou de longue durée, l’achat d’un fauteuil roulant, d’un déambulateur ou d’un lève-personne peut être une solution stable. Le matériel reste disponible à la maison, sans dépendre d’une période de location.",
        "Pour approfondir les options liées aux déplacements et transferts, consultez la page dédiée au matériel de mobilité au Maroc.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Équipement d’une chambre médicalisée à domicile",
      paragraphs: [
        "Certaines familles doivent aménager une chambre pour un proche alité ou dépendant. Dans ce cas, le matériel peut inclure un lit médicalisé, un matelas anti-escarres, une table de lit, une chaise percée et parfois d’autres accessoires selon la situation.",
        "Les détails sur le confort à domicile sont développés sur la page Matériel de confort médical au Maroc.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      title: "Besoin respiratoire confirmé",
      paragraphs: [
        "Le concentrateur d’oxygène et certains équipements respiratoires doivent être utilisés selon les recommandations d’un professionnel de santé. L’achat peut être envisagé uniquement si le besoin est durable et validé médicalement.",
        "SOS Santé Maroc peut aider à rechercher un appareil disponible, sans remplacer l’avis du médecin. Le sujet est détaillé sur la page Matériel médical respiratoire au Maroc.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
    {
      title: "Prestataires et professionnels",
      paragraphs: [
        "Certains prestataires de soins à domicile, cabinets ou intervenants peuvent avoir besoin d’acheter du matériel médical pour leur activité. Cette page s’adresse aussi à eux, tout en gardant une priorité sur les familles et les particuliers.",
        "Pour la coordination de soins à domicile (infirmier, kiné, médecin), consultez la page dédiée.",
      ],
      link: {
        label: "Soins à domicile au Maroc",
        href: SOINS_DOMICILE_PATH,
      },
    },
  ],
  midCtaTitle: "Besoin d’acheter du matériel médical rapidement ?",
  midCtaText:
    "Indiquez votre ville et le matériel recherché : SOS Santé Maroc vérifie la disponibilité et vous oriente vers une solution d’achat adaptée.",
  cityMoneyBlock: {
    title: "Acheter du matériel médical dans votre ville",
    text: "Choisissez votre ville pour voir le catalogue de vente local, vérifier la disponibilité et demander le matériel adapté à domicile.",
    image: {
      src: "/pillars/vente/vente-villes-catalogue-maroc.webp",
      alt: "Vente de matériel médical au Maroc — lit médicalisé et fauteuil roulant à domicile, catalogues par ville",
      title: "Vente de matériel médical dans votre ville | SOS Santé",
    },
    cities: [
      {
        name: "Casablanca",
        href: venteCityPath("casablanca"),
        label: "Casablanca",
      },
      {
        name: "Agadir",
        href: venteCityPath("agadir"),
        label: "Agadir",
      },
      {
        name: "Rabat",
        href: venteCityPath("rabat"),
        label: "Rabat",
      },
      {
        name: "Marrakech",
        href: venteCityPath("marrakech"),
        label: "Marrakech",
      },
      {
        name: "Tanger",
        href: venteCityPath("tanger"),
        label: "Tanger",
      },
    ],
  },
  equipmentTitle: "Quels équipements médicaux peut-on acheter au Maroc ?",
  equipmentIntro:
    "SOS Santé Maroc aide à rechercher plusieurs types de matériel médical à vendre selon disponibilité. Les modèles, marques, prix et conditions peuvent varier selon la ville et les fournisseurs partenaires.",
  equipment: [
    {
      id: "lit-medicalise",
      title: "Vente de lit médicalisé au Maroc",
      icon: "bed",
      paragraphs: [
        "Le lit médicalisé est un équipement central pour les personnes alitées, âgées, dépendantes ou en convalescence longue. Il peut aider à améliorer le confort à domicile et faciliter certaines actions du quotidien pour la famille ou l’accompagnant.",
        "La vente de lit médicalisé au Maroc peut concerner différents modèles selon disponibilité : lit médicalisé électrique, lit avec barrières, lit avec potence, lit avec matelas ou lit adapté au maintien à domicile.",
        "L’achat est particulièrement intéressant lorsque le patient a besoin du lit sur une longue période. Pour un besoin temporaire, il est préférable de consulter la page Location de matériel médical au Maroc.",
      ],
      link: {
        label: "Voir un lit médicalisé à l’achat",
        href: venteProductPath("lit-electrique-3-articulations", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "lit-electrique-3-articulations",
        "Voir le lit médicalisé à l’achat dans votre ville :"
      ),
    },
    {
      id: "fauteuil-roulant",
      title: "Vente de fauteuil roulant au Maroc",
      icon: "accessible",
      paragraphs: [
        "Le fauteuil roulant est l’un des équipements les plus recherchés pour les personnes à mobilité réduite. Il peut être utilisé à domicile, à l’extérieur, pour les rendez-vous médicaux ou les déplacements du quotidien.",
        "La vente de fauteuil roulant au Maroc peut concerner des fauteuils manuels, pliables, confortables ou adaptés à certains usages selon disponibilité. L’achat est utile lorsque la personne utilise régulièrement le fauteuil.",
        "SOS Santé Maroc aide la famille à préciser le besoin : usage intérieur ou extérieur, fréquence d’utilisation, facilité de rangement, confort, poids et disponibilité. Pour une vue d’ensemble, consultez aussi le matériel de mobilité.",
      ],
      link: {
        label: "Voir un fauteuil roulant à l’achat",
        href: venteProductPath("fauteuil-roulant-pliable-classique", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "fauteuil-roulant-pliable-classique",
        "Voir le fauteuil roulant à l’achat dans votre ville :"
      ),
    },
    {
      id: "deambulateur",
      title: "Vente de déambulateur au Maroc",
      icon: "elderly",
      paragraphs: [
        "Le déambulateur aide les personnes qui peuvent marcher mais qui ont besoin d’un appui plus stable. Il peut être utile pour les personnes âgées, les patients en rééducation ou les personnes qui veulent sécuriser leurs déplacements à domicile.",
        "La vente de déambulateur au Maroc peut concerner des modèles simples, pliables ou à roulettes selon disponibilité. L’achat est logique lorsque le besoin devient quotidien ou régulier.",
      ],
      link: {
        label: "Voir un déambulateur à l’achat",
        href: venteProductPath("deambulateur-pliable-roues", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "deambulateur-pliable-roues",
        "Voir le déambulateur à l’achat dans votre ville :"
      ),
    },
    {
      id: "bequilles",
      title: "Vente de béquilles au Maroc",
      icon: "orthopedics",
      paragraphs: [
        "Les béquilles sont souvent utilisées après une blessure, une fracture, une opération ou une période de récupération. Pour un besoin court, la location peut suffire. Pour un besoin plus long ou répété, l’achat peut être plus pratique.",
        "La vente de béquilles au Maroc peut concerner différents modèles selon la taille, l’appui et la disponibilité. SOS Santé Maroc peut aider à rechercher une solution adaptée dans la ville du client.",
      ],
      link: {
        label: "Voir des béquilles à l’achat",
        href: venteProductPath("bequille-s-m-l", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "bequille-s-m-l",
        "Voir les béquilles à l’achat dans votre ville :"
      ),
    },
    {
      id: "matelas-anti-escarres",
      title: "Vente de matelas anti-escarres au Maroc",
      icon: "airline_seat_flat",
      paragraphs: [
        "Le matelas anti-escarres est souvent demandé pour les personnes qui restent longtemps au lit. Il peut contribuer au confort des personnes alitées, mais le choix doit être adapté à la situation du patient.",
        "La vente de matelas anti-escarres au Maroc peut concerner plusieurs modèles selon disponibilité. Pour les situations médicales sensibles, la famille doit suivre les recommandations d’un professionnel de santé.",
        "L’achat peut être utile lorsque la personne est alitée sur une longue durée ou lorsque le matelas doit rester disponible à domicile.",
      ],
      link: {
        label: "Voir un matelas anti-escarres à l’achat",
        href: venteProductPath("matelas-anti-escarre-air-compresseur", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "matelas-anti-escarre-air-compresseur",
        "Voir le matelas anti-escarres à l’achat dans votre ville :"
      ),
    },
    {
      id: "leve-personne",
      title: "Vente de lève-personne au Maroc",
      icon: "elevator",
      paragraphs: [
        "Le lève-personne est un équipement destiné à faciliter le transfert d’une personne à mobilité très réduite. Il peut aider lors des passages du lit au fauteuil ou du fauteuil au lit, selon les conditions d’utilisation.",
        "La vente de lève-personne au Maroc peut être adaptée lorsque la personne dépendante a besoin d’aide régulière pour les transferts. L’achat doit être réfléchi en fonction de l’espace disponible, du poids du patient, de l’usage prévu et de la capacité de l’aidant.",
      ],
      link: {
        label: "Catalogue mobilité (transferts)",
        href: venteCategoryPath("mobilier-medical", "agadir"),
      },
      cityProductLinks: venteCategoryCityLinks(
        "mobilier-medical",
        "Voir le catalogue mobilité dans votre ville :"
      ),
    },
    {
      id: "concentrateur-oxygene",
      title: "Vente de concentrateur d’oxygène au Maroc",
      icon: "air",
      paragraphs: [
        "Le concentrateur d’oxygène est un équipement respiratoire qui doit être utilisé uniquement selon indication médicale. Le choix du débit, du modèle et de la durée d’utilisation ne doit pas être décidé sans avis médical.",
        "La vente de concentrateur d’oxygène au Maroc peut concerner différents appareils selon disponibilité. SOS Santé Maroc peut aider à rechercher un fournisseur disponible, mais ne donne pas de prescription et ne remplace pas un professionnel de santé.",
        "Pour un contenu plus détaillé, consultez la page Matériel médical respiratoire au Maroc.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
    {
      id: "chaise-percee",
      title: "Vente de chaise percée au Maroc",
      icon: "chair_alt",
      paragraphs: [
        "La chaise percée est utile pour les personnes qui ont des difficultés à se déplacer jusqu’aux toilettes. Elle peut être utilisée par une personne âgée, dépendante, alitée ou en convalescence.",
        "La vente de chaise percée au Maroc peut être adaptée lorsque le besoin est régulier. Elle fait partie des équipements pratiques pour améliorer l’organisation du quotidien à domicile.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      id: "table-de-lit",
      title: "Vente de table de lit médicalisée au Maroc",
      icon: "table_restaurant",
      paragraphs: [
        "La table de lit médicalisée permet de prendre les repas, lire, écrire ou poser des objets près du patient alité. Elle peut accompagner un lit médicalisé ou être achetée séparément.",
        "La vente de table de lit médicalisée au Maroc est intéressante pour les personnes qui passent beaucoup de temps au lit et qui ont besoin d’un accessoire pratique au quotidien.",
      ],
      link: {
        label: "Voir une table de lit à l’achat",
        href: venteProductPath("table-manger", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "table-manger",
        "Voir la table de lit à l’achat dans votre ville :"
      ),
    },
  ],
  chooseTitle: "Comment choisir le bon matériel médical à acheter ?",
  chooseIntro:
    "Le choix du matériel médical dépend de la situation de la personne, de la durée d’utilisation, du niveau de mobilité, du logement, du budget et des recommandations éventuelles d’un professionnel de santé.",
  chooseBlocks: [
    {
      title: "Définir le besoin réel",
      paragraphs: [
        "Avant d’acheter, il faut comprendre si le besoin concerne principalement le repos, la mobilité, le confort, la respiration, l’hygiène ou l’assistance quotidienne. Un patient alité n’a pas les mêmes besoins qu’une personne qui marche encore avec difficulté.",
        "Clarifier le besoin aide SOS Santé Maroc à orienter la demande vers le bon type d’équipement et la bonne ville.",
      ],
    },
    {
      title: "Évaluer la durée d’utilisation",
      paragraphs: [
        "Si le besoin est court, il peut être préférable de louer. Si le besoin est long ou permanent, l’achat peut être plus rentable et plus pratique. SOS Santé Maroc peut aider à orienter la famille entre achat et location selon la situation.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Vérifier l’espace à domicile",
      paragraphs: [
        "Certains équipements nécessitent de l’espace : lit médicalisé, lève-personne, fauteuil roulant, chaise percée. Avant l’achat, il est important de vérifier la chambre, les passages, les portes et l’accès au domicile.",
        "Indiquer l’étage, l’ascenseur et la largeur des portes lors de la demande accélère la proposition d’une solution réaliste.",
      ],
    },
    {
      title: "Penser au confort du patient",
      paragraphs: [
        "Le matériel doit être adapté au patient, mais aussi pratique pour la famille ou l’aidant. Le confort, la stabilité, la facilité d’utilisation et l’entretien sont des éléments importants.",
        "Pour les équipements de confort (lit, matelas, chaise percée), la page confort médical au Maroc apporte un complément utile.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      title: "Suivre l’avis médical lorsque nécessaire",
      paragraphs: [
        "Pour le matériel respiratoire, les matelas anti-escarres, certains équipements de transfert ou les situations médicales sensibles, la famille doit suivre les recommandations d’un professionnel de santé.",
        "SOS Santé Maroc ne prescrit pas et ne remplace pas un avis médical.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc pour l’achat ?",
  processIntro:
    "Le parcours reste simple pour la famille : clarifier le besoin, vérifier la disponibilité auprès de partenaires et coordonner la solution selon la ville.",
  processSteps: [
    {
      title: "Le client envoie sa demande",
      text: "La famille contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Elle indique la ville, le matériel recherché, l’usage prévu et les informations pratiques.",
    },
    {
      title: "SOS Santé Maroc clarifie le besoin",
      text: "L’équipe pose quelques questions pour comprendre le type d’équipement recherché, la durée probable d’utilisation, l’espace disponible et les contraintes pratiques. Cette étape sert à orienter la demande. Elle ne remplace pas un diagnostic médical.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc vérifie la disponibilité auprès de fournisseurs partenaires selon la ville. Les modèles, prix, délais et conditions peuvent varier.",
    },
    {
      title: "Proposition d’une solution",
      text: "Lorsque des options sont disponibles, SOS Santé Maroc peut orienter la famille vers une solution adaptée : type de matériel, disponibilité, conditions d’achat et possibilité de livraison si proposée.",
    },
    {
      title: "Coordination avec le fournisseur",
      text: "SOS Santé Maroc facilite la coordination entre la famille et le fournisseur partenaire afin de simplifier la démarche.",
    },
    {
      title: "Suivi après la demande",
      text: "Selon le cas, SOS Santé Maroc peut rester disponible pour une question, une demande complémentaire, un autre équipement ou une orientation vers un service lié.",
    },
  ],
  durationTitle: "Acheter ou louer : comment décider ?",
  durationIntro:
    "Cette page cible la vente de matériel médical au Maroc, mais il est normal de comparer achat et location selon la durée du besoin.",
  durationBlocks: [
    {
      title: "Acheter si le besoin est durable",
      paragraphs: [
        "L’achat est souvent préférable lorsque le matériel sera utilisé pendant une longue période ou de manière permanente. C’est le cas pour certaines personnes âgées, personnes dépendantes ou patients avec mobilité réduite durable.",
        "Disposer du matériel en permanence à domicile évite les contraintes liées à une période de location.",
      ],
    },
    {
      title: "Louer si le besoin est temporaire",
      paragraphs: [
        "La location est souvent meilleure pour une période courte : après une opération, une blessure, une hospitalisation ou une convalescence temporaire.",
        "Ce sujet est développé en détail sur la page Location de matériel médical au Maroc.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Demander une orientation",
      paragraphs: [
        "La famille peut ne pas savoir quelle solution choisir. SOS Santé Maroc peut aider à comparer les options disponibles selon la ville, le matériel et la durée prévue, sans remplacer l’avis médical.",
        "Une seule demande WhatsApp avec la ville et le besoin suffit pour démarrer.",
      ],
    },
  ],
  citiesTitle: "Vente de matériel médical dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc traite les demandes de vente de matériel médical dans plusieurs villes du Maroc selon disponibilité. Les pages villes précisent le catalogue local sans remplacer ce hub national.",
  cities: [
    {
      name: "Casablanca",
      title: "Vente de matériel médical à Casablanca",
      paragraphs: [
        "À Casablanca, les familles recherchent souvent du matériel médical à acheter pour un proche à domicile : fauteuil roulant, lit médicalisé, concentrateur d’oxygène, matelas anti-escarres, déambulateur ou chaise percée. SOS Santé Maroc peut aider à vérifier les disponibilités selon les fournisseurs partenaires.",
        "Indiquez votre quartier et le type d’équipement pour accélérer la confirmation. Casablanca dispose d’un hub local et d’un catalogue vente dédié.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: venteCityPath("casablanca"),
      locationLabel: "Catalogue vente Casablanca",
    },
    {
      name: "Agadir",
      title: "Vente de matériel médical à Agadir",
      paragraphs: [
        "À Agadir, l’achat de matériel médical peut répondre aux besoins des personnes âgées, des patients en convalescence ou des familles qui organisent le maintien à domicile. SOS Santé Maroc accompagne la recherche d’équipements disponibles selon le besoin.",
        "Agadir est une base opérationnelle importante pour la préparation du matériel. Consultez le hub ville et le catalogue vente pour voir les produits les plus demandés.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: venteCityPath("agadir"),
      locationLabel: "Catalogue vente Agadir",
    },
    {
      name: "Marrakech",
      title: "Vente de matériel médical à Marrakech",
      paragraphs: [
        "À Marrakech, les demandes peuvent concerner le lit médicalisé, le fauteuil roulant, le matériel de mobilité, le matériel respiratoire ou les accessoires de confort. SOS Santé Maroc aide à rechercher une solution selon disponibilité.",
        "Précisez toujours la zone et le matériel recherché pour faciliter la vérification auprès des partenaires.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: venteCityPath("marrakech"),
      locationLabel: "Catalogue vente Marrakech",
    },
    {
      name: "Rabat",
      title: "Vente de matériel médical à Rabat",
      paragraphs: [
        "À Rabat, SOS Santé Maroc peut orienter les familles vers du matériel médical à acheter selon la situation du patient, le type d’équipement recherché et les disponibilités locales.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: venteCityPath("rabat"),
      locationLabel: "Catalogue vente Rabat",
    },
    {
      name: "Tanger",
      title: "Vente de matériel médical à Tanger",
      paragraphs: [
        "À Tanger, la vente de matériel médical peut concerner les familles qui veulent équiper un domicile pour une personne âgée, une personne dépendante ou un patient en récupération. SOS Santé Maroc aide à vérifier les options disponibles selon la ville.",
        "Comme pour les autres villes, la confirmation dépend du stock partenaire, du délai souhaité et du type d’équipement demandé.",
      ],
      hubHref: hubCityPath("tanger"),
      hubLabel: "Matériel médical Tanger",
      locationHref: venteCityPath("tanger"),
      locationLabel: "Catalogue vente Tanger",
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
  compareTitle: "Différence entre matériel de mobilité, confort et respiratoire",
  compareIntro:
    "La page de vente mentionne les grandes familles de matériel. Chaque famille renvoie vers sa page dédiée pour le détail (confort, mobilité, respiratoire, etc.).",
  compareBlocks: [
    {
      title: "Matériel de mobilité",
      paragraphs: [
        "Il regroupe les équipements liés au déplacement et aux transferts : fauteuil roulant, déambulateur, béquilles, lève-personne.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Matériel de confort médical",
      paragraphs: [
        "Il concerne les équipements qui améliorent le confort à domicile : lit médicalisé, matelas anti-escarres, chaise percée, table de lit.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      title: "Matériel médical respiratoire",
      paragraphs: [
        "Il concerne les concentrateurs d’oxygène, CPAP, nébuliseurs et accessoires respiratoires. L’usage doit suivre les recommandations médicales.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
  ],
  whyUsTitle: "Pourquoi passer par SOS Santé Maroc ?",
  whyUsIntro:
    "SOS Santé Maroc positionne la vente comme un service de coordination et d’orientation : simplifier la recherche, clarifier le besoin et faciliter la mise en relation selon la ville.",
  whyUsBlocks: [
    {
      title: "Une recherche plus simple",
      text: "Au lieu de chercher plusieurs fournisseurs un par un, la famille peut envoyer une demande à SOS Santé Maroc pour être orientée selon la ville et le besoin.",
    },
    {
      title: "Une approche rassurante",
      text: "Le service est conçu pour les familles qui doivent prendre une décision rapidement, souvent dans un moment sensible : retour à domicile, dépendance, perte de mobilité ou convalescence.",
    },
    {
      title: "Une coordination locale",
      text: "Les disponibilités peuvent varier selon Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes. SOS Santé Maroc adapte la demande selon la localisation.",
    },
    {
      title: "Une orientation vers le bon équipement",
      text: "Le service aide à préciser le besoin : lit médicalisé, fauteuil roulant, matelas anti-escarres, déambulateur, lève-personne, chaise percée, table de lit ou concentrateur d’oxygène.",
    },
    {
      title: "Une solution adaptée à la durée du besoin",
      text: "Si le besoin est temporaire, la location peut être proposée comme alternative. Si le besoin est durable, l’achat peut être plus adapté. SOS Santé Maroc ne remplace pas un médecin et ne donne pas de diagnostic.",
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
      label: "Livraison de matériel médical à domicile au Maroc",
      href: LIVRAISON_PILLAR_PATH,
      description: "Organisation de la livraison selon disponibilité",
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
    "Quelques contenus de soutien pour préparer un achat ou mieux comprendre certains équipements.",
  blogLinks: [
    {
      label: "Concentrateur portable Inogen à Agadir",
      href: "/blog/respiratoire/concentrateur-oxygene-portable-inogen-agadir",
      description: "Guide oxygène portable",
    },
    {
      label: "Location concentrateur d’oxygène à Agadir",
      href: "/blog/respiratoire/concentreur-oxygene-agadir-avantages",
      description: "Comparer location et usage à domicile",
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
  productSidebar: ventePillarSidebar(),
  faqs: [
    {
      question: "Peut-on acheter du matériel médical au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc aide les familles à trouver du matériel médical à acheter au Maroc selon disponibilité : lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit ou concentrateur d’oxygène.",
    },
    {
      question: "Quels équipements médicaux peut-on acheter ?",
      answer:
        "Selon disponibilité, il est possible de demander un lit médicalisé, fauteuil roulant, déambulateur, béquilles, matelas anti-escarres, lève-personne, chaise percée, table de lit médicalisée, concentrateur d’oxygène et autres équipements médicaux à domicile.",
    },
    {
      question: "Acheter ou louer du matériel médical : que choisir ?",
      answer:
        "L’achat est souvent adapté pour un besoin durable ou permanent. La location est plus pratique pour un besoin temporaire, après une opération, une blessure ou une convalescence courte.",
    },
    {
      question: "Peut-on acheter un lit médicalisé au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à rechercher un lit médicalisé à vendre au Maroc selon disponibilité. Le choix dépend du besoin du patient, de l’espace à domicile et de la durée d’utilisation.",
    },
    {
      question: "Peut-on acheter un fauteuil roulant au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à trouver un fauteuil roulant à acheter au Maroc selon disponibilité. Le modèle dépend de l’usage, du confort recherché et de la mobilité de la personne.",
    },
    {
      question: "Peut-on acheter un concentrateur d’oxygène au Maroc ?",
      answer:
        "Oui, selon disponibilité et recommandation médicale. Le concentrateur d’oxygène doit être choisi et utilisé selon les indications d’un professionnel de santé.",
    },
    {
      question: "Est-ce que SOS Santé Maroc vend directement le matériel ?",
      answer:
        "SOS Santé Maroc est un service de coordination et d’orientation. Selon la demande, le service aide à trouver une solution auprès de fournisseurs partenaires disponibles dans la ville concernée.",
    },
    {
      question: "Est-ce que SOS Santé Maroc est une pharmacie ou une clinique ?",
      answer:
        "Non. SOS Santé Maroc n’est pas une pharmacie, une clinique, un hôpital ou un cabinet médical. C’est un service de coordination pour faciliter l’accès au matériel médical à domicile.",
    },
    {
      question: "Comment demander la disponibilité d’un équipement à acheter ?",
      answer:
        "Il suffit de contacter SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant la ville, le matériel recherché, l’usage prévu et les informations pratiques.",
    },
  ],
  ctaTitle: "Besoin d’acheter du matériel médical au Maroc ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier la disponibilité du matériel médical dans votre ville. Notre équipe vous aide à rechercher une solution adaptée pour un proche à domicile : lit médicalisé, fauteuil roulant, déambulateur, matelas anti-escarres, lève-personne, chaise percée, table de lit ou concentrateur d’oxygène selon le besoin.",
};
