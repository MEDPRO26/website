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
import { respiratoirePillarSidebar } from "@/lib/pillar-sidebar-products";
import {
  locationProductCityLinks,
  venteCategoryCityLinks,
  venteProductCityLinks,
} from "@/lib/pillar-city-product-links";

export const respiratoirePillarContent: LocationPillarContent = {
  path: RESPIRATOIRE_MAROC_PATH,
  heroImage: "/pillars/materiel-respiratoire-cpap-domicile-maroc.webp",
  heroImageAlt:
    "Matériel respiratoire au Maroc — appareil CPAP ResMed utilisé à domicile selon avis médical",
  heroImageTitle: "Matériel médical respiratoire au Maroc | SOS Santé",
  metaTitle: "Matériel respiratoire Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc aide à trouver du matériel respiratoire au Maroc : concentrateur d’oxygène, CPAP, nébuliseur et accessoires selon disponibilité.",
  keywords: [
    "matériel médical respiratoire Maroc",
    "matériel respiratoire Maroc",
    "concentrateur d'oxygène Maroc",
    "location concentrateur d'oxygène Maroc",
    "oxygène à domicile Maroc",
    "CPAP Maroc",
    "nébuliseur Maroc",
    "accessoires respiratoires Maroc",
  ],
  badge: "Service national · Respiratoire",
  h1: "Matériel médical respiratoire au Maroc",
  heroTitleSuffix: "pour l’assistance à domicile",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver du matériel médical respiratoire selon la ville, le besoin et la disponibilité : concentrateur d’oxygène, CPAP, nébuliseur, masques, accessoires respiratoires et solutions d’oxygène à domicile sous recommandation médicale.",
  secondaryCtaLabel: "Voir les équipements respiratoires",
  primaryCtaLabel: "Demander la disponibilité sur WhatsApp",
  reassurance: [
    "Recherche de matériel respiratoire selon disponibilité",
    "Concentrateur d’oxygène, CPAP, nébuliseur et accessoires",
    "Coordination avec fournisseurs partenaires",
    "Service disponible dans plusieurs villes du Maroc",
    "Utilisation selon avis médical obligatoire",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je recherche du matériel médical respiratoire au Maroc. Ville et équipement : ",
  introTitle: "Le matériel respiratoire à domicile",
  intro: [
    "Le matériel médical respiratoire peut devenir nécessaire lorsqu’un patient a besoin d’une assistance respiratoire à domicile, d’un équipement d’oxygène ou d’un appareil recommandé par un professionnel de santé. Dans ces situations, les familles cherchent souvent une solution disponible rapidement, fiable et adaptée à la ville où se trouve le patient.",
    "SOS Santé Maroc aide les familles à rechercher du matériel médical respiratoire au Maroc selon disponibilité : concentrateur d’oxygène, CPAP, nébuliseur, masques à oxygène, tubulures, accessoires respiratoires et autres équipements liés à l’assistance respiratoire à domicile.",
    "Il est important de préciser que SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. Le service ne donne pas de diagnostic, ne prescrit pas d’oxygène et ne remplace pas un médecin. Son rôle est d’aider les familles à trouver un fournisseur ou une solution disponible, à coordonner la demande et à orienter le client selon la ville, le matériel recherché et les disponibilités.",
    "Pour tout équipement respiratoire, notamment le concentrateur d’oxygène, la CPAP ou tout matériel utilisé pour l’oxygène à domicile, la famille doit toujours suivre les recommandations d’un professionnel de santé concernant le type d’appareil, le débit, la durée d’utilisation et les consignes de sécurité.",
    "Cette page est dédiée au matériel respiratoire. Les sujets liés à la location générale, la vente générale ou la livraison sont mentionnés seulement comme options complémentaires, avec des liens vers leurs pages dédiées.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/respiratoire/respiratoire-concentrateur-10l-maroc.webp",
      alt: "Concentrateur d’oxygène 10L avec nébuliseur pour assistance respiratoire à domicile au Maroc",
      title: "Concentrateur d’oxygène 10L au Maroc",
      caption: "Concentrateur d’oxygène 10L",
    },
    equipment: {
      src: "/pillars/respiratoire/respiratoire-inogen-rove-g6-maroc.webp",
      alt: "Concentrateur d’oxygène portable Inogen Rove G6 utilisé à domicile au Maroc",
      title: "Concentrateur portable Inogen au Maroc",
      caption: "Concentrateur portable Inogen Rove G6",
    },
    process: {
      src: "/pillars/respiratoire/respiratoire-masque-cpap-airfit-maroc.webp",
      alt: "Masque CPAP AirFit pour traitement respiratoire à domicile au Maroc",
      title: "Masque CPAP au Maroc",
      caption: "Masque CPAP AirFit",
    },
    cities: {
      src: "/pillars/respiratoire/respiratoire-lumis-150-vni-maroc.webp",
      alt: "Appareil Lumis 150 VNI ResMed pour ventilation à domicile au Maroc",
      title: "Lumis 150 VNI au Maroc",
      caption: "Lumis 150 VNI ResMed",
    },
  },
  whyTitle: "Pourquoi le matériel respiratoire à domicile est-il important ?",
  whyParagraphs: [
    "Le matériel respiratoire à domicile peut aider certaines personnes à suivre les recommandations données par leur médecin ou professionnel de santé, sans devoir chercher seules un fournisseur disponible. Lorsqu’une famille reçoit une indication pour un concentrateur d’oxygène, une CPAP, un nébuliseur ou un accessoire respiratoire, elle peut avoir besoin d’une réponse rapide et claire.",
    "Le problème est souvent pratique : où trouver l’appareil ? Est-il disponible dans la ville ? Peut-il être livré ? Existe-t-il une option en location ou en achat ? Quels accessoires sont nécessaires ? Qui peut orienter la famille vers une solution sans compliquer la démarche ?",
    "SOS Santé Maroc intervient sur cette partie pratique et logistique. Le service aide à clarifier la demande, vérifier les disponibilités auprès de fournisseurs partenaires et coordonner la solution selon la ville du patient. L’objectif est de réduire le stress des familles face à une situation souvent urgente, tout en restant prudent sur les limites médicales.",
    "Le matériel respiratoire peut concerner des besoins temporaires ou plus durables. Certains patients peuvent avoir besoin d’un appareil pendant une période limitée, par exemple après une hospitalisation ou pendant une convalescence. D’autres peuvent avoir besoin d’un équipement sur une durée plus longue, toujours selon l’avis médical. Dans tous les cas, SOS Santé Maroc oriente la demande selon la disponibilité locale, sans décider du traitement.",
    "Enfin, la recherche de matériel médical respiratoire au Maroc doit rester distincte des autres besoins d’équipement à domicile. Un fauteuil roulant ou un lit médicalisé peut parfois être demandé en même temps : ces sujets sont traités sur leurs pages dédiées pour garder une information claire et utile pour la famille.",
  ],
  situationsTitle: "Dans quelles situations rechercher du matériel respiratoire ?",
  situationsIntro:
    "Les demandes de matériel médical respiratoire au Maroc concernent surtout l’oxygène à domicile, le retour après hospitalisation, la CPAP, le nébuliseur et les accessoires, toujours sous recommandation médicale.",
  situations: [
    {
      title: "Besoin d’oxygène à domicile",
      paragraphs: [
        "Lorsqu’un professionnel de santé recommande une assistance en oxygène à domicile, la famille peut devoir trouver rapidement un concentrateur d’oxygène ou des accessoires adaptés. SOS Santé Maroc peut aider à rechercher une solution disponible selon la ville, mais ne remplace jamais l’avis médical.",
        "La famille doit indiquer la ville, le type d’appareil recherché et les informations pratiques fournies par le professionnel de santé, sans demander à SOS Santé de choisir un débit ou une durée d’utilisation.",
      ],
    },
    {
      title: "Retour à domicile après hospitalisation",
      paragraphs: [
        "Après une hospitalisation, certains patients peuvent avoir besoin d’un suivi ou d’un équipement respiratoire à domicile. La famille doit alors organiser la recherche de matériel, la disponibilité et parfois la livraison.",
        "SOS Santé Maroc peut coordonner cette demande selon les possibilités locales. Pour l’organisation logistique, la page livraison complète ce parcours.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
    {
      title: "Utilisation d’un appareil CPAP",
      paragraphs: [
        "La CPAP est un appareil respiratoire utilisé uniquement selon indication médicale. Les familles peuvent rechercher un appareil CPAP au Maroc en location ou en achat selon disponibilité.",
        "Cette page présente le service de coordination, sans expliquer un traitement ni donner une prescription. Les réglages et la durée d’utilisation doivent venir d’un professionnel de santé.",
      ],
    },
    {
      title: "Besoin d’un nébuliseur",
      paragraphs: [
        "Le nébuliseur peut être demandé dans certaines situations respiratoires selon recommandation médicale. Il permet d’utiliser certains traitements prescrits sous forme d’aérosol.",
        "SOS Santé Maroc peut aider à trouver un nébuliseur disponible selon la ville, mais ne donne pas d’instruction médicale sur les médicaments ou l’utilisation clinique.",
      ],
    },
    {
      title: "Besoin d’accessoires respiratoires",
      paragraphs: [
        "Les accessoires respiratoires peuvent inclure masques, tubulures, filtres, humidificateurs ou consommables selon le matériel utilisé. Leur disponibilité dépend du fournisseur, du modèle d’appareil et de la ville.",
        "Préciser le modèle d’appareil ou la référence fournie par le professionnel de santé accélère la recherche.",
      ],
    },
  ],
  midCtaTitle: "Besoin d’un équipement respiratoire rapidement ?",
  midCtaText:
    "Indiquez votre ville et l’équipement recherché : SOS Santé Maroc vérifie la disponibilité auprès de partenaires. L’usage reste sous avis médical.",
  cityMoneyBlock: {
    title: "Trouver du matériel respiratoire dans votre ville",
    text: "Choisissez votre ville pour voir les équipements respiratoires disponibles et demander une orientation selon disponibilité.",
    image: {
      src: "/pillars/respiratoire/respiratoire-villes-catalogue-maroc.webp",
      alt: "Matériel respiratoire au Maroc — concentrateur d’oxygène et CPAP à domicile, catalogues par ville",
      title: "Matériel respiratoire dans votre ville | SOS Santé",
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
  equipmentTitle: "Principaux équipements respiratoires concernés",
  equipmentIntro:
    "SOS Santé Maroc aide à rechercher plusieurs types de matériel médical respiratoire selon disponibilité. Les modèles, délais et conditions varient selon la ville et les fournisseurs partenaires. Le choix médical reste toujours avec le professionnel de santé.",
  equipment: [
    {
      id: "concentrateur-oxygene",
      title: "Concentrateur d’oxygène au Maroc",
      icon: "air",
      paragraphs: [
        "Le concentrateur d’oxygène est l’un des équipements respiratoires les plus demandés. Il est utilisé lorsqu’un besoin en oxygène a été identifié par un professionnel de santé. La famille ne doit jamais choisir seule le débit ou la durée d’utilisation.",
        "La recherche d’un concentrateur d’oxygène au Maroc peut concerner une location temporaire ou un achat selon la durée du besoin. SOS Santé Maroc aide à vérifier les disponibilités dans la ville concernée et à orienter la demande vers un fournisseur partenaire disponible.",
        "Les modèles peuvent varier selon disponibilité : concentrateur 5L, concentrateur 10L, appareil fixe ou accessoires associés. Le choix doit toujours suivre les indications médicales.",
      ],
      link: {
        label: "Voir un concentrateur en location",
        href: locationRentalProductPath(
          "concentrateur-oxygene-5l-nebuliseur-location",
          "agadir"
        ),
      },
      cityProductLinks: locationProductCityLinks(
        "concentrateur-oxygene-5l-nebuliseur-location",
        "Voir le concentrateur d’oxygène en location dans votre ville :"
      ),
    },
    {
      id: "oxygene-domicile",
      title: "Oxygène à domicile au Maroc",
      icon: "home_health",
      paragraphs: [
        "Le terme oxygène à domicile au Maroc est souvent utilisé par les familles qui recherchent une solution rapide pour un proche. Cependant, l’oxygène à domicile est un sujet médical sensible. Il doit être encadré par les recommandations d’un professionnel de santé.",
        "SOS Santé Maroc peut aider à trouver un équipement ou un fournisseur disponible, mais ne décide pas si un patient a besoin d’oxygène. Le service intervient pour faciliter la coordination, vérifier la disponibilité et orienter la famille.",
      ],
      link: {
        label: "Catalogue respiratoire (vente)",
        href: venteCategoryPath("respiratoire", "agadir"),
      },
      cityProductLinks: venteCategoryCityLinks(
        "respiratoire",
        "Voir le catalogue respiratoire dans votre ville :"
      ),
    },
    {
      id: "cpap",
      title: "CPAP au Maroc",
      icon: "hotel",
      paragraphs: [
        "La CPAP est un appareil utilisé dans certaines situations respiratoires et doit être prescrite ou recommandée par un professionnel de santé. Les familles peuvent rechercher une CPAP au Maroc lorsqu’elles ont besoin d’un appareil disponible rapidement ou d’un remplacement selon les indications reçues.",
        "SOS Santé Maroc peut aider à rechercher un appareil CPAP selon disponibilité, mais ne donne pas de réglages, de pression, de durée d’utilisation ou de conseil médical personnalisé. Ces informations doivent venir d’un professionnel de santé.",
      ],
      link: {
        label: "Voir un appareil CPAP (vente)",
        href: venteProductPath("resmed-airsense-s11-autoset-cpap", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "resmed-airsense-s11-autoset-cpap",
        "Voir l’appareil CPAP à l’achat dans votre ville :"
      ),
    },
    {
      id: "nebuliseur",
      title: "Nébuliseur au Maroc",
      icon: "mist",
      paragraphs: [
        "Le nébuliseur est un appareil utilisé pour transformer certains traitements liquides en aérosol, selon prescription médicale. Il peut être demandé à domicile pour des besoins respiratoires spécifiques.",
        "SOS Santé Maroc peut aider à trouver un nébuliseur au Maroc selon disponibilité dans la ville du client. Le service ne conseille pas sur les médicaments à utiliser, la fréquence ou la durée. Ces décisions relèvent du médecin ou du professionnel de santé.",
      ],
      link: {
        label: "Voir un nébuliseur (vente)",
        href: venteProductPath("beurer-nebuliseur-ih-21", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "beurer-nebuliseur-ih-21",
        "Voir le nébuliseur à l’achat dans votre ville :"
      ),
    },
    {
      id: "masques-accessoires",
      title: "Masques à oxygène et accessoires respiratoires",
      icon: "masks",
      paragraphs: [
        "Les accessoires respiratoires peuvent être nécessaires pour utiliser certains appareils correctement. Ils peuvent inclure masque à oxygène, lunettes nasales, tubulures, filtres, humidificateurs, embouts, accessoires CPAP et consommables respiratoires.",
        "La disponibilité dépend du modèle d’appareil et du fournisseur partenaire. SOS Santé Maroc peut aider à vérifier les options disponibles selon la ville.",
      ],
      link: {
        label: "Voir des masques CPAP (vente)",
        href: venteProductPath("masques-cpap-airfit-resmed", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "masques-cpap-airfit-resmed",
        "Voir les masques CPAP à l’achat dans votre ville :"
      ),
    },
    {
      id: "concentrateur-5l-10l",
      title: "Concentrateur oxygène 5L et 10L au Maroc",
      icon: "settings_input_component",
      paragraphs: [
        "Les familles recherchent souvent un concentrateur oxygène 5L au Maroc ou un concentrateur oxygène 10L au Maroc selon les indications reçues. SOS Santé Maroc peut vérifier ce qui est disponible, sans choisir le débit à la place du professionnel de santé.",
        "Indiquez les informations fournies par le médecin (si disponibles) ainsi que la ville et le délai souhaité pour accélérer la recherche.",
      ],
      link: {
        label: "Voir un concentrateur 5L (vente)",
        href: venteProductPath("concentrateur-5l-silencieux-nebuliseur", "agadir"),
      },
      cityProductLinks: venteProductCityLinks(
        "concentrateur-5l-silencieux-nebuliseur",
        "Voir le concentrateur 5L à l’achat dans votre ville :"
      ),
    },
  ],
  chooseTitle: "Informations à préparer avant de demander un équipement respiratoire",
  chooseIntro:
    "Pour faciliter la recherche de matériel respiratoire, la famille doit préparer quelques informations pratiques. Ces éléments aident SOS Santé Maroc à vérifier les disponibilités, sans remplacer l’avis médical.",
  chooseBlocks: [
    {
      title: "Ville et quartier",
      paragraphs: [
        "La disponibilité dépend de la ville. Il faut préciser si la demande concerne Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès ou une autre ville, ainsi que le quartier si possible.",
      ],
    },
    {
      title: "Type d’équipement recherché",
      paragraphs: [
        "La famille doit préciser le matériel : concentrateur d’oxygène, CPAP, nébuliseur, masque, tubulure ou autre accessoire. Plus la demande est précise, plus la vérification est rapide.",
      ],
    },
    {
      title: "Recommandation médicale",
      paragraphs: [
        "Pour les équipements respiratoires sensibles, il est important de suivre l’avis du médecin. SOS Santé Maroc ne décide pas du type d’appareil à utiliser, du débit ou des réglages.",
      ],
    },
    {
      title: "Location, achat, délai et livraison",
      paragraphs: [
        "Indiquez si vous cherchez une location temporaire ou un achat, le délai souhaité et si une livraison à domicile est nécessaire. Si la famille hésite entre location et achat, SOS Santé peut aider à comprendre les options disponibles, mais le choix médical reste avec le professionnel de santé.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc pour le matériel respiratoire ?",
  processIntro:
    "Le parcours reste simple et prudent : clarifier la demande pratique, vérifier la disponibilité, orienter vers une solution, puis coordonner sans jamais remplacer l’avis médical.",
  processSteps: [
    {
      title: "La famille envoie sa demande",
      text: "Le client contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Il indique la ville, le matériel recherché (concentrateur d’oxygène, CPAP, nébuliseur, accessoires), location ou achat souhaité, et le délai.",
    },
    {
      title: "SOS Santé clarifie le besoin pratique",
      text: "L’équipe peut poser des questions pour comprendre la demande : ville, type d’appareil, durée souhaitée, livraison éventuelle, accessoires nécessaires. Cette étape ne remplace pas un avis médical.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc vérifie la disponibilité auprès de fournisseurs partenaires selon la ville. Les modèles, prix, délais et conditions peuvent varier.",
    },
    {
      title: "Orientation vers une solution disponible",
      text: "Lorsque des options sont disponibles, SOS Santé Maroc oriente la famille vers une solution adaptée selon la demande et les informations fournies.",
    },
    {
      title: "Coordination de la demande",
      text: "SOS Santé Maroc facilite la coordination entre la famille et le fournisseur partenaire. Si une livraison est possible, elle peut être organisée selon disponibilité.",
    },
    {
      title: "Suivi après la demande",
      text: "Selon le cas, SOS Santé Maroc peut rester disponible pour une question logistique, une prolongation de location, une demande d’accessoires ou un autre besoin de matériel médical.",
    },
  ],
  durationTitle: "Location ou achat de matériel respiratoire : comment choisir ?",
  durationIntro:
    "Cette page cible le matériel médical respiratoire au Maroc. Le client peut louer ou acheter selon la durée du besoin, toujours sous recommandation médicale.",
  durationBlocks: [
    {
      title: "Location de matériel respiratoire",
      paragraphs: [
        "La location peut être adaptée pour un besoin temporaire, une période de convalescence, un retour à domicile ou une attente de solution durable. Par exemple, la location de concentrateur d’oxygène peut être demandée lorsqu’un professionnel de santé indique un besoin sur une période limitée.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Achat de matériel respiratoire",
      paragraphs: [
        "L’achat peut être plus logique lorsque le besoin est durable, régulier ou long terme. La famille peut souhaiter acheter un concentrateur d’oxygène, une CPAP ou un nébuliseur selon les recommandations reçues.",
      ],
      link: {
        label: "Vente de matériel médical au Maroc",
        href: VENTE_MAROC_PATH,
      },
    },
    {
      title: "Livraison du matériel respiratoire",
      paragraphs: [
        "Certains appareils respiratoires peuvent être livrés à domicile selon disponibilité. Le détail logistique (accès, installation, récupération) est traité sur la page livraison.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
  ],
  citiesTitle: "Matériel respiratoire dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc traite les demandes de matériel respiratoire dans plusieurs villes du Maroc selon disponibilité. Les pages villes précisent le contexte local sans remplacer ce hub national.",
  cities: [
    {
      name: "Casablanca",
      title: "Matériel respiratoire à Casablanca",
      paragraphs: [
        "À Casablanca, les familles recherchent souvent un concentrateur d’oxygène, une CPAP, un nébuliseur ou des accessoires respiratoires pour un proche à domicile. SOS Santé Maroc peut aider à vérifier les disponibilités auprès de fournisseurs partenaires.",
        "Indiquez votre quartier et le type d’équipement pour accélérer la confirmation.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: venteCategoryPath("respiratoire", "casablanca"),
      locationLabel: "Catalogue respiratoire Casablanca",
    },
    {
      name: "Agadir",
      title: "Matériel respiratoire à Agadir",
      paragraphs: [
        "À Agadir, SOS Santé Maroc peut accompagner les familles dans la recherche de matériel respiratoire selon les besoins indiqués par le professionnel de santé : concentrateur d’oxygène, CPAP ou accessoires respiratoires selon disponibilité.",
        "Agadir dispose aussi d’un catalogue location et vente utile pour comparer les options disponibles.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: venteCategoryPath("respiratoire", "agadir"),
      locationLabel: "Catalogue respiratoire Agadir",
    },
    {
      name: "Marrakech",
      title: "Matériel respiratoire à Marrakech",
      paragraphs: [
        "À Marrakech, les demandes peuvent concerner l’oxygène à domicile, un concentrateur d’oxygène ou un nébuliseur. SOS Santé Maroc aide à orienter la demande selon la ville et les fournisseurs disponibles.",
        "Précisez toujours la zone et l’équipement recherché pour faciliter la vérification.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: venteCategoryPath("respiratoire", "marrakech"),
      locationLabel: "Catalogue respiratoire Marrakech",
    },
    {
      name: "Rabat",
      title: "Matériel respiratoire à Rabat",
      paragraphs: [
        "À Rabat, SOS Santé Maroc peut aider à rechercher du matériel respiratoire à domicile selon disponibilité. La famille doit toujours suivre les recommandations médicales reçues pour l’utilisation de l’équipement.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: venteCategoryPath("respiratoire", "rabat"),
      locationLabel: "Catalogue respiratoire Rabat",
    },
    {
      name: "Tanger",
      title: "Matériel respiratoire à Tanger",
      paragraphs: [
        "À Tanger, les familles peuvent demander une orientation pour du matériel respiratoire disponible : concentrateur d’oxygène, CPAP, nébuliseur ou accessoires selon le besoin.",
        "Comme pour les autres villes, la confirmation dépend du stock partenaire et du délai souhaité.",
      ],
      hubHref: hubCityPath("tanger"),
      hubLabel: "Matériel médical Tanger",
      locationHref: venteCategoryPath("respiratoire", "tanger"),
      locationLabel: "Catalogue respiratoire Tanger",
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
  compareTitle: "Précautions importantes et différence avec mobilité / confort",
  compareIntro:
    "Le matériel respiratoire doit être traité avec prudence. Contrairement à certains équipements de mobilité ou de confort, un appareil respiratoire peut avoir des réglages, des indications et des conditions d’utilisation précises. Cette page reste centrée sur le respiratoire pour éviter toute confusion avec d’autres équipements.",
  compareBlocks: [
    {
      title: "Précautions respiratoires",
      paragraphs: [
        "Ne pas choisir seul un appareil respiratoire, ne pas modifier les réglages sans avis médical, vérifier les accessoires compatibles et respecter les consignes de sécurité données par le professionnel de santé et le fournisseur. SOS Santé Maroc ne donne pas de réglages techniques médicaux et ne prescrit pas d’oxygène.",
        "Pour l’oxygène à domicile, la famille doit suivre les consignes reçues concernant l’environnement, l’entretien courant et les précautions indiquées. En urgence vitale, contactez les services d’urgence officiels.",
      ],
    },
    {
      title: "Matériel de mobilité",
      paragraphs: [
        "Il concerne les déplacements et transferts : fauteuil roulant, déambulateur, béquilles, lève-personne. Le détail est sur la page dédiée au matériel de mobilité au Maroc.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Matériel de confort médical",
      paragraphs: [
        "Il concerne le confort à domicile : lit médicalisé, matelas anti-escarres, table de lit, chaise percée. Le détail est sur la page dédiée au matériel de confort médical au Maroc.",
      ],
      link: {
        label: "Matériel de confort médical au Maroc",
        href: CONFORT_MAROC_PATH,
      },
    },
  ],
  whyUsTitle: "Pourquoi passer par SOS Santé Maroc ?",
  whyUsIntro:
    "SOS Santé Maroc positionne le matériel respiratoire comme un service de coordination prudent : rechercher, orienter et faciliter l’accès selon disponibilité, sans jamais remplacer le médecin.",
  whyUsBlocks: [
    {
      title: "Une demande centralisée",
      text: "La famille peut envoyer une seule demande pour rechercher un concentrateur d’oxygène, une CPAP, un nébuliseur ou des accessoires respiratoires selon disponibilité.",
    },
    {
      title: "Une coordination avec fournisseurs partenaires",
      text: "SOS Santé Maroc aide à vérifier les disponibilités auprès de partenaires selon la ville, le modèle recherché et le besoin exprimé.",
    },
    {
      title: "Un service adapté au domicile",
      text: "Le service est pensé pour les familles qui veulent trouver du matériel respiratoire pour un proche à domicile, sans multiplier les recherches.",
    },
    {
      title: "Une approche prudente",
      text: "SOS Santé Maroc respecte les limites médicales : pas de diagnostic, pas de prescription, pas de réglage médical. Le service accompagne uniquement la recherche, l’orientation et la coordination.",
    },
    {
      title: "Une présence dans plusieurs villes",
      text: "Les disponibilités peuvent varier entre Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes du Maroc. SOS Santé Maroc adapte la demande selon la localisation.",
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
      label: "Matériel de confort médical au Maroc",
      href: CONFORT_MAROC_PATH,
      description: "Lits médicalisés et confort à domicile",
    },
    {
      label: "Soins à domicile au Maroc",
      href: SOINS_DOMICILE_PATH,
      description: "Coordination avec prestataires partenaires",
    },
    {
      label: "Aide à domicile et garde-malade au Maroc",
      href: AIDE_DOMICILE_PATH,
      description: "Accompagnement humain à domicile",
    },
    {
      label: "À propos de SOS Santé",
      href: ABOUT_PATH,
      description: "Rôle, locaux et fonctionnement",
    },
  ],
  blogTitle: "Guides et articles utiles",
  blogIntro:
    "Quelques contenus de soutien sur l’oxygène à domicile et les appareils respiratoires. Ils ne remplacent pas un avis médical.",
  blogLinks: [
    {
      label: "Location concentrateur d’oxygène à Agadir",
      href: "/blog/respiratoire/concentreur-oxygene-agadir-avantages",
      description: "Avantages pratiques à domicile",
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
  productSidebar: respiratoirePillarSidebar(),
  faqs: [
    {
      question: "Quel matériel respiratoire peut-on trouver au Maroc ?",
      answer:
        "Selon disponibilité, SOS Santé Maroc aide à rechercher du matériel respiratoire comme concentrateur d’oxygène, CPAP, nébuliseur, masques, tubulures, filtres et accessoires respiratoires.",
    },
    {
      question: "Peut-on louer un concentrateur d’oxygène au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à trouver un concentrateur d’oxygène à louer selon disponibilité. L’utilisation doit toujours suivre les recommandations d’un professionnel de santé.",
    },
    {
      question: "Peut-on acheter un concentrateur d’oxygène au Maroc ?",
      answer:
        "Oui, l’achat peut être possible selon disponibilité. Le choix du modèle, du débit et de l’utilisation doit être validé par un professionnel de santé.",
    },
    {
      question: "SOS Santé Maroc donne-t-il des conseils médicaux sur l’oxygène ?",
      answer:
        "Non. SOS Santé Maroc ne donne pas de diagnostic, de prescription ou de réglage médical. Le service aide seulement à rechercher et coordonner une solution disponible.",
    },
    {
      question: "Qu’est-ce qu’une CPAP ?",
      answer:
        "La CPAP est un appareil respiratoire utilisé uniquement selon indication médicale. SOS Santé Maroc peut aider à rechercher un appareil CPAP disponible, sans donner de réglage ou de prescription.",
    },
    {
      question: "Peut-on trouver un nébuliseur au Maroc ?",
      answer:
        "Oui, selon disponibilité. SOS Santé Maroc peut aider à rechercher un nébuliseur auprès de fournisseurs partenaires dans la ville concernée.",
    },
    {
      question: "Le matériel respiratoire peut-il être livré à domicile ?",
      answer:
        "Oui, la livraison peut être organisée selon la ville, le fournisseur et la disponibilité. Pour le détail, consultez la page Livraison de matériel médical à domicile au Maroc.",
    },
    {
      question: "Dans quelles villes SOS Santé Maroc peut-il aider ?",
      answer:
        "SOS Santé Maroc peut traiter des demandes à Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et d’autres villes marocaines selon disponibilité.",
    },
    {
      question: "Comment demander la disponibilité d’un équipement respiratoire ?",
      answer:
        "Contactez SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant la ville, l’équipement recherché, location ou achat, et les indications pratiques disponibles.",
    },
  ],
  ctaTitle: "Besoin de matériel médical respiratoire au Maroc ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier la disponibilité d’un concentrateur d’oxygène, d’une CPAP, d’un nébuliseur ou d’accessoires respiratoires dans votre ville. Notre équipe vous aide à rechercher une solution selon les informations fournies, les recommandations médicales et les disponibilités locales.",
};
