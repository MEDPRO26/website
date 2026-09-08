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
  locationRentalProductPath,
  venteCategoryPath,
  venteProductPath,
} from "@/lib/routes";
import { confortPillarSidebar } from "@/lib/pillar-sidebar-products";
import {
  locationProductCityLinks,
  venteCategoryCityLinks,
  venteProductCityLinks,
} from "@/lib/pillar-city-product-links";

export const confortPillarContent: LocationPillarContent = {
  path: CONFORT_MAROC_PATH,
  heroImage: "/pillars/materiel-confort-matelas-anti-escarres-maroc.webp",
  heroImageAlt:
    "Matériel de confort médical au Maroc — matelas anti-escarres à air pour patient à domicile",
  heroImageTitle: "Matériel de confort médical au Maroc | SOS Santé",
  metaTitle: "Matériel confort médical Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc aide à trouver du matériel de confort médical : lit médicalisé, matelas anti-escarres, chaise percée et table de lit.",
  keywords: [
    "matériel de confort médical Maroc",
    "matériel confort médical Maroc",
    "lit médicalisé Maroc",
    "matelas anti-escarres Maroc",
    "chaise percée Maroc",
    "table de lit médicalisée Maroc",
    "matériel pour personne alitée Maroc",
    "chambre médicalisée à domicile Maroc",
  ],
  badge: "Service national · Confort médical",
  h1: "Matériel de confort médical au Maroc",
  heroTitleSuffix: "pour le maintien à domicile",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver du matériel de confort médical selon la ville, le besoin et la disponibilité : lit médicalisé, matelas anti-escarres, table de lit médicalisée, chaise percée et équipements pour améliorer le quotidien d’un patient à domicile.",
  secondaryCtaLabel: "Voir les équipements de confort",
  primaryCtaLabel: "Demander la disponibilité sur WhatsApp",
  reassurance: [
    "Matériel de confort médical selon disponibilité",
    "Solutions pour personnes âgées, alitées ou en convalescence",
    "Lit médicalisé, matelas anti-escarres, chaise percée et table de lit",
    "Coordination avec fournisseurs partenaires",
    "Service disponible dans plusieurs villes du Maroc",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je recherche du matériel de confort médical au Maroc. Ville et équipement : ",
  introTitle: "Améliorer le confort du patient à domicile",
  intro: [
    "Lorsqu’un proche reste à domicile après une hospitalisation, une opération, une perte d’autonomie ou une période de convalescence, le confort devient un élément essentiel. La chambre, le lit, les accessoires et l’organisation du quotidien doivent être adaptés pour aider la personne à se reposer, manger, se lever, recevoir une assistance ou rester installée dans de meilleures conditions.",
    "Le matériel de confort médical au Maroc regroupe les équipements qui facilitent l’installation du patient à domicile. Il peut s’agir d’un lit médicalisé, d’un matelas anti-escarres, d’une table de lit médicalisée, d’une chaise percée ou d’accessoires adaptés à une personne âgée, alitée ou dépendante.",
    "SOS Santé Maroc accompagne les familles dans la recherche de matériel de confort médical selon la ville, le besoin du patient et la disponibilité. Le service aide à clarifier la demande, vérifier les options disponibles auprès de fournisseurs partenaires et coordonner la solution adaptée.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service marocain de coordination, d’orientation et de mise en relation. Son rôle est d’aider les familles à trouver le bon équipement pour améliorer le confort du patient à domicile, sans donner de diagnostic médical.",
    "Cette page est dédiée au matériel de confort médical. Pour la location, la vente, la livraison, la mobilité, le respiratoire ou les soins à domicile, les pages dédiées présentent le détail adapté à chaque besoin.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/confort/confort-matelas-tubulaire-maroc.webp",
      alt: "Matelas tubulaire anti-escarres à air pour patient alité à domicile au Maroc",
      title: "Matelas anti-escarres tubulaire au Maroc",
      caption: "Matelas tubulaire anti-escarres",
    },
    equipment: {
      src: "/pillars/confort/confort-garde-robe-pliable-maroc.webp",
      alt: "Garde-robe pliable à roues pour chambre médicalisée à domicile au Maroc",
      title: "Garde-robe médicale au Maroc",
      caption: "Garde-robe pliable à roues",
    },
    process: {
      src: "/pillars/confort/confort-paravent-maroc.webp",
      alt: "Paravent médical pour intimité et confort à domicile au Maroc",
      title: "Paravent médical au Maroc",
      caption: "Paravent médical",
    },
    cities: {
      src: "/pillars/confort/confort-table-examen-maroc.webp",
      alt: "Table d’examen pour installation et confort médical à domicile au Maroc",
      title: "Table d’examen au Maroc",
      caption: "Table d’examen",
    },
  },
  whyTitle: "Pourquoi le matériel de confort médical est important ?",
  whyParagraphs: [
    "Le confort à domicile ne concerne pas seulement le bien-être. Il peut aussi aider la famille à mieux organiser le quotidien autour d’un patient qui a besoin d’assistance. Lorsqu’une personne passe beaucoup de temps au lit, se déplace difficilement ou nécessite une présence régulière, certains équipements deviennent très utiles.",
    "Un lit médicalisé peut faciliter l’installation du patient. Une table de lit peut aider pour les repas, la lecture ou les objets du quotidien. Une chaise percée peut éviter des déplacements difficiles jusqu’aux toilettes. Un matelas anti-escarres peut être demandé pour une personne qui reste longtemps alitée, selon les recommandations adaptées à sa situation.",
    "Le matériel de confort médical peut aussi aider les proches, les aidants ou les gardes-malades à accompagner la personne plus facilement. L’objectif est de rendre le domicile plus pratique, plus organisé et plus rassurant pour toute la famille.",
    "SOS Santé Maroc aide les familles à trouver une solution disponible dans leur ville, que le besoin soit temporaire ou durable. Le service clarifie le besoin pratique, vérifie les disponibilités et oriente vers une solution adaptée, sans remplacer un avis médical.",
    "Le matériel de confort médical au Maroc s’inscrit souvent dans une démarche de maintien à domicile. Il peut être associé, selon le cas, à du matériel de mobilité, à une livraison ou à une aide humaine, en gardant chaque sujet sur sa page dédiée pour rester clair.",
  ],
  situationsTitle:
    "Dans quelles situations rechercher du matériel de confort médical ?",
  situationsIntro:
    "Les demandes de matériel de confort médical au Maroc concernent surtout la personne alitée, le retour après hospitalisation, la personne âgée, la convalescence et l’accompagnement quotidien.",
  situations: [
    {
      title: "Personne alitée à domicile",
      paragraphs: [
        "Lorsqu’une personne reste longtemps au lit, la famille peut avoir besoin d’un lit médicalisé, d’un matelas adapté, d’une table de lit et parfois d’une chaise percée. Ces équipements permettent d’organiser le quotidien autour du patient et de faciliter certaines tâches.",
        "Pour les situations sensibles, le choix du matériel doit rester adapté à la personne et, si nécessaire, suivi des recommandations d’un professionnel de santé.",
      ],
    },
    {
      title: "Retour à domicile après hospitalisation",
      paragraphs: [
        "Après une hospitalisation, le domicile doit parfois être préparé avant le retour du patient. Le matériel de confort médical peut être nécessaire pour installer la personne dans de meilleures conditions dès son arrivée.",
        "La livraison à domicile peut aussi être utile pour recevoir le matériel rapidement. Ce sujet est traité sur la page livraison.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
    {
      title: "Personne âgée en perte d’autonomie",
      paragraphs: [
        "Une personne âgée peut avoir besoin d’un équipement adapté pour rester à domicile. Le lit médicalisé, la table de lit, la chaise percée ou le matelas anti-escarres peuvent faire partie d’une solution de maintien à domicile.",
        "Si une présence humaine est aussi nécessaire, la famille peut consulter la page Aide à domicile et garde-malade au Maroc.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Convalescence après opération",
      paragraphs: [
        "Après une opération, le patient peut avoir besoin d’un espace de repos plus confortable, d’un lit adapté ou d’accessoires pour limiter les déplacements et faciliter les gestes du quotidien.",
        "Pour un besoin temporaire, la location est souvent plus logique. Le détail se trouve sur la page location.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Accompagnement par la famille ou un garde-malade",
      paragraphs: [
        "Le matériel de confort médical peut faciliter l’aide quotidienne. Lorsqu’un proche, un garde-malade ou une aide à domicile intervient, certains équipements rendent l’accompagnement plus simple et mieux organisé.",
        "Le matériel ne remplace pas l’accompagnement humain : les deux peuvent se compléter selon la situation.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
  ],
  midCtaTitle: "Besoin de matériel de confort rapidement ?",
  midCtaText:
    "Indiquez votre ville et l’équipement recherché : SOS Santé Maroc vérifie la disponibilité et vous oriente vers une solution adaptée.",
  cityMoneyBlock: {
    title: "Trouver du matériel de confort médical dans votre ville",
    text: "Choisissez votre ville pour voir les équipements de confort disponibles et demander une orientation selon disponibilité.",
    image: {
      src: "/pillars/confort/confort-villes-catalogue-maroc.webp",
      alt: "Matériel de confort médical au Maroc — lit médicalisé et matelas anti-escarres à domicile, catalogues par ville",
      title: "Matériel de confort médical dans votre ville | SOS Santé",
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
  equipmentTitle: "Les principaux équipements de confort médical au Maroc",
  equipmentIntro:
    "SOS Santé Maroc aide à rechercher plusieurs types de matériel de confort médical selon disponibilité. Les modèles, délais et conditions varient selon la ville et les fournisseurs partenaires.",
  equipment: [
    {
      id: "lit-medicalise",
      title: "Lit médicalisé au Maroc",
      icon: "bed",
      paragraphs: [
        "Le lit médicalisé est l’un des équipements de confort les plus demandés pour le maintien à domicile. Il peut être utile pour une personne âgée, un patient alité, une personne dépendante ou une personne en convalescence.",
        "Le lit médicalisé au Maroc peut aider à mieux installer le patient et à faciliter certaines positions selon le modèle disponible. Il peut aussi être accompagné d’accessoires comme des barrières, une potence, un matelas ou une table de lit.",
        "SOS Santé Maroc aide les familles à rechercher un lit médicalisé selon la ville, la durée du besoin et la disponibilité. Selon le cas, la famille peut demander une location ou un achat.",
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
      id: "matelas-anti-escarres",
      title: "Matelas anti-escarres au Maroc",
      icon: "airline_seat_flat",
      paragraphs: [
        "Le matelas anti-escarres est souvent recherché pour les personnes qui restent longtemps alitées. Il peut contribuer au confort du patient et aider à mieux répartir les points d’appui, selon le modèle et la situation.",
        "Le matelas anti-escarres au Maroc doit être choisi avec prudence. Pour une personne fragile, dépendante ou alitée sur une longue durée, il est recommandé de suivre les conseils d’un professionnel de santé.",
        "SOS Santé Maroc peut aider à vérifier la disponibilité d’un matelas anti-escarres selon la ville, en location ou en vente selon les possibilités.",
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
      id: "table-de-lit",
      title: "Table de lit médicalisée au Maroc",
      icon: "table_restaurant",
      paragraphs: [
        "La table de lit médicalisée est un accessoire pratique pour les personnes qui passent beaucoup de temps au lit. Elle peut servir pour les repas, la lecture, l’écriture, les objets personnels ou certaines activités quotidiennes.",
        "La table de lit médicalisée au Maroc peut accompagner un lit médicalisé ou être demandée séparément. Elle est utile pour améliorer l’autonomie et le confort d’un patient installé à domicile.",
        "SOS Santé Maroc aide les familles à rechercher une table de lit selon disponibilité dans leur ville.",
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
    {
      id: "chaise-percee",
      title: "Chaise percée au Maroc",
      icon: "chair_alt",
      paragraphs: [
        "La chaise percée est un équipement pratique pour les personnes qui ont des difficultés à se déplacer jusqu’aux toilettes. Elle peut être utile pour une personne âgée, dépendante, alitée ou en convalescence.",
        "La chaise percée au Maroc peut améliorer l’organisation du quotidien à domicile, surtout lorsque les déplacements sont difficiles ou fatigants. Elle peut être utilisée temporairement ou sur une période plus longue selon le besoin.",
        "SOS Santé Maroc peut aider à trouver une chaise percée disponible selon la ville.",
      ],
      link: {
        label: "Catalogue confort (vente)",
        href: venteCategoryPath("confort", "agadir"),
      },
      cityProductLinks: venteCategoryCityLinks(
        "confort",
        "Voir le catalogue confort dans votre ville :"
      ),
    },
    {
      id: "accessoires-lit",
      title: "Accessoires pour lit médicalisé",
      icon: "settings",
      paragraphs: [
        "Certains accessoires peuvent compléter l’utilisation d’un lit médicalisé : barrières, potence, matelas, protections, table de lit ou autres éléments selon disponibilité. Ces accessoires dépendent du modèle de lit, du fournisseur et du besoin du patient.",
        "SOS Santé Maroc peut aider à vérifier les options disponibles auprès de fournisseurs partenaires.",
      ],
      link: {
        label: "Voir un lit en location",
        href: locationRentalProductPath(
          "lit-medicalise-electrique-matelas-location",
          "agadir"
        ),
      },
      cityProductLinks: locationProductCityLinks(
        "lit-medicalise-electrique-matelas-location",
        "Voir le lit médicalisé en location dans votre ville :"
      ),
    },
    {
      id: "chambre-medicalisee",
      title: "Équipements pour chambre médicalisée à domicile",
      icon: "bedroom_parent",
      paragraphs: [
        "Dans certains cas, la famille souhaite organiser une chambre plus adaptée au maintien à domicile. Le matériel peut inclure un lit médicalisé, un matelas anti-escarres, une table de lit, une chaise percée et parfois du matériel de mobilité.",
        "Le contenu détaillé sur les fauteuils roulants, déambulateurs ou lève-personnes se trouve sur la page Matériel de mobilité au Maroc.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
  ],
  chooseTitle: "Comment choisir le bon matériel de confort médical ?",
  chooseIntro:
    "Le choix du matériel dépend de la situation de la personne, de la durée du besoin, de l’espace disponible, du niveau d’autonomie et de la présence d’un accompagnant.",
  chooseBlocks: [
    {
      title: "Évaluer le niveau d’autonomie",
      paragraphs: [
        "Une personne qui peut se lever seule n’aura pas les mêmes besoins qu’une personne alitée. Pour une personne très dépendante, le lit médicalisé, le matelas anti-escarres et certains accessoires peuvent être plus importants.",
      ],
    },
    {
      title: "Comprendre la durée du besoin",
      paragraphs: [
        "Pour une convalescence courte, la location peut être adaptée. Pour un besoin durable, l’achat peut parfois être plus logique. Cette page mentionne les deux possibilités, avec renvoi vers les pages dédiées.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Vérifier l’espace dans la chambre",
      paragraphs: [
        "Avant d’installer un lit médicalisé ou une table de lit, il faut vérifier la taille de la chambre, l’accès au logement, la largeur des portes, l’étage, l’ascenseur et l’emplacement prévu.",
        "Ces informations pratiques accélèrent la coordination de la livraison et de l’installation éventuelle.",
      ],
    },
    {
      title: "Confort du patient et avis médical",
      paragraphs: [
        "Le matériel doit être pratique, stable et adapté au quotidien. Le confort du patient est important, mais la facilité d’utilisation pour la famille ou l’aidant l’est aussi.",
        "Pour certains équipements comme le matelas anti-escarres ou les situations de personne alitée, il est préférable de suivre les recommandations d’un professionnel de santé.",
      ],
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc pour le matériel de confort ?",
  processIntro:
    "Le parcours reste simple : clarifier le besoin pratique, vérifier la disponibilité, orienter vers une solution, puis coordonner la demande selon la ville.",
  processSteps: [
    {
      title: "La famille envoie sa demande",
      text: "Le client contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Il indique la ville, le type d’équipement recherché (lit médicalisé, matelas anti-escarres, chaise percée, table de lit, accessoires), le besoin temporaire ou durable, et location ou achat souhaité.",
    },
    {
      title: "SOS Santé Maroc clarifie le besoin",
      text: "L’équipe pose quelques questions pratiques : situation générale, durée prévue, espace disponible, accès au logement, étage, besoin de livraison ou d’installation. Cette étape sert à orienter la demande. Elle ne remplace pas un diagnostic médical.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc vérifie les options disponibles auprès de fournisseurs partenaires selon la ville. Les modèles, prix, délais et conditions peuvent varier.",
    },
    {
      title: "Orientation vers une solution adaptée",
      text: "Selon les disponibilités, SOS Santé Maroc peut orienter la famille vers une solution adaptée : lit médicalisé, matelas anti-escarres, table de lit, chaise percée ou autre équipement de confort.",
    },
    {
      title: "Coordination de la demande",
      text: "SOS Santé Maroc facilite la coordination entre la famille et le fournisseur partenaire pour simplifier la démarche.",
    },
    {
      title: "Suivi après la demande",
      text: "Selon le besoin, SOS Santé Maroc peut rester disponible pour une prolongation, une récupération après location, une demande complémentaire ou un autre équipement.",
    },
  ],
  durationTitle: "Location, achat et maintien à domicile",
  durationIntro:
    "Cette page cible le matériel de confort médical au Maroc. La location, l’achat et la livraison restent des options complémentaires, liées au maintien à domicile.",
  durationBlocks: [
    {
      title: "Location de matériel de confort médical",
      paragraphs: [
        "La location peut être utile pour un besoin temporaire : retour à domicile après hospitalisation, convalescence, blessure ou situation passagère. Elle peut concerner un lit médicalisé, un matelas anti-escarres, une table de lit ou une chaise percée.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Achat de matériel de confort médical",
      paragraphs: [
        "L’achat peut être préférable lorsque le besoin est durable ou quotidien. Une personne âgée, dépendante ou alitée sur une longue période peut avoir besoin d’un équipement disponible en permanence.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
    {
      title: "Livraison et maintien à domicile",
      paragraphs: [
        "Certains équipements de confort sont volumineux, notamment le lit médicalisé. Une livraison à domicile peut être organisée selon disponibilité. Le matériel de confort médical peut aussi être complété par une aide à domicile selon le besoin.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
  ],
  citiesTitle: "Matériel de confort médical dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc peut traiter les demandes de matériel de confort médical dans plusieurs villes du Maroc selon disponibilité. Les pages villes précisent le contexte local sans remplacer ce hub national.",
  cities: [
    {
      name: "Casablanca",
      title: "Matériel de confort médical à Casablanca",
      paragraphs: [
        "À Casablanca, les familles recherchent souvent un lit médicalisé, un matelas anti-escarres, une table de lit ou une chaise percée pour un proche à domicile. SOS Santé Maroc peut aider à vérifier les disponibilités auprès des fournisseurs partenaires selon les quartiers et le besoin.",
        "Indiquez votre quartier et le type d’équipement pour accélérer la confirmation.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: venteCategoryPath("confort", "casablanca"),
      locationLabel: "Catalogue confort Casablanca",
    },
    {
      name: "Agadir",
      title: "Matériel de confort médical à Agadir",
      paragraphs: [
        "À Agadir, le matériel de confort médical peut être demandé après une hospitalisation, une opération ou pour accompagner une personne âgée à domicile. SOS Santé Maroc aide à rechercher une solution disponible selon la ville.",
        "Agadir dispose aussi d’un catalogue location et vente utile pour comparer les options.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: venteCategoryPath("confort", "agadir"),
      locationLabel: "Catalogue confort Agadir",
    },
    {
      name: "Marrakech",
      title: "Matériel de confort médical à Marrakech",
      paragraphs: [
        "À Marrakech, les demandes peuvent concerner l’aménagement d’une chambre à domicile, la recherche d’un lit médicalisé ou d’un matelas anti-escarres selon disponibilité.",
        "Précisez toujours la zone et l’équipement recherché pour faciliter la vérification.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: venteCategoryPath("confort", "marrakech"),
      locationLabel: "Catalogue confort Marrakech",
    },
    {
      name: "Rabat",
      title: "Matériel de confort médical à Rabat",
      paragraphs: [
        "À Rabat, SOS Santé Maroc accompagne les familles dans la recherche de matériel de confort pour un patient, une personne âgée ou une personne en convalescence à domicile.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: venteCategoryPath("confort", "rabat"),
      locationLabel: "Catalogue confort Rabat",
    },
    {
      name: "Tanger",
      title: "Matériel de confort médical à Tanger",
      paragraphs: [
        "À Tanger, les familles peuvent demander une aide pour trouver un lit médicalisé, une chaise percée, une table de lit ou un matelas anti-escarres selon disponibilité.",
        "Comme pour les autres villes, la confirmation dépend du stock partenaire et du délai souhaité.",
      ],
      hubHref: hubCityPath("tanger"),
      hubLabel: "Matériel médical Tanger",
      locationHref: venteCategoryPath("confort", "tanger"),
      locationLabel: "Catalogue confort Tanger",
    },
  ],
  otherCitiesTitle: "Autres villes du Maroc",
  otherCitiesParagraphs: [
    "SOS Santé Maroc peut aussi traiter les demandes à Fès, Meknès, Salé, Témara, Kénitra, Oujda, Tétouan, Mohammedia, El Jadida, Safi, Essaouira, Laâyoune et d’autres villes selon disponibilité.",
    "Pour une vue d’ensemble des pages locales, consultez le hub national du matériel médical par ville.",
  ],
  otherCitiesLink: {
    label: "Matériel médical par ville au Maroc",
    href: MATERIEL_PAR_VILLE_PATH,
  },
  compareTitle: "Différence entre matériel de confort, mobilité et respiratoire",
  compareIntro:
    "Cette page reste centrée sur le confort médical. Pour la mobilité, le respiratoire ou d’autres équipements, les pages dédiées présentent le détail adapté à chaque famille de matériel.",
  compareBlocks: [
    {
      title: "Matériel de confort médical",
      paragraphs: [
        "Il concerne le repos, l’installation et le quotidien du patient à domicile : lit médicalisé, matelas anti-escarres, table de lit, chaise percée et accessoires de chambre.",
      ],
    },
    {
      title: "Matériel de mobilité",
      paragraphs: [
        "Il concerne les déplacements, l’appui à la marche et les transferts : fauteuil roulant, déambulateur, béquilles, rollator, lève-personne.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Matériel médical respiratoire",
      paragraphs: [
        "Il concerne les équipements liés à l’oxygène et à l’assistance respiratoire : concentrateur d’oxygène, CPAP, nébuliseur et accessoires.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
  ],
  whyUsTitle: "Pourquoi passer par SOS Santé Maroc ?",
  whyUsIntro:
    "SOS Santé Maroc positionne le matériel de confort médical comme un service de coordination : clarifier le besoin, vérifier les options et faciliter l’accès selon la ville.",
  whyUsBlocks: [
    {
      title: "Une demande plus simple",
      text: "La famille peut envoyer une seule demande pour rechercher un lit médicalisé, un matelas anti-escarres, une chaise percée, une table de lit ou un accessoire de confort selon disponibilité.",
    },
    {
      title: "Une orientation selon la situation",
      text: "SOS Santé Maroc aide à préciser le type de matériel adapté au besoin pratique : repos, installation, personne alitée, confort quotidien ou maintien à domicile.",
    },
    {
      title: "Une coordination locale",
      text: "Les disponibilités peuvent varier selon Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes. SOS Santé Maroc adapte la recherche selon la localisation.",
    },
    {
      title: "Une solution pour les familles",
      text: "Le service est pensé pour les familles qui cherchent rapidement une solution pour un proche, souvent dans un moment sensible ou urgent.",
    },
    {
      title: "Une approche responsable",
      text: "SOS Santé Maroc ne donne pas de diagnostic médical. Pour les situations complexes ou médicales sensibles, la famille doit suivre les recommandations d’un professionnel de santé. En urgence vitale, contactez les services d’urgence officiels.",
    },
  ],
  relatedTitle: "Pages et services liés",
  relatedPillars: [
    {
      label: "Location de matériel médical au Maroc",
      href: LOCATION_PILLAR_PATH,
      description: "Location temporaire selon disponibilité",
    },
    {
      label: "Vente de matériel médical au Maroc",
      href: VENTE_MAROC_PATH,
      description: "Achat lorsque le besoin est durable",
    },
    {
      label: "Livraison de matériel médical à domicile au Maroc",
      href: LIVRAISON_PILLAR_PATH,
      description: "Organisation logistique à domicile",
    },
    {
      label: "Matériel de mobilité au Maroc",
      href: MOBILITE_MAROC_PATH,
      description: "Fauteuils, déambulateurs et transferts",
    },
    {
      label: "Matériel médical respiratoire au Maroc",
      href: RESPIRATOIRE_MAROC_PATH,
      description: "Concentrateurs et équipements respiratoires",
    },
    {
      label: "Aide à domicile et garde-malade au Maroc",
      href: AIDE_DOMICILE_PATH,
      description: "Accompagnement humain à domicile",
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
    "Quelques contenus de soutien pour préparer un retour à domicile ou mieux comprendre certains besoins liés au maintien à domicile.",
  blogLinks: [
    {
      label: "Location concentrateur d’oxygène à Agadir",
      href: "/blog/respiratoire/concentreur-oxygene-agadir-avantages",
      description: "Organisation pratique à domicile",
    },
    {
      label: "Catalogue confort Agadir",
      href: venteCategoryPath("confort", "agadir"),
      description: "Produits confort disponibles à l’achat",
    },
    {
      label: "Lit médicalisé en location",
      href: locationRentalProductPath(
        "lit-medicalise-electrique-matelas-location",
        "agadir"
      ),
      description: "Exemple de lit médicalisé à louer",
    },
    {
      label: "Aide à domicile au Maroc",
      href: AIDE_DOMICILE_PATH,
      description: "Compléter le matériel par un accompagnement humain",
    },
  ],
  productSidebar: confortPillarSidebar(),
  faqs: [
    {
      question: "Quel matériel de confort médical peut-on trouver au Maroc ?",
      answer:
        "Selon disponibilité, SOS Santé Maroc aide à rechercher du matériel de confort médical comme lit médicalisé, matelas anti-escarres, table de lit, chaise percée et accessoires pour patient à domicile.",
    },
    {
      question: "Peut-on louer un lit médicalisé au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à trouver un lit médicalisé à louer au Maroc selon disponibilité dans la ville concernée. Ce matériel peut être utile pour une personne âgée, alitée ou en convalescence.",
    },
    {
      question: "Peut-on acheter un lit médicalisé au Maroc ?",
      answer:
        "Oui, l’achat d’un lit médicalisé peut être envisagé si le besoin est durable. SOS Santé Maroc aide à rechercher les options disponibles auprès de fournisseurs partenaires.",
    },
    {
      question: "À quoi sert un matelas anti-escarres ?",
      answer:
        "Un matelas anti-escarres est souvent demandé pour les personnes qui restent longtemps alitées. Son choix doit être adapté à la situation du patient et suivre les recommandations d’un professionnel de santé si nécessaire.",
    },
    {
      question: "À quoi sert une table de lit médicalisée ?",
      answer:
        "La table de lit médicalisée permet de prendre les repas, lire, écrire ou poser des objets à proximité du patient installé au lit. Elle peut accompagner un lit médicalisé.",
    },
    {
      question: "Quand utiliser une chaise percée ?",
      answer:
        "La chaise percée peut être utile lorsqu’une personne a des difficultés à se déplacer jusqu’aux toilettes. Elle peut aider une personne âgée, dépendante, alitée ou en convalescence.",
    },
    {
      question: "Le matériel de confort peut-il être livré à domicile ?",
      answer:
        "Oui, la livraison peut être organisée selon la ville, le matériel et la disponibilité. Pour le détail, consultez la page Livraison de matériel médical à domicile au Maroc.",
    },
    {
      question: "Dans quelles villes SOS Santé Maroc peut-il aider ?",
      answer:
        "SOS Santé Maroc peut traiter les demandes à Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et d’autres villes du Maroc selon disponibilité.",
    },
    {
      question: "SOS Santé Maroc est-il une clinique ?",
      answer:
        "Non. SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service de coordination pour aider les familles à trouver du matériel médical adapté.",
    },
    {
      question: "Comment demander la disponibilité d’un équipement de confort ?",
      answer:
        "Contactez SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant la ville, l’équipement recherché, la durée prévue et le besoin principal.",
    },
  ],
  ctaTitle: "Besoin de matériel de confort médical au Maroc ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier la disponibilité d’un lit médicalisé, matelas anti-escarres, table de lit, chaise percée ou accessoire de confort dans votre ville. Notre équipe vous aide à rechercher une solution adaptée selon le besoin du patient, la durée prévue et les disponibilités locales.",
};
