"use client";

import Link from "next/link";
import { activeCities, cities } from "@/lib/cities";
import { hubCityPath } from "@/lib/routes";

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

export default function CityLinks({
  title = "Livraison de ce matériel dans d'autres villes",
  excludeHubSlug,
}: {
  title?: string;
  excludeHubSlug?: string;
}) {
  const cityList = excludeHubSlug
    ? cities.filter((city) => city.hubSlug !== excludeHubSlug)
    : cities;

  if (cityList.length === 0) return null;

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cityList.map((city) =>
            city.available ? (
              <Link
                key={city.slug}
                href={hubCityPath(city.slug)}
                className="group flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-base p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
              >
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {city.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {city.deliveryText}
                  </p>
                </div>
                <MaterialIcon
                  name="arrow_forward"
                  className="text-primary transition-transform group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <div
                key={city.slug}
                className="flex items-center justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-low p-5 opacity-80"
              >
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold text-on-surface-variant">
                      {city.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-semibold text-on-surface-variant">
                      <MaterialIcon name="schedule" className="text-sm" />
                      Bientôt disponible
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant/80">
                    {city.deliveryText}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
        {activeCities.length > 1 && (
          <p className="mt-4 text-sm text-on-surface-variant">
            Le catalogue est le même ; la livraison et les délais varient selon
            votre ville.
          </p>
        )}
      </div>
    </section>
  );
}
