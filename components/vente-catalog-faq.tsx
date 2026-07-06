"use client";

import { useState } from "react";
import type { CitySlug } from "@/lib/cities";
import { getVenteCatalogFaqs } from "@/lib/vente-faqs";

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

export default function VenteCatalogFaq({ citySlug }: { citySlug: CitySlug }) {
  const faqs = getVenteCatalogFaqs(citySlug);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface-container-low px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading mb-6 text-center text-2xl font-semibold text-secondary sm:text-3xl">
          Questions fréquentes — achat matériel médical
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left sm:p-5"
                >
                  <span className="font-heading text-base font-semibold text-primary sm:text-lg">
                    {faq.question}
                  </span>
                  <MaterialIcon
                    name="expand_more"
                    className={`shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="border-t border-surface-container px-4 pb-4 pt-3 text-sm leading-relaxed text-on-surface-variant sm:px-5 sm:pb-5 sm:text-base">
                    {faq.answer}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
