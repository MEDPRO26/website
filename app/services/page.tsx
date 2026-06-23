"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import JsonLd from "@/components/json-ld";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import {
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
} from "@/lib/products";
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  localBusinessSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";

const serviceSpecialties = [
  {
    icon: "medical_services",
    title: "Infirmier à domicile",
    description:
      "Injections, pansements complexes, perfusions et suivi des constantes vitales par des professionnels diplômés d'État.",
    features: ["Soins post-opératoires", "Prise de sang", "Surveillance 24h/7j"],
    theme: {
      bg: "bg-primary/10 text-primary",
      hoverBg: "group-hover:bg-primary group-hover:text-on-primary",
      border: "border-primary/10",
      check: "text-primary",
      link: "text-primary",
      lightBg: "bg-primary/5",
    },
  },
  {
    icon: "volunteer_activism",
    title: "Aide-soignante",
    description:
      "Accompagnement quotidien pour l'hygiène, l'habillage et l'aide à la mobilité des personnes âgées ou dépendantes.",
    features: ["Aide à la toilette", "Surveillance nocturne", "Préparation des repas"],
    theme: {
      bg: "bg-secondary/10 text-secondary",
      hoverBg: "group-hover:bg-secondary group-hover:text-on-secondary",
      border: "border-secondary/10",
      check: "text-secondary",
      link: "text-secondary",
      lightBg: "bg-secondary/5",
    },
  },
  {
    icon: "fitness_center",
    title: "Kinésithérapeute",
    description:
      "Rééducation fonctionnelle, respiratoire ou neurologique directement chez vous pour une récupération optimale.",
    features: ["Rééducation motrice", "Kiné respiratoire", "Rééducation neurologique"],
    theme: {
      bg: "bg-tertiary-container/15 text-tertiary-container",
      hoverBg: "group-hover:bg-tertiary-container group-hover:text-on-tertiary-container",
      border: "border-tertiary-container/10",
      check: "text-tertiary-container",
      link: "text-tertiary-container",
      lightBg: "bg-tertiary-container/5",
    },
  },
];

const trustPoints = [
  {
    icon: "verified_user",
    title: "Professionnels Vérifiés",
    text: "Chaque intervenant subit un processus de sélection rigoureux : diplômes, antécédents et références sont systématiquement contrôlés.",
  },
  {
    icon: "speed",
    title: "Réactivité Maximale",
    text: "Nous trouvons un professionnel disponible dans votre zone géographique en moins de 2 heures pour les interventions urgentes.",
  },
  {
    icon: "payments",
    title: "Tarifs Transparents",
    text: "Aucun frais caché. Les tarifs sont annoncés à l'avance et correspondent aux standards de qualité du marché privé.",
  },
];

const faqs = [
  {
    question: "Comment sont sélectionnés vos professionnels ?",
    answer:
      "Nous vérifions systématiquement le diplôme d'État, l'inscription à l'ordre des infirmiers ou masseurs-kinésithérapeutes, et nous effectuons une enquête de moralité ainsi qu'une vérification des expériences passées.",
  },
  {
    question: "Intervenez-vous le week-end et les jours fériés ?",
    answer:
      "Oui, notre service de coordination est opérationnel 24h/24 et 7j/7. Les soins de santé n'attendent pas, c'est pourquoi nous assurons une continuité de service totale.",
  },
  {
    question: "Quel est le délai de mise en place d'un service ?",
    answer:
      "Pour les soins infirmiers classiques, l'intervention peut avoir lieu dans les 2 à 4 heures suivant votre appel. Pour une garde-malade longue durée, nous prévoyons généralement 24h pour organiser le planning.",
  },
];

const careTypes = [
  "Infirmier",
  "Aide-soignante",
  "Kinésithérapeute",
  "Garde-malade",
];

const serviceCities = ["Agadir", "Rabat"];

const servicesSchema = buildGraph(
  webPageSchema(
    "/services",
    "Soins et aide à domicile à Agadir | MediDomicile",
    "MediDomicile vous met en relation avec des infirmiers, aide-soignants et kinésithérapeutes qualifiés pour des soins à domicile."
  ),
  breadcrumbSchema([
    { name: "Accueil", item: "/" },
    { name: "Services", item: "/services" },
  ]),
  faqSchema(faqs, "/services"),
  localBusinessSchema({
    description:
      "Services d'aide à domicile et location de matériel médical à Agadir et au Maroc.",
  }),
  ...serviceSpecialties.map((service) =>
    serviceSchema(service.title, service.description, "/services")
  )
);

