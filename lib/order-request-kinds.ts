import { careServiceFormOptions } from "@/lib/care-services";
import { catalogProducts } from "@/lib/catalog-products";

export type OrderRequestKind = "vente" | "location" | "service";

export const ORDER_REQUEST_KIND_OPTIONS: {
  value: OrderRequestKind;
  label: string;
}[] = [
  { value: "vente", label: "Vente matériel médical" },
  { value: "location", label: "Location matériel médical" },
  { value: "service", label: "Service à domicile" },
];

export const ORDER_REQUEST_KIND_LABEL: Record<OrderRequestKind, string> = {
  vente: "Vente matériel médical",
  location: "Location matériel médical",
  service: "Service à domicile",
};

/** Location and service are open on public forms and CRM orders. */
export function isOrderRequestKindDisabled(
  kind: OrderRequestKind,
  _options?: { allowService?: boolean }
) {
  return false;
}

export function getOrderRequestKindOptionLabel(
  baseLabel: string,
  kind: OrderRequestKind,
  options?: { allowService?: boolean }
) {
  if (isOrderRequestKindDisabled(kind, options)) {
    return `${baseLabel} - bientôt disponible`;
  }
  return baseLabel;
}

export const RENTAL_MATERIAL_OPTIONS = [
  "Lit médicalisé électrique",
  "Lit médicalisé + matelas anti-escarres",
  "Fauteuil roulant",
  "Concentrateur d'oxygène 5L",
  "Concentrateur d'oxygène 10L",
  "Nébuliseur",
  "Déambulateur",
  "Béquilles",
  "Soulève-malade",
  "Aspirateur chirurgical",
];

export const SALE_PRODUCT_OPTIONS = catalogProducts.map((product) => product.name);

export function orderRequestItemChoices(
  kind: OrderRequestKind,
  options?: { allowService?: boolean }
) {
  if (isOrderRequestKindDisabled(kind, options)) {
    return [];
  }
  if (kind === "vente") {
    return SALE_PRODUCT_OPTIONS;
  }
  if (kind === "service") {
    return careServiceFormOptions;
  }
  return RENTAL_MATERIAL_OPTIONS;
}

export function orderRequestItemLabel(kind: OrderRequestKind) {
  if (kind === "service") {
    return "Service souhaité";
  }
  return "Matériel souhaité";
}

export function orderRequestItemPlaceholder(kind: OrderRequestKind) {
  if (kind === "service") {
    return "Choisir un service";
  }
  return "Choisir un matériel";
}

export function orderRequestOtherItemLabel(kind: OrderRequestKind) {
  if (kind === "service") {
    return "Autre service";
  }
  return "Autre matériel";
}

export function orderShowsSchedulingForKind(kind: OrderRequestKind) {
  return kind === "location" || kind === "service";
}
