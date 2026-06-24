export const SITE_NAME = "SOS Santé";
export const SITE_FULL_NAME =
  "SOS Santé Agadir - Matériel Médical & Aide à Domicile";
export const SITE_URL_DEFAULT = "https://sossante.ma";
export const SITE_WEBSITE = "www.sossante.ma";
export const SITE_ADDRESS =
  "Lerac, Avenue Abderrahim Bouabid, 8000, Agadir 80000";
export const HERO_IMAGE = "/sos-sante-hero.jpg";

/** Logo brand colors */
export const BRAND_BLUE = "#32A0F3";
export const BRAND_GRAY = "#747782";

export const LOGO = {
  default: "/sos sante bg trans.webp",
  white: "/sos sante bg white.webp",
} as const;

export const LOGO_ALT = "SOS Santé — location de matériel médical et soins à domicile";

/** Intrinsic aspect ratio (width / height) of the logo assets */
export const LOGO_ASPECT_RATIO = 5060 / 1438;

export function logoDimensions(height: number) {
  return {
    height,
    width: Math.round(height * LOGO_ASPECT_RATIO),
  };
}
