export const COMMISSION_PAYMENT_METHODS = [
  { value: "versement_bancaire", label: "Versement bancaire" },
  { value: "virement_bancaire", label: "Virement bancaire" },
  { value: "especes_en_main", label: "Espèces en main" },
] as const;

export type CommissionPaymentMethod =
  (typeof COMMISSION_PAYMENT_METHODS)[number]["value"];

export function commissionPaymentRequiresReceipt(
  method: CommissionPaymentMethod | ""
) {
  return method === "versement_bancaire" || method === "virement_bancaire";
}

export function commissionPaymentLabel(method?: string | null) {
  return (
    COMMISSION_PAYMENT_METHODS.find((entry) => entry.value === method)?.label ??
    "—"
  );
}
