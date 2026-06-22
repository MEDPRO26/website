"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import { LOGO } from "@/lib/brand";
import {
  CONTACT_EMAIL,
  getCatalogProducts,
  WHATSAPP_NUMBER,
} from "@/lib/products";
import { seoCategories, seoCities } from "@/lib/seo-data";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medidomicile.ma"
).replace(/\/$/, "");

const products = getCatalogProducts();

const categories = [
  { label: "Tous les matériels", value: "all", icon: null },
  { label: "Mobilité", value: "Mobilité", icon: "accessible" },
  { label: "Respiratoire", value: "Respiratoire", icon: "air" },
  { label: "Confort", value: "Confort", icon: "bed" },
];

const trustBadges = [
  { icon: "verified", label: "Matériel certifié", sub: "Normes médicales" },
  { icon: "local_shipping", label: "Livraison incluse", sub: "Agadir & Maroc" },
  { icon: "cleaning_services", label: "Désinfection", sub: "Avant chaque location" },
  { icon: "support_agent", label: "Conseil gratuit", sub: "Réponse en 15 min" },
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
    text: "Que ce soit pour une urgence ou un besoin planifié, nous assurons une mise à disposition rapide à Agadir et au Maroc.",
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

const coverageAreas = {
  primary: "Agadir",
  neighborhoods: [
    "Hay Mohammadi",
    "Taddart",
    "Dakhla",
    "Les Amicales",
    "Islane",
    "Secteur Touristique",
    "Anza",
    "Aït Melloul",
  ],
  cities: ["Casablanca", "Marrakech", "Rabat", "Tanger", "Fès", "Essaouira"],
};

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
    text: "Nous livrons et installons le matériel chez vous à Agadir et partout au Maroc.",
  },
];

