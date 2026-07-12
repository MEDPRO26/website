import { SITE_URL_DEFAULT } from "@/lib/brand";
import { activeCities } from "@/lib/cities";
import { getAllCareServicePageParams } from "@/lib/care-services";
import { blogPosts } from "@/lib/blog";
import { legalPages } from "@/lib/legal-routes";
import { getAllProductLandingSlugs } from "@/lib/product-landing-pages";
import { getActiveVenteCitySlugs, getAllCityProductParams } from "@/lib/products";
import { venteCategoryParams } from "@/lib/catalog-categories";
import {
  hubCityPath,
  nationalProductPath,
  venteCategoryPath,
  venteCityPath,
  venteProductPath,
} from "@/lib/routes";

export type SitemapId = "pages" | "catalog" | "products" | "blog";

export type SitemapEntry = {
  path: string;
  priority: number;
};

export const SITEMAP_SECTIONS: { id: SitemapId; path: string }[] = [
  { id: "pages", path: "/sitemap/pages.xml" },
  { id: "catalog", path: "/sitemap/catalog.xml" },
  { id: "products", path: "/sitemap/products.xml" },
  { id: "blog", path: "/sitemap/blog.xml" },
];

const LAST_MODIFIED = "2026-06-25";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT).replace(
    /\/$/,
    ""
  );
}

export function getSitemapLastModified() {
  return LAST_MODIFIED;
}

function pagesEntries(): SitemapEntry[] {
  return [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/contact", priority: 0.9 },
    { path: "/blog", priority: 0.9 },
    ...legalPages.map((page) => ({ path: page.href, priority: 0.3 })),
    ...activeCities.map((city) => ({
      path: hubCityPath(city.slug),
      priority: 0.95,
    })),
    ...getAllProductLandingSlugs().map((slug) => ({
      path: nationalProductPath(slug),
      priority: 0.95,
    })),
  ];
}

function catalogEntries(): SitemapEntry[] {
  const citySlugs = getActiveVenteCitySlugs();

  return [
    ...getAllCareServicePageParams().map(({ slug }) => ({
      path: `/services/${slug}`,
      priority: 0.85,
    })),
    ...citySlugs.flatMap((citySlug) => [
      { path: venteCityPath(citySlug), priority: 0.95 },
      ...venteCategoryParams.map((category) => ({
        path: venteCategoryPath(category, citySlug),
        priority: 0.9,
      })),
    ]),
  ];
}

function productsEntries(): SitemapEntry[] {
  return getAllCityProductParams().map(({ city, slug }) => ({
    path: venteProductPath(slug, city),
    priority: 0.85,
  }));
}

function blogEntries(): SitemapEntry[] {
  return blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.8,
  }));
}

const SITEMAP_BUILDERS: Record<SitemapId, () => SitemapEntry[]> = {
  pages: pagesEntries,
  catalog: catalogEntries,
  products: productsEntries,
  blog: blogEntries,
};

export function getSitemapEntries(id: SitemapId): SitemapEntry[] {
  return SITEMAP_BUILDERS[id]();
}
