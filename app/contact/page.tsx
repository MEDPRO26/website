import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import SiteFooter from "@/components/site-footer";
import { HERO_IMAGE, SITE_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import ContactForm from "@/components/contact-form";
import JsonLd from "@/components/json-ld";
import {
  activeCities,
  activeDeliveryCityLabel,
  deliveryCities,
} from "@/lib/delivery-cities";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_NUMBER, whatsAppHref } from "@/lib/products";
import { hubCityPath } from "@/lib/routes";
import {
  breadcrumbSchema,
  buildGraph,
  localBusinessSchema,
  webPageSchema,
} from "@/lib/schema";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: `Contact ${SITE_NAME} | Devis matériel médical & soins à domicile Agadir`,
  description:
    `Contactez ${SITE_NAME} pour un devis gratuit de location de matériel médical ou de services d'aide à domicile à Agadir. Réponse sous 15 minutes.`,
  keywords: [
    `contact ${SITE_NAME}`,
    "devis matériel médical Agadir",
    "location matériel médical contact",
    "soins à domicile Agadir contact",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact ${SITE_NAME} | Devis matériel médical & soins à domicile Agadir`,
    description:
      `Contactez ${SITE_NAME} par WhatsApp, email ou téléphone. Devis gratuit sous 15 minutes.`,
    url: "/contact",
    type: "website",
    locale: "fr_MA",
    siteName: SITE_NAME,
    images: [{ url: `${siteUrl}${HERO_IMAGE}` }],
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

const contactChannels = [
  {
    icon: "chat",
    title: "WhatsApp",
    value: "Disponible 7j/7",
    href: whatsAppHref("Bonjour SOS Santé, je souhaite un devis ou plus d'informations.", "general"),
    cta: "Discuter sur WhatsApp",
    color: "bg-[#25D366]/10 text-[#25D366]",
  },
  {
    icon: "mail",
    title: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}?subject=Demande%20de%20contact%20SOS%20Sant%C3%A9`,
    cta: "Nous envoyer un email",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: "phone_in_talk",
    title: "Téléphone",
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_NUMBER}`,
    cta: "Appeler maintenant",
    color: "bg-secondary/10 text-secondary",
  },
];

const contactTitle = `Contact ${SITE_NAME} | Devis matériel médical & soins à domicile Agadir`;
const contactDescription = `Contactez ${SITE_NAME} pour un devis gratuit de location de matériel médical ou de services d'aide à domicile à Agadir. Réponse sous 15 minutes.`;

const contactSchema = buildGraph(
  webPageSchema("/contact", contactTitle, contactDescription, "ContactPage"),
  breadcrumbSchema([
    { name: "Accueil", item: "/" },
    { name: "Contact", item: "/contact" },
  ]),
  localBusinessSchema({
    citySlug: "agadir",
    path: "/contact",
    description:
      "Location et vente de matériel médical et services d'aide à domicile à Agadir et au Maroc.",
  })
);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Contact" },
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
              <MaterialIcon name="support_agent" className="text-base" />
              À votre écoute 7j/7
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Contactez {SITE_NAME}
            </h1>
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
              Une question, un devis ou une urgence ? Notre équipe vous répond
              sous 15 minutes par WhatsApp, email ou téléphone.
            </p>
          </div>
        </section>

        {/* Contact channels */}
        <section className="px-4 pb-10 sm:px-6 sm:pb-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {contactChannels.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="group flex flex-col rounded-3xl border border-outline-variant/30 bg-surface-base p-6 shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg sm:p-8"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${channel.color}`}
                  >
                    {channel.title === "WhatsApp" ? (
                      <WhatsAppIcon className="h-7 w-7" />
                    ) : (
                      <MaterialIcon name={channel.icon} className="text-[28px]" />
                    )}
                  </div>
                  <h2 className="font-heading mb-1 text-xl font-semibold text-primary">
                    {channel.title}
                  </h2>
                  <p className="font-body mb-5 flex-1 text-on-surface-variant">
                    {channel.value}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                    {channel.cta}
                    <MaterialIcon name="arrow_forward" className="text-base" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Form + info */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Formulaire de contact
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                Demandez votre devis gratuit
              </h2>
              <p className="font-body mb-8 text-base leading-relaxed text-on-surface-variant sm:text-lg">
                Remplissez le formulaire ci-dessous. Nous vous recontacterons
                rapidement pour préciser votre besoin et vous proposer une
                solution adaptée.
              </p>

              <ContactForm />
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl border border-outline-variant/30 bg-white p-6 sm:p-8">
                <h3 className="font-heading mb-4 text-xl font-semibold text-primary">
                  Horaires d’ouverture
                </h3>
                <ul className="space-y-3 font-body text-on-surface-variant">
                  <li className="flex items-center justify-between">
                    <span>Lundi – Dimanche</span>
                    <span className="font-semibold text-on-surface">
                      24h/24, 7j/7
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Service client WhatsApp</span>
                    <span className="font-semibold text-on-surface">
                      Toujours ouvert
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Livraison à Agadir</span>
                    <span className="font-semibold text-on-surface">
                      24h/24
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-outline-variant/30 bg-white p-6 sm:p-8">
                <h3 className="font-heading mb-4 text-xl font-semibold text-primary">
                  Zone d’intervention
                </h3>
                <p className="font-body mb-4 text-on-surface-variant">
                  Nous livrons du matériel médical et assurons des soins à
                  domicile à {activeDeliveryCityLabel}. Les autres villes
                  ci-dessous seront disponibles prochainement.
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeCities.map((city) => (
                    <Link
                      key={city.slug}
                      href={hubCityPath(city.slug)}
                      className="rounded-full bg-surface-container-low px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
                    >
                      {city.name}
                    </Link>
                  ))}
                  {deliveryCities
                    .filter((city) => !city.active)
                    .map((city) => (
                      <span
                        key={city.slug}
                        className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 text-sm text-on-surface-variant"
                      >
                        <MaterialIcon name="schedule" className="text-base" />
                        {city.name} · Bientôt disponible
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
