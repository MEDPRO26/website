import type { OrderStatus } from "@/lib/crm/mock-data";
import { STATUS_LABEL } from "@/lib/crm/mock-data";

export { STATUS_LABEL as ORDER_STATUS_LABELS };

export const ALL_ORDER_STATUSES = Object.keys(STATUS_LABEL) as OrderStatus[];

/** Main CRM pipeline steps shown in kanban and status picker. */
export const WORKFLOW_STATUSES: OrderStatus[] = [
  "nouvelle",
  "envoyee_fournisseur",
  "prix_recu",
  "offre_envoyee",
  "acceptee",
  "en_cours",
  "terminee",
  "annulee",
];

/** Visible Kanban columns in the admin orders board. */
export const KANBAN_COLUMNS: OrderStatus[] = WORKFLOW_STATUSES;

export function kanbanColumnForStatus(status: OrderStatus): OrderStatus {
  switch (status) {
    case "a_qualifier":
    case "a_affecter":
      return "nouvelle";
    case "vue_fournisseur":
      return "envoyee_fournisseur";
    case "planifiee":
      return "acceptee";
    case "location_active":
    case "reclamation":
      return "en_cours";
    default:
      return status;
  }
}

const SUPPLIER_STATUS_LABEL_OVERRIDES: Partial<Record<OrderStatus, string>> = {
  envoyee_fournisseur: "Prix non envoyé",
  vue_fournisseur: "Prix non envoyé",
  prix_recu: "Prix envoyé à SOS Santé",
  terminee: "Commande livrée",
};

export const SUPPLIER_STATUS_LABELS = SUPPLIER_STATUS_LABEL_OVERRIDES;

export function getSupplierStatusLabel(status: OrderStatus): string {
  return SUPPLIER_STATUS_LABEL_OVERRIDES[status] ?? STATUS_LABEL[status];
}

export const SUGGESTED_NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  nouvelle: ["annulee"],
  a_qualifier: ["nouvelle", "annulee"],
  a_affecter: ["nouvelle", "envoyee_fournisseur", "annulee"],
  envoyee_fournisseur: ["vue_fournisseur", "prix_recu", "nouvelle", "annulee"],
  vue_fournisseur: ["prix_recu", "envoyee_fournisseur", "annulee"],
  prix_recu: ["offre_envoyee", "envoyee_fournisseur", "annulee"],
  offre_envoyee: ["acceptee", "prix_recu", "annulee"],
  acceptee: ["planifiee", "en_cours", "annulee"],
  planifiee: ["en_cours", "acceptee", "annulee"],
  en_cours: ["location_active", "terminee", "reclamation", "annulee"],
  location_active: ["terminee", "reclamation", "annulee"],
  terminee: ["reclamation"],
  annulee: ["nouvelle"],
  reclamation: ["en_cours", "location_active", "terminee", "annulee"],
};
