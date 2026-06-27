import { diagnosticProducts } from "@/lib/diagnostic-products";
import { instrumentsProducts } from "@/lib/instruments-products";
import { mobilityProducts } from "@/lib/mobility-products";
import { respiratoryProducts } from "@/lib/respiratory-products";
import type { Product } from "@/lib/product-types";

/** Shared catalog — same products shown in every active city. */
export const catalogProducts: Product[] = [
  ...respiratoryProducts,
  ...mobilityProducts,
  ...diagnosticProducts,
  ...instrumentsProducts,
];
