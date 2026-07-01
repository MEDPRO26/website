export function buildOrderRef(sequence: number) {
  const year = new Date().getFullYear();
  return `SOS-${year}-${String(sequence).padStart(4, "0")}`;
}

export function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "").trim();
}
