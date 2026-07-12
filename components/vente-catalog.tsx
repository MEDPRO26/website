"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CitySelector from "@/components/city-selector";
import Breadcrumb from "@/components/breadcrumb";
import CatalogPagination, {
  CATALOG_PRODUCTS_PER_PAGE,
  CATALOG_PRODUCTS_PER_PAGE_MOBILE,
} from "@/components/catalog-pagination";
import Navbar from "@/components/navbar";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import SiteFooter from "@/components/site-footer";
import VenteCatalogFaq from "@/components/vente-catalog-faq";
import { useProductsPerPage } from "@/hooks/use-products-per-page";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import { writeStoredCitySlug } from "@/lib/city-storage";
import {
  catalogCategories,
  categoryValueFromParam,
} from "@/lib/catalog-categories";
import { getCatalogProducts } from "@/lib/products";
import { cityWhatsAppHref } from "@/lib/whatsapp-lines";
import {
  hubCityPath,
  venteCityPath,
  venteCategoryPath,
  venteProductPath,
} from "@/lib/routes";

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

type VenteCatalogProps = {
  citySlug: CitySlug;
  categorySlug: string | null;
};

export default function VenteCatalog({ citySlug, categorySlug }: VenteCatalogProps) {
  const router = useRouter();
  const city = getCityBySlug(citySlug)!;
  const products = useMemo(() => getCatalogProducts(citySlug), [citySlug]);
  const activeCategory = categoryValueFromParam(categorySlug);
  const activeCategoryMeta = catalogCategories.find(
    (category) => category.value === activeCategory
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = useProductsPerPage(
    CATALOG_PRODUCTS_PER_PAGE_MOBILE,
    CATALOG_PRODUCTS_PER_PAGE
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tagline.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage, productsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, citySlug, productsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
  };

  const activeCategoryLabel = activeCategoryMeta?.label ?? "Tous les matériels";
  const activeCategoryParam = activeCategoryMeta?.param ?? "all";
  const catalogBasePath = venteCityPath(citySlug);
  const hubPath = hubCityPath(citySlug);

  const handleCityChange = (nextCitySlug: CitySlug) => {
    if (nextCitySlug === citySlug) return;
    writeStoredCitySlug(nextCitySlug);
    router.push(venteCategoryPath(activeCategoryParam, nextCitySlug));
  };

  const breadcrumbItems =
    activeCategory === "all"
      ? [
          { label: "Accueil", href: "/" },
          {
            label: `Location et vente à ${city.name}`,
            href: hubPath,
          },
          { label: `Vente matériel médical ${city.name}` },
        ]
      : [
          { label: "Accueil", href: "/" },
          {
            label: `Location et vente à ${city.name}`,
            href: hubPath,
          },
          {
            label: `Vente ${city.name}`,
            href: catalogBasePath,
          },
          { label: activeCategoryLabel },
        ];

  const whatsappText = `Bonjour SOS Santé ${city.name}, je souhaite acheter du matériel médical.`;

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <section className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[100px]" />
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              <MaterialIcon name="shopping_bag" className="text-base" />
              Vente à {city.name}
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl md:text-5xl">
              Achetez votre{" "}
              <span className="text-primary">matériel médical</span> à {city.name}
            </h1>
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Catalogue vente disponible à {city.name}. {city.deliveryText}{" "}
              <Link
                href={hubPath}
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                Retour à la page {city.name}
              </Link>
            </p>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body mb-4 text-sm text-on-surface-variant sm:text-base">
              Vous consultez le catalogue de {city.name}. Changez de ville si
              vous souhaitez voir la livraison disponible ailleurs.
            </p>
            <CitySelector
              className="mx-auto w-full max-w-md"
              variant="prominent"
              citySlug={citySlug}
              onCityChange={handleCityChange}
            />
          </div>
        </section>

        <section
          id="catalogue"
          className="sticky top-16 z-40 border-y border-outline-variant/50 bg-surface-container-low/90 px-4 py-4 backdrop-blur-md sm:px-6 md:top-20"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div
              className="flex w-full gap-2 overflow-x-auto pb-1 md:w-auto md:pb-0"
              role="tablist"
              aria-label="Catégories de matériel en vente"
            >
              {catalogCategories.map((category) => (
                <Link
                  key={category.value}
                  href={venteCategoryPath(category.param, citySlug)}
                  scroll={false}
                  role="tab"
                  aria-selected={activeCategory === category.value}
                  className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === category.value
                      ? "bg-secondary text-on-secondary shadow-md shadow-secondary/20"
                      : "border border-outline-variant bg-white text-on-surface-variant hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {category.icon && (
                    <MaterialIcon name={category.icon} className="text-lg" />
                  )}
                  {category.label}
                </Link>
              ))}
            </div>
            <div className="relative w-full md:w-72 lg:w-80">
              <MaterialIcon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <label htmlFor="vente-search" className="sr-only">
                Rechercher un matériel médical
              </label>
              <input
                id="vente-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un matériel..."
                className="w-full rounded-full border border-outline-variant bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Effacer la recherche"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-on-surface-variant hover:bg-surface-container"
                >
                  <MaterialIcon name="close" className="text-lg" />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                  Catalogue vente · {city.name}
                </span>
                <h2 className="font-heading text-xl font-semibold text-secondary sm:text-2xl md:text-3xl">
                  {activeCategoryLabel}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <CatalogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
                <span className="rounded-full bg-surface-container px-3 py-1 text-sm text-on-surface-variant">
                  {filteredProducts.length} résultat
                  {filteredProducts.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                  {paginatedProducts.map((product) => (
                    <article
                      key={product.slug}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                      <Link
                        href={venteProductPath(product.slug, citySlug)}
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
                        <Link href={venteProductPath(product.slug, citySlug)}>
                          <h3 className="font-heading mb-1.5 line-clamp-2 text-sm font-semibold text-primary transition-colors hover:text-primary-container sm:mb-2 sm:text-lg md:text-xl">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="font-body mb-3 line-clamp-3 flex-1 text-xs leading-relaxed text-on-surface-variant sm:mb-5 sm:line-clamp-none sm:text-sm md:text-base">
                          {product.tagline}
                        </p>
                        <div className="flex items-center justify-between gap-1 border-t border-surface-container pt-3 sm:pt-4">
                          <span className="font-heading text-[11px] font-bold leading-tight text-secondary sm:text-sm md:text-base">
                            {product.priceLabel}
                          </span>
                          <Link
                            href={venteProductPath(product.slug, citySlug)}
                            aria-label={`Voir ${product.name}`}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-all hover:scale-110 hover:bg-primary-container sm:h-10 sm:w-10"
                          >
                            <MaterialIcon name="arrow_forward" className="text-lg sm:text-xl" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-10 flex justify-center">
                  <CatalogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-outline-variant bg-surface-container-low p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                  <MaterialIcon name="search_off" className="text-3xl" />
                </div>
                <h3 className="font-heading mb-2 text-lg font-semibold text-secondary">
                  Aucun matériel trouvé
                </h3>
                <p className="font-body mb-4 text-on-surface-variant">
                  Essayez un autre terme ou sélectionnez une catégorie
                  différente.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    router.push(catalogBasePath);
                  }}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>

        <VenteCatalogFaq citySlug={citySlug} />

        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-secondary px-6 py-12 text-center text-on-secondary shadow-2xl shadow-secondary/20 sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl">
              Besoin d&apos;un devis d&apos;achat à {city.name} ?
            </h2>
            <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
              Contactez-nous pour connaître la disponibilité et le prix de
              vente de votre matériel médical à {city.name}.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={cityWhatsAppHref(city, whatsappText, "materiel")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-secondary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/80 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <MaterialIcon name="edit_note" />
                Remplir le formulaire
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
