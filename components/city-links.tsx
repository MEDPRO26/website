"use client";

import Link from "next/link";
import { seoCities } from "@/lib/seo-data";

export default function CityLinks({
  title = "Location de matériel médical par ville",
  exclude,
}: {
  title?: string;
  exclude?: string;
}) {
  const cities = exclude
    ? seoCities.filter((c) => c.slug !== exclude)
    : seoCities;

  if (cities.length === 0) return null;

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
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
              <span className="material-symbols-outlined text-primary transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
