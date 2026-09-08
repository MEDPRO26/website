import { getCityBySlug, type CitySlug } from "@/lib/cities";
import { VENTE_MAROC_PATH } from "@/lib/national-pillars";
import type { Product } from "@/lib/product-types";
import { resolveRelatedProducts } from "@/lib/related-products";
import { venteCityPath, venteProductPath } from "@/lib/routes";
import { productPageGraph } from "@/lib/schema";
import {
  formatVenteProductBreadcrumbLabel,
  formatVenteProductMetaDescription,
  formatVenteProductMetaTitle,
  getVenteProductFaqs,
} from "@/lib/vente-product-seo";

export function buildProductPageSchema(product: Product, citySlug: CitySlug) {
  const city = getCityBySlug(citySlug)!;
  const productPath = venteProductPath(product.slug, citySlug);
  const cityVentePath = venteCityPath(citySlug);
  const title = formatVenteProductMetaTitle(product.name, citySlug);
  const description = formatVenteProductMetaDescription(
    product.name,
    citySlug
  );
  const productCrumbLabel = formatVenteProductBreadcrumbLabel(
    product.shortName,
    citySlug
  );

  return productPageGraph(
    product,
    productPath,
    [
      {
        label: "Vente matériel médical Maroc",
        path: VENTE_MAROC_PATH,
      },
      {
        label: `Vente matériel médical ${city.name}`,
        path: cityVentePath,
      },
      {
        label: productCrumbLabel,
        path: productPath,
      },
    ],
    resolveRelatedProducts(product),
    (relatedSlug) => venteProductPath(relatedSlug, citySlug),
    {
      title,
      description,
      faqs: getVenteProductFaqs(product.name, citySlug),
    }
  );
}
