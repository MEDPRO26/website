export type ApportRateSettings = {
  lowMax: number;
  lowRate: number;
  midMax: number;
  midRate: number;
  highRate: number;
};

export const DEFAULT_APPORT_RATE_SETTINGS: ApportRateSettings = {
  lowMax: 100_000,
  lowRate: 0.07,
  midMax: 250_000,
  midRate: 0.05,
  highRate: 0.03,
};

export function normalizeApportRateSettings(
  settings?: Partial<ApportRateSettings> | null
): ApportRateSettings {
  const next = { ...DEFAULT_APPORT_RATE_SETTINGS, ...settings };
  const lowMax = Math.max(1, next.lowMax);
  const midMax = Math.max(lowMax + 1, next.midMax);
  const clampRate = (rate: number) =>
    Math.min(1, Math.max(0, Number.isFinite(rate) ? rate : 0));
  return {
    lowMax,
    midMax,
    lowRate: clampRate(next.lowRate),
    midRate: clampRate(next.midRate),
    highRate: clampRate(next.highRate),
  };
}

export function apportRateTiers(settings: ApportRateSettings) {
  const s = normalizeApportRateSettings(settings);
  return [
    {
      rate: s.lowRate,
      label: formatRate(s.lowRate),
      hint: `jusqu’à ${s.lowMax.toLocaleString("fr-FR")} DH`,
    },
    {
      rate: s.midRate,
      label: formatRate(s.midRate),
      hint: `entre ${(s.lowMax + 1).toLocaleString("fr-FR")} et ${s.midMax.toLocaleString("fr-FR")} DH`,
    },
    {
      rate: s.highRate,
      label: formatRate(s.highRate),
      hint: `au-delà de ${s.midMax.toLocaleString("fr-FR")} DH`,
    },
  ];
}

/** Excel: =SI(C6="";"";SI(C6<=100000;7%;SI(C6<=250000;5%;3%))) */
export function commissionRateForContract(
  amount: number,
  settings: ApportRateSettings = DEFAULT_APPORT_RATE_SETTINGS
) {
  const s = normalizeApportRateSettings(settings);
  if (amount <= s.lowMax) return s.lowRate;
  if (amount <= s.midMax) return s.midRate;
  return s.highRate;
}

/** Excel: =SI(C6="";"";C6*D6) */
export function commissionDueForContract(
  amount: number,
  settings: ApportRateSettings = DEFAULT_APPORT_RATE_SETTINGS
) {
  return Math.round(amount * commissionRateForContract(amount, settings));
}

/** Excel: =SI(E6="";"";E6-F6) */
export function remainingToPay(commissionDue: number, depositReceived: number) {
  return Math.round(commissionDue - depositReceived);
}

function clampRate(rate: number) {
  return Math.min(1, Math.max(0, Number.isFinite(rate) ? rate : 0));
}

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
  const rate = isCustomRate ? clampRate(args.customRate!) : defaultRate;
  const commissionDue = Math.round(amount * rate);
  const deposit = args.depositReceived ?? 0;
  return {
    rate,
    defaultRate,
    isCustomRate,
    commissionDue,
    remaining: remainingToPay(commissionDue, deposit),
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

export function formatPercentInput(rate: number) {
  const pct = rate * 100;
  return Number.isInteger(pct)
    ? String(pct)
    : pct.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

export function formatAmountInput(amount: number | null | undefined) {
  if (amount == null || !Number.isFinite(amount)) return "";
  return amount.toLocaleString("fr-FR");
}
