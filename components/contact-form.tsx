"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useSubmitLead } from "@/hooks/use-submit-lead";
import { catalogProducts } from "@/lib/catalog-products";
import { careServiceFormOptions } from "@/lib/care-services";
import { activeCities, DEFAULT_DELIVERY_CITY } from "@/lib/delivery-cities";

type ContactRequestKind = "general" | "location" | "vente" | "service";

const SUBJECT_OPTIONS: { value: ContactRequestKind; label: string }[] = [
  { value: "general", label: "Demande générale" },
  { value: "location", label: "Location matériel médical" },
  { value: "vente", label: "Vente matériel médical" },
  { value: "service", label: "Service à domicile" },
];

const REQUEST_TYPE_LABEL: Record<Exclude<ContactRequestKind, "general">, string> = {
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

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  city: DEFAULT_DELIVERY_CITY,
  demandeType: "general" as ContactRequestKind,
  item: "",
  message: "",
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

export default function ContactForm() {
  const pathname = usePathname();
  const { submit, isSubmitting } = useSubmitLead();
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState(initialFormData);

  const requestChoices = useMemo(() => {
    if (formData.demandeType === "vente") {
      return catalogProducts.map((product) => product.name);
    }
    if (formData.demandeType === "service") {
      return careServiceFormOptions;
    }
    if (formData.demandeType === "location") {
      return rentalMaterialOptions;
    }
    return [];
  }, [formData.demandeType]);

  const showItemField = formData.demandeType !== "general";
  const itemLabel =
    formData.demandeType === "service" ? "Service souhaité" : "Matériel souhaité";
  const itemPlaceholder =
    formData.demandeType === "service" ? "Choisir un service" : "Choisir un matériel";
  const otherItemLabel =
    formData.demandeType === "service" ? "Autre service" : "Autre matériel";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      setFormStatus("error");
      return;
    }
    if (showItemField && !formData.item) {
      setFormStatus("error");
      return;
    }

    const type =
      formData.demandeType === "general"
        ? "Demande générale"
        : REQUEST_TYPE_LABEL[formData.demandeType];
    const item =
      formData.demandeType === "general" ? "Demande générale" : formData.item;

    try {
      await submit({
        client: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        city: formData.city,
        type,
        item,
        message: formData.message,
        pagePath: pathname,
        source: "Formulaire site",
      });
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  if (formStatus === "success") {
    return (
      <div className="animate-fade-in rounded-3xl border border-outline-variant/30 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success text-white">
          <MaterialIcon name="check" className="text-3xl" />
        </div>
        <h3 className="font-heading mb-2 text-xl font-semibold text-primary">
          Demande envoyée !
        </h3>
        <p className="font-body mb-5 text-on-surface-variant">
          Nous avons bien reçu votre message. Notre équipe vous recontactera
          rapidement.
        </p>
        <button
          type="button"
          onClick={() => {
            setFormStatus("idle");
            setFormData(initialFormData);
          }}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="06 XX XX XX XX"
            className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-on-surface"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="votre@email.com"
            className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="mb-1.5 block text-sm font-medium text-on-surface"
          >
            Ville <span className="text-status-error">*</span>
          </label>
          <select
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {activeCities.map((city) => (
              <option key={city.slug} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="demandeType"
          className="mb-1.5 block text-sm font-medium text-on-surface"
        >
          Sujet <span className="text-status-error">*</span>
        </label>
        <select
          id="demandeType"
          name="demandeType"
          required
          value={formData.demandeType}
          onChange={(e) =>
            setFormData({
              ...formData,
              demandeType: e.target.value as ContactRequestKind,
              item: "",
            })
          }
          className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {showItemField ? (
        <div>
          <label
            htmlFor="item"
            className="mb-1.5 block text-sm font-medium text-on-surface"
          >
            {itemLabel} <span className="text-status-error">*</span>
          </label>
          <select
            id="item"
            name="item"
            required
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>
              {itemPlaceholder}
            </option>
            {requestChoices.map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
            <option value={otherItemLabel}>{otherItemLabel}</option>
          </select>
        </div>
      ) : null}
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-on-surface"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Décrivez votre besoin..."
          className="w-full resize-none rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {formStatus === "error" && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-status-error/10 px-3 py-2 text-sm font-medium text-status-error"
        >
          <MaterialIcon name="error" className="text-base" />
          Veuillez remplir tous les champs obligatoires.
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        <MaterialIcon name="send" />
        {isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
