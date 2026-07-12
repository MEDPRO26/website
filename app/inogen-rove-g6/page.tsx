import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductLandingPage from "@/components/product-landing-page";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import { getProductLandingContent } from "@/lib/product-landing-pages";

const SLUG = "inogen-rove-g6";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const content = getProductLandingContent(SLUG);
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
      images: [
        {
          url: `${siteUrl}${content.heroImage}`,
          alt: content.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [`${siteUrl}${content.heroImage}`],
    },
  };
}

export default function InogenRoveG6LandingPage() {
  const content = getProductLandingContent(SLUG);
  if (!content) notFound();

  return <ProductLandingPage content={content} />;
}
