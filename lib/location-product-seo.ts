import type { Product } from "@/lib/product-types";
import { frenchDe, normalizePublicDash } from "@/lib/french";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import {
  formatZonesLine,
  getCityProductOverlay,
} from "@/lib/city-product-overlay";

const SEO_TITLE_SUFFIX = " | SOS Santé";

/** Meta title: product + city + brand. */
export function formatLocationProductMetaTitle(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  return normalizePublicDash(
    `${normalizePublicDash(productName)} location ${city.name}${SEO_TITLE_SUFFIX}`
  );
}

export function formatLocationProductMetaDescription(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  const overlay = getCityProductOverlay(citySlug);
  const product = normalizePublicDash(productName);
  return `SOS Santé Maroc vous aide à louer ${product} à ${city.name} selon disponibilité (${overlay.zonesLabel}). Demandez un devis et une orientation rapide.`;
}

export function formatLocationProductH1(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  return normalizePublicDash(
    `Location ${frenchDe(normalizePublicDash(productName))} à ${city.name}`
  );
}

export function formatLocationProductIntro(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  const overlay = getCityProductOverlay(citySlug);
  const product = normalizePublicDash(productName);
  return `${overlay.locationLead} Pour ${product}, nous vérifions les options disponibles auprès de fournisseurs partenaires à ${city.name} et vous accompagnons pour le devis, la durée et la livraison selon disponibilité. ${overlay.opsNote} ${overlay.deliveryNote}`;
}

export function formatLocationProductCta(citySlug: CitySlug): string {
  const city = getCityBySlug(citySlug)!;
  return `Demander une location à ${city.name}`;
}

export function formatLocationProductAvailabilityCta(citySlug: CitySlug): string {
  const city = getCityBySlug(citySlug)!;
  return `Vérifier la disponibilité à ${city.name}`;
}

export function formatLocationProductBreadcrumbLabel(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  return normalizePublicDash(
    `${normalizePublicDash(productName)} location ${city.name}`
  );
}

export function formatLocationProductZonesLine(citySlug: CitySlug): string {
  return formatZonesLine(citySlug);
}

export function getLocationProductTrustSignals(citySlug: CitySlug) {
  const city = getCityBySlug(citySlug)!;
  const overlay = getCityProductOverlay(citySlug);
  return [
    {
      icon: "local_shipping",
      title: `Livraison à ${city.name}`,
      text: overlay.locationDeliveryDetail,
    },
    {
      icon: "handshake",
      title: "Coordination location",
      text: overlay.opsNote,
    },
    {
      icon: "support_agent",
      title: "Devis sur demande",
      text: `Un conseiller étudie votre besoin de location à ${city.name} et vous oriente selon disponibilité.`,
    },
    {
      icon: "event_repeat",
      title: "Durée adaptable",
      text: `La durée de location à ${city.name} est précisée selon votre besoin et la disponibilité du matériel.`,
    },
  ];
}

