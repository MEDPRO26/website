import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/products";
import {
  breadcrumbSchema,
  buildGraph,
  localBusinessSchema,
  organizationSchema,
  webPageSchema,
} from "@/lib/schema";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medidomicile.ma"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "À propos de MediDomicile | Matériel médical & soins à domicile Agadir",
  description:
    "Découvrez MediDomicile, votre partenaire de location de matériel médical et d’aide à domicile à Agadir et au Maroc. Qualité, réactivité et accompagnement humain.",
  keywords: [
    "à propos MediDomicile",
    "location matériel médical Agadir",
    "aide à domicile Agadir",
    "matériel médical Maroc",
  ],
  alternates: {
    canonical: "/a-propos",
  },
  openGraph: {
    title: "À propos de MediDomicile | Matériel médical & soins à domicile Agadir",
    description:
      "Votre partenaire de confiance pour la location de matériel médical et l’aide à domicile à Agadir et au Maroc.",
    url: "/a-propos",
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

const stats = [
  { value: "+1000", label: "familles accompagnées" },
  { value: "7/7", label: "disponibilité" },
  { value: "15 min", label: "devis rapide" },
  { value: "6+", label: "villes desservies" },
];

const values = [
  {
    icon: "verified",
    title: "Qualité certifiée",
    text: "Matériel médical contrôlé, entretenu et désinfecté selon les protocoles en vigueur avant chaque location.",
  },
  {
    icon: "schedule",
    title: "Disponibilité 24h/24",
    text: "Nous répondons 7 jours sur 7 aux urgences et aux besoins planifiés à Agadir et au Maroc.",
  },
  {
    icon: "diversity_3",
    title: "Accompagnement humain",
    text: "Des conseillers à l’écoute pour vous guider dans le choix du matériel ou du service adapté.",
  },
  {
    icon: "payments",
    title: "Tarifs transparents",
    text: "Devis clairs, sans frais cachés, avec des formules flexibles à la journée, à la semaine ou au mois.",
  },
];

const milestones = [
  {
    year: "2020",
    title: "Création à Agadir",
    text: "Lancement de MediDomicile pour répondre au manque de location de matériel médical à domicile.",
  },
  {
    year: "2022",
    title: "Extension des services",
    text: "Ajout des soins infirmiers, aide-soignants et kinésithérapeutes à domicile.",
  },
  {
    year: "2024",
    title: "Livraison nationale",
    text: "Livraison de matériel médical dans les principales villes du Maroc.",
  },
  {
    year: "2026",
    title: "Référencement local",
    text: "Optimisation de notre présence pour accompagner encore plus de familles au quotidien.",
  },
];

const cities = [
  { name: "Agadir", slug: "location-materiel-medical-agadir" },
  { name: "Casablanca", slug: "location-materiel-medical-casablanca" },
  { name: "Marrakech", slug: "location-materiel-medical-marrakech" },
  { name: "Rabat", slug: "location-materiel-medical-rabat" },
  { name: "Tanger", slug: "location-materiel-medical-tanger" },
  { name: "Fès", slug: "location-materiel-medical-fes" },
];

const aboutSchema = buildGraph(
  webPageSchema(
    "/a-propos",
    "À propos de MediDomicile | Matériel médical & soins à domicile Agadir",
    "Découvrez MediDomicile, votre partenaire de location de matériel médical et d’aide à domicile à Agadir et au Maroc.",
    "AboutPage"
  ),
  organizationSchema(),
  localBusinessSchema(),
  breadcrumbSchema([
    { name: "Accueil", item: "/" },
    { name: "À propos", item: "/a-propos" },
  ])
);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "À propos" },
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
                <MaterialIcon name="info" className="text-base" />
                Qui sommes-nous ?
              </div>
              <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                Votre partenaire santé à domicile à Agadir et au Maroc
              </h1>
              <p className="font-body mb-6 text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
                MediDomicile accompagne les familles, les aidants et les
                professionnels de santé avec du matériel médical fiable et des
                services d’aide à domicile. Notre mission : permettre à chacun
                de recevoir les soins et le confort nécessaires dans la dignité
                de son foyer.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MediDomicile%2C%20je%20souhaite%20plus%20d'informations.`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container"
                >
                  <MaterialIcon name="chat" />
                  Nous contacter
                </a>
                <Link
                  href="/tarifs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white/60 px-6 py-3.5 text-base font-semibold text-primary backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-primary/5"
                >
                  Voir les tarifs
                  <MaterialIcon name="arrow_forward" className="text-lg" />
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl lg:aspect-square">
              <Image
                src="/medidomicile-hero.jpg"
                alt="Équipe MediDomicile livrant du matériel médical à domicile à Agadir"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md">
                <p className="font-heading text-lg font-bold text-primary">
                  Depuis 2020
                </p>
                <p className="text-sm text-on-surface-variant">
                  au service des familles
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-outline-variant/40 bg-surface-container-low/60 px-4 py-8 backdrop-blur-sm sm:px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/70 p-4 text-center shadow-sm backdrop-blur-sm sm:p-6"
              >
                <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center md:mb-14">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Nos valeurs
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                Ce qui guide notre engagement
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-3xl border border-outline-variant/30 bg-surface-base p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:p-8"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MaterialIcon name={value.icon} className="text-[28px]" />
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-primary">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                  Notre histoire
                </span>
                <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                  Une réponse concrète aux besoins du maintien à domicile
                </h2>
                <div className="font-body space-y-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
                  <p>
                    MediDomicile est né du constat simple : acheter du matériel
                    médical pour une courte durée est coûteux et contraignant.
                    À Agadir, de nombreuses familles faisaient face à des
                    démarches complexes pour louer un lit médicalisé, un
                    fauteuil roulant ou un concentrateur d’oxygène.
                  </p>
                  <p>
                    Nous avons donc conçu un service clé en main : location
                    courte ou longue durée, livraison à domicile, installation,
                    désinfection et conseil personnalisé. Puis nous avons
                    élargi notre offre aux soins infirmiers et à l’aide à
                    domicile pour offrir une prise en charge globale.
                  </p>
                  <p>
                    Aujourd’hui, MediDomicile intervient à Agadir et livre dans
                    les principales villes du Maroc, avec la même exigence de
                    qualité et de réactivité.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -left-4 -top-4 -z-0 h-full w-full rounded-3xl bg-primary/10" />
                  <div className="relative z-10 overflow-hidden rounded-3xl shadow-xl">
                    <Image
                      src="/services/soins-domicile.jpg"
                      alt="Professionnel de santé MediDomicile auprès d’un patient à domicile"
                      width={800}
                      height={600}
                      className="aspect-[4/3] w-full object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center md:mb-14">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Notre parcours
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                Les grandes étapes
              </h2>
            </div>
            <div className="relative space-y-8 border-l-2 border-primary/20 pl-8">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="relative">
                  <span className="absolute -left-[39px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-white" />
                  <span className="font-heading text-sm font-semibold text-primary">
                    {milestone.year}
                  </span>
                  <h3 className="font-heading mt-1 text-lg font-semibold text-on-surface sm:text-xl">
                    {milestone.title}
                  </h3>
                  <p className="font-body mt-1 text-on-surface-variant">
                    {milestone.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Zone d’intervention
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">
                Nous intervenons partout au Maroc
              </h2>
              <p className="font-body mx-auto max-w-2xl text-base text-on-surface-variant sm:text-lg">
                Notre base logistique est à Agadir. Nous assurons des livraisons
                rapides dans toute la ville et vers les principales villes du
                Royaume.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-on-surface shadow-sm transition-all hover:bg-primary hover:text-on-primary"
                >
                  <MaterialIcon name="location_on" className="text-base" />
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-primary px-6 py-12 text-center text-on-primary shadow-2xl shadow-primary/25 sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Rejoignez les familles accompagnées par MediDomicile
            </h2>
            <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
              Discutez avec nous par WhatsApp ou envoyez un email. Nous vous
              répondons sous 15 minutes.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MediDomicile%2C%20je%20souhaite%20en%20savoir%20plus.`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
              >
                <MaterialIcon name="chat" />
                WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Demande%20d'informations%20MediDomicile`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <MaterialIcon name="mail" />
                Email
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
