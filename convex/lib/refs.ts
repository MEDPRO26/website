export function buildOrderRef(sequence: number) {
  const year = new Date().getFullYear();
  return `S2M-${year}-${String(sequence).padStart(4, "0")}`;
}

/**
 * Canonical Moroccan phone: digits only with country code 212.
 * Accepts 00212…, +212…, 0…, and bare 9-digit national numbers.
 */
export function normalizePhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  // International access code (00…)
  while (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("212")) {
    return digits;
  }

  // Local trunk prefix 0XXXXXXXXX → 212XXXXXXXXX
  if (digits.startsWith("0")) {
    return `212${digits.slice(1)}`;
  }

  // Bare national mobile/landline (9 digits)
  if (digits.length === 9) {
    return `212${digits}`;
  }

  return digits;
}

/** All common spellings that may already exist in the DB for the same number. */
export function phoneLookupVariants(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return [];
  }

  const variants = new Set<string>([normalized]);
  const trimmed = phone.trim();
  if (trimmed) {
    variants.add(trimmed);
    variants.add(trimmed.replace(/\s+/g, ""));
  }

  if (normalized.startsWith("212") && normalized.length > 3) {
    const national = normalized.slice(3);
    variants.add(national);
    variants.add(`0${national}`);
    variants.add(`+${normalized}`);
    variants.add(`00${normalized}`);
    variants.add(`+212${national}`);
    variants.add(`00212${national}`);
  }

  return [...variants];
}
