import type { Metadata } from "next";
import CityHubPage, { buildCityHubMetadata } from "@/components/city-hub-page";

const citySlug = "marrakech" as const;

export const metadata: Metadata = buildCityHubMetadata(citySlug);

export default function MarrakechCityPage() {
  return <CityHubPage citySlug={citySlug} />;
}
