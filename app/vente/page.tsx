"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar";
import {
  catalogCategories,
  categoryValueFromParam,
} from "@/lib/catalog-categories";
import { getCatalogProducts, WHATSAPP_NUMBER } from "@/lib/products";

const products = getCatalogProducts();

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

function VenteCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("cat");
  const initialCategory = categoryValueFromParam(categoryParam);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setActiveCategory(categoryValueFromParam(categoryParam));
  }, [categoryParam]);

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
  }, [activeCategory, searchQuery]);

  const activeCategoryLabel =
    catalogCategories.find((c) => c.value === activeCategory)?.label ??
    "Tous les matériels";

  const handleCategoryChange = (value: string, param: string) => {
    setActiveCategory(value);
    const nextUrl = param === "all" ? "/vente" : `/vente?cat=${param}`;
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Vente" },
              ]}
            />
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
              Vente de matériel médical
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl md:text-5xl">
              Achetez votre{" "}
              <span className="text-primary">matériel médical</span>
            </h1>
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Parcourez notre catalogue de matériel médical à vendre : mobilité,
              respiratoire et confort. Livraison dans les grandes villes du
              Maroc.
            </p>
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
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(category.value, category.param)
                  }
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
                </button>
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
            <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                  Catalogue vente
                </span>
                <h2 className="font-heading text-xl font-semibold text-secondary sm:text-2xl md:text-3xl">
                  {activeCategoryLabel}
                </h2>
              </div>
              <span className="rounded-full bg-surface-container px-3 py-1 text-sm text-on-surface-variant">
                {filteredProducts.length} résultat
                {filteredProducts.length > 1 ? "s" : ""}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <Link
                      href={`/produits/${product.slug}`}
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
                      <Link href={`/produits/${product.slug}`}>
                        <h3 className="font-heading mb-2 text-lg font-semibold text-primary transition-colors hover:text-primary-container sm:text-xl">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-body mb-5 flex-1 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                        {product.tagline}
                      </p>
                      <div className="flex items-center justify-between border-t border-surface-container pt-4">
                        <span className="font-heading text-sm font-bold text-secondary sm:text-base">
                          {product.priceLabel}
                        </span>
                        <Link
                          href={`/produits/${product.slug}`}
                          aria-label={`Voir ${product.name}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-all hover:scale-110 hover:bg-primary-container"
                        >
                          <MaterialIcon name="arrow_forward" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
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
                    setActiveCategory("all");
                    setSearchQuery("");
                    router.replace("/vente", { scroll: false });
                  }}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-secondary px-6 py-12 text-center text-on-secondary shadow-2xl shadow-secondary/20 sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl">
              Besoin d&apos;un devis d&apos;achat ?
            </h2>
            <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
              Contactez-nous pour connaître la disponibilité et le prix de
              vente de votre matériel médical.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20acheter%20du%20mat%C3%A9riel%20m%C3%A9dical.`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-secondary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
            >
              <MaterialIcon name="chat" />
              WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default function VentePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center pt-20">
          <p className="text-on-surface-variant">Chargement du catalogue...</p>
        </div>
      }
    >
      <VenteCatalogContent />
    </Suspense>
  );
}
