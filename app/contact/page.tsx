import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/products";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medidomicile.ma"
).replace(/\/$/, "");

const contactPhone = "+212-522-XX-XX-XX";

export const metadata: Metadata = {
  title: "Contact MediDomicile | Devis matériel médical & soins à domicile Agadir",
  description:
    "Contactez MediDomicile pour un devis gratuit de location de matériel médical ou de services d'aide à domicile à Agadir. Réponse sous 15 minutes.",
  keywords: [
    "contact MediDomicile",
    "devis matériel médical Agadir",
    "location matériel médical contact",
    "soins à domicile Agadir contact",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact MediDomicile | Devis matériel médical & soins à domicile Agadir",
    description:
      "Contactez MediDomicile par WhatsApp, email ou téléphone. Devis gratuit sous 15 minutes.",
    url: "/contact",
    type: "website",
    locale: "fr_MA",
    siteName: "MediDomicile",
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

const contactChannels = [
  {
    icon: "chat",
    title: "WhatsApp",
    value: "Disponible 7j/7",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MediDomicile%2C%20je%20souhaite%20un%20devis%20ou%20plus%20d'informations.`,
    cta: "Discuter sur WhatsApp",
    color: "bg-[#25D366]/10 text-[#25D366]",
  },
  {
    icon: "mail",
    title: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}?subject=Demande%20de%20contact%20MediDomicile`,
    cta: "Nous envoyer un email",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: "phone_in_talk",
    title: "Téléphone",
    value: contactPhone,
    href: `tel:${contactPhone.replace(/\s/g, "")}`,
    cta: "Appeler maintenant",
    color: "bg-secondary/10 text-secondary",
  },
];

const subjects = [
  "Demande générale",
  "Location matériel médical",
  "Service à domicile",
  "Demande de devis",
  "Partenariat",
];

function ContactJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${siteUrl}/contact#webpage`,
        url: `${siteUrl}/contact`,
        name: "Contact MediDomicile | Devis matériel médical & soins à domicile Agadir",
        description:
          "Contactez MediDomicile pour un devis gratuit de location de matériel médical ou de services d'aide à domicile à Agadir.",
        inLanguage: "fr-MA",
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/contact#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: `${siteUrl}/contact`,
          },
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/contact#localbusiness`,
        name: "MediDomicile",
        description:
          "Location de matériel médical et services d'aide à domicile à Agadir et au Maroc.",
        url: siteUrl,
        telephone: contactPhone,
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
        contactPoint: {
          "@type": "ContactPoint",
          telephone: contactPhone,
          contactType: "Service client",
          availableLanguage: ["French", "Arabic"],
          areaServed: "MA",
          hoursAvailable: "Mo-Su 00:00-23:59",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function ContactPage() {
  return (
    <>
      <ContactJsonLd />
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
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
              Contactez MediDomicile
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
                    <MaterialIcon name={channel.icon} className="text-[28px]" />
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

              <form
                action={`mailto:${CONTACT_EMAIL}`}
                method="post"
                encType="text/plain"
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-on-surface"
                    >
                      Nom complet <span className="text-status-error">*</span>
                    </label>
                    <input
                      id="name"
                      name="Nom"
                      type="text"
                      required
                      placeholder="Prénom et nom"
                      className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-on-surface"
                    >
                      Téléphone <span className="text-status-error">*</span>
                    </label>
                    <input
                      id="phone"
                      name="Telephone"
                      type="tel"
                      required
                      placeholder="06 XX XX XX XX"
                      className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-on-surface"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="Email"
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-medium text-on-surface"
                  >
                    Sujet <span className="text-status-error">*</span>
                  </label>
                  <select
                    id="subject"
                    name="Sujet"
                    required
                    className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-on-surface"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="Message"
                    rows={4}
                    placeholder="Décrivez votre besoin..."
                    className="w-full resize-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container sm:w-auto"
                >
                  <MaterialIcon name="send" />
                  Envoyer ma demande
                </button>
              </form>
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
                  Notre siège est à Agadir. Nous livrons du matériel médical et
                  assurons des soins à domicile dans toute la ville et partout
                  au Maroc.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Agadir", "Casablanca", "Marrakech", "Rabat", "Tanger", "Fès"].map(
                    (city) => (
                      <Link
                        key={city}
                        href={
                          city === "Agadir"
                            ? "/location-materiel-medical-agadir"
                            : `/location-materiel-medical-${city.toLowerCase()}`
                        }
                        className="rounded-full bg-surface-container-low px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
                      >
                        {city}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
