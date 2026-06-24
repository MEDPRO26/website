import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal-page-layout";
import { SITE_FULL_NAME, SITE_NAME } from "@/lib/brand";
import { LEGAL_ROUTES } from "@/lib/legal-routes";
import { CONTACT_EMAIL } from "@/lib/products";

export const metadata: Metadata = {
  title: `Politique de confidentialité | ${SITE_NAME}`,
  description: `Politique de protection des données personnelles de ${SITE_NAME} : collecte, utilisation et droits des utilisateurs au Maroc.`,
  alternates: { canonical: LEGAL_ROUTES.privacy },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      breadcrumbLabel="Confidentialité"
      intro={`${SITE_FULL_NAME} accorde une importance particulière à la protection de vos données personnelles. La présente politique décrit les informations que nous collectons, la manière dont nous les utilisons et vos droits, conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.`}
      sections={[
        {
          title: "1. Responsable du traitement",
          content: (
            <p>
              Le responsable du traitement est <strong>{SITE_FULL_NAME}</strong>.
              Pour toute question :{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          ),
        },
        {
          title: "2. Données collectées",
          content: (
            <>
              <p>Nous pouvons collecter notamment :</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Identité et coordonnées : nom, téléphone, email, ville</li>
                <li>
                  Informations liées à votre demande : matériel souhaité,
                  quantité, message, besoins médicaux généraux
                </li>
                <li>
                  Données techniques : adresse IP, type de navigateur, pages
                  consultées (à des fins de sécurité et de fonctionnement)
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "3. Finalités du traitement",
          content: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Répondre à vos demandes de devis, d&apos;information ou de commande</li>
              <li>Organiser la livraison et le suivi commercial</li>
              <li>Assurer le service client et la relation avec nos clients</li>
              <li>Respecter nos obligations légales et réglementaires</li>
              <li>Améliorer le fonctionnement et la sécurité du site</li>
            </ul>
          ),
        },
        {
          title: "4. Base légale",
          content: (
            <p>
              {`Les traitements reposent principalement sur l'exécution de mesures précontractuelles ou contractuelles, votre consentement lorsque requis, ainsi que sur l'intérêt légitime de ${SITE_NAME} à assurer la sécurité du site et la qualité du service.`}
            </p>
          ),
        },
        {
          title: "5. Destinataires des données",
          content: (
            <p>
              {`Vos données sont accessibles uniquement aux personnes habilitées au sein de ${SITE_NAME} et, le cas échéant, à nos prestataires techniques (hébergement, messagerie) dans la stricte limite de leurs missions. Nous ne vendons pas vos données personnelles.`}
            </p>
          ),
        },
        {
          title: "6. Durée de conservation",
          content: (
            <p>
              Les données sont conservées pendant la durée nécessaire à la
              gestion de la relation commerciale, puis archivées conformément
              aux délais légaux applicables ou supprimées lorsqu&apos;elles ne
              sont plus utiles.
            </p>
          ),
        },
        {
          title: "7. Vos droits",
          content: (
            <>
              <p>Conformément à la loi 09-08, vous disposez notamment des droits :</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>D&apos;accès à vos données</li>
                <li>De rectification des données inexactes</li>
                <li>D&apos;opposition, dans les limites prévues par la loi</li>
              </ul>
              <p>
                Pour exercer vos droits, écrivez à{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Exercice%20de%20mes%20droits%20-%20données%20personnelles`}
                  className="text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "8. Sécurité",
          content: (
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données contre l&apos;accès non
              autorisé, la perte ou l&apos;altération.
            </p>
          ),
        },
        {
          title: "9. Cookies",
          content: (
            <p>
              Pour plus d&apos;informations sur l&apos;utilisation des cookies,
              consultez notre{" "}
              <a
                href={LEGAL_ROUTES.cookies}
                className="font-semibold text-primary hover:underline"
              >
                politique de cookies
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
