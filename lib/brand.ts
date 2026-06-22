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
