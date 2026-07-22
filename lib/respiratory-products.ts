import type { Product } from "@/lib/product-types";

export const PRICE_ON_REQUEST = "Prix sur demande";

const respiratoryStyle = "bg-white text-primary shadow-sm";
const city = "Agadir";

function respiratoryProduct(
  data: Omit<Product, "category" | "categoryStyle" | "city" | "badges" | "priceLabel">
): Product {
  return {
    ...data,
    priceLabel: PRICE_ON_REQUEST,
    category: "Respiratoire",
    categoryStyle: respiratoryStyle,
    city,
    badges: ["Respiratoire", "Disponible à la vente"],
  };
}

export const respiratoryProducts: Product[] = [
  respiratoryProduct({
    slug: "aspirateur-chirurgical-op-ac05",
    name: "Aspirateur chirurgical électrique OP-AC05",
    shortName: "Aspirateur OP-AC05",
    tagline: "Aspiration médicale mobile pour usage clinique et à domicile.",
    description:
      "Aspirateur chirurgical à haut débit, monté sur roulettes antistatiques pour une utilisation mobile en salle ou à domicile. Régulateur de dépression intégré pour un contrôle précis.",
    extendedDescription:
      "Équipé de deux bocaux de 2 500 ml, il offre une autonomie adaptée aux interventions courtes et aux soins de suction. Compact et maniable, il répond aux besoins des professionnels et des structures de soins.",
    image: "/products/aspirateur-chirurgical-op-ac05.webp",
    alt: "Aspirateur chirurgical électrique OP-AC05 sur roulettes",
    specs: [
      { label: "Débit d'aspiration", value: "30 L/min" },
      { label: "Autonomie", value: "0-30 min" },
      { label: "Poids", value: "11,5 kg" },
    ],
    included: ["2 bocaux 2 500 ml", "Régulateur de dépression", "4 roulettes antistatiques"],
    useCases: [
      { icon: "medical_services", title: "Soins cliniques", description: "Aspiration en cabinet ou à domicile." },
      { icon: "air", title: "Voies respiratoires", description: "Évacuation des sécrétions bronchiques." },
      { icon: "local_hospital", title: "Structures de soins", description: "Usage en petite chirurgie et post-opératoire." },
    ],
    related: [],
    seoTitle: "Achat aspirateur chirurgical OP-AC05 | SOS Santé",
    seoDescription:
      "Achetez un aspirateur chirurgical électrique OP-AC05 au Maroc. Livraison et conseil avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "beurer-nebuliseur-ih-21",
    name: "Beurer Nébuliseur électrique IH 21",
    shortName: "Beurer IH 21",
    tagline: "Nébuliseur à compresseur pour traitements respiratoires à domicile.",
    description:
      "Nébuliseur électrique Beurer à technologie compresseur, conçu pour les traitements des voies respiratoires supérieures et inférieures : rhumes, asthme et affections pulmonaires.",
    extendedDescription:
      "Haute performance de nébulisation pour des séances d'inhalation courtes. Livré avec une gamme d'accessoires et un compartiment de rangement intégré. Produit médical fonctionnant sur secteur.",
    image: "/products/beurer-nebuliseur-ih-21.webp",
    alt: "Nébuliseur électrique Beurer IH 21",
    specs: [
      { label: "Technologie", value: "Compresseur / air comprimé" },
      { label: "Pression de travail", value: "0,8-1,45 bar" },
      { label: "Performance", value: "~0,3 ml/min" },
    ],
    included: ["Accessoires nébulisation", "Compartiment rangement", "Alimentation secteur"],
    useCases: [
      { icon: "air", title: "Asthme", description: "Administration de traitements en aérosol." },
      { icon: "coronavirus", title: "Rhumes & bronchites", description: "Soulagement des voies respiratoires." },
      { icon: "home", title: "Domicile", description: "Utilisation simple au quotidien." },
    ],
    related: [],
    seoTitle: "Achat nébuliseur Beurer IH 21 | SOS Santé",
    seoDescription:
      "Achetez un nébuliseur Beurer IH 21 au Maroc. Livraison rapide avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "beurer-nebuliseur-ih-18",
    name: "Beurer Nébuliseur IH 18",
    shortName: "Beurer IH 18",
    tagline: "Nébuliseur compact pour inhalothérapie à domicile.",
    description:
      "Nébuliseur Beurer à air comprimé, adapté au traitement des voies respiratoires en cas de rhume, asthme ou maladies respiratoires chroniques.",
    extendedDescription:
      "Solution économique et fiable pour les séances d'inhalation à la maison. Léger et facile à entretenir, il convient à toute la famille sous prescription médicale.",
    image: "/products/beurer-nebuliseur-ih-18.webp",
    alt: "Nébuliseur Beurer IH 18",
    specs: [
      { label: "Technologie", value: "Air comprimé" },
      { label: "Usage", value: "Voies respiratoires sup. et inf." },
      { label: "Alimentation", value: "Secteur" },
    ],
    included: ["Kit nébulisation", "Mode d'emploi"],
    useCases: [
      { icon: "child_care", title: "Toute la famille", description: "Inhalations pédiatriques et adultes." },
      { icon: "air", title: "Asthme", description: "Traitements prescrits en aérosol." },
      { icon: "healing", title: "Convalescence", description: "Accompagnement post-infection respiratoire." },
    ],
    related: [],
    seoTitle: "Achat nébuliseur Beurer IH 18 | SOS Santé",
    seoDescription:
      "Achetez un nébuliseur Beurer IH 18 au Maroc. Conseil et livraison avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "concentrateur-5l-silencieux-nebuliseur",
    name: "Concentrateur 5L silencieux avec nébuliseur",
    shortName: "Optimox 5L",
    tagline: "Oxygénothérapie continue 24h/24 avec port nébuliseur intégré.",
    description:
      "Concentrateur d'oxygène 5 L/min performant et silencieux, conçu pour une utilisation continue jour et nuit. Écran LCD, alarme de pureté et tamis moléculaires haute durabilité.",
    extendedDescription:
      "Certifié CE et ISO 13485, l'Optimox-5 combine oxygénothérapie et nébulisation pour un suivi complet à domicile. Référence Optimox-5N disponible en version extra silencieuse.",
    image: "/products/concentrateur-5l-silencieux-nebuliseur.webp",
    alt: "Concentrateur d'oxygène 5L silencieux Optimox avec nébuliseur",
    specs: [
      { label: "Débit", value: "5 L/min" },
      { label: "Usage", value: "24h/24" },
      { label: "Certification", value: "CE, ISO 13485, TÜV SÜD" },
    ],
    included: ["Port nébuliseur", "Écran LCD", "Alarme pureté oxygène"],
    useCases: [
      { icon: "air", title: "Oxygénothérapie longue durée", description: "Apport continu à domicile." },
      { icon: "pulmonology", title: "BPCO", description: "Support quotidien des patients chroniques." },
      { icon: "medication", title: "Nébulisation", description: "Traitements associés sans appareil supplémentaire." },
    ],
    related: [],
    seoTitle: "Achat concentrateur 5L silencieux | SOS Santé",
    seoDescription:
      "Achetez un concentrateur d'oxygène 5L silencieux avec nébuliseur au Maroc. Installation avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "inogen-rove-g6",
    name: "Inogen Rove G6 - concentrateur portable",
    shortName: "Inogen G6",
    tagline: "Concentrateur d'oxygène portable léger pour une vie active.",
    description:
      "Concentrateur d'oxygène portable Inogen Rove G6, ultra-léger (2,6 kg avec batterie double) pour l'oxygénothérapie en débit pulsé de 1 à 6.",
    extendedDescription:
      "Technologie Intelligent Delivery : l'oxygène est délivré à chaque inspiration pour une autonomie optimale. Jusqu'à 13 heures avec batterie 16 cellules. Idéal pour les déplacements et le maintien de l'indépendance.",
    image: "/products/inogen-rove-g6-homme-domicile-v2.webp",
    gallery: [
      "/products/inogen-rove-g6-homme-domicile-v2.webp",
      "/products/inogen-rove-g6.webp",
      "/products/inogen-rove-g6-femme-domicile-v2.webp",
    ],
    alt: "Homme utilisant un concentrateur d'oxygène Inogen Rove G6 à domicile",
    specs: [
      { label: "Poids", value: "2,6 kg (batterie double)" },
      { label: "Débit pulsé", value: "1 à 6" },
      { label: "Autonomie", value: "Jusqu'à 13 h" },
    ],
    included: ["Batterie", "Chargeur", "Sac de transport"],
    useCases: [
      { icon: "directions_walk", title: "Mobilité", description: "Sorties et déplacements libres." },
      { icon: "flight", title: "Voyages", description: "Format compact et léger." },
      { icon: "air", title: "Oxygénothérapie mobile", description: "Jusqu'à 6 L/min en débit pulsé." },
    ],
    related: [],
    seoTitle: "Achat Inogen Rove G6 - concentrateur portable | SOS Santé",
    seoDescription:
      "Achetez un concentrateur d'oxygène portable Inogen G6 au Maroc. Conseil personnalisé SOS Santé.",
  }),
  respiratoryProduct({
    slug: "resmed-airsense-s11-autoset-cpap",
    name: "ResMed AirSense 11 AutoSet CPAP",
    shortName: "AirSense S11",
    tagline: "Appareil CPAP auto-réglant de dernière génération pour l'apnée du sommeil.",
    description:
      "Appareil CPAP ResMed AirSense 11 AutoSet avec réglage automatique de la pression, conçu pour le traitement du syndrome d'apnée obstructive du sommeil (SAOS) à domicile.",
    extendedDescription:
      "Dernière génération ResMed : écran tactile intuitif, bouton Marche/Arrêt unique et algorithme AutoSet (incluant AutoSet for Her) pour adapter la pression tout au long de la nuit. Humidificateur chauffant HumidAir 11 intégré, compatible avec le circuit chauffant ClimateLineAir 11 en option pour un confort optimal. Filtres standard ou hypoallergéniques, diagnostic interne de l'appareil et fonction Care Check-In pour suivre votre adaptation au traitement. Plus léger et plus simple à utiliser au quotidien.",
    image: "/products/resmed-airsense-s11-homme-domicile.webp",
    gallery: [
      "/products/resmed-airsense-s11-homme-domicile.webp",
      "/products/resmed-airsense-s11-femme-domicile.webp",
      "/products/resmed-airsense-s11.webp",
    ],
    alt: "Homme utilisant un appareil CPAP ResMed AirSense S11 à domicile",
    specs: [
      { label: "Type", value: "CPAP AutoSet" },
      { label: "Indication", value: "Apnée obstructive du sommeil (SAOS)" },
      { label: "Interface", value: "Écran tactile" },
    ],
    included: [
      "Humidificateur HumidAir 11 intégré",
      "Filtre à air",
      "Bouton Marche/Arrêt",
      "Care Check-In",
    ],
    useCases: [
      {
        icon: "bedtime",
        title: "Apnée du sommeil",
        description: "Traitement du SAOS avec pression auto-adaptative.",
      },
      {
        icon: "home",
        title: "Usage à domicile",
        description: "Confort et simplicité pour les nuits à la maison.",
      },
      {
        icon: "monitoring",
        title: "Suivi du traitement",
        description: "Outils d'accompagnement et de suivi intégrés.",
      },
    ],
    related: [],
    seoTitle: "Achat ResMed AirSense S11 AutoSet CPAP | SOS Santé",
    seoDescription:
      "Achetez un appareil CPAP ResMed AirSense 11 AutoSet au Maroc pour le traitement de l'apnée du sommeil. Devis et conseil avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "masques-cpap-airfit-resmed",
    name: "Masques CPAP ResMed AirFit",
    shortName: "AirFit",
    tagline: "Gamme de masques CPAP confortables pour une thérapie de l'apnée adaptée à chaque visage.",
    description:
      "Masques CPAP ResMed AirFit : nasal, narinaire ou facial complet, conçus pour s'adapter à la morphologie de chaque patient et assurer une étanchéité fiable avec les appareils CPAP.",
    extendedDescription:
      "La gamme AirFit couvre les principaux profils de respiration : AirFit N20 (nasal), AirFit P10 (coussinets narinaires minimalistes), AirFit F20 (facial complet) et AirTouch (coussin en mousse UltraSoft). Coussins InfinitySeal ou AdaptiSeal en silicone hypoallergénique, cadre souple, sangle confortable et clips magnétiques pour un enfilage rapide. Raccord à déconnexion rapide pour se lever la nuit sans retirer le masque. Ventilation QuietAir sur certains modèles pour un traitement discret. Plusieurs tailles disponibles selon le modèle choisi.",
    image: "/products/masques-cpap-airfit.webp",
    gallery: [
      "/products/masques-cpap-airfit.webp",
      "/products/masque-cpap-airfit-homme-domicile.webp",
      "/products/masque-cpap-airfit-femme-domicile.webp",
    ],
    alt: "Masques CPAP ResMed AirFit F20, N20, P10 et AirTouch",
    specs: [
      { label: "Gamme", value: "F20 · N20 · P10 · AirTouch" },
      { label: "Types", value: "Nasal, narinaire, facial complet" },
      { label: "Compatibilité", value: "Appareils CPAP et VNI ResMed" },
    ],
    included: [
      "Cadre et sangle",
      "Coussin (taille selon modèle)",
      "Raccord à déconnexion rapide",
      "Clips magnétiques",
    ],
    useCases: [
      {
        icon: "bedtime",
        title: "Apnée du sommeil",
        description: "Interface confortable pour la thérapie CPAP nocturne.",
      },
      {
        icon: "face",
        title: "Adaptation morphologique",
        description: "Plusieurs modèles et tailles pour un bon ajustement.",
      },
      {
        icon: "home",
        title: "Confort à domicile",
        description: "Mise en place simple pour un usage quotidien.",
      },
    ],
    related: [],
    seoTitle: "Achat masques CPAP ResMed AirFit | SOS Santé",
    seoDescription:
      "Achetez un masque CPAP ResMed AirFit (F20, N20, P10, AirTouch) au Maroc. Conseil pour choisir le bon modèle avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "lumis-150-vni-resmed",
    name: "Lumis 150 VNI ResMed",
    shortName: "Lumis 150",
    tagline: "Ventilateur non invasif pour pathologies respiratoires obstructives et restrictives.",
    description:
      "Ventilateur non invasif ResMed Lumis 150 VPAP ST, conçu pour les patients non dépendants souffrant de pathologies respiratoires obstructives ou restrictives.",
    extendedDescription:
      "Équipé du mode iVAPS de ResMed, il maintient une ventilation minute cible en tenant compte de l'espace anatomique et ajuste l'aide selon les besoins variables du patient. L'algorithme iBR optimise la synchronisation et le confort. Avec l'AutoEPAP, l'iVAPS surveille les voies aériennes supérieures cycle à cycle pour une ventilation personnalisée. Plateforme Air10 : humidification intégrée, titration facilitée et télésuivi pour un monitorage à distance.",
    image: "/products/lumis-150-vni-resmed-homme-domicile.webp",
    gallery: [
      "/products/lumis-150-vni-resmed-homme-domicile.webp",
      "/products/lumis-150-vni-resmed-femme-sommeil.webp",
      "/products/lumis-150-vni-resmed.webp",
    ],
    alt: "Homme utilisant un appareil Lumis 150 VNI ResMed à domicile",
    specs: [
      { label: "Type", value: "VNI VPAP ST" },
      { label: "Mode", value: "iVAPS avec AutoEPAP" },
      { label: "Plateforme", value: "ResMed Air10" },
    ],
    included: [
      "Humidification intégrée",
      "Module de télésuivi",
      "Mode iVAPS / iBR",
    ],
    useCases: [
      {
        icon: "air",
        title: "Pathologies obstructives",
        description: "Prise en charge des troubles respiratoires obstructifs.",
      },
      {
        icon: "pulmonology",
        title: "Pathologies restrictives",
        description: "Adapté aux insuffisances respiratoires restrictives.",
      },
      {
        icon: "home",
        title: "Usage à domicile",
        description: "Ventilation non invasive pour patients autonomes.",
      },
    ],
    related: [],
    seoTitle: "Achat Lumis 150 VNI ResMed | SOS Santé",
    seoDescription:
      "Achetez un ventilateur non invasif Lumis 150 VNI ResMed au Maroc. Devis, conseil et accompagnement avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "concentrateur-oxygene-10l-optimium",
    name: "Concentrateur d'oxygène 10L Optimium",
    shortName: "Optimium 10L",
    tagline: "Haut débit pour oxygénothérapie intensive à domicile.",
    description:
      "Concentrateur d'oxygène 10 L/min silencieux et robuste, adapté aux patients nécessitant un débit élevé en continu. Écran LCD et alarmes de sécurité intégrées.",
    extendedDescription:
      "Tamis moléculaires durables, certification CE et ISO 13485. Solution fiable pour un usage 24h/24 avec suivi de la pureté de l'oxygène délivré.",
    image: "/products/concentrateur-oxygene-10l-optimium.webp",
    alt: "Concentrateur d'oxygène 10 litres Optimium",
    specs: [
      { label: "Débit", value: "10 L/min" },
      { label: "Fonctionnement", value: "24h/24" },
      { label: "Certification", value: "CE, ISO 13485, TÜV SÜD" },
    ],
    included: ["Écran LCD", "Alarme pureté", "Tubulure"],
    useCases: [
      { icon: "pulmonology", title: "Besoins élevés", description: "Patients nécessitant un débit important." },
      { icon: "home", title: "Domicile", description: "Installation et mise en service à domicile." },
      { icon: "healing", title: "Post-hospitalisation", description: "Transition sécurisée vers le domicile." },
    ],
    related: [],
    seoTitle: "Achat concentrateur oxygène 10L Optimium | SOS Santé",
    seoDescription:
      "Achetez un concentrateur d'oxygène 10L Optimium au Maroc. Livraison et installation SOS Santé.",
  }),
  respiratoryProduct({
    slug: "concentrateur-oxygene-10l-nebuliseur",
    name: "Concentrateur 10L avec nébuliseur",
    shortName: "Concentrateur 10L",
    tagline: "Oxygénothérapie et nébulisation réunies dans un seul appareil.",
    description:
      "Concentrateur d'oxygène 10 L/min avec port de nébulisation intégré, écran LCD et minuterie. Concentration en oxygène de 87 à 95,5 % selon le débit.",
    extendedDescription:
      "Fonctionnement silencieux (55 dB), autodiagnostic et rappel de nettoyage du filtre toutes les 100 heures. Poignée ergonomique pour faciliter les déplacements.",
    image: "/products/concentrateur-oxygene-10l-nebuliseur.webp",
    alt: "Concentrateur d'oxygène 10 litres avec port nébuliseur",
    specs: [
      { label: "Débit", value: "1-10 L/min" },
      { label: "Nébulisation", value: "≥ 0,15 ml/min" },
      { label: "Niveau sonore", value: "55 dB(A)" },
    ],
    included: ["Port nébuliseur", "Écran LCD", "Poignée de transport"],
    useCases: [
      { icon: "air", title: "Oxygénothérapie", description: "Débit réglable selon prescription." },
      { icon: "medication", title: "Aérosols", description: "Nébulisation sans appareil séparé." },
      { icon: "elderly", title: "Maintien à domicile", description: "Solution tout-en-un pour seniors." },
    ],
    related: [],
    seoTitle: "Achat concentrateur 10L avec nébuliseur | SOS Santé",
    seoDescription:
      "Achetez un concentrateur d'oxygène 10L avec nébuliseur au Maroc. SOS Santé livre et installe.",
  }),
  respiratoryProduct({
    slug: "concentrateur-oxygene-5l",
    name: "Concentrateur d'oxygène 5L",
    shortName: "Concentrateur 5L",
    tagline: "Oxygénothérapie fiable pour usage continu à domicile.",
    description:
      "Concentrateur d'oxygène Optimox-5 avec débit maximal de 5 L/min et pureté de 93 à 96 %. Silencieux, robuste et utilisable 24h/24.",
    extendedDescription:
      "Écran LCD, alarme de pureté et tamis moléculaires performants. Solution éprouvée pour l'oxygénothérapie à domicile au Maroc, avec installation par nos techniciens.",
    image: "/products/concentrateur-oxygene-5l.webp",
    alt: "Concentrateur d'oxygène 5L Optimox",
    specs: [
      { label: "Débit max", value: "5 L/min" },
      { label: "Pureté O₂", value: "93-96 %" },
      { label: "Puissance", value: "480 W" },
    ],
    included: ["Tubulure", "Filtre", "Mode d'emploi"],
    useCases: [
      { icon: "air", title: "Oxygénothérapie", description: "Apport d'oxygène continu." },
      { icon: "pulmonology", title: "Insuffisance respiratoire", description: "Suivi des patients BPCO." },
      { icon: "home", title: "Domicile", description: "Confort et discrétion au quotidien." },
    ],
    related: [],
    seoTitle: "Achat concentrateur d'oxygène 5L | SOS Santé",
    seoDescription:
      "Achetez un concentrateur d'oxygène 5L au Maroc. Livraison et mise en service avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "kit-nebulisation-respiratoire",
    name: "Kit de nébulisation respiratoire",
    shortName: "Kit nébulisation",
    tagline: "Accessoire nébuliseur adulte pour traitements en aérosol.",
    description:
      "Kit de nébulisation respiratoire comprenant un masque nébuliseur adulte. Accessoire indispensable pour compléter votre nébuliseur ou concentrateur équipé.",
    extendedDescription:
      "Compatible avec la plupart des appareils de nébulisation du marché. Usage individuel pour une hygiène optimale lors des séances d'inhalation.",
    image: "/products/kit-nebulisation-respiratoire.webp",
    alt: "Kit de nébulisation respiratoire avec masque adulte",
    specs: [
      { label: "Type", value: "Masque nébuliseur adulte" },
      { label: "Usage", value: "Individuel" },
      { label: "Compatibilité", value: "Nébuliseurs standards" },
    ],
    included: ["Masque nébuliseur adulte"],
    useCases: [
      { icon: "medication", title: "Inhalothérapie", description: "Administration de traitements en aérosol." },
      { icon: "air", title: "Entretien", description: "Remplacement régulier des accessoires." },
      { icon: "home", title: "Domicile", description: "Complément pour nébuliseur existant." },
    ],
    related: [],
    seoTitle: "Achat kit nébulisation respiratoire | SOS Santé",
    seoDescription:
      "Achetez un kit de nébulisation respiratoire au Maroc. Livraison rapide SOS Santé.",
  }),
  respiratoryProduct({
    slug: "manodetendeur-barboteur-ox2",
    name: "Manodétendeur barboteur OX2",
    shortName: "Barboteur OX2",
    tagline: "Régulation précise du débit d'oxygène depuis bouteille.",
    description:
      "Barboteur d'oxygène complet avec manodétendeur pour bouteilles OX2. Débitmètre réglable de 1 à 15 L/min et flacon humidificateur 200 ml inclus.",
    extendedDescription:
      "Conforme EN ISO 10079-3, avec manomètre large et lunettes à oxygène adulte. Solution fiable pour hôpitaux, cliniques, ambulances et soins à domicile.",
    image: "/products/manodetendeur-barboteur-ox2.webp",
    alt: "Manodétendeur barboteur d'oxygène OX2",
    specs: [
      { label: "Débit", value: "1-15 L/min" },
      { label: "Humidificateur", value: "200 ml" },
      { label: "Norme", value: "EN ISO 10079-3" },
    ],
    included: ["Lunettes oxygène adulte", "Flacon humidificateur", "Manomètre"],
    useCases: [
      { icon: "local_hospital", title: "Structures médicales", description: "Oxygénothérapie depuis bouteille." },
      { icon: "emergency", title: "Urgences", description: "Débit réglable rapide." },
      { icon: "home", title: "Domicile", description: "Complément aux bouteilles d'oxygène." },
    ],
    related: [],
    seoTitle: "Achat barboteur manodétendeur OX2 | SOS Santé",
    seoDescription:
      "Achetez un manodétendeur barboteur OX2 au Maroc. Livraison avec SOS Santé.",
  }),
  respiratoryProduct({
    slug: "masque-oxygene-haute-concentration",
    name: "Masque oxygène haute concentration",
    shortName: "Masque O₂",
    tagline: "Masque à réservoir pour oxygénation à très haute concentration.",
    description:
      "Masque d'oxygénation adulte avec réservoir et valve anti-retour, pour une administration efficace d'oxygène par voie nasale et orale. Usage unique stérile.",
    extendedDescription:
      "Vinyle souple pour un confort optimal et une bonne étanchéité. Transparent pour permettre la surveillance du patient. Conditionné individuellement.",
    image: "/products/masque-oxygene-haute-concentration.webp",
    alt: "Masque d'oxygène haute concentration adulte",
    specs: [
      { label: "Type", value: "Haute concentration avec réservoir" },
      { label: "Valve", value: "Anti-retour" },
      { label: "Usage", value: "Unique stérile" },
    ],
    included: ["Masque adulte emballé individuellement"],
    useCases: [
      { icon: "air", title: "Oxygénothérapie", description: "Concentration d'oxygène maximale." },
      { icon: "emergency", title: "Urgences", description: "Prise en charge rapide." },
      { icon: "local_hospital", title: "Soins", description: "Usage en cabinet et à domicile." },
    ],
    related: [],
    seoTitle: "Achat masque oxygène haute concentration | SOS Santé",
    seoDescription:
      "Achetez un masque d'oxygène haute concentration au Maroc. SOS Santé.",
  }),
  respiratoryProduct({
    slug: "regulateur-aspiration-sous-vide",
    name: "Régulateur d'aspiration sous vide",
    shortName: "Régulateur aspiration",
    tagline: "Régulation d'aspiration pour réseau de vide médical.",
    description:
      "Régulateur d'aspiration sous vide pour installation murale ou sur réseau central. Contrôle précis du débit d'aspiration pour usage médical.",
    extendedDescription:
      "Équipement robuste adapté aux cabinets, cliniques et chambres équipées d'un réseau de vide. Facilite les soins nécessitant une aspiration contrôlée.",
    image: "/products/regulateur-aspiration-sous-vide.webp",
    alt: "Régulateur d'aspiration sous vide médical",
    specs: [
      { label: "Type", value: "Aspiration sous vide" },
      { label: "Installation", value: "Mural / réseau" },
      { label: "Usage", value: "Médical" },
    ],
    included: ["Régulateur", "Fixations"],
    useCases: [
      { icon: "medical_services", title: "Cabinets", description: "Aspiration en consultation." },
      { icon: "local_hospital", title: "Cliniques", description: "Réseau de vide centralisé." },
      { icon: "air", title: "Soins respiratoires", description: "Évacuation des sécrétions." },
    ],
    related: [],
    seoTitle: "Achat régulateur aspiration sous vide | SOS Santé",
    seoDescription:
      "Achetez un régulateur d'aspiration sous vide au Maroc. SOS Santé.",
  }),
  respiratoryProduct({
    slug: "rossmax-nebuliseur-na100",
    name: "Rossmax NA100 - nébuliseur à piston",
    shortName: "Rossmax NA100",
    tagline: "Nébuliseur à compresseur pour inhalothérapie efficace.",
    description:
      "Nébuliseur à piston Rossmax NA100 avec technologie VAT pour une nébulisation fine et constante. MMAD ~2,2 µm pour une meilleure pénétration pulmonaire.",
    extendedDescription:
      "Livré avec masques adulte et enfant, embout buccal et compartiment accessoires. Idéal pour asthme, BPCO et traitements respiratoires à domicile ou en centre de santé.",
    image: "/products/rossmax-nebuliseur-na100.webp",
    alt: "Nébuliseur à piston Rossmax NA100",
    specs: [
      { label: "MMAD", value: "~2,2 µm" },
      { label: "Débit nébulisation", value: "> 0,35 ml/min" },
      { label: "FPD", value: "80-85 %" },
    ],
    included: ["Masque adulte", "Masque enfant", "Embout buccal", "Tubulure"],
    useCases: [
      { icon: "pulmonology", title: "BPCO & asthme", description: "Traitements en aérosol efficaces." },
      { icon: "child_care", title: "Pédiatrie", description: "Masque enfant inclus." },
      { icon: "home", title: "Domicile", description: "Séances rapides et sécurisées." },
    ],
    related: [],
    seoTitle: "Achat Rossmax NA100 - nébuliseur à piston | SOS Santé",
    seoDescription:
      "Achetez un nébuliseur Rossmax NA100 au Maroc. Livraison SOS Santé.",
  }),
  respiratoryProduct({
    slug: "spirometre-peak-flow",
    name: "Spiromètre Peak Flow à billes",
    shortName: "Peak Flow",
    tagline: "Mesure de la capacité inspiratoire pour suivi asthme.",
    description:
      "Spiromètre Peak Flow à billes avec 3 chambres (600, 900 et 1 200 cc/s) pour évaluer la capacité inspiratoire. PVC transparent, usage individuel.",
    extendedDescription:
      "Outil de suivi simple pour patients asthmatiques et personnes suivant leur fonction respiratoire à domicile. Billes de couleurs selon le niveau atteint.",
    image: "/products/spirometre-peak-flow.webp",
    alt: "Spiromètre Peak Flow à billes inspiration",
    specs: [
      { label: "Chambres", value: "600 / 900 / 1 200 cc/s" },
      { label: "Matériau", value: "PVC transparent" },
      { label: "Usage", value: "Individuel" },
    ],
    included: ["Spiromètre Peak Flow", "Mode d'emploi"],
    useCases: [
      { icon: "monitoring", title: "Suivi asthme", description: "Contrôle quotidien de la fonction pulmonaire." },
      { icon: "air", title: "Rééducation", description: "Exercices inspiratoires guidés." },
      { icon: "home", title: "Autonomie", description: "Surveillance simple à domicile." },
    ],
    related: [],
    seoTitle: "Achat spiromètre Peak Flow | SOS Santé",
    seoDescription:
      "Achetez un spiromètre Peak Flow à billes au Maroc. SOS Santé.",
  }),
];
