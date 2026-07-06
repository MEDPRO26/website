import { categoryValueFromParam } from "@/lib/catalog-categories";
import type { CitySlug } from "@/lib/cities";
import { getProductsByCity } from "@/lib/products";
import { hubCityPath, venteCityPath, venteProductPath } from "@/lib/routes";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  itemListSchema,
  localBusinessSchema,
  webPageSchema,
} from "@/lib/schema";
import { getVenteCatalogPageInfo } from "@/lib/vente-metadata";
import { getVenteCatalogFaqs } from "@/lib/vente-faqs";

export function buildVenteCatalogGraph(
  citySlug: CitySlug,
  categoryParam?: string | null
) {
  const { city, categoryMeta, path, title, description, listName } =
    getVenteCatalogPageInfo(citySlug, categoryParam);
  const hubPath = hubCityPath(citySlug);
  const catalogBasePath = venteCityPath(citySlug);

  const activeCategory = categoryValueFromParam(categoryParam ?? null);
  const products = getProductsByCity(citySlug).filter(
    (product) => activeCategory === "all" || product.category === activeCategory
  );

  const breadcrumbItems =
    activeCategory === "all"
      ? [
          { name: "Accueil", item: "/" },
          {
            name: `Location et vente à ${city.name}`,
            item: hubPath,
          },
          {
            name: `Vente matériel médical ${city.name}`,
            item: path,
          },
        ]
      : [
          { name: "Accueil", item: "/" },
          {
            name: `Location et vente à ${city.name}`,
            item: hubPath,
          },
          { name: `Vente ${city.name}`, item: catalogBasePath },
          {
            name: categoryMeta?.label ?? "Catégorie",
            item: path,
          },
        ];

  return buildGraph(
    webPageSchema(path, title, description, "CollectionPage"),
    breadcrumbSchema(breadcrumbItems),
    localBusinessSchema({
      citySlug,
      path,
      name: city.brandName,
      description,
      telephone: city.contactReady ? city.phone : undefined,
      addressLocality: city.name,
      areaServed: city.zones.map((zone) => ({ "@type": "City", name: zone })),
    }),
    itemListSchema(
      listName,
      path,
      products.map((product) => ({
        name: product.name,
        url: venteProductPath(product.slug, citySlug),
      }))
    ),
    faqSchema(getVenteCatalogFaqs(citySlug), path)
  );
}
