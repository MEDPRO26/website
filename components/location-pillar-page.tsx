import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { SITE_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import PillarSectionImage from "@/components/pillar-section-image";
import type {
  LocationPillarContent,
  LocationPillarLink,
} from "@/lib/location-pillar-content";
import { locationPillarContent } from "@/lib/location-pillar-content";
import { PHONE_DISPLAY, PHONE_NUMBER, whatsAppHref } from "@/lib/products";
import PillarProductSidebar from "@/components/pillar-product-sidebar";
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

export function buildLocationPillarMetadata(
  content: LocationPillarContent = locationPillarContent
): Metadata {
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
      images: [
        {
          url: `${siteUrl}${content.heroImage}`,
          alt: content.heroImageAlt,
        },
      ],
    },
  };
}

function InlineLink({ link }: { link: LocationPillarLink }) {
  return (
    <Link
      href={link.href}
      className="font-heading mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
    >
      {link.label}
      <MaterialIcon name="arrow_forward" className="text-base" />
    </Link>
  );
}

function WhatsAppCta({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <TrackedWhatsAppLink
      href={href}
      placement="pillar"
      line="general"
      label={label}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </TrackedWhatsAppLink>
  );
}

export default function LocationPillarPage({
  content = locationPillarContent,
}: {
  content?: LocationPillarContent;
}) {
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
        <section className="relative min-h-[78vh] overflow-hidden">
          <Image
            src={content.heroImage}
            alt={content.heroImageAlt}
            title={content.heroImageTitle ?? content.heroImageAlt}
            fill
            priority
            className="object-cover object-[30%_center] animate-fade-in"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/75 to-secondary/30" />
          <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16 lg:pb-20">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 animate-fade-in-up">
              {content.badge}
            </p>
            <h1 className="font-heading mb-2 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl animate-fade-in-up">
              {content.h1}
            </h1>
            <p className="font-heading mb-5 max-w-2xl text-xl font-medium text-white/90 sm:text-2xl animate-fade-in-up">
              {content.heroTitleSuffix}
            </p>
            <p className="font-body mb-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg animate-fade-in-up">
              {content.heroLead}
            </p>
            <ul className="mb-8 max-w-2xl space-y-2 animate-fade-in-up">
              {content.reassurance.map((item) => (
                <li
                  key={item}
                  className="font-body flex gap-2.5 text-sm text-white/85 sm:text-base"
                >
                  <MaterialIcon
                    name="check_circle"
                    className="mt-0.5 shrink-0 text-status-success"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up">
              <WhatsAppCta href={whatsapp} label={content.primaryCtaLabel} />
              <a
                href={content.secondaryCtaHref ?? "#equipements"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <MaterialIcon
                  name={
                    (content.secondaryCtaHref ?? "").startsWith("tel:")
                      ? "call"
                      : "inventory_2"
                  }
                />
                {content.secondaryCtaLabel}
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

        {content.productSidebar ? (
          <div className="px-4 pb-6 lg:hidden sm:px-6">
            <div className="mx-auto max-w-5xl">
              <PillarProductSidebar sidebar={content.productSidebar} />
            </div>
          </div>
        ) : null}

        <div
          className={
            content.productSidebar
              ? "relative mx-auto max-w-7xl xl:pr-[320px]"
              : undefined
          }
        >
          {content.productSidebar ? (
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 hidden w-[300px] xl:block">
              <div className="pointer-events-auto sticky top-[calc(var(--site-header-offset,4rem)+1rem)] max-h-[calc(100dvh-var(--site-header-offset,4rem)-1.5rem)] overflow-y-auto overscroll-contain px-2 py-2 [scrollbar-gutter:stable]">
                <PillarProductSidebar sidebar={content.productSidebar} />
              </div>
            </div>
          ) : null}

        <section className="px-4 pb-14 sm:px-6 lg:pb-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-5 text-2xl font-semibold text-primary sm:text-3xl">
              {content.introTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.intro} />
            {content.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 56)}
                className="font-body mb-5 max-w-3xl text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-5 text-2xl font-semibold text-primary sm:text-3xl">
              {content.whyTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.why} />
            {content.whyParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 56)}
                className="font-body mb-4 max-w-3xl text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {content.cityMoneyBlock ? (
          <section
            id="villes-location"
            className="scroll-mt-28 bg-surface-container-low"
          >
            {content.cityMoneyBlock.image ? (
              <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                  src={content.cityMoneyBlock.image.src}
                  alt={content.cityMoneyBlock.image.alt}
                  title={
                    content.cityMoneyBlock.image.title ??
                    content.cityMoneyBlock.image.alt
                  }
                  fill
                  sizes="100vw"
                  className="object-cover object-left sm:object-[center_40%]"
                  quality={90}
                  unoptimized
                />
              </div>
            ) : (
              <p className="font-body mx-auto max-w-5xl px-4 pt-10 text-base text-on-surface-variant sm:px-6 sm:text-lg lg:px-8 lg:pt-12">
                {content.cityMoneyBlock.text}
              </p>
            )}
            <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
              <h2 className="font-heading mx-auto mb-5 max-w-5xl text-2xl font-semibold text-primary sm:mb-6 sm:text-3xl">
                {content.cityMoneyBlock.title}
              </h2>
              {content.cityMoneyBlock.services ? (
                <ul className="mx-auto flex max-w-5xl flex-col gap-4">
                  {content.cityMoneyBlock.services.map((service) => (
                    <li
                      key={service.label}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <p className="font-heading flex shrink-0 items-center gap-2 text-sm font-semibold text-on-surface sm:w-44 sm:text-base">
                        <MaterialIcon
                          name={service.icon}
                          className="text-xl text-primary"
                        />
                        {service.label}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {service.cities.map((city) => (
                          <li key={city.href}>
                            <Link
                              href={city.href}
                              className="font-heading inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90 sm:text-sm"
                            >
                              {city.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mx-auto flex max-w-5xl flex-nowrap gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center">
                  {(content.cityMoneyBlock.cities ?? []).map((city) => (
                    <li key={city.href} className="shrink-0">
                      <Link
                        href={city.href}
                        className="font-heading inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 sm:px-3.5 sm:text-sm"
                      >
                        {city.icon ? (
                          <MaterialIcon name={city.icon} className="text-sm" />
                        ) : null}
                        <span>{city.label}</span>
                        <MaterialIcon
                          name="arrow_forward"
                          className="text-sm"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ) : null}

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.situationsTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.situations} />
            <p className="font-body mb-10 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.situationsIntro}
            </p>
            <div className="space-y-10">
              {content.situations.map((situation) => (
                <div key={situation.title} className="max-w-3xl">
                  <h3 className="font-heading mb-3 text-xl font-semibold text-on-surface">
                    {situation.title}
                  </h3>
                  {situation.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="font-body mb-3 text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {situation.link ? <InlineLink link={situation.link} /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {!content.cityMoneyBlock ? (
          <section className="bg-secondary px-4 py-12 sm:px-6 lg:py-14">
            <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="font-heading mb-2 text-2xl font-semibold text-white">
                  {content.midCtaTitle}
                </h2>
                <p className="font-body text-base text-white/85">
                  {content.midCtaText}
                </p>
              </div>
              <WhatsAppCta
                href={whatsapp}
                label={content.primaryCtaLabel}
                className="shrink-0"
              />
            </div>
          </section>
        ) : null}

        <section id="equipements" className="scroll-mt-28 py-14 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.equipmentTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.equipment} />
            <p className="font-body mb-12 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.equipmentIntro}
            </p>
          </div>
          <div className="space-y-12">
            {content.equipment.map((item, index) => (
              <article
                key={item.id}
                id={item.id}
                className={`mx-auto max-w-5xl scroll-mt-28 px-4 sm:px-6 ${
                  index === content.equipment.length - 1
                    ? "pb-0"
                    : "border-b border-outline-variant/30 pb-12"
                }`}
              >
                  <div className="mb-3 flex items-start gap-3">
                    <MaterialIcon
                      name={item.icon}
                      className="mt-1 text-2xl text-primary"
                    />
                    <h3 className="font-heading text-xl font-semibold text-on-surface sm:text-2xl">
                      {item.title}
                    </h3>
                  </div>
                  <div className="max-w-3xl">
                    {item.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="font-body mb-3 text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {item.cityProductLinks ? (
                      <div className="mt-4">
                        <p className="font-heading mb-2.5 text-sm font-semibold text-on-surface sm:text-base">
                          {item.cityProductLinks.prompt}
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {item.cityProductLinks.cities.map((city) => (
                            <li key={city.href}>
                              <Link
                                href={city.href}
                                className="font-heading inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90 sm:text-sm"
                              >
                                {city.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <InlineLink link={item.link} />
                    )}
                  </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.chooseTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.choose} />
            <p className="font-body mb-10 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.chooseIntro}
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              {content.chooseBlocks.map((block) => (
                <div key={block.title}>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-on-surface">
                    {block.title}
                  </h3>
                  {block.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="font-body mb-3 text-base leading-relaxed text-on-surface-variant last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {block.link ? <InlineLink link={block.link} /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.processTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.process} />
            <p className="font-body mb-10 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.processIntro}
            </p>
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {content.processSteps.map((step, index) => (
                <li key={step.title}>
                  <p className="font-heading mb-2 text-sm font-semibold tracking-widest text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-on-surface">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {content.cityMoneyBlock ? (
          <section className="bg-secondary px-4 py-12 sm:px-6 lg:py-14">
            <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="font-heading mb-2 text-2xl font-semibold text-white">
                  {content.midCtaTitle}
                </h2>
                <p className="font-body text-base text-white/85">
                  {content.midCtaText}
                </p>
              </div>
              <WhatsAppCta
                href={whatsapp}
                label={content.primaryCtaLabel}
                className="shrink-0"
              />
            </div>
          </section>
        ) : null}

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.durationTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.duration} />
            <p className="font-body mb-10 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.durationIntro}
            </p>
            <div className="grid gap-8 lg:grid-cols-3">
              {content.durationBlocks.map((block) => (
                <div key={block.title}>
                  <h3 className="font-heading mb-3 text-xl font-semibold text-on-surface">
                    {block.title}
                  </h3>
                  {block.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="font-body mb-3 text-base leading-relaxed text-on-surface-variant"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {block.bullets && block.bullets.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {block.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="font-body flex gap-2 text-sm text-on-surface-variant"
                        >
                          <MaterialIcon
                            name="check_circle"
                            className="mt-0.5 shrink-0 text-status-success text-base"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {block.link ? <InlineLink link={block.link} /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.citiesTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.cities} />
            <p className="font-body mb-10 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.citiesIntro}
            </p>
            <div className="space-y-10">
              {content.cities.map((city) => (
                <div key={city.name} className="max-w-3xl">
                  <h3 className="font-heading mb-3 text-xl font-semibold text-on-surface">
                    {city.title}
                  </h3>
                  {city.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="font-body mb-3 text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-3 flex flex-wrap gap-4">
                    <Link
                      href={city.hubHref}
                      className="font-heading inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      {city.hubLabel}
                      <MaterialIcon name="arrow_forward" className="text-base" />
                    </Link>
                    <Link
                      href={city.locationHref}
                      className="font-heading inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      {city.locationLabel}
                      <MaterialIcon name="arrow_forward" className="text-base" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 max-w-3xl border-t border-outline-variant/30 pt-10">
              <h3 className="font-heading mb-3 text-xl font-semibold text-on-surface">
                {content.otherCitiesTitle}
              </h3>
              {content.otherCitiesParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="font-body mb-3 text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
              <InlineLink link={content.otherCitiesLink} />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.compareTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.compare} />
            <p className="font-body mb-10 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.compareIntro}
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {content.compareBlocks.map((block) => (
                <div key={block.title}>
                  <h3 className="font-heading mb-2 text-xl font-semibold text-on-surface">
                    {block.title}
                  </h3>
                  {block.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="font-body mb-3 text-base leading-relaxed text-on-surface-variant"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {block.link ? <InlineLink link={block.link} /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              {content.whyUsTitle}
            </h2>
            <PillarSectionImage image={content.sectionImages?.whyUs} />
            <p className="font-body mb-10 max-w-3xl text-base text-on-surface-variant sm:text-lg">
              {content.whyUsIntro}
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              {content.whyUsBlocks.map((block) => (
                <div key={block.title}>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-on-surface">
                    {block.title}
                  </h3>
                  <p className="font-body text-base leading-relaxed text-on-surface-variant">
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-6 text-2xl font-semibold text-primary sm:text-3xl">
              {content.relatedTitle}
            </h2>
            <ul className="flex flex-wrap gap-3">
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

        {content.blogLinks.length > 0 ? (
          <section className="px-4 py-14 sm:px-6 lg:py-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
                {content.blogTitle}
              </h2>
              <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
                {content.blogIntro}
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

        <section className="bg-surface-container-low px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-8 text-2xl font-semibold text-primary sm:text-3xl">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-outline-variant/40 bg-white px-5 py-4"
                >
                  <summary className="font-heading cursor-pointer list-none text-lg font-semibold text-on-surface marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {faq.question}
                      <MaterialIcon
                        name="expand_more"
                        className="mt-0.5 shrink-0 text-primary transition-transform group-open:rotate-180"
                      />
                    </span>
                  </summary>
                  <p className="font-body mt-3 text-base leading-relaxed text-on-surface-variant">
                    {faq.answer}
                  </p>
                </details>
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
              <WhatsAppCta href={whatsapp} label={content.primaryCtaLabel} />
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <MaterialIcon name="call" />
                Appeler SOS Santé Maroc
              </a>
            </div>
            <p className="font-body mt-4 text-sm text-on-surface-variant">
              {PHONE_DISPLAY}
            </p>
          </div>
        </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
