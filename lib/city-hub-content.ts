import { getCareServicesForCity } from "@/lib/care-services";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import { venteCityPath } from "@/lib/routes";

export type CityHubService = {
  icon: string;
  title: string;
  description: string;
  href?: string;
  badge?: string;
};

export type CityHubContent = {
  badgeLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  equipmentIntro: string;
  careIntro: string;
  paragraphs: string[];
  equipmentServices: CityHubService[];
  careServices: CityHubService[];
  equipmentHighlights: {
    icon: string;
    title: string;
    description: string;
    categoryParam: string;
  }[];
  faqs: { question: string; answer: string }[];
};

function buildKeywords(cityName: string): string[] {
  return [
    `location matériel médical ${cityName}`,
    `vente matériel médical ${cityName}`,
    `matériel médical à domicile ${cityName}`,
    `lit médicalisé ${cityName}`,
    `fauteuil roulant ${cityName}`,
    `concentrateur oxygène ${cityName}`,
    `aide à domicile ${cityName}`,
    `kinésithérapie à domicile ${cityName}`,
    `infirmier à domicile ${cityName}`,
    `médecin à domicile ${cityName}`,
    `ambulance ${cityName}`,
    `matelas anti-escarres ${cityName}`,
  ];
}

const cityCopy: Partial<
  Record<
    CitySlug,
    Pick<
      CityHubContent,
      "intro" | "equipmentIntro" | "careIntro" | "paragraphs"
    >
  >
> = {
  agadir: {
    intro:
      "SOS Santé Agadir accompagne les familles à Agadir et dans la région Souss-Massa : vente et location de matériel médical à domicile, et mise en relation avec des professionnels de soins et d'aide à domicile.",
    equipmentIntro:
      "Achetez ou louez du matériel médical à Agadir : lits médicalisés, fauteuils roulants, concentrateurs d'oxygène, matelas anti-escarres et matériel de diagnostic. Livraison locale dans les communes environnantes.",
    careIntro:
      "Besoin de soins ou d'aide à domicile à Agadir ? SOS Santé vous oriente vers des professionnels qualifiés : kinésithérapeute, infirmier, médecin, aide-soignant et transport médical.",
    paragraphs: [
      "Que vous recherchiez un lit médicalisé, un fauteuil roulant, un concentrateur d'oxygène ou du matériel de diagnostic, notre équipe vous conseille et organise la livraison à Agadir, Inezgane, Aït Melloul, Dcheira, Anza, Taghazout et environs.",
      "Pour les soins à domicile, nous facilitons la mise en relation avec des professionnels de santé adaptés à votre situation. SOS Santé Agadir agit comme intermédiaire entre les familles et les prestataires locaux.",
    ],
  },
  rabat: {
    intro:
      "SOS Santé Rabat accompagne les familles à Rabat, Salé et Temara : vente et location de matériel médical à domicile, et mise en relation avec des professionnels de soins et d'aide à domicile.",
    equipmentIntro:
      "Achetez ou louez du matériel médical à Rabat : mobilité, respiratoire, confort, diagnostic et instruments. Livraison à Rabat, Salé, Temara et environs. Délai sous 24h.",
    careIntro:
      "Besoin de soins ou d'aide à domicile à Rabat ? SOS Santé vous oriente vers des professionnels qualifiés : kinésithérapeute, infirmier, médecin, aide-soignant et transport médical.",
    paragraphs: [
      "Notre catalogue couvre le matériel de mobilité, respiratoire, confort, diagnostic et instruments médicaux. Livraison à Rabat, Salé, Temara, Hay Riad, Agdal, Souissi et environs.",
      "Pour l'aide à domicile, nous mettons en relation les patients et les familles avec des professionnels de santé qualifiés. Devis et orientation personnalisés par notre équipe locale.",
    ],
  },
};

