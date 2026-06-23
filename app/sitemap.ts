import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { seoCategories, seoCities } from "@/lib/seo-data";
import { blogPosts } from "@/lib/blog";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sossante.ma"
).replace(/\/$/, "");

const images = [
  "/medidomicile-hero.jpg",
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
  return [
    createSitemapEntry("/", 1, images),
    createSitemapEntry("/services", 0.9, [
      "/services/soins-domicile.jpg",
      "/services/hero-bg.jpg",
    ]),
    createSitemapEntry("/location-materiel-medical-agadir", 0.95, [
      "/medidomicile-hero.jpg",
    ]),
    createSitemapEntry("/vente", 0.95, ["/medidomicile-hero.jpg"]),
    ...seoCategories.map((category) =>
      createSitemapEntry(`/${category.slug}`, 0.9)
    ),
    ...seoCities.map((city) => createSitemapEntry(`/${city.slug}`, 0.85)),
    ...products.map((product) =>
      createSitemapEntry(`/produits/${product.slug}`, 0.85, [product.image])
    ),
    createSitemapEntry("/tarifs", 0.9, ["/medidomicile-hero.jpg"]),
    createSitemapEntry("/contact", 0.9, ["/medidomicile-hero.jpg"]),
    createSitemapEntry("/blog", 0.9, ["/medidomicile-hero.jpg"]),
    ...blogPosts.map((post) =>
      createSitemapEntry(`/blog/${post.slug}`, 0.8, [post.image])
    ),
  ];
}
