export function buildOrderRef(sequence: number) {
  const year = new Date().getFullYear();
  return `SOS-${year}-${String(sequence).padStart(4, "0")}`;
}

export function normalizePhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (digits.startsWith("0")) {
    digits = `212${digits.slice(1)}`;
  }
  return digits;
}

export function phoneLookupVariants(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return [];
  }
  const variants = new Set<string>([normalized]);
  if (normalized.startsWith("212")) {
    variants.add(`0${normalized.slice(3)}`);
    variants.add(`+${normalized}`);
  }
  return [...variants];
}
