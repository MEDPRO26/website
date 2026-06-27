"use client";

import Image from "next/image";
import Link from "next/link";
import type { CitySlug } from "@/lib/cities";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { venteProductPath } from "@/lib/routes";
import { products } from "@/lib/products";

export default function RelatedProducts({
  currentSlug,
  category,
  citySlug = DEFAULT_CITY_SLUG,
  title = "Produits similaires",
}: {
  currentSlug: string;
  category: string;
  citySlug?: CitySlug;
  title?: string;
}) {
  const related = products
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-outline-variant/30 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((product) => {
            const productPath = venteProductPath(product.slug, citySlug);
            return (
            <article
              key={product.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Link
                href={productPath}
                className="relative aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${product.categoryStyle}`}
                >
                  {product.category}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link href={productPath}>
                  <h3 className="font-heading mb-2 text-base font-semibold text-primary transition-colors hover:text-primary-container sm:text-lg">
                    {product.name}
                  </h3>
                </Link>
                <p className="font-body mb-4 flex-1 text-sm leading-relaxed text-on-surface-variant">
                  {product.description}
                </p>
                <Link
                  href={productPath}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2"
                >
                  Voir le produit
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
