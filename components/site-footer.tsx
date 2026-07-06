"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FooterContact, { FooterCopyright } from "@/components/footer-contact";
import FooterLegalLinks from "@/components/footer-legal-links";
import Logo from "@/components/logo";
import {
  footerCityLinks,
  getFooterContextFromPath,
} from "@/lib/footer-context";
import { activeCities } from "@/lib/cities";
import { venteCityPath } from "@/lib/routes";

const navigationLinks = [
  { label: "Accueil", href: "/" },
  { label: "Nos Services", href: "/services" },
  ...activeCities.map((city) => ({
    label: `Vente ${city.name}`,
    href: venteCityPath(city.slug),
  })),
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
];

type SiteFooterProps = {
  id?: string;
};

export default function SiteFooter({ id }: SiteFooterProps) {
  const pathname = usePathname();
  const context = getFooterContextFromPath(pathname ?? "/");
  const isNational = context.variant === "national";

  return (
    <footer
      id={id}
      className="bg-surface-container-highest px-4 pb-24 pt-14 sm:px-6 sm:pb-14 md:pb-14 lg:pt-20"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <Logo href="/" size="lg" className="mb-4" />
          <p className="font-heading mb-2 text-sm font-semibold text-on-surface sm:text-base">
            {context.brandTitle}
          </p>
          <p className="font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
            {context.description}
          </p>
          {isNational ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Nos villes
              </p>
              <ul className="space-y-1.5">
                {footerCityLinks.map((city) => (
                  <li key={city.href}>
                    <Link
                      href={city.href}
                      className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                    >
                      {city.label}
                      {!city.available ? " (bientôt)" : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div>
          <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
            Navigation
          </h4>
          <ul className="space-y-2">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <FooterLegalLinks contactHref="/contact" />
        <FooterContact context={context} />
        <FooterCopyright context={context} />
      </div>
    </footer>
  );
}
