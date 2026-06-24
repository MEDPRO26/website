import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { getProductBySlug, products } from "@/lib/products";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import { formatAchatSeoTitle } from "@/lib/french";
import { buildGraph, productBreadcrumbSchema, productSchema } from "@/lib/schema";
import ProductDetail from "./product-detail";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = formatAchatSeoTitle(product.seoTitle);

  return {
    title,
    description: product.seoDescription,
    alternates: {
      canonical: `/produits/${slug}`,
    },
    openGraph: {
      title,
      description: product.seoDescription,
      url: `/produits/${slug}`,
      images: [{ url: `${siteUrl}${product.image}`, alt: product.alt }],
    },
  };
}

function ProductJsonLd({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const schema = buildGraph(
    productSchema(product, slug),
    productBreadcrumbSchema(slug, product.shortName)
  );

  return <JsonLd data={schema} />;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <ProductJsonLd slug={slug} />
      <ProductDetail product={product} />
    </>
  );
}
