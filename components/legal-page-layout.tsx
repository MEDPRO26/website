import type { ReactNode } from "react";
import Breadcrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { SITE_NAME } from "@/lib/brand";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageLayoutProps = {
  title: string;
  intro: string;
  breadcrumbLabel: string;
  sections: LegalSection[];
};

export default function LegalPageLayout({
  title,
  intro,
  breadcrumbLabel,
  sections,
}: LegalPageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: breadcrumbLabel },
              ]}
            />
          </div>
        </div>

        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              {SITE_NAME}
            </p>
            <h1 className="font-heading mb-4 text-3xl font-bold text-secondary sm:text-4xl">
              {title}
            </h1>
            <p className="font-body mb-10 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {intro}
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-heading mb-3 text-xl font-semibold text-secondary sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="font-body space-y-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-12 rounded-2xl border border-outline-variant/40 bg-surface-container-low px-5 py-4 text-sm text-on-surface-variant">
              Dernière mise à jour : juin 2026. Pour toute question, contactez-nous
              via la page{" "}
              <a href="/contact" className="font-semibold text-primary hover:underline">
                Contact
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
