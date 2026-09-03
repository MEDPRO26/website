import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  ABOUT_DEFINITION,
  ABOUT_DESCRIPTION,
  ABOUT_FAQS,
  ABOUT_OPERATIONS,
  ABOUT_PATH,
  ABOUT_ROLE,
  ABOUT_TITLE,
} from "@/lib/about-content";
import { HERO_IMAGE, SITE_ADDRESS, SITE_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import { careServiceCityPath, careServices } from "@/lib/care-services";
import { activeCities } from "@/lib/cities";
import { CONTACT_EMAIL, PHONE_DISPLAY, whatsAppHref } from "@/lib/products";
import { hubCityPath, venteCityPath } from "@/lib/routes";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  localBusinessSchema,
  webPageSchema,
} from "@/lib/schema";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

const HERO_SRC = "/services/soins-domicile.webp";
const HERO_ALT =
  "Professionnel de santé accompagnant une personne à domicile avec SOS Santé";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: [
    "à propos SOS Santé",
    "SOS Santé Maroc",
    "qui est SOS Santé",
    "matériel médical Agadir",
    "soins à domicile Maroc",
    "location matériel médical Maroc",
  ],
  alternates: { canonical: ABOUT_PATH },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: ABOUT_PATH,
    type: "website",
    locale: "fr_MA",
    siteName: SITE_NAME,
    images: [
      {
        url: `${siteUrl}${HERO_SRC}`,
        alt: HERO_ALT,
      },
    ],
  },
};

const aboutSchema = buildGraph(
  {
    ...webPageSchema(ABOUT_PATH, ABOUT_TITLE, ABOUT_DESCRIPTION, "AboutPage"),
    mainEntity: { "@id": `${siteUrl}/#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteUrl}${HERO_SRC}`,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#about-definition", "#about-faq"],
    },
  },
  breadcrumbSchema([
    { name: "Accueil", item: "/" },
    { name: "À propos de nous", item: ABOUT_PATH },
  ]),
  faqSchema(
    ABOUT_FAQS.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    ABOUT_PATH
  ),
  localBusinessSchema({
    citySlug: "agadir",
    path: ABOUT_PATH,
    description: ABOUT_DEFINITION,
  })
);

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

