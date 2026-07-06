import type { Metadata } from "next";
import CityHubPage, { buildCityHubMetadata } from "@/components/city-hub-page";

const citySlug = "casablanca" as const;

export const metadata: Metadata = buildCityHubMetadata(citySlug);

export default function CasablancaCityPage() {
  return <CityHubPage citySlug={citySlug} />;
}
