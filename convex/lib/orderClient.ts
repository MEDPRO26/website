import type { Doc } from "../_generated/dataModel";

export function resolveOrderClientName(
  order: Pick<Doc<"orders">, "clientName">,
  customer?: Pick<Doc<"customers">, "name"> | null
) {
  const snapshot = order.clientName?.trim();
  if (snapshot) {
    return snapshot;
  }
  return customer?.name?.trim() || "—";
}

export function resolveOrderClientFirstName(
  order: Pick<Doc<"orders">, "clientName">,
  customer?: Pick<Doc<"customers">, "name"> | null
) {
  const fullName = resolveOrderClientName(order, customer);
  return fullName.split(/\s+/)[0] || "client";
}
