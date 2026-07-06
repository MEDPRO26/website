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
import {
  hubCityPath,
  venteCategoryPath,
  venteCityPath,
  venteProductPath,
} from "@/lib/routes";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

const LAST_MODIFIED = new Date("2026-06-25");

type SitemapId = "pages" | "catalog" | "products" | "blog";

function createSitemapEntry(
  path: string,
  priority: number,
  image?: string
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly",
    priority,
    ...(image
      ? {
          images: [`${siteUrl}${image}`],
        }
      : {}),
    alternates: {
      languages: {
        "fr-MA": `${siteUrl}${path}`,
        "x-default": `${siteUrl}${path}`,
      },
    },
  };
}

function pagesSitemap(): MetadataRoute.Sitemap {
  return [
    createSitemapEntry("/", 1, HERO_IMAGE),
    createSitemapEntry("/services", 0.9, "/services/soins-domicile.jpg"),
    createSitemapEntry("/contact", 0.9, HERO_IMAGE),
    createSitemapEntry("/blog", 0.9, HERO_IMAGE),
    ...legalPages.map((page) => createSitemapEntry(page.href, 0.3)),
    ...activeCities.map((city) =>
      createSitemapEntry(hubCityPath(city.slug), 0.95, HERO_IMAGE)
    ),
  ];
}

function catalogSitemap(): MetadataRoute.Sitemap {
  const citySlugs = getActiveVenteCitySlugs();

  return [
    ...getAllCareServicePageParams().map(({ slug }) => {
      const parsed = parseCareServiceCitySlug(slug);
      const heroImage =
        (parsed && getCareServiceBySlug(parsed.serviceSlug)?.images.hero) ||
        "/services/soins-domicile.jpg";
      return createSitemapEntry(`/services/${slug}`, 0.85, heroImage);
    }),
    ...citySlugs.flatMap((citySlug) => [
      createSitemapEntry(venteCityPath(citySlug), 0.95, HERO_IMAGE),
      ...venteCategoryParams.map((category) =>
        createSitemapEntry(venteCategoryPath(category, citySlug), 0.9)
      ),
    ]),
  ];
}

function productsSitemap(): MetadataRoute.Sitemap {
  return getAllCityProductParams().map(({ city, slug }) => {
    const product = getProductsByCity(city).find((item) => item.slug === slug);
    return createSitemapEntry(
      venteProductPath(slug, city),
      0.85,
      product?.image
    );
  });
}

function blogSitemap(): MetadataRoute.Sitemap {
  return blogPosts.map((post) =>
    createSitemapEntry(`/blog/${post.slug}`, 0.8, post.image)
  );
}

const SITEMAP_BUILDERS: Record<SitemapId, () => MetadataRoute.Sitemap> = {
  pages: pagesSitemap,
  catalog: catalogSitemap,
  products: productsSitemap,
  blog: blogSitemap,
};

export async function generateSitemaps() {
  if (!allowIndexing) {
    return [];
  }

  return (Object.keys(SITEMAP_BUILDERS) as SitemapId[]).map((id) => ({ id }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  if (!allowIndexing) {
    return [];
  }

  const id = (await props.id) as SitemapId;
  const build = SITEMAP_BUILDERS[id];
  return build ? build() : [];
}
