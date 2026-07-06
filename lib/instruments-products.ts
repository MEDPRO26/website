import type { Product } from "@/lib/product-types";
import { PRICE_ON_REQUEST } from "@/lib/respiratory-products";

const instrumentsStyle = "bg-white text-secondary shadow-sm";
const city = "Agadir";

function instrumentProduct(
  data: Omit<Product, "category" | "categoryStyle" | "city" | "badges" | "priceLabel">
): Product {
  return {
    ...data,
    priceLabel: PRICE_ON_REQUEST,
    category: "Instruments",
    categoryStyle: instrumentsStyle,
    city,
    badges: ["Instruments", "Disponible à la vente"],
  };
}

export const instrumentsProducts: Product[] = [
  instrumentProduct({
    slug: "sterilisateur-air-chaud",
    name: "Stérilisateur à air chaud",
    shortName: "Stérilisateur air chaud",
    tagline: "Étuve de stérilisation à air chaud pour instruments réutilisables.",
    description:
      "Stérilisateur à air chaud avec structure interne en inox, étagères réglables et ventilation pour une diffusion homogène de la chaleur.",
    extendedDescription:
      "Boîtier externe en inox, fermeture sécurisée et commande digitale. Différentes capacités peuvent être proposées selon les modèles (environ 20 L, 60 L ou 120 L). Contactez-nous pour le modèle adapté à votre activité et un devis détaillé.",
    image: "/products/sterilisateur-air-chaud.webp",
    alt: "Stérilisateur à air chaud pour instruments médicaux",
    specs: [
      { label: "Type", value: "Stérilisation à air chaud" },
      { label: "Structure", value: "Inox" },
      { label: "Capacité", value: "Selon modèle" },
    ],
    included: [
      "Stérilisateur à air chaud",
      "Étagères réglables",
      "Manuel d'utilisation",
    ],
    useCases: [
      {
        icon: "medical_services",
        title: "Cabinet médical",
        description: "Stérilisation d'instruments réutilisables.",
      },
      {
        icon: "local_hospital",
        title: "Clinique & laboratoire",
        description: "Équipement pour environnements exigeants.",
      },
      {
        icon: "verified",
        title: "Conformité",
        description: "À utiliser selon les protocoles et normes applicables.",
      },
    ],
    related: [],
    seoTitle: "Achat stérilisateur à air chaud | SOS Santé",
    seoDescription:
      "Stérilisateur à air chaud pour instruments médicaux au Maroc. Devis sur demande.",
  }),
  instrumentProduct({
    slug: "autoclave-sterilisation-vapeur",
    name: "Autoclave stérilisation à la vapeur",
    shortName: "Autoclave vapeur",
    tagline: "Autoclave automatique pour la stérilisation à la vapeur.",
    description:
      "Autoclave à stérilisation par la vapeur avec chambre et porte en acier inoxydable, cycles préprogrammés et écran LCD de suivi.",
    extendedDescription:
      "Équipement automatique conçu pour la stérilisation de matériel emballé ou non emballé selon les cycles disponibles. Des capacités d'environ 18 L ou 23 L peuvent être proposées selon les références. Contactez-nous pour connaître le modèle disponible et obtenir un devis.",
    image: "/products/autoclave-sterilisation-vapeur.webp",
    alt: "Autoclave de stérilisation à la vapeur",
    specs: [
      { label: "Type", value: "Stérilisation à la vapeur" },
      { label: "Chambre", value: "Inox" },
      { label: "Capacité", value: "Selon modèle (≈ 18 L ou 23 L)" },
    ],
    included: ["Autoclave stérilisation vapeur", "Manuel d'utilisation"],
    useCases: [
      {
        icon: "medical_services",
        title: "Cabinet & clinique",
        description: "Stérilisation d'instruments et de dispositifs réutilisables.",
      },
      {
        icon: "local_hospital",
        title: "Structures de soins",
        description: "Usage professionnel avec cycles préprogrammés.",
      },
      {
        icon: "verified",
        title: "Protocoles",
        description: "À utiliser selon les recommandations du fabricant.",
      },
    ],
    related: [],
    seoTitle: "Achat autoclave stérilisation vapeur | SOS Santé",
    seoDescription:
      "Autoclave de stérilisation à la vapeur pour usage médical au Maroc. Devis sur demande.",
  }),
];
