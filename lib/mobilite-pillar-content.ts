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
import { mobilitePillarSidebar } from "@/lib/pillar-sidebar-products";
import {
  locationProductCityLinks,
  venteCategoryCityLinks,
  venteProductCityLinks,
} from "@/lib/pillar-city-product-links";

export const mobilitePillarContent: LocationPillarContent = {
  path: MOBILITE_MAROC_PATH,
  heroImage: "/pillars/materiel-mobilite-fauteuil-roulant-maroc.webp",
  heroImageAlt:
    "Matériel de mobilité au Maroc — fauteuil roulant pour personnes âgées et mobilité réduite",
  heroImageTitle: "Matériel de mobilité au Maroc | SOS Santé",
  metaTitle: "Matériel de mobilité Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc aide à trouver du matériel de mobilité : fauteuil roulant, déambulateur, béquilles, rollator et lève-personne selon disponibilité.",
  keywords: [
    "matériel de mobilité Maroc",
    "matériel mobilité Maroc",
    "fauteuil roulant Maroc",
    "déambulateur Maroc",
    "béquilles Maroc",
    "rollator Maroc",
    "lève-personne Maroc",
    "matériel pour mobilité réduite Maroc",
  ],
  badge: "Service national · Mobilité",
  h1: "Matériel de mobilité au Maroc",
  heroTitleSuffix:
    "pour personnes âgées, patients et mobilité réduite",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver du matériel de mobilité selon la ville, le besoin et la disponibilité : fauteuil roulant, déambulateur, béquilles, rollator, lève-personne et autres équipements pour faciliter les déplacements à domicile ou à l’extérieur.",
  secondaryCtaLabel: "Voir les équipements de mobilité",
  primaryCtaLabel: "Demander la disponibilité sur WhatsApp",
  reassurance: [
    "Aides à la mobilité selon disponibilité",
    "Fauteuil roulant, déambulateur, béquilles et lève-personne",
    "Orientation vers l’équipement adapté",
    "Coordination avec fournisseurs partenaires",
    "Service disponible dans plusieurs villes du Maroc",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je recherche du matériel de mobilité au Maroc. Ville et équipement : ",
  introTitle: "Aider un proche à se déplacer au quotidien",
  intro: [
    "La perte de mobilité peut rendre le quotidien plus difficile pour une personne âgée, un patient en convalescence, une personne après une blessure ou une personne à mobilité réduite. Marcher, se lever, sortir de la maison, se déplacer dans une chambre ou aller à un rendez-vous peut devenir compliqué sans équipement adapté.",
    "Le matériel de mobilité au Maroc regroupe les équipements conçus pour aider les personnes à se déplacer plus facilement ou pour faciliter l’accompagnement par la famille. Parmi les équipements les plus demandés, on trouve le fauteuil roulant, le déambulateur, les béquilles, le rollator et le lève-personne selon disponibilité.",
    "SOS Santé Maroc accompagne les familles dans la recherche de matériel de mobilité adapté à la situation. Le service aide à clarifier le besoin, vérifier la disponibilité auprès de fournisseurs partenaires, orienter vers l’équipement approprié et coordonner la demande selon la ville.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. C’est un service marocain de coordination, d’orientation et de mise en relation. Le rôle de SOS Santé Maroc est d’aider les familles à trouver une solution pratique pour améliorer la mobilité d’un proche, sans donner de diagnostic médical.",
    "Cette page est dédiée au matériel de mobilité. Pour louer, acheter ou faire livrer un équipement, les pages location, vente et livraison restent disponibles avec le détail adapté à chaque besoin.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/mobilite/mobilite-fauteuil-roulant-electrique-maroc.webp",
      alt: "Fauteuil roulant électrique pour mobilité réduite au Maroc",
      title: "Fauteuil roulant électrique au Maroc",
      caption: "Fauteuil roulant électrique",
    },
    equipment: {
      src: "/pillars/mobilite/mobilite-deambulateur-roues-maroc.webp",
      alt: "Déambulateur pliable à roues pour aide à la marche au Maroc",
      title: "Déambulateur à roues au Maroc",
      caption: "Déambulateur pliable à roues",
    },
    process: {
      src: "/pillars/mobilite/mobilite-bequilles-maroc.webp",
      alt: "Béquilles réglables pour appui temporaire après blessure au Maroc",
      title: "Béquilles au Maroc",
      caption: "Béquilles réglables",
    },
    cities: {
      src: "/pillars/mobilite/mobilite-canne-tripode-maroc.webp",
      alt: "Canne tripode pour stabilité à la marche au Maroc",
      title: "Canne tripode au Maroc",
      caption: "Canne tripode",
    },
  },
  whyTitle: "Pourquoi le matériel de mobilité est important ?",
  whyParagraphs: [
    "Le matériel de mobilité joue un rôle essentiel dans le maintien à domicile et l’autonomie. Lorsqu’une personne a des difficultés à marcher ou à se déplacer, un équipement adapté peut rendre le quotidien plus simple pour elle et pour sa famille.",
    "Une personne âgée peut avoir besoin d’un déambulateur pour sécuriser ses déplacements à la maison. Un patient après une opération peut avoir besoin de béquilles ou d’un fauteuil roulant pendant quelques semaines. Une personne avec une mobilité très réduite peut nécessiter un lève-personne pour faciliter les transferts entre le lit et le fauteuil.",
    "Dans tous les cas, l’objectif n’est pas seulement d’avoir un produit. Il faut trouver le bon équipement selon la situation : niveau d’autonomie, durée du besoin, espace à domicile, usage intérieur ou extérieur, capacité de l’aidant et disponibilité dans la ville.",
    "SOS Santé Maroc aide les familles à mieux organiser cette recherche. Au lieu de contacter plusieurs fournisseurs, le client peut envoyer une demande et obtenir une orientation selon le matériel recherché et la ville concernée. Le service reste pratique et prudent : il oriente, coordonne et facilite l’accès, sans remplacer un avis médical.",
    "Le matériel de mobilité au Maroc peut aussi s’inscrire dans une solution plus large de maintien à domicile. Selon les besoins, la famille peut combiner aides au déplacement, confort à domicile et accompagnement humain, en gardant chaque sujet sur sa page dédiée pour rester clair.",
  ],
  situationsTitle: "Dans quelles situations rechercher du matériel de mobilité ?",
  situationsIntro:
    "Les demandes de matériel de mobilité au Maroc concernent surtout la difficulté à marcher, la convalescence, la personne âgée, la mobilité réduite durable, le retour à domicile et l’assistance par un proche.",
  situations: [
    {
      title: "Difficulté à marcher",
      paragraphs: [
        "Lorsqu’une personne peut encore marcher mais manque de stabilité, le déambulateur, les béquilles ou le rollator peuvent aider selon le niveau de mobilité. Ces équipements peuvent apporter un appui supplémentaire et faciliter les déplacements courts.",
        "Préciser si le besoin est surtout à l’intérieur, pour des sorties, ou les deux aide à orienter la recherche.",
      ],
    },
    {
      title: "Convalescence après opération",
      paragraphs: [
        "Après une opération, une fracture ou une blessure, le patient peut avoir besoin d’une aide temporaire pour se déplacer. Les béquilles, le fauteuil roulant ou le déambulateur peuvent être utiles pendant la période de récupération.",
        "Pour un besoin temporaire, la location est souvent plus logique. Le détail de la location générale se trouve sur la page dédiée.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Personne âgée à domicile",
      paragraphs: [
        "Avec l’âge, les déplacements peuvent devenir plus difficiles. Une personne âgée peut avoir besoin d’un fauteuil roulant pour les sorties, d’un déambulateur pour marcher à domicile ou d’un lève-personne si les transferts deviennent compliqués.",
        "L’objectif est souvent de sécuriser les déplacements tout en préservant autant d’autonomie que possible.",
      ],
    },
    {
      title: "Mobilité réduite durable",
      paragraphs: [
        "Lorsqu’une personne a une mobilité réduite sur une longue période, il peut être nécessaire de choisir un équipement plus adapté à un usage quotidien : fauteuil roulant confortable, rollator, lève-personne ou autre aide au déplacement.",
        "Dans ce cas, l’achat peut être plus intéressant que la location. La page vente complète ce parcours.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
    {
      title: "Retour à domicile après hospitalisation",
      paragraphs: [
        "Le retour à domicile peut nécessiter une préparation. Si le patient n’est pas encore autonome, la famille peut avoir besoin d’un fauteuil roulant, de béquilles ou d’un déambulateur pour faciliter les premiers jours à la maison.",
        "La livraison à domicile peut aussi être utile pour recevoir le matériel rapidement. Ce sujet est traité sur la page livraison.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
    {
      title: "Assistance par un proche ou un garde-malade",
      paragraphs: [
        "Lorsque la famille ou un accompagnant aide la personne au quotidien, certains équipements de mobilité facilitent les gestes : transfert, déplacement, sortie, installation dans un fauteuil ou passage d’une pièce à l’autre.",
        "Pour l’accompagnement humain, consultez la page Aide à domicile et garde-malade au Maroc.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
  ],
  midCtaTitle: "Besoin d’une aide à la mobilité rapidement ?",
  midCtaText:
    "Indiquez votre ville et l’équipement recherché : SOS Santé Maroc vérifie la disponibilité et vous oriente vers une solution adaptée.",
  cityMoneyBlock: {
    title: "Trouver du matériel de mobilité dans votre ville",
    text: "Choisissez votre ville pour voir les aides à la mobilité disponibles et demander une orientation selon disponibilité.",
    image: {
      src: "/pillars/mobilite/mobilite-villes-catalogue-maroc.webp",
      alt: "Matériel de mobilité au Maroc — fauteuil roulant et déambulateur à domicile, catalogues par ville",
      title: "Matériel de mobilité dans votre ville | SOS Santé",
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
  equipmentTitle: "Les principaux équipements de mobilité au Maroc",
  equipmentIntro:
    "SOS Santé Maroc aide à rechercher plusieurs types de matériel de mobilité selon disponibilité. Les modèles, délais et conditions varient selon la ville et les fournisseurs partenaires.",
  equipment: [
    {
      id: "fauteuil-roulant",
      title: "Fauteuil roulant au Maroc",
      icon: "accessible",
      paragraphs: [
        "Le fauteuil roulant est l’un des équipements de mobilité les plus recherchés. Il peut être utilisé par une personne qui ne peut pas marcher longtemps, qui se fatigue rapidement ou qui doit éviter l’appui après une opération ou une blessure.",
        "Un fauteuil roulant peut être utile à domicile, dans les déplacements extérieurs, pour les rendez-vous médicaux ou pour faciliter la vie quotidienne. Selon disponibilité, il peut exister plusieurs modèles : fauteuil roulant manuel, fauteuil roulant pliable, fauteuil plus confortable ou modèle adapté à un usage ponctuel.",
        "SOS Santé Maroc aide les familles à rechercher un fauteuil roulant au Maroc selon la ville et le besoin. Le service peut orienter la demande vers une solution de location ou d’achat selon la durée prévue.",
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
      title: "Déambulateur au Maroc",
      icon: "elderly",
      paragraphs: [
        "Le déambulateur est une aide à la marche destinée aux personnes qui peuvent se déplacer debout mais qui ont besoin d’un appui plus stable. Il peut être utile pour une personne âgée, une personne en rééducation ou un patient qui reprend progressivement la marche.",
        "Le déambulateur au Maroc peut être recherché pour une utilisation à domicile ou pour des déplacements courts. Selon disponibilité, il peut s’agir d’un déambulateur simple, pliable ou avec roues. Certains modèles sont plus adaptés à l’intérieur, d’autres peuvent être plus pratiques pour les sorties.",
        "SOS Santé Maroc aide la famille à préciser le besoin : stabilité, facilité de rangement, utilisation intérieure ou extérieure, durée prévue et disponibilité dans la ville.",
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
      title: "Béquilles au Maroc",
      icon: "orthopedics",
      paragraphs: [
        "Les béquilles sont souvent utilisées après une entorse, une fracture, une opération ou une blessure de la jambe. Elles peuvent permettre à la personne de se déplacer pendant une période de récupération, en réduisant l’appui sur un membre inférieur.",
        "Les béquilles au Maroc peuvent être demandées pour une courte durée ou pour un besoin plus long selon la situation. La famille doit choisir une solution adaptée à la taille de la personne et à son niveau d’autonomie.",
        "SOS Santé Maroc peut aider à rechercher des béquilles disponibles dans la ville concernée. Pour une période courte, la location peut être intéressante. Pour un besoin fréquent ou répété, l’achat peut être envisagé.",
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
      id: "rollator",
      title: "Rollator au Maroc",
      icon: "directions_walk",
      paragraphs: [
        "Le rollator est une aide à la marche avec roues, souvent utilisée par les personnes âgées ou les personnes qui ont besoin d’un appui stable pour se déplacer. Certains modèles peuvent inclure un siège, ce qui permet à la personne de se reposer pendant les déplacements.",
        "Le rollator au Maroc peut être recherché pour les sorties, les déplacements plus longs ou les personnes qui veulent garder une certaine autonomie avec un équipement plus fluide qu’un déambulateur simple.",
        "SOS Santé Maroc peut aider à vérifier la disponibilité de rollators selon la ville et les fournisseurs partenaires.",
      ],
      link: {
        label: "Voir un rollator à l’achat",
        href: venteProductPath("rollator-aluminium-4-roues", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "rollator-aluminium-4-roues",
        "Voir le rollator à l’achat dans votre ville :"
      ),
    },
    {
      id: "leve-personne",
      title: "Lève-personne au Maroc",
      icon: "elevator",
      paragraphs: [
        "Le lève-personne est un équipement de transfert. Il est utilisé lorsque la personne ne peut pas se lever ou passer seule du lit au fauteuil. Il peut faciliter le travail de l’aidant et rendre certains transferts plus organisés.",
        "Le lève-personne au Maroc peut être utile pour une personne très dépendante, une personne alitée ou une personne à mobilité très réduite. Le choix doit tenir compte de l’espace disponible, du poids du patient, de l’usage prévu et de la capacité de la personne qui accompagne.",
        "SOS Santé Maroc peut aider à rechercher un lève-personne disponible selon la ville. L’utilisation de ce type d’équipement doit rester prudente et adaptée à la situation.",
      ],
      link: {
        label: "Voir un lève-personne en location",
        href: locationRentalProductPath(
          "leve-personne-electrique-location",
          "agadir"
        ),
      },
      cityProductLinks: locationProductCityLinks(
        "leve-personne-electrique-location",
        "Voir le lève-personne en location dans votre ville :"
      ),
    },
    {
      id: "accessoires-mobilite",
      title: "Accessoires d’aide au déplacement",
      icon: "support",
      paragraphs: [
        "Selon les besoins, d’autres accessoires peuvent aider une personne à mobilité réduite : coussins de fauteuil, aides au transfert, rampes, cannes, embouts de béquilles, accessoires pour fauteuil roulant ou équipements complémentaires.",
        "La disponibilité de ces accessoires dépend des fournisseurs partenaires. SOS Santé Maroc peut aider à vérifier les options disponibles selon la ville.",
      ],
      link: {
        label: "Catalogue mobilité (vente)",
        href: venteCategoryPath("mobilier-medical", "agadir"),
      },
      cityProductLinks: venteCategoryCityLinks(
        "mobilier-medical",
        "Voir le catalogue mobilité dans votre ville :"
      ),
    },
  ],
  chooseTitle: "Comment choisir le bon matériel de mobilité ?",
  chooseIntro:
    "Le choix du matériel de mobilité dépend de plusieurs critères. Il ne faut pas choisir uniquement selon le nom de l’équipement. La situation réelle de la personne est essentielle.",
  chooseBlocks: [
    {
      title: "Niveau d’autonomie",
      paragraphs: [
        "Si la personne peut marcher avec un appui, un déambulateur ou des béquilles peuvent être suffisants. Si elle ne peut pas marcher longtemps, un fauteuil roulant peut être plus adapté. Si elle ne peut pas se lever seule, un lève-personne peut être envisagé selon les recommandations et la situation.",
      ],
    },
    {
      title: "Usage intérieur ou extérieur",
      paragraphs: [
        "Un équipement utilisé à la maison n’a pas toujours les mêmes caractéristiques qu’un équipement utilisé à l’extérieur. Le fauteuil roulant doit passer dans les portes, tourner dans les pièces et rester pratique à déplacer. Le rollator peut être utile dehors, mais doit rester stable et adapté à l’utilisateur.",
      ],
    },
    {
      title: "Durée du besoin et confort",
      paragraphs: [
        "Pour un besoin temporaire, la location peut être plus adaptée. Pour un besoin durable, l’achat peut être plus logique. Un équipement de mobilité doit aussi être pratique, stable et confortable : siège, dossier, hauteur, pliage, repose-pieds selon le matériel.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Espace disponible et aide d’un proche",
      paragraphs: [
        "Avant de choisir un fauteuil roulant, un rollator ou un lève-personne, vérifiez l’espace disponible : largeur des portes, couloirs, chambre, ascenseur, escaliers et accès au logement. Certains équipements demandent l’aide d’une autre personne.",
        "Si la famille a besoin d’une présence humaine en plus du matériel, consultez la page Aide à domicile et garde-malade au Maroc.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc pour le matériel de mobilité ?",
  processIntro:
    "Le parcours reste simple : clarifier le besoin pratique, vérifier la disponibilité, orienter vers une solution, puis coordonner la demande selon la ville.",
  processSteps: [
    {
      title: "La famille envoie sa demande",
      text: "Le client contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Il indique la ville, le type d’équipement recherché (fauteuil roulant, déambulateur, béquilles, rollator, lève-personne), le besoin temporaire ou durable, et location ou achat souhaité.",
    },
    {
      title: "SOS Santé Maroc clarifie le besoin",
      text: "L’équipe pose quelques questions pratiques : usage intérieur ou extérieur, durée prévue, mobilité actuelle de la personne, accès au logement, besoin de livraison ou non. Cette étape sert à orienter la demande, pas à faire un diagnostic médical.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc vérifie les options disponibles auprès de fournisseurs partenaires selon la ville. Les modèles, prix, délais et conditions peuvent varier.",
    },
    {
      title: "Orientation vers une solution adaptée",
      text: "Une fois les informations disponibles, SOS Santé Maroc peut proposer une orientation : location, achat, type de matériel, disponibilité et conditions.",
    },
    {
      title: "Coordination de la demande",
      text: "SOS Santé Maroc facilite la coordination entre la famille et le fournisseur partenaire pour simplifier la démarche.",
    },
    {
      title: "Suivi après la demande",
      text: "Selon le besoin, SOS Santé Maroc peut rester disponible pour une prolongation, un autre équipement, une récupération après location ou une nouvelle demande.",
    },
  ],
  durationTitle: "Location, achat et maintien à domicile",
  durationIntro:
    "Cette page cible le matériel de mobilité au Maroc. La location, l’achat et la livraison restent des options complémentaires, liées au maintien à domicile.",
  durationBlocks: [
    {
      title: "Location de matériel de mobilité",
      paragraphs: [
        "La location peut être utile pour un besoin temporaire : convalescence, blessure, opération, voyage, visite familiale ou récupération progressive. Les équipements souvent loués sont le fauteuil roulant, les béquilles, le déambulateur ou le lève-personne.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Achat de matériel de mobilité",
      paragraphs: [
        "L’achat peut être préférable lorsque le besoin est quotidien, durable ou permanent. Une personne âgée ou une personne à mobilité réduite durable peut avoir besoin d’un fauteuil roulant, d’un déambulateur ou d’un rollator à long terme.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
    {
      title: "Livraison et maintien à domicile",
      paragraphs: [
        "La livraison peut être utile lorsque la famille ne peut pas se déplacer ou lorsque l’équipement est difficile à transporter. Le matériel de mobilité fait souvent partie d’une solution plus large : équipement, aide à domicile, livraison et suivi selon disponibilité.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
  ],
  citiesTitle: "Matériel de mobilité dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc peut traiter les demandes de matériel de mobilité dans plusieurs villes du Maroc selon disponibilité. Les pages villes précisent le contexte local sans remplacer ce hub national.",
  cities: [
    {
      name: "Casablanca",
      title: "Matériel de mobilité à Casablanca",
      paragraphs: [
        "À Casablanca, les familles recherchent souvent un fauteuil roulant, un déambulateur, des béquilles ou un lève-personne pour un proche à domicile. SOS Santé Maroc peut aider à vérifier les disponibilités auprès des fournisseurs partenaires selon les quartiers et le besoin.",
        "Indiquez votre quartier et le type d’équipement pour accélérer la confirmation.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: venteCategoryPath("mobilier-medical", "casablanca"),
      locationLabel: "Catalogue mobilité Casablanca",
    },
    {
      name: "Agadir",
      title: "Matériel de mobilité à Agadir",
      paragraphs: [
        "À Agadir, le matériel de mobilité peut être demandé après une blessure, une opération, une hospitalisation ou pour accompagner une personne âgée à domicile. SOS Santé Maroc aide à rechercher une solution disponible selon la ville.",
        "Agadir dispose aussi d’un catalogue location et vente utile pour comparer les options.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: venteCategoryPath("mobilier-medical", "agadir"),
      locationLabel: "Catalogue mobilité Agadir",
    },
    {
      name: "Marrakech",
      title: "Matériel de mobilité à Marrakech",
      paragraphs: [
        "À Marrakech, les demandes peuvent concerner un fauteuil roulant pour déplacements, un déambulateur pour personne âgée, des béquilles après blessure ou un lève-personne pour une personne dépendante. SOS Santé Maroc peut orienter selon disponibilité.",
        "Précisez toujours la zone et l’équipement recherché pour faciliter la vérification.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: venteCategoryPath("mobilier-medical", "marrakech"),
      locationLabel: "Catalogue mobilité Marrakech",
    },
    {
      name: "Rabat",
      title: "Matériel de mobilité à Rabat",
      paragraphs: [
        "À Rabat, SOS Santé Maroc peut accompagner les familles dans la recherche de matériel de mobilité selon la situation : mobilité réduite, convalescence, perte d’autonomie ou besoin temporaire.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: venteCategoryPath("mobilier-medical", "rabat"),
      locationLabel: "Catalogue mobilité Rabat",
    },
    {
      name: "Tanger",
      title: "Matériel de mobilité à Tanger",
      paragraphs: [
        "À Tanger, les familles peuvent demander une aide pour trouver un fauteuil roulant, un déambulateur, un rollator, des béquilles ou un lève-personne selon disponibilité.",
        "Comme pour les autres villes, la confirmation dépend du stock partenaire et du délai souhaité.",
      ],
      hubHref: hubCityPath("tanger"),
      hubLabel: "Matériel médical Tanger",
      locationHref: venteCategoryPath("mobilier-medical", "tanger"),
      locationLabel: "Catalogue mobilité Tanger",
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
  compareTitle: "Différence entre matériel de mobilité, confort et respiratoire",
  compareIntro:
    "Cette page reste centrée sur la mobilité. Pour le confort, le respiratoire ou d’autres équipements, les pages dédiées présentent le détail adapté à chaque famille de matériel.",
  compareBlocks: [
    {
      title: "Matériel de mobilité",
      paragraphs: [
        "Il concerne les déplacements, l’appui à la marche et les transferts : fauteuil roulant, déambulateur, béquilles, rollator, lève-personne.",
      ],
    },
    {
      title: "Matériel de confort médical",
      paragraphs: [
        "Il concerne les équipements liés au repos et à l’installation à domicile : lit médicalisé, matelas anti-escarres, table de lit, chaise percée.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
    {
      title: "Matériel médical respiratoire",
      paragraphs: [
        "Il concerne les équipements liés à l’oxygène et à l’assistance respiratoire : concentrateur d’oxygène, CPAP, nébuliseur, accessoires respiratoires.",
      ],
      link: {
        label: "Matériel médical respiratoire au Maroc",
        href: RESPIRATOIRE_MAROC_PATH,
      },
    },
  ],
  whyUsTitle: "Pourquoi passer par SOS Santé Maroc ?",
  whyUsIntro:
    "SOS Santé Maroc positionne le matériel de mobilité comme un service de coordination : clarifier le besoin, vérifier les options et faciliter l’accès selon la ville.",
  whyUsBlocks: [
    {
      title: "Une demande plus simple",
      text: "La famille peut envoyer une seule demande pour rechercher un fauteuil roulant, un déambulateur, des béquilles, un rollator ou un lève-personne selon disponibilité.",
    },
    {
      title: "Une orientation selon le besoin",
      text: "SOS Santé Maroc aide à préciser le type de matériel adapté à la situation pratique : marche, déplacement, transfert, sortie ou maintien à domicile.",
    },
    {
      title: "Une coordination locale",
      text: "Les disponibilités peuvent varier selon Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes. SOS Santé Maroc adapte la recherche selon la localisation.",
    },
    {
      title: "Une solution pour les familles",
      text: "Le service est pensé pour les familles qui cherchent rapidement une solution pour un proche, souvent dans un moment urgent ou stressant.",
    },
    {
      title: "Une approche responsable",
      text: "SOS Santé Maroc ne donne pas de diagnostic médical. Pour les situations complexes, la famille doit suivre les recommandations d’un professionnel de santé. En urgence vitale, contactez les services d’urgence officiels.",
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
    "Quelques contenus de soutien pour préparer un retour à domicile ou mieux comprendre certains besoins liés à la mobilité et au maintien à domicile.",
  blogLinks: [
    {
      label: "Location concentrateur d’oxygène à Agadir",
      href: "/blog/respiratoire/concentreur-oxygene-agadir-avantages",
      description: "Organisation pratique à domicile",
    },
    {
      label: "Concentrateur portable Inogen à Agadir",
      href: "/blog/respiratoire/concentrateur-oxygene-portable-inogen-agadir",
      description: "Mobilité et oxygène portable",
    },
    {
      label: "Blog respiratoire",
      href: "/blog/respiratoire",
      description: "Guides liés au maintien à domicile",
    },
    {
      label: "Catalogue mobilité Agadir",
      href: venteCategoryPath("mobilier-medical", "agadir"),
      description: "Produits mobilité disponibles à l’achat",
    },
  ],
  productSidebar: mobilitePillarSidebar(),
  faqs: [
    {
      question: "Quel matériel de mobilité peut-on trouver au Maroc ?",
      answer:
        "Selon disponibilité, SOS Santé Maroc aide à rechercher du matériel de mobilité comme fauteuil roulant, déambulateur, béquilles, rollator, lève-personne et accessoires pour personnes à mobilité réduite.",
    },
    {
      question: "Peut-on louer un fauteuil roulant au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à trouver un fauteuil roulant à louer au Maroc selon disponibilité dans la ville concernée. Ce service peut être utile pour une convalescence, une personne âgée ou une mobilité réduite temporaire.",
    },
    {
      question: "Peut-on acheter un fauteuil roulant au Maroc ?",
      answer:
        "Oui, l’achat d’un fauteuil roulant peut être envisagé si le besoin est durable. SOS Santé Maroc aide à rechercher les options disponibles auprès de fournisseurs partenaires.",
    },
    {
      question: "Quelle différence entre fauteuil roulant et déambulateur ?",
      answer:
        "Le fauteuil roulant aide une personne qui ne peut pas marcher longtemps ou qui ne peut pas se déplacer seule. Le déambulateur aide une personne qui marche encore, mais qui a besoin d’un appui plus stable.",
    },
    {
      question: "Quand utiliser des béquilles ?",
      answer:
        "Les béquilles sont souvent utilisées après une blessure, une opération, une entorse ou une fracture. Le choix doit rester adapté à la situation de la personne.",
    },
    {
      question: "À quoi sert un lève-personne ?",
      answer:
        "Le lève-personne aide au transfert d’une personne à mobilité très réduite, par exemple entre le lit et le fauteuil. Son utilisation doit être adaptée à l’espace et au niveau de dépendance.",
    },
    {
      question: "Le matériel de mobilité peut-il être livré à domicile ?",
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
      question: "Comment demander la disponibilité d’un équipement de mobilité ?",
      answer:
        "Contactez SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant la ville, l’équipement recherché, la durée prévue et le besoin principal.",
    },
  ],
  ctaTitle: "Besoin de matériel de mobilité au Maroc ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier la disponibilité d’un fauteuil roulant, déambulateur, rollator, lève-personne ou de béquilles dans votre ville. Notre équipe vous aide à rechercher une solution adaptée selon le besoin de la personne, la durée prévue et les disponibilités locales.",
};
