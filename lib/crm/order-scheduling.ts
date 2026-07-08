/** Duration, desired date and time slot apply to rental and care services, not product sales. */
export function orderShowsSchedulingFields(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("vente")) {
    return false;
  }
  return (
    lower.includes("location") ||
    lower.includes("service") ||
    lower.includes("soin") ||
    lower.includes("garde") ||
    lower.includes("aide") ||
    lower.includes("domicile")
  );
}

const SUPPLIER_DELIVERY_STATUSES = new Set([
  "acceptee",
  "planifiee",
  "en_cours",
  "location_active",
]);

/** Supplier should contact the client to deliver or perform the service. */
export function supplierShouldDeliverOrder(status: string) {
  return SUPPLIER_DELIVERY_STATUSES.has(status);
}
