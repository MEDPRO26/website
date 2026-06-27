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
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-container md:hidden"
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
          "absolute left-0 top-full w-full border-b border-outline-variant bg-background shadow-lg transition-all duration-300 md:hidden",
          mobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="flex flex-col p-4">
          <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Matériel
          </p>
          <MaterialDropdownLinks
            pathname={pathname}
            onNavigate={() => setMobileMenuOpen(false)}
            className="mb-2"
          />
          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={classNames(
                "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface hover:bg-surface-container hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          {hashLinks.map((link) => (
            <Link
              key={link.hash}
              href={link.href}
              onClick={(e) => handleHashLink(e, link.href, link.hash)}
              className="rounded-lg px-4 py-3 text-base font-medium text-on-surface transition-colors hover:bg-surface-container hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20SOS%20Sant%C3%A9%2C%20je%20souhaite%20des%20informations.`}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-status-success px-4 py-3 text-base font-semibold text-white"
          >
            <MaterialIcon name="chat" />
            WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Acc%C3%A8s%20Mon%20Espace%20SOS%20Sant%C3%A9`}
            className="rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-on-primary"
          >
            Mon Espace
          </a>
        </nav>
      </div>
    </header>
  );
}
