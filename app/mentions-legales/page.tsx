import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal-page-layout";
import {
  SITE_ADDRESS,
  SITE_FULL_NAME,
  SITE_NAME,
  SITE_URL_DEFAULT,
  SITE_WEBSITE,
} from "@/lib/brand";
import { LEGAL_ROUTES } from "@/lib/legal-routes";
import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/products";

export const metadata: Metadata = {
  title: `Mentions légales | ${SITE_NAME}`,
  description: `Mentions légales du site ${SITE_WEBSITE} : éditeur, hébergement et coordonnées de ${SITE_FULL_NAME}.`,
  alternates: { canonical: LEGAL_ROUTES.mentions },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout
      title="Mentions légales"
      breadcrumbLabel="Mentions légales"
      intro={`Conformément aux usages en vigueur au Maroc, les présentes mentions légales précisent l'identité de l'éditeur du site ${SITE_WEBSITE} et les informations essentielles relatives à son exploitation.`}
      sections={[
        {
          title: "Éditeur du site",
          content: (
            <>
              <p>
                <strong>{SITE_FULL_NAME}</strong>
              </p>
              <p>Siège social : {SITE_ADDRESS}</p>
              <p>
                Site web :{" "}
                <a href={SITE_URL_DEFAULT} className="text-primary hover:underline">
                  {SITE_WEBSITE}
                </a>
              </p>
              <p>
                Email :{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>Téléphone : {PHONE_DISPLAY}</p>
              <p>
                Activité : vente et location de matériel médical, services de
                santé et d&apos;aide à domicile au Maroc.
              </p>
            </>
          ),
        },
        {
          title: "Rôle d'intermédiaire",
          content: (
            <>
              <p>
                {`${SITE_NAME} agit en qualité d'intermédiaire entre le client et le fournisseur de matériel médical ou de services associés.`}
              </p>
              <p>
                {`Le site permet au client de formuler une demande (devis, achat, location ou information). ${SITE_NAME} transmet ensuite cette demande au fournisseur concerné, qui reste responsable de la disponibilité, de la conformité du matériel, des conditions de vente ou de location et de l'exécution de la prestation.`}
              </p>
              <p>
                {`Sauf mention contraire, ${SITE_NAME} n'est pas le fabricant ni le vendeur direct des produits présentés sur le catalogue.`}
              </p>
            </>
          ),
        },
        {
          title: "Directeur de la publication",
          content: (
            <p>
              Le directeur de la publication est le représentant légal de{" "}
              {SITE_FULL_NAME}.
            </p>
          ),
        },
        {
          title: "Hébergement",
          content: (
            <>
              <p>
                Le site est hébergé par <strong>Vercel Inc.</strong>
              </p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p>
                Site :{" "}
                <a
                  href="https://vercel.com"
                  className="text-primary hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  vercel.com
                </a>
              </p>
            </>
          ),
        },
        {
          title: "Propriété intellectuelle",
          content: (
            <p>
              L&apos;ensemble des éléments du site (textes, images, logos,
              graphismes, structure) est protégé par le droit de la propriété
              intellectuelle. Toute reproduction, représentation ou exploitation
              non autorisée est interdite.
            </p>
          ),
        },
        {
          title: "Limitation de responsabilité",
          content: (
            <p>
              {`${SITE_NAME} s'efforce d'assurer l'exactitude des informations publiées. Toutefois, le site peut contenir des inexactitudes ou omissions. L'utilisateur reconnaît utiliser les informations sous sa responsabilité exclusive.`}
            </p>
          ),
        },
      ]}
    />
  );
}
