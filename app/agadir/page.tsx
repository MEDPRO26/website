import type { Metadata } from "next";
import CityHubPage, { buildCityHubMetadata } from "@/components/city-hub-page";

const citySlug = "agadir" as const;

export const metadata: Metadata = buildCityHubMetadata(citySlug);

export default function AgadirCityPage() {
  return <CityHubPage citySlug={citySlug} />;
}
