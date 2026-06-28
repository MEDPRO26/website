"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Breadcrumb from "@/components/breadcrumb";
import { CareServiceRequestForm } from "@/components/care-service-request-form";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import {
  getValuePropAccentClass,
} from "@/lib/care-service-seo";
import type { CareServicePageContent } from "@/lib/care-services";
import { hubCityPath } from "@/lib/routes";
import { PHONE_DISPLAY, WHATSAPP_NUMBER } from "@/lib/products";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  localBusinessSchema,
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
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

function ContentSection({
  title,
  paragraphs,
  bullets,
  imageSrc,
  imageAlt,
  imagePosition = "right",
}: {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
}) {
  const imageBlock = (
    <div className="relative min-h-[280px] overflow-hidden rounded-3xl sm:min-h-[360px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-secondary/10" />
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
            key={paragraph.slice(0, 40)}
            className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base"
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

export function CareServiceCityPage({
  content,
}: {
  content: CareServicePageContent;
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { seo } = content;
  const { expertise, trust, community } = seo;

  const schema = buildGraph(
    webPageSchema(content.path, content.metaTitle, content.metaDescription),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: "Services", item: "/services" },
      { name: content.h1, item: content.path },
    ]),
    faqSchema(content.faqs, content.path),
    localBusinessSchema({
      name: content.brandName,
      description: content.metaDescription,
      addressLocality: content.cityName,
    }),
    serviceSchema(content.h1, content.description, content.path)
  );

  const whatsappText = encodeURIComponent(
    `Bonjour SOS Santé, je souhaite ${content.formLabel.toLowerCase()} à ${content.cityName}.`
  );

  const whyCardThemes = [
    "bg-secondary text-on-secondary",
    "bg-primary text-on-primary",
    "bg-primary-container text-on-primary-container",
  ];

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
                { label: "Services", href: "/services" },
                { label: content.h1 },
              ]}
            />
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src={content.images.hero}
              alt={content.images.altWithCity}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-secondary/80" />
          </div>
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary-fixed">
              <span className="h-2 w-2 rounded-full bg-primary" />
              SOINS À DOMICILE
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {content.h1.replace(` à ${content.cityName}`, "")}
              <span className="text-primary"> à {content.cityName}</span>
            </h1>
            <p className="font-body mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              {content.intro}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-container"
              >
                <MaterialIcon name="chat" />
                WhatsApp · {PHONE_DISPLAY}
              </a>
              <a
                href="#request-form"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("request-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                <MaterialIcon name="edit_note" />
                Réserver en ligne
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {content.otherCities.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/20"
                >
                  Voir à {city.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center md:mb-14">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                SOS Santé {content.cityName}
              </span>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Pourquoi{" "}
                <span className="text-primary">nous choisir ?</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {seo.whyChoose.map((card, index) => (
                <div
                  key={card.title}
                  className={`rounded-3xl p-6 sm:p-8 ${whyCardThemes[index % whyCardThemes.length]}`}
                >
                  <p className="mb-3 text-sm font-bold opacity-80">
                    {card.number}.
                  </p>
                  <h3 className="font-heading mb-3 text-lg font-semibold sm:text-xl">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90 sm:text-base">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value props bento */}
        <section className="px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center md:mb-14">
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                SOINS À DOMICILE
              </div>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Parce que votre{" "}
                <span className="text-primary">confiance</span> compte
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative min-h-[220px] overflow-hidden rounded-3xl sm:row-span-2 sm:min-h-[460px]">
                <Image
                  src={content.images.hero}
                  alt={content.images.altWithCity}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              </div>
              {seo.valueProps.map((prop) => (
                <div
                  key={prop.title}
                  className={`rounded-3xl p-5 sm:p-6 ${getValuePropAccentClass(prop.accent)}`}
                >
                  <h3 className="font-heading mb-2 text-base font-semibold text-secondary sm:text-lg">
                    • {prop.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {prop.text}
                  </p>
                </div>
              ))}
              <div className="relative min-h-[200px] overflow-hidden rounded-3xl sm:col-span-2 lg:col-span-1">
                <Image
                  src={content.images.section}
                  alt={content.images.altWithCity}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
                <div className="absolute inset-0 bg-primary/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              SOINS À DOMICILE
            </span>
            <ContentSection
              title={expertise.title}
              paragraphs={expertise.paragraphs}
              bullets={expertise.bullets}
              imageSrc={content.images.section}
              imageAlt={content.images.altWithCity}
              imagePosition="left"
            />
          </div>
        </section>

        {/* Request form */}
        <CareServiceRequestForm
          defaultCareType={content.formLabel}
          defaultCity={content.cityName}
          heading={`Réserver votre rendez-vous à ${content.cityName}`}
          subheading={`Remplissez ce formulaire pour ${content.formLabel.toLowerCase()} à domicile à ${content.cityName}. Notre équipe vous rappelle rapidement pour confirmer la mise en relation avec un professionnel partenaire.`}
        />

        {/* SEO intro */}
        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl">
              {seo.seoIntroHeading}
            </h2>
            <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
              {seo.seoIntro}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl space-y-12">
            <h2 className="font-heading text-center text-2xl font-semibold text-secondary sm:text-3xl">
              Les avantages de nos services à {content.cityName}
            </h2>
            {seo.benefits.map((benefit) => (
                <div key={benefit.title}>
                  <h3 className="font-heading mb-3 text-xl font-semibold text-primary sm:text-2xl">
                    {benefit.title}
                  </h3>
                  {benefit.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="font-body mb-3 text-sm leading-relaxed text-on-surface-variant sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
          </div>
        </section>

        {/* Specialties */}
        <section className="px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading mb-10 text-center text-2xl font-semibold text-secondary sm:text-3xl">
              Services spécifiques adaptés à tous
            </h2>
            <div className="space-y-14">
              {seo.specialties.map((specialty, index) => (
                  <ContentSection
                    key={specialty.title}
                    title={specialty.title}
                    paragraphs={specialty.paragraphs}
                    imageSrc={
                      index % 2 === 0
                        ? content.images.section
                        : content.images.hero
                    }
                    imageAlt={content.images.altWithCity}
                    imagePosition={index % 2 === 0 ? "right" : "left"}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <ContentSection
              title={trust.title}
              paragraphs={trust.paragraphs}
              imageSrc={content.images.hero}
              imageAlt={content.images.altWithCity}
              imagePosition="left"
            />
          </div>
        </section>

        {/* Zones + features */}
        <section className="px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-outline-variant/30 bg-white p-6 sm:p-8">
              <h2 className="font-heading mb-4 text-xl font-semibold text-secondary sm:text-2xl">
                Ce que nous coordonnons
              </h2>
              <ul className="space-y-3">
                {content.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-on-surface-variant"
                  >
                    <MaterialIcon name="check_circle" className="text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-outline-variant/30 bg-white p-6 sm:p-8">
              <h2 className="font-heading mb-4 text-xl font-semibold text-secondary sm:text-2xl">
                Zones desservies à {content.cityName}
              </h2>
              <div className="flex flex-wrap gap-2">
                {content.zones.map((zone) => (
                  <span
                    key={zone}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    {zone}
                  </span>
                ))}
              </div>
              <p className="font-body mt-6 text-sm leading-relaxed text-on-surface-variant">
                {content.deliveryText}
              </p>
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="px-4 pb-14 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-secondary px-6 py-10 text-white sm:px-10 sm:py-12">
              <MaterialIcon name="format_quote" className="mb-4 text-3xl text-primary" />
              <h2 className="font-heading mb-4 text-2xl font-semibold sm:text-3xl">
                {community.title}
              </h2>
              {community.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mb-3 text-sm leading-relaxed text-white/90 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-surface-container-low px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 rounded-3xl bg-white p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                SOINS À DOMICILE
              </div>
              <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Questions fréquentes
              </h2>
            </div>
            <div className="space-y-3">
              {content.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-primary/20 bg-white shadow-md"
                        : "border-outline-variant/30 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left sm:p-5"
                    >
                      <span className="font-heading text-sm font-semibold text-on-surface sm:text-base">
                        <span className="mr-2 text-primary">
                          {String(index + 1).padStart(2, "0")}.
                        </span>
                        {faq.question}
                      </span>
                      <span
                        className={`shrink-0 rounded-full bg-primary/10 p-1 text-primary transition-transform duration-300 ${
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
                        <p className="border-t border-outline-variant/30 px-4 pb-4 pt-3 font-body text-sm leading-relaxed text-on-surface-variant sm:px-5 sm:pb-5 sm:pt-4 sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Other services */}
        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading mb-6 text-xl font-semibold text-secondary sm:text-2xl">
              Autres services à {content.cityName}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {content.otherServices.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-primary"
                >
                  {service.title}
                </Link>
              ))}
              <Link
                href={hubCityPath(content.citySlug)}
                className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                Hub {content.cityName}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
