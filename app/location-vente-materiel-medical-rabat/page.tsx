import type { Metadata } from "next";
import CityHubPage, { buildCityHubMetadata } from "@/components/city-hub-page";

const citySlug = "rabat" as const;

export const metadata: Metadata = buildCityHubMetadata(citySlug);

export default function RabatHubPage() {
  return <CityHubPage citySlug={citySlug} />;
}
