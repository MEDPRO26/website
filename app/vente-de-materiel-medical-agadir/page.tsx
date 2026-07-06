import { notFound } from "next/navigation";
import type { Metadata } from "next";
import VenteCatalog from "@/components/vente-catalog";
import VenteCatalogJsonLd from "@/components/vente-catalog-json-ld";
import { buildVenteCityMetadata } from "@/lib/vente-metadata";

const citySlug = "agadir" as const;

export const metadata: Metadata = buildVenteCityMetadata(citySlug);

export default function VenteAgadirPage() {
  return (
    <>
      <VenteCatalogJsonLd citySlug={citySlug} />
      <VenteCatalog citySlug={citySlug} categorySlug={null} />
    </>
  );
}
