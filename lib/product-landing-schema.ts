import type { ProductLandingContent } from "@/lib/product-landing-pages";
import { resolveRelatedProducts } from "@/lib/related-products";
import { venteProductPath } from "@/lib/routes";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  itemListSchema,
  localBusinessSchema,
  webPageSchema,
} from "@/lib/schema";

export function buildProductLandingSchema(content: ProductLandingContent) {
  const { product, path } = content;
  const related = resolveRelatedProducts(product);

  const nodes: Record<string, unknown>[] = [
    webPageSchema(path, content.metaTitle, content.metaDescription),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: "Matériel respiratoire", item: "/materiel-respiratoire" },
      { name: product.shortName, item: path },
    ]),
    faqSchema(content.faqs, path),
    localBusinessSchema({
      businessId: "maroc",
      path,
      name: "SOS Santé",
      description: content.metaDescription,
      addressLocality: "Maroc",
      areaServed: [{ "@type": "Country", name: "Maroc" }],
    }),
  ];

  if (related.length > 0) {
    nodes.push(
      itemListSchema(
        "Produits associés",
        path,
        related.map((item) => ({
          name: item.name,
          url: venteProductPath(item.slug),
        }))
      )
    );
  }

  return buildGraph(...nodes);
}
