import { computeCommission, computeFinalPrice, supplierTotal } from "./pricing";

export type QuoteLike = {
  basePrice: number;
  deliveryFee: number;
  installFee: number;
  otherFee: number;
  commissionPct: number;
  commissionAmount?: number;
};

/** Client pays supplier line totals; commission is declared separately by supplier. */
export function getQuotePricing(quote: QuoteLike) {
  const supplierTotalAmount = supplierTotal(quote);
  const usesDeclaredCommission = quote.commissionAmount !== undefined;

  if (usesDeclaredCommission) {
    return {
      supplierTotal: supplierTotalAmount,
      commissionAmount: quote.commissionAmount!,
      finalPrice: supplierTotalAmount,
      commissionPct: 0,
      usesDeclaredCommission: true as const,
    };
  }

  const commissionAmount = computeCommission(
    supplierTotalAmount,
    quote.commissionPct
  );
  return {
    supplierTotal: supplierTotalAmount,
    commissionAmount,
    finalPrice: computeFinalPrice(supplierTotalAmount, quote.commissionPct),
    commissionPct: quote.commissionPct,
    usesDeclaredCommission: false as const,
  };
}
