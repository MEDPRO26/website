import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { activeCities, getCityBySlug, type CitySlug } from "@/lib/cities";
import { getCityHubContent } from "@/lib/city-hub-content";
import { WHATSAPP_NUMBER } from "@/lib/products";
import {
  hubCityPath,
  venteCategoryPath,
  venteCityPath,
} from "@/lib/routes";
import {
  buildGraph,
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  webPageSchema,
} from "@/lib/schema";

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

type CityHubPageProps = {
  citySlug: CitySlug;
};

export function buildCityHubMetadata(citySlug: CitySlug): Metadata {
  const city = getCityBySlug(citySlug)!;
  const content = getCityHubContent(citySlug);
  const path = hubCityPath(citySlug);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: path,
      type: "website",
      locale: "fr_MA",
      siteName: "SOS Santé",
    },
  };
}

export default function CityHubPage({ citySlug }: CityHubPageProps) {
  const city = getCityBySlug(citySlug)!;
  const content = getCityHubContent(citySlug);
  const path = hubCityPath(citySlug);

  const schema = buildGraph(
    webPageSchema(path, content.metaTitle, content.metaDescription),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: `Location et vente de matériel médical à ${city.name}`, item: path },
    ]),
    localBusinessSchema({
      name: content.badgeLabel,
      description: content.metaDescription,
      addressLocality: city.name,
      areaServed: city.zones.map((zone) => ({ "@type": "City", name: zone })),
    }),
    faqSchema(content.faqs, path)
  );

  const whatsappText = encodeURIComponent(
    `Bonjour ${content.badgeLabel}, je souhaite des informations sur le matériel médical à ${city.name}.`
  );

  return (
    <>
      <JsonLd data={schema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: `Location et vente de matériel médical à ${city.name}` },
              ]}
            />
          </div>
        </div>

        <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[100px]" />
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary sm:text-base">
              <MaterialIcon name="location_on" className="shrink-0 text-base" />
              <span>{content.badgeLabel}</span>
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-[1.12] tracking-tight text-secondary sm:text-4xl md:text-5xl lg:text-6xl">
              Location et vente de{" "}
              <span className="text-primary">matériel médical</span>, Services
              de <span className="text-primary">soins</span> et{" "}
              <span className="text-primary">aide</span> à {city.name}
            </h1>
            <p className="font-body mx-auto mb-6 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {content.intro}
            </p>
            <p className="font-body mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
              {city.deliveryText}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={venteCityPath(citySlug)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-container"
              >
                <MaterialIcon name="shopping_bag" />
                Voir le catalogue vente
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-white px-8 py-4 text-base font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:bg-secondary/5"
              >
                <MaterialIcon name="home_health" />
                Services et aide à domicile
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            {content.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="font-body mb-4 text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Vente et location matériel médical */}
        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                Matériel médical à {city.name}
              </span>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl">
                Vente et location de matériel médical
              </h2>
              <p className="font-body mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
                {content.equipmentIntro}
              </p>
            </div>
            <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              {content.equipmentServices.map((service) => {
                const inner = (
                  <>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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

                return service.href ? (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="group flex flex-col rounded-3xl border border-outline-variant/30 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div
                    key={service.title}
                    className="flex flex-col rounded-3xl border border-outline-variant/30 bg-surface-base p-6 shadow-sm"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.equipmentHighlights.map((item) => (
                <Link
                  key={item.title}
                  href={venteCategoryPath(item.categoryParam, citySlug)}
                  className="group rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary">
                    <MaterialIcon name={item.icon} className="text-2xl" />
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-secondary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Soins et aide à domicile */}
        <section className="bg-surface-container-low px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
                Nos services à {city.name}
              </span>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl">
                Soins et aide à domicile
              </h2>
              <p className="font-body mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
                {content.careIntro}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.careServices.map((service) => {
                const inner = (
                  <>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
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

                return service.href ? (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="group flex flex-col rounded-3xl border border-outline-variant/30 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-secondary/20 hover:shadow-md"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div
                    key={service.title}
                    className="flex flex-col rounded-3xl border border-outline-variant/30 bg-white p-6 shadow-sm"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading mb-6 text-2xl font-semibold text-secondary sm:text-3xl">
              Zones desservies à {city.name}
            </h2>
            <p className="font-body mb-6 max-w-3xl text-base leading-relaxed text-on-surface-variant">
              Livraison et vente de matériel médical à domicile dans les
              principales zones de {city.name} et ses environs :
            </p>
            <div className="flex flex-wrap gap-2">
              {city.zones.map((zone) => (
                <span
                  key={zone}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading mb-6 text-2xl font-semibold text-secondary sm:text-3xl">
              Autres villes SOS Santé
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeCities
                .filter((item) => item.slug !== citySlug)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={hubCityPath(item.slug)}
                    className="group flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary">
                        {item.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        {item.deliveryText}
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

        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading mb-6 text-center text-2xl font-semibold text-secondary sm:text-3xl">
              Questions fréquentes — matériel médical à {city.name}
            </h2>
            <div className="space-y-4">
              {content.faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-heading mb-2 text-lg font-semibold text-primary">
                    {faq.question}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-secondary px-6 py-12 text-center text-on-secondary shadow-2xl shadow-secondary/20 sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl">
              Besoin d&apos;un devis à {city.name} ?
            </h2>
            <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
              Contactez {content.badgeLabel} pour la vente, la location ou
              l&apos;aide à domicile. Réponse rapide par WhatsApp ou formulaire.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-status-success px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                <MaterialIcon name="chat" />
                WhatsApp · {city.name}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/80 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <MaterialIcon name="edit_note" />
                Formulaire de contact
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Vente :{" "}
              <Link href={venteCityPath(citySlug)} className="underline">
                catalogue vente {city.name}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
