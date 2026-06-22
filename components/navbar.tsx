"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/products";
import { seoCategories } from "@/lib/seo-data";

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
];

const hashLinks = [
  { label: "Tarifs", hash: "tarifs" },
  { label: "FAQ", hash: "faq" },
  { label: "Contact", hash: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleHashLink = (e: React.MouseEvent, hash: string) => {
    setMobileMenuOpen(false);
    const id = hash.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isMaterialActive =
    pathname === "/" ||
    pathname === "/location-materiel-medical-agadir" ||
    seoCategories.some((c) => pathname === `/${c.slug}`) ||
    pathname.startsWith("/produits");

  return (
    <header
      aria-label="Navigation principale"
      className="fixed left-0 top-0 z-50 h-16 w-full border-b border-outline-variant/50 bg-background/95 shadow-sm backdrop-blur-md md:h-20"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link
            href="/"
            className="font-heading text-xl font-bold text-primary sm:text-2xl"
          >
            MediDomicile.ma
          </Link>

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
                  <Link
                    href="/location-materiel-medical-agadir"
                    className="flex items-center gap-3 border-b border-outline-variant/30 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-surface-container-low"
                  >
                    <MaterialIcon name="location_on" />
                    Tous les matériels — Agadir
                  </Link>
                  {seoCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/${category.slug}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low hover:text-primary"
                    >
                      <MaterialIcon name={category.icon} />
                      {category.label}
                    </Link>
                  ))}
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

            {hashLinks.map((link) => {
              const hash = `#${link.hash}`;
              return (
                <a
                  key={link.hash}
                  href={hash}
                  onClick={(e) => handleHashLink(e, hash)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Accès%20Mon%20Espace%20MediDomicile`}
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
          <Link
            href="/location-materiel-medical-agadir"
            onClick={() => setMobileMenuOpen(false)}
            className={classNames(
              "rounded-lg px-4 py-3 text-base font-medium transition-colors",
              pathname === "/location-materiel-medical-agadir"
                ? "bg-primary/10 text-primary"
                : "text-on-surface hover:bg-surface-container hover:text-primary"
            )}
          >
            Tous les matériels
          </Link>
          {seoCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className={classNames(
                "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                pathname === `/${category.slug}`
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface hover:bg-surface-container hover:text-primary"
              )}
            >
              {category.label}
            </Link>
          ))}
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={classNames(
              "rounded-lg px-4 py-3 text-base font-medium transition-colors",
              pathname === "/services"
                ? "bg-primary/10 text-primary"
                : "text-on-surface hover:bg-surface-container hover:text-primary"
            )}
          >
            Services
          </Link>
          {hashLinks.map((link) => {
            const hash = `#${link.hash}`;
            return (
              <a
                key={link.hash}
                href={hash}
                onClick={(e) => handleHashLink(e, hash)}
                className="rounded-lg px-4 py-3 text-base font-medium text-on-surface transition-colors hover:bg-surface-container hover:text-primary"
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Accès%20Mon%20Espace%20MediDomicile`}
            className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-on-primary"
          >
            Mon Espace
          </a>
        </nav>
      </div>
    </header>
  );
}