export function getCityHubContent(citySlug: CitySlug): CityHubContent {
  const city = getCityBySlug(citySlug)!;
  const copy = cityCopy[citySlug];
  const cityLabel = city.name;

  return {
    badgeLabel: `${city.brandName} - Matériel Médical & Aide à Domicile`,
    metaTitle: `Location et vente matériel médical à ${cityLabel} | Aide à domicile`,
    metaDescription: `${city.brandName} : location et vente de matériel médical à domicile à ${cityLabel}. Lits médicalisés, fauteuils roulants, oxygène. Kinésithérapie, infirmier, médecin, aide-soignant, ambulance. ${city.deliveryText}`,
    keywords: buildKeywords(cityLabel),
    intro:
      copy?.intro ??
      `SOS Santé ${cityLabel} : matériel médical à domicile et aide à domicile. ${city.deliveryText}`,
    equipmentIntro:
      copy?.equipmentIntro ??
      `Vente et location de matériel médical à ${cityLabel}. Livraison locale selon votre zone.`,
    careIntro:
      copy?.careIntro ??
      `Soins et aide à domicile à ${cityLabel} : kinésithérapie, infirmier, médecin, aide-soignant, ambulance.`,
    paragraphs: copy?.paragraphs ?? [
      `Matériel médical à domicile à ${cityLabel} : mobilité, respiratoire, confort, diagnostic et instruments.`,
      `Aide à domicile à ${cityLabel} : orientation vers des professionnels de santé qualifiés.`,
    ],
    equipmentServices: [
      {
        icon: "shopping_bag",
        title: "Vente de matériel médical",
        description: `Achetez du matériel médical à ${cityLabel} : lits, fauteuils roulants, oxygène, diagnostic et instruments. Catalogue en ligne avec livraison locale.`,
        href: venteCityPath(citySlug),
      },
      {
        icon: "calendar_month",
        title: "Location de matériel médical",
        description: `Louez un lit médicalisé, un fauteuil roulant, un concentrateur d'oxygène ou un matelas anti-escarres à ${cityLabel}.`,
        badge: "Bientôt disponible",
      },
    ],
    careServices: getCareServicesForCity(citySlug),
    equipmentHighlights: [
      {
        icon: "bed",
        title: "Lits et confort médical",
        description: `Lits médicalisés et matelas anti-escarres à ${cityLabel}.`,
        categoryParam: "confort",
      },
      {
        icon: "accessible",
        title: "Mobilité",
        description: `Fauteuils roulants, déambulateurs et béquilles à ${cityLabel}.`,
        categoryParam: "mobilier-medical",
      },
      {
        icon: "air",
        title: "Matériel respiratoire",
        description: `Concentrateurs d'oxygène et nébuliseurs à ${cityLabel}.`,
        categoryParam: "respiratoire",
      },
      {
        icon: "monitoring",
        title: "Diagnostic",
        description: `Tensiomètres, oxymètres, ECG et équipements de suivi à ${cityLabel}.`,
        categoryParam: "diagnostic",
      },
    ],
    faqs: [
      {
        question: `Livrez-vous du matériel médical à ${cityLabel} ?`,
        answer: `Oui, nous livrons à ${cityLabel} et dans les zones proches : ${city.zones.slice(0, 5).join(", ")} et environs. ${city.deliveryText}`,
      },
      {
        question: `Peut-on acheter du matériel médical à ${cityLabel} ?`,
        answer: `Oui, consultez notre catalogue vente en ligne pour ${cityLabel}. Lits médicalisés, fauteuils roulants, concentrateurs d'oxygène, matériel de diagnostic et instruments sont disponibles sur devis.`,
      },
      {
        question: `Proposez-vous la location de matériel médical à ${cityLabel} ?`,
        answer: `La location de matériel médical à ${cityLabel} (lit médicalisé, fauteuil roulant, oxygène, matelas anti-escarres) sera prochainement disponible. Contactez-nous pour être informé de l'ouverture du service.`,
      },
      {
        question: `Proposez-vous de la kinésithérapie à domicile à ${cityLabel} ?`,
        answer: `SOS Santé oriente les familles vers des kinésithérapeutes à domicile à ${cityLabel}. Ce service sera prochainement disponible via notre plateforme de mise en relation.`,
      },
      {
        question: `Peut-on trouver un infirmier ou un aide-soignant à domicile à ${cityLabel} ?`,
        answer: `Oui, SOS Santé facilite la mise en relation avec des infirmiers et aide-soignants qualifiés à ${cityLabel}. Contactez-nous pour exprimer votre besoin de soins ou d'aide à domicile.`,
      },
      {
        question: `Comment obtenir un devis à ${cityLabel} ?`,
        answer: `Pour le matériel médical : parcourez le catalogue vente ou contactez-nous par WhatsApp. Pour l'aide à domicile : remplissez le formulaire ou écrivez-nous en précisant votre ville (${cityLabel}) et le type de service recherché.`,
      },
    ],
  };
}
