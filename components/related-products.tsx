"use client";

import Image from "next/image";
import Link from "next/link";
import type { CitySlug } from "@/lib/cities";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { venteProductPath } from "@/lib/routes";
import { products } from "@/lib/products";
import {
  hasCuratedRelatedProducts,
  resolveRelatedProducts,
} from "@/lib/related-products";

function MaterialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

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
  const current = products.find((product) => product.slug === currentSlug);
  if (!current) return null;

  const associated = resolveRelatedProducts(current, 3);
  const associatedSlugs = new Set(associated.map((product) => product.slug));
  const similar = products
    .filter(
      (product) =>
        product.slug !== currentSlug &&
        product.category === category &&
        !associatedSlugs.has(product.slug)
    )
    .slice(0, 3);

  if (associated.length === 0 && similar.length === 0) return null;

  const sections = [
    associated.length > 0
      ? {
          key: "associated",
          title: hasCuratedRelatedProducts(currentSlug)
            ? "Produits fréquemment achetés ensemble"
            : "Produits associés",
          items: associated,
        }
      : null,
    similar.length > 0
      ? {
          key: "similar",
          title,
          items: similar,
        }
      : null,
  ].filter((section): section is NonNullable<typeof section> => section !== null);

  return (
    <>
      {sections.map((section) => (
        <section
          key={section.key}
          className="border-t border-outline-variant/30 px-4 py-10 sm:px-6 sm:py-14"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
              {section.title}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {section.items.map((product) => {
                const productPath = venteProductPath(product.slug, citySlug);
                return (
                  <article
                    key={product.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <Link
                      href={productPath}
                      className="relative aspect-[4/3] overflow-hidden"
                    >
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs ${product.categoryStyle}`}
                      >
                        {product.category}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col p-3 sm:p-5">
                      <Link href={productPath}>
                        <h3 className="font-heading mb-1.5 line-clamp-2 text-sm font-semibold text-primary transition-colors hover:text-primary-container sm:mb-2 sm:text-lg md:text-xl">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-body mb-3 line-clamp-3 flex-1 text-xs leading-relaxed text-on-surface-variant sm:mb-5 sm:line-clamp-none sm:text-sm md:text-base">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between gap-1 border-t border-surface-container pt-3 sm:pt-4">
                        <span className="font-heading text-[11px] font-bold leading-tight text-secondary sm:text-sm md:text-base">
                          {product.priceLabel}
                        </span>
                        <Link
                          href={productPath}
                          aria-label={`Voir les détails de ${product.name}`}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-all hover:scale-110 hover:bg-primary-container sm:h-10 sm:w-10"
                        >
                          <MaterialIcon
                            name="arrow_forward"
                            className="text-lg sm:text-xl"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