export function getLocationProductFaqs(
  productName: string,
  citySlug: CitySlug
): { question: string; answer: string }[] {
  const overlay = getCityProductOverlay(citySlug);
  const product = normalizePublicDash(productName);

  const byCity: Record<CitySlug, { question: string; answer: string }[]> = {
    agadir: [
      {
        question: `La location de ${product} part-elle du local d'Agadir ?`,
        answer: `La coordination se fait depuis le local Agadir, mais le matériel vient des stocks partenaires. Nous confirmons d'abord ce qui est louable (Agadir, Inezgane, Aït Melloul…) avant tout engagement.`,
      },
      {
        question: `Comment estimer la durée de location à Agadir ?`,
        answer: `Indiquez la période souhaitée (quelques jours, semaines…). Le devis précise la durée possible selon disponibilité ; vous pouvez ajuster ensuite avec le conseiller.`,
      },
      {
        question: `Récupère-t-on le matériel après location vers Taghazout ?`,
        answer: overlay.locationDeliveryDetail,
      },
      {
        question: `Louer via SOS Santé Agadir, est-ce un service hospitalier ?`,
        answer:
          "Non. La location est une coordination de matériel. SOS Santé Agadir n'est pas un hôpital, une pharmacie ou une clinique.",
      },
      {
        question: `Que se passe-t-il si ${product} n'est plus libre à Agadir ?`,
        answer: `Nous cherchons une date ultérieure ou un équivalent chez un partenaire. Si rien ne convient, vous n'êtes pas engagé.`,
      },
    ],
    casablanca: [
      {
        question: `Puis-je réserver ${product} pour un week-end à Casablanca ?`,
        answer: `Oui, vous pouvez demander une location courte. Le local Casablanca vérifie auprès des partenaires si le créneau est possible ; confirmation seulement selon disponibilité réelle.`,
      },
      {
        question: `Le devis de location Casa inclut-il la récupération ?`,
        answer: `Les modalités (livraison, récupération, zone Maarif/Anfa/Sidi Maarouf…) sont précisées dans le devis. Rien n'est inclus d'office sans validation du besoin.`,
      },
      {
        question: `Livraison possible vers Ain Sebaâ ou Californie en location ?`,
        answer: overlay.locationDeliveryDetail,
      },
      {
        question: `Le Boulevard Anoual est-il une clinique de location ?`,
        answer:
          "Non. C'est un local de coordination matériel. SOS Santé Casablanca ne remplace ni clinique, ni pharmacie, ni service d'urgence.",
      },
      {
        question: `Comment lancer une location de ${product} en métropole ?`,
        answer: `Formulaire ou WhatsApp avec « je suis de Casablanca », la durée souhaitée et votre quartier. Nous vérifions les options puis revenons avec un devis selon disponibilité.`,
      },
    ],
    rabat: [
      {
        question: `La location à Rabat nécessite-t-elle un local sur place ?`,
        answer: `Non. Pour Rabat–Salé–Témara, la demande est coordonnée via le numéro national Casablanca. Pas besoin de vous déplacer pour démarrer la demande de location.`,
      },
      {
        question: `Peut-on louer ${product} seulement pour Salé ou Témara ?`,
        answer: `Oui, précisez la ville. Le devis tient compte de la zone (Salé, Témara, Hay Riad…) et de la disponibilité des partenaires — sans promesse de stock immédiat.`,
      },
      {
        question: `Qui gère la récupération du matériel après location à Rabat ?`,
        answer: overlay.locationDeliveryDetail,
      },
      {
        question: `SOS Santé propose-t-il des soins pendant la location à Rabat ?`,
        answer:
          "Non. La fiche location concerne uniquement le matériel. Les soins ou l'aide à domicile sont des services séparés de coordination, pas des actes réalisés par SOS Santé.",
      },
      {
        question: `Quelles infos envoyer pour louer ${product} depuis Agdal ?`,
        answer: `Produit, durée approximative, et zone (Agdal, Hassan, Salé…). WhatsApp ou formulaire avec « je suis de Rabat » lance la vérification.`,
      },
    ],
    marrakech: [
      {
        question: `Peut-on louer ${product} pour un séjour à Hivernage ?`,
        answer: `Oui, vous pouvez demander une location pour un séjour. Nous cherchons auprès de partenaires autour de Guéliz, Hivernage ou Médina ; confirmation uniquement selon disponibilité.`,
      },
      {
        question: `Le devis location Marrakech est-il sans engagement ?`,
        answer: `Oui. Le premier devis clarifie durée, zone et options. Vous validez ensuite seulement si la proposition convient.`,
      },
      {
        question: `Livraison et reprise possibles vers Massira ?`,
        answer: overlay.locationDeliveryDetail,
      },
      {
        question: `Louer du matériel à Marrakech via SOS Santé, est-ce médical ?`,
        answer:
          "La location de matériel n'est pas un acte médical. SOS Santé Marrakech coordonne l'équipement ; aucun diagnostic ni traitement n'est fourni.",
      },
      {
        question: `Comment demander ${product} en location depuis la Médina ?`,
        answer: `Message WhatsApp ou formulaire : « je suis de Marrakech », le matériel et la durée. Nous vérifions les partenaires et proposons un devis selon disponibilité.`,
      },
    ],
    tanger: [
      {
        question: `La location de ${product} est-elle possible hors centre-ville à Tanger ?`,
        answer: `Oui pour Malabata, Boukhalef et environs, sous réserve de disponibilité. La coordination passe par le numéro national Casablanca, sans magasin Tanger dédié.`,
      },
      {
        question: `Faut-il avancer un acompte pour louer à Tanger ?`,
        answer: `Les conditions (acompte éventuel, durée, récupération) sont précisées après devis. Rien n'est demandé avant clarification du besoin et des options disponibles.`,
      },
      {
        question: `Qui livre et reprend ${product} vers Iberia ?`,
        answer: overlay.locationDeliveryDetail,
      },
      {
        question: `SOS Santé Tanger loue-t-il comme une pharmacie ?`,
        answer:
          "Non. Pas de comptoir pharmaceutique. Nous coordonnons la location de matériel médical via des fournisseurs partenaires uniquement.",
      },
      {
        question: `Que préciser pour une location urgente à Tanger ?`,
        answer: `Le produit, la date de besoin, et votre zone. Mentionnez « je suis de Tanger » : nous cherchons d'abord ce qui est réellement disponible, sans promesse de délai fixe.`,
      },
    ],
  };

  return byCity[citySlug];
}


export function isSensitiveLocationProduct(product: Product): boolean {
  const slug = product.slug.toLowerCase();
  return (
    slug.includes("oxygene") ||
    slug.includes("concentrateur") ||
    product.name.toLowerCase().includes("oxygène")
  );
}
