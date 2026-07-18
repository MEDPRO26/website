"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HeroScrollSection from "@/components/hero-scroll-section";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import SiteFooter from "@/components/site-footer";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import QuoteRequestSection from "@/components/quote-request-section";
import CityCatalogPickerDialog from "@/components/city-catalog-picker-dialog";
import { useProductsPerPage } from "@/hooks/use-products-per-page";
import { useSelectedCity } from "@/hooks/use-selected-city";
import { seoCategories } from "@/lib/seo-data";
import {
  hubCityPath,
  seoCategoryToCatalogParam,
  venteCategoryPath,
  venteCityPath,
  venteProductPath,
  nationalProductPath,
} from "@/lib/routes";
import {
  getCatalogProducts,
  whatsAppHref,
} from "@/lib/products";
import { activeCities, comingSoonCities, DEFAULT_CITY_SLUG } from "@/lib/cities";
import { homepageCareIntro } from "@/lib/city-hub-content";
import {
  getHomepageCareServices,
} from "@/lib/care-services";
import { getCoverageAreas } from "@/lib/delivery-cities";
import {
  buildGraph,
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  webPageSchema,
} from "@/lib/schema";

const defaultCatalogProducts = getCatalogProducts(DEFAULT_CITY_SLUG);

const HOMEPAGE_LATEST_PRODUCTS_MOBILE = 6;
const HOMEPAGE_LATEST_PRODUCTS_DESKTOP = 9;

const trustBadges = [
  { icon: "verified", label: "Matériel certifié", sub: "Normes médicales" },
  { icon: "local_shipping", label: "Livraison incluse", sub: "Les grandes villes du Maroc" },
  { icon: "cleaning_services", label: "Désinfection", sub: "Avant chaque location" },
  { icon: "support_agent", label: "Conseil gratuit", sub: "Réponse en 15 min" },
];

const heroGalleryImages = [
  {
    src: "/products/inogen-rove-g6-homme-masque-domicile.webp",
    alt: "Homme utilisant un concentrateur portable Inogen Rove G6 à domicile",
    href: nationalProductPath("inogen-rove-g6"),
    objectPosition: "28% center",
  },
  {
    src: "/products/masques-cpap-airfit.webp",
    alt: "Masques CPAP ResMed AirFit F20, N20, P10 et AirTouch",
    href: venteProductPath("masques-cpap-airfit-resmed", DEFAULT_CITY_SLUG),
  },
  {
    src: "/products/resmed-airsense-s11-femme-domicile.webp",
    alt: "Femme utilisant un appareil CPAP ResMed AirSense S11 à domicile",
    href: venteProductPath("resmed-airsense-s11-autoset-cpap", DEFAULT_CITY_SLUG),
  },
  {
    src: "/products/lumis-150-vni-resmed-homme-domicile.webp",
    alt: "Homme utilisant un appareil Lumis 150 VNI ResMed à domicile",
    href: venteProductPath("lumis-150-vni-resmed", DEFAULT_CITY_SLUG),
  },
  {
    src: "/products/concentrateur-oxygene-5l.webp",
    alt: "Concentrateur d'oxygène 5L Optimox",
    href: venteProductPath("concentrateur-oxygene-5l", DEFAULT_CITY_SLUG),
  },
];

const whyChooseUs = [
  {
    icon: "health_and_safety",
    title: "Matériel certifié et entretenu",
    text: "Tous nos équipements sont contrôlés, entretenus et désinfectés selon les protocoles médicaux avant chaque location.",
  },
  {
    icon: "schedule",
    title: "Disponible 24h/24, 7j/7",
    text: "Que ce soit pour une urgence ou un besoin planifié, nous assurons une mise à disposition rapide dans les grandes villes du Maroc.",
  },
  {
    icon: "savings",
    title: "Tarifs transparents",
    text: "Location à la journée, à la semaine ou au mois. Aucun frais caché : vous payez uniquement ce qui vous est utile.",
  },
  {
    icon: "sentiment_satisfied",
    title: "Accompagnement humain",
    text: "Nos conseillers vous guident dans le choix du matériel et restent disponibles pendant toute la durée de la location.",
  },
];

const coverageAreas = getCoverageAreas();
const homepageCareServices = getHomepageCareServices();

