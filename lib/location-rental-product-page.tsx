import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import LocationProductDetail from "@/components/location-product-detail";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import type { CitySlug } from "@/lib/cities";
import { getCityBySlug } from "@/lib/cities";
import {
  formatLocationProductBreadcrumbLabel,
  formatLocationProductMetaDescription,
  formatLocationProductMetaTitle,
  getLocationProductFaqs,
} from "@/lib/location-product-seo";
import {
  getAllLocationRentalSlugs,
  getLocationRentalProductBySlug,
} from "@/lib/location-rental-products";
import { LOCATION_PILLAR_PATH } from "@/lib/pillar-pages";
import {
  cityProductUrlSlug,
  locationCityPath,
  locationRentalProductPath,
  parseCityProductUrlSlug,
} from "@/lib/routes";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
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
    return getAllLocationRentalSlugs().map((slug) => ({
      slug: cityProductUrlSlug(slug, citySlug),
    }));
  }

  async function generateMetadata({
    params,
  }: PageProps): Promise<Metadata> {
    const { slug: urlSlug } = await params;
    const baseSlug = parseCityProductUrlSlug(urlSlug, citySlug);
    if (!baseSlug) return {};

    const product = getLocationRentalProductBySlug(baseSlug);
    if (!product) return {};

    const path = locationRentalProductPath(baseSlug, citySlug);
    const title = formatLocationProductMetaTitle(product.name, citySlug);
    const description = formatLocationProductMetaDescription(
      product.name,
      citySlug
    );

    return {
      title,
      description,
      alternates: { canonical: path },
      openGraph: {
        title,
        description,
        url: path,
        type: "website",
        locale: "fr_MA",
        siteName: "SOS Santé",
        images: [{ url: `${siteUrl}${product.image}`, alt: product.alt }],
      },
    };
  }

  async function Page({ params }: PageProps) {
    const { slug: urlSlug } = await params;
    const baseSlug = parseCityProductUrlSlug(urlSlug, citySlug);
    if (!baseSlug) notFound();

    const product = getLocationRentalProductBySlug(baseSlug);
    if (!product) notFound();

    const path = locationRentalProductPath(baseSlug, citySlug);
    const localized = { ...product, city: city.name };
    const title = formatLocationProductMetaTitle(product.name, citySlug);
    const description = formatLocationProductMetaDescription(
      product.name,
      citySlug
    );
    const crumbLabel = formatLocationProductBreadcrumbLabel(
      product.shortName,
      citySlug
    );
    const faqs = getLocationProductFaqs(product.name, citySlug);

    const schema = buildGraph(
      webPageSchema(path, title, description),
      breadcrumbSchema([
        { name: "Accueil", item: "/" },
        {
          name: "Location matériel médical Maroc",
          item: LOCATION_PILLAR_PATH,
        },
        {
          name: `Location matériel médical ${city.name}`,
          item: locationCityPath(citySlug),
        },
        { name: crumbLabel, item: path },
      ]),
      productSchema(localized, path),
      faqSchema(faqs, path)
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
