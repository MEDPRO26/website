import type { Product } from "@/lib/product-types";
import { PRICE_ON_REQUEST } from "@/lib/respiratory-products";

const diagnosticStyle = "bg-primary/10 text-primary";
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
      { label: "Plage de fréquences", value: "200–5 000 Hz" },
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
    name: "ATLAS – Moniteur multiparamétrique",
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
    seoTitle: "Achat moniteur multiparamétrique ATLAS | SOS Santé",
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
];
