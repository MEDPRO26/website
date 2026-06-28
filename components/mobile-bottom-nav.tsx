"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { activeCities, type CitySlug } from "@/lib/cities";
import { writeStoredCitySlug } from "@/lib/city-storage";
import { WHATSAPP_NUMBER } from "@/lib/products";
import { isVenteCatalogPath, venteCityPath } from "@/lib/routes";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

function MaterialIcon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${filled ? "filled" : ""} ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

type MobileBottomNavProps = {
  whatsappHref?: string;
};

export default function MobileBottomNav({
  whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);

  const isHome = pathname === "/";
  const isMaterial =
    isVenteCatalogPath(pathname) ||
    pathname.startsWith("/location-vente-materiel-medical-") ||
    pathname.startsWith("/location-materiel-medical-") ||
    pathname.startsWith("/materiel-") ||
    pathname.startsWith("/produits/") ||
    pathname.startsWith("/vente-de-materiel-medical");
  const isServices =
    pathname === "/services" || pathname.startsWith("/services/");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAccueilClick = (event: React.MouseEvent) => {
    if (!isHome) return;
    event.preventDefault();
    scrollToSection("accueil");
  };

  const handleCitySelect = (citySlug: CitySlug) => {
    writeStoredCitySlug(citySlug);
    setCityPickerOpen(false);
    router.push(venteCityPath(citySlug));
  };

  return (
    <>
      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-background px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
      >
        <Link
          href="/"
          onClick={handleAccueilClick}
          className={`flex flex-1 flex-col items-center justify-center py-2 transition-colors ${
            isHome
              ? "text-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <MaterialIcon name="home" filled={isHome} />
          <span
            className={`text-[10px] ${isHome ? "font-bold" : "font-medium"}`}
          >
            Accueil
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setCityPickerOpen(true)}
          className={`flex flex-1 flex-col items-center justify-center py-2 transition-colors ${
            isMaterial
              ? "text-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <MaterialIcon name="medical_services" filled={isMaterial} />
          <span
            className={`text-[10px] ${isMaterial ? "font-bold" : "font-medium"}`}
          >
            Matériel
          </span>
        </button>

        <Link
          href="/services"
          className={`flex flex-1 flex-col items-center justify-center py-2 transition-colors ${
            isServices
              ? "text-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <MaterialIcon name="volunteer_activism" filled={isServices} />
          <span
            className={`text-[10px] ${isServices ? "font-bold" : "font-medium"}`}
          >
            Services
          </span>
        </Link>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center py-2 text-on-surface-variant transition-colors hover:text-[#25D366]"
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </nav>

      {cityPickerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Fermer"
            className="absolute inset-0 bg-black/40"
            onClick={() => setCityPickerOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="city-picker-title"
            className="absolute bottom-0 left-0 w-full rounded-t-3xl border-t border-outline-variant bg-background px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-outline-variant" />
            <h2
              id="city-picker-title"
              className="mb-1 text-center text-lg font-bold text-on-surface"
            >
              Choisir votre ville
            </h2>
            <p className="mb-5 text-center text-sm text-on-surface-variant">
              Accédez au catalogue matériel de votre ville
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
                      Catalogue vente — {city.name}
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
              onClick={() => setCityPickerOpen(false)}
              className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
}
