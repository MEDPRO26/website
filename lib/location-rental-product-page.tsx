import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import LocationProductDetail from "@/components/location-product-detail";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import type { CitySlug } from "@/lib/cities";
import { getCityBySlug } from "@/lib/cities";
import {
  getAllLocationRentalSlugs,
  getLocationRentalProductBySlug,
} from "@/lib/location-rental-products";
import { locationCityPath, locationRentalProductPath } from "@/lib/routes";
import {
  breadcrumbSchema,
  buildGraph,
  productSchema,
  webPageSchema,
} from "@/lib/schema";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function createLocationProductPage(citySlug: CitySlug) {
  const city = getCityBySlug(citySlug)!;

  function generateStaticParams() {
    return getAllLocationRentalSlugs().map((slug) => ({ slug }));
  }

  async function generateMetadata({
    params,
  }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = getLocationRentalProductBySlug(slug);
    if (!product) return {};

    const path = locationRentalProductPath(slug, citySlug);
    const title = `${product.seoTitle.replace(" | SOS Santé Maroc", "")} · ${city.name} | SOS Santé`;

    return {
      title,
      description: product.seoDescription,
      alternates: { canonical: path },
      openGraph: {
        title,
        description: product.seoDescription,
        url: path,
        type: "website",
        locale: "fr_MA",
        siteName: "SOS Santé",
        images: [{ url: `${siteUrl}${product.image}`, alt: product.alt }],
      },
    };
  }

  async function Page({ params }: PageProps) {
    const { slug } = await params;
    const product = getLocationRentalProductBySlug(slug);
    if (!product) notFound();

    const path = locationRentalProductPath(slug, citySlug);
    const localized = { ...product, city: city.name };
    const schema = buildGraph(
      webPageSchema(path, localized.seoTitle, localized.seoDescription),
      breadcrumbSchema([
        { name: "Accueil", item: "/" },
        {
          name: `Location matériel médical ${city.name}`,
          item: locationCityPath(citySlug),
        },
        { name: product.name, item: path },
      ]),
      productSchema(localized, path)
    );

    return (
      <>
        <JsonLd data={schema} />
        <LocationProductDetail product={localized} citySlug={citySlug} />
      </>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