const rentalSteps = [
  {
    icon: "search_check",
    title: "Sélectionnez",
    text: "Choisissez le matériel adapté à vos besoins parmi notre large gamme certifiée.",
  },
  {
    icon: "event_available",
    title: "Réservez",
    text: "Faites votre demande en ligne ou via WhatsApp. Un conseiller vous rappelle pour finaliser.",
  },
  {
    icon: "local_shipping",
    title: "Livraison",
    text: "Nous livrons et installons le matériel chez vous dans les grandes villes du Maroc.",
  },
];

const faqs = [
  {
    question: "Quelle est la durée minimale de location de matériel médical ?",
    answer:
      "La durée minimale varie selon le type de matériel. Généralement, elle est d'une semaine pour les lits médicalisés et les fauteuils roulants. Nous proposons aussi des formules à la journée pour certains équipements et des tarifs dégressifs pour les locations longue durée.",
  },
  {
    question: "La livraison et l'installation sont-elles incluses ?",
    answer:
      "Oui, la livraison et l'installation sont incluses dans nos forfaits dans les grandes villes du Maroc que nous desservons. Pour les autres zones, des frais de transport minimes peuvent s'appliquer selon la distance. Notre équipe vous donne un devis transparent avant chaque envoi.",
  },
  {
    question: "Le matériel médical est-il désinfecté entre deux locations ?",
    answer:
      "Absolument. Chaque équipement subit un protocole de nettoyage et de désinfection rigoureux aux normes médicales avant chaque nouvelle location. Cette étape est essentielle pour garantir la sécurité et l'hygiène des patients.",
  },
  {
    question: "Comment louer du matériel médical avec SOS Santé ?",
    answer:
      "Rien de plus simple : sélectionnez votre matériel sur notre catalogue, remplissez le formulaire de demande ou contactez-nous par WhatsApp. Un conseiller vous rappelle sous 15 minutes pour confirmer la disponibilité, les tarifs et organiser la livraison.",
  },
  {
    question: "Quels types de matériel médical proposez-vous à la vente ?",
    answer:
      "Notre catalogue respiratoire comprend des concentrateurs d'oxygène (5L, 10L, portables), nébuliseurs, kits de nébulisation, masques à oxygène, manodétendeurs, aspirateurs chirurgicaux et spiromètres. Tous nos produits sont adaptés à l'usage à domicile.",
  },
  {
    question: "Intervenez-vous uniquement dans les grandes villes ou partout au Maroc ?",
    answer:
      "Nous couvrons actuellement plusieurs grandes villes du Maroc, avec une extension progressive vers d'autres agglomérations. Contactez-nous pour connaître les délais et frais selon votre ville.",
  },
];

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

const homeSchema = buildGraph(
  webPageSchema(
    "/",
    "Vente, location de matériel médical et soins à domicile",
    "Vente et location de matériel médical au Maroc. Soins et aide à domicile au Maroc : lits, fauteuils, oxygène. Devis rapide."
  ),
  breadcrumbSchema([{ name: "Accueil", item: "/" }]),
  itemListSchema(
    "Matériel médical en location",
    "/",
    defaultCatalogProducts.map((product) => ({
      name: product.name,
      url: venteProductPath(product.slug, DEFAULT_CITY_SLUG),
    }))
  ),
  faqSchema(faqs, "/")
);

