import type { CitySlug } from "@/lib/cities";

export type CareServiceCityImages = {
  hero: string;
  bentoMain: string;
  bentoSecondary: string;
  expertise: string;
  specialties: string[];
  trust: string;
  alt: string;
};

const img = {
  kineHero: "/services/kinesitherapie-a-domicile-hero.jpg",
  kineSection: "/services/kinesitherapie-a-domicile-section.jpg",
  infirmierHero: "/services/soins-infirmiers-a-domicile-hero.jpg",
  infirmierSection: "/services/soins-infirmiers-a-domicile-section.jpg",
  medecinHero: "/services/medecin-a-domicile-hero.jpg",
  medecinSection: "/services/medecin-a-domicile-section.jpg",
  aideHero: "/services/aide-soignant-a-domicile-hero.jpg",
  aideSection: "/services/aide-soignant-a-domicile-section.jpg",
  ambulanceHero: "/services/ambulance-maroc-hero.jpg",
  ambulanceSection: "/services/ambulance-maroc-section.jpg",
  brancard: "/products/brancard-pliable-portable.webp",
  fauteuil: "/products/fauteuil-roulant-pliable-classique.webp",
  fauteuilElectrique: "/products/fauteuil-roulant-electrique-classique.webp",
  litMedical: "/products/lit-electrique-3-positions.webp",
  litMecanique: "/products/lit-mecanique-2-articulations.webp",
  deambulateur: "/products/deambulateur-pliable-roues.webp",
  rollator: "/products/rollator-aluminium-4-roues.webp",
  canneTripode: "/products/canne-tripode-reglable.webp",
  canneQuadripode: "/products/canne-quadripode.webp",
  stethoscope: "/products/stethoscope-simple-pavillon.webp",
  tensiometre: "/products/tensiometre-electronique-beurer-bm26.webp",
  oxymetre: "/products/oxymetre-doigt.webp",
  otoscope: "/products/otoscope-fibre-optique.webp",
  ecg: "/products/ecg-6-pistes-cardiomaster-6000.webp",
  thermometre: "/products/thermometre-infrarouge-sans-contact.webp",
  defibrillateur: "/products/defibrillateur-externe-automatique.webp",
  nebuliseur: "/products/beurer-nebuliseur-ih-21.webp",
  concentrateur: "/products/concentrateur-oxygene-5l.webp",
  matelas: "/products/matelas-anti-escarre-air-compresseur.webp",
  potence: "/products/potence-perfusion-mobile.webp",
  tableManger: "/products/table-manger.webp",
  spirometre: "/products/spirometre-peak-flow.webp",
  chariot: "/products/chariot-pansement-inox-2-plateaux.webp",
  bequilles: "/products/bequille-s-m-l.webp",
  siteHero: "/sos-sante-hero.jpg",
  soinsDomicile: "/services/soins-domicile.jpg",
} as const;

/**
 * Each image matches its section theme (kiné, infirmier, médecin…).
 * City landscape photos are intentionally excluded — they don't illustrate care services.
 */
const serviceCityImages: Record<
  string,
  Partial<Record<CitySlug, CareServiceCityImages>>
> = {
  "kinesitherapie-a-domicile": {
    agadir: {
      hero: img.kineHero,
      bentoMain: img.kineSection,
      bentoSecondary: img.deambulateur,
      expertise: img.rollator,
      specialties: [img.bequilles, img.canneTripode, img.spirometre, img.nebuliseur],
      trust: img.soinsDomicile,
      alt: "Kinésithérapie et rééducation à domicile",
    },
    rabat: {
      hero: img.kineSection,
      bentoMain: img.kineHero,
      bentoSecondary: img.rollator,
      expertise: img.deambulateur,
      specialties: [img.bequilles, img.canneQuadripode, img.spirometre, img.fauteuil],
      trust: img.infirmierSection,
      alt: "Kinésithérapie et rééducation à domicile",
    },
  },
  "soins-infirmiers-a-domicile": {
    agadir: {
      hero: img.infirmierHero,
      bentoMain: img.infirmierSection,
      bentoSecondary: img.stethoscope,
      expertise: img.potence,
      specialties: [img.oxymetre, img.thermometre, img.chariot],
      trust: img.soinsDomicile,
      alt: "Soins infirmiers et pansements à domicile",
    },
    rabat: {
      hero: img.infirmierSection,
      bentoMain: img.infirmierHero,
      bentoSecondary: img.tensiometre,
      expertise: img.chariot,
      specialties: [img.potence, img.oxymetre, img.stethoscope],
      trust: img.kineHero,
      alt: "Soins infirmiers et pansements à domicile",
    },
  },
  "medecin-a-domicile": {
    agadir: {
      hero: img.medecinHero,
      bentoMain: img.medecinSection,
      bentoSecondary: img.stethoscope,
      expertise: img.otoscope,
      specialties: [img.ecg, img.thermometre],
      trust: img.infirmierSection,
      alt: "Consultation médicale à domicile",
    },
    rabat: {
      hero: img.medecinSection,
      bentoMain: img.medecinHero,
      bentoSecondary: img.ecg,
      expertise: img.stethoscope,
      specialties: [img.otoscope, img.tensiometre],
      trust: img.soinsDomicile,
      alt: "Consultation médicale à domicile",
    },
  },
  "aide-soignant-a-domicile": {
    agadir: {
      hero: img.aideHero,
      bentoMain: img.aideSection,
      bentoSecondary: img.fauteuil,
      expertise: img.litMedical,
      specialties: [img.tableManger, img.canneQuadripode],
      trust: img.aideHero,
      alt: "Aide-soignant et accompagnement à domicile",
    },
    rabat: {
      hero: img.aideSection,
      bentoMain: img.aideHero,
      bentoSecondary: img.fauteuilElectrique,
      expertise: img.litMecanique,
      specialties: [img.canneTripode, img.bequilles],
      trust: img.soinsDomicile,
      alt: "Aide-soignant et accompagnement à domicile",
    },
  },
  "ambulance-maroc": {
    agadir: {
      hero: img.ambulanceHero,
      bentoMain: img.ambulanceSection,
      bentoSecondary: img.brancard,
      expertise: img.defibrillateur,
      specialties: [img.litMedical, img.concentrateur],
      trust: img.ambulanceSection,
      alt: "Ambulance et transport médicalisé",
    },
    rabat: {
      hero: img.ambulanceSection,
      bentoMain: img.ambulanceHero,
      bentoSecondary: img.brancard,
      expertise: img.defibrillateur,
      specialties: [img.litMecanique, img.matelas],
      trust: img.soinsDomicile,
      alt: "Ambulance et transport médicalisé",
    },
  },
};

export function getCareServiceCityImages(
  serviceSlug: string,
  citySlug: CitySlug,
  fallbackAlt: string
): CareServiceCityImages {
  const configured =
    serviceCityImages[serviceSlug]?.[citySlug] ??
    serviceCityImages[serviceSlug]?.agadir;

  if (configured) return configured;

  return {
    hero: `/services/${serviceSlug}-hero.jpg`,
    bentoMain: `/services/${serviceSlug}-section.jpg`,
    bentoSecondary: img.stethoscope,
    expertise: img.siteHero,
    specialties: [img.oxymetre, img.thermometre],
    trust: img.soinsDomicile,
    alt: fallbackAlt,
  };
}
