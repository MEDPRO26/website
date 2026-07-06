import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import { formatAchatSeoTitle } from "@/lib/french";
import { getProductBySlug, getProductsByCity } from "@/lib/products";
import { buildProductPageSchema } from "@/lib/product-page-schema";
import { venteProductPath } from "@/lib/routes";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import ProductDetail from "@/app/produits/[slug]/product-detail";

const citySlug = "rabat" as const;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProductsByCity(citySlug).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, citySlug);
  if (!product) return {};

  const path = venteProductPath(slug, citySlug);
  const title = formatAchatSeoTitle(product.seoTitle);

  return {
    title: `${title} · Rabat`,
    description: product.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: product.seoDescription,
      url: path,
      images: [{ url: `${siteUrl}${product.image}`, alt: product.alt }],
    },
  };
}

function ProductJsonLd({ slug }: { slug: string }) {
  const product = getProductBySlug(slug, citySlug);
  if (!product) return null;

  return <JsonLd data={buildProductPageSchema(product, citySlug)} />;
}

export default async function VenteRabatProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug, citySlug);
  if (!product) notFound();

  return (
    <>
      <ProductJsonLd slug={slug} />
      <ProductDetail product={product} citySlug={citySlug} />
    </>
  );
}
