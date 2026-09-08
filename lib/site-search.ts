import { catalogProducts } from "@/lib/catalog-products";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { getLocationRentalProducts } from "@/lib/location-rental-products";
import {
  locationRentalProductPath,
  venteProductPath,
} from "@/lib/routes";

export type SiteSearchKind = "vente" | "location";

export type SiteSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  alt: string;
  kind: SiteSearchKind;
  /** Pre-normalized fields used for matching. */
  haystack: string;
};

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildHaystack(parts: string[]): string {
  return normalizeSearchText(parts.filter(Boolean).join(" "));
}

const citySlug = DEFAULT_CITY_SLUG;

const venteEntries: SiteSearchResult[] = catalogProducts.map((product) => ({
  id: `vente-${product.slug}`,
  title: product.name,
  subtitle: `Vente · ${product.category}`,
  href: venteProductPath(product.slug, citySlug),
  image: product.image,
  alt: product.alt,
  kind: "vente",
  haystack: buildHaystack([
    product.name,
    product.shortName,
    product.category,
    product.tagline,
    product.description,
    product.slug.replace(/-/g, " "),
  ]),
}));

const locationEntries: SiteSearchResult[] = getLocationRentalProducts().map(
  (product) => ({
    id: `location-${product.slug}`,
    title: product.name,
    subtitle: `Location · ${product.category}`,
    href: locationRentalProductPath(product.slug, citySlug),
    image: product.image,
    alt: product.alt,
    kind: "location",
    haystack: buildHaystack([
      product.name,
      product.shortName,
      product.category,
      product.tagline,
      product.description,
      product.slug.replace(/-/g, " "),
      "location",
      "louer",
    ]),
  })
);

const SITE_SEARCH_INDEX: SiteSearchResult[] = [
  ...venteEntries,
  ...locationEntries,
];

function scoreResult(result: SiteSearchResult, query: string): number {
  const title = normalizeSearchText(result.title);
  const shortBits = title.split(" ");

  if (title === query) return 100;
  if (title.startsWith(query)) return 90;
  if (shortBits.some((word) => word.startsWith(query))) return 80;
  if (title.includes(query)) return 70;
  if (result.haystack.includes(query)) return 50;
  // Multi-token: every token must appear
  const tokens = query.split(" ").filter((t) => t.length >= 2);
  if (tokens.length > 1 && tokens.every((t) => result.haystack.includes(t))) {
    return 60;
  }
  return 0;
}

export function searchSiteProducts(
  rawQuery: string,
  limit = 8
): SiteSearchResult[] {
  const query = normalizeSearchText(rawQuery);
  if (query.length < 2) return [];

  return SITE_SEARCH_INDEX.map((result) => ({
    result,
    score: scoreResult(result, query),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.result.title.localeCompare(b.result.title, "fr");
    })
    .slice(0, limit)
    .map((entry) => entry.result);
}
