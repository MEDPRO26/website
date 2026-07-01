/** Public-site WhatsApp routing — mirrors CRM channel purposes. */
export type WhatsAppLine =
  | "materiel"
  | "aide_domicile"
  | "garde_soins"
  | "general";

/**
 * One number per service line. Update when additional CRM lines go live.
 * Line 1 (matériel) matches `WHATSAPP_NUMBER` in lib/cities.ts.
 */
export const WHATSAPP_LINES: Record<WhatsAppLine, string> = {
  materiel: "212700975888",
  aide_domicile: "212700975888",
  garde_soins: "212700975888",
  general: "212700975888",
};

export const CHANNEL_PURPOSE_TO_LINE: Record<string, WhatsAppLine> = {
  location_materiel: "materiel",
  aide_domicile: "aide_domicile",
  garde_soins: "garde_soins",
  general: "general",
};

export function whatsAppDigits(line: WhatsAppLine = "general") {
  return WHATSAPP_LINES[line];
}

export function whatsAppHref(text?: string, line: WhatsAppLine = "general") {
  const base = `https://wa.me/${WHATSAPP_LINES[line]}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
