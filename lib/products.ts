import { catalogProducts } from "@/lib/catalog-products";
import {
  activeCities,
  DEFAULT_CITY_SLUG,
  getCityBySlug,
  type CitySlug,
} from "@/lib/cities";
import type {
  Product,
  ProductSpec,
  ProductUseCase,
  RelatedProduct,
} from "@/lib/product-types";

export type { Product, ProductSpec, ProductUseCase, RelatedProduct };

export {
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
} from "@/lib/cities";
export {
  whatsAppDigits,
  whatsAppHref,
  WHATSAPP_LINES,
  type WhatsAppLine,
} from "@/lib/whatsapp-lines";
export { PRICE_ON_REQUEST } from "@/lib/respiratory-products";

export const products: Product[] = catalogProducts;

function withCityLabel(citySlug: string): Product[] {
  const cityName = getCityBySlug(citySlug)?.name ?? "Agadir";
  return catalogProducts.map((product) => ({ ...product, city: cityName }));
}

export function getProductsByCity(citySlug: string): Product[] {
  if (!getCityBySlug(citySlug)?.available) return [];
  return withCityLabel(citySlug);
}

export function getProductBySlug(
  slug: string,
  citySlug?: string
): Product | undefined {
  const base = catalogProducts.find((product) => product.slug === slug);
  if (!base) return undefined;

  if (!citySlug) return base;

  const cityName = getCityBySlug(citySlug)?.name;
  return cityName ? { ...base, city: cityName } : base;
}

export function getCatalogProducts(citySlug: string = DEFAULT_CITY_SLUG) {
  return getProductsByCity(citySlug).map(
    ({
      slug,
      name,
      category,
      categoryStyle,
      description,
      image,
      alt,
      tagline,
      priceLabel,
    }) => ({
      slug,
      name,
      category,
      categoryStyle,
      description,
      image,
      alt,
      tagline,
      priceLabel,
    })
  );
}

export function getAllCityProductParams() {
  const params: { city: CitySlug; slug: string }[] = [];

  for (const city of activeCities) {
    for (const product of catalogProducts) {
      params.push({ city: city.slug, slug: product.slug });
    }
  }

  return params;
}

export function getActiveVenteCitySlugs(): CitySlug[] {
  return activeCities.map((city) => city.slug);
}
