import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { HERO_IMAGE, SITE_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import type { PillarPageContent } from "@/lib/pillar-pages";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsAppHref } from "@/lib/products";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  serviceSchema,
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

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export function buildPillarMetadata(content: PillarPageContent): Metadata {
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: content.path },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: content.path,
      type: "website",
      locale: "fr_MA",
      siteName: SITE_NAME,
      images: [{ url: `${siteUrl}${HERO_IMAGE}` }],
    },
  };
}

export default function PillarPage({ content }: { content: PillarPageContent }) {
  const schema = buildGraph(
    webPageSchema(content.path, content.metaTitle, content.metaDescription),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: content.h1, item: content.path },
    ]),
    serviceSchema(content.h1, content.metaDescription, content.path),
    faqSchema(content.faqs, content.path)
  );

  const whatsapp = whatsAppHref(content.whatsappMessage, "general");

  return (
    <>
      <JsonLd data={schema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <section className="relative min-h-[72vh] overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt={`${SITE_NAME} — ${content.h1}`}
            fill
            priority
            className="object-cover object-[30%_center] animate-fade-in"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-secondary/25" />
          <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16 lg:pb-20">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 animate-fade-in-up">
              {content.badge}
            </p>
            <h1 className="font-heading mb-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl animate-fade-in-up">
              {content.h1}
            </h1>
            <p className="font-body mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg animate-fade-in-up">
              {content.heroLead}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up">
              <TrackedWhatsAppLink
                href={whatsapp}
                placement="pillar"
                line="general"
                label="Guide — hero"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Demander un devis WhatsApp
              </TrackedWhatsAppLink>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <MaterialIcon name="call" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: content.h1 },
              ]}
            />
          </div>
        </div>

        <section className="px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="mx-auto max-w-5xl">
            <p className="font-body max-w-3xl text-lg leading-relaxed text-on-surface-variant sm:text-xl">
              {content.intro}
            </p>
          </div>
        </section>

        {content.showcase && content.showcase.items.length > 0 ? (
          <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
                {content.showcase.title}
              </h2>
              {content.showcase.intro ? (
                <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
                  {content.showcase.intro}
                </p>
              ) : (
                <div className="mb-10" />
              )}
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {content.showcase.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group block overflow-hidden rounded-2xl border border-outline-variant/40 bg-white transition-colors hover:border-primary/40"
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden bg-surface-container-low">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </span>
                      <span className="font-heading block px-4 py-3 text-base font-semibold text-primary group-hover:underline">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {content.sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={
              index % 2 === 0
                ? "bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20"
                : "px-4 py-14 sm:px-6 lg:py-20"
            }
          >
            <div className="mx-auto max-w-5xl">
              <h2 className="font-heading mb-5 text-2xl font-semibold text-primary sm:text-3xl">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="font-body mb-4 max-w-3xl text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-6 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="font-body flex gap-3 text-base text-on-surface-variant sm:text-lg"
                    >
                      <MaterialIcon
                        name="check_circle"
                        className="mt-0.5 shrink-0 text-status-success"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              Situations fréquentes
            </h2>
            <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
              Des cas concrets où les familles nous contactent pour organiser du
              matériel à domicile.
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              {content.useCases.map((item) => (
                <div key={item.title}>
                  <h3 className="font-heading mb-2 text-xl font-semibold text-on-surface">
                    {item.title}
                  </h3>
                  <p className="font-body text-on-surface-variant">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              Par ville
            </h2>
            <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
              Accédez aux pages locales pour la disponibilité, les délais et les
              catalogues.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.cityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group block rounded-2xl border border-outline-variant/40 bg-white px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <span className="font-heading text-base font-semibold text-primary group-hover:underline">
                      {link.label}
                    </span>
                    {link.description ? (
                      <span className="font-body mt-1 block text-sm text-on-surface-variant">
                        {link.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              Équipements et catégories
            </h2>
            <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
              Liens vers les pages produits et catégories les plus demandées.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {content.moneyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-heading inline-flex items-center gap-2 text-base font-semibold text-primary transition-colors hover:text-primary-container"
                  >
                    <MaterialIcon name="arrow_forward" className="text-lg" />
                    {link.label}
                  </Link>
                  {link.description ? (
                    <p className="font-body ml-8 mt-0.5 text-sm text-on-surface-variant">
                      {link.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {content.blogLinks.length > 0 ? (
          <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
                Guides et articles
              </h2>
              <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
                Contenu de soutien pour comprendre le matériel et préparer la
                demande.
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {content.blogLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-heading text-base font-semibold text-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                    {link.description ? (
                      <p className="font-body mt-1 text-sm text-on-surface-variant">
                        {link.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              Pages liées
            </h2>
            <ul className="mt-6 flex flex-wrap gap-4">
              {content.relatedPillars.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/50 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    {link.label}
                    <MaterialIcon name="chevron_right" className="text-base" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-8 text-2xl font-semibold text-primary sm:text-3xl">
              Questions fréquentes
            </h2>
            <div className="space-y-6">
              {content.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-on-surface">
                    {faq.question}
                  </h3>
                  <p className="font-body text-base leading-relaxed text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl">
              {content.ctaTitle}
            </h2>
            <p className="font-body mx-auto mb-8 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.ctaText}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <TrackedWhatsAppLink
                href={whatsapp}
                placement="pillar"
                line="general"
                label="Guide — CTA bas"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </TrackedWhatsAppLink>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <MaterialIcon name="call" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
