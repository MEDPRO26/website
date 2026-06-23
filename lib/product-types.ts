export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductUseCase = {
  icon: string;
  title: string;
  description: string;
};

export type RelatedProduct = {
  slug: string;
  name: string;
  description: string;
  priceLabel: string;
  image: string;
  alt: string;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categoryStyle: string;
  city: string;
  tagline: string;
  description: string;
  extendedDescription: string;
  image: string;
  gallery?: string[];
  alt: string;
  badges: string[];
  priceLabel: string;
  specs: ProductSpec[];
  included: string[];
  useCases: ProductUseCase[];
  related: RelatedProduct[];
  seoTitle: string;
  seoDescription: string;
};
