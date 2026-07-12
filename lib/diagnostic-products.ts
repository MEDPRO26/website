import type { Product } from "@/lib/product-types";
import { PRICE_ON_REQUEST } from "@/lib/respiratory-products";

const diagnosticStyle = "bg-white text-primary shadow-sm";
const city = "Agadir";

function diagnosticProduct(
  data: Omit<Product, "category" | "categoryStyle" | "city" | "badges" | "priceLabel">
): Product {
  return {
    ...data,
    priceLabel: PRICE_ON_REQUEST,
    category: "Diagnostic",
    categoryStyle: diagnosticStyle,
    city,
    badges: ["Diagnostic", "Disponible à la vente"],
  };
}

export const diagnosticProducts: Product[] = [
  diagnosticProduct({
    slug: "amplificateur-auditif-beurer",
    name: "Amplificateur auditif Beurer",
    shortName: "Amplificateur Beurer",
    tagline: "Amplificateur auditif Beurer pour un meilleur confort d'écoute.",
    description:
      "Amplificateur auditif conçu pour les personnes présentant une déficience auditive légère à modérée. Amplifie les sons en intérieur comme en extérieur, avec contour d'oreille ergonomique.",
    extendedDescription:
      "Livré avec plusieurs embouts pour s'adapter au conduit auditif et une boîte de rangement. Réglage du volume et plage de fréquences adaptée à un usage quotidien. Consultez un professionnel de santé pour confirmer l'adéquation du dispositif.",
    image: "/products/amplificateur-auditif-beurer.webp",
    alt: "Amplificateur auditif Beurer",
    specs: [
      { label: "Amplification max.", value: "40 dB" },
      { label: "Plage de fréquences", value: "200-5 000 Hz" },
      { label: "Embouts", value: "3 tailles" },
    ],
    included: ["Amplificateur auditif", "3 embouts", "Boîte de rangement"],
    useCases: [
      {
        icon: "hearing",
        title: "Déficience auditive",
        description: "Aide à mieux percevoir les sons du quotidien.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Usage intérieur et extérieur.",
      },
      {
        icon: "elderly",
        title: "Seniors",
        description: "Confort d'écoute lors des conversations.",
      },
    ],
    related: [],
    seoTitle: "Achat amplificateur auditif Beurer | SOS Santé",
    seoDescription:
      "Achetez un amplificateur auditif Beurer au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "analyse-hemoglobine-glyquee-hba1c",
    name: "Analyse de l'hémoglobine glyquée HbA1c",
    shortName: "Analyseur HbA1c",
    tagline: "Analyseur portable HbA1c pour le suivi du diabète en cabinet.",
    description:
      "Analyseur A1C EZ 2.0 pour mesurer le taux d'hémoglobine glyquée (HbA1c) à partir d'une goutte de sang capillaire. Résultats en environ 5 minutes, sans préchauffage.",
    extendedDescription:
      "Appareil portable alimenté par piles, avec guidage vocal et stockage des résultats. Affichage en % HbA1c ou mmol/mol selon les réglages. Destiné aux cabinets médicaux et structures de santé pour un suivi rapide des patients diabétiques.",
    image: "/products/analyse-hemoglobine-glyquee-hba1c.webp",
    alt: "Analyseur d'hémoglobine glyquée HbA1c portable",
    specs: [
      { label: "Échantillon", value: "≈ 3 µL (sang capillaire)" },
      { label: "Temps de test", value: "≈ 5 minutes" },
      { label: "Mémoire", value: "1 000 résultats" },
    ],
    included: [
      "Analyseur A1C EZ 2.0",
      "Piles AAA",
      "Manuel d'utilisation",
    ],
    useCases: [
      {
        icon: "monitoring",
        title: "Suivi diabète",
        description: "Mesure de l'HbA1c en point de soins.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Résultats rapides sans laboratoire.",
      },
      {
        icon: "medical_services",
        title: "Dépistage",
        description: "Aide au suivi des patients à risque.",
      },
    ],
    related: [],
    seoTitle: "Achat analyseur HbA1c | SOS Santé",
    seoDescription:
      "Achetez un analyseur d'hémoglobine glyquée HbA1c au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "analyseur-glycohemoglobine-biohermes",
    name: "Analyseur de glycohémoglobine professionnel Biohermes",
    shortName: "Analyseur A1cChek Pro",
    tagline: "Analyseur HbA1c professionnel à haut débit pour établissements de santé.",
    description:
      "Analyseur A1cChek Pro pour tests HbA1c en point de soins. Quatre canaux, écran tactile et résultats rapides à partir d'un échantillon capillaire ou veineux.",
    extendedDescription:
      "Conçu pour les cabinets, laboratoires et hôpitaux nécessitant plusieurs résultats en peu de temps. Fonctionnement automatisé, imprimante thermique intégrée et connectivité USB/Wi-Fi pour le transfert des données.",
    image: "/products/analyseur-glycohemoglobine-biohermes.webp",
    alt: "Analyseur de glycohémoglobine professionnel Biohermes",
    specs: [
      { label: "Canaux", value: "4" },
      { label: "Temps de test", value: "5 min (1er résultat)" },
      { label: "Plage de test", value: "4,0 % à 14,0 %" },
    ],
    included: [
      "Analyseur A1cChek Pro",
      "Adaptateur secteur",
      "Manuels d'utilisation",
    ],
    useCases: [
      {
        icon: "local_hospital",
        title: "Établissements de santé",
        description: "Dépistage et suivi du diabète en volume.",
      },
      {
        icon: "monitoring",
        title: "Laboratoire",
        description: "Tests HbA1c à haut débit.",
      },
      {
        icon: "medical_services",
        title: "Point de soins",
        description: "Décision médicale rapide.",
      },
    ],
    related: [],
    seoTitle: "Achat analyseur glycohémoglobine Biohermes | SOS Santé",
    seoDescription:
      "Achetez un analyseur de glycohémoglobine professionnel au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "atlas-moniteur-multiparametrique",
    name: "ATLAS - Moniteur multiparamétrique",
    shortName: "Moniteur ATLAS",
    tagline: "Moniteur patient multiparamétrique pour la surveillance clinique.",
    description:
      "Moniteur multiparamétrique Optimium Pro ATLAS pour le suivi des patients en service de médecine générale. Mesure SpO2, tension artérielle non invasive, ECG, température et respiration.",
    extendedDescription:
      "Écran disponible en plusieurs tailles selon le modèle (8, 10 ou 12 pouces). Conçu pour fournir des informations cliniques continues et fiables. Adapté aux cabinets, cliniques et services hospitaliers.",
    image: "/products/atlas-moniteur-multiparametrique.webp",
    alt: "Moniteur multiparamétrique ATLAS",
    specs: [
      { label: "Paramètres", value: "SpO2, NIBP, ECG, TEMP, RESP" },
      { label: "Écrans", value: "8″, 10″ ou 12″" },
      { label: "Références", value: "Atlas08, Atlas10, Atlas12" },
    ],
    included: ["Moniteur multiparamétrique ATLAS"],
    useCases: [
      {
        icon: "monitor_heart",
        title: "Surveillance patient",
        description: "Suivi continu des constantes vitales.",
      },
      {
        icon: "local_hospital",
        title: "Clinique & hôpital",
        description: "Monitorage en salle de soins.",
      },
      {
        icon: "medical_services",
        title: "Urgences",
        description: "Informations pour la prise en charge.",
      },
    ],
    related: [],
    seoTitle: "Achat ATLAS - moniteur multiparamétrique | SOS Santé",
    seoDescription:
      "Achetez un moniteur multiparamétrique ATLAS au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "bracelets-pinces-ecg",
    name: "Bracelets pinces ECG",
    shortName: "Pinces ECG",
    tagline: "Jeu de 4 pinces ECG réutilisables pour enregistrement cardiaque.",
    description:
      "Jeu de quatre pinces ECG universelles réutilisables en plastique, disponibles en plusieurs couleurs pour identifier les dérivations.",
    extendedDescription:
      "Accessoire compatible avec les appareils d'électrocardiographie pour la connexion des électrodes aux membres. Usage professionnel en cabinet, clinique ou service hospitalier.",
    image: "/products/bracelets-pinces-ecg.webp",
    alt: "Bracelets pinces ECG réutilisables",
    specs: [
      { label: "Quantité", value: "4 pinces" },
      { label: "Matériau", value: "Plastique" },
      { label: "Usage", value: "Réutilisable" },
    ],
    included: ["Jeu de 4 pinces ECG"],
    useCases: [
      {
        icon: "ecg",
        title: "ECG",
        description: "Connexion des dérivations membres.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Complément d'un appareil ECG.",
      },
      {
        icon: "medical_services",
        title: "Cardiologie",
        description: "Examen cardiaque de routine.",
      },
    ],
    related: [],
    seoTitle: "Achat bracelets pinces ECG | SOS Santé",
    seoDescription:
      "Achetez un jeu de pinces ECG au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "defibrillateur-externe-automatique",
    name: "Défibrillateur externe automatique",
    shortName: "DAE Heart Guardian",
    tagline: "Défibrillateur automatique externe pour l'urgence cardiaque.",
    description:
      "Défibrillateur externe automatique Heart Guardian HR-501. Analyse le rythme cardiaque et délivre un choc si nécessaire en cas d'arrêt cardiaque.",
    extendedDescription:
      "Livré avec sac de rangement, batterie et électrodes adhésives. L'utilisation requiert une formation aux gestes de premiers secours. Équipement adapté aux établissements recevant du public et aux structures de santé.",
    image: "/products/defibrillateur-externe-automatique.webp",
    alt: "Défibrillateur externe automatique Heart Guardian",
    specs: [
      { label: "Modèle", value: "Heart Guardian HR-501" },
      { label: "Type", value: "DAE automatique" },
      { label: "Électrodes", value: "1 paire adhésive incluse" },
    ],
    included: ["Défibrillateur", "Sac de rangement", "Batterie", "Électrodes"],
    useCases: [
      {
        icon: "emergency",
        title: "Urgence cardiaque",
        description: "Réponse rapide en cas d'arrêt cardiaque.",
      },
      {
        icon: "local_hospital",
        title: "Structures de santé",
        description: "Équipement de sécurité en établissement.",
      },
      {
        icon: "health_and_safety",
        title: "Lieux publics",
        description: "Présence d'un DAE pour la sécurité.",
      },
    ],
    related: [],
    seoTitle: "Achat défibrillateur externe automatique | SOS Santé",
    seoDescription:
      "Achetez un défibrillateur externe automatique au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "ecg-12-pistes-cardiomaster-12000",
    name: "ECG 12 pistes CardioMaster 12000",
    shortName: "ECG 12 pistes OP-12000",
    tagline: "Électrocardiographe digital 12 canaux avec écran couleur.",
    description:
      "ECG digital 12 canaux Optimium Pro CardioMaster OP-12000. Écran TFT couleur 8″, auto-analyse et stockage de plus de 1 000 enregistrements.",
    extendedDescription:
      "Filtres numériques, batterie lithium rechargeable et connexion USB/LAN pour le transfert des données vers PC. Plusieurs modes d'affichage et d'impression disponibles. Adapté aux cabinets et services cardiologiques.",
    image: "/products/ecg-12-pistes-cardiomaster-12000.webp",
    alt: "ECG 12 pistes CardioMaster 12000",
    specs: [
      { label: "Canaux", value: "12" },
      { label: "Écran", value: "8″ TFT couleur" },
      { label: "Mémoire", value: "> 1 000 fichiers" },
    ],
    included: ["Appareil ECG OP-12000", "Batterie rechargeable"],
    useCases: [
      {
        icon: "ecg",
        title: "Cardiologie",
        description: "Enregistrement ECG 12 dérivations.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Examen cardiaque complet.",
      },
      {
        icon: "monitoring",
        title: "Archivage",
        description: "Stockage et export des tracés.",
      },
    ],
    related: [],
    seoTitle: "Achat ECG 12 pistes CardioMaster 12000 | SOS Santé",
    seoDescription:
      "Achetez un ECG 12 pistes CardioMaster 12000 au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "ecg-6-pistes-cardiomaster-6000",
    name: "ECG 6 pistes CardioMaster 6000",
    shortName: "ECG 6 pistes OP-6000",
    tagline: "Électrocardiographe 6 pistes avec écran tactile couleur 7″.",
    description:
      "ECG Optimium Pro CardioMaster OP-6000 avec écran tactile LCD 7″, affichage simultané de 12 dérivations et analyse automatique.",
    extendedDescription:
      "Imprimante thermique intégrée, batterie lithium rechargeable et mémoire jusqu'à 1 000 résultats. Connexion USB pour transmission vers PC. Gestion des patients avec rapport d'analyse détaillé.",
    image: "/products/ecg-6-pistes-cardiomaster-6000.webp",
    alt: "ECG 6 pistes CardioMaster 6000",
    specs: [
      { label: "Écran", value: "7″ LCD tactile" },
      { label: "Mémoire", value: "Jusqu'à 1 000 résultats" },
      { label: "Imprimante", value: "Thermique intégrée" },
    ],
    included: ["Appareil ECG OP-6000", "Batterie rechargeable"],
    useCases: [
      {
        icon: "ecg",
        title: "Examen cardiaque",
        description: "ECG avec interprétation automatique.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Appareil compact et complet.",
      },
      {
        icon: "print",
        title: "Impression",
        description: "Tracés imprimables sur place.",
      },
    ],
    related: [],
    seoTitle: "Achat ECG 6 pistes CardioMaster 6000 | SOS Santé",
    seoDescription:
      "Achetez un ECG 6 pistes CardioMaster 6000 au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "ecg-interpretation-3-pistes",
    name: "ECG avec interprétation 3 pistes",
    shortName: "ECG 3 pistes ECG300G",
    tagline: "Électrocardiographe 3 pistes avec écran couleur et impression thermique.",
    description:
      "Appareil ECG 3 pistes pour enregistrements manuels ou automatiques, avec calcul des paramètres cardiaques, affichage sur écran LCD couleur et impression thermique.",
    extendedDescription:
      "Permet la visualisation de plusieurs dérivations, la mémorisation des tracés et l'impression sur rouleau thermique. Alimentation secteur et batterie rechargeable. Destiné aux cabinets médicaux et structures de soins pour un examen cardiaque de routine.",
    image: "/products/ecg-interpretation-3-pistes.webp",
    alt: "ECG avec interprétation 3 pistes",
    specs: [
      { label: "Modèle", value: "ECG300G" },
      { label: "Écran", value: "LCD couleur 3,5″" },
      { label: "Imprimante", value: "Thermique" },
      { label: "Alimentation", value: "Secteur et batterie" },
    ],
    included: ["Appareil ECG 3 pistes"],
    useCases: [
      {
        icon: "ecg",
        title: "Examen cardiaque",
        description: "Enregistrement ECG en cabinet ou en établissement de santé.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Appareil compact pour un usage courant.",
      },
      {
        icon: "print",
        title: "Impression",
        description: "Tracés imprimables sur place.",
      },
    ],
    related: [],
    seoTitle: "Achat ECG 3 pistes avec interprétation | SOS Santé",
    seoDescription:
      "Achetez un ECG 3 pistes au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "echelle-optometrique-lumineux",
    name: "Échelle optométrique lumineuse",
    shortName: "Échelle optométrique",
    tagline: "Panneau optométrique lumineux pour le dépistage visuel.",
    description:
      "Échelle optométrique avec panneau luminescent en plaque acrylique, conçue pour les tests de vision en cabinet ou en structure de santé.",
    extendedDescription:
      "Cadran visuel d'environ 24 × 62 cm, avec possibilité de dessin ou de motif en forme E selon le modèle. Équipement d'examen visuel destiné aux professionnels de santé.",
    image: "/products/echelle-optometrique-lumineux.webp",
    alt: "Échelle optométrique lumineuse",
    specs: [
      { label: "Cadran visuel", value: "≈ 24 × 62 cm" },
      { label: "Dimensions ext.", value: "≈ 29,5 × 67,5 × 12 cm" },
      { label: "Poids", value: "≈ 6 kg" },
    ],
    included: ["Échelle optométrique lumineuse"],
    useCases: [
      {
        icon: "visibility",
        title: "Examen visuel",
        description: "Dépistage et contrôle de l'acuité visuelle.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Usage en consultation courante.",
      },
      {
        icon: "medical_services",
        title: "Structures de santé",
        description: "Équipement d'appoint pour l'ophtalmologie générale.",
      },
    ],
    related: [],
    seoTitle: "Achat échelle optométrique lumineuse | SOS Santé",
    seoDescription:
      "Achetez une échelle optométrique lumineuse au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "hemoglobinometre-numerique-anemie",
    name: "Hémoglobinomètre numérique",
    shortName: "Hémoglobinomètre Mission",
    tagline: "Analyseur portable pour la mesure de l'hémoglobine.",
    description:
      "Analyseur numérique portable conçu pour mesurer le taux d'hémoglobine à partir d'un échantillon capillaire, avec affichage numérique et utilisation simplifiée.",
    extendedDescription:
      "Format compact adapté à un usage en cabinet ou en déplacement. Fournit un résultat rapide après prélèvement. Les bandelettes de test sont généralement fournies séparément selon le modèle - contactez-nous pour connaître la configuration disponible.",
    image: "/products/hemoglobinometre-numerique-anemie.webp",
    alt: "Hémoglobinomètre numérique pour anémie",
    specs: [
      { label: "Type", value: "Analyseur portable" },
      { label: "Échantillon", value: "Sang capillaire" },
      { label: "Affichage", value: "Numérique" },
    ],
    included: ["Hémoglobinomètre numérique"],
    useCases: [
      {
        icon: "bloodtype",
        title: "Dépistage anémie",
        description: "Mesure du taux d'hémoglobine en point de soins.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Résultat rapide lors de la consultation.",
      },
      {
        icon: "monitoring",
        title: "Suivi",
        description: "Aide au suivi des patients nécessitant un contrôle régulier.",
      },
    ],
    related: [],
    seoTitle: "Achat hémoglobinomètre numérique | SOS Santé",
    seoDescription:
      "Achetez un hémoglobinomètre numérique au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "moniteur-multiparametrique-modulaire",
    name: "Moniteur multiparamétrique modulaire",
    shortName: "Moniteur Superview-12",
    tagline: "Moniteur patient modulaire pour la surveillance des constantes vitales.",
    description:
      "Moniteur multiparamétrique modulaire pour le suivi en temps réel de paramètres tels que ECG, fréquence cardiaque, pression artérielle non invasive, SpO2, respiration et température, selon la configuration choisie.",
    extendedDescription:
      "Conçu pour une utilisation en milieu hospitalier ou clinique par du personnel formé. Les fonctions disponibles peuvent varier selon le modèle et les modules installés. Les informations affichées servent de référence clinique et ne remplacent pas le jugement médical.",
    image: "/products/moniteur-multiparametrique-modulaire.webp",
    alt: "Moniteur multiparamétrique modulaire Superview-12",
    specs: [
      { label: "Référence", value: "Superview-12" },
      { label: "Paramètres", value: "ECG, FC, NIBP, SpO2, RESP, TEMP (selon config.)" },
      { label: "Usage", value: "Surveillance patient" },
    ],
    included: ["Moniteur multiparamétrique modulaire"],
    useCases: [
      {
        icon: "monitor_heart",
        title: "Surveillance continue",
        description: "Suivi des signes vitaux en salle de soins.",
      },
      {
        icon: "local_hospital",
        title: "Hôpital & clinique",
        description: "Monitorage en établissement de santé.",
      },
      {
        icon: "medical_services",
        title: "Configuration modulaire",
        description: "Paramètres adaptables selon les besoins.",
      },
    ],
    related: [],
    seoTitle: "Achat moniteur multiparamétrique modulaire | SOS Santé",
    seoDescription:
      "Achetez un moniteur multiparamétrique modulaire au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "moniteur-multiparametrique-op-6500",
    name: "Moniteur multiparamétrique OP-6500",
    shortName: "Moniteur OP-6500",
    tagline: "Moniteur patient compact pour le suivi des paramètres vitaux.",
    description:
      "Moniteur multiparamétrique OP-6500 pour la surveillance du SpO2, de la pression artérielle non invasive, de la température et du pouls, avec affichage couleur.",
    extendedDescription:
      "Écran TFT couleur d'environ 2,8 pouces. Mesures adaptées à l'adulte, l'enfant et le nouveau-né selon les modes disponibles. Alimentation secteur avec batterie lithium intégrée. Destiné aux structures de santé sous la responsabilité de personnel qualifié.",
    image: "/products/moniteur-multiparametrique-op-6500.webp",
    alt: "Moniteur multiparamétrique OP-6500",
    specs: [
      { label: "Modèle", value: "OP-6500" },
      { label: "Écran", value: "TFT couleur 2,8″" },
      { label: "Paramètres", value: "SpO2, NIBP, température, pouls" },
      { label: "Alimentation", value: "100-240 V + batterie lithium" },
    ],
    included: ["Moniteur multiparamétrique OP-6500"],
    useCases: [
      {
        icon: "monitor_heart",
        title: "Surveillance patient",
        description: "Suivi des constantes vitales en temps réel.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Format compact pour la surveillance au chevet.",
      },
      {
        icon: "battery_charging_full",
        title: "Mobilité",
        description: "Batterie intégrée pour un usage flexible.",
      },
    ],
    related: [],
    seoTitle: "Achat moniteur multiparamétrique OP-6500 | SOS Santé",
    seoDescription:
      "Achetez un moniteur multiparamétrique OP-6500 au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "negatoscope-standard-tube-fluorescent",
    name: "Négatoscope standard à tube fluorescent",
    shortName: "Négatoscope fluorescent",
    tagline: "Négatoscope mural ou posable pour la visualisation de radiographies.",
    description:
      "Négatoscope à tube fluorescent pour la lecture de clichés radiographiques, avec structure en alliage d'aluminium et réglage de luminosité.",
    extendedDescription:
      "Peut être posé au sol ou fixé au mur. Système de fixation facilitant la pose et la dépose des radios. Disponible en version 1 à 4 plages selon les références OP-NS01 à OP-NS04.",
    image: "/products/negatoscope-standard-tube-fluorescent.webp",
    alt: "Négatoscope standard à tube fluorescent",
    specs: [
      { label: "Références", value: "OP-NS01 à OP-NS04" },
      { label: "Plages", value: "1 à 4" },
      { label: "Écran", value: "Polymère méthacrylique" },
    ],
    included: ["Négatoscope standard"],
    useCases: [
      {
        icon: "radiology",
        title: "Lecture radiologique",
        description: "Visualisation de radiographies sur place.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Équipement d'appoint pour l'imagerie.",
      },
      {
        icon: "wall_art",
        title: "Pose murale",
        description: "Installation au mur ou sur pied possible.",
      },
    ],
    related: [],
    seoTitle: "Achat négatoscope standard fluorescent | SOS Santé",
    seoDescription:
      "Achetez un négatoscope standard au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "negatoscope-ultra-fin-led",
    name: "Négatoscope ultra-fin LED",
    shortName: "Négatoscope LED",
    tagline: "Négatoscope LED fin pour une visualisation lumineuse des radiographies.",
    description:
      "Négatoscope ultra-fin à rétroéclairage LED avec régulateur de luminosité numérique et activation automatique des clichés.",
    extendedDescription:
      "Structure en alliage d'aluminium, écran en polymère méthacrylique et épaisseur d'environ 2,4 cm. Disponible en version 1 à 4 plages selon les références OP-NL01 à OP-NL04. Alimentation 100-240 V.",
    image: "/products/negatoscope-ultra-fin-led.webp",
    alt: "Négatoscope ultra-fin LED",
    specs: [
      { label: "Références", value: "OP-NL01 à OP-NL04" },
      { label: "Éclairage", value: "LED" },
      { label: "Épaisseur", value: "≈ 2,4 cm" },
      { label: "Plages", value: "1 à 4" },
    ],
    included: ["Négatoscope ultra-fin LED"],
    useCases: [
      {
        icon: "radiology",
        title: "Imagerie médicale",
        description: "Lecture de radiographies avec rétroéclairage LED.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Format fin pour gagner de l'espace.",
      },
      {
        icon: "light_mode",
        title: "Luminosité réglable",
        description: "Réglage numérique de la luminosité.",
      },
    ],
    related: [],
    seoTitle: "Achat négatoscope ultra-fin LED | SOS Santé",
    seoDescription:
      "Achetez un négatoscope LED au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "otoscope-fibre-optique",
    name: "Otoscope fibre optique",
    shortName: "Otoscope OP-OT01",
    tagline: "Otoscope à fibre optique pour l'examen du conduit auditif.",
    description:
      "Otoscope à illumination fibre optique avec fenêtre de visualisation claire, grossissement et poignée ergonomique pour l'examen ORL.",
    extendedDescription:
      "Éclairage homogène du conduit auditif et du tympan. Clip de fixation avec interrupteur intégré. Destiné à un usage professionnel en cabinet médical ou en structure de santé.",
    image: "/products/otoscope-fibre-optique.webp",
    alt: "Otoscope fibre optique",
    specs: [
      { label: "Référence", value: "OP-OT01" },
      { label: "Éclairage", value: "Fibre optique LED" },
      { label: "Grossissement", value: "×3" },
    ],
    included: ["Otoscope fibre optique"],
    useCases: [
      {
        icon: "hearing",
        title: "Examen ORL",
        description: "Inspection du conduit auditif et du tympan.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Outil de diagnostic courant en consultation.",
      },
      {
        icon: "medical_services",
        title: "Usage professionnel",
        description: "Conçu pour les professionnels de santé.",
      },
    ],
    related: [],
    seoTitle: "Achat otoscope fibre optique | SOS Santé",
    seoDescription:
      "Achetez un otoscope fibre optique au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "oxymetre-doigt",
    name: "Oxymètre de doigt",
    shortName: "Oxymètre Beurer PO-30",
    tagline: "Oxymètre de pouls pour la mesure de la SpO2 et du pouls.",
    description:
      "Oxymètre de doigt portable pour mesurer la saturation en oxygène (SpO2) et la fréquence cardiaque. Écran couleur avec affichage graphique du pouls et luminosité réglable.",
    extendedDescription:
      "Format compact adapté à un usage à domicile ou en déplacement. Arrêt automatique et indicateur de niveau de pile. Livré avec dragonne et pochette de transport selon le modèle. Les mesures servent d'indication et ne remplacent pas un avis médical.",
    image: "/products/oxymetre-doigt.webp",
    alt: "Oxymètre de doigt Beurer PO-30",
    specs: [
      { label: "Référence", value: "PO-30" },
      { label: "Marque", value: "Beurer" },
      { label: "Mesures", value: "SpO2 et pouls" },
      { label: "Écran", value: "Couleur" },
    ],
    included: ["Oxymètre de doigt"],
    useCases: [
      {
        icon: "monitor_heart",
        title: "Suivi SpO2",
        description: "Lecture rapide de la saturation en oxygène.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Appareil léger et portable.",
      },
      {
        icon: "directions_walk",
        title: "Déplacement",
        description: "Format compact pour un usage nomade.",
      },
    ],
    related: [],
    seoTitle: "Achat oxymètre de doigt | SOS Santé",
    seoDescription:
      "Achetez un oxymètre de doigt au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "stethoscope-simple-pavillon",
    name: "Stéthoscope simple pavillon",
    shortName: "Stéthoscope pavillon",
    tagline: "Stéthoscope à récepteur simple pour l'auscultation.",
    description:
      "Stéthoscope à pavillon unique avec membrane acoustique en résine époxy, embouts souples et lyre orientée pour l'examen clinique courant.",
    extendedDescription:
      "Récepteur en alliage de zinc chromé ou poudré selon le modèle. Tubulure en PVC avec embouts vissés assortis. Outil de diagnostic classique pour cabinet médical et structures de soins.",
    image: "/products/stethoscope-simple-pavillon.webp",
    alt: "Stéthoscope simple pavillon",
    specs: [
      { label: "Référence", value: "PULSE" },
      { label: "Type", value: "Pavillon simple" },
      { label: "Membrane", value: "Résine époxy" },
    ],
    included: ["Stéthoscope simple pavillon"],
    useCases: [
      {
        icon: "medical_services",
        title: "Auscultation",
        description: "Examen cardiaque et respiratoire de base.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Équipement courant en consultation.",
      },
      {
        icon: "healing",
        title: "Soins quotidiens",
        description: "Usage professionnel au chevet du patient.",
      },
    ],
    related: [],
    seoTitle: "Achat stéthoscope simple pavillon | SOS Santé",
    seoDescription:
      "Achetez un stéthoscope simple pavillon au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "tensiometre-electronique-beurer-bm26",
    name: "Tensiomètre électronique Beurer BM26",
    shortName: "Tensiomètre BM26",
    tagline: "Tensiomètre de bras automatique avec classification OMS.",
    description:
      "Tensiomètre électronique Beurer BM26 pour la mesure automatique de la pression artérielle et du pouls au bras. Grand écran LCD avec indicateur colorimétrique selon les recommandations de l'OMS.",
    extendedDescription:
      "Mémorisation possible pour plusieurs profils utilisateur. Détection des arythmies et moyenne des dernières mesures pour plus de fiabilité. Brassard universel selon le modèle fourni. Alimentation sur piles. Consultez un professionnel de santé pour l'interprétation des résultats.",
    image: "/products/tensiometre-electronique-beurer-bm26.webp",
    alt: "Tensiomètre électronique Beurer BM26",
    specs: [
      { label: "Modèle", value: "BM26" },
      { label: "Marque", value: "Beurer" },
      { label: "Type", value: "Bras" },
      { label: "Affichage", value: "LCD avec code couleur OMS" },
    ],
    included: ["Tensiomètre électronique BM26"],
    useCases: [
      {
        icon: "monitor_heart",
        title: "Tension artérielle",
        description: "Mesure SYS/DIA et pouls au bras.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Suivi régulier de la pression artérielle.",
      },
      {
        icon: "family_restroom",
        title: "Usage familial",
        description: "Plusieurs profils mémorisables selon le modèle.",
      },
    ],
    related: [],
    seoTitle: "Achat tensiomètre Beurer BM26 | SOS Santé",
    seoDescription:
      "Achetez un tensiomètre électronique Beurer BM26 au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "tensiometre-electronique-poignet",
    name: "Tensiomètre électronique de poignet",
    shortName: "Tensiomètre poignet BC-28",
    tagline: "Tensiomètre automatique compact pour le poignet.",
    description:
      "Tensiomètre électronique de poignet pour la mesure automatique de la pression artérielle et du pouls. Affichage LCD clair avec mémorisation des mesures.",
    extendedDescription:
      "Format compact avec manchette adaptée aux poignets de 14 à 19,5 cm selon le modèle. Indicateur de risque et dépistage des troubles du rythme cardiaque. Arrêt automatique et pochette de rangement. Les résultats doivent être interprétés par un professionnel de santé.",
    image: "/products/tensiometre-electronique-poignet.webp",
    alt: "Tensiomètre électronique de poignet Beurer",
    specs: [
      { label: "Référence", value: "BC-28" },
      { label: "Marque", value: "Beurer" },
      { label: "Type", value: "Poignet" },
      { label: "Manchette", value: "14-19,5 cm" },
    ],
    included: ["Tensiomètre électronique de poignet"],
    useCases: [
      {
        icon: "monitor_heart",
        title: "Pression artérielle",
        description: "Mesure au poignet en quelques instants.",
      },
      {
        icon: "directions_walk",
        title: "Nomade",
        description: "Format compact pour les déplacements.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Suivi simple au quotidien.",
      },
    ],
    related: [],
    seoTitle: "Achat tensiomètre électronique de poignet | SOS Santé",
    seoDescription:
      "Achetez un tensiomètre de poignet au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "tensiometre-vaquez-laubry-hopital",
    name: "Tensiomètre Vaquez-Laubry hôpital",
    shortName: "Tensiomètre anéroïde",
    tagline: "Tensiomètre manuel à mercure pour usage hospitalier.",
    description:
      "Tensiomètre Vaquez-Laubry avec robinet de décompression à valve précise, boîtier métallique anticorrosion et brassard en polycoton lavable.",
    extendedDescription:
      "Lecture du manomètre facilitée sous différents angles. Conçu pour un usage professionnel en établissement de santé. Brassard adapté notamment aux patients à bras volumineux selon les indications du fabricant.",
    image: "/products/tensiometre-vaquez-laubry-hopital.webp",
    alt: "Tensiomètre Vaquez-Laubry hôpital avec sangles",
    specs: [
      { label: "Référence", value: "518_612" },
      { label: "Type", value: "Manuel (anéroïde)" },
      { label: "Brassard", value: "Polycoton lavable" },
    ],
    included: ["Tensiomètre Vaquez-Laubry"],
    useCases: [
      {
        icon: "local_hospital",
        title: "Hôpital & clinique",
        description: "Mesure manuelle fiable en milieu hospitalier.",
      },
      {
        icon: "medical_services",
        title: "Usage professionnel",
        description: "Destiné au personnel formé.",
      },
      {
        icon: "monitor_heart",
        title: "Tension artérielle",
        description: "Prise de tension au chevet du patient.",
      },
    ],
    related: [],
    seoTitle: "Achat tensiomètre Vaquez-Laubry | SOS Santé",
    seoDescription:
      "Achetez un tensiomètre Vaquez-Laubry au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "thermometre-infrarouge-sans-contact",
    name: "Thermomètre infrarouge sans contact",
    shortName: "Thermomètre FT-85",
    tagline: "Thermomètre infrarouge sans contact pour la température corporelle.",
    description:
      "Thermomètre infrarouge Beurer FT-85 pour mesurer la température corporelle, ambiante ou de surface sans contact direct avec la peau.",
    extendedDescription:
      "Mesure rapide à quelques centimètres du front. Affichage en °C ou °F, alarme de fièvre configurable et mémoire des mesures. Arrêt automatique. Hygiénique et pratique pour un usage à domicile ou en cabinet.",
    image: "/products/thermometre-infrarouge-sans-contact.webp",
    alt: "Thermomètre infrarouge sans contact Beurer FT-85",
    specs: [
      { label: "Référence", value: "FT-85" },
      { label: "Marque", value: "Beurer" },
      { label: "Type", value: "Infrarouge sans contact" },
      { label: "Distance", value: "≈ 2-3 cm" },
    ],
    included: ["Thermomètre infrarouge sans contact"],
    useCases: [
      {
        icon: "thermostat",
        title: "Fièvre",
        description: "Mesure de température corporelle rapide.",
      },
      {
        icon: "child_care",
        title: "Toute la famille",
        description: "Usage sans contact, plus hygiénique.",
      },
      {
        icon: "home",
        title: "À domicile",
        description: "Contrôle simple au quotidien.",
      },
    ],
    related: [],
    seoTitle: "Achat thermomètre infrarouge sans contact | SOS Santé",
    seoDescription:
      "Achetez un thermomètre infrarouge sans contact au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "thermometre-multifonction",
    name: "Thermomètre multifonction",
    shortName: "Thermomètre FT-65",
    tagline: "Thermomètre médical pour oreille, front et surfaces.",
    description:
      "Thermomètre multifonction pour mesurer la température au niveau de l'oreille ou du front, ainsi que la température superficielle d'objets et de liquides.",
    extendedDescription:
      "Grand écran lisible, alarme visuelle en cas de fièvre et mémorisation de plusieurs mesures. Affichage en °C ou °F avec arrêt automatique. Adapté à un usage familial ou en cabinet médical.",
    image: "/products/thermometre-multifonction.webp",
    alt: "Thermomètre multifonction FT-65",
    specs: [
      { label: "Référence", value: "FT-65" },
      { label: "Modes", value: "Oreille, front, surface" },
      { label: "Mémoire", value: "10 mesures" },
    ],
    included: ["Thermomètre multifonction"],
    useCases: [
      {
        icon: "thermostat",
        title: "Température corporelle",
        description: "Mesure oreille ou front en quelques secondes.",
      },
      {
        icon: "child_care",
        title: "Famille",
        description: "Usage adapté aux enfants et adultes.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet médical",
        description: "Thermomètre médical polyvalent.",
      },
    ],
    related: [],
    seoTitle: "Achat thermomètre multifonction | SOS Santé",
    seoDescription:
      "Achetez un thermomètre multifonction au Maroc. Devis et conseil avec SOS Santé.",
  }),
  diagnosticProduct({
    slug: "ventouse-poire-ecg-a-vis",
    name: "Ventouse poire ECG à vis",
    shortName: "Ventouse ECG",
    tagline: "Ventouse poire en caoutchouc pour électrodes ECG.",
    description:
      "Ventouse poire à vis en caoutchouc pour la fixation d'électrodes lors d'examens ECG.",
    extendedDescription:
      "Accessoire de diagnostic courant pour maintenir les électrodes en place sur la peau du patient. Compatible avec les examens ECG en cabinet ou en établissement de santé.",
    image: "/products/ventouse-poire-ecg-a-vis.webp",
    alt: "Ventouse poire ECG à vis",
    specs: [
      { label: "Type", value: "Poire à vis" },
      { label: "Matériau", value: "Caoutchouc" },
    ],
    included: ["Ventouse poire ECG à vis"],
    useCases: [
      {
        icon: "ecg",
        title: "Examen ECG",
        description: "Fixation des électrodes lors du tracé.",
      },
      {
        icon: "local_hospital",
        title: "Cabinet & clinique",
        description: "Accessoire pour appareils ECG.",
      },
      {
        icon: "medical_services",
        title: "Usage professionnel",
        description: "Complément aux équipements de cardiologie.",
      },
    ],
    related: [],
    seoTitle: "Achat ventouse poire ECG à vis | SOS Santé",
    seoDescription:
      "Achetez une ventouse poire ECG au Maroc. Devis et conseil avec SOS Santé.",
  }),
];
