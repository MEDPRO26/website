import type { Doc } from "@/convex/_generated/dataModel";
import type { Order } from "@/lib/crm/mock-data";

type OrderWithCustomer = Doc<"orders"> & {
  customer: Doc<"customers"> | null;
  assignedStaffName: string | null;
  supplierName?: string | null;
};

export function mapConvexOrderToUi(order: OrderWithCustomer): Order {
  const customer = order.customer;

  return {
    id: order._id,
    ref: order.ref,
    client: customer?.name ?? "—",
    phone: customer?.phone ?? "—",
    whatsapp: customer?.whatsapp ?? customer?.phone ?? "—",
    city: customer?.city ?? "—",
    district: customer?.district ?? "",
    address: customer?.address ?? "",
    type: order.type,
    item: order.item,
    duration: order.duration ?? "",
    desiredDate: order.desiredDate ?? "",
    slot: order.slot ?? "",
    source: order.source,
    status: order.status,
    supplier: order.supplierName ?? undefined,
    assistant: order.assignedStaffName ?? "Non assigné",
    createdAt: new Date(order.createdAt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    message: order.message ?? "",
    notes: order.notes,
  };
}

export function formatEventTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
