import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoCityPage } from "@/components/seo-page-template";
import { HERO_IMAGE, SITE_URL_DEFAULT } from "@/lib/brand";
import { getLocationRentalProducts } from "@/lib/location-rental-products";
import { getCityBySlug } from "@/lib/seo-data";

const citySlug = "location-materiel-medical-agadir";
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    keywords: city.keywords,
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
      images: [{ url: `${siteUrl}${HERO_IMAGE}` }],
    },
  };
}

export default function AgadirLocationPage() {
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  return <SeoCityPage city={city} products={getLocationRentalProducts()} />;
}