function MaterialIcon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden="true"
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

export default function ServicesPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    careType: "Infirmier",
    city: "",
    neighborhood: "",
    name: "",
    phone: "",
    message: "",
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      setFormStatus("error");
      return;
    }

    const subject = encodeURIComponent(
      `Demande de service - ${formData.careType}`
    );
    const locationLine = formData.neighborhood
      ? `${formData.city}, ${formData.neighborhood}`
      : formData.city;
    const body = encodeURIComponent(
      `Bonjour SOS Santé,\n\nType de soin : ${formData.careType}\nVille : ${formData.city}\nQuartier : ${formData.neighborhood || "Non précisé"}\nLocalisation : ${locationLine}\nNom : ${formData.name}\nTéléphone : ${formData.phone}\n\n${formData.message || "Merci de me recontacter rapidement."}\n\nCordialement,`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setFormStatus("success");
  };

  const scrollToSection = (id: string) => {
    const cleanId = id.replace("#", "");
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <JsonLd data={servicesSchema} />
      <Navbar />

      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          {/* Decorative blobs */}
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Image
              src="/services/hero-bg.jpg"
              alt=""
              width={1200}
              height={800}
              className="max-h-[600px] w-auto object-cover"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <MaterialIcon name="verified" className="text-base" />
              Accompagnement Professionnel
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl md:text-5xl lg:text-6xl">
              Services de soins et aide à domicile
            </h1>
            <p className="font-body mx-auto mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
              Nous vous mettons en relation avec des professionnels de santé
              qualifiés et bienveillants pour assurer votre confort et votre
              rétablissement dans la dignité de votre foyer.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#request-form"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("request-form");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-xl"
              >
                Demander un service
                <MaterialIcon name="arrow_forward" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20un%20service%20de%20soins%20à%20domicile.`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-white/60 px-8 py-4 text-base font-semibold text-secondary backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-secondary/10"
              >
                <MaterialIcon name="chat" />
                WhatsApp Express
              </a>
            </div>

            {/* Quick stats */}
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3 rounded-3xl border border-outline-variant/30 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:gap-6 sm:p-6">
              {[
                { value: "24h/7j", label: "Disponible" },
                { value: "< 2h", label: "Réponse urgente" },
                { value: "100%", label: "Professionnels vérifiés" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-lg font-bold text-primary sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-xs text-on-surface-variant sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <div className="mb-10 text-center md:mb-14">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              Nos expertises
            </span>
            <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
              Spécialités à domicile
            </h2>
            <p className="font-body mx-auto max-w-2xl text-base text-on-surface-variant sm:text-lg">
              Une gamme complète de soins médicaux et paramédicaux adaptée à
              chaque besoin spécifique, de la surveillance ponctuelle à
              l&apos;assistance permanente.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {serviceSpecialties.map((service, index) => (
              <article
                key={service.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-base p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${service.theme.border.replace("border", "bg")}`}
                />
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${service.theme.bg} ${service.theme.hoverBg}`}
                >
                  <MaterialIcon name={service.icon} className="text-3xl" />
                </div>
                <h3 className="font-heading mb-3 text-xl font-semibold text-on-surface sm:text-2xl">
                  {service.title}
                </h3>
                <p className="font-body mb-6 flex-grow text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  {service.description}
                </p>
                <ul className="mb-6 space-y-2.5">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-on-surface-variant sm:text-base"
                    >
                      <MaterialIcon
                        name="check_circle"
                        className={`shrink-0 text-lg ${service.theme.check}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#request-form"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("request-form");
                  }}
                  className={`mt-auto inline-flex items-center gap-1.5 font-heading text-sm font-semibold ${service.theme.link} transition-all hover:gap-2.5`}
                >
                  Voir les tarifs
                  <MaterialIcon name="chevron_right" className="text-lg" />
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Trust / Why choose us */}
        <section className="overflow-hidden bg-surface-container-low px-4 py-14 sm:px-6 md:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-2 lg:order-1">
              <div className="relative z-10 overflow-hidden rounded-[32px] shadow-2xl shadow-primary/10 sm:rounded-[40px]">
                <Image
                  src="/services/soins-domicile.jpg"
                  alt="Professionnel de santé tenant la main d'une personne âgée à domicile"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 z-20 max-w-[200px] rounded-2xl bg-primary p-5 text-on-primary shadow-xl sm:-bottom-6 sm:-right-6 sm:max-w-xs sm:rounded-3xl sm:p-6">
                <p className="font-heading mb-1 text-2xl font-bold sm:text-3xl">
                  24h/7j
                </p>
                <p className="text-sm leading-snug text-white/90">
                  Disponibilité immédiate pour les urgences de soins à domicile.
                </p>
              </div>
              {/* Decorative ring */}
              <div className="absolute -left-6 -top-6 -z-0 h-32 w-32 rounded-full border-[12px] border-secondary/10 sm:h-40 sm:w-40" />
            </div>

            <div className="order-1 lg:order-2">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Pourquoi nous faire confiance
              </span>
              <h2 className="font-heading mb-6 text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Des partenaires soigneusement sélectionnés
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {trustPoints.map((point, index) => (
                  <div
                    key={point.title}
                    className="flex gap-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container shadow-sm">
                      <MaterialIcon name={point.icon} className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-heading mb-1 text-lg font-semibold text-on-surface sm:text-xl">
                        {point.title}
                      </h3>
                      <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
                        {point.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Request Form */}
        <section
          id="request-form"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20"
        >
          <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-[32px] bg-surface-base p-6 shadow-xl shadow-primary/5 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-16">
            <div className="lg:col-span-5">
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
                Prendre contact
              </span>
              <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
                Demande de service rapide
              </h2>
              <p className="font-body mb-6 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                Remplissez ce formulaire et notre équipe de coordination vous
                rappellera dans les 15 minutes pour confirmer les détails de
                l&apos;intervention.
              </p>
              <div className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                  <MaterialIcon name="phone_in_talk" className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary sm:text-sm">
                    Ligne d&apos;urgence
                  </p>
                  <p className="font-heading text-lg font-semibold text-on-surface sm:text-xl">
                    {PHONE_DISPLAY}
                  </p>
                </div>
              </div>

              <div className="mt-8 hidden lg:block">
                <p className="font-heading mb-3 text-sm font-semibold text-on-surface">
                  Vous préférez WhatsApp ?
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20un%20service%20de%20soins%20à%20domicile.`}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-status-success px-5 py-3 text-sm font-semibold text-status-success transition-all hover:bg-status-success hover:text-white"
                >
                  <MaterialIcon name="chat" />
                  Discuter maintenant
                </a>
              </div>
            </div>

            {formStatus === "success" ? (
              <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center lg:col-span-7">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success text-white">
                  <MaterialIcon name="check" className="text-3xl" />
                </div>
                <h3 className="font-heading mb-2 text-xl font-semibold text-primary">
                  Demande envoyée !
                </h3>
                <p className="font-body mb-5 text-on-surface-variant">
                  Votre client mail devrait s&apos;ouvrir. Sinon, nous vous
                  répondrons rapidement.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormStatus("idle");
                    setFormData({
                      careType: "Infirmier",
                      city: "",
                      neighborhood: "",
                      name: "",
                      phone: "",
                      message: "",
                    });
                  }}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
                >
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="care-type"
                    className="text-sm font-medium text-on-surface"
                  >
                    Type de soin
                  </label>
                  <select
                    id="care-type"
                    value={formData.careType}
                    onChange={(e) =>
                      setFormData({ ...formData, careType: e.target.value })
                    }
                    className="h-[52px] rounded-xl border border-outline-variant bg-surface-bright px-4 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                  >
                    {careTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-on-surface"
                  >
                    Ville <span className="text-status-error">*</span>
                  </label>
                  <select
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="h-[52px] rounded-xl border border-outline-variant bg-surface-bright px-4 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                  >
                    <option value="">Choisir une ville</option>
                    {serviceCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="neighborhood"
                    className="text-sm font-medium text-on-surface"
                  >
                    Quartier
                  </label>
                  <input
                    id="neighborhood"
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData({ ...formData, neighborhood: e.target.value })
                    }
                    placeholder="Ex: Hay Mohammadi"
                    className="h-[52px] rounded-xl border border-outline-variant bg-surface-bright px-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-on-surface"
                  >
                    Nom complet <span className="text-status-error">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Votre nom"
                    className="h-[52px] rounded-xl border border-outline-variant bg-surface-bright px-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-on-surface"
                  >
                    Téléphone <span className="text-status-error">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="06 XX XX XX XX"
                    className="h-[52px] rounded-xl border border-outline-variant bg-surface-bright px-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-on-surface"
                  >
                    Message ou besoin spécifique
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Décrivez brièvement la situation..."
                    className="resize-none rounded-xl border border-outline-variant bg-surface-bright px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                  />
                </div>
                {formStatus === "error" && (
                  <p
                    role="alert"
                    className="flex items-center gap-2 rounded-lg bg-status-error/10 px-3 py-2 text-sm font-medium text-status-error md:col-span-2"
                  >
                    <MaterialIcon name="error" className="text-base" />
                    Veuillez remplir tous les champs obligatoires.
                  </p>
                )}
                <div className="mt-2 md:col-span-2">
                  <button
                    type="submit"
                    className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-on-primary shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg active:translate-y-0"
                  >
                    Envoyer ma demande
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20"
        >
          <div className="mb-10 text-center md:mb-12">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              FAQ
            </span>
            <h2 className="font-heading text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-primary/20 bg-white shadow-md"
                      : "border-outline-variant/30 bg-surface-base"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between p-4 text-left sm:p-5"
                  >
                    <span className="font-heading pr-4 text-base font-semibold text-primary sm:text-lg">
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
                      <p className="border-t border-outline-variant/30 px-4 pb-4 pt-3 font-body text-sm leading-relaxed text-secondary sm:px-5 sm:pb-5 sm:pt-4 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-primary px-6 py-12 text-center text-on-primary shadow-2xl shadow-primary/25 sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Besoin d&apos;un soin aujourd&apos;hui ?
            </h2>
            <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
              Notre équipe est disponible immédiatement pour organiser une
              intervention à domicile à Agadir et dans toute la région.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
              >
                <MaterialIcon name="phone_in_talk" />
                Appeler maintenant
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20j'ai%20besoin%20d'un%20soin%20urgent%20à%20domicile.`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <MaterialIcon name="chat" />
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest px-4 pb-24 pt-14 sm:px-6 sm:pb-14 md:pb-14 lg:pt-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Logo href="/" size="lg" className="mb-4" />
            <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Votre partenaire de confiance pour une santé sereine à domicile
              partout au Maroc.
            </p>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Soins Infirmiers
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Aide aux Seniors
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Location Matériel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Légal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Conditions Générales
                </a>
              </li>
              <li>
                <a
                  href="#request-form"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("request-form");
                  }}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
              Suivez-nous
            </h4>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                aria-label="WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110"
              >
                <MaterialIcon name="chat" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110"
              >
                <MaterialIcon name="mail" />
              </a>
            </div>
            <p className="mt-4 text-xs text-on-surface-variant/70">
              © 2026 SOS Santé — Solutions de santé à domicile. Tous droits
              réservés.
            </p>
          </div>
          <div className="border-t border-outline-variant pt-6 text-center text-xs text-on-surface-variant sm:text-sm md:col-span-4">
            © 2026 SOS Santé — Solutions de santé à domicile. Tous droits
            réservés.
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-background px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
      >
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="home" />
          <span className="text-[10px] font-medium">Accueil</span>
        </Link>
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="medical_services" />
          <span className="text-[10px] font-medium">Matériel</span>
        </Link>
        <Link
          href="/services"
          className="flex flex-1 flex-col items-center justify-center py-2 text-primary"
        >
          <MaterialIcon name="volunteer_activism" filled />
          <span className="text-[10px] font-bold">Services</span>
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-status-success"
        >
          <MaterialIcon name="chat" className="text-status-success" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </nav>

      {/* Desktop WhatsApp FAB */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20un%20service%20de%20soins%20à%20domicile.`}
        aria-label="Contacter sur WhatsApp"
        className="fixed bottom-8 right-8 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/30 transition-all hover:scale-110 hover:shadow-xl active:scale-95 md:flex"
      >
        <MaterialIcon name="chat" className="text-2xl" />
      </a>
    </>
  );
}
