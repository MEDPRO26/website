import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import LocationCatalogGrid from "@/components/location-catalog-grid";
import Navbar from "@/components/navbar";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import SiteFooter from "@/components/site-footer";
import { HERO_IMAGE, SITE_URL_DEFAULT } from "@/lib/brand";
import { whatsAppHref } from "@/lib/products";
import { getLocationRentalProducts } from "@/lib/location-rental-products";
import { agadirHub } from "@/lib/seo-data";
import { locationRentalProductPath } from "@/lib/routes";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  itemListSchema,
  localBusinessSchema,
  webPageSchema,
} from "@/lib/schema";

const locationProducts = getLocationRentalProducts();
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: agadirHub.metaTitle,
    description: agadirHub.metaDescription,
    keywords: agadirHub.keywords,
    alternates: {
      canonical: "/location-materiel-medical-agadir",
    },
    openGraph: {
      title: agadirHub.metaTitle,
      description: agadirHub.metaDescription,
      url: "/location-materiel-medical-agadir",
      type: "website",
      locale: "fr_MA",
      siteName: "SOS Santé",
      images: [{ url: `${siteUrl}${HERO_IMAGE}` }],
    },
  };
}

const hubSchema = buildGraph(
  webPageSchema(
    "/location-materiel-medical-agadir",
    agadirHub.metaTitle,
    agadirHub.metaDescription
  ),
  breadcrumbSchema([
    { name: "Accueil", item: "/" },
    { name: "Location matériel médical Agadir", item: "/location-materiel-medical-agadir" },
  ]),
  localBusinessSchema({
    citySlug: "agadir",
    path: "/location-materiel-medical-agadir",
    description: agadirHub.description,
    addressLocality: "Agadir",
  }),
  itemListSchema(
    "Matériel médical disponible à Agadir",
    "/location-materiel-medical-agadir",
    locationProducts.map((product) => ({
      name: product.name,
      url: locationRentalProductPath(product.slug, "agadir"),
    }))
  ),
  faqSchema(agadirHub.faqs, "/location-materiel-medical-agadir")
);

export default function AgadirHubPage() {
  return (
    <>
      <JsonLd data={hubSchema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Location matériel médical Agadir" },
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
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              <span className="material-symbols-outlined text-base">location_on</span>
              Livraison incluse
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl md:text-5xl lg:text-6xl">
              Location de{" "}
              <span className="text-primary">matériel médical</span> à{" "}
              {agadirHub.name}
            </h1>
            <p className="font-body mb-8 text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
              {agadirHub.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#produits"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container"
              >
                Voir les produits
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
              <a
                href={whatsAppHref("Bonjour SOS Santé, je souhaite louer du matériel médical à Agadir.", "materiel")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-white/60 px-6 py-3.5 text-base font-semibold text-secondary backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-secondary/10"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-on-surface-variant sm:mt-8">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-status-success">
                  check_circle
                </span>
                Disponible 24h/7j
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-status-success">
                  check_circle
                </span>
                Devis gratuit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-status-success">
                  check_circle
                </span>
                Sans engagement
              </span>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl lg:aspect-square">
            <Image
              src={HERO_IMAGE}
              alt="Location de matériel médical à Agadir avec livraison à domicile"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md">
              <p className="font-heading text-lg font-bold text-primary">+1000</p>
              <p className="text-sm text-on-surface-variant">familles accompagnées</p>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="border-y border-outline-variant/40 bg-surface-container-low/60 px-4 py-10 backdrop-blur-sm sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading mb-5 text-xl font-semibold text-primary sm:text-2xl">
            Livraison dans tous les quartiers d’Agadir
          </h2>
          <div className="flex flex-wrap gap-2">
            {agadirHub.neighborhoods.map((neighborhood) => (
              <span
                key={neighborhood}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-on-surface shadow-sm"
              >
                {neighborhood}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* All products */}
      <section id="produits" className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <LocationCatalogGrid
            products={locationProducts}
            cityName={agadirHub.name}
            citySlug="agadir"
            linkMode="location"
          />
        </div>
      </section>

      {/* Description */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading mb-6 text-2xl font-semibold text-primary sm:text-3xl">
            Pourquoi louer du matériel médical à Agadir avec SOS Santé ?
          </h2>
          <div className="font-body space-y-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
            {agadirHub.longDescription.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              FAQ
            </span>
            <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
              Questions fréquentes à Agadir
            </h2>
          </div>
          <div className="space-y-3">
            {agadirHub.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-2xl border border-surface-container bg-white"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-heading text-base font-semibold text-primary sm:p-5 sm:text-lg">
                  {faq.question}
                  <span className="material-symbols-outlined shrink-0 rounded-full bg-primary-container/15 p-1 text-primary transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <p className="border-t border-surface-container p-4 pt-3 font-body text-sm leading-relaxed text-on-surface-variant sm:p-5 sm:pt-4 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-primary px-6 py-12 text-center text-on-primary shadow-2xl shadow-primary/25 sm:px-10 sm:py-16">
          <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
            Besoin de matériel médical à Agadir ?
          </h2>
          <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
            Demandez votre devis gratuit et recevez une réponse sous 15 minutes.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsAppHref("Bonjour SOS Santé, je souhaite louer du matériel médical à Agadir.", "materiel")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </a>
            <a
              href={`mailto:contact@sossante.ma?subject=Demande%20de%20devis%20matériel%20médical%20Agadir`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              <span className="material-symbols-outlined">mail</span>
              Email
            </a>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
