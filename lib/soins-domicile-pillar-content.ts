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

export const soinsDomicilePillarContent: LocationPillarContent = {
  path: SOINS_DOMICILE_PATH,
  heroImage: "/pillars/soins-a-domicile-infirmier-maroc.webp",
  heroImageAlt:
    "Soins à domicile au Maroc — soins infirmiers et coordination de prestataires qualifiés avec SOS Santé",
  heroImageTitle: "Soins à domicile au Maroc | SOS Santé",
  metaTitle: "Soins à domicile Maroc | SOS Santé",
  metaDescription:
    "SOS Santé Maroc aide à coordonner des soins à domicile selon disponibilité : infirmier, pansement, injection, kiné ou médecin à domicile.",
  keywords: [
    "soins à domicile Maroc",
    "soins à domicile au Maroc",
    "infirmier à domicile Maroc",
    "soins infirmiers à domicile Maroc",
    "kinésithérapie à domicile Maroc",
    "médecin à domicile Maroc",
    "pansement à domicile Maroc",
    "injection à domicile Maroc",
  ],
  badge: "Service national · Soins à domicile",
  h1: "Soins à domicile au Maroc",
  heroTitleSuffix: "avec coordination selon disponibilité",
  heroLead:
    "SOS Santé Maroc aide les familles à trouver un prestataire de soins à domicile selon la ville, le besoin du patient et la disponibilité : infirmier à domicile, pansement, injection, kinésithérapie, médecin à domicile ou suivi après hospitalisation.",
  secondaryCtaLabel: "Parler avec un conseiller",
  secondaryCtaHref: `tel:${PHONE_NUMBER}`,
  primaryCtaLabel: "Demander un soin à domicile sur WhatsApp",
  reassurance: [
    "Coordination de soins à domicile selon disponibilité",
    "Mise en relation avec prestataires qualifiés",
    "Soins infirmiers, kiné ou médecin à domicile selon la ville",
    "Accompagnement des familles au Maroc",
    "Aucun diagnostic médical fourni par SOS Santé",
  ],
  whatsappMessage:
    "Bonjour SOS Santé Maroc, je recherche des soins à domicile au Maroc. Ville, type de soin et horaire : ",
  introTitle: "Organiser des soins à domicile au Maroc",
  intro: [
    "Lorsqu’un patient a besoin d’un suivi après hospitalisation, d’un pansement, d’une injection, d’une séance de kinésithérapie ou d’une visite médicale à domicile, la famille cherche souvent une solution fiable et disponible rapidement. Trouver le bon prestataire peut prendre du temps, surtout lorsque le besoin est urgent ou lorsque la famille ne sait pas vers qui se tourner.",
    "Les soins à domicile au Maroc peuvent aider certaines familles à organiser une intervention directement chez le patient, selon le besoin, la ville et la disponibilité des professionnels qualifiés. Cela peut concerner un patient en convalescence, une personne âgée, une personne à mobilité réduite, une personne dépendante ou un proche qui a besoin d’un suivi à domicile.",
    "SOS Santé Maroc accompagne les familles dans cette recherche. Le service reçoit la demande, clarifie le besoin, vérifie les disponibilités auprès de prestataires partenaires et facilite la mise en relation lorsque le service est disponible dans la ville concernée.",
    "SOS Santé Maroc n’est pas une clinique, un hôpital, une pharmacie ou un cabinet médical. Le service ne donne pas de diagnostic, ne prescrit pas de traitement et ne remplace pas un professionnel de santé. Les soins médicaux doivent toujours être réalisés par des professionnels qualifiés et selon les recommandations médicales du patient.",
    "Cette page est dédiée aux soins à domicile. Les sujets comme l’aide à domicile, le garde-malade, la location de matériel médical ou la livraison de matériel sont mentionnés seulement comme services complémentaires, avec liens vers leurs pages dédiées.",
  ],
  sectionImages: {
    intro: {
      src: "/pillars/soins/soins-infirmiers-section-maroc.webp",
      alt: "Soins infirmiers à domicile au Maroc avec coordination SOS Santé",
      title: "Soins infirmiers à domicile au Maroc",
      caption: "Soins infirmiers à domicile",
    },
    equipment: {
      src: "/pillars/soins/soins-kinesitherapie-section-maroc.webp",
      alt: "Kinésithérapie à domicile au Maroc selon disponibilité",
      title: "Kinésithérapie à domicile au Maroc",
      caption: "Kinésithérapie à domicile",
    },
    process: {
      src: "/pillars/soins/soins-medecin-domicile-maroc.webp",
      alt: "Médecin à domicile au Maroc avec mise en relation selon disponibilité",
      title: "Médecin à domicile au Maroc",
      caption: "Médecin à domicile",
    },
    cities: {
      src: "/pillars/soins/soins-chariot-pansement-maroc.webp",
      alt: "Chariot de pansement pour soins et pansements à domicile au Maroc",
      title: "Matériel de pansement à domicile",
      caption: "Chariot de pansement",
    },
  },
  whyTitle: "Pourquoi demander des soins à domicile ?",
  whyParagraphs: [
    "Les soins à domicile peuvent être utiles lorsqu’un patient ne peut pas se déplacer facilement, lorsqu’un suivi doit être organisé après une hospitalisation ou lorsqu’une intervention simple doit être réalisée au domicile par un professionnel qualifié.",
    "Pour certaines familles, se déplacer vers un cabinet, une clinique ou un centre de soins peut être difficile. Le patient peut être fatigué, âgé, alité, en convalescence ou à mobilité réduite. Dans ce cas, la recherche d’un prestataire à domicile peut simplifier l’organisation.",
    "Les soins à domicile permettent aussi de mieux accompagner un retour à domicile après une hospitalisation. Une famille peut avoir besoin d’un infirmier pour un pansement, d’une injection, d’un suivi, d’une séance de kinésithérapie ou d’une orientation vers un médecin à domicile selon disponibilité.",
    "L’objectif de SOS Santé Maroc est d’aider la famille à trouver plus rapidement une solution disponible dans sa ville, sans se substituer au professionnel de santé. Le service clarifie la demande pratique, vérifie les disponibilités et facilite la mise en relation.",
    "Selon la situation, les soins à domicile au Maroc peuvent être ponctuels ou répétés. Dans tous les cas, les consignes médicales restent la référence : SOS Santé Maroc coordonne, le professionnel qualifié réalise le soin.",
  ],
  situationsTitle: "Dans quelles situations demander des soins à domicile ?",
  situationsIntro:
    "Les demandes de soins à domicile au Maroc concernent surtout le retour après hospitalisation, les soins après opération, la personne âgée, la mobilité réduite, la kinésithérapie et les soins infirmiers.",
  situations: [
    {
      title: "Retour à domicile après hospitalisation",
      paragraphs: [
        "Après une hospitalisation, le patient peut avoir besoin d’un suivi à domicile. La famille peut rechercher un infirmier, un kinésithérapeute ou un autre prestataire selon les recommandations reçues.",
        "SOS Santé Maroc peut aider à coordonner la demande selon la ville et les disponibilités. Si du matériel est aussi nécessaire, la location et la livraison restent sur leurs pages dédiées.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
    {
      title: "Soins après opération",
      paragraphs: [
        "Après une opération, certains patients peuvent avoir besoin de pansements, d’injections, d’un suivi ou d’un accompagnement spécifique. Les soins doivent être réalisés par un professionnel qualifié selon les consignes médicales.",
        "SOS Santé Maroc aide uniquement sur la coordination et la mise en relation. Le service ne prescrit pas et ne donne pas de protocole.",
      ],
    },
    {
      title: "Personne âgée à domicile",
      paragraphs: [
        "Une personne âgée peut avoir besoin d’un suivi à domicile, notamment si elle se déplace difficilement ou si la famille souhaite organiser une intervention sans déplacement compliqué.",
        "Selon la situation, le besoin peut concerner des soins infirmiers, une kinésithérapie, un suivi médical ou une aide complémentaire non médicale.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Personne à mobilité réduite",
      paragraphs: [
        "Pour une personne à mobilité réduite, se déplacer vers un centre peut être difficile. Une intervention à domicile peut être recherchée selon les recommandations médicales et la disponibilité des prestataires.",
        "Le matériel de mobilité (fauteuil, déambulateur, lève-personne) peut aussi être utile en complément.",
      ],
      link: {
        label: "Matériel de mobilité au Maroc",
        href: MOBILITE_MAROC_PATH,
      },
    },
    {
      title: "Besoin de kinésithérapie à domicile",
      paragraphs: [
        "Après une blessure, une opération ou dans certaines situations de perte de mobilité, la kinésithérapie à domicile peut être demandée si elle est recommandée. SOS Santé Maroc peut aider à rechercher un kinésithérapeute disponible selon la ville.",
      ],
      link: {
        label: "Kinésithérapie à domicile (Agadir)",
        href: careServiceCityPath("kinesitherapie-a-domicile", "agadir"),
      },
    },
    {
      title: "Besoin d’un infirmier à domicile",
      paragraphs: [
        "Un infirmier à domicile peut être recherché pour des soins comme pansement, injection, perfusion ou suivi selon prescription ou consignes médicales. SOS Santé Maroc peut aider à trouver un prestataire disponible selon la ville.",
      ],
      link: {
        label: "Soins infirmiers à domicile (Casablanca)",
        href: careServiceCityPath("soins-infirmiers-a-domicile", "casablanca"),
      },
    },
  ],
  midCtaTitle: "Besoin d’un soin à domicile rapidement ?",
  midCtaText:
    "Indiquez votre ville, le type de soin et l’horaire : SOS Santé Maroc vérifie les disponibilités auprès de prestataires partenaires. En urgence vitale, contactez les services d’urgence officiels.",
  cityMoneyBlock: {
    title: "Trouver des soins à domicile dans votre ville",
    text: "Choisissez votre ville pour voir les options locales et demander un soin à domicile selon disponibilité.",
    image: {
      src: "/pillars/soins/soins-villes-catalogue-maroc.webp",
      alt: "Soins à domicile au Maroc — infirmier, kiné et médecin à domicile, catalogues par ville",
      title: "Soins à domicile dans votre ville | SOS Santé",
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
  equipmentTitle: "Types de soins à domicile concernés",
  equipmentIntro:
    "SOS Santé Maroc aide à rechercher plusieurs types de soins à domicile selon disponibilité. Les actes médicaux restent réalisés par des professionnels qualifiés, selon les consignes du patient.",
  equipment: [
    {
      id: "soins-infirmiers",
      title: "Soins infirmiers à domicile au Maroc",
      icon: "vaccines",
      paragraphs: [
        "Les soins infirmiers à domicile peuvent inclure différents actes réalisés par un infirmier qualifié selon les recommandations médicales. Les familles recherchent souvent un infirmier à domicile pour un pansement, une injection, une perfusion, un suivi après opération ou une intervention ponctuelle.",
        "SOS Santé Maroc peut aider à rechercher un infirmier à domicile au Maroc selon la ville et la disponibilité. Le service ne réalise pas lui-même les soins et ne donne pas d’indication médicale. Il facilite la coordination avec un prestataire qualifié lorsque le service est disponible.",
      ],
      link: {
        label: "Soins infirmiers à domicile",
        href: careServiceCityPath("soins-infirmiers-a-domicile", "agadir"),
      },
      cityProductLinks: careServiceCityLinks(
        "soins-infirmiers-a-domicile",
        "Voir les soins infirmiers à domicile dans votre ville :"
      ),
    },
    {
      id: "pansement",
      title: "Pansement à domicile au Maroc",
      icon: "healing",
      paragraphs: [
        "Le pansement à domicile est souvent demandé après une opération, une blessure ou une hospitalisation. Il doit être réalisé selon les recommandations médicales et par une personne qualifiée.",
        "SOS Santé Maroc peut aider la famille à rechercher un prestataire disponible pour un pansement à domicile selon la ville. Le client doit fournir les informations pratiques nécessaires : ville, adresse, type de demande, fréquence souhaitée si connue et consignes médicales disponibles.",
      ],
      link: {
        label: "Soins infirmiers à domicile",
        href: careServiceCityPath("soins-infirmiers-a-domicile", "rabat"),
      },
      cityProductLinks: careServiceCityLinks(
        "soins-infirmiers-a-domicile",
        "Voir le pansement à domicile dans votre ville :"
      ),
    },
    {
      id: "injection",
      title: "Injection à domicile au Maroc",
      icon: "syringe",
      paragraphs: [
        "L’injection à domicile doit être réalisée uniquement selon prescription ou recommandation médicale. La famille peut chercher un infirmier à domicile pour une injection ponctuelle ou répétée.",
        "SOS Santé Maroc peut aider à coordonner la demande selon la ville, mais ne donne pas de conseils sur les médicaments, doses ou protocoles.",
      ],
      link: {
        label: "Soins infirmiers à domicile",
        href: careServiceCityPath("soins-infirmiers-a-domicile", "casablanca"),
      },
      cityProductLinks: careServiceCityLinks(
        "soins-infirmiers-a-domicile",
        "Voir l’injection à domicile dans votre ville :"
      ),
    },
    {
      id: "perfusion",
      title: "Perfusion à domicile au Maroc",
      icon: "water_drop",
      paragraphs: [
        "La perfusion à domicile est un soin qui demande une prise en charge qualifiée et conforme aux consignes médicales. Si ce service est disponible dans la ville concernée, SOS Santé Maroc peut aider à rechercher un prestataire adapté.",
        "La famille doit toujours suivre les indications du professionnel de santé responsable du patient.",
      ],
      link: {
        label: "Soins infirmiers à domicile",
        href: careServiceCityPath("soins-infirmiers-a-domicile", "agadir"),
      },
      cityProductLinks: careServiceCityLinks(
        "soins-infirmiers-a-domicile",
        "Voir la perfusion à domicile dans votre ville :"
      ),
    },
    {
      id: "kine",
      title: "Kinésithérapie à domicile au Maroc",
      icon: "accessibility_new",
      paragraphs: [
        "La kinésithérapie à domicile peut être demandée après une opération, une blessure, une hospitalisation ou pour accompagner une perte de mobilité. Elle doit être réalisée par un kinésithérapeute qualifié selon le besoin du patient.",
        "SOS Santé Maroc peut aider à rechercher une solution de kinésithérapie à domicile au Maroc selon la ville et la disponibilité des prestataires partenaires. Pour les équipements de déplacement, consultez aussi la page mobilité.",
      ],
      link: {
        label: "Kinésithérapie à domicile",
        href: careServiceCityPath("kinesitherapie-a-domicile", "casablanca"),
      },
      cityProductLinks: careServiceCityLinks(
        "kinesitherapie-a-domicile",
        "Voir la kinésithérapie à domicile dans votre ville :"
      ),
    },
    {
      id: "medecin",
      title: "Médecin à domicile au Maroc",
      icon: "stethoscope",
      paragraphs: [
        "Dans certaines villes, il peut être possible de rechercher un médecin à domicile selon disponibilité. Ce service dépend fortement de la zone, de l’horaire et des prestataires disponibles.",
        "SOS Santé Maroc peut aider à orienter la demande, mais ne remplace pas un service d’urgence médicale officiel. En cas de situation grave ou urgente, la famille doit contacter les services d’urgence appropriés.",
      ],
      link: {
        label: "Médecin à domicile",
        href: careServiceCityPath("medecin-a-domicile", "agadir"),
      },
      cityProductLinks: careServiceCityLinks(
        "medecin-a-domicile",
        "Voir le médecin à domicile dans votre ville :"
      ),
    },
    {
      id: "suivi-patient",
      title: "Suivi patient à domicile",
      icon: "monitor_heart",
      paragraphs: [
        "Le suivi patient à domicile peut concerner des situations de convalescence, de dépendance, de mobilité réduite ou de retour après hospitalisation. Selon le besoin, il peut impliquer un infirmier, un kinésithérapeute, un médecin ou une aide humaine.",
        "SOS Santé Maroc aide à clarifier la demande et à orienter vers le bon type de prestataire selon disponibilité.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
  ],
  chooseTitle: "Comment préparer une demande de soins à domicile ?",
  chooseIntro:
    "Pour aider SOS Santé Maroc à orienter correctement la demande, la famille doit préparer quelques informations simples. Ces éléments accélèrent la vérification de disponibilité, sans remplacer l’avis médical.",
  chooseBlocks: [
    {
      title: "Ville, quartier et type de soin",
      paragraphs: [
        "Précisez Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès ou une autre ville, ainsi que le quartier si possible. Indiquez aussi si la demande concerne un infirmier, un pansement, une injection, une perfusion, une kinésithérapie, un médecin à domicile ou un autre suivi.",
      ],
    },
    {
      title: "Prescription ou recommandations médicales",
      paragraphs: [
        "Pour les soins médicaux, la famille doit disposer des consignes ou recommandations du professionnel de santé. SOS Santé Maroc ne prescrit pas de soins et ne décide pas du protocole.",
      ],
    },
    {
      title: "Fréquence et horaire souhaités",
      paragraphs: [
        "Certaines demandes sont ponctuelles. D’autres peuvent être répétées sur plusieurs jours ou semaines. Précisez aussi si le soin est souhaité le matin, l’après-midi, le soir, la nuit ou à une heure précise.",
      ],
    },
    {
      title: "Accès au domicile",
      paragraphs: [
        "Indiquez l’adresse, l’étage, la présence d’un ascenseur et les informations d’accès. Ces détails aident le prestataire à organiser l’intervention.",
      ],
      link: {
        label: "Livraison de matériel médical à domicile au Maroc",
        href: LIVRAISON_PILLAR_PATH,
      },
    },
  ],
  processTitle: "Comment fonctionne SOS Santé Maroc pour les soins à domicile ?",
  processIntro:
    "Le parcours reste simple et prudent : clarifier la demande, vérifier les disponibilités, faciliter la mise en relation avec un prestataire qualifié, puis coordonner les informations pratiques.",
  processSteps: [
    {
      title: "La famille envoie sa demande",
      text: "Le client contacte SOS Santé Maroc par WhatsApp, téléphone ou formulaire. Il indique la ville, le soin recherché, le besoin général et les informations pratiques.",
    },
    {
      title: "SOS Santé Maroc clarifie la demande",
      text: "L’équipe pose quelques questions pour comprendre la situation : type de soin, ville, horaire, fréquence, prescription disponible, état général du patient et besoin complémentaire. Cette étape sert à orienter la demande. Elle ne remplace pas un diagnostic médical.",
    },
    {
      title: "Vérification de la disponibilité",
      text: "SOS Santé Maroc vérifie les possibilités auprès de prestataires partenaires selon la ville et le type de soin demandé.",
    },
    {
      title: "Orientation vers un prestataire adapté",
      text: "Selon disponibilité, SOS Santé Maroc facilite la mise en relation avec un prestataire qualifié.",
    },
    {
      title: "Coordination de l’intervention",
      text: "Le service aide à coordonner les informations pratiques entre la famille et le prestataire : adresse, horaire, type de demande et conditions.",
    },
    {
      title: "Suivi après la demande",
      text: "Selon le besoin, SOS Santé Maroc peut rester disponible pour une nouvelle intervention, un ajustement ou une demande complémentaire.",
    },
  ],
  durationTitle: "Différence entre soins, aide à domicile et matériel médical",
  durationIntro:
    "Il est important de bien distinguer les besoins : soins à domicile, aide humaine et matériel médical ne répondent pas à la même demande. Cette page reste centrée sur les soins à domicile.",
  durationBlocks: [
    {
      title: "Soins à domicile",
      paragraphs: [
        "Les soins à domicile concernent des interventions réalisées par des professionnels qualifiés : infirmier, kinésithérapeute, médecin ou autre prestataire de santé selon le besoin.",
      ],
      bullets: [
        "Pansement",
        "Injection",
        "Perfusion",
        "Kinésithérapie",
        "Suivi après hospitalisation",
        "Visite médicale à domicile selon disponibilité",
      ],
    },
    {
      title: "Aide à domicile et garde-malade",
      paragraphs: [
        "L’aide à domicile concerne plutôt l’assistance quotidienne non médicale. Le garde-malade apporte une présence auprès d’un patient ou d’une personne fragile, sans remplacer les actes médicaux.",
      ],
      link: {
        label: "Aide à domicile et garde-malade au Maroc",
        href: AIDE_DOMICILE_PATH,
      },
    },
    {
      title: "Matériel médical complémentaire",
      paragraphs: [
        "Un patient qui sort de l’hôpital peut aussi avoir besoin d’un lit médicalisé, d’un fauteuil roulant, d’un déambulateur, d’un matelas anti-escarres ou d’une chaise percée. SOS Santé Maroc peut aider à coordonner ces demandes séparément.",
      ],
      link: {
        label: "Location de matériel médical au Maroc",
        href: LOCATION_PILLAR_PATH,
      },
    },
  ],
  citiesTitle: "Soins à domicile dans les grandes villes du Maroc",
  citiesIntro:
    "SOS Santé Maroc peut traiter les demandes de soins à domicile dans plusieurs villes marocaines selon disponibilité. Les pages locales précisent le contexte sans remplacer ce hub national.",
  cities: [
    {
      name: "Casablanca",
      title: "Soins à domicile à Casablanca",
      paragraphs: [
        "À Casablanca, les familles recherchent souvent un infirmier à domicile, un pansement, une injection, une kinésithérapie ou un médecin à domicile selon disponibilité. SOS Santé Maroc peut aider à vérifier les possibilités auprès de prestataires partenaires selon les quartiers et le besoin.",
        "Indiquez votre quartier, le type de soin et l’horaire pour accélérer la confirmation.",
      ],
      hubHref: hubCityPath("casablanca"),
      hubLabel: "Matériel médical Casablanca",
      locationHref: careServiceCityPath(
        "soins-infirmiers-a-domicile",
        "casablanca"
      ),
      locationLabel: "Soins infirmiers Casablanca",
    },
    {
      name: "Agadir",
      title: "Soins à domicile à Agadir",
      paragraphs: [
        "À Agadir, les soins à domicile peuvent concerner un patient après hospitalisation, une personne âgée, une personne en convalescence ou une personne à mobilité réduite. SOS Santé Maroc aide à rechercher une solution selon disponibilité.",
        "Agadir dispose aussi de pages locales pour le matériel médical si une solution complémentaire est nécessaire.",
      ],
      hubHref: hubCityPath("agadir"),
      hubLabel: "Matériel médical Agadir",
      locationHref: careServiceCityPath("soins-infirmiers-a-domicile", "agadir"),
      locationLabel: "Soins infirmiers Agadir",
    },
    {
      name: "Marrakech",
      title: "Soins à domicile à Marrakech",
      paragraphs: [
        "À Marrakech, les demandes peuvent concerner un infirmier à domicile, un kiné, un pansement ou une injection selon recommandations médicales. SOS Santé Maroc peut orienter la famille vers un prestataire disponible selon la ville.",
        "Précisez toujours la zone et le type de soin recherché.",
      ],
      hubHref: hubCityPath("marrakech"),
      hubLabel: "Matériel médical Marrakech",
      locationHref: careServiceCityPath(
        "kinesitherapie-a-domicile",
        "marrakech"
      ),
      locationLabel: "Kinésithérapie Marrakech",
    },
    {
      name: "Rabat",
      title: "Soins à domicile à Rabat",
      paragraphs: [
        "À Rabat, les familles peuvent rechercher un soin à domicile après opération, hospitalisation ou pour une personne âgée. SOS Santé Maroc aide à coordonner la demande selon disponibilité.",
        "Les demandes provenant de Salé ou Témara peuvent aussi être orientées selon disponibilité.",
      ],
      hubHref: hubCityPath("rabat"),
      hubLabel: "Matériel médical Rabat",
      locationHref: careServiceCityPath("soins-infirmiers-a-domicile", "rabat"),
      locationLabel: "Soins infirmiers Rabat",
    },
    {
      name: "Tanger",
      title: "Soins à domicile à Tanger",
      paragraphs: [
        "À Tanger, SOS Santé Maroc peut accompagner les demandes de soins infirmiers, kinésithérapie, médecin à domicile ou suivi patient selon disponibilité locale.",
        "Comme pour les autres villes, la confirmation dépend du type de soin, de l’horaire et des prestataires partenaires.",
      ],
      hubHref: hubCityPath("tanger"),
      hubLabel: "Matériel médical Tanger",
      locationHref: careServiceCityPath("medecin-a-domicile", "tanger"),
      locationLabel: "Médecin à domicile Tanger",
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
  compareTitle: "Précautions importantes pour les soins à domicile",
  compareIntro:
    "Les soins à domicile doivent être traités avec responsabilité. Cette page informe et rassure, sans donner de conseil médical personnalisé.",
  compareBlocks: [
    {
      title: "Ne pas remplacer un médecin",
      paragraphs: [
        "SOS Santé Maroc ne remplace pas un médecin. En cas de doute médical, la famille doit contacter le professionnel de santé responsable du patient. En situation grave ou urgente, contactez les services d’urgence appropriés.",
      ],
    },
    {
      title: "Ne pas prescrire de traitement",
      paragraphs: [
        "SOS Santé Maroc ne prescrit pas de médicaments, d’injections, de soins ou de protocoles. Le service aide seulement à organiser la mise en relation avec un prestataire qualifié selon disponibilité.",
      ],
    },
    {
      title: "Pas un service d’urgence",
      paragraphs: [
        "SOS Santé Maroc n’est pas un service d’urgence médicale officiel. Les soins restent de la responsabilité du professionnel intervenant. Vérifiez toujours les qualifications et les consignes médicales du patient.",
      ],
    },
  ],
  whyUsTitle: "Pourquoi passer par SOS Santé Maroc ?",
  whyUsIntro:
    "SOS Santé Maroc positionne les soins à domicile comme un service de coordination prudent : clarifier le besoin, vérifier les disponibilités et faciliter la mise en relation, sans jamais remplacer le professionnel de santé.",
  whyUsBlocks: [
    {
      title: "Une demande centralisée",
      text: "La famille peut envoyer une seule demande pour rechercher un infirmier, un kinésithérapeute, un médecin à domicile ou un prestataire de soins selon disponibilité.",
    },
    {
      title: "Une orientation selon le besoin",
      text: "SOS Santé Maroc aide à préciser le type de demande : pansement, injection, perfusion, kinésithérapie, suivi ou visite à domicile.",
    },
    {
      title: "Une coordination locale",
      text: "Les disponibilités peuvent varier selon Casablanca, Agadir, Marrakech, Rabat, Tanger, Fès et les autres villes. SOS Santé Maroc adapte la recherche selon la localisation.",
    },
    {
      title: "Une approche rassurante",
      text: "Le service est pensé pour les familles qui cherchent une solution pour un proche dans une période souvent stressante.",
    },
    {
      title: "Un accompagnement complémentaire",
      text: "Selon la situation, SOS Santé Maroc peut aussi aider à coordonner du matériel médical ou une aide à domicile, avec liens vers les pages dédiées. Ce n’est pas une clinique, une pharmacie ni un service d’urgence médicale officiel.",
    },
  ],
  relatedTitle: "Pages et services liés",
  relatedPillars: [
    {
      label: "Aide à domicile et garde-malade au Maroc",
      href: AIDE_DOMICILE_PATH,
      description: "Accompagnement humain non médical",
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
      label: "Matériel de confort médical au Maroc",
      href: CONFORT_MAROC_PATH,
      description: "Lits médicalisés et confort à domicile",
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
  blogTitle: "Guides et pages utiles",
  blogIntro:
    "Quelques pages de soutien pour préparer une demande de soins à domicile ou un besoin complémentaire.",
  blogLinks: [
    {
      label: "Soins infirmiers à domicile Agadir",
      href: careServiceCityPath("soins-infirmiers-a-domicile", "agadir"),
      description: "Page locale soins infirmiers",
    },
    {
      label: "Kinésithérapie à domicile Casablanca",
      href: careServiceCityPath("kinesitherapie-a-domicile", "casablanca"),
      description: "Page locale kiné à domicile",
    },
    {
      label: "Médecin à domicile Agadir",
      href: careServiceCityPath("medecin-a-domicile", "agadir"),
      description: "Page locale médecin à domicile",
    },
    {
      label: "Aide à domicile au Maroc",
      href: AIDE_DOMICILE_PATH,
      description: "Quand le besoin est non médical",
    },
  ],
  faqs: [
    {
      question: "Comment trouver des soins à domicile au Maroc ?",
      answer:
        "SOS Santé Maroc aide les familles à rechercher des soins à domicile selon la ville, le besoin du patient et la disponibilité des prestataires qualifiés.",
    },
    {
      question: "Quels soins à domicile peut-on demander ?",
      answer:
        "Selon disponibilité, les demandes peuvent concerner un infirmier à domicile, un pansement, une injection, une perfusion, une kinésithérapie, un médecin à domicile ou un suivi patient.",
    },
    {
      question: "Peut-on demander un infirmier à domicile au Maroc ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à rechercher un infirmier à domicile selon la ville, le type de soin demandé et la disponibilité.",
    },
    {
      question: "Peut-on faire un pansement à domicile ?",
      answer:
        "Oui, un pansement à domicile peut être organisé selon disponibilité, mais il doit être réalisé par un professionnel qualifié et selon les recommandations médicales.",
    },
    {
      question: "Peut-on demander une injection à domicile ?",
      answer:
        "Oui, selon disponibilité et prescription médicale. SOS Santé Maroc ne donne pas de conseils sur les médicaments ou les doses.",
    },
    {
      question: "Peut-on trouver un kiné à domicile ?",
      answer:
        "Oui, SOS Santé Maroc peut aider à rechercher une kinésithérapie à domicile selon la ville et la disponibilité des prestataires partenaires.",
    },
    {
      question: "SOS Santé Maroc propose-t-il un médecin à domicile ?",
      answer:
        "Un médecin à domicile peut être recherché selon disponibilité dans certaines villes. SOS Santé Maroc facilite la coordination mais ne remplace pas un service médical officiel.",
    },
    {
      question: "Quelle différence entre soins à domicile et aide à domicile ?",
      answer:
        "Les soins à domicile sont réalisés par des professionnels qualifiés. L’aide à domicile concerne plutôt l’assistance quotidienne, la présence, l’accompagnement et le soutien non médical.",
    },
    {
      question: "SOS Santé Maroc est-il un service d’urgence ?",
      answer:
        "Non. SOS Santé Maroc n’est pas un service d’urgence médicale officiel. En cas de situation grave ou urgente, il faut contacter les services d’urgence appropriés.",
    },
    {
      question: "Comment demander un soin à domicile ?",
      answer:
        "Contactez SOS Santé Maroc par WhatsApp, téléphone ou formulaire en indiquant la ville, le type de soin, l’horaire souhaité et les recommandations médicales disponibles.",
    },
  ],
  ctaTitle: "Besoin de soins à domicile au Maroc ?",
  ctaText:
    "Contactez SOS Santé Maroc pour vérifier les disponibilités dans votre ville. Notre équipe vous aide à rechercher un infirmier à domicile, un kinésithérapeute, un médecin à domicile ou un prestataire adapté selon le besoin du patient, les recommandations médicales et les disponibilités locales.",
  productSidebar: careServicesPillarSidebar({
    title: "Soins médicaux à domicile",
    description:
      "Infirmier, kinésithérapeute, médecin et services liés selon disponibilité dans votre ville.",
    catalogLabel: "Hubs par ville",
  }),
};
