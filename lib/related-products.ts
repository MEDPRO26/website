import { catalogProducts } from "@/lib/catalog-products";
import type { Product } from "@/lib/product-types";

/** Curated cross-links for flagship items (CPAP ecosystem, oxygène, etc.). */
const curatedRelatedSlugs: Partial<Record<string, string[]>> = {
  "resmed-airsense-s11-autoset-cpap": [
    "masques-cpap-airfit-resmed",
    "lumis-150-vni-resmed",
  ],
  "masques-cpap-airfit-resmed": ["resmed-airsense-s11-autoset-cpap"],
  "lumis-150-vni-resmed": [
    "resmed-airsense-s11-autoset-cpap",
    "masques-cpap-airfit-resmed",
  ],
  "inogen-rove-g6": [
    "concentrateur-oxygene-5l",
    "concentrateur-5l-silencieux-nebuliseur",
  ],
  "concentrateur-oxygene-5l": [
    "inogen-rove-g6",
    "concentrateur-5l-silencieux-nebuliseur",
  ],
  "concentrateur-5l-silencieux-nebuliseur": [
    "inogen-rove-g6",
    "concentrateur-oxygene-5l",
    "beurer-nebuliseur-ih-21",
  ],
  "concentrateur-oxygene-10l-optimium": [
    "concentrateur-oxygene-10l-nebuliseur",
    "inogen-rove-g6",
  ],
  "concentrateur-oxygene-10l-nebuliseur": [
    "concentrateur-oxygene-10l-optimium",
    "concentrateur-oxygene-5l",
  ],
};

export function resolveRelatedProducts(
  product: Product,
  limit = 3
): Product[] {
  const curated = curatedRelatedSlugs[product.slug];
  if (curated?.length) {
    return curated
      .map((slug) => catalogProducts.find((item) => item.slug === slug))
      .filter(
        (item): item is Product =>
          item !== undefined && item.slug !== product.slug
      )
      .slice(0, limit);
  }

  if (product.related.length > 0) {
    return product.related
      .map((item) => catalogProducts.find((p) => p.slug === item.slug))
      .filter((item): item is Product => item !== undefined)
      .slice(0, limit);
  }

  return catalogProducts
    .filter(
      (item) => item.slug !== product.slug && item.category === product.category
    )
    .slice(0, limit);
}

export function hasCuratedRelatedProducts(slug: string): boolean {
  return Boolean(curatedRelatedSlugs[slug]?.length);
}
