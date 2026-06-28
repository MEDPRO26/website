"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/logo";
import { activeCities } from "@/lib/cities";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/products";
import { getCityFromVentePath, isVenteCatalogPath, venteCityPath } from "@/lib/routes";

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

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const pageLinks = [
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const hashLinks = [
  { label: "FAQ", hash: "faq", href: "/#faq" },
];

function MaterialDropdownLinks({
  pathname,
  onNavigate,
  className = "",
  variant = "desktop",
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <div className={classNames("space-y-4", className)}>
        <div>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/70">
            Location
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low/80 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-on-surface-variant/10 text-on-surface-variant">
              <MaterialIcon name="schedule" className="text-lg" />
            </span>
            <span className="text-sm font-medium text-on-surface-variant">
              Bientôt disponible
            </span>
          </div>
        </div>

        <div>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/70">
            Vente
          </p>
          <div className="space-y-2">
            {activeCities.map((city) => {
              const href = venteCityPath(city.slug);
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={city.slug}
                  href={href}
                  onClick={onNavigate}
                  className={classNames(
                    "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all",
                    active
                      ? "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/10"
                      : "border-outline-variant/50 bg-white text-on-surface hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <span
                    className={classNames(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      active
                        ? "bg-primary/15 text-primary"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    <MaterialIcon name="location_on" className="text-lg" />
                  </span>
                  {city.name}
                  <MaterialIcon
                    name="chevron_right"
                    className="ml-auto text-lg text-on-surface-variant/60"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        Location
      </p>
      <span
        className="flex cursor-default items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface-variant"
        aria-disabled="true"
      >
        <MaterialIcon name="schedule" />
        Bientôt disponible
      </span>

      <p className="mt-2 border-t border-outline-variant/30 px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        Vente
      </p>
      {activeCities.map((city) => {
        const href = venteCityPath(city.slug);
        const active =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={city.slug}
            href={href}
            onClick={onNavigate}
            className={classNames(
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-on-surface hover:bg-surface-container-low hover:text-primary"
            )}
          >
            <MaterialIcon name="location_on" />
            {city.name}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleHashLink = (
    e: React.MouseEvent,
    href: string,
    hash: string,
  ) => {
    setMobileMenuOpen(false);
    const id = hash.replace("#", "");
    const basePath = href.split("#")[0] || "/";

    if (pathname === basePath) {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isMaterialActive =
    pathname === "/" ||
    isVenteCatalogPath(pathname) ||
    pathname.startsWith("/location-vente-materiel-medical-") ||
    pathname.startsWith("/location-materiel-medical-");

  return (
    <header
      aria-label="Navigation principale"
      className="fixed left-0 top-0 z-50 h-16 w-full border-b border-outline-variant/50 bg-background/95 shadow-sm backdrop-blur-md md:h-20"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-10">
          <Logo priority size="md" />

          <nav className="hidden items-center gap-1 md:flex">
            {/* Matériel dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={classNames(
                  "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isMaterialActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                )}
              >
                Matériel
                <MaterialIcon
                  name="expand_more"
                  className={classNames(
                    "text-base transition-transform",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={classNames(
                  "absolute left-0 top-full w-64 pt-2 transition-all duration-200",
                  dropdownOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                )}
              >
                <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-white shadow-xl">
                  <MaterialDropdownLinks pathname={pathname} />
                </div>
              </div>
            </div>

            {pageLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={classNames(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {hashLinks.map((link) => (
              <Link
                key={link.hash}
                href={link.href}
                onClick={(e) => handleHashLink(e, link.href, link.hash)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20des%20informations.`}
            className="hidden items-center gap-2 rounded-full bg-status-success px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 sm:inline-flex"
          >
            <MaterialIcon name="chat" className="text-lg" />
            WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Acc%C3%A8s%20Mon%20Espace%20SOS%20Sant%C3%A9`}
            className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-all hover:bg-primary-container sm:inline-flex"
          >
            Mon Espace
          </a>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={classNames(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors md:hidden",
              mobileMenuOpen
                ? "border border-primary/20 bg-primary/10 text-primary"
                : "text-primary hover:bg-surface-container"
            )}
          >
            <MaterialIcon
              name={mobileMenuOpen ? "close" : "menu"}
              className="text-2xl"
            />
          </button>
        </div>
      </div>

      {/* Mobile menu sheet */}
      <div
        className={classNames(
          "absolute left-0 top-full w-full border-b border-outline-variant/50 bg-surface-container-low/95 shadow-xl backdrop-blur-md transition-all duration-300 md:hidden",
          mobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="mx-auto max-w-lg space-y-4 px-4 py-5 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MaterialIcon name="medical_services" className="text-lg" />
              </span>
              <p className="text-sm font-bold text-on-surface">Matériel</p>
            </div>
            <MaterialDropdownLinks
              pathname={pathname}
              onNavigate={() => setMobileMenuOpen(false)}
              variant="mobile"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-white p-2 shadow-sm">
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={classNames(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-all",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface hover:bg-surface-container-low hover:text-primary"
                )}
              >
                <span
                  className={classNames(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    pathname === link.href
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-container text-on-surface-variant"
                  )}
                >
                  <MaterialIcon
                    name={link.href === "/services" ? "volunteer_activism" : "mail"}
                    className="text-lg"
                  />
                </span>
                {link.label}
              </Link>
            ))}
            {hashLinks.map((link) => (
              <Link
                key={link.hash}
                href={link.href}
                onClick={(e) => handleHashLink(e, link.href, link.hash)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-on-surface transition-all hover:bg-surface-container-low hover:text-primary"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                  <MaterialIcon name="help" className="text-lg" />
                </span>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
