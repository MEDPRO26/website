import { activeCities, getCityBySlug, type CitySlug } from "@/lib/cities";
import {
  getCareServiceSeoProfile,
  resolveCareServiceSeo,
  type CareServiceResolvedSeo,
} from "@/lib/care-service-seo";
import { normalizePublicDash } from "@/lib/french";
import { getCareServiceCityImages } from "@/lib/care-service-city-images";
import { getCareServiceCityContentVariant } from "@/lib/care-service-city-variants";

export type CareServiceImages = {
  hero: string;
  section: string;
  alt: string;
};

function serviceImages(slug: string, alt: string): CareServiceImages {
  return {
    hero: `/services/${slug}-hero.jpg`,
    section: `/services/${slug}-section.jpg`,
    alt,
  };
}

export type CareService = {
  slug: string;
  icon: string;
  title: string;
  formLabel: string;
  images: CareServiceImages;
  description: (cityLabel: string) => string;
  intro: (cityLabel: string) => string;
  features: string[];
  faqs: (cityLabel: string) => { question: string; answer: string }[];
  keywords: (cityLabel: string) => string[];
  badge?: string;
};

export const careServices: CareService[] = [
  {
    slug: "kinesitherapie-a-domicile",
    icon: "fitness_center",
    title: "Kinésithérapie à domicile",
    formLabel: "Kinésithérapeute",
    images: serviceImages(
      "kinesitherapie-a-domicile",
      "Kinésithérapeute en séance de rééducation à domicile"
    ),
    description: (city) =>
      `Rééducation et séances de kinésithérapie à domicile à ${city}. Mise en relation avec des kinésithérapeutes qualifiés.`,
    intro: (city) =>
      `SOS Santé coordonne des séances de kinésithérapie à domicile à ${city} : rééducation motrice, respiratoire et neurologique selon disponibilité des professionnels partenaires.`,
    features: [
      "Rééducation motrice",
      "Kiné respiratoire",
      "Rééducation neurologique",
    ],
    faqs: (city) => [
      {
        question: `Comment obtenir une séance de kinésithérapie à domicile à ${city} ?`,
        answer: `Contactez SOS Santé par WhatsApp ou formulaire. Nous qualifions votre demande et vous mettons en relation avec un kinésithérapeute partenaire disponible à ${city}.`,
      },
      {
        question: `Quel est le délai pour une première séance à ${city} ?`,
        answer: `Selon disponibilité du professionnel partenaire, une première séance peut être organisée sous 24 à 48 h à ${city} et environs.`,
      },
    ],
    keywords: (city) => [
      `kinésithérapie à domicile ${city}`,
      `kiné à domicile ${city}`,
      `rééducation à domicile ${city}`,
    ],
    badge: "Bientôt disponible",
  },
  {
    slug: "soins-infirmiers-a-domicile",
    icon: "medical_services",
    title: "Soins infirmiers à domicile",
    formLabel: "Infirmier",
    images: serviceImages(
      "soins-infirmiers-a-domicile",
      "Infirmier réalisant des soins à domicile"
    ),
    description: (city) =>
      `Pansements, injections, perfusions et suivi infirmier à domicile à ${city}. Orientation vers des infirmiers diplômés.`,
    intro: (city) =>
      `SOS Santé facilite la mise en relation avec des infirmiers diplômés à ${city} pour des soins à domicile : pansements, injections, perfusions et surveillance.`,
    features: [
      "Soins post-opératoires",
      "Prise de sang",
      "Surveillance 24h/7j",
    ],
    faqs: (city) => [
      {
        question: `Quels soins infirmiers proposez-vous à ${city} ?`,
        answer: `Pansements, injections, perfusions, prise de constantes et suivi infirmier à domicile à ${city}, selon disponibilité des infirmiers partenaires.`,
      },
      {
        question: `Les infirmiers sont-ils diplômés d'État ?`,
        answer: `Oui, nous orientons vers des infirmiers diplômés et inscrits. SOS Santé agit comme intermédiaire de coordination, pas comme établissement de soins.`,
      },
    ],
    keywords: (city) => [
      `infirmier à domicile ${city}`,
      `soins infirmiers à domicile ${city}`,
      `infirmière à domicile ${city}`,
    ],
    badge: "Bientôt disponible",
  },
  {
    slug: "medecin-a-domicile",
    icon: "stethoscope",
    title: "Médecin à domicile",
    formLabel: "Médecin",
    images: serviceImages(
      "medecin-a-domicile",
      "Médecin en consultation médicale à domicile"
    ),
    description: (city) =>
      `Consultation et suivi médical à domicile à ${city}. Mise en relation avec des médecins généralistes selon disponibilité.`,
    intro: (city) =>
      `SOS Santé coordonne des consultations médicales à domicile à ${city}. Mise en relation avec des médecins généralistes partenaires selon disponibilité.`,
    features: [
      "Consultation à domicile",
      "Suivi post-hospitalisation",
      "Orientation spécialisée",
    ],
    faqs: (city) => [
      {
        question: `Peut-on avoir un médecin à domicile à ${city} ?`,
        answer: `Oui, sur demande et selon disponibilité. SOS Santé coordonne la mise en relation avec un médecin généraliste partenaire à ${city}.`,
      },
      {
        question: `SOS Santé est-il un cabinet médical ?`,
        answer: `Non. SOS Santé est un service de coordination et de mise en relation. Nous ne remplaçons pas un médecin traitant ni un service d'urgence officiel.`,
      },
    ],
    keywords: (city) => [
      `médecin à domicile ${city}`,
      `consultation médicale à domicile ${city}`,
    ],
    badge: "Bientôt disponible",
  },
  {
    slug: "aide-soignant-a-domicile",
    icon: "volunteer_activism",
    title: "Aide-soignant à domicile",
    formLabel: "Aide-soignant",
    images: serviceImages(
      "aide-soignant-a-domicile",
      "Aide-soignant accompagnant une personne âgée à domicile"
    ),
    description: (city) =>
      `Aide aux actes du quotidien, accompagnement et soutien à domicile à ${city}. Mise en relation avec des aide-soignants.`,
    intro: (city) =>
      `SOS Santé met en relation les familles de ${city} avec des aide-soignants pour l'hygiène, la mobilité, l'accompagnement et le soutien au quotidien.`,
    features: [
      "Aide à la toilette",
      "Surveillance nocturne",
      "Préparation des repas",
    ],
    faqs: (city) => [
      {
        question: `Comment trouver un aide-soignant à ${city} ?`,
        answer: `Contactez SOS Santé avec vos besoins (horaires, durée, type d'aide). Nous orientons vers un aide-soignant partenaire disponible à ${city}.`,
      },
      {
        question: `Proposez-vous la garde de nuit à ${city} ?`,
        answer: `Oui, selon disponibilité des prestataires partenaires. Précisez vos besoins lors de la demande pour une orientation adaptée.`,
      },
    ],
    keywords: (city) => [
      `aide-soignant à domicile ${city}`,
      `aide à domicile ${city}`,
      `garde-malade ${city}`,
    ],
    badge: "Bientôt disponible",
  },
  {
    slug: "ambulance-maroc",
    icon: "emergency",
    title: "Ambulance Maroc",
    formLabel: "Ambulance",
    images: serviceImages(
      "ambulance-maroc",
      "Ambulance et transport médical au Maroc"
    ),
    description: (city) =>
      `Transport médical et ambulance à ${city} et au Maroc. Coordination avec des prestataires partenaires selon disponibilité.`,
    intro: (city) =>
      `SOS Santé coordonne le transport médical et l'ambulance à ${city} et au Maroc avec des prestataires partenaires, selon disponibilité et zone.`,
    features: [
      "Transport médicalisé",
      "Transfert inter-villes",
      "Disponibilité à confirmer",
    ],
    faqs: (city) => [
      {
        question: `Comment réserver une ambulance à ${city} ?`,
        answer: `Contactez SOS Santé par téléphone ou WhatsApp. Nous vérifions la disponibilité d'un transporteur partenaire à ${city} et vous confirmons les modalités.`,
      },
      {
        question: `Intervenez-vous en urgence vitale ?`,
        answer: `SOS Santé n'est pas un service d'urgence officiel. En cas d'urgence vitale, composez les numéros d'urgence compétents. Nous coordonnons le transport médical selon disponibilité.`,
      },
    ],
    keywords: (city) => [
      `ambulance ${city}`,
      `transport médical ${city}`,
      `ambulance Maroc ${city}`,
    ],
    badge: "Bientôt disponible",
  },
];

