export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

/** Public categories exposed to SEO Nexus via GET /api/categories */
export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "conseil", name: "Conseil", slug: "conseil" },
  { id: "guide", name: "Guide", slug: "guide" },
  { id: "respiratoire", name: "Respiratoire", slug: "respiratoire" },
  { id: "mobilite", name: "Mobilité", slug: "mobilite" },
  { id: "confort", name: "Confort", slug: "confort" },
  { id: "soins", name: "Soins à domicile", slug: "soins" },
  { id: "actualite", name: "Actualité", slug: "actualite" },
];

export function categoryLabel(slug: string) {
  return (
    BLOG_CATEGORIES.find((category) => category.slug === slug)?.name ?? slug
  );
}
