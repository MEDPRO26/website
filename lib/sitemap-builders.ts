import { HERO_IMAGE, SITE_URL_DEFAULT } from "@/lib/brand";
import { activeCities } from "@/lib/cities";
import {
  getAllCareServicePageParams,
  getCareServiceBySlug,
  parseCareServiceCitySlug,
} from "@/lib/care-services";
import { blogPosts } from "@/lib/blog";
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

export type SitemapId = "pages" | "catalog" | "products" | "blog";

export type SitemapEntry = {
  path: string;
  priority: number;
  image?: string;
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
    { path: "/", priority: 1, image: HERO_IMAGE },
    { path: "/services", priority: 0.9, image: "/services/soins-domicile.jpg" },
    { path: "/contact", priority: 0.9, image: HERO_IMAGE },
    { path: "/blog", priority: 0.9, image: HERO_IMAGE },
    ...legalPages.map((page) => ({ path: page.href, priority: 0.3 })),
    ...activeCities.map((city) => ({
      path: hubCityPath(city.slug),
      priority: 0.95,
      image: HERO_IMAGE,
    })),
  ];
}

function catalogEntries(): SitemapEntry[] {
  const citySlugs = getActiveVenteCitySlugs();

  return [
    ...getAllCareServicePageParams().map(({ slug }) => {
      const parsed = parseCareServiceCitySlug(slug);
      const heroImage =
        (parsed && getCareServiceBySlug(parsed.serviceSlug)?.images.hero) ||
        "/services/soins-domicile.jpg";
      return {
        path: `/services/${slug}`,
        priority: 0.85,
        image: heroImage,
      };
    }),
    ...citySlugs.flatMap((citySlug) => [
      {
        path: venteCityPath(citySlug),
        priority: 0.95,
        image: HERO_IMAGE,
      },
      ...venteCategoryParams.map((category) => ({
        path: venteCategoryPath(category, citySlug),
        priority: 0.9,
      })),
    ]),
  ];
}

function productsEntries(): SitemapEntry[] {
  return getAllCityProductParams().map(({ city, slug }) => {
    const product = getProductsByCity(city).find((item) => item.slug === slug);
    return {
      path: venteProductPath(slug, city),
      priority: 0.85,
      image: product?.image,
    };
  });
}

function blogEntries(): SitemapEntry[] {
  return blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.8,
    image: post.image,
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