export function careServiceCitySlug(
  serviceSlug: string,
  citySlug: CitySlug
): string {
  return `${serviceSlug}-${citySlug}`;
}

export function careServiceCityPath(
  serviceSlug: string,
  citySlug: CitySlug
): string {
  return `/services/${careServiceCitySlug(serviceSlug, citySlug)}`;
}

export function parseCareServiceCitySlug(combined: string): {
  serviceSlug: string;
  citySlug: CitySlug;
} | null {
  for (const city of activeCities) {
    const suffix = `-${city.slug}`;
    if (!combined.endsWith(suffix)) continue;
    const serviceSlug = combined.slice(0, -suffix.length);
    if (careServices.some((service) => service.slug === serviceSlug)) {
      return { serviceSlug, citySlug: city.slug };
    }
  }
  return null;
}

export function getCareServiceBySlug(serviceSlug: string) {
  return careServices.find((service) => service.slug === serviceSlug);
}

export type CareServicePageContent = {
  serviceSlug: string;
  citySlug: CitySlug;
  path: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  icon: string;
  formLabel: string;
  intro: string;
  description: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  badge?: string;
  cityName: string;
  brandName: string;
  zones: string[];
  deliveryText: string;
  otherCities: { name: string; href: string }[];
  otherServices: { title: string; href: string }[];
  seo: CareServiceResolvedSeo;
  images: CareServiceImages & {
    altWithCity: string;
    bentoMain: string;
    bentoSecondary: string;
    expertise: string;
    specialties: string[];
    trust: string;
  };
};

