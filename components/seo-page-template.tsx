"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Breadcrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar";
import { CONTACT_EMAIL, WHATSAPP_NUMBER, type Product } from "@/lib/products";
import { seoCategories, seoCities, type SeoCategory, type SeoCity } from "@/lib/seo-data";

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

function FaqAccordion({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-primary/20 bg-white shadow-md"
                : "border-surface-container bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between p-4 text-left sm:p-5"
            >
              <span className="font-heading pr-4 text-base font-semibold text-primary sm:text-lg">
                {faq.question}
              </span>
              <span
                className={`shrink-0 rounded-full bg-primary-container/15 p-1 text-primary transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <MaterialIcon name="expand_more" />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="border-t border-surface-container p-4 pt-3 font-body text-sm leading-relaxed text-on-surface-variant sm:p-5 sm:pt-4 sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
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
          {product.description}
        </p>
        <div className="flex items-center justify-between border-t border-surface-container pt-4">
          <span className="font-heading text-sm font-bold text-primary sm:text-base">
            Tarif sur demande
          </span>
          <Link
            href={`/produits/${product.slug}`}
            aria-label={`Voir ${product.name}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container transition-all hover:scale-110 hover:bg-primary hover:text-on-primary"
          >
            <MaterialIcon name="arrow_forward" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CtaSection({ title }: { title: string }) {
  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-primary px-6 py-12 text-center text-on-primary shadow-2xl shadow-primary/25 sm:px-10 sm:py-16">
        <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
          Demandez votre devis gratuit et recevez une réponse sous 15 minutes.
          Notre équipe vous accompagne dans le choix du matériel adapté.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MediDomicile%2C%20je%20souhaite%20louer%20du%20matériel%20médical.`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
          >
            <MaterialIcon name="chat" />
            WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Demande%20de%20devis%20matériel%20médical`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
          >
            <MaterialIcon name="mail" />
            Email
          </a>
        </div>
      </div>
    </section>
  );
}

export function SeoCategoryPage({
  category,
  products,
}: {
  category: SeoCategory;
  products: Product[];
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
                  <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Matériel médical", href: "/location-materiel-medical-agadir" },
                { label: category.label },
              ]}
            />
          </div>
        </div>

        {/* Hero */}
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            <MaterialIcon name={category.icon} className="text-base" />
            Location à Agadir et au Maroc
          </div>
          <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            {category.title}
          </h1>
          <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              Notre sélection
            </span>
            <h2 className="font-heading text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
              Matériel de {category.label.toLowerCase()} disponible à la location
            </h2>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-surface-container-low p-8 text-center text-on-surface-variant">
              Aucun produit dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading mb-6 text-2xl font-semibold text-primary sm:text-3xl">
            Pourquoi louer du matériel de {category.label.toLowerCase()} à
            Agadir ?
          </h2>
          <div className="font-body space-y-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
            {category.longDescription.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              FAQ
            </span>
            <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <FaqAccordion faqs={category.faqs} />
        </div>
      </section>

      {/* City links */}
      <section className="border-t border-outline-variant/30 bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
            Louer du matériel de {category.label.toLowerCase()} dans d’autres
            villes
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seoCities.slice(0, 3).map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
              >
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {city.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {city.deliveryText}
                  </p>
                </div>
                <MaterialIcon
                  name="arrow_forward"
                  className="text-primary transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection title={`Louer du matériel de ${category.label.toLowerCase()}`} />
      </main>
    </>
  );
}

export function SeoCityPage({
  city,
  products,
}: {
  city: SeoCity;
  products: Product[];
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
                  <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: city.name },
              ]}
            />
          </div>
        </div>

        {/* Hero */}
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            <MaterialIcon name="location_on" className="text-base" />
            Livraison à domicile
          </div>
          <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            {city.title}
          </h1>
          <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
            {city.description}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              Disponible à {city.name}
            </span>
            <h2 className="font-heading text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
              Matériel médical en location à {city.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading mb-6 text-2xl font-semibold text-primary sm:text-3xl">
            Location de matériel médical à {city.name}
          </h2>
          <div className="font-body space-y-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
            {city.longDescription.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6">
            <h3 className="font-heading mb-2 text-lg font-semibold text-primary">
              Livraison
            </h3>
            <p className="font-body text-on-surface-variant">
              {city.deliveryText}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              FAQ
            </span>
            <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
              Questions fréquentes à {city.name}
            </h2>
          </div>
          <FaqAccordion faqs={city.faqs} />
        </div>
      </section>

      {/* Category links */}
      <section className="border-t border-outline-variant/30 bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
            Catégories de matériel médical à {city.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seoCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MaterialIcon name={category.icon} className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {category.label}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Voir les produits
                  </p>
                </div>
                <MaterialIcon
                  name="arrow_forward"
                  className="text-primary transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection title={`Louer du matériel médical à ${city.name}`} />
      </main>
    </>
  );
}
