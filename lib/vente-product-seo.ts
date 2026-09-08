import type { Product } from "@/lib/product-types";
import { frenchDe, normalizePublicDash } from "@/lib/french";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import {
  formatZonesLine,
  getCityProductOverlay,
} from "@/lib/city-product-overlay";

const SEO_TITLE_SUFFIX = " | SOS Santé";

const SENSITIVE_SLUG_MARKERS = [
  "aspirateur-chirurgical",
  "defibrillateur",
  "sterilisateur",
  "autoclave",
] as const;

export function isSensitiveVenteProduct(product: Product): boolean {
  const slug = product.slug.toLowerCase();
  if (SENSITIVE_SLUG_MARKERS.some((marker) => slug.includes(marker))) {
    return true;
  }
  return product.name.toLowerCase().includes("chirurgical");
}

/** Meta title: product + city + brand. */
export function formatVenteProductMetaTitle(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  return normalizePublicDash(
    `${normalizePublicDash(productName)} ${city.name}${SEO_TITLE_SUFFIX}`
  );
}

export function formatVenteProductMetaDescription(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  const overlay = getCityProductOverlay(citySlug);
  const product = normalizePublicDash(productName);
  return `SOS Santé Maroc vous aide à trouver ${product} à ${city.name} selon disponibilité (${overlay.zonesLabel}). Demandez un devis et une orientation rapide.`;
}

/** H1 with clear city targeting. */
export function formatVenteProductH1(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  return normalizePublicDash(
    `Achat ${frenchDe(normalizePublicDash(productName))} à ${city.name}`
  );
}

export function formatVenteProductIntro(
  productName: string,
  citySlug: CitySlug,
  options?: { sensitive?: boolean }
): string {
  const city = getCityBySlug(citySlug)!;
  const overlay = getCityProductOverlay(citySlug);
  const product = normalizePublicDash(productName);
  const base = `${overlay.venteLead} Pour ${product}, notre équipe vérifie les options auprès de fournisseurs partenaires à ${city.name} et vous accompagne pour le devis, la livraison ou l'orientation adaptée. ${overlay.opsNote} ${overlay.deliveryNote}`;
  if (!options?.sensitive) return base;
  return `${base} Utilisation réservée aux professionnels qualifiés ou selon recommandation médicale.`;
}

export function formatVenteProductCta(citySlug: CitySlug): string {
  const city = getCityBySlug(citySlug)!;
  return `Demander le prix à ${city.name}`;
}

export function formatVenteProductAvailabilityCta(citySlug: CitySlug): string {
  const city = getCityBySlug(citySlug)!;
  return `Vérifier la disponibilité à ${city.name}`;
}

export function formatVenteProductBreadcrumbLabel(
  productName: string,
  citySlug: CitySlug
): string {
  const city = getCityBySlug(citySlug)!;
  return normalizePublicDash(`${normalizePublicDash(productName)} ${city.name}`);
}

export function formatVenteProductZonesLine(citySlug: CitySlug): string {
  return formatZonesLine(citySlug);
}

export function getVenteProductTrustSignals(citySlug: CitySlug) {
  const city = getCityBySlug(citySlug)!;
  const overlay = getCityProductOverlay(citySlug);
  return [
    {
      icon: "local_shipping",
      title: `Livraison à ${city.name}`,
      text: overlay.venteDeliveryDetail,
    },
    {
      icon: "handshake",
      title: "Mise en relation",
      text: overlay.opsNote,
    },
    {
      icon: "support_agent",
      title: "Devis sur demande",
      text: `Un conseiller étudie votre besoin à ${city.name} et vous oriente selon disponibilité.`,
    },
    {
      icon: "verified",
      title: "Orientation prudente",
      text: "SOS Santé n'est pas une pharmacie ni une clinique : service de coordination au Maroc.",
    },
  ];
}

