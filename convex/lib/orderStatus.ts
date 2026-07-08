import type { Doc } from "../_generated/dataModel";

export type OrderStatus = Doc<"orders">["status"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle demande",
  a_qualifier: "client confirme",
  a_affecter: "Nouvelle demande",
  envoyee_fournisseur: "Envoyée fournisseur",
  vue_fournisseur: "Vue fournisseur",
  prix_recu: "Prix reçu",
  offre_envoyee: "Offre envoyée",
  acceptee: "Prix accepté",
  planifiee: "Planifiée",
  en_cours: "En cours de livraison",
  location_active: "Location active",
  terminee: "Commande livrée",
  annulee: "Annulée",
  reclamation: "Réclamation ouverte",
};

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

export function formatStatusChange(from: OrderStatus, to: OrderStatus) {
  return `Statut : ${ORDER_STATUS_LABELS[from]} → ${ORDER_STATUS_LABELS[to]}`;
}

const SUPPLIER_CLIENT_CONTACT_STATUSES = new Set<OrderStatus>([
  "acceptee",
  "planifiee",
  "en_cours",
  "location_active",
  "terminee",
  "reclamation",
]);

/** Supplier may see client name and phone once the client accepts the offer. */
export function supplierCanSeeClientContact(status: OrderStatus) {
  return SUPPLIER_CLIENT_CONTACT_STATUSES.has(status);
}
