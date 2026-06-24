import { notFound } from "next/navigation";
import type { Metadata } from "next";
import VenteCatalog from "@/components/vente-catalog";
import {
  catalogCategories,
  isValidCategoryParam,
} from "@/lib/catalog-categories";
import { venteCategoryPath } from "@/lib/routes";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return catalogCategories
    .filter((category) => category.param !== "all")
    .map((category) => ({ category: category.param }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategoryParam(category)) return {};

  const categoryMeta = catalogCategories.find((item) => item.param === category);
  if (!categoryMeta) return {};

  const path = venteCategoryPath(category);
  const title = `Vente ${categoryMeta.label.toLowerCase()} | SOS Santé`;
  const description = `Achetez du matériel ${categoryMeta.label.toLowerCase()} au Maroc. Catalogue SOS Santé avec livraison à Agadir, Rabat et dans les grandes villes.`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: "fr_MA",
      siteName: "SOS Santé",
    },
  };
}

export default async function VenteCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!isValidCategoryParam(category)) notFound();

  return <VenteCatalog categorySlug={category} />;
}