export function getVenteProductFaqs(
  productName: string,
  citySlug: CitySlug
): { question: string; answer: string }[] {
  const overlay = getCityProductOverlay(citySlug);
  const product = normalizePublicDash(productName);

  const byCity: Record<CitySlug, { question: string; answer: string }[]> = {
    agadir: [
      {
        question: `Peut-on vérifier le stock de ${product} à Agadir avant d'acheter ?`,
        answer: `Oui. Depuis le local SOS Santé Agadir, nous consultons les options disponibles auprès de fournisseurs partenaires (Agadir, Inezgane, Aït Melloul…). Aucune garantie de stock immédiat : tout dépend de la disponibilité du moment.`,
      },
      {
        question: `Comment obtenir un devis d'achat depuis Agadir ?`,
        answer: `Envoyez le formulaire ou un message WhatsApp en indiquant que vous êtes à Agadir. Un conseiller précise le besoin, compare les options et vous renvoie un devis selon disponibilité.`,
      },
      {
        question: `Livrez-vous ${product} vers Anza, Taghazout ou Aït Melloul ?`,
        answer: overlay.venteDeliveryDetail,
      },
      {
        question: `SOS Santé Agadir vend-il directement en pharmacie ?`,
        answer:
          "Non. SOS Santé Agadir n'est ni une pharmacie ni une clinique. Nous coordonnons l'orientation et la mise en relation avec des fournisseurs partenaires pour l'achat de matériel.",
      },
      {
        question: `Que faire si le modèle exact n'est pas disponible à Agadir ?`,
        answer: `Nous cherchons une alternative équivalente auprès des partenaires, ou nous vous orientons vers une autre option adaptée. Vous restez libre d'accepter ou non après le devis.`,
      },
    ],
    casablanca: [
      {
        question: `${product} est-il prêt à partir depuis Casablanca ?`,
        answer: `Pas automatiquement. Le local Casablanca (Boulevard Anoual) sert de point de coordination : nous vérifions d'abord les stocks partenaires dans la métropole (Maarif, Anfa, Sidi Maarouf…). La suite se fait selon disponibilité.`,
      },
      {
        question: `Puis-je demander un prix ferme pour ${product} à Casa ?`,
        answer: `Vous pouvez demander un devis. Le prix et les conditions sont confirmés après étude du besoin et des options réellement disponibles à Casablanca — pas de tarif affiché comme stock permanent.`,
      },
      {
        question: `La livraison couvre-t-elle Ain Diab, Californie ou Hay Hassani ?`,
        answer: overlay.venteDeliveryDetail,
      },
      {
        question: `Le local Casablanca est-il un cabinet médical ?`,
        answer:
          "Non. Le local Casablanca gère matériel et coordination. SOS Santé n'est pas un cabinet médical, une pharmacie ou un hôpital : nous orientons vers des fournisseurs partenaires.",
      },
      {
        question: `Comment démarrer un achat de ${product} en métropole ?`,
        answer: `Indiquez votre quartier Casablanca via le formulaire ou WhatsApp (« je suis de Casablanca »). Nous vérifions les options partenaires puis vous accompagnons pour le devis et la suite.`,
      },
    ],
    rabat: [
      {
        question: `Faut-il se déplacer à Rabat pour commander ${product} ?`,
        answer: `Non. Pour Rabat–Salé–Témara, la demande passe par le numéro national Casablanca. Nous vérifions les options partenaires à distance et vous rappelons selon disponibilité — sans visite obligatoire.`,
      },
      {
        question: `Un devis pour ${product} à Rabat engage-t-il immédiatement ?`,
        answer: `Non. Le devis sert à clarifier le besoin (Hay Riad, Agdal, Salé, Témara…). Vous décidez après réception des options disponibles.`,
      },
      {
        question: `Peut-on livrer ${product} entre Rabat et Témara ?`,
        answer: overlay.venteDeliveryDetail,
      },
      {
        question: `SOS Santé remplace-t-il une pharmacie à Rabat ?`,
        answer:
          "Non. À Rabat comme ailleurs, SOS Santé est un service de coordination : pas de vente en officine, pas de diagnostic, pas de soins médicaux réalisés par nos équipes.",
      },
      {
        question: `Quelle info donner pour un achat depuis Salé ou Témara ?`,
        answer: `Précisez la ville (Rabat, Salé ou Témara), le produit souhaité et votre contrainte de délai. WhatsApp ou formulaire suffisent pour lancer la vérification de disponibilité.`,
      },
    ],
    marrakech: [
      {
        question: `Où trouver ${product} autour de Guéliz ou Hivernage ?`,
        answer: `SOS Santé ne tient pas un magasin ouvert à Marrakech. Nous recherchons ${product} auprès de partenaires desservant Guéliz, Hivernage, Médina ou Massira, puis nous vous orientons selon ce qui est réellement disponible.`,
      },
      {
        question: `Le devis Marrakech est-il valable sans visite ?`,
        answer: `Oui, le premier échange se fait à distance via le numéro national Casablanca. Un devis est préparé après clarification du besoin ; aucune visite magasin n'est requise pour démarrer.`,
      },
      {
        question: `Livraison possible vers la Médina ou Sidi Ghanem ?`,
        answer: overlay.venteDeliveryDetail,
      },
      {
        question: `SOS Santé Marrakech est-il un hôpital ou une clinique ?`,
        answer:
          "Non. À Marrakech, SOS Santé coordonne matériel et orientation uniquement. Aucun service hospitalier, aucune pharmacie, aucun cabinet médical.",
      },
      {
        question: `Comment signaler que je cherche ${product} à Marrakech ?`,
        answer: `Écrivez sur WhatsApp ou le formulaire : « je suis de Marrakech » + le produit. Nous vérifions les options partenaires et revenons avec une orientation de devis selon disponibilité.`,
      },
    ],
    tanger: [
      {
        question: `Peut-on commander ${product} depuis Malabata ou Boukhalef ?`,
        answer: `Oui, la demande peut partir de Tanger et sa région. Nous coordonnons via le numéro national Casablanca, vérifions les partenaires, puis proposons un devis selon disponibilité — sans stock affiché comme permanent.`,
      },
      {
        question: `Combien de temps pour un devis d'achat à Tanger ?`,
        answer: `Dès que le besoin est clair (produit, zone, délai), un conseiller traite la demande. Le délai de rappel dépend de la charge et des réponses partenaires ; rien n'est garanti en minutes fixes.`,
      },
      {
        question: `La livraison monte-t-elle jusqu'à Iberia ou California ?`,
        answer: overlay.venteDeliveryDetail,
      },
      {
        question: `SOS Santé Tanger délivre-t-il des médicaments ?`,
        answer:
          "Non. Nous ne sommes ni pharmacie ni clinique. À Tanger, le service se limite à la coordination et à l'orientation vers des fournisseurs de matériel médical partenaires.",
      },
      {
        question: `Que préparer avant de demander ${product} à Tanger ?`,
        answer: `Le nom du matériel, votre zone (centre, Malabata, Boukhalef…) et si l'achat est urgent ou flexible. Formulaire ou WhatsApp avec « je suis de Tanger » suffit pour lancer la recherche.`,
      },
    ],
  };

  return byCity[citySlug];
}

