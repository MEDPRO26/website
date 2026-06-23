import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import { CONTACT_EMAIL, getCatalogProducts, WHATSAPP_NUMBER } from "@/lib/products";
import {
  breadcrumbSchema,
  buildGraph,
  itemListSchema,
  offerCatalogSchema,
  webPageSchema,
} from "@/lib/schema";
import {
  careServicePricing,
  includedServices,
  materialPricing,
  type PricingRow,
} from "@/lib/tarifs";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sossante.ma"
).replace(/\/$/, "");

const catalogProducts = getCatalogProducts();

export const metadata: Metadata = {
  title: "Tarifs location matériel médical Agadir | SOS Santé",
  description:
    "Consultez nos tarifs de location de matériel médical à Agadir : lit médicalisé, fauteuil roulant, concentrateur d'oxygène, matelas anti-escarres. Devis gratuit.",
  keywords: [
    "tarifs location matériel médical Agadir",
    "prix lit médicalisé Agadir",
    "prix fauteuil roulant Agadir",
    "location oxygène Agadir tarif",
  ],
  alternates: {
    canonical: "/tarifs",
  },
  openGraph: {
    title: "Tarifs location matériel médical Agadir | SOS Santé",
    description:
      "Tarifs transparents pour la location de matériel médical à Agadir et au Maroc.",
    url: "/tarifs",
    type: "website",
    locale: "fr_MA",
    siteName: "SOS Santé",
    images: [{ url: `${siteUrl}/medidomicile-hero.jpg` }],
  },
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

function PricingTable({
  title,
  rows,
}: {
  title: string;
  rows: PricingRow[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-outline-variant/30 bg-white shadow-sm">
      <div className="border-b border-outline-variant/20 px-6 py-6 sm:px-8 sm:py-7">
        <h2 className="font-heading text-xl font-semibold text-primary sm:text-2xl">
          {title}
        </h2>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary sm:mx-0" />
      </div>
      <ul>
        {rows.map((row, index) => (
          <li
            key={row.name}
            className={`flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-6 ${
              index < rows.length - 1 ? "border-b border-outline-variant/20" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-semibold text-primary sm:text-lg">
                {row.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                {row.description}
              </p>
              {row.note ? (
                <p className="mt-1 text-xs text-on-surface-variant/80 sm:text-sm">
                  {row.note}
                </p>
              ) : null}
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="font-heading text-base font-bold text-primary sm:text-lg">
                {row.price}
              </p>
              <p className="text-sm text-on-surface-variant">{row.unit}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const tarifsSchema = buildGraph(
  webPageSchema(
    "/tarifs",
    "Tarifs location matériel médical Agadir | MediDomicile",
    "Consultez nos tarifs de location de matériel médical à Agadir : lit médicalisé, fauteuil roulant, concentrateur d'oxygène, matelas anti-escarres. Devis gratuit."
  ),
  breadcrumbSchema([
    { name: "Accueil", item: "/" },
    { name: "Tarifs", item: "/tarifs" },
  ]),
  offerCatalogSchema(
    "Tarifs de location de matériel médical",
    "/tarifs",
    [
      ...materialPricing.map((item) => ({
        name: item.name,
        price: item.price,
        description: item.note ?? item.description,
        category: "Matériel médical",
      })),
      ...careServicePricing.map((item) => ({
        name: item.name,
        price: item.price,
        description: item.note ?? item.description,
        category: "Services de soins",
      })),
    ]
  ),
  itemListSchema(
    "Produits en location",
    "/tarifs",
    catalogProducts.map((product) => ({
      name: product.name,
      url: `/produits/${product.slug}`,
    }))
  )
);

export default function TarifsPage() {
  return (
    <>
      <JsonLd data={tarifsSchema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Tarifs" },
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
              <MaterialIcon name="payments" className="text-base" />
              Tarifs transparents
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Tarifs de location de matériel médical à Agadir
            </h1>
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
              Consultez nos tarifs indicatifs pour la location de matériel
              médical et les soins à domicile. Chaque devis est personnalisé
              selon la durée, le matériel et la zone de livraison.
            </p>
          </div>
        </section>

        {/* Pricing tables */}
        <section className="px-4 py-6 sm:px-6 sm:py-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            <PricingTable
              title="Location de matériel médical"
              rows={materialPricing}
            />
            <PricingTable
              title="Services de soins à domicile"
              rows={careServicePricing}
            />

            <div className="rounded-3xl border border-primary/10 bg-primary/5 p-6 text-center sm:p-8">
              <p className="font-body text-base text-on-surface-variant sm:text-lg">
                Les tarifs affichés sont indicatifs et peuvent varier selon la
                durée de location, la zone de livraison et les options choisies.
                Contactez-nous pour obtenir un devis personnalisé en 15 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Included services */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                  Services inclus
                </span>
                <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                  Ce qui est inclus dans chaque location
                </h2>
                <p className="font-body mb-6 text-base leading-relaxed text-on-surface-variant sm:text-lg">
                  Chez SOS Santé, nous ne louons pas seulement du matériel.
                  Nous vous accompagnons avec un service complet pour votre
                  tranquillité.
                </p>
                <ul className="space-y-3">
                  {includedServices.map((service) => (
                    <li
                      key={service}
                      className="flex items-start gap-3 text-on-surface-variant"
                    >
                      <MaterialIcon
                        name="check_circle"
                        className="shrink-0 text-status-success"
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl lg:aspect-square">
                <Image
                  src="/medidomicile-hero.jpg"
                  alt="Matériel médical livré et installé à domicile à Agadir"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Catalogue */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
                  Matériel disponible à la location
                </h2>
                <p className="font-body mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  Découvrez une sélection de notre catalogue. Livraison et
                  installation à Agadir.
                </p>
              </div>
              <Link
                href="/location-materiel-medical-agadir"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2 sm:text-base"
              >
                Voir tout le catalogue
                <MaterialIcon name="arrow_forward" className="text-base" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catalogProducts.map((product) => (
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
                        aria-label={`Louer ${product.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary transition-all hover:scale-110 hover:bg-primary-container"
                      >
                        <MaterialIcon name="add_shopping_cart" className="text-xl" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-primary px-6 py-12 text-center text-on-primary shadow-2xl shadow-primary/25 sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Besoin d’un devis personnalisé ?
            </h2>
            <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
              Recevez une réponse sous 15 minutes avec un tarif adapté à votre
              besoin et votre zone de livraison.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20un%20devis%20pour%20la%20location%20de%20matériel%20médical.`}
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
      </main>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20un%20devis%20pour%20la%20location%20de%20matériel%20médical.`}
        aria-label="Contacter sur WhatsApp"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-status-success text-white shadow-lg shadow-status-success/30 transition-transform hover:scale-110 md:bottom-6"
      >
        <MaterialIcon name="chat" className="text-2xl" />
      </a>
    </>
  );
}
