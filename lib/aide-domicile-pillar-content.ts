import { ABOUT_PATH } from "@/lib/about-content";
import { careServiceCityPath } from "@/lib/care-services";
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
import { PHONE_NUMBER } from "@/lib/products";
import { hubCityPath } from "@/lib/routes";
import { careServiceCityLinks } from "@/lib/pillar-city-product-links";
import { careServicesPillarSidebar } from "@/lib/pillar-sidebar-products";

export const aideDomicilePillarContent: LocationPillarContent = {
  path: AIDE_DOMICILE_PATH,
  heroImage: "/pillars/aide-a-domicile-garde-malade-maroc.webp",
  heroImageAlt:
    "Aide à domicile et garde-malade au Maroc — accompagnement d’un proche à la maison avec SOS Santé",
  heroImageTitle: "Aide à domicile et garde-malade au Maroc | SOS Santé",
  metaTitle: "Aide à domicile Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc aide les familles à trouver une aide à domicile ou un garde-malade au Maroc selon la ville, le besoin et la disponibilité.",
  keywords: [
    "aide à domicile Maroc",
    "aide à domicile au Maroc",
    "garde-malade Maroc",
    "garde-malade à domicile Maroc",
    "assistance patient domicile Maroc",
    "accompagnement personne âgée Maroc",
    "aide aux personnes dépendantes Maroc",
    "aide à domicile après hospitalisation",
  ],
  badge: "Service national · Aide à domicile",
  h1: "Aide à domicile et garde-malade au Maroc",
  heroTitleSuffix: "pour accompagner vos proches",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver une solution d’aide à domicile, de garde-malade ou d’assistance patient selon la ville, le besoin de la personne et la disponibilité des prestataires partenaires.",
  secondaryCtaLabel: "Parler avec un conseiller",
  secondaryCtaHref: `tel:${PHONE_NUMBER}`,
  primaryCtaLabel: "Demander une aide à domicile sur WhatsApp",
  reassurance: [
    "Aide à domicile selon disponibilité",
    "Garde-malade pour personnes âgées ou patients en convalescence",
    "Assistance patient à domicile",
    "Accompagnement des personnes dépendantes",
    "Coordination avec prestataires partenaires au Maroc",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je recherche une aide à domicile ou un garde-malade au Maroc. Ville, horaires et besoin : ",
  introTitle: "Trouver une aide à domicile ou un garde-malade",
  intro: [
    "Lorsqu’un proche devient dépendant, sort de l’hôpital, se remet d’une opération ou a besoin d’une présence régulière à la maison, la famille peut rapidement se sentir dépassée. Il faut organiser l’accompagnement, trouver une personne fiable, comprendre le besoin réel et parfois coordonner plusieurs services autour du patient.",
    "L’aide à domicile au Maroc répond à ce besoin humain et pratique. Elle peut concerner une personne âgée, une personne en convalescence, un patient ayant besoin d’assistance, une personne à mobilité réduite ou une personne dépendante qui ne peut plus gérer seule certaines tâches du quotidien.",
    "SOS Santé Maroc aide les familles à trouver une solution d’aide à domicile ou de garde-malade selon la ville, le besoin de la personne et la disponibilité des prestataires partenaires. Le service reçoit la demande, clarifie la situation, vérifie les possibilités disponibles et facilite la mise en relation avec un prestataire adapté.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. Le service ne donne pas de diagnostic médical et ne remplace pas un professionnel de santé. Son rôle est d’orienter, de coordonner et d’aider les familles à trouver une solution pratique à domicile.",
    "Cette page est dédiée à l’aide à domicile et au garde-malade. Les soins médicaux à domicile, comme infirmier, kinésithérapeute, pansement ou injection, sont traités dans la page dédiée Soins à domicile au Maroc.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/aide/aide-oxymetre-doigt-maroc.webp",
      alt: "Oxymètre de doigt pour suivi à domicile avec aide à domicile au Maroc",
      title: "Oxymètre de doigt au Maroc",
      caption: "Oxymètre de doigt",
    },
    equipment: {
      src: "/pillars/aide/aide-tensiometre-maroc.webp",
      alt: "Tensiomètre électronique pour accompagnement patient à domicile au Maroc",
      title: "Tensiomètre à domicile au Maroc",
      caption: "Tensiomètre électronique",
    },
    process: {
      src: "/pillars/aide/aide-thermometre-infrarouge-maroc.webp",
      alt: "Thermomètre infrarouge sans contact pour surveillance à domicile au Maroc",
      title: "Thermomètre infrarouge au Maroc",
      caption: "Thermomètre infrarouge",
    },
    cities: {
      src: "/pillars/aide/aide-canne-siege-maroc.webp",
      alt: "Canne siège aluminium pliable pour personne âgée accompagnée à domicile au Maroc",
      title: "Canne siège au Maroc",
      caption: "Canne siège pliable",
    },
  },
  whyTitle: "Pourquoi demander une aide à domicile ?",
  whyParagraphs: [
    "L’aide à domicile peut devenir nécessaire lorsque la famille ne peut pas assurer seule la présence ou l’accompagnement d’un proche. Certaines situations demandent du temps, de la patience et une organisation régulière.",
    "Une personne âgée peut avoir besoin d’aide pour se déplacer, se lever, manger, rester accompagnée ou garder une routine stable. Un patient en convalescence peut avoir besoin d’une présence après une hospitalisation ou une opération. Une personne dépendante peut nécessiter une assistance plus régulière pour éviter l’isolement et faciliter le quotidien.",
    "L’objectif de l’aide à domicile n’est pas de remplacer la famille, mais de la soutenir. Elle permet d’apporter une présence, une aide pratique et un accompagnement humain selon le besoin de la personne. Dans beaucoup de cas, quelques heures par jour ou une présence nocturne suffisent déjà à soulager l’entourage.",
    "SOS Santé Maroc aide les familles à chercher un prestataire disponible dans leur ville. Les disponibilités peuvent varier selon Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes du Maroc. Une demande claire avec la ville, les horaires et le type d’accompagnement accélère la vérification.",
    "Dans certains cas, l’aide humaine peut être complétée par du matériel médical à domicile. Ces sujets restent sur leurs pages dédiées pour garder une information claire et utile pour la famille. SOS Santé Maroc peut aider à coordonner les deux besoins selon la situation.",
  ],
  situationsTitle:
    "Dans quelles situations demander une aide à domicile ou un garde-malade ?",
  situationsIntro:
    "Les demandes d’aide à domicile au Maroc concernent surtout les personnes âgées, le retour après hospitalisation, la convalescence, la dépendance, la mobilité réduite et les familles indisponibles ou éloignées.",
  situations: [
    {
      title: "Personne âgée vivant à domicile",
      paragraphs: [
        "Avec l’âge, certaines personnes ont besoin d’un accompagnement plus régulier. Elles peuvent avoir des difficultés à se déplacer, se lever, préparer certaines choses ou rester seules longtemps.",
        "Une aide à domicile peut apporter une présence rassurante et soutenir la famille dans l’organisation du quotidien.",
      ],
    },
    {
      title: "Retour à domicile après hospitalisation",
      paragraphs: [
        "Après une hospitalisation, le retour à la maison peut être délicat. La personne peut être fatiguée, moins autonome ou avoir besoin d’aide temporaire. Un garde-malade ou une aide à domicile peut accompagner cette période selon les besoins.",
        "Parfois, le matériel médical (lit, fauteuil, chaise percée) est aussi nécessaire. La location et la livraison sont traitées sur leurs pages dédiées.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Convalescence après opération",
      paragraphs: [
        "Après une opération, le patient peut avoir besoin d’aide pendant quelques jours ou quelques semaines. L’accompagnement peut concerner les déplacements, la présence, l’organisation du quotidien ou la coordination avec la famille.",
        "La durée exacte dépend de la récupération et du niveau d’autonomie. SOS Santé Maroc aide à préciser le besoin pratique, sans poser de diagnostic.",
      ],
    },
    {
      title: "Personne dépendante",
      paragraphs: [
        "Une personne dépendante peut avoir besoin d’une assistance régulière pour rester à domicile. L’aide peut être ponctuelle ou plus fréquente selon la situation.",
        "L’objectif est de faciliter le maintien à domicile tout en soutenant la famille.",
      ],
    },
    {
      title: "Personne à mobilité réduite",
      paragraphs: [
        "Lorsque la personne a du mal à se déplacer, l’aide à domicile peut compléter le matériel de mobilité comme un fauteuil roulant, un déambulateur ou un lève-personne.",
        "Le détail des équipements de déplacement se trouve sur la page Matériel de mobilité au Maroc.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Famille indisponible ou éloignée",
      paragraphs: [
        "Certaines familles ne peuvent pas être présentes toute la journée ou vivent dans une autre ville. Dans ce cas, SOS Santé Maroc peut aider à rechercher une solution de garde-malade ou d’assistance patient selon disponibilité locale.",
        "Indiquez clairement la ville, les horaires et le type de présence souhaitée pour accélérer la recherche.",
      ],
    },
  ],
  midCtaTitle: "Besoin d’une aide à domicile rapidement ?",
  midCtaText:
    "Indiquez votre ville, les horaires et le besoin : SOS Santé Maroc vérifie les disponibilités auprès de prestataires partenaires.",
  cityMoneyBlock: {
    title: "Trouver une aide à domicile dans votre ville",
    text: "Choisissez votre ville pour voir les options locales et demander une aide à domicile ou un garde-malade selon disponibilité.",
    image: {
      src: "/pillars/aide/aide-villes-catalogue-maroc.webp",
      alt: "Aide à domicile et garde-malade au Maroc — accompagnement à domicile, catalogues par ville",
      title: "Aide à domicile dans votre ville | SOS Santé",
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
  equipmentTitle: "Services d’aide à domicile proposés selon disponibilité",
  equipmentIntro:
    "SOS Santé Maroc aide à rechercher plusieurs formes d’accompagnement humain à domicile selon disponibilité. Les profils, horaires et conditions varient selon la ville et les prestataires partenaires.",
  equipment: [
    {
      id: "aide-personnes-agees",
      title: "Aide à domicile pour personnes âgées",
      icon: "elderly",
      paragraphs: [
        "L’aide à domicile pour personnes âgées au Maroc est l’un des besoins les plus fréquents. Elle concerne les familles qui veulent accompagner un parent âgé à domicile, éviter l’isolement et faciliter les gestes du quotidien.",
        "SOS Santé Maroc peut aider à trouver une aide à domicile selon la ville, le besoin, la durée souhaitée et la disponibilité.",
      ],
      link: {
        label: "Aide-soignant à domicile",
        href: careServiceCityPath("aide-soignant-a-domicile", "agadir"),
      },
      cityProductLinks: careServiceCityLinks(
        "aide-soignant-a-domicile",
        "Voir l’aide-soignant à domicile dans votre ville :"
      ),
    },
    {
      id: "garde-malade",
      title: "Garde-malade à domicile",
      icon: "volunteer_activism",
      paragraphs: [
        "Le garde-malade à domicile est souvent demandé après une hospitalisation, une opération ou pour une personne dépendante. Il peut apporter une présence auprès du patient pendant une période déterminée.",
        "SOS Santé Maroc aide les familles à rechercher un garde-malade au Maroc selon disponibilité, en tenant compte de la ville, de l’horaire souhaité et du niveau d’assistance demandé.",
        "La demande peut concerner une garde de jour, une garde de nuit ou une présence sur plusieurs jours. Plus les horaires sont précis, plus la recherche auprès des prestataires partenaires est efficace.",
      ],
      link: {
        label: "Aide-soignant à domicile",
        href: careServiceCityPath("aide-soignant-a-domicile", "casablanca"),
      },
      cityProductLinks: careServiceCityLinks(
        "aide-soignant-a-domicile",
        "Voir le garde-malade / aide-soignant dans votre ville :"
      ),
    },
    {
      id: "assistance-patient",
      title: "Assistance patient à domicile",
      icon: "personal_injury",
      paragraphs: [
        "L’assistance patient à domicile peut inclure une présence, une aide aux déplacements, un accompagnement dans la maison, une surveillance générale non médicale et un soutien dans l’organisation quotidienne.",
        "SOS Santé Maroc facilite la mise en relation avec des prestataires disponibles selon la ville.",
      ],
      link: {
        label: "Aide-soignant à domicile",
        href: careServiceCityPath("aide-soignant-a-domicile", "rabat"),
      },
      cityProductLinks: careServiceCityLinks(
        "aide-soignant-a-domicile",
        "Voir l’assistance à domicile dans votre ville :"
      ),
    },
    {
      id: "personnes-dependantes",
      title: "Accompagnement des personnes dépendantes",
      icon: "handshake",
      paragraphs: [
        "L’accompagnement des personnes dépendantes concerne les personnes qui ne peuvent plus gérer seules certaines tâches du quotidien. Cela peut inclure une aide régulière, une présence plus longue ou une coordination avec la famille.",
        "SOS Santé Maroc aide à rechercher une solution adaptée selon les disponibilités locales.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      id: "soins-orientation",
      title: "Mise en relation avec prestataires de soins à domicile",
      icon: "medical_services",
      paragraphs: [
        "SOS Santé Maroc peut aussi orienter les familles vers des prestataires de soins à domicile lorsque le besoin est confirmé. Ce sujet reste lié à la coordination et renvoie vers la page dédiée Soins à domicile au Maroc.",
        "Infirmier, kinésithérapeute ou médecin à domicile ne remplacent pas l’aide à domicile : ce sont des interventions distinctes, selon qualification et disponibilité.",
      ],
      link: {
        label: "Soins à domicile au Maroc",
        href: SOINS_DOMICILE_PATH,
      },
    },
  ],
  chooseTitle: "Comment choisir une aide à domicile ou un garde-malade ?",
  chooseIntro:
    "Le choix dépend de la situation de la personne, de son niveau d’autonomie, de la durée souhaitée, des horaires, du type d’accompagnement et de la ville.",
  chooseBlocks: [
    {
      title: "Comprendre le besoin réel",
      paragraphs: [
        "Avant de chercher un prestataire, il faut préciser le besoin : présence simple, aide quotidienne, accompagnement d’une personne âgée, garde-malade après hospitalisation, assistance patient ou aide pour une personne dépendante.",
      ],
    },
    {
      title: "Définir la durée et les horaires",
      paragraphs: [
        "La famille doit préciser si elle cherche une aide pour quelques heures, une journée, une nuit, plusieurs jours ou une période plus longue. La disponibilité peut dépendre des horaires demandés.",
      ],
    },
    {
      title: "Préciser la ville et le niveau d’autonomie",
      paragraphs: [
        "Les disponibilités peuvent varier selon la ville et le quartier. Indiquez Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès ou une autre ville, avec le quartier si possible.",
        "Une personne qui marche seule n’a pas le même besoin qu’une personne alitée ou très dépendante. Ces informations permettent de mieux orienter la demande.",
      ],
    },
    {
      title: "Vérifier si du matériel est aussi nécessaire",
      paragraphs: [
        "Parfois, l’aide humaine doit être complétée par du matériel médical : lit médicalisé, fauteuil roulant, déambulateur, chaise percée ou matelas anti-escarres.",
        "Ces sujets sont traités sur les pages dédiées au matériel, pour garder une information claire et utile.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc ?",
  processIntro:
    "Le parcours reste simple : clarifier le besoin humain, vérifier les disponibilités, orienter vers un prestataire partenaire, puis coordonner la mise en relation selon la ville.",
  processSteps: [
    {
      title: "La famille envoie sa demande",
      text: "Le client contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Il indique la ville, le besoin, les horaires souhaités et la situation générale de la personne.",
    },
    {
      title: "SOS Santé Maroc clarifie la situation",
      text: "L’équipe pose quelques questions simples pour comprendre le type d’aide demandé : aide à domicile, garde-malade, assistance patient, personne âgée, personne dépendante, jour, nuit ou durée précise. Cette étape sert à orienter la demande. Elle ne remplace pas un diagnostic médical.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc vérifie les possibilités auprès de prestataires partenaires selon la ville, les horaires et le besoin exprimé.",
    },
    {
      title: "Proposition d’une solution",
      text: "Selon disponibilité, SOS Santé Maroc peut orienter la famille vers une solution adaptée.",
    },
    {
      title: "Coordination de la mise en relation",
      text: "Le service facilite la coordination entre la famille et le prestataire partenaire afin de simplifier la démarche.",
    },
    {
      title: "Suivi après la demande",
      text: "SOS Santé Maroc peut rester disponible pour ajuster la demande, prolonger l’accompagnement ou rechercher une autre solution selon disponibilité.",
    },
  ],
  durationTitle: "Aide à domicile ou garde-malade : quelle différence ?",
  durationIntro:
    "Les familles utilisent parfois les deux termes pour parler du même besoin, mais il existe une différence d’intention. Les soins médicaux restent un sujet séparé.",
  durationBlocks: [
    {
      title: "Aide à domicile",
      paragraphs: [
        "L’aide à domicile concerne surtout l’accompagnement quotidien. Elle peut aider une personne âgée ou dépendante dans certaines tâches simples du quotidien, selon les besoins et le profil du prestataire.",
        "Elle peut inclure une présence rassurante, l’aide aux déplacements dans la maison, l’accompagnement pour certaines routines, l’aide à l’organisation de la journée ou la surveillance générale non médicale.",
      ],
    },
    {
      title: "Garde-malade",
      paragraphs: [
        "Le garde-malade est souvent demandé lorsqu’une personne a besoin d’une présence plus rapprochée. Il peut accompagner un patient après une hospitalisation, une opération, une période de convalescence ou une situation de dépendance.",
        "Le garde-malade peut rester auprès du patient pendant une période définie, selon les disponibilités : quelques heures, journée, nuit ou durée plus longue selon le cas.",
      ],
    },
    {
      title: "Soins à domicile",
      paragraphs: [
        "Les soins à domicile concernent plutôt les actes réalisés par des professionnels qualifiés, comme infirmier, kiné ou médecin à domicile selon disponibilité. Ce sujet est traité séparément.",
      ],
      link: {
        label: "Soins à domicile au Maroc",
        href: SOINS_DOMICILE_PATH,
      },
    },
  ],
  citiesTitle: "Aide à domicile dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc traite les demandes d’aide à domicile et de garde-malade dans plusieurs villes marocaines selon disponibilité. Les pages locales précisent le contexte sans remplacer ce hub national.",
  cities: [
    {
      name: "Casablanca",
      title: "Aide à domicile à Casablanca",
      paragraphs: [
        "À Casablanca, les familles recherchent souvent une aide à domicile ou un garde-malade pour une personne âgée, un patient en convalescence ou une personne dépendante. SOS Santé Maroc peut aider à vérifier les disponibilités selon le quartier, les horaires et le besoin.",
        "Indiquez votre quartier et les horaires souhaités pour accélérer la confirmation.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: careServiceCityPath(
        "aide-soignant-a-domicile",
        "casablanca"
      ),
      locationLabel: "Aide à domicile Casablanca",
    },
    {
      name: "Agadir",
      title: "Aide à domicile à Agadir",
      paragraphs: [
        "À Agadir, l’aide à domicile peut concerner une personne âgée, un patient après hospitalisation ou une personne à mobilité réduite. SOS Santé Maroc accompagne les familles dans la recherche d’un prestataire disponible selon le besoin.",
        "Agadir dispose aussi de pages locales pour le matériel médical si une solution complémentaire est nécessaire.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: careServiceCityPath("aide-soignant-a-domicile", "agadir"),
      locationLabel: "Aide à domicile Agadir",
    },
    {
      name: "Marrakech",
      title: "Aide à domicile à Marrakech",
      paragraphs: [
        "À Marrakech, SOS Santé Maroc peut aider à trouver une solution d’accompagnement à domicile pour une personne âgée, dépendante ou en convalescence, selon disponibilité des prestataires partenaires.",
        "Précisez toujours la zone et le type d’accompagnement recherché.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: careServiceCityPath(
        "aide-soignant-a-domicile",
        "marrakech"
      ),
      locationLabel: "Aide à domicile Marrakech",
    },
    {
      name: "Rabat",
      title: "Aide à domicile à Rabat",
      paragraphs: [
        "À Rabat, les familles peuvent demander une aide à domicile, un garde-malade ou une assistance patient selon le besoin. SOS Santé Maroc aide à organiser la mise en relation avec un prestataire disponible.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: careServiceCityPath("aide-soignant-a-domicile", "rabat"),
      locationLabel: "Aide à domicile Rabat",
    },
    {
      name: "Tanger",
      title: "Aide à domicile à Tanger",
      paragraphs: [
        "À Tanger, SOS Santé Maroc peut accompagner les demandes de garde-malade, assistance patient ou aide à domicile selon la disponibilité locale.",
        "Comme pour les autres villes, la confirmation dépend des horaires, du besoin et des prestataires partenaires.",
      ],
      hubHref: hubCityPath("tanger"),
      hubLabel: "Matériel médical Tanger",
      locationHref: careServiceCityPath("aide-soignant-a-domicile", "tanger"),
      locationLabel: "Aide à domicile Tanger",
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
  compareTitle: "Aide à domicile, matériel médical et soins à domicile",
  compareIntro:
    "Cette page reste centrée sur l’accompagnement humain. L’aide à domicile et le matériel médical peuvent se compléter, tandis que les soins médicaux ont leur propre page.",
  compareBlocks: [
    {
      title: "Aide humaine + matériel",
      paragraphs: [
        "Dans plusieurs situations, l’aide humaine et le matériel médical vont ensemble : lit médicalisé, fauteuil roulant, déambulateur ou chaise percée selon le besoin. SOS Santé Maroc peut aider à coordonner ces demandes de manière simple.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Livraison et confort",
      paragraphs: [
        "Si un équipement volumineux est nécessaire, la livraison et le confort médical (lit, matelas, table de lit) peuvent compléter l’aide à domicile.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
    {
      title: "Soins à domicile",
      paragraphs: [
        "Les soins à domicile peuvent inclure des interventions infirmières, kiné, médecin à domicile, pansement ou injection selon disponibilité et qualification du prestataire.",
      ],
      link: {
        label: "Soins à domicile au Maroc",
        href: SOINS_DOMICILE_PATH,
      },
    },
  ],
  whyUsTitle: "Pourquoi passer par SOS Santé Maroc ?",
  whyUsIntro:
    "SOS Santé Maroc positionne l’aide à domicile comme un service de coordination et de mise en relation : clarifier le besoin, vérifier les disponibilités et faciliter le contact avec un prestataire partenaire.",
  whyUsBlocks: [
    {
      title: "Une recherche plus simple",
      text: "La famille peut envoyer une seule demande au lieu de chercher plusieurs prestataires. SOS Santé Maroc aide à clarifier le besoin et à vérifier les disponibilités.",
    },
    {
      title: "Une approche humaine",
      text: "Le service est pensé pour les familles qui cherchent une solution pour un proche dans une période parfois difficile.",
    },
    {
      title: "Une coordination selon la ville",
      text: "Les disponibilités peuvent varier selon Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes. SOS Santé Maroc adapte la recherche selon la localisation.",
    },
    {
      title: "Une orientation adaptée",
      text: "SOS Santé Maroc aide à préciser si la demande concerne une aide à domicile, un garde-malade, une assistance patient ou une mise en relation avec un prestataire de soins.",
    },
    {
      title: "Un suivi possible",
      text: "Selon la situation, SOS Santé Maroc peut accompagner la famille après la première demande : ajustement des horaires, prolongation, nouvelle demande ou service complémentaire. Ce n’est pas une clinique ni un service d’urgence médicale officiel.",
    },
  ],
  relatedTitle: "Pages et services liés",
  relatedPillars: [
    {
      label: "Soins à domicile au Maroc",
      href: SOINS_DOMICILE_PATH,
      description: "Infirmier, kiné, médecin selon disponibilité",
    },
    {
      label: "Location de matériel médical au Maroc",
      href: LOCATION_PILLAR_PATH,
      description: "Équipements temporaires selon disponibilité",
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
      label: "Matériel de confort médical au Maroc",
      href: CONFORT_MAROC_PATH,
      description: "Lits médicalisés et confort à domicile",
    },
    {
      label: "Matériel médical respiratoire au Maroc",
      href: RESPIRATOIRE_MAROC_PATH,
      description: "Concentrateurs et équipements respiratoires",
    },
    {
      label: "Vente de matériel médical au Maroc",
      href: VENTE_MAROC_PATH,
      description: "Achat lorsque le besoin est durable",
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
      label: "Aide-soignant à domicile Agadir",
      href: careServiceCityPath("aide-soignant-a-domicile", "agadir"),
      description: "Page locale d’aide à domicile",
    },
    {
      label: "Soins à domicile au Maroc",
      href: SOINS_DOMICILE_PATH,
      description: "Quand un soin médical est nécessaire",
    },
    {
      label: "Matériel de confort médical",
      href: CONFORT_MAROC_PATH,
      description: "Compléter l’aide humaine par du matériel",
    },
    {
      label: "Location de matériel médical",
      href: LOCATION_PILLAR_PATH,
      description: "Équipements temporaires après hospitalisation",
    },
  ],
  faqs: [
    {
      question: "Comment trouver une aide à domicile au Maroc ?",
      answer:
        "SOS Santé Maroc aide les familles à trouver une aide à domicile selon la ville, le besoin de la personne et la disponibilité des prestataires partenaires.",
    },
    {
      question: "Quelle est la différence entre aide à domicile et garde-malade ?",
      answer:
        "L’aide à domicile concerne surtout l’accompagnement quotidien et l’assistance pratique. Le garde-malade concerne une présence plus rapprochée auprès d’un patient ou d’une personne fragile.",
    },
    {
      question: "Peut-on demander une aide à domicile pour une personne âgée ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à rechercher une aide à domicile pour personne âgée selon disponibilité dans la ville concernée.",
    },
    {
      question: "Peut-on trouver un garde-malade à domicile au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider les familles à trouver un garde-malade à domicile selon la ville, les horaires souhaités et la disponibilité.",
    },
    {
      question: "L’aide à domicile est-elle disponible la nuit ?",
      answer:
        "Cela dépend de la ville, du besoin et de la disponibilité des prestataires partenaires. Il faut contacter SOS Santé Maroc pour vérifier les possibilités.",
    },
    {
      question: "SOS Santé Maroc propose-t-il des soins médicaux à domicile ?",
      answer:
        "SOS Santé Maroc peut orienter vers des prestataires de soins à domicile selon disponibilité, mais les soins médicaux doivent être traités par des professionnels qualifiés. Pour ce sujet, consultez la page Soins à domicile au Maroc.",
    },
    {
      question: "Peut-on demander aide à domicile et matériel médical en même temps ?",
      answer:
        "Oui, une famille peut avoir besoin d’une aide à domicile et de matériel médical comme un lit médicalisé, fauteuil roulant, déambulateur ou chaise percée. SOS Santé Maroc peut aider à coordonner la demande selon disponibilité.",
    },
    {
      question: "Dans quelles villes SOS Santé Maroc peut-il aider ?",
      answer:
        "SOS Santé Maroc peut traiter les demandes à Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et d’autres villes du Maroc selon disponibilité.",
    },
    {
      question: "SOS Santé Maroc est-il une clinique ?",
      answer:
        "Non. SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service de coordination et de mise en relation.",
    },
    {
      question: "Comment demander une aide à domicile ?",
      answer:
        "Contactez SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant la ville, le besoin, les horaires souhaités et la situation générale de la personne.",
    },
  ],
  ctaTitle: "Besoin d’une aide à domicile ou d’un garde-malade au Maroc ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier les disponibilités dans votre ville. Notre équipe vous aide à rechercher une aide à domicile, un garde-malade ou une assistance patient selon la situation de votre proche, les horaires souhaités et les prestataires disponibles.",
  productSidebar: careServicesPillarSidebar({
    title: "Aide & garde-malade",
    description:
      "Aide-soignant, garde-malade et services liés selon disponibilité dans votre ville.",
    catalogLabel: "Hubs par ville",
  }),
};
