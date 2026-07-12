export function supplierTotal(args: {
  basePrice: number;
  deliveryFee: number;
  installFee: number;
  otherFee: number;
}) {
  return args.basePrice + args.deliveryFee + args.installFee + args.otherFee;
}

export function computeCommission(supplierTotalAmount: number, commissionPct: number) {
  return Math.round(supplierTotalAmount * commissionPct / 100);
}

export function computeFinalPrice(supplierTotalAmount: number, commissionPct: number) {
  return supplierTotalAmount + computeCommission(supplierTotalAmount, commissionPct);
}

/** Client price from quote - declared commission model uses line total only. */
export function clientPriceFromQuote(args: {
  basePrice: number;
  deliveryFee: number;
  installFee: number;
  otherFee: number;
  commissionAmount?: number;
  commissionPct: number;
}) {
  const total = supplierTotal(args);
  if (args.commissionAmount !== undefined) {
    return total;
  }
  return computeFinalPrice(total, args.commissionPct);
}

export function commissionFromQuote(args: {
  basePrice: number;
  deliveryFee: number;
  installFee: number;
  otherFee: number;
  commissionAmount?: number;
  commissionPct: number;
}) {
  const total = supplierTotal(args);
  if (args.commissionAmount !== undefined) {
    return args.commissionAmount;
  }
  return computeCommission(total, args.commissionPct);
}

export function formatMad(amount: number) {
  return `${amount.toLocaleString("fr-FR")} MAD`;
}

export function formatRequestTypeLabel(requestType: string) {
  const normalized = requestType.trim().toLowerCase();
  if (normalized.includes("vente")) {
    return "vente de matériel médical";
  }
  if (normalized.includes("location")) {
    return "location de matériel médical";
  }
  if (normalized.includes("service")) {
    return "service à domicile";
  }
  return requestType.trim() || "demande";
}

function productOrServiceLabel(requestType: string) {
  const normalized = requestType.trim().toLowerCase();
  return normalized.includes("service") ? "Service" : "Produit";
}

export function buildDefaultOfferMessage(args: {
  clientFirstName: string;
  requestType: string;
  item: string;
  finalPrice: number;
  duration?: string;
  desiredDate?: string;
  slot?: string;
}) {
  const requestLabel = formatRequestTypeLabel(args.requestType);
  const itemLabel = productOrServiceLabel(args.requestType);
  const availability =
    args.desiredDate && args.slot
      ? `${args.desiredDate} (${args.slot})`
      : args.desiredDate ?? "à confirmer";

  const lines = [
    `Bonjour ${args.clientFirstName},`,
    "",
    `Suite à votre demande de ${requestLabel} :`,
    `- ${itemLabel} : ${args.item}`,
  ];

  if (args.duration?.trim()) {
    lines.push(`- Durée : ${args.duration.trim()}`);
  }

  lines.push(
    `- Prix : ${formatMad(args.finalPrice)} (livraison & installation incluses)`,
    `- Disponibilité : ${availability}`,
    "",
    "Merci de confirmer pour planification.",
    "Équipe SOS Santé Agadir"
  );

  return lines.join("\n");
}
