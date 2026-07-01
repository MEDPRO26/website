import type { OrderStatus } from "@/lib/crm/mock-data";
import { STATUS_LABEL } from "@/lib/crm/mock-data";

export { STATUS_LABEL as ORDER_STATUS_LABELS };

export const ALL_ORDER_STATUSES = Object.keys(STATUS_LABEL) as OrderStatus[];

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
