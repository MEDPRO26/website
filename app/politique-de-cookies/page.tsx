import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal-page-layout";
import { SITE_NAME, SITE_WEBSITE } from "@/lib/brand";
import { LEGAL_ROUTES } from "@/lib/legal-routes";
import { CONTACT_EMAIL } from "@/lib/products";

export const metadata: Metadata = {
  title: `Politique de cookies | ${SITE_NAME}`,
  description: `Politique de cookies du site ${SITE_WEBSITE} : types de cookies utilisés et gestion de vos préférences.`,
  alternates: { canonical: LEGAL_ROUTES.cookies },
};

export default function PolitiqueCookiesPage() {
  return (
    <LegalPageLayout
      title="Politique de cookies"
      breadcrumbLabel="Cookies"
      intro={`Cette page explique comment le site ${SITE_WEBSITE} utilise les cookies et technologies similaires, et comment vous pouvez gérer vos préférences.`}
      sections={[
        {
          title: "1. Qu'est-ce qu'un cookie ?",
          content: (
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal
              (ordinateur, tablette, smartphone) lors de la consultation d&apos;un
              site. Il permet notamment de mémoriser des informations techniques
              ou de préférences.
            </p>
          ),
        },
        {
          title: "2. Cookies utilisés sur notre site",
          content: (
            <>
              <p>
                {`À ce jour, ${SITE_NAME} utilise principalement des cookies strictement nécessaires au fonctionnement du site, par exemple pour :`}
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Assurer la navigation et la sécurité</li>
                <li>Mémoriser certaines préférences d&apos;affichage</li>
              </ul>
              <p>
                Si des outils de mesure d&apos;audience ou de marketing sont
                ajoutés ultérieurement (ex. Google Analytics), cette politique
                sera mise à jour et votre consentement sera recueilli lorsque la
                loi l&apos;exige.
              </p>
            </>
          ),
        },
        {
          title: "3. Cookies tiers",
          content: (
            <p>
              Des liens vers des services tiers (WhatsApp, réseaux sociaux) peuvent
              être présents sur le site. Ces services peuvent déposer leurs propres
              cookies lorsque vous les utilisez. Nous vous invitons à consulter
              leurs politiques respectives.
            </p>
          ),
        },
        {
          title: "4. Gestion des cookies",
          content: (
            <>
              <p>Vous pouvez à tout moment :</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Configurer votre navigateur pour accepter, refuser ou supprimer
                  les cookies
                </li>
                <li>
                  Supprimer les cookies déjà enregistrés via les paramètres de
                  votre appareil
                </li>
              </ul>
              <p>
                Le refus de certains cookies peut limiter certaines
                fonctionnalités du site.
              </p>
            </>
          ),
        },
        {
          title: "5. Données personnelles",
          content: (
            <p>
              Pour en savoir plus sur le traitement de vos données, consultez
              notre{" "}
              <a
                href={LEGAL_ROUTES.privacy}
                className="font-semibold text-primary hover:underline"
              >
                politique de confidentialité
              </a>
              .
            </p>
          ),
        },
        {
          title: "6. Contact",
          content: (
            <p>
              Pour toute question relative aux cookies :{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Question%20cookies`}
                className="text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          ),
        },
      ]}
    />
  );
}
