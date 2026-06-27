import { notFound } from "next/navigation";
import type { Metadata } from "next";
import VenteCatalog from "@/components/vente-catalog";
import { catalogCategories } from "@/lib/catalog-categories";
import {
  buildVenteCityMetadata,
  validateVenteCategory,
} from "@/lib/vente-metadata";

const citySlug = "agadir" as const;

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
  if (!validateVenteCategory(category)) return {};
  return buildVenteCityMetadata(citySlug, category);
}

export default async function VenteAgadirCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!validateVenteCategory(category)) notFound();
  return <VenteCatalog citySlug={citySlug} categorySlug={category} />;
}
