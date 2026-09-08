import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import ProductDetail from "@/app/produits/[slug]/product-detail";
import { buildProductPageSchema } from "@/lib/product-page-schema";
import {
  resolveVenteCityProduct,
  venteCityProductMetadata,
  venteCityProductStaticParams,
} from "@/lib/vente-city-product-page";

const citySlug = "tanger" as const;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return venteCityProductStaticParams(citySlug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return venteCityProductMetadata(slug, citySlug);
}

function ProductJsonLd({ slug }: { slug: string }) {
  const product = resolveVenteCityProduct(slug, citySlug);
  if (!product) return null;

  return <JsonLd data={buildProductPageSchema(product, citySlug)} />;
}

export default async function VenteTangerProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = resolveVenteCityProduct(slug, citySlug);
  if (!product) notFound();

  return (
    <>
      <ProductJsonLd slug={slug} />
      <ProductDetail product={product} citySlug={citySlug} />
    </>
  );
}
