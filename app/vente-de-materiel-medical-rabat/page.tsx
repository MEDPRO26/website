import type { Metadata } from "next";
import VenteCatalog from "@/components/vente-catalog";
import { buildVenteCityMetadata } from "@/lib/vente-metadata";

const citySlug = "rabat" as const;

export const metadata: Metadata = buildVenteCityMetadata(citySlug);

export default function VenteRabatPage() {
  return <VenteCatalog citySlug={citySlug} categorySlug={null} />;
}
