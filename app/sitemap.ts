import type { MetadataRoute } from "next";
import { HERO_IMAGE } from "@/lib/brand";
import { blogPosts } from "@/lib/blog";
import { allowIndexing } from "@/lib/indexing";
import { products } from "@/lib/products";
import { seoCategories, seoCities } from "@/lib/seo-data";
import { VENTE_PAGE_PATH } from "@/lib/routes";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sossante.ma"
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
    ...seoCategories.map((category) =>
      createSitemapEntry(`/${category.slug}`, 0.9)
    ),
    ...seoCities.map((city) => createSitemapEntry(`/${city.slug}`, 0.85)),
    ...products.map((product) =>
      createSitemapEntry(`/produits/${product.slug}`, 0.85, [product.image])
    ),
    createSitemapEntry("/contact", 0.9, [HERO_IMAGE]),
    createSitemapEntry("/blog", 0.9, [HERO_IMAGE]),
    ...blogPosts.map((post) =>
      createSitemapEntry(`/blog/${post.slug}`, 0.8, [post.image])
    ),
  ];
}
