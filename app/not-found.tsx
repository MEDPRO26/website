import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { SITE_NAME } from "@/lib/brand";
import { venteCityPath } from "@/lib/routes";

export const metadata: Metadata = {
  title: `Page introuvable | ${SITE_NAME}`,
  robots: {
    index: false,
    follow: true,
  },
};

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

const shortcuts = [
  {
    href: "/",
    label: "Accueil",
    description: "Retour au site SOS Santé",
    icon: "home",
  },
  {
    href: venteCityPath(),
    label: "Catalogue",
    description: "Matériel médical en vente",
    icon: "medical_services",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Une question ? Écrivez-nous",
    icon: "support_agent",
  },
] as const;

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative flex-1 overflow-hidden pb-24 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(50,160,243,0.18),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(116,119,130,0.12),transparent_50%),linear-gradient(180deg,#f7f8fb_0%,#eef3f9_48%,#f7f8fb_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(71,75,86,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(71,75,86,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
        />

        <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="font-heading mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {SITE_NAME}
            </p>

            <p
              className="font-heading select-none text-[7.5rem] font-bold leading-none tracking-tight text-primary/15 sm:text-[10rem] md:text-[11rem]"
              aria-hidden="true"
            >
              404
            </p>

            <h1 className="font-heading -mt-6 text-3xl font-bold tracking-tight text-secondary sm:-mt-8 sm:text-4xl md:text-5xl">
              Page introuvable
            </h1>
            <p className="font-body mt-4 max-w-lg text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Le lien que vous avez suivi n&apos;existe pas ou a été déplacé.
              Revenez à l&apos;accueil ou explorez nos services.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(50,160,243,0.28)] transition hover:-translate-y-0.5 hover:opacity-95"
              >
                <MaterialIcon name="arrow_back" className="text-xl" />
                Retour à l&apos;accueil
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-outline-variant/50 bg-white/80 px-6 text-sm font-semibold text-secondary backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
              >
                Nous contacter
              </Link>
            </div>

            <nav
              aria-label="Raccourcis utiles"
              className="mt-14 grid w-full gap-3 sm:grid-cols-3 sm:gap-4"
            >
              {shortcuts.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col items-start rounded-2xl border border-outline-variant/30 bg-white/70 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
                >
                  <span className="mb-3 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <MaterialIcon name={item.icon} className="text-xl" />
                  </span>
                  <span className="font-heading text-base font-semibold text-secondary">
                    {item.label}
                  </span>
                  <span className="font-body mt-1 text-sm text-on-surface-variant">
                    {item.description}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
