import type { Metadata } from "next";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import {
  hubCityPath,
  venteCategoryPath,
  venteCityPath,
} from "@/lib/routes";
import { catalogCategories } from "@/lib/catalog-categories";

export function createVenteCityMetadata(citySlug: CitySlug): Metadata {
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  const path = venteCityPath(citySlug);
  const title = `Vente matériel médical ${city.name} | SOS Santé`;
  const description = `Achetez du matériel médical à ${city.name} : mobilité, respiratoire, diagnostic, instruments et confort. Catalogue local avec livraison.`;

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
      siteName: city.brandName,
    },
  };
}

export function createVenteCategoryMetadata(
  citySlug: CitySlug,
  categoryParam: string
): Metadata {
  const city = getCityBySlug(citySlug);
  const categoryMeta = catalogCategories.find(
    (category) => category.param === categoryParam
  );
  if (!city || !categoryMeta) return {};

  const path = venteCategoryPath(categoryParam, citySlug);
  const title = `Vente ${categoryMeta.label.toLowerCase()} ${city.name} | SOS Santé`;
  const description = `Achetez du matériel ${categoryMeta.label.toLowerCase()} à ${city.name}. Catalogue SOS Santé ${city.name} avec livraison locale.`;

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
      siteName: city.brandName,
    },
  };
}

export function createHubMetadata(citySlug: CitySlug): Metadata {
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  const path = hubCityPath(citySlug);
  const title = `Location et vente matériel médical ${city.name} | SOS Santé`;
  const description = `SOS Santé ${city.name} : location et vente de matériel médical à domicile. Lits, fauteuils roulants, oxygène. Livraison à ${city.name} et environs.`;

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
      siteName: city.brandName,
    },
  };
}
