const ELISION_PATTERN = /^[aeiouàâäéèêëîïôùûüœæh]/i;

/** Returns "de X" or "d'X" depending on the following word. */
export function frenchDe(phrase: string): string {
  const text = phrase.trim().toLowerCase();
  if (!text) return "de";
  if (ELISION_PATTERN.test(text)) return `d'${text}`;
  return `de ${text}`;
}

const SEO_TITLE_SUFFIX = " | SOS Santé";

/** Normalizes product SEO titles: "Achat aspirateur..." → "Achat d'aspirateur..." */
export function formatAchatSeoTitle(seoTitle: string): string {
  if (!seoTitle.endsWith(SEO_TITLE_SUFFIX)) return seoTitle;

  const label = seoTitle.slice(0, -SEO_TITLE_SUFFIX.length);
  if (!label.startsWith("Achat ")) return seoTitle;

  const productPart = label.slice(6);
  return `Achat ${frenchDe(productPart)}${SEO_TITLE_SUFFIX}`;
}

export function formatProductAchatHeading(
  productName: string,
  city: string
): string {
  return `Achat ${frenchDe(productName)} — ${city}`;
}
