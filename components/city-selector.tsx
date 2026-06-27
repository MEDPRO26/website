"use client";

import { activeCities, type CitySlug } from "@/lib/cities";

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

type CitySelectorProps = {
  id?: string;
  label?: string;
  className?: string;
  citySlug: CitySlug;
  onCityChange: (citySlug: CitySlug) => void;
  variant?: "default" | "prominent";
};

export default function CitySelector({
  id = "city-selector",
  label = "Choisir la ville",
  className = "",
  citySlug,
  onCityChange,
  variant = "default",
}: CitySelectorProps) {
  const isProminent = variant === "prominent";

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`mb-2 flex items-center gap-2 font-semibold text-on-surface-variant ${
          isProminent
            ? "justify-center text-base sm:text-lg"
            : "text-sm"
        }`}
      >
        <MaterialIcon
          name="location_on"
          className={`text-primary ${isProminent ? "text-xl" : "text-base"}`}
        />
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={citySlug}
          onChange={(event) => {
            onCityChange(event.target.value as CitySlug);
          }}
          className={`w-full appearance-none border bg-white font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            isProminent
              ? "rounded-2xl border-primary/30 py-3.5 pl-5 pr-12 text-base shadow-md shadow-primary/10 sm:text-lg"
              : "rounded-xl border-outline-variant py-2.5 pl-4 pr-10 text-sm"
          }`}
        >
          {activeCities.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
        <MaterialIcon
          name="expand_more"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-on-surface-variant ${
            isProminent ? "right-4 text-2xl" : "right-3 text-base"
          }`}
        />
      </div>
    </div>
  );
}
