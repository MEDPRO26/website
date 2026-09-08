import type { Metadata } from "next";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import type { CitySlug } from "@/lib/cities";
import { getProductBySlug, getProductsByCity } from "@/lib/products";
import type { Product } from "@/lib/product-types";
import {
  parseVenteProductUrlSlug,
  venteProductPath,
  venteProductUrlSlug,
} from "@/lib/routes";
import {
  formatVenteProductMetaDescription,
  formatVenteProductMetaTitle,
} from "@/lib/vente-product-seo";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export function venteCityProductStaticParams(citySlug: CitySlug) {
  return getProductsByCity(citySlug).map((product) => ({
    slug: venteProductUrlSlug(product.slug, citySlug),
  }));
}

export function resolveVenteCityProduct(
  urlSlug: string,
  citySlug: CitySlug
): Product | null {
  const baseSlug = parseVenteProductUrlSlug(urlSlug, citySlug);
  if (!baseSlug) return null;
  return getProductBySlug(baseSlug, citySlug) ?? null;
}

export function venteCityProductMetadata(
  urlSlug: string,
  citySlug: CitySlug
): Metadata {
  const product = resolveVenteCityProduct(urlSlug, citySlug);
  if (!product) return {};

  const path = venteProductPath(product.slug, citySlug);
  const title = formatVenteProductMetaTitle(product.name, citySlug);
  const description = formatVenteProductMetaDescription(
    product.name,
    citySlug
  );

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: [{ url: `${siteUrl}${product.image}`, alt: product.alt }],
    },
  };
}
