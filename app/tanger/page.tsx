import type { Metadata } from "next";
import CityHubPage, { buildCityHubMetadata } from "@/components/city-hub-page";

const citySlug = "tanger" as const;

export const metadata: Metadata = buildCityHubMetadata(citySlug);

export default function TangerCityPage() {
  return <CityHubPage citySlug={citySlug} />;
}
