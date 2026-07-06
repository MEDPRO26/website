import { categoryParamFromValue } from "@/lib/catalog-categories";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import type { Product } from "@/lib/product-types";
import { resolveRelatedProducts } from "@/lib/related-products";
import { hubCityPath, venteCategoryPath, venteProductPath } from "@/lib/routes";
import { productPageGraph } from "@/lib/schema";

export function buildProductPageSchema(product: Product, citySlug: CitySlug) {
  const city = getCityBySlug(citySlug)!;
  const productPath = venteProductPath(product.slug, citySlug);
  const hubPath = hubCityPath(citySlug);
  const hubLabel = `Location et vente de matériel médical à ${city.name}`;
  const categoryParam = categoryParamFromValue(product.category);
  const categoryCrumb = categoryParam
    ? {
        label: product.category,
        path: venteCategoryPath(categoryParam, citySlug),
      }
    : undefined;

  return productPageGraph(
    product,
    productPath,
    hubPath,
    hubLabel,
    resolveRelatedProducts(product),
    (relatedSlug) => venteProductPath(relatedSlug, citySlug),
    categoryCrumb
  );
}
