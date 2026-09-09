export const WHATSAPP_PLACEMENTS = [
  "navbar",
  "mobile_nav",
  "footer",
  "home_hero",
  "quote",
  "product_vente",
  "product_location",
  "catalog",
  "city_hub",
  "pillar",
  "blog",
  "blog_sidebar",
  "contact",
  "services",
  "care_service",
  "about",
  "other",
] as const;

export type WhatsAppPlacement = (typeof WHATSAPP_PLACEMENTS)[number];

export const WHATSAPP_PLACEMENT_LABELS: Record<WhatsAppPlacement, string> = {
  navbar: "Menu (header)",
  mobile_nav: "Navigation mobile",
  footer: "Pied de page",
  home_hero: "Accueil — hero",
  quote: "Bloc devis",
  product_vente: "Fiche produit (vente)",
  product_location: "Fiche produit (location)",
  catalog: "Catalogue",
  city_hub: "Hub ville",
  pillar: "Guide national",
  blog: "Article blog",
  blog_sidebar: "Sidebar blog",
  contact: "Page contact",
  services: "Page services",
  care_service: "Service à domicile",
  about: "À propos",
  other: "Autre",
};

export function whatsappPlacementLabel(placement: string) {
  return (
    WHATSAPP_PLACEMENT_LABELS[placement as WhatsAppPlacement] ?? placement
  );
}
