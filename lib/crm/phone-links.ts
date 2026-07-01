export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function whatsAppUrl(phone: string, message?: string) {
  let digits = phoneDigits(phone);
  if (digits.startsWith("0")) {
    digits = `212${digits.slice(1)}`;
  }
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function telUrl(phone: string) {
  const digits = phoneDigits(phone);
  return digits ? `tel:${digits.startsWith("212") ? `+${digits}` : digits}` : "#";
}
