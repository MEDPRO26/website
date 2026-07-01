"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSubmitLead } from "@/hooks/use-submit-lead";
import { activeCities, DEFAULT_DELIVERY_CITY } from "@/lib/delivery-cities";

const subjects = [
  "Demande générale",
  "Location matériel médical",
  "Service à domicile",
  "Demande de devis",
  "Partenariat",
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

export default function ContactForm() {
  const pathname = usePathname();
  const { submit, isSubmitting } = useSubmitLead();
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: DEFAULT_DELIVERY_CITY,
    subject: subjects[0],
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city || !formData.subject) {
      setFormStatus("error");
      return;
    }

    try {
      await submit({
        client: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        city: formData.city,
        type: formData.subject,
        item: formData.subject,
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
            setFormData({
              name: "",
              phone: "",
              email: "",
              city: DEFAULT_DELIVERY_CITY,
              subject: subjects[0],
              message: "",
            });
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
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-on-surface"
        >
          Sujet <span className="text-status-error">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
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
