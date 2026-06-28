import type { MetadataRoute } from "next";
import { HERO_IMAGE, SITE_URL_DEFAULT } from "@/lib/brand";
import { activeCities } from "@/lib/cities";
import {
  getAllCareServicePageParams,
  getCareServiceBySlug,
  parseCareServiceCitySlug,
} from "@/lib/care-services";
import { blogPosts } from "@/lib/blog";
import { allowIndexing } from "@/lib/indexing";
import { legalPages } from "@/lib/legal-routes";
import {
  getActiveVenteCitySlugs,
  getAllCityProductParams,
  getProductsByCity,
} from "@/lib/products";
import { venteCategoryParams } from "@/lib/catalog-categories";
import { hubCityPath, venteCategoryPath, venteCityPath, venteProductPath } from "@/lib/routes";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

const images = [
  HERO_IMAGE,
  "/og-image.png",
  "/services/soins-domicile.jpg",
  "/services/hero-bg.jpg",
  ...getProductsByCity("agadir").map((p) => p.image),
];

function createSitemapEntry(
  path: string,
  priority: number,
  extraImages?: string[]
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-06-25"),
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

  const citySlugs = getActiveVenteCitySlugs();

  return [
    createSitemapEntry("/", 1, images),
    createSitemapEntry("/services", 0.9, [
      "/services/soins-domicile.jpg",
      "/services/hero-bg.jpg",
    ]),
    ...getAllCareServicePageParams().map(({ slug }) => {
      const parsed = parseCareServiceCitySlug(slug);
      const heroImage =
        (parsed && getCareServiceBySlug(parsed.serviceSlug)?.images.hero) ||
        "/services/soins-domicile.jpg";
      return createSitemapEntry(`/services/${slug}`, 0.85, [heroImage]);
    }),
    ...activeCities.map((city) =>
      createSitemapEntry(hubCityPath(city.slug), 0.95, [HERO_IMAGE])
    ),
    ...citySlugs.flatMap((citySlug) => [
      createSitemapEntry(venteCityPath(citySlug), 0.95, [HERO_IMAGE]),
      ...venteCategoryParams.map((category) =>
        createSitemapEntry(venteCategoryPath(category, citySlug), 0.9)
      ),
    ]),
    ...getAllCityProductParams().map(({ city, slug }) => {
      const product = getProductsByCity(city).find((item) => item.slug === slug);
      return createSitemapEntry(
        venteProductPath(slug, city),
        0.85,
        product ? [product.image] : undefined
      );
    }),
    createSitemapEntry("/contact", 0.9, [HERO_IMAGE]),
    ...legalPages.map((page) => createSitemapEntry(page.href, 0.3)),
    createSitemapEntry("/blog", 0.9, [HERO_IMAGE]),
    ...blogPosts.map((post) =>
      createSitemapEntry(`/blog/${post.slug}`, 0.8, [post.image])
    ),
  ];
}
