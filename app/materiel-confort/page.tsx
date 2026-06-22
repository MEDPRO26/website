import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoCategoryPage } from "@/components/seo-page-template";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/seo-data";

const categorySlug = "materiel-confort";

export async function generateMetadata(): Promise<Metadata> {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    keywords: category.keywords,
    alternates: {
      canonical: `/${categorySlug}`,
    },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `/${categorySlug}`,
      type: "website",
      locale: "fr_MA",
      siteName: "MediDomicile",
    },
  };
}

export default function CategoryPage() {
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.value);

  return <SeoCategoryPage category={category} products={categoryProducts} />;
}
