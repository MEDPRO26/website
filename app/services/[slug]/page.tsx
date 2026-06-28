import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareServiceCityPage } from "@/components/care-service-city-page";
import {
  getAllCareServicePageParams,
  getCareServicePageContent,
  parseCareServiceCitySlug,
} from "@/lib/care-services";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCareServicePageParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseCareServiceCitySlug(slug);
  if (!parsed) return {};

  const content = getCareServicePageContent(
    parsed.serviceSlug,
    parsed.citySlug
  );
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: content.path },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: content.path,
      type: "website",
      locale: "fr_MA",
      siteName: "SOS Santé",
      images: [{ url: content.images.hero, alt: content.images.altWithCity }],
    },
  };
}

export default async function CareServiceCityRoute({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseCareServiceCitySlug(slug);
  if (!parsed) notFound();

  const content = getCareServicePageContent(
    parsed.serviceSlug,
    parsed.citySlug
  );
  if (!content) notFound();

  return <CareServiceCityPage content={content} />;
}
