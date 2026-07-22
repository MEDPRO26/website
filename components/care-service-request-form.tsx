"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSubmitLead } from "@/hooks/use-submit-lead";
import {
  PHONE_DISPLAY,
  whatsAppHref,
} from "@/lib/products";
import { careServiceFormOptions } from "@/lib/care-services";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { SuggestableItemField } from "@/components/suggestable-item-field";

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

const serviceCities = ["Agadir", "Casablanca", "Rabat"];

type CareServiceRequestFormProps = {
  id?: string;
  defaultCareType?: string;
  defaultCity?: string;
  phoneDisplay?: string;
  whatsappHref?: string;
  showComingSoon?: boolean;
  heading?: string;
  subheading?: string;
};

export function CareServiceRequestForm({
  id = "request-form",
  defaultCareType = "Kinésithérapeute",
  defaultCity = "",
  phoneDisplay = PHONE_DISPLAY,
  whatsappHref: whatsappHrefProp,
  showComingSoon = false,
  heading = "Demande de service rapide",
  subheading = "Remplissez ce formulaire et notre équipe de coordination vous rappellera dans les 15 minutes pour confirmer les détails de l'intervention.",
}: CareServiceRequestFormProps) {
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    careType: defaultCareType,
    city: defaultCity,
    neighborhood: "",
    name: "",
    phone: "",
    message: "",
  });
  const pathname = usePathname();
  const { submit, isSubmitting } = useSubmitLead();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      setFormStatus("error");
      return;
    }

    try {
      await submit({
        client: formData.name,
        phone: formData.phone,
        city: formData.city,
        district: formData.neighborhood,
        type: "Service à domicile",
        item: formData.careType,
        message: formData.message,
        pagePath: pathname,
        source: "Formulaire site",
      });
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <div className="relative">
        {showComingSoon && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[32px] bg-white/20 backdrop-blur-[1px]"
            role="status"
            aria-label="Service bientôt disponible"
          >
            <div className="mx-4 rounded-2xl border border-outline-variant/40 bg-white/95 px-8 py-5 text-center shadow-lg">
              <span className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
                <MaterialIcon name="schedule" className="text-2xl" />
              </span>
              <p className="font-heading text-xl font-semibold text-secondary sm:text-2xl">
                Service bientôt disponible
              </p>
            </div>
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-8 overflow-hidden rounded-[32px] bg-surface-base p-6 shadow-xl shadow-primary/5 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-16 ${
            showComingSoon ? "pointer-events-none select-none opacity-45" : ""
          }`}
        >
          <div className="lg:col-span-5">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-container">
              Prendre contact
            </span>
            <h2 className="font-heading mb-4 text-2xl font-semibold text-secondary sm:text-3xl md:text-4xl">
              {heading}
            </h2>
            <p className="font-body mb-6 text-sm leading-relaxed text-on-surface-variant sm:text-base">
              {subheading}
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
                  {phoneDisplay}
                </p>
              </div>
            </div>

            <div className="mt-8 hidden lg:block">
              <p className="font-heading mb-3 text-sm font-semibold text-on-surface">
                Vous préférez WhatsApp ?
              </p>
              <a
                href={
                  whatsappHrefProp ??
                  whatsAppHref(
                    `Bonjour SOS Santé, je souhaite ${defaultCareType.toLowerCase()}${defaultCity ? ` à ${defaultCity}` : ""}.`,
                    "garde_soins"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border-2 border-status-success px-5 py-3 text-sm font-semibold text-status-success transition-all hover:bg-status-success hover:text-white"
              >
                <WhatsAppIcon className="h-5 w-5" />
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
                Nous avons bien reçu votre demande. Notre équipe vous
                recontactera rapidement.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormStatus("idle");
                  setFormData({
                    careType: defaultCareType,
                    city: defaultCity,
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
                  htmlFor={`${id}-care-type`}
                  className="text-sm font-medium text-on-surface"
                >
                  Type de soin
                </label>
                <SuggestableItemField
                  id={`${id}-care-type`}
                  required
                  value={formData.careType}
                  onChange={(careType) => setFormData({ ...formData, careType })}
                  options={careServiceFormOptions}
                  placeholder="Rechercher ou saisir un soin"
                  tone="light"
                  inputClassName="h-[52px] w-full rounded-xl border border-outline-variant bg-surface-bright px-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${id}-city`}
                  className="text-sm font-medium text-on-surface"
                >
                  Ville <span className="text-status-error">*</span>
                </label>
                <select
                  id={`${id}-city`}
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
                  htmlFor={`${id}-neighborhood`}
                  className="text-sm font-medium text-on-surface"
                >
                  Quartier
                </label>
                <input
                  id={`${id}-neighborhood`}
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
                  htmlFor={`${id}-name`}
                  className="text-sm font-medium text-on-surface"
                >
                  Nom complet <span className="text-status-error">*</span>
                </label>
                <input
                  id={`${id}-name`}
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
                  htmlFor={`${id}-phone`}
                  className="text-sm font-medium text-on-surface"
                >
                  Téléphone <span className="text-status-error">*</span>
                </label>
                <input
                  id={`${id}-phone`}
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
                  htmlFor={`${id}-message`}
                  className="text-sm font-medium text-on-surface"
                >
                  Message ou besoin spécifique
                </label>
                <textarea
                  id={`${id}-message`}
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
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-on-primary shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
