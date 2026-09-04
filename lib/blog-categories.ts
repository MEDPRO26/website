export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

/** Public categories for SOS Santé blog + SEO Nexus via GET /api/categories */
export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "guide", name: "Guide", slug: "guide" },
  { id: "respiratoire", name: "Respiratoire", slug: "respiratoire" },
  { id: "mobilite", name: "Mobilité", slug: "mobilite" },
  { id: "confort", name: "Confort", slug: "confort" },
  { id: "soins", name: "Soins à domicile", slug: "soins" },
  { id: "location", name: "Location", slug: "location" },
  { id: "famille-aidants", name: "Famille & aidants", slug: "famille-aidants" },
];

export function categoryLabel(slug: string) {
  return (
    BLOG_CATEGORIES.find((category) => category.slug === slug)?.name ?? slug
  );
}
