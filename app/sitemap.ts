import type { MetadataRoute } from "next";
import { HERO_IMAGE, SITE_URL_DEFAULT } from "@/lib/brand";
import { blogPosts } from "@/lib/blog";
import { allowIndexing } from "@/lib/indexing";
import { legalPages } from "@/lib/legal-routes";
import { products } from "@/lib/products";
import { seoCategories, seoCities } from "@/lib/seo-data";
import { venteCategoryParams } from "@/lib/catalog-categories";
import { VENTE_PAGE_PATH, venteCategoryPath } from "@/lib/routes";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

const images = [
  HERO_IMAGE,
  "/og-image.png",
  "/services/soins-domicile.jpg",
  "/services/hero-bg.jpg",
  ...products.map((p) => p.image),
];

function createSitemapEntry(
  path: string,
  priority: number,
  extraImages?: string[]
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-06-20"),
    changeFrequency: "weekly",
    priority,
    images: extraImages?.map((image) => `${siteUrl}${image}`),
    alternates: {
      languages: {
        "fr-MA": `${siteUrl}${path}`,
        "x-default": `${siteUrl}${path}`,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!allowIndexing) {
    return [];
  }

  return [
    createSitemapEntry("/", 1, images),
    createSitemapEntry("/services", 0.9, [
      "/services/soins-domicile.jpg",
      "/services/hero-bg.jpg",
    ]),
    createSitemapEntry("/location-materiel-medical-agadir", 0.95, [
      HERO_IMAGE,
    ]),
    createSitemapEntry(VENTE_PAGE_PATH, 0.95, [HERO_IMAGE]),
    ...venteCategoryParams.map((category) =>
      createSitemapEntry(venteCategoryPath(category), 0.9)
    ),
    ...seoCategories.map((category) =>
      createSitemapEntry(`/${category.slug}`, 0.9)
    ),
    ...seoCities.map((city) => createSitemapEntry(`/${city.slug}`, 0.85)),
    ...products.map((product) =>
      createSitemapEntry(`/produits/${product.slug}`, 0.85, [product.image])
    ),
    createSitemapEntry("/contact", 0.9, [HERO_IMAGE]),
    ...legalPages.map((page) => createSitemapEntry(page.href, 0.3)),
    createSitemapEntry("/blog", 0.9, [HERO_IMAGE]),
    ...blogPosts.map((post) =>
      createSitemapEntry(`/blog/${post.slug}`, 0.8, [post.image])
    ),
  ];
}