export function getCareServicePageContent(
  serviceSlug: string,
  citySlug: CitySlug
): CareServicePageContent | null {
  const service = getCareServiceBySlug(serviceSlug);
  const city = getCityBySlug(citySlug);
  const seo = getCareServiceSeoProfile(serviceSlug);
  if (!service || !city || !city.available || !seo) return null;

  const cityName = city.name;
  const cityVariant = getCareServiceCityContentVariant(serviceSlug, citySlug);
  const resolvedSeo = cityVariant
    ? {
        heroSubheadline: cityVariant.heroSubheadline,
        seoIntroHeading: cityVariant.seoIntroHeading,
        seoIntro: cityVariant.seoIntro,
        whyChoose: cityVariant.whyChoose,
        valueProps: cityVariant.valueProps,
        expertise: cityVariant.expertise,
        benefits: cityVariant.benefits,
        specialties: cityVariant.specialties,
        trust: cityVariant.trust,
        community: cityVariant.community,
      }
    : resolveCareServiceSeo(seo, cityName);
  const cityImages = getCareServiceCityImages(
    serviceSlug,
    citySlug,
    service.images.alt
  );

  return {
    serviceSlug,
    citySlug,
    path: careServiceCityPath(serviceSlug, citySlug),
    h1: `${service.title} à ${cityName}`,
    metaTitle: normalizePublicDash(
      `${service.title} à ${cityName} | SOS Santé`
    ),
    metaDescription: `${resolvedSeo.seoIntro.slice(0, 155)}…`,
    keywords: service.keywords(cityName),
    icon: service.icon,
    formLabel: service.formLabel,
    intro: resolvedSeo.heroSubheadline,
    description: service.description(cityName),
    features: service.features,
    faqs: cityVariant?.extendedFaqs ?? seo.extendedFaqs(cityName),
    badge: service.badge,
    cityName,
    brandName: city.brandName,
    zones: city.zones,
    deliveryText: city.deliveryText,
    otherCities: activeCities
      .filter((c) => c.slug !== citySlug)
      .map((c) => ({
        name: c.name,
        href: careServiceCityPath(serviceSlug, c.slug),
      })),
    otherServices: careServices
      .filter((s) => s.slug !== serviceSlug)
      .map((s) => ({
        title: `${s.title} à ${cityName}`,
        href: careServiceCityPath(s.slug, citySlug),
      })),
    seo: resolvedSeo,
    images: {
      hero: cityImages.hero,
      section: cityImages.bentoMain,
      alt: cityImages.alt,
      altWithCity: `${cityImages.alt} - ${cityName}`,
      bentoMain: cityImages.bentoMain,
      bentoSecondary: cityImages.bentoSecondary,
      expertise: cityImages.expertise,
      specialties: cityImages.specialties,
      trust: cityImages.trust,
    },
  };
}

export function getAllCareServicePageParams() {
  return activeCities.flatMap((city) =>
    careServices.map((service) => ({
      slug: careServiceCitySlug(service.slug, city.slug),
    }))
  );
}

export function getCareServicesForCity(citySlug: CitySlug) {
  const city = getCityBySlug(citySlug)!;
  return careServices.map(({ slug, icon, title, description, badge, images }) => {
    const cityImages = getCareServiceCityImages(slug, citySlug, images.alt);
    return {
      icon,
      title,
      description: description(city.name),
      href: careServiceCityPath(slug, citySlug),
      badge,
      image: cityImages.hero,
      imageAlt: `${cityImages.alt} à ${city.name}`,
    };
  });
}

const homepageCareServiceDescriptions: Record<string, string> = {
  "kinesitherapie-a-domicile":
    "Rééducation et séances de kinésithérapie à domicile dans les grandes villes du Maroc. Mise en relation avec des kinésithérapeutes qualifiés.",
  "soins-infirmiers-a-domicile":
    "Pansements, injections, perfusions et suivi infirmier à domicile dans les grandes villes du Maroc. Orientation vers des infirmiers diplômés.",
  "medecin-a-domicile":
    "Consultation et suivi médical à domicile dans les grandes villes du Maroc. Mise en relation avec des médecins généralistes selon disponibilité.",
  "aide-soignant-a-domicile":
    "Aide aux actes du quotidien, accompagnement et soutien à domicile dans les grandes villes du Maroc. Mise en relation avec des aide-soignants.",
  "ambulance-maroc":
    "Transport médical et ambulance dans les grandes villes du Maroc. Coordination avec des prestataires partenaires selon disponibilité.",
};

export function getHomepageCareServices() {
  return careServices.map(({ slug, icon, title, badge, images }) => ({
    slug,
    icon,
    title,
    description:
      homepageCareServiceDescriptions[slug] ??
      "Service disponible dans les grandes villes du Maroc.",
    badge,
    image: images.hero,
    imageAlt: images.alt,
  }));
}

export const careServiceFormOptions = careServices.map((s) => s.formLabel);
