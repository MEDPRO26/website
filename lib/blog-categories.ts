export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

/** Public categories for SOS Santé blog + SEO Nexus via GET /api/categories */
export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "guide",
    name: "Guide",
    slug: "guide",
    description:
      "Guides pratiques pour choisir, comparer et utiliser le matériel médical à domicile.",
  },
  {
    id: "respiratoire",
    name: "Respiratoire",
    slug: "respiratoire",
    description:
      "Concentrateurs d’oxygène, CPAP et oxygénothérapie : location et conseils au Maroc.",
  },
  {
    id: "mobilite",
    name: "Mobilité",
    slug: "mobilite",
    description:
      "Fauteuils roulants, déambulateurs et aides à la marche pour le maintien à domicile.",
  },
  {
    id: "confort",
    name: "Confort",
    slug: "confort",
    description:
      "Lits médicalisés, matelas anti-escarres et confort du patient alité.",
  },
  {
    id: "soins",
    name: "Soins à domicile",
    slug: "soins",
    description:
      "Coordination avec des prestataires partenaires : kiné, infirmier, aide à domicile.",
  },
  {
    id: "location",
    name: "Location",
    slug: "location",
    description:
      "Comment louer du matériel médical : délais, livraison, installation et tarifs.",
  },
  {
    id: "famille-aidants",
    name: "Famille & aidants",
    slug: "famille-aidants",
    description:
      "Conseils pour les familles et aidants qui accompagnent un proche à domicile.",
  },
];

const CATEGORY_BY_SLUG = new Map(
  BLOG_CATEGORIES.map((category) => [category.slug, category])
);

const NAME_TO_SLUG = new Map(
  BLOG_CATEGORIES.flatMap((category) => [
    [category.slug, category.slug],
    [category.name.toLowerCase(), category.slug],
    [category.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), category.slug],
  ])
);

export function isBlogCategorySlug(slug: string): boolean {
  return CATEGORY_BY_SLUG.has(slug.trim().toLowerCase());
}

export function getBlogCategory(slug: string) {
  return CATEGORY_BY_SLUG.get(slug.trim().toLowerCase()) ?? null;
}

export function categoryLabel(slug: string) {
  return getBlogCategory(slug)?.name ?? slug;
}

/** Resolve a stored category name or slug to the canonical URL slug. */
export function resolveCategorySlug(input: string | undefined | null): string {
  const raw = (input ?? "").trim();
  if (!raw) return "guide";
  const lower = raw.toLowerCase();
  if (CATEGORY_BY_SLUG.has(lower)) return lower;
  const fromName = NAME_TO_SLUG.get(lower);
  if (fromName) return fromName;
  const ascii = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return NAME_TO_SLUG.get(ascii) ?? "guide";
}

export function blogCategoryPath(categorySlug: string) {
  return `/blog/${resolveCategorySlug(categorySlug)}`;
}

export function blogPostPath(categorySlug: string, postSlug: string) {
  return `/blog/${resolveCategorySlug(categorySlug)}/${postSlug}`;
}
