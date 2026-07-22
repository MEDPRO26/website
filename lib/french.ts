const ELISION_PATTERN = /^[aeiouàâäéèêëîïôùûüœæh]/i;

/** Returns "de X" or "d'X" depending on the following word. */
export function frenchDe(phrase: string): string {
  const text = phrase.trim().toLowerCase();
  if (!text) return "de";
  if (ELISION_PATTERN.test(text)) return `d'${text}`;
  return `de ${text}`;
}

const SEO_TITLE_SUFFIX = " | SOS Santé";

/** ASCII hyphen in public titles and labels (not em/en dashes). */
export function normalizePublicDash(text: string): string {
  return text.replace(/[\u2013\u2014]/g, "-");
}

/** Normalizes product SEO titles: "Achat aspirateur..." → "Achat d'aspirateur..." */
export function formatAchatSeoTitle(seoTitle: string): string {
  const normalized = normalizePublicDash(seoTitle);
  if (!normalized.endsWith(SEO_TITLE_SUFFIX)) return normalized;

  const label = normalized.slice(0, -SEO_TITLE_SUFFIX.length);
  if (!label.startsWith("Achat ")) return normalized;

  const productPart = label.slice(6);
  return normalizePublicDash(
    `Achat ${frenchDe(productPart)}${SEO_TITLE_SUFFIX}`
  );
}

export function formatProductAchatHeading(
  productName: string,
  city: string
): string {
  return normalizePublicDash(
    `Achat ${frenchDe(normalizePublicDash(productName))} - ${city}`
  );
}

export function formatProductLocationHeading(
  productName: string,
  city: string
): string {
  return normalizePublicDash(
    `Location ${frenchDe(normalizePublicDash(productName))} - ${city}`
  );
}
