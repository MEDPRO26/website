import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoCityPage } from "@/components/seo-page-template";
import { getLocationRentalProducts } from "@/lib/location-rental-products";
import { getCityBySlug } from "@/lib/seo-data";

const citySlug = "location-materiel-medical-marrakech";

export async function generateMetadata(): Promise<Metadata> {
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    keywords: city.keywords,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${citySlug}`,
    },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: `/${citySlug}`,
      type: "website",
      locale: "fr_MA",
      siteName: "SOS Santé",
    },
  };
}

export default function CityPage() {
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  return <SeoCityPage city={city} products={getLocationRentalProducts()} />;
}
