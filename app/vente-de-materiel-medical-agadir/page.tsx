import { notFound } from "next/navigation";
import type { Metadata } from "next";
import VenteCatalog from "@/components/vente-catalog";
import { buildVenteCityMetadata } from "@/lib/vente-metadata";

const citySlug = "agadir" as const;

export const metadata: Metadata = buildVenteCityMetadata(citySlug);

export default function VenteAgadirPage() {
  return <VenteCatalog citySlug={citySlug} categorySlug={null} />;
}
