import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/lib/products";
import ProductDetail from "./product-detail";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medidomicile.ma"
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

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `/produits/${slug}`,
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: `/produits/${slug}`,
      images: [{ url: `${siteUrl}${product.image}`, alt: product.alt }],
    },
  };
}

function ProductJsonLd({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: `${siteUrl}${product.image}`,
        category: product.category,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "MAD",
          price: "0",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "0",
            priceCurrency: "MAD",
            valueAddedTaxIncluded: true,
          },
          description: "Tarif sur demande",
          areaServed: { "@type": "City", name: product.city },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Location Matériel",
            item: `${siteUrl}/#materiels`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.shortName,
            item: `${siteUrl}/produits/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
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