export default function Home() {
  const { citySlug } = useSelectedCity();
  const products = useMemo(
    () => getCatalogProducts(citySlug),
    [citySlug]
  );
  const defaultFormCity = activeCities[0]?.name ?? "";
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [catalogPickerOpen, setCatalogPickerOpen] = useState(false);
  const [pickerProductSlug, setPickerProductSlug] = useState<string | null>(
    null
  );
  const [pickerServiceSlug, setPickerServiceSlug] = useState<string | null>(
    null
  );
  const latestProductsCount = useProductsPerPage(
    HOMEPAGE_LATEST_PRODUCTS_MOBILE,
    HOMEPAGE_LATEST_PRODUCTS_DESKTOP
  );

  const latestProducts = useMemo(
    () => [...products].slice(-latestProductsCount).reverse(),
    [products, latestProductsCount]
  );

  const productNames = useMemo(
    () => products.map((product) => product.name),
    [products]
  );

  const openCatalogPicker = (productSlug?: string) => {
    setPickerServiceSlug(null);
    setPickerProductSlug(productSlug ?? null);
    setCatalogPickerOpen(true);
  };

  const openServicePicker = (serviceSlug: string) => {
    setPickerProductSlug(null);
    setPickerServiceSlug(serviceSlug);
    setCatalogPickerOpen(true);
  };

  const closeCatalogPicker = () => {
    setCatalogPickerOpen(false);
    setPickerProductSlug(null);
    setPickerServiceSlug(null);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      const element = document.getElementById(id);
      if (element) {
        window.requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: "smooth" });
        });
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <>
      <JsonLd data={homeSchema} />
      <Navbar />

      <main className="flex-1 pb-20 md:pb-0">
        <HeroScrollSection
          images={heroGalleryImages}
          galleryOverlay={
            <>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5 rounded-2xl bg-white/95 p-2.5 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:gap-3 sm:p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container/20 text-primary sm:h-10 sm:w-10">
                  <MaterialIcon name="verified" className="text-lg sm:text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="font-heading truncate text-xs font-bold text-primary sm:text-base">
                    Qualité Certifiée
                  </p>
                  <p className="truncate text-[11px] text-on-surface-variant sm:text-sm">
                    Maintenance régulière assurée
                  </p>
                </div>
              </div>
              <div className="absolute right-4 top-4 hidden animate-float rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:block">
                <p className="font-heading text-lg font-bold text-primary">
                  +1000
                </p>
                <p className="text-xs text-on-surface-variant">
                  familles accompagnées
                </p>
              </div>
            </>
          }
        >
          <div className="animate-fade-in-up">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
              <MaterialIcon name="verified" className="shrink-0 text-base" />
              <span className="leading-snug">Matériel médical certifié au Maroc</span>
            </div>
            <h1 className="font-heading mb-4 text-[1.65rem] font-bold leading-[1.15] tracking-tight text-secondary sm:mb-5 sm:text-3xl md:text-5xl lg:text-6xl">
              Location et vente de{" "}
              <span className="text-primary">matériel médical</span>, Services
              de <span className="text-primary">soins</span> et{" "}
              <span className="text-primary">aide</span> au Maroc
            </h1>
            <p className="font-body mb-6 max-w-xl text-sm leading-relaxed text-on-surface-variant sm:mb-8 sm:text-base md:text-lg">
              Achetez du matériel médical à domicile au Maroc : lits
              médicalisés, fauteuils roulants, concentrateurs d&apos;oxygène,
              matelas anti-escarres. Livraison et installation incluses.
              Devis gratuit en 15 minutes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsAppHref("Bonjour SOS Santé, j'ai besoin d'aide pour choisir un matériel médical.", "general")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-xl sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                Besoin d&apos;aide ?
              </a>
              <button
                type="button"
                onClick={() => openCatalogPicker()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-white/60 px-6 py-3.5 text-base font-semibold text-secondary backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-secondary/10 sm:w-auto"
              >
                Voir le catalogue vente
                <MaterialIcon name="arrow_forward" className="text-lg" />
              </button>
            </div>
            <div className="mt-6 hidden flex-wrap items-center gap-4 text-sm text-on-surface-variant sm:mt-8 sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <MaterialIcon
                  name="check_circle"
                  className="text-status-success"
                />
                Disponible 24h/7j
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MaterialIcon
                  name="check_circle"
                  className="text-status-success"
                />
                Devis gratuit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MaterialIcon
                  name="check_circle"
                  className="text-status-success"
                />
                Sans engagement
              </span>
            </div>
          </div>
        </HeroScrollSection>

        {/* Trust Bar */}
        <section className="border-y border-outline-variant/40 bg-surface-container-low/60 px-4 py-6 backdrop-blur-sm sm:px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 shadow-sm backdrop-blur-sm sm:p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                  <MaterialIcon name={badge.icon} className="text-xl sm:text-2xl" />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-on-surface sm:text-base">
                    {badge.label}
                  </p>
                  <p className="text-xs text-on-surface-variant sm:text-sm">
                    {badge.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category quick links */}
        <section className="px-4 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 text-center">
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                Explorer par catégorie
              </span>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl">
                Quel type de matériel cherchez-vous ?
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {seoCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={venteCategoryPath(
                    seoCategoryToCatalogParam[category.slug] ?? "all",
                    citySlug
                  )}
                  className="group flex items-center gap-4 rounded-2xl border border-outline-variant/30 bg-surface-base p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-on-primary">
                    <MaterialIcon name={category.icon} className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-semibold text-secondary">
                      {category.label}
                    </h3>
                    <p className="text-sm text-on-surface-variant line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                  <MaterialIcon
                    name="arrow_forward"
                    className="text-secondary transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest products */}
        <section
          id="materiels"
          className="scroll-mt-20 bg-surface-container-low px-4 py-12 sm:px-6 sm:py-16 lg:py-20 md:scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                  Catalogue vente
                </span>
                <h2 className="font-heading text-xl font-semibold text-secondary sm:text-2xl md:text-3xl">
                  Matériel populaire
                </h2>
                <p className="font-body mt-2 text-sm text-on-surface-variant sm:text-base">
                  Les équipements les plus demandés à la vente près de chez
                  vous.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openCatalogPicker()}
                className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-primary bg-white px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/5"
              >
                Voir tout le catalogue
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {latestProducts.map((product) => (
                <article
                  key={product.slug}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => openCatalogPicker(product.slug)}
                    className="relative aspect-[4/3] w-full overflow-hidden text-left"
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
                  </button>
                  <div className="flex flex-1 flex-col p-3 sm:p-5">
                    <button
                      type="button"
                      onClick={() => openCatalogPicker(product.slug)}
                      className="text-left"
                    >
                      <h3 className="font-heading mb-1.5 line-clamp-2 text-sm font-semibold text-primary transition-colors hover:text-primary-container sm:mb-2 sm:text-lg md:text-xl">
                        {product.name}
                      </h3>
                    </button>
                    <p className="font-body mb-3 line-clamp-3 flex-1 text-xs leading-relaxed text-on-surface-variant sm:mb-5 sm:line-clamp-none sm:text-sm md:text-base">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between gap-1 border-t border-surface-container pt-3 sm:pt-4">
                      <span className="font-heading text-[11px] font-bold leading-tight text-secondary sm:text-sm md:text-base">
                        {product.priceLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => openCatalogPicker(product.slug)}
                        aria-label={`Voir les détails de ${product.name}`}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-all hover:scale-110 hover:bg-primary-container sm:h-10 sm:w-10"
                      >
                        <MaterialIcon name="arrow_forward" className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => openCatalogPicker()}
                className="inline-flex items-center gap-2 rounded-full border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
              >
                Voir tout le catalogue
                <MaterialIcon name="arrow_forward" className="text-lg" />
              </button>
            </div>
          </div>
        </section>

        {/* Soins et aide à domicile */}
        <section
          id="aide-domicile"
          className="bg-surface-container-low px-4 py-10 sm:px-6 sm:py-14"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                Nos services
              </span>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl">
                Soins et aide à domicile
              </h2>
              <p className="font-body mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
                {homepageCareIntro}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {homepageCareServices.map((service) => {
                const inner = (
                  <>
                    {service.image && (
                      <div className="relative -mx-6 -mt-6 mb-5 h-44 overflow-hidden sm:-mx-6">
                        <Image
                          src={service.image}
                          alt={service.imageAlt ?? service.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                      </div>
                    )}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                      <MaterialIcon name={service.icon} className="text-[28px]" />
                    </div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-xl font-semibold text-secondary">
                        {service.title}
                      </h3>
                      {service.badge && (
                        <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-semibold text-on-surface-variant">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-body flex-1 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                      {service.description}
                    </p>
                  </>
                );

                return (
                  <button
                    key={service.title}
                    type="button"
                    onClick={() => openServicePicker(service.slug)}
                    className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container"
              >
                <MaterialIcon name="support_agent" />
                En savoir plus sur nos services
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us / EEAT */}
        <section className="overflow-hidden bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center md:mb-14">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                Pourquoi nous choisir
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Un service pensé pour votre tranquillité
              </h2>
              <p className="font-body mx-auto max-w-2xl text-base text-on-surface-variant sm:text-lg">
                Nous accompagnons les familles et les soignants dans les
                grandes villes du Maroc avec du matériel médical fiable, livré
                et installé à domicile.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, index) => (
                <div
                  key={item.title}
                  className="animate-fade-in-up rounded-3xl border border-outline-variant/30 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-md shadow-primary/10">
                    <MaterialIcon name={item.icon} className="text-[28px]" />
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-secondary">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Areas - Local SEO */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                  Zones desservies
                </span>
                <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                  Grandes villes du Maroc
                </h2>
                <p className="font-body mb-6 text-base leading-relaxed text-on-surface-variant sm:text-lg">
                  Nous livrons actuellement dans les grandes villes du Maroc.
                  {coverageAreas.comingSoon.length > 0 && (
                    <> D&apos;autres agglomérations rejoignent notre réseau prochainement.</>
                  )}
                </p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container"
                >
                  Demander un devis
                  <MaterialIcon name="arrow_forward" />
                </a>
              </div>

              <div className="grid gap-5">
                <div className="rounded-3xl border border-primary/10 bg-primary/5 p-6">
                  <h3 className="font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
                    <MaterialIcon name="location_on" />
                    Villes desservies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeCities.map((activeCity) => (
                      <Link
                        key={activeCity.slug}
                        href={hubCityPath(activeCity.slug)}
                        className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-on-surface shadow-sm transition-colors hover:bg-primary hover:text-on-primary"
                      >
                        {activeCity.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-outline-variant/30 bg-surface-base p-6">
                  <h3 className="font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
                    <MaterialIcon name="schedule" />
                    Prochainement
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {comingSoonCities.map((soonCity) => (
                      <span
                        key={soonCity.slug}
                        className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 text-sm text-on-surface-variant"
                      >
                        <MaterialIcon name="schedule" className="text-base" />
                        {soonCity.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section
          id="services"
          className="overflow-hidden bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center md:mb-14">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                Comment ça marche
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Louer en 3 étapes simples
              </h2>
              <p className="font-body mx-auto max-w-2xl text-base text-on-surface-variant sm:text-lg">
                Un processus simplifié pour vous permettre de vous concentrer
                sur l&apos;essentiel : votre rétablissement.
              </p>
            </div>
            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Connector line on desktop */}
              <div className="absolute left-1/2 top-16 hidden h-0.5 w-2/3 -translate-x-1/2 bg-primary/10 md:block" />
              {rentalSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="animate-fade-in-up relative z-10 flex flex-col items-center rounded-3xl border border-surface-container bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-md shadow-primary/10">
                    <MaterialIcon name={step.icon} className="text-[28px]" />
                  </div>
                  <h3 className="font-heading mb-2 text-xl font-semibold text-secondary">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center md:mb-12">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                FAQ
              </span>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Questions fréquentes sur la location
              </h2>
              <p className="font-body mx-auto mt-3 max-w-xl text-base text-on-surface-variant">
                Retrouvez les réponses aux questions les plus courantes sur la
                location de matériel médical dans les grandes villes du Maroc.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
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
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between p-4 text-left sm:p-5"
                    >
                      <span className="font-heading pr-4 text-base font-semibold text-primary sm:text-lg">
                        {faq.question}
                      </span>
                      <span
                        className={`shrink-0 rounded-full bg-primary/15 p-1 text-primary transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <MaterialIcon name="expand_more" />
                      </span>
                    </button>
                    <div
                      className="grid transition-all duration-300 ease-in-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-surface-container p-4 pt-0 font-body text-sm leading-relaxed text-secondary sm:p-5 sm:text-base">
                          <p className="pt-3 sm:pt-4">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <QuoteRequestSection
          title="Besoin d'un devis gratuit ?"
          description="Envoyez-nous votre demande, nos experts vous répondent en moins de 15 minutes pour organiser la location et la livraison de votre matériel médical."
          whatsappHref={whatsAppHref(
            "Bonjour SOS Santé, je souhaite louer du matériel médical.",
            "materiel"
          )}
          defaultCityName={defaultFormCity}
          pagePath="/accueil"
          productNames={productNames}
        />
      </main>

      <SiteFooter id="footer" />

      <CityCatalogPickerDialog
        open={catalogPickerOpen}
        onClose={closeCatalogPicker}
        productSlug={pickerProductSlug ?? undefined}
        serviceSlug={pickerServiceSlug ?? undefined}
      />
    </>
  );
}
