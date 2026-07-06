const CHANNEL_DEFAULT_COLORS: Record<string, string> = {
  "materiel-medical": "#2563eb",
  "aide-domicile": "#059669",
  "garde-soins": "#7c3aed",
  "contact-general": "#ea580c",
};

const CLIENT_FALLBACK_PALETTE = [
  "#db2777",
  "#0891b2",
  "#ca8a04",
  "#4f46e5",
  "#c2410c",
  "#0d9488",
  "#9333ea",
  "#dc2626",
];

export function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value.trim());
}

export function normalizeHexColor(value: string | undefined | null, fallback: string) {
  if (value && isHexColor(value)) {
    return value.trim();
  }
  return fallback;
}

export function defaultChannelColor(slug?: string | null, sortOrder = 0) {
  if (slug && CHANNEL_DEFAULT_COLORS[slug]) {
    return CHANNEL_DEFAULT_COLORS[slug];
  }
  return CLIENT_FALLBACK_PALETTE[sortOrder % CLIENT_FALLBACK_PALETTE.length];
}

export function colorFromPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  let hash = 0;
  for (const char of digits) {
    hash = (hash + char.charCodeAt(0)) % CLIENT_FALLBACK_PALETTE.length;
  }
  return CLIENT_FALLBACK_PALETTE[hash] ?? CLIENT_FALLBACK_PALETTE[0];
}

function hexToRgb(hex: string) {
  const normalized = normalizeHexColor(hex, "#2563eb");
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

export function mixHexWithWhite(hex: string, whiteRatio: number) {
  const { r, g, b } = hexToRgb(hex);
  const ratio = Math.min(Math.max(whiteRatio, 0), 1);
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function rgbaFromHex(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function resolveChannelColor(
  accentColor: string | undefined | null,
  slug?: string | null,
  sortOrder = 0
) {
  return normalizeHexColor(accentColor, defaultChannelColor(slug, sortOrder));
}

export function resolveClientColor(
  accentColor: string | undefined | null,
  phone: string
) {
  return normalizeHexColor(accentColor, colorFromPhone(phone));
}
