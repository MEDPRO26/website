import Link from "next/link";
import type { LocationCityEnrichment } from "@/lib/location-city-enrichment";

function MaterialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default function LocationCityEnrichmentSections({
  enrichment,
  cityName,
}: {
  enrichment: LocationCityEnrichment;
  cityName: string;
}) {
  return (
    <>
      <section className="bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
            {enrichment.processTitle}
          </h2>
          <p className="font-body mb-10 max-w-3xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
            {enrichment.processIntro}
          </p>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {enrichment.processSteps.map((step, index) => (
              <li key={step.title}>
                <p className="font-heading mb-2 text-sm font-semibold tracking-widest text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-heading mb-2 text-lg font-semibold text-on-surface">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
            {enrichment.useCasesTitle}
          </h2>
          <p className="font-body mb-10 max-w-2xl text-base text-on-surface-variant sm:text-lg">
            Des cas concrets où les familles nous contactent à {cityName}.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {enrichment.useCases.map((item) => (
              <div key={item.title}>
                <h3 className="font-heading mb-2 text-xl font-semibold text-on-surface">
                  {item.title}
                </h3>
                <p className="font-body text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {enrichment.sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={
            index % 2 === 0
              ? "bg-surface-container-low px-4 py-14 sm:px-6 sm:py-20"
              : "px-4 py-14 sm:px-6 sm:py-20"
          }
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading mb-5 text-2xl font-semibold text-primary sm:text-3xl">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="font-body mb-4 text-base leading-relaxed text-on-surface-variant last:mb-0 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-6 space-y-2">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="font-body flex gap-3 text-base text-on-surface-variant sm:text-lg"
                  >
                    <MaterialIcon
                      name="check_circle"
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ))}

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading mb-3 text-2xl font-semibold text-primary sm:text-3xl">
            Pages utiles
          </h2>
          <p className="font-body mb-8 max-w-2xl text-base text-on-surface-variant sm:text-lg">
            Continuer vers le hub national, la livraison, le catalogue vente ou
            un produit précis.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {enrichment.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-heading inline-flex items-center gap-2 text-base font-semibold text-primary transition-colors hover:text-primary-container"
                >
                  <MaterialIcon name="arrow_forward" className="text-lg" />
                  {link.label}
                </Link>
                {link.description ? (
                  <p className="font-body ml-8 mt-0.5 text-sm text-on-surface-variant">
                    {link.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