const steps = [
  {
    n: "01",
    title: "Vous nous contactez",
    text: "WhatsApp, téléphone ou formulaire : décrivez le besoin, la ville et le délai.",
  },
  {
    n: "02",
    title: "Nous qualifions la demande",
    text: "Un conseiller confirme la disponibilité, le tarif et le type de prestation avant toute intervention.",
  },
  {
    n: "03",
    title: "Nous opérons depuis nos locaux",
    text: "Préparation et livraison du matériel depuis nos locaux, ou coordination avec un prestataire partenaire pour les soins.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <section className="relative min-h-[78vh] overflow-hidden">
          <Image
            src={HERO_SRC}
            alt={HERO_ALT}
            fill
            priority
            className="object-cover object-[30%_center] animate-fade-in"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-secondary/25" />
          <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16 lg:pb-20">
            <h1 className="font-heading mb-4 max-w-3xl animate-fade-in-up">
              <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                À propos de nous
              </span>
              <span className="block text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                {SITE_NAME}
              </span>
            </h1>
            <p className="font-body mb-8 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg animate-fade-in-up">
              Locaux à Agadir et Casablanca : livraison de matériel médical et
              coordination avec des prestataires partenaires.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
              >
                Nous contacter
                <MaterialIcon name="arrow_forward" />
              </Link>
              <a
                href={whatsAppHref(
                  "Bonjour SOS Santé, je souhaite des informations.",
                  "general"
                )}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "À propos de nous" },
              ]}
            />
          </div>
        </div>

        <section className="px-4 pb-16 sm:px-6 lg:pb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading mb-5 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
              Qui est {SITE_NAME} ?
            </h2>
            <p
              id="about-definition"
              className="font-body text-lg leading-relaxed text-on-surface sm:text-xl"
            >
              {ABOUT_DEFINITION}
            </p>
            <p className="font-body mt-5 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {ABOUT_ROLE}
            </p>
            <p className="font-body mt-5 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {ABOUT_OPERATIONS}
            </p>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              Comment nous travaillons
            </h2>
            <p className="font-body mb-12 max-w-2xl text-base text-on-surface-variant sm:text-lg">
              Une demande, un interlocuteur, une coordination claire, sans
              frais cachés.
            </p>
            <ol className="grid gap-10 md:grid-cols-3">
              {steps.map((step) => (
                <li key={step.n}>
                  <p className="font-heading mb-3 text-sm font-semibold tracking-widest text-primary">
                    {step.n}
                  </p>
                  <h3 className="font-heading mb-2 text-xl font-semibold text-on-surface">
                    {step.title}
                  </h3>
                  <p className="font-body text-on-surface-variant">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              Ce que nous organisons
            </h2>
            <p className="font-body mb-12 max-w-2xl text-base text-on-surface-variant sm:text-lg">
              Deux métiers, un même fil : rester à domicile dans de bonnes
              conditions.
            </p>
            <div className="grid gap-14 md:grid-cols-2">
              <div>
                <h3 className="font-heading mb-3 text-xl font-semibold text-on-surface">
                  Matériel médical
                </h3>
                <p className="font-body mb-5 leading-relaxed text-on-surface-variant">
                  Location et vente de lits médicalisés, fauteuils roulants,
                  concentrateurs d&apos;oxygène, CPAP et matériel de confort.
                  Le matériel est préparé dans nos locaux, puis livré et
                  installé à domicile, avec désinfection selon les protocoles
                  en vigueur.
                </p>
                <ul className="space-y-2">
                  {activeCities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={venteCityPath(city.slug)}
                        className="font-heading text-sm font-semibold text-primary transition-colors hover:text-primary-container"
                      >
                        Catalogue à {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading mb-3 text-xl font-semibold text-on-surface">
                  Soins à domicile
                </h3>
                <p className="font-body mb-5 leading-relaxed text-on-surface-variant">
                  Depuis nos locaux, nous coordonnons la mise en relation avec
                  des kinésithérapeutes, infirmiers, médecins, aide-soignants
                  et transporteurs sanitaires partenaires. Diplômes et
                  références vérifiés avant orientation.
                </p>
                <ul className="space-y-2">
                  {careServices.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={careServiceCityPath(
                          service.slug,
                          activeCities[0]?.slug ?? "agadir"
                        )}
                        className="font-heading text-sm font-semibold text-primary transition-colors hover:text-primary-container"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/services"
                      className="font-heading text-sm font-semibold text-primary transition-colors hover:text-primary-container"
                    >
                      Tous les services
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
              Nos locaux et zones d&apos;intervention
            </h2>
            <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
              Des locaux opérationnels à Agadir et Casablanca, et une
              intervention à Rabat avec le même standard de suivi.
            </p>
            <ul className="grid gap-8 sm:grid-cols-3">
              {activeCities.map((city) => (
                <li key={city.slug}>
                  <Link href={hubCityPath(city.slug)} className="group block">
                    <p className="font-heading text-xl font-semibold text-on-surface group-hover:text-primary">
                      {city.name}
                    </p>
                    <p className="font-body mt-1 text-sm text-on-surface-variant">
                      {city.address
                        ? `Local : ${city.address}`
                        : city.deliveryText}
                    </p>
                    {city.phoneDisplay ? (
                      <p className="mt-2 text-sm font-semibold text-primary">
                        {city.phoneDisplay}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div className="relative min-h-[22rem] overflow-hidden lg:min-h-[28rem]">
              <Image
                src={HERO_IMAGE}
                alt="SOS Santé, matériel médical et maintien à domicile au Maroc"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div>
              <h2 className="font-heading mb-5 text-2xl font-semibold text-primary sm:text-3xl">
                Transparence et responsabilité
              </h2>
              <p className="font-body mb-4 leading-relaxed text-on-surface-variant">
                Les tarifs sont annoncés avant validation. Le matériel de
                location est contrôlé et désinfecté dans nos locaux. Les
                professionnels partenaires sont sélectionnés sur diplôme,
                inscription professionnelle et références.
              </p>
              <p className="font-body mb-6 leading-relaxed text-on-surface-variant">
                En cas d&apos;urgence vitale, contactez les services d&apos;urgence
                officiels. {SITE_NAME} coordonne des interventions planifiées
                ou semi-urgentes, pas le SAMU.
              </p>
              <p className="font-body text-sm text-on-surface-variant">
                Éditeur : {SITE_NAME} · Locaux : {SITE_ADDRESS} (Agadir) ·{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                · {PHONE_DISPLAY}
              </p>
              <p className="mt-3">
                <Link
                  href="/mentions-legales"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Mentions légales
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section
          id="about-faq"
          className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:pb-24"
        >
          <h2 className="font-heading mb-8 text-2xl font-semibold text-primary sm:text-3xl">
            Questions fréquentes
          </h2>
          <div className="divide-y divide-outline-variant/40 border-y border-outline-variant/40">
            {ABOUT_FAQS.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-base font-semibold text-on-surface marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <MaterialIcon
                    name="expand_more"
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="font-body mt-3 pr-8 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:pb-24">
          <div className="mx-auto max-w-4xl bg-primary px-6 py-12 text-center text-on-primary sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl">
              Besoin d&apos;un devis ou d&apos;un soin ?
            </h2>
            <p className="font-body mx-auto mb-8 max-w-lg text-white/90">
              Un conseiller {SITE_NAME} vous répond, en général sous 15 minutes.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary transition-transform hover:-translate-y-0.5"
              >
                Demander un devis
              </Link>
              <a
                href={whatsAppHref(
                  "Bonjour SOS Santé, je souhaite un devis.",
                  "general"
                )}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
