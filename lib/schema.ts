import { LOGO, SITE_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import type { Product } from "@/lib/products";
import { CONTACT_EMAIL, PHONE_NUMBER, products, WHATSAPP_NUMBER } from "@/lib/products";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export const contactPhone = PHONE_NUMBER;

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "fr-MA",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}${LOGO.default}`,
    areaServed: [
      { "@type": "Country", name: "Maroc" },
      { "@type": "City", name: "Agadir" },
    ],
    knowsAbout: [
      "Location de matériel médical",
      "Aide à domicile",
      "Maintien à domicile",
      "Services de santé à domicile au Maroc",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactPhone,
      contactType: "Service client",
      availableLanguage: ["French", "Arabic"],
      areaServed: "MA",
      hoursAvailable: "Mo-Su 00:00-23:59",
    },
    sameAs: [`https://wa.me/${WHATSAPP_NUMBER}`],
  };
}

export function localBusinessSchema(
  overrides: {
    name?: string;
    description?: string;
    telephone?: string;
    email?: string;
    addressLocality?: string;
    areaServed?: Array<{ "@type": string; name: string }>;
    priceRange?: string;
    openingHours?: string;
  } = {}
) {
  return {
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: overrides.name ?? SITE_NAME,
    description:
      overrides.description ??
      "Location de matériel médical à Agadir et livraison au Maroc. Lits médicalisés, fauteuils roulants, concentrateurs d'oxygène.",
    url: siteUrl,
    telephone: overrides.telephone ?? contactPhone,
    email: overrides.email ?? CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: overrides.addressLocality ?? "Agadir",
      addressCountry: "MA",
    },
    areaServed:
      overrides.areaServed ?? [
        { "@type": "City", name: "Agadir" },
        { "@type": "Country", name: "Maroc" },
      ],
    priceRange: overrides.priceRange ?? "$$",
    openingHours: overrides.openingHours ?? "Mo-Su 00:00-23:59",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: overrides.telephone ?? contactPhone,
      contactType: "Service client",
      availableLanguage: ["French", "Arabic"],
      areaServed: "MA",
      hoursAvailable: "Mo-Su 00:00-23:59",
    },
    sameAs: [`https://wa.me/${WHATSAPP_NUMBER}`],
  };
}

export function webPageSchema(
  path: string,
  name: string,
  description: string,
  type: "WebPage" | "ContactPage" | "CollectionPage" | "AboutPage" = "WebPage"
) {
  return {
    "@type": type,
    "@id": `${siteUrl}${path}#webpage`,
    url: `${siteUrl}${path}`,
    name,
    description,
    inLanguage: "fr-MA",
    isPartOf: { "@id": `${siteUrl}/#website` },
    dateModified: new Date().toISOString().split("T")[0],
  };
}

export function breadcrumbSchema(items: { name: string; item?: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}${items[items.length - 1]?.item ?? ""}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item ? `${siteUrl}${item.item}` : siteUrl,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${siteUrl}${path}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function itemListSchema(
  name: string,
  path: string,
  items: { name: string; url: string }[]
) {
  return {
    "@type": "ItemList",
    "@id": `${siteUrl}${path}#${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${siteUrl}${item.url}`,
    })),
  };
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function productSchema(product: Product, productPath: string) {
  const path = normalizePath(productPath);
  return {
    "@type": "Product",
    "@id": `${siteUrl}${path}#product`,
    name: product.name,
    description: product.description,
    image: `${siteUrl}${product.image}`,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    sku: product.slug,
    mpn: product.slug,
    itemCondition: "https://schema.org/NewCondition",
    offers: {
      "@type": "Offer",
      "@id": `${siteUrl}${path}#offer`,
      availability: "https://schema.org/InStock",
      priceCurrency: "MAD",
      price: "0",
      priceValidUntil: "2027-12-31",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "MAD",
        description: "Tarif sur demande",
        valueAddedTaxIncluded: true,
      },
      itemOffered: { "@id": `${siteUrl}${path}#product` },
      seller: { "@type": "Organization", name: SITE_NAME },
      areaServed: { "@type": "City", name: product.city },
      url: `${siteUrl}${path}`,
    },
    areaServed: { "@type": "City", name: product.city },
  };
}

export function productBreadcrumbSchema(
  productPath: string,
  productName: string,
  hubPath: string,
  hubLabel: string
) {
  const path = normalizePath(productPath);
  const hub = normalizePath(hubPath);
  return {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}${path}#breadcrumb`,
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
        name: hubLabel,
        item: `${siteUrl}${hub}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
        item: `${siteUrl}${path}`,
      },
    ],
  };
}

export function serviceSchema(
  name: string,
  description: string,
  path?: string
) {
  return {
    "@type": "Service",
    name,
    description,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Maroc" },
    ...(path ? { url: `${siteUrl}${path}` } : {}),
  };
}

export function offerCatalogSchema(
  name: string,
  path: string,
  offers: { name: string; price: string; description?: string; category?: string }[]
) {
  return {
    "@type": "OfferCatalog",
    "@id": `${siteUrl}${path}#catalog`,
    name,
    itemListElement: offers.map((offer, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: offer.name,
      description: offer.description ?? "Tarif sur demande",
      priceCurrency: "MAD",
      price: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "MAD",
        description: offer.price,
      },
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "Country", name: "Maroc" },
      category: offer.category,
    })),
  };
}

export function blogPostingSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${siteUrl}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${post.image}`,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: { "@id": `${siteUrl}/#organization` },
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };
}

export function buildGraph(...nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export { products, siteUrl };
