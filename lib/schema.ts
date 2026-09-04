import { LOGO, SITE_FULL_NAME, SITE_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import { ABOUT_DEFINITION, ABOUT_PATH } from "@/lib/about-content";
import { activeCities, getCityBySlug } from "@/lib/cities";
import type { Product } from "@/lib/products";
import { CONTACT_EMAIL, PHONE_NUMBER, products } from "@/lib/products";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export const contactPhone = PHONE_NUMBER;

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    alternateName: ["SOS sante", "SOS Santé", "sossante.ma"],
    url: siteUrl,
    inLanguage: "fr-MA",
    publisher: { "@id": `${siteUrl}/#organization` },
    about: { "@id": `${siteUrl}/#organization` },
    significantLink: [
      `${siteUrl}${ABOUT_PATH}`,
      `${siteUrl}/services`,
      `${siteUrl}/contact`,
    ],
  };
}

const headquarters = getCityBySlug("agadir");

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    legalName: SITE_FULL_NAME,
    alternateName: ["SOS sante", "sossante.ma"],
    url: siteUrl,
    logo: `${siteUrl}${LOGO.default}`,
    image: `${siteUrl}${LOGO.default}`,
    description: ABOUT_DEFINITION,
    email: CONTACT_EMAIL,
    telephone: contactPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        headquarters?.streetAddress ?? "Lerac, Avenue Abderrahim Bouabid",
      addressLocality: "Agadir",
      postalCode: headquarters?.postalCode ?? "80000",
      addressRegion: headquarters?.addressRegion ?? "Souss-Massa",
      addressCountry: "MA",
    },
    foundingLocation: { "@type": "City", name: "Agadir" },
    areaServed: [
      { "@type": "Country", name: "Maroc" },
      ...activeCities.map((city) => ({ "@type": "City", name: city.name })),
    ],
    knowsAbout: [
      "Location de matériel médical",
      "Vente de matériel médical",
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
  };
}

export function localBusinessSchema(
  overrides: {
    businessId?: string;
    citySlug?: string;
    path?: string;
    name?: string;
    description?: string;
    telephone?: string;
    email?: string;
    streetAddress?: string;
    postalCode?: string;
    addressRegion?: string;
    addressLocality?: string;
    latitude?: number;
    longitude?: number;
    areaServed?: Array<{ "@type": string; name: string }>;
    priceRange?: string;
    openingHours?: string;
    image?: string;
  } = {}
) {
  const businessId = overrides.businessId ?? overrides.citySlug ?? "agadir";
  const pagePath = overrides.path ?? "/";
  const openingHours = overrides.openingHours ?? "Mo-Su 00:00-23:59";
  const hasGeo =
    typeof overrides.latitude === "number" &&
    typeof overrides.longitude === "number";

  return {
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness-${businessId}`,
    name: overrides.name ?? SITE_NAME,
    description:
      overrides.description ??
      "Location et vente de matériel médical à Agadir et livraison au Maroc. Lits médicalisés, fauteuils roulants, concentrateurs d'oxygène.",
    url: `${siteUrl}${pagePath}`,
    image: overrides.image ?? `${siteUrl}${LOGO.default}`,
    parentOrganization: { "@id": `${siteUrl}/#organization` },
    telephone: overrides.telephone ?? contactPhone,
    email: overrides.email ?? CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      ...(overrides.streetAddress
        ? { streetAddress: overrides.streetAddress }
        : {}),
      ...(overrides.postalCode ? { postalCode: overrides.postalCode } : {}),
      ...(overrides.addressRegion
        ? { addressRegion: overrides.addressRegion }
        : {}),
      addressLocality: overrides.addressLocality ?? "Agadir",
      addressCountry: "MA",
    },
    ...(hasGeo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: overrides.latitude,
            longitude: overrides.longitude,
          },
        }
      : {}),
    areaServed:
      overrides.areaServed ?? [
        { "@type": "City", name: "Agadir" },
        { "@type": "Country", name: "Maroc" },
      ],
    priceRange: overrides.priceRange ?? "$$",
    openingHours,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: overrides.telephone ?? contactPhone,
      contactType: "Service client",
      availableLanguage: ["French", "Arabic"],
      areaServed: "MA",
      hoursAvailable: openingHours,
    },
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
    about: { "@id": `${siteUrl}/#organization` },
    dateModified: new Date().toISOString().split("T")[0],
  };
}

