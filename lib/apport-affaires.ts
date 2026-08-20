export type ApportRateSettings = {
  lowMax: number;
  lowRate: number | null;
  midMax: number;
  midRate: number | null;
  highRate: number | null;
};

export const DEFAULT_APPORT_RATE_SETTINGS: ApportRateSettings = {
  lowMax: 100_000,
  lowRate: null,
  midMax: 250_000,
  midRate: null,
  highRate: null,
};

function clampRate(rate: number) {
  return Math.min(1, Math.max(0, Number.isFinite(rate) ? rate : 0));
}

function normalizeOptionalRate(rate: number | null | undefined): number | null {
  if (rate == null || !Number.isFinite(rate)) return null;
  return clampRate(rate);
}

export function normalizeApportRateSettings(
  settings?: Partial<ApportRateSettings> | null
): ApportRateSettings {
  const next = { ...DEFAULT_APPORT_RATE_SETTINGS, ...settings };
  const lowMax = Math.max(1, next.lowMax);
  const midMax = Math.max(lowMax + 1, next.midMax);
  return {
    lowMax,
    midMax,
    lowRate: normalizeOptionalRate(next.lowRate),
    midRate: normalizeOptionalRate(next.midRate),
    highRate: normalizeOptionalRate(next.highRate),
  };
}

export function apportRateTiers(settings: ApportRateSettings) {
  const s = normalizeApportRateSettings(settings);
  return [
    {
      rate: s.lowRate,
      label: s.lowRate == null ? "" : formatRate(s.lowRate),
      hint: `jusqu’à ${s.lowMax.toLocaleString("fr-FR")} DH`,
    },
    {
      rate: s.midRate,
      label: s.midRate == null ? "" : formatRate(s.midRate),
      hint: `entre ${(s.lowMax + 1).toLocaleString("fr-FR")} et ${s.midMax.toLocaleString("fr-FR")} DH`,
    },
    {
      rate: s.highRate,
      label: s.highRate == null ? "" : formatRate(s.highRate),
      hint: `au-delà de ${s.midMax.toLocaleString("fr-FR")} DH`,
    },
  ];
}

/** Bracket rate from settings, or null when that tier has no rate yet. */
export function commissionRateForContract(
  amount: number,
  settings: ApportRateSettings = DEFAULT_APPORT_RATE_SETTINGS
): number | null {
  const s = normalizeApportRateSettings(settings);
  if (amount <= s.lowMax) return s.lowRate;
  if (amount <= s.midMax) return s.midRate;
  return s.highRate;
}

/** Excel: =SI(E6="";"";E6-F6) */
export function remainingToPay(commissionDue: number, depositReceived: number) {
  return Math.round(commissionDue - depositReceived);
}

/**
 * Commission uses the manually entered rate only.
 * Bracket settings are optional reference values, not auto-applied.
 */
export function computeApportRow(args: {
  contractAmount: number | null | undefined;
  depositReceived: number | null | undefined;
  settings?: ApportRateSettings;
  customRate?: number | null;
}) {
  const amount = args.contractAmount;
  if (amount == null || !Number.isFinite(amount) || amount <= 0) {
    return {
      rate: null as number | null,
      defaultRate: null as number | null,
      isCustomRate: false,
      commissionDue: null as number | null,
      remaining: null as number | null,
    };
  }

  const settings = args.settings ?? DEFAULT_APPORT_RATE_SETTINGS;
  const defaultRate = commissionRateForContract(amount, settings);
  const isCustomRate =
    args.customRate != null && Number.isFinite(args.customRate);
  const rate = isCustomRate ? clampRate(args.customRate!) : null;
  const commissionDue =
    rate == null ? null : Math.round(amount * rate);
  const deposit = args.depositReceived ?? 0;
  return {
    rate,
    defaultRate,
    isCustomRate,
    commissionDue,
    remaining:
      commissionDue == null
        ? null
        : remainingToPay(commissionDue, deposit),
  };
}

export function parseAmountInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/\s/g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function parsePercentInput(raw: string): number | null {
  const value = parseAmountInput(raw.replace("%", ""));
  if (value == null) return null;
  return value / 100;
}

export function formatDh(amount: number) {
  return `${amount.toLocaleString("fr-FR")} DH`;
}

export function formatRate(rate: number) {
  const pct = rate * 100;
  const text = Number.isInteger(pct)
    ? String(pct)
    : pct.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  return `${text} %`;
}

export function formatPercentInput(rate: number | null | undefined) {
  if (rate == null || !Number.isFinite(rate)) return "";
  const pct = Math.round(rate * 10000) / 100;
  return Number.isInteger(pct)
    ? String(pct)
    : pct.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

export function formatAmountInput(amount: number | null | undefined) {
  if (amount == null || !Number.isFinite(amount)) return "";
  return amount.toLocaleString("fr-FR");
}
