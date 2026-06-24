"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FooterContact, { FooterCopyright } from "@/components/footer-contact";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import RelatedProducts from "@/components/related-products";
import CityLinks from "@/components/city-links";
import {
  activeDeliveryCityLabel,
  activeDeliveryCities,
  DEFAULT_DELIVERY_CITY,
} from "@/lib/delivery-cities";
import { SITE_FULL_NAME } from "@/lib/brand";
import { VENTE_PAGE_PATH } from "@/lib/routes";
import {
  CONTACT_EMAIL,
  PRICE_ON_REQUEST,
  WHATSAPP_NUMBER,
  type Product,
} from "@/lib/products";

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

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetail({ product }: { product: Product }) {
  const gallery = product.gallery ?? [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    deliveryCity: DEFAULT_DELIVERY_CITY,
    quantity: "1",
    phone: "",
    message: "",
  });
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const nextImage = useCallback(() => {
    setActiveImage((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  const prevImage = useCallback(() => {
    setActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gallery.length <= 1) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gallery.length, nextImage, prevImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || gallery.length <= 1) return;
    const delta = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    setTouchStartX(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      setFormStatus("error");
      return;
    }

    const subject = encodeURIComponent(
      `Devis achat ${product.name} - ${formData.deliveryCity}`
    );
    const body = encodeURIComponent(
      `Bonjour SOS Santé,\n\nJe souhaite acheter : ${product.name}\nVille de livraison : ${formData.deliveryCity}\nQuantité : ${formData.quantity}\nTéléphone : ${formData.phone}${formData.message ? `\n\nMessage : ${formData.message}` : ""}\n\nMerci de me communiquer le prix et la disponibilité.\n\nCordialement,`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setFormStatus("success");
  };

  const whatsappText = encodeURIComponent(
    `Bonjour SOS Santé, je souhaite acheter un ${product.name} à ${formData.deliveryCity}.`
  );

  return (
    <>
      <Navbar />

      <main
        id="main-content"
        className="flex-1 pb-28 pt-16 md:pb-16 md:pt-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Fil d'Ariane"
            className="mb-6 text-sm text-on-surface-variant"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary"
                >
                  Accueil
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <MaterialIcon name="chevron_right" className="text-sm" />
                <Link
                  href={VENTE_PAGE_PATH}
                  className="transition-colors hover:text-primary"
                >
                  Vente
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <MaterialIcon name="chevron_right" className="text-sm" />
                <span className="font-semibold text-primary">
                  {product.shortName}
                </span>
              </li>
            </ol>
          </nav>

          {/* Title area */}
          <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2">
                <span
                  className={classNames(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                    product.categoryStyle
                  )}
                >
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-status-success">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
                  </span>
                  Livraison : {activeDeliveryCityLabel}
                </span>
              </div>
              <h1 className="font-heading text-3xl font-bold leading-tight text-on-surface sm:text-4xl md:text-5xl">
                Achat de {product.name.toLowerCase()} — {formData.deliveryCity}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-on-surface-variant sm:text-lg">
                {product.tagline}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Booking card — shown first on mobile for conversion */}
            <div className="order-first lg:order-2 lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <div className="shimmer-border overflow-hidden rounded-3xl">
                  <div className="rounded-3xl border border-surface-container-high bg-white p-5 shadow-lg sm:p-8">
                    <div className="mb-5">
                      <p className="font-heading text-2xl font-bold leading-none text-primary sm:text-3xl">
                        {PRICE_ON_REQUEST}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                        Renseignez vos besoins, un conseiller vous rappelle pour
                        finaliser votre achat.
                      </p>
                    </div>

                    {formStatus === "success" ? (
                      <div className="animate-fade-in py-6 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-status-success text-white">
                          <MaterialIcon name="check" className="text-2xl" />
                        </div>
                        <h3 className="font-heading mb-2 text-lg font-semibold text-primary">
                          Demande envoyée !
                        </h3>
                        <p className="mb-4 text-sm text-on-surface-variant">
                          Votre client mail devrait s&apos;ouvrir. Un conseiller
                          vous rappelle sous 15 minutes.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setFormStatus("idle");
                            setFormData({
                              deliveryCity: DEFAULT_DELIVERY_CITY,
                              quantity: "1",
                              phone: "",
                              message: "",
                            });
                          }}
                          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
                        >
                          Nouvelle demande
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
                          >
                            Ville de livraison
                          </label>
                          <div className="relative">
                            <MaterialIcon
                              name="location_on"
                              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-primary"
                            />
                            <select
                              id="city"
                              value={formData.deliveryCity}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  deliveryCity: e.target.value,
                                })
                              }
                              className="w-full appearance-none rounded-xl border-0 bg-surface-container-low py-3 pl-10 pr-10 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              {activeDeliveryCities.map((city) => (
                                <option key={city.slug} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                            <MaterialIcon
                              name="expand_more"
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="quantity"
                            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
                          >
                            Quantité
                          </label>
                          <input
                            id="quantity"
                            type="number"
                            min={1}
                            value={formData.quantity}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                quantity: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
                          >
                            Votre téléphone
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="06 XX XX XX XX"
                            className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
                          >
                            Précisions (optionnel)
                          </label>
                          <textarea
                            id="message"
                            rows={3}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            placeholder="Adresse, besoins spécifiques..."
                            className="w-full resize-none rounded-xl border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {formStatus === "error" && (
                          <p
                            role="alert"
                            className="flex items-center gap-2 rounded-lg bg-status-error/10 px-3 py-2 text-sm font-medium text-status-error"
                          >
                            <MaterialIcon name="error" />
                            Veuillez renseigner votre téléphone.
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-container active:scale-95"
                        >
                          Demander un devis d&apos;achat
                        </button>
                      </form>
                    )}

                    <div className="mt-5 flex items-center gap-4 rounded-2xl bg-surface-container-low p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                        <MaterialIcon name="support_agent" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">
                          Conseil gratuit
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          Un spécialiste vous rappelle en 15 min
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366]/30 bg-[#25D366]/5 py-3 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/10"
                    >
                      <MaterialIcon name="chat" />
                      WhatsApp Express
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Content column */}
            <div className="order-2 lg:order-1 lg:col-span-7">
              {/* Gallery */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-surface-container-high">
                <div
                  className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={gallery[activeImage] ?? product.image}
                    alt={product.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        aria-label="Image précédente"
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95 sm:left-4 sm:h-12 sm:w-12"
                      >
                        <MaterialIcon name="arrow_back" />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Image suivante"
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95 sm:right-4 sm:h-12 sm:w-12"
                      >
                        <MaterialIcon name="arrow_forward" />
                      </button>
                    </>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {product.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Voir l'image ${index + 1}`}
                      aria-current={activeImage === index}
                      className={classNames(
                        "relative h-16 w-20 shrink-0 overflow-hidden rounded-xl transition-all sm:h-20 sm:w-24",
                        activeImage === index
                          ? "ring-2 ring-primary shadow-md"
                          : "ring-1 ring-surface-container-high opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick specs */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center gap-3 rounded-2xl border border-surface-container-high bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/15 text-primary">
                      <MaterialIcon name="check_circle" />
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">
                        {spec.label}
                      </p>
                      <p className="font-heading text-sm font-bold text-on-surface sm:text-base">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <section className="mt-10 sm:mt-12">
                <h2 className="font-heading mb-4 text-xl font-semibold text-primary sm:text-2xl">
                  Description complète
                </h2>
                <div className="max-w-prose space-y-4">
                  <p className="text-base leading-relaxed text-on-surface-variant sm:text-lg">
                    {product.description}
                  </p>
                  <p className="text-base leading-relaxed text-on-surface-variant">
                    {product.extendedDescription}
                  </p>
                </div>
              </section>

              {/* Details grid */}
              <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:mt-12">
                <article className="rounded-3xl border border-surface-container-high bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                  <MaterialIcon
                    name="settings_input_component"
                    className="mb-3 text-2xl text-primary"
                  />
                  <h3 className="font-heading mb-3 text-base font-bold text-on-surface sm:text-lg">
                    Caractéristiques techniques
                  </h3>
                  <ul className="space-y-3 text-sm text-on-surface-variant sm:text-base">
                    {product.specs.map((spec) => (
                      <li
                        key={spec.label}
                        className="flex justify-between gap-4 border-b border-surface-container pb-3 last:border-0 last:pb-0"
                      >
                        <span>{spec.label}</span>
                        <span className="font-bold text-on-surface">
                          {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-3xl border border-surface-container-high bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                  <MaterialIcon
                    name="verified_user"
                    className="mb-3 text-2xl text-primary"
                  />
                  <h3 className="font-heading mb-3 text-base font-bold text-on-surface sm:text-lg">
                    Équipements inclus
                  </h3>
                  <ul className="space-y-3 text-sm text-on-surface-variant sm:text-base">
                    {product.included.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <MaterialIcon
                          name="check_circle"
                          className="text-sm text-status-success"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </section>

              {/* Use cases */}
              <section className="mt-10 rounded-3xl bg-primary-container/10 p-6 sm:mt-12 sm:p-8">
                <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl">
                  Dans quels cas l&apos;utiliser ?
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {product.useCases.map((useCase) => (
                    <div
                      key={useCase.title}
                      className="rounded-2xl bg-white p-5 text-center shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container/15 text-primary">
                        <MaterialIcon
                          name={useCase.icon}
                          className="text-2xl sm:text-3xl"
                        />
                      </div>
                      <h3 className="font-heading mb-2 text-sm font-bold text-on-surface sm:text-base">
                        {useCase.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-on-surface-variant">
                        {useCase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Trust signals */}
              <section className="mt-10 sm:mt-12">
                <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl">
                  Pourquoi acheter chez SOS Santé ?
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: "local_shipping",
                      title: "Livraison & installation",
                      text: "Nos techniciens livrent et installent le matériel chez vous.",
                    },
                    {
                      icon: "cleaning_services",
                      title: "Matériel contrôlé",
                      text: "Matériel neuf ou reconditionné, contrôlé et certifié.",
                    },
                    {
                      icon: "support_agent",
                      title: "Assistance 7j/7",
                      text: "Une équipe disponible pour répondre à vos questions.",
                    },
                    {
                      icon: "verified",
                      title: "Matériel certifié",
                      text: "Équipements contrôlés et conformes aux normes médicales.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-2xl border border-surface-container-high bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/15 text-primary">
                        <MaterialIcon name={item.icon} />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-on-surface sm:text-base">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Related products */}
          {product.related.length > 0 && (
            <section className="mt-14 sm:mt-20">
              <h2 className="font-heading mb-8 text-xl font-semibold text-on-surface sm:text-2xl">
                Produits fréquemment achetés ensemble
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {product.related.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/produits/${related.slug}`}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-surface-container-high transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden sm:h-52">
                      <Image
                        src={related.image}
                        alt={related.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading mb-1 text-base font-bold text-on-surface sm:text-lg">
                        {related.name}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                        {related.description}
                      </p>
                      <span className="font-heading text-sm font-bold text-secondary sm:text-base">
                        {PRICE_ON_REQUEST}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <RelatedProducts
            currentSlug={product.slug}
            category={product.category}
          />
          <CityLinks title="Livraison de ce matériel dans d'autres villes" />
        </div>
      </main>

      <footer className="bg-surface-container-highest px-4 py-14 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Logo href="/" size="lg" className="mb-4" />
            <p className="font-heading mb-2 text-sm font-semibold text-on-surface sm:text-base">
              {SITE_FULL_NAME}
            </p>
            <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Solutions professionnelles de santé à domicile au Maroc.
              Location et vente de matériel médical à Agadir et dans tout le
              royaume.
            </p>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={VENTE_PAGE_PATH}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Vente
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Soins Infirmiers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Assistance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Aide & FAQ
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <FooterContact title="Contact Agadir" />
          <FooterCopyright />
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110 md:bottom-10 md:right-10"
      >
        <MaterialIcon name="chat" className="text-3xl" />
      </a>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-background px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
      >
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="home" />
          <span className="text-[10px] font-medium">Accueil</span>
        </Link>
        <Link
          href="/#materiels"
          className="flex flex-1 flex-col items-center justify-center py-2 text-primary"
        >
          <MaterialIcon name="medical_services" />
          <span className="text-[10px] font-bold">Matériel</span>
        </Link>
        <Link
          href="/services"
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="volunteer_activism" />
          <span className="text-[10px] font-medium">Services</span>
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-status-success"
        >
          <MaterialIcon name="chat" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </nav>
    </>
  );
}
