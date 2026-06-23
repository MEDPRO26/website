export type PricingRow = {
  name: string;
  description: string;
  note?: string;
  price: string;
  unit: string;
};

export const materialPricing: PricingRow[] = [
  {
    name: "Lit médicalisé électrique",
    description: "Livraison et installation incluses à Agadir.",
    price: "Sur devis",
    unit: "à la journée",
  },
  {
    name: "Fauteuil roulant léger",
    description: "Modèle pliable, intérieur et extérieur.",
    price: "À partir de 25 DH",
    unit: "par jour",
  },
  {
    name: "Concentrateur d'oxygène",
    description: "Appareil silencieux, débit réglable.",
    price: "Sur devis",
    unit: "à la journée",
  },
  {
    name: "Matelas anti-escarres",
    description: "Système à air motorisé.",
    price: "À partir de 15 DH",
    unit: "par jour",
  },
  {
    name: "Table de lit inclinable",
    description: "Repas et lecture en position allongée.",
    price: "À partir de 5 DH",
    unit: "par jour",
  },
  {
    name: "Soulève-malade électrique",
    description: "Transfert sécurisé avec sangle.",
    price: "Sur devis",
    unit: "à la journée",
  },
  {
    name: "Rollator 4 roues",
    description: "Avec siège de repos et freins.",
    price: "Sur devis",
    unit: "par jour",
  },
];

export const careServicePricing: PricingRow[] = [
  {
    name: "Infirmier à domicile",
    description: "Injections, pansements, perfusions, suivi des constantes.",
    note: "Tarif selon type de soin et durée.",
    price: "Sur devis",
    unit: "par prestation",
  },
  {
    name: "Aide-soignante",
    description: "Toilette, habillage, aide à la mobilité, surveillance.",
    note: "Forfaits journée et nuit disponibles.",
    price: "Sur devis",
    unit: "par heure ou forfait",
  },
  {
    name: "Kinésithérapeute",
    description: "Rééducation motrice, respiratoire ou neurologique.",
    note: "Séances à domicile sur prescription possible.",
    price: "Sur devis",
    unit: "par séance",
  },
];

export const includedServices = [
  "Livraison et installation à Agadir",
  "Désinfection complète du matériel",
  "Entretien et vérification technique",
  "Conseil personnalisé par téléphone",
  "Assistance pendant toute la location",
];
