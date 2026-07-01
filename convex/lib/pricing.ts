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

/** Client price from quote — declared commission model uses line total only. */
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

export function buildDefaultOfferMessage(args: {
  clientFirstName: string;
  item: string;
  finalPrice: number;
  desiredDate?: string;
  slot?: string;
}) {
  const availability =
    args.desiredDate && args.slot
      ? `${args.desiredDate} (${args.slot})`
      : args.desiredDate ?? "à confirmer";

  return `Bonjour ${args.clientFirstName},

Voici notre offre pour ${args.item} :
— Prix : ${formatMad(args.finalPrice)} (livraison & installation incluses)
— Disponibilité : ${availability}

Merci de confirmer pour planification.
Équipe SOS Santé Agadir`;
}
