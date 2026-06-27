import type { Metadata } from "next";
import {
  catalogCategories,
  isValidCategoryParam,
} from "@/lib/catalog-categories";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import { venteCategoryPath, venteCityPath } from "@/lib/routes";

export function buildVenteCityMetadata(
  citySlug: CitySlug,
  categoryParam?: string | null
): Metadata {
  const city = getCityBySlug(citySlug)!;
  const categoryMeta = categoryParam
    ? catalogCategories.find((item) => item.param === categoryParam)
    : null;

  const path = categoryParam
    ? venteCategoryPath(categoryParam, citySlug)
    : venteCityPath(citySlug);

  const title = categoryMeta
    ? `Vente ${categoryMeta.label.toLowerCase()} ${city.name} | SOS Santé`
    : `Vente matériel médical ${city.name} | SOS Santé`;

  const description = categoryMeta
    ? `Achetez du matériel ${categoryMeta.label.toLowerCase()} à ${city.name}. Catalogue SOS Santé avec livraison locale.`
    : `Achetez du matériel médical à ${city.name} : mobilité, respiratoire, diagnostic, instruments. ${city.deliveryText}`;

  return {
    title,
    description,
    alternates: { canonical: path },
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

export function validateVenteCategory(category: string) {
  return isValidCategoryParam(category) && category !== "produits";
}
