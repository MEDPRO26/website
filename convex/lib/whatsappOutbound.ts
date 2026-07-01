/**
 * Outbound WhatsApp — stub for future Meta / 360dialog integration.
 *
 * Today: manual mode only (staff copies text → WhatsApp Web).
 * When API is connected: branch here on platformSettings.whatsappProvider.
 */

export type OutboundWhatsAppArgs = {
  toPhone: string;
  text: string;
  channelPhone: string;
  metaPhoneNumberId?: string;
};

export type OutboundWhatsAppResult =
  | { mode: "manual"; waMeUrl: string }
  | { mode: "api"; messageId: string };

/** Build wa.me link for manual sending (current default). */
export function manualWhatsAppUrl(toPhone: string, text: string) {
  let digits = toPhone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = `212${digits.slice(1)}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text.trim())}`;
}

/**
 * Placeholder for API send — implement when Meta credentials are in Convex env.
 * See project docs / assistant message for setup steps.
 */
export async function sendWhatsAppMessage(
  _args: OutboundWhatsAppArgs
): Promise<OutboundWhatsAppResult> {
  throw new Error(
    "WhatsApp API non configurée. Utilisez le mode manuel (Ouvrir WhatsApp)."
  );
}
