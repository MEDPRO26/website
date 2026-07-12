"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { activeCities, type CitySlug } from "@/lib/cities";
import {
  careServiceCityPath,
  getCareServiceBySlug,
} from "@/lib/care-services";
import { writeStoredCitySlug } from "@/lib/city-storage";
import { venteCityPath, venteProductPath } from "@/lib/routes";

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

type CityCatalogPickerDialogProps = {
  open: boolean;
  onClose: () => void;
  productSlug?: string;
  serviceSlug?: string;
  destination?: "catalog" | "services";
};

export default function CityCatalogPickerDialog({
  open,
  onClose,
  productSlug,
  serviceSlug,
  destination = "catalog",
}: CityCatalogPickerDialogProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const handleCitySelect = (citySlug: CitySlug) => {
    writeStoredCitySlug(citySlug);
    onClose();
    if (productSlug) {
      router.push(venteProductPath(productSlug, citySlug));
      return;
    }
    if (serviceSlug) {
      router.push(careServiceCityPath(serviceSlug, citySlug));
      return;
    }
    if (destination === "services") {
      router.push("/services");
      return;
    }
    router.push(venteCityPath(citySlug));
  };

  const isProductPicker = Boolean(productSlug);
  const isServicePicker = Boolean(serviceSlug);
  const isServicesHubPicker = destination === "services" && !isProductPicker && !isServicePicker;
  const serviceTitle = serviceSlug
    ? getCareServiceBySlug(serviceSlug)?.title
    : undefined;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Fermer"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-catalog-picker-title"
        className="relative z-10 w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-outline-variant bg-background px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:max-h-[min(90vh,calc(100dvh-2rem))] sm:rounded-3xl sm:border sm:pb-5"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-outline-variant sm:hidden" />
        <h2
          id="city-catalog-picker-title"
          className="mb-1 text-center text-lg font-bold text-on-surface"
        >
          Choisir votre ville
        </h2>
        <p className="mb-5 text-center text-sm text-on-surface-variant">
          {isProductPicker
            ? "Choisissez votre ville pour consulter ce produit"
            : isServicePicker
              ? "Choisissez votre ville pour accéder à ce service"
              : isServicesHubPicker
                ? "Choisissez votre ville pour accéder à nos services"
                : "Accédez au catalogue matériel de votre ville"}
        </p>
        <div className="space-y-2">
          {activeCities.map((city) => (
            <button
              key={city.slug}
              type="button"
              onClick={() => handleCitySelect(city.slug)}
              className="flex w-full items-center gap-3 rounded-2xl border border-outline-variant bg-white px-4 py-3.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MaterialIcon name="location_on" />
              </span>
              <span>
                <span className="block text-base font-semibold text-on-surface">
                  {city.name}
                </span>
                <span className="block text-xs text-on-surface-variant">
                  {isProductPicker
                    ? `Voir le produit - ${city.name}`
                    : isServicePicker
                      ? `${serviceTitle ?? "Service"} - ${city.name}`
                      : isServicesHubPicker
                        ? `Services à domicile - ${city.name}`
                        : `Catalogue vente - ${city.name}`}
                </span>
              </span>
              <MaterialIcon
                name="chevron_right"
                className="ml-auto text-on-surface-variant"
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          Annuler
        </button>
      </div>
    </div>,
    document.body
  );
}
