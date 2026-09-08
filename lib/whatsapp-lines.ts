/** Public-site WhatsApp routing — mirrors CRM channel purposes. */
export type WhatsAppLine =
  | "materiel"
  | "aide_domicile"
  | "garde_soins"
  | "general";

/**
 * One number per service line. Update when additional CRM lines go live.
 * Defaults to the national Casablanca line (`WHATSAPP_NUMBER` in lib/cities.ts).
 * City pages override via `cityWhatsAppHref` when a local number exists (e.g. Agadir).
 */
export const WHATSAPP_LINES: Record<WhatsAppLine, string> = {
  materiel: "212603135888",
  aide_domicile: "212603135888",
  garde_soins: "212603135888",
  general: "212603135888",
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

export function whatsAppHref(
  text?: string,
  line: WhatsAppLine = "general",
  digits?: string
) {
  const number = digits?.replace(/\D/g, "") || WHATSAPP_LINES[line];
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Prefill so the team knows the visitor's city.
 * Example: "Bonjour SOS Santé, je suis de Marrakech. Je souhaite un devis."
 */
export function cityWhatsAppText(cityName: string, request: string): string {
  const body = request.trim().replace(/^\.+/, "");
  return `Bonjour SOS Santé, je suis de ${cityName}. ${body}`;
}

export function cityWhatsAppHref(
  city: { contactReady: boolean; whatsapp: string; name?: string },
  text?: string,
  line: WhatsAppLine = "general"
) {
  const digits =
    city.contactReady && city.whatsapp ? city.whatsapp : undefined;
  return whatsAppHref(text, line, digits);
}

/** CRM webhook URL for 360Messenger (uses public Convex site URL). */
export function crmWhatsAppWebhookUrl(siteUrl?: string) {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? "").replace(
    /\/$/,
    ""
  );
  return base ? `${base}/whatsapp/webhook` : "";
}
