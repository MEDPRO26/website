import type { Doc } from "../_generated/dataModel";

export type OrderStatus = Doc<"orders">["status"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle demande",
  a_qualifier: "client confirme",
  a_affecter: "À affecter",
  envoyee_fournisseur: "Envoyée fournisseur",
  vue_fournisseur: "Vue fournisseur",
  prix_recu: "Prix reçu",
  offre_envoyee: "Offre envoyée",
  acceptee: "Acceptée client",
  planifiee: "Planifiée",
  en_cours: "En cours",
  location_active: "Location active",
  terminee: "Terminée",
  annulee: "Annulée",
  reclamation: "Réclamation ouverte",
};

export const SUGGESTED_NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  nouvelle: ["a_qualifier", "a_affecter", "annulee"],
  a_qualifier: ["a_affecter", "nouvelle", "annulee"],
  a_affecter: ["envoyee_fournisseur", "annulee"],
  envoyee_fournisseur: ["vue_fournisseur", "prix_recu", "a_affecter", "annulee"],
  vue_fournisseur: ["prix_recu", "envoyee_fournisseur", "annulee"],
  prix_recu: ["offre_envoyee", "envoyee_fournisseur", "annulee"],
  offre_envoyee: ["acceptee", "prix_recu", "annulee"],
  acceptee: ["planifiee", "en_cours", "annulee"],
  planifiee: ["en_cours", "acceptee", "annulee"],
  en_cours: ["location_active", "terminee", "reclamation", "annulee"],
  location_active: ["terminee", "reclamation", "annulee"],
  terminee: ["reclamation"],
  annulee: ["nouvelle", "a_qualifier"],
  reclamation: ["en_cours", "location_active", "terminee", "annulee"],
};

export function formatStatusChange(from: OrderStatus, to: OrderStatus) {
  return `Statut : ${ORDER_STATUS_LABELS[from]} → ${ORDER_STATUS_LABELS[to]}`;
}
