"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/products";
import { isVenteCatalogPath } from "@/lib/routes";
import CityCatalogPickerDialog from "@/components/city-catalog-picker-dialog";
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
  const [pickerDestination, setPickerDestination] = useState<
    "catalog" | "services" | null
  >(null);

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
          onClick={() => setPickerDestination("catalog")}
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

        <button
          type="button"
          onClick={() => setPickerDestination("services")}
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
        </button>

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

      <CityCatalogPickerDialog
        open={pickerDestination !== null}
        onClose={() => setPickerDestination(null)}
        destination={pickerDestination ?? "catalog"}
      />
    </>
  );
}
