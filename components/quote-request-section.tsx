"use client";

import { useMemo, useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { useSubmitLead } from "@/hooks/use-submit-lead";
import { activeCities } from "@/lib/cities";
import { careServiceFormOptions } from "@/lib/care-services";
import { CONTACT_EMAIL } from "@/lib/products";

type RequestKind = "location" | "vente" | "service";

const REQUEST_KIND_OPTIONS: { value: RequestKind; label: string }[] = [
  { value: "location", label: "Location matériel médical" },
  { value: "vente", label: "Vente matériel médical" },
  { value: "service", label: "Service à domicile" },
];

const REQUEST_KIND_LABEL: Record<RequestKind, string> = {
  location: "Location matériel médical",
  vente: "Vente matériel médical",
  service: "Service à domicile",
};

const rentalMaterialOptions = [
  "Lit médicalisé électrique",
  "Lit médicalisé + matelas anti-escarres",
  "Fauteuil roulant",
  "Concentrateur d'oxygène 5L",
  "Concentrateur d'oxygène 10L",
  "Nébuliseur",
  "Déambulateur",
  "Béquilles",
  "Soulève-malade",
  "Aspirateur chirurgical",
];

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

type QuoteRequestSectionProps = {
  id?: string;
  title: string;
  description: string;
  whatsappHref: string;
  defaultCityName: string;
  pagePath: string;
  productNames: string[];
  footerExtra?: ReactNode;
};

export default function QuoteRequestSection({
  id = "contact",
  title,
  description,
  whatsappHref,
  defaultCityName,
  pagePath,
  productNames,
  footerExtra,
}: QuoteRequestSectionProps) {
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    ville: defaultCityName,
    demandeType: "location" as RequestKind,
    materiel: "",
    message: "",
  });
  const { submit, isSubmitting } = useSubmitLead();

  const requestChoices = useMemo(() => {
    if (formData.demandeType === "vente") {
      return productNames;
    }
    if (formData.demandeType === "service") {
      return careServiceFormOptions;
    }
    return rentalMaterialOptions;
  }, [formData.demandeType, productNames]);

  const requestChoiceLabel =
    formData.demandeType === "service" ? "Service souhaité" : "Matériel souhaité";
  const requestChoicePlaceholder =
    formData.demandeType === "service" ? "Choisir un service" : "Choisir un matériel";
  const otherChoiceLabel =
    formData.demandeType === "service" ? "Autre service" : "Autre matériel";

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nom || !formData.telephone || !formData.ville || !formData.materiel) {
      setFormStatus("error");
      return;
    }

    try {
      await submit({
        client: formData.nom,
        phone: formData.telephone,
        city: formData.ville,
        type: REQUEST_KIND_LABEL[formData.demandeType],
        item: formData.materiel,
        message: formData.message,
        pagePath,
        source: "Formulaire site",
      });
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  const resetForm = () => {
    setFormStatus("idle");
    setFormData({
      nom: "",
      telephone: "",
      ville: defaultCityName,
      demandeType: "location",
      materiel: "",
      message: "",
    });
  };

  return (
    <section id={id} className="px-4 pb-14 sm:px-6 sm:pb-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 overflow-hidden rounded-[32px] bg-secondary p-6 shadow-2xl shadow-secondary/20 sm:p-10 md:flex-row md:p-14 lg:p-16">
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h2 className="font-heading mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="font-body mx-auto mb-6 max-w-md text-base text-white/90 md:mx-0 sm:text-lg">
            {description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href={whatsappHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-status-success px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              Commander par WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Demande%20de%20devis%20matériel%20médical`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
            >
              <MaterialIcon name="mail" />
              Nous envoyer un email
            </a>
          </div>
          {footerExtra ? (
            <p className="mt-4 text-sm text-white/70">{footerExtra}</p>
          ) : null}
        </div>

        <div className="relative z-10 w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:p-6 md:w-[45%] lg:w-1/3">
          {formStatus === "success" ? (
            <div className="animate-fade-in py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success text-white">
                <MaterialIcon name="check" className="text-3xl" />
              </div>
              <h3 className="font-heading mb-2 text-xl font-semibold text-white">
                Demande envoyée !
              </h3>
              <p className="font-body mb-5 text-sm text-white/90">
                Nous avons bien reçu votre demande. Notre équipe vous
                recontactera rapidement.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container-low"
              >
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label
                  htmlFor={`${id}-nom`}
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Votre nom
                </label>
                <input
                  id={`${id}-nom`}
                  name="nom"
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  placeholder="Prénom et nom"
                  className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                />
              </div>
              <div>
                <label
                  htmlFor={`${id}-telephone`}
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Téléphone
                </label>
                <input
                  id={`${id}-telephone`}
                  name="telephone"
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  placeholder="06 XX XX XX XX"
                  className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                />
              </div>
              <div>
                <label
                  htmlFor={`${id}-ville`}
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Ville
                </label>
                <select
                  id={`${id}-ville`}
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={(e) =>
                    setFormData({ ...formData, ville: e.target.value })
                  }
                  className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                >
                  {activeCities.map((activeCity) => (
                    <option key={activeCity.slug} value={activeCity.name}>
                      {activeCity.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`${id}-demandeType`}
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Type de demande
                </label>
                <select
                  id={`${id}-demandeType`}
                  name="demandeType"
                  required
                  value={formData.demandeType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      demandeType: e.target.value as RequestKind,
                      materiel: "",
                    })
                  }
                  className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                >
                  {REQUEST_KIND_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`${id}-materiel`}
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  {requestChoiceLabel}
                </label>
                <select
                  id={`${id}-materiel`}
                  name="materiel"
                  required
                  value={formData.materiel}
                  onChange={(e) =>
                    setFormData({ ...formData, materiel: e.target.value })
                  }
                  className="w-full rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                >
                  <option value="" disabled>
                    {requestChoicePlaceholder}
                  </option>
                  {requestChoices.map((choice) => (
                    <option key={choice} value={choice}>
                      {choice}
                    </option>
                  ))}
                  <option value={otherChoiceLabel}>{otherChoiceLabel}</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor={`${id}-message`}
                  className="mb-1.5 block text-sm font-medium text-white"
                >
                  Message (optionnel)
                </label>
                <textarea
                  id={`${id}-message`}
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Précisez vos besoins, la durée souhaitée..."
                  className="w-full resize-none rounded-xl border-0 bg-white/90 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                />
              </div>
              {formStatus === "error" && (
                <p
                  role="alert"
                  className="flex items-center gap-2 rounded-lg bg-status-error/90 px-3 py-2 text-sm font-medium text-white"
                >
                  <MaterialIcon name="error" className="text-base" />
                  Veuillez remplir tous les champs obligatoires.
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-white py-3.5 text-base font-semibold text-secondary shadow-lg shadow-black/10 transition-all hover:scale-[1.02] hover:bg-surface-container-low active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
