"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import RelatedProducts from "@/components/related-products";
import SiteFooter from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { useSubmitLead } from "@/hooks/use-submit-lead";
import { activeCities } from "@/lib/cities";
import type { ProductLandingContent } from "@/lib/product-landing-pages";
import { buildProductLandingSchema } from "@/lib/product-landing-schema";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsAppHref } from "@/lib/products";
import { hubCityPath, venteProductPath } from "@/lib/routes";

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

function ContentSection({
  title,
  paragraphs,
  bullets,
  image,
  imageAlt,
  imagePosition = "right",
}: {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
}) {
  const imageBlock = (
    <div className="relative min-h-[280px] overflow-hidden rounded-3xl shadow-lg sm:min-h-[360px]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
    </div>
  );

  const textBlock = (
    <div>
      <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl">
        {title}
      </h2>
      <div className="space-y-4">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 48)}
            className="text-sm leading-relaxed text-on-surface-variant sm:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {bullets.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-on-surface-variant sm:text-base"
            >
              <MaterialIcon
                name="check_circle"
                className="mt-0.5 shrink-0 text-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      {imagePosition === "left" ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
}

export default function ProductLandingPage({
  content,
}: {
  content: ProductLandingContent;
}) {
  const pathname = usePathname();
  const { product } = content;
  const gallery = product.gallery ?? [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: activeCities[0]?.name ?? "Agadir",
    message: "",
  });
  const { submit, isSubmitting } = useSubmitLead();

  const schema = buildProductLandingSchema(content);
  const whatsappText = `Bonjour SOS Santé, je souhaite un devis pour l'${product.name} au Maroc.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormStatus("error");
      return;
    }

    try {
      await submit({
        client: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city,
        type: "Vente matériel médical",
        item: product.name,
        message: formData.message.trim() || "Demande de devis depuis la landing page produit",
        pagePath: pathname,
        source: `Landing produit · ${product.shortName}`,
      });
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <>
      <JsonLd data={schema} />
      <Navbar />

      <main className="flex-1 pb-24 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: product.category, href: "/materiel-respiratoire" },
                { label: product.shortName },
              ]}
            />
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-surface-base to-secondary/5" />
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <MaterialIcon name="medical_services" className="text-base" />
                {content.heroBadge}
              </div>
              <h1 className="font-heading mb-3 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
                {content.h1}
              </h1>
              {content.h1Accent && (
                <p className="font-heading mb-5 text-xl font-semibold text-secondary sm:text-2xl">
                  {content.h1Accent}
                </p>
              )}
              <p className="mb-6 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                {content.heroIntro}
              </p>
              <div className="mb-8 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${product.categoryStyle}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#devis"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/25 transition-all hover:brightness-110 sm:text-base"
                >
                  <MaterialIcon name="request_quote" />
                  Devis gratuit
                </a>
                <a
                  href={whatsAppHref(whatsappText, "general")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-status-success px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 sm:text-base"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp
                </a>
              </div>
              <p className="mt-4 text-sm text-on-surface-variant">
                Ou appelez-nous :{" "}
                <a href={`tel:${PHONE_NUMBER}`} className="font-semibold text-primary">
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>

            <div>
              <div className="relative mx-auto aspect-[4/3] max-w-lg overflow-hidden rounded-3xl shadow-2xl lg:max-w-none">
                <Image
                  src={gallery[activeImage]}
                  alt={content.heroImageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              {gallery.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {gallery.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      aria-label={`Afficher l'image ${index + 1}`}
                      aria-current={activeImage === index ? "true" : undefined}
                      onClick={() => setActiveImage(index)}
                      className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all sm:h-16 sm:w-16 ${
                        activeImage === index
                          ? "border-primary shadow-md"
                          : "border-outline-variant/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="border-y border-outline-variant/30 bg-white py-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6 lg:px-8">
            {content.trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
              >
                <span className="mb-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-0 sm:mr-3">
                  <MaterialIcon name={badge.icon} />
                </span>
                <div>
                  <p className="text-sm font-bold text-primary">{badge.label}</p>
                  <p className="text-xs text-on-surface-variant">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="font-heading mb-3 text-2xl font-bold text-secondary sm:text-3xl md:text-4xl">
                Pourquoi choisir l&apos;Inogen Rove G6 ?
              </h2>
              <p className="mx-auto max-w-2xl text-on-surface-variant">
                Le concentrateur portable de référence pour retrouver votre indépendance au quotidien.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MaterialIcon name={benefit.icon} className="text-2xl" />
                  </span>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-secondary">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Content sections */}
        <section className="bg-surface-container-low/50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-16 sm:space-y-20">
            {content.sections.map((section) => (
              <ContentSection key={section.title} {...section} />
            ))}
          </div>
        </section>

        {/* Specs + comparison */}
        <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-heading mb-6 text-2xl font-bold text-secondary sm:text-3xl">
                  Fiche technique complète
                </h2>
                <dl className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
                  {content.fullSpecs.map((row, index) => (
                    <div
                      key={row.label}
                      className={`grid grid-cols-[1fr_1.2fr] gap-3 px-4 py-3 text-sm sm:px-5 sm:text-base ${
                        index % 2 === 0 ? "bg-surface-container-low/40" : "bg-white"
                      }`}
                    >
                      <dt className="font-medium text-on-surface-variant">
                        {row.label}
                      </dt>
                      <dd className="font-semibold text-primary">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h2 className="font-heading mb-6 text-2xl font-bold text-secondary sm:text-3xl">
                  {content.comparisonTitle}
                </h2>
                <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
                  <div className="grid grid-cols-3 bg-primary px-4 py-3 text-xs font-bold text-on-primary sm:text-sm">
                    <span />
                    <span className="text-center">Rove G6</span>
                    <span className="text-center">Fixe 5 L</span>
                  </div>
                  {content.comparisonRows.map((row, index) => (
                    <div
                      key={row.feature}
                      className={`grid grid-cols-3 gap-2 px-4 py-3 text-xs sm:text-sm ${
                        index % 2 === 0 ? "bg-surface-container-low/40" : "bg-white"
                      }`}
                    >
                      <span className="font-medium text-on-surface-variant">
                        {row.feature}
                      </span>
                      <span className="text-center font-semibold text-primary">
                        {row.portable}
                      </span>
                      <span className="text-center text-on-surface-variant">
                        {row.fixed}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-heading mb-4 text-lg font-semibold text-secondary">
                    Contenu du pack
                  </h3>
                  <ul className="space-y-2">
                    {content.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-on-surface-variant sm:text-base"
                      >
                        <MaterialIcon
                          name="inventory_2"
                          className="shrink-0 text-primary"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lead form */}
        <section
          id="devis"
          className="scroll-mt-24 bg-gradient-to-br from-primary to-primary-container px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="text-on-primary">
              <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
                {content.ctaTitle}
              </h2>
              <p className="mb-6 text-base text-on-primary/90 sm:text-lg">
                {content.ctaDescription}
              </p>
              <ul className="space-y-3 text-sm sm:text-base">
                {[
                  "Devis personnalisé selon votre prescription",
                  "Choix batterie 8 ou 16 cellules",
                  "Livraison et mise en service au Maroc",
                  "Support WhatsApp 7j/7",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <MaterialIcon name="check_circle" className="shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
              {formStatus === "success" ? (
                <div className="py-8 text-center">
                  <MaterialIcon
                    name="check_circle"
                    className="mb-4 text-5xl text-status-success"
                  />
                  <p className="font-heading text-xl font-semibold text-primary">
                    Demande envoyée !
                  </p>
                  <p className="mt-2 text-on-surface-variant">
                    Nous vous recontactons sous 15 minutes.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="landing-name"
                        className="mb-1 block text-sm font-medium text-on-surface"
                      >
                        Nom complet *
                      </label>
                      <input
                        id="landing-name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full rounded-xl border border-outline-variant/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="landing-phone"
                        className="mb-1 block text-sm font-medium text-on-surface"
                      >
                        Téléphone *
                      </label>
                      <input
                        id="landing-phone"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full rounded-xl border border-outline-variant/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="landing-city"
                        className="mb-1 block text-sm font-medium text-on-surface"
                      >
                        Ville de livraison
                      </label>
                      <select
                        id="landing-city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, city: e.target.value }))
                        }
                        className="w-full rounded-xl border border-outline-variant/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {activeCities.map((city) => (
                          <option key={city.slug} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="landing-message"
                        className="mb-1 block text-sm font-medium text-on-surface"
                      >
                        Message (optionnel)
                      </label>
                      <textarea
                        id="landing-message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, message: e.target.value }))
                        }
                        className="w-full resize-none rounded-xl border border-outline-variant/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Débit prescrit, usage quotidien, questions..."
                      />
                    </div>
                  </div>
                  {formStatus === "error" && (
                    <p className="mt-3 text-sm text-status-error">
                      Veuillez remplir les champs obligatoires.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary transition-all hover:brightness-110 disabled:opacity-60"
                  >
                    {isSubmitting ? "Envoi..." : "Demander mon devis gratuit"}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading mb-8 text-center text-2xl font-bold text-secondary sm:text-3xl">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {content.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      isOpen
                        ? "border-primary/20 bg-white shadow-md"
                        : "border-outline-variant/30 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="flex w-full cursor-pointer items-center justify-between p-4 text-left sm:p-5"
                    >
                      <span className="font-heading pr-4 text-base font-semibold text-primary sm:text-lg">
                        {faq.question}
                      </span>
                      <MaterialIcon
                        name="expand_more"
                        className={`shrink-0 text-primary transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="border-t border-outline-variant/30 px-4 pb-4 pt-3 text-sm leading-relaxed text-on-surface-variant sm:px-5 sm:pb-5 sm:text-base">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* City links */}
        <section className="border-t border-outline-variant/30 bg-surface-container-low/50 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading mb-2 text-xl font-semibold text-secondary sm:text-2xl">
              Acheter l&apos;Inogen Rove G6 dans votre ville
            </h2>
            <p className="mb-6 text-on-surface-variant">
              Pages locales avec livraison et conseil dédié.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeCities.map((city) => (
                <Link
                  key={city.slug}
                  href={venteProductPath(product.slug, city.slug)}
                  className="group flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-secondary">
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
              {activeCities.length > 0 && (
                <Link
                  href={hubCityPath(activeCities[0].slug)}
                  className="group flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 transition-all hover:bg-primary/10"
                >
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-secondary">
                      Toutes nos villes
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Hubs location & vente
                    </p>
                  </div>
                  <MaterialIcon
                    name="map"
                    className="text-primary transition-transform group-hover:translate-x-1"
                  />
                </Link>
              )}
            </div>
          </div>
        </section>

        <RelatedProducts
          currentSlug={product.slug}
          category={product.category}
          citySlug="agadir"
        />
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-outline-variant/30 bg-white/95 p-3 backdrop-blur-md md:hidden">
        <a
          href="#devis"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-on-primary"
        >
          Devis gratuit
        </a>
        <a
          href={whatsAppHref(whatsappText, "general")}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-status-success py-3 text-sm font-semibold text-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>

      <SiteFooter />
    </>
  );
}
