import JsonLd from "@/components/json-ld";
import type { CitySlug } from "@/lib/cities";
import { buildVenteCatalogGraph } from "@/lib/vente-catalog-schema";

type VenteCatalogJsonLdProps = {
  citySlug: CitySlug;
  categorySlug?: string | null;
};

export default function VenteCatalogJsonLd({
  citySlug,
  categorySlug = null,
}: VenteCatalogJsonLdProps) {
  return <JsonLd data={buildVenteCatalogGraph(citySlug, categorySlug)} />;
}