export function breadcrumbSchema(items: { name: string; item?: string }[]) {
  const lastPath = items[items.length - 1]?.item ?? "";
  return {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}${lastPath}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.item ? { item: `${siteUrl}${item.item}` } : {}),
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
      url: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function productSchema(
  product: Product,
  productPath: string,
  relatedProductPaths: string[] = []
) {
  // Reserved for when real prices are available — re-enable in productPageGraph().
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
    areaServed: { "@type": "City", name: product.city },
    ...(relatedProductPaths.length > 0
      ? {
          isRelatedTo: relatedProductPaths.map((relatedPath) => ({
            "@type": "Product",
            "@id": `${siteUrl}${normalizePath(relatedPath)}#product`,
          })),
        }
      : {}),
  };
}

export function productPageGraph(
  product: Product,
  productPath: string,
  hubPath: string,
  hubLabel: string,
  relatedProducts: Product[] = [],
  relatedPathForSlug: (slug: string) => string = (slug) =>
    `/vente-de-materiel-medical-agadir/produits/${slug}`,
  categoryCrumb?: { label: string; path: string }
) {
  const path = normalizePath(productPath);
  const relatedItems = relatedProducts.map((item) => ({
    name: item.name,
    url: relatedPathForSlug(item.slug),
  }));

  const nodes: Record<string, unknown>[] = [
    webPageSchema(path, product.seoTitle, product.seoDescription),
    productBreadcrumbSchema(
      path,
      product.shortName,
      hubPath,
      hubLabel,
      categoryCrumb
    ),
  ];

  if (relatedItems.length > 0) {
    nodes.push(itemListSchema("Produits associés", path, relatedItems));
  }

  return buildGraph(...nodes);
}

export function productBreadcrumbSchema(
  productPath: string,
  productName: string,
  hubPath: string,
  hubLabel: string,
  categoryCrumb?: { label: string; path: string }
) {
  const path = normalizePath(productPath);
  const hub = normalizePath(hubPath);
  const items: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[] = [
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
  ];

  if (categoryCrumb) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: categoryCrumb.label,
      item: `${siteUrl}${normalizePath(categoryCrumb.path)}`,
    });
    items.push({
      "@type": "ListItem",
      position: 4,
      name: productName,
      item: `${siteUrl}${path}`,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: productName,
      item: `${siteUrl}${path}`,
    });
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}${path}#breadcrumb`,
    itemListElement: items,
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

export function blogPostingSchema(post: {
  slug: string;
  categorySlug?: string;
  categoryName?: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  keywords?: string[];
}) {
  const imageUrl =
    post.image.startsWith("http://") || post.image.startsWith("https://")
      ? post.image
      : `${siteUrl}${post.image.startsWith("/") ? post.image : `/${post.image}`}`;
  const path = post.categorySlug
    ? `/blog/${post.categorySlug}/${post.slug}`
    : `/blog/${post.slug}`;
  const pageUrl = `${siteUrl}${path}`;

  return {
    "@type": "BlogPosting",
    "@id": `${pageUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    inLanguage: "fr-MA",
    isAccessibleForFree: true,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: post.alt || post.title,
    },
    author: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: post.author || SITE_NAME,
      url: siteUrl,
    },
    publisher: { "@id": `${siteUrl}/#organization` },
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: post.title,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: "fr-MA",
    },
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    ...(post.categoryName
      ? { articleSection: post.categoryName }
      : {}),
    ...(post.keywords?.length
      ? { keywords: post.keywords.join(", ") }
      : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".blog-excerpt", ".blog-prose h2"],
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
