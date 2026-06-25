import { diagnosticProducts } from "@/lib/diagnostic-products";
import { instrumentsProducts } from "@/lib/instruments-products";
import { mobilityProducts } from "@/lib/mobility-products";
import { respiratoryProducts } from "@/lib/respiratory-products";
import type {
  Product,
  ProductSpec,
  ProductUseCase,
  RelatedProduct,
} from "@/lib/product-types";

export type { Product, ProductSpec, ProductUseCase, RelatedProduct };

export const CONTACT_EMAIL = "contact@sossante.ma";
export { PRICE_ON_REQUEST } from "@/lib/respiratory-products";
export const WHATSAPP_NUMBER = "212700975888";
export const PHONE_NUMBER = "+212700975888";
export const PHONE_DISPLAY = "07 00 97 58 88";

export const products: Product[] = [
  ...respiratoryProducts,
  ...mobilityProducts,
  ...diagnosticProducts,
  ...instrumentsProducts,
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCatalogProducts() {
  return products.map(
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
