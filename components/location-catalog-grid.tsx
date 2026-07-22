"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CatalogPagination, {
  CATALOG_PRODUCTS_PER_PAGE,
  CATALOG_PRODUCTS_PER_PAGE_MOBILE,
} from "@/components/catalog-pagination";
import { useProductsPerPage } from "@/hooks/use-products-per-page";
import { DEFAULT_CITY_SLUG, type CitySlug } from "@/lib/cities";
import type { Product } from "@/lib/products";
import { locationRentalProductPath, venteProductPath } from "@/lib/routes";

function MaterialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

function productHref(
  product: Product,
  linkMode: "produits" | "vente" | "location",
  citySlug: CitySlug
) {
  if (linkMode === "location") {
    return locationRentalProductPath(product.slug, citySlug);
  }
  if (linkMode === "produits") {
    return `/produits/${product.slug}`;
  }
  return venteProductPath(product.slug, citySlug);
}

export default function LocationCatalogGrid({
  products,
  cityName,
  citySlug = DEFAULT_CITY_SLUG,
  linkMode = "location",
}: {
  products: Product[];
  cityName: string;
  citySlug?: CitySlug;
  /** Location city pages use `/location-materiel-medical-{city}/produits/...`. */
  linkMode?: "produits" | "vente" | "location";
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = useProductsPerPage(
    CATALOG_PRODUCTS_PER_PAGE_MOBILE,
    CATALOG_PRODUCTS_PER_PAGE
  );

  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return products.slice(start, start + productsPerPage);
  }, [products, currentPage, productsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [productsPerPage, cityName]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById("produits")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="mb-8">
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
          Catalogue
        </span>
        <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
          Tous nos matériels médicaux à louer à {cityName}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => {
          const href = productHref(product, linkMode, citySlug);
          return (
            <article
              key={product.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <Link
                href={href}
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
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <Link href={href}>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-primary transition-colors hover:text-primary-container sm:text-xl">
                    {product.name}
                  </h3>
                </Link>
                <p className="font-body mb-5 flex-1 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  {product.description}
                </p>
                <div className="flex items-center justify-between border-t border-surface-container pt-4">
                  <span className="font-heading text-sm font-bold text-secondary sm:text-base">
                    Tarif sur demande
                  </span>
                  <Link
                    href={href}
                    aria-label={`Voir ${product.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-all hover:scale-110 hover:bg-primary-container"
                  >
                    <MaterialIcon name="arrow_forward" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-10 flex justify-center">
        <CatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </>
  );
}