const faqs = [
  {
    question: "Quelle est la durée minimale de location de matériel médical ?",
    answer:
      "La durée minimale varie selon le type de matériel. Généralement, elle est d'une semaine pour les lits médicalisés et les fauteuils roulants. Nous proposons aussi des formules à la journée pour certains équipements et des tarifs dégressifs pour les locations longue durée.",
  },
  {
    question: "La livraison et l'installation sont-elles incluses à Agadir ?",
    answer:
      "Oui, la livraison et l'installation sont incluses dans nos forfaits pour la zone d'Agadir et ses environs immédiats. Pour le reste du Maroc, des frais de transport minimes peuvent s'appliquer selon la distance. Notre équipe vous donne un devis transparent avant chaque envoi.",
  },
  {
    question: "Le matériel médical est-il désinfecté entre deux locations ?",
    answer:
      "Absolument. Chaque équipement subit un protocole de nettoyage et de désinfection rigoureux aux normes médicales avant chaque nouvelle location. Cette étape est essentielle pour garantir la sécurité et l'hygiène des patients.",
  },
  {
    question: "Comment louer du matériel médical avec MediDomicile ?",
    answer:
      "Rien de plus simple : sélectionnez votre matériel sur notre catalogue, remplissez le formulaire de demande ou contactez-nous par WhatsApp. Un conseiller vous rappelle sous 15 minutes pour confirmer la disponibilité, les tarifs et organiser la livraison.",
  },
  {
    question: "Quels types de matériel médical peut-on louer ?",
    answer:
      "Nous proposons une large gamme de matériel médical à domicile : lits médicalisés électriques, fauteuils roulants, concentrateurs d'oxygène, matelas à air anti-escarres, rollators et soulève-malade. Tous nos produits sont adaptés au maintien à domicile.",
  },
  {
    question: "Intervenez-vous uniquement à Agadir ou dans tout le Maroc ?",
    answer:
      "Notre siège et notre zone de livraison prioritaire se situent à Agadir, mais nous livrons dans tout le Maroc : Casablanca, Marrakech, Rabat, Tanger, Fès, Essaouira et autres villes sur demande. Contactez-nous pour connaître les délais et frais selon votre ville.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "MediDomicile",
      url: siteUrl,
      logo: `${siteUrl}${LOGO.default}`,
      areaServed: [
        { "@type": "Country", name: "Maroc" },
        { "@type": "City", name: "Agadir" },
      ],
      knowsAbout: [
        "Location de matériel médical",
        "Aide à domicile",
        "Maintien à domicile",
        "Services de santé à domicile au Maroc",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: "MediDomicile",
      description:
        "Location de matériel médical à Agadir et livraison au Maroc. Lits médicalisés, fauteuils roulants, concentrateurs d'oxygène.",
      url: siteUrl,
      telephone: "+212-522-000000",
      email: CONTACT_EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Agadir",
        addressCountry: "MA",
      },
      areaServed: [
        { "@type": "City", name: "Agadir" },
        { "@type": "Country", name: "Maroc" },
      ],
      priceRange: "$$",
      openingHours: "Mo-Su 00:00-23:59",
      sameAs: [`https://wa.me/${WHATSAPP_NUMBER}`],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "MediDomicile",
      url: siteUrl,
      inLanguage: "fr-MA",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Location de matériel médical à Agadir et au Maroc | MediDomicile",
      description:
        "Louez du matériel médical à Agadir et au Maroc. Lits médicalisés, fauteuils roulants, oxygène. Livraison, installation et désinfection incluses.",
      inLanguage: "fr-MA",
      isPartOf: { "@id": `${siteUrl}/#website` },
      dateModified: "2026-06-20",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: siteUrl,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#products`,
      name: "Matériel médical en location",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `${siteUrl}/produits/${product.slug}`,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

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

function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    materiel: "",
    message: "",
  });

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const activeCategoryLabel =
    categories.find((c) => c.value === activeCategory)?.label ||
    "Tous les matériels";

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nom || !formData.telephone || !formData.materiel) {
      setFormStatus("error");
      return;
    }

    const subject = encodeURIComponent(
      `Demande de location - ${formData.materiel}`
    );
    const body = encodeURIComponent(
      `Bonjour MediDomicile,\n\nJe souhaite louer le matériel suivant : ${formData.materiel}\n\nNom : ${formData.nom}\nTéléphone : ${formData.telephone}\n\n${formData.message || "Merci de me recontacter rapidement."}\n\nCordialement,`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setFormStatus("success");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <JsonLd />
      <Navbar />

      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        {/* Hero Section */}
        <section
          id="accueil"
          className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-24"
        >
          {/* Gradient mesh background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-[20%] -top-[20%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-secondary/5 blur-[100px]" />
            <div className="absolute left-1/3 top-1/3 h-[40%] w-[40%] rounded-full bg-primary-fixed/20 blur-[80px]" />
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="animate-fade-in-up order-2 lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <MaterialIcon name="verified" className="text-base" />
                <span>Matériel médical certifié au Maroc</span>
              </div>
              <h1 className="font-heading mb-5 text-3xl font-bold leading-[1.12] tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                Location de matériel médical à{" "}
                <span className="text-primary-container">Agadir</span> et
                livraison au Maroc
              </h1>
              <p className="font-body mb-8 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                Louez du matériel médical à domicile à Agadir : lits
                médicalisés, fauteuils roulants, concentrateurs d&apos;oxygène,
                matelas anti-escarres. Livraison, installation et désinfection
                incluses. Devis gratuit en 15 minutes.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MediDomicile%2C%20j'ai%20besoin%20d'aide%20pour%20choisir%20un%20matériel%20médical.`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-xl"
                >
                  <MaterialIcon name="chat" />
                  Besoin d&apos;aide ?
                </a>
                <a
                  href="#materiels"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("materiels");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white/60 px-6 py-3.5 text-base font-semibold text-primary backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-primary/5"
                >
                  Voir le catalogue
                  <MaterialIcon name="arrow_forward" className="text-lg" />
                </a>
              </div>

              {/* Mini trust bar in hero */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
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

            <div className="animate-fade-in-up stagger-1 relative order-1 aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl lg:order-2 lg:aspect-square">
              <Image
                src="/medidomicile-hero.jpg"
                alt="Lit médicalisé électrique et fauteuil roulant dans un salon lumineux pour location à domicile à Agadir"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/20 text-primary">
                  <MaterialIcon name="verified" className="text-xl" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-primary sm:text-base">
                    Qualité Certifiée
                  </p>
                  <p className="text-xs text-on-surface-variant sm:text-sm">
                    Maintenance régulière assurée
                  </p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute right-4 top-4 hidden animate-float rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:block">
                <p className="font-heading text-lg font-bold text-primary">
                  +1000
                </p>
                <p className="text-xs text-on-surface-variant">
                  familles accompagnées
                </p>
              </div>
            </div>
          </div>
        </section>

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
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Explorer par catégorie
              </span>
              <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
                Quel type de matériel cherchez-vous ?
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {seoCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-outline-variant/30 bg-surface-base p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-on-primary">
                    <MaterialIcon name={category.icon} className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-semibold text-primary">
                      {category.label}
                    </h3>
                    <p className="text-sm text-on-surface-variant line-clamp-1">
                      {category.description}
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

        {/* Filter & Search */}
        <section
          id="materiels"
          className="sticky top-16 z-40 border-y border-outline-variant/50 bg-surface-container-low/90 px-4 py-4 backdrop-blur-md sm:px-6 md:top-20"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div
              className="flex w-full gap-2 overflow-x-auto pb-1 md:w-auto md:pb-0"
              role="tablist"
              aria-label="Filtres de catégorie"
            >
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  role="tab"
                  aria-selected={activeCategory === category.value}
                  className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === category.value
                      ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                      : "border border-outline-variant bg-white text-on-surface-variant hover:border-primary hover:text-primary"
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
              <label htmlFor="materiel-search" className="sr-only">
                Rechercher un matériel médical à louer
              </label>
              <input
                id="materiel-search"
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

        {/* Products Grid */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                  Notre catalogue
                </span>
                <h2 className="font-heading text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
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
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between border-t border-surface-container pt-4">
                        <span className="font-heading text-sm font-bold text-primary sm:text-base">
                          Tarif sur demande
                        </span>
                        <Link
                          href={`/produits/${product.slug}`}
                          aria-label={`Voir les détails de ${product.name}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container transition-all hover:scale-110 hover:bg-primary hover:text-on-primary"
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
                <h3 className="font-heading mb-2 text-lg font-semibold text-primary">
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
                  }}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us / EEAT */}
        <section className="overflow-hidden bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center md:mb-14">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Pourquoi nous choisir
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                Un service pensé pour votre tranquillité
              </h2>
              <p className="font-body mx-auto max-w-2xl text-base text-on-surface-variant sm:text-lg">
                Depuis Agadir, nous accompagnons les familles et les soignants
                avec du matériel médical fiable, livré et installé à domicile.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, index) => (
                <div
                  key={item.title}
                  className="animate-fade-in-up rounded-3xl border border-outline-variant/30 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/15 text-primary">
                    <MaterialIcon name={item.icon} className="text-[28px]" />
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-primary">
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
                <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                  Zones desservies
                </span>
                <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                  Location de matériel médical à Agadir et au Maroc
                </h2>
                <p className="font-body mb-6 text-base leading-relaxed text-on-surface-variant sm:text-lg">
                  Notre base logistique à Agadir nous permet de livrer rapidement
                  dans tous les quartiers de la ville. Nous expédions également
                  vers les principales villes du Maroc avec des délais adaptés.
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
                <Link
                  href="/location-materiel-medical-agadir"
                  className="group block rounded-3xl border border-primary/10 bg-primary/5 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <h3 className="font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
                    <MaterialIcon name="location_on" />
                    Agadir et environs
                    <MaterialIcon
                      name="arrow_forward"
                      className="ml-auto text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coverageAreas.neighborhoods.map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-white px-3 py-1.5 text-sm text-on-surface shadow-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </Link>
                <div className="rounded-3xl border border-outline-variant/30 bg-surface-base p-6">
                  <h3 className="font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
                    <MaterialIcon name="map" />
                    Livraison dans tout le Maroc
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {seoCities.slice(0, 5).map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="rounded-full bg-surface-container-low px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
                      >
                        {city.name}
                      </Link>
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
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Comment ça marche
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
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
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container shadow-md shadow-primary/10">
                    <MaterialIcon name={step.icon} className="text-[28px]" />
                  </div>
                  <h3 className="font-heading mb-2 text-xl font-semibold text-primary">
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
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                FAQ
              </span>
              <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                Questions fréquentes sur la location
              </h2>
              <p className="font-body mx-auto mt-3 max-w-xl text-base text-on-surface-variant">
                Retrouvez les réponses aux questions les plus courantes sur la
                location de matériel médical à Agadir et au Maroc.
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
                        className={`shrink-0 rounded-full bg-primary-container/15 p-1 text-primary transition-transform duration-300 ${
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
                        <div className="border-t border-surface-container p-4 pt-0 font-body text-sm leading-relaxed text-on-surface-variant sm:p-5 sm:text-base">
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

        {/* CTA / Contact Section */}
        <section id="contact" className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 overflow-hidden rounded-[32px] bg-primary p-6 shadow-2xl shadow-primary/20 sm:p-10 md:flex-row md:p-14 lg:p-16">
            <div className="relative z-10 flex-1 text-center md:text-left">
              <h2 className="font-heading mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Besoin d&apos;un devis gratuit ?
              </h2>
              <p className="font-body mx-auto mb-6 max-w-md text-base text-white/90 md:mx-0 sm:text-lg">
                Envoyez-nous votre demande, nos experts vous répondent en moins
                de 15 minutes pour organiser la location et la livraison de
                votre matériel médical.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MediDomicile%2C%20je%20souhaite%20louer%20du%20matériel%20médical.`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-status-success px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:brightness-110"
                >
                  <MaterialIcon name="chat" />
                  Commander par WhatsApp
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Demande%20de%20devis%20matériel%20médical`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
                >
                  <MaterialIcon name="mail" />
                  Nous envoyer un email
                </a>
              </div>
            </div>

            <div className="relative z-10 w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:p-6 md:w-[45%] lg:w-1/3">
              {formStatus === "success" ? (
                <div className="animate-fade-in py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success text-white">
                    <MaterialIcon name="check" className="text-3xl" />
                  </div>
                  <h3 className="font-heading mb-2 text-xl font-semibold text-white">
                    Demande envoyée !
                  </h3>
                  <p className="font-body mb-5 text-sm text-white/90">
                    Votre client mail devrait s&apos;ouvrir. Sinon, nous vous
                    répondrons rapidement.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormStatus("idle");
                      setFormData({
                        nom: "",
                        telephone: "",
                        materiel: "",
                        message: "",
                      });
                    }}
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
                  >
                    Nouvelle demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label
                      htmlFor="nom"
                      className="mb-1.5 block text-sm font-medium text-white"
                    >
                      Votre nom
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      placeholder="Prénom et nom"
                      className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="telephone"
                      className="mb-1.5 block text-sm font-medium text-white"
                    >
                      Téléphone
                    </label>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={(e) =>
                        setFormData({ ...formData, telephone: e.target.value })
                      }
                      placeholder="06 XX XX XX XX"
                      className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="materiel"
                      className="mb-1.5 block text-sm font-medium text-white"
                    >
                      Matériel souhaité
                    </label>
                    <select
                      id="materiel"
                      name="materiel"
                      required
                      value={formData.materiel}
                      onChange={(e) =>
                        setFormData({ ...formData, materiel: e.target.value })
                      }
                      className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                    >
                      <option value="" disabled>
                        Choisir un matériel
                      </option>
                      {products.map((p) => (
                        <option key={p.slug} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                      <option value="Autre matériel">Autre matériel</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-white"
                    >
                      Message (optionnel)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Précisez vos besoins, la durée souhaitée, votre ville..."
                      className="w-full resize-none rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                    />
                  </div>
                  {formStatus === "error" && (
                    <p
                      role="alert"
                      className="flex items-center gap-2 rounded-lg bg-status-error/90 px-3 py-2 text-sm font-medium text-white"
                    >
                      <MaterialIcon name="error" className="text-base" />
                      Veuillez remplir tous les champs obligatoires.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary-container py-3.5 text-base font-semibold text-on-primary-container shadow-lg shadow-black/10 transition-all hover:scale-[1.02] hover:brightness-105 active:scale-[0.98]"
                  >
                    Envoyer ma demande
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="tarifs"
        className="bg-surface-container-highest px-4 pb-24 pt-14 sm:px-6 sm:pb-14 md:pb-14 lg:pt-20"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Logo href="/" size="lg" className="mb-4" />
            <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Votre partenaire de confiance pour le maintien à domicile au
              Maroc. Location de matériel médical à Agadir et dans tout le
              royaume.
            </p>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "À propos", href: "accueil", isRoute: false },
                { label: "Nos Services", href: "/services", isRoute: true },
                { label: "Location Matériel", href: "materiels", isRoute: false },
                { label: "FAQ", href: "faq", isRoute: false },
              ].map((link) => (
                <li key={link.href}>
                  {link.isRoute ? (
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={`#${link.href}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Conditions Générales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Contact
            </h4>
            <p className="mb-1 text-sm text-on-surface-variant sm:text-base">
              Agadir, Maroc
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
            >
              {CONTACT_EMAIL}
            </a>
            <div className="mt-4 flex gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                aria-label="Contacter sur WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110"
              >
                <MaterialIcon name="chat" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Envoyer un email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110"
              >
                <MaterialIcon name="mail" />
              </a>
            </div>
          </div>
          <div className="border-t border-outline-variant pt-6 text-center text-xs text-on-surface-variant sm:text-sm md:col-span-4">
            © 2026 SOS Santé — Location de matériel médical à Agadir et
            au Maroc. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-background px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
      >
        <a
          href="#accueil"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("accueil");
          }}
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="home" />
          <span className="text-[10px] font-medium">Accueil</span>
        </a>
        <a
          href="#materiels"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("materiels");
          }}
          className="flex flex-1 flex-col items-center justify-center py-2 text-primary"
        >
          <MaterialIcon name="medical_services" />
          <span className="text-[10px] font-medium">Matériel</span>
        </a>
        <Link
          href="/services"
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="volunteer_activism" />
          <span className="text-[10px] font-medium">Services</span>
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-status-success"
        >
          <MaterialIcon name="chat" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </nav>
    </>
  );
}
