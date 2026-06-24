import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal-page-layout";
import { SITE_FULL_NAME, SITE_NAME } from "@/lib/brand";
import { activeDeliveryCityLabel } from "@/lib/delivery-cities";
import { LEGAL_ROUTES } from "@/lib/legal-routes";
import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/products";

export const metadata: Metadata = {
  title: `Conditions générales | ${SITE_NAME}`,
  description: `Conditions générales d'utilisation et de vente de ${SITE_NAME} : commandes, livraison, garanties et responsabilités.`,
  alternates: { canonical: LEGAL_ROUTES.conditions },
};

export default function ConditionsGeneralesPage() {
  return (
    <LegalPageLayout
      title="Conditions générales"
      breadcrumbLabel="Conditions générales"
      intro={`Les présentes conditions générales régissent l'utilisation du site ${SITE_NAME} ainsi que les relations contractuelles liées à la vente et, le cas échéant, à la location de matériel médical et aux services proposés par ${SITE_FULL_NAME}.`}
      sections={[
        {
          title: "1. Objet",
          content: (
            <p>
              Le site permet de consulter notre catalogue, de demander un devis
              ou une information, et de passer commande de matériel médical.
              Certains services (location, soins à domicile) peuvent être proposés
              progressivement selon les zones couvertes.
            </p>
          ),
        },
        {
          title: "2. Acceptation",
          content: (
            <p>
              L&apos;utilisation du site et toute demande de devis ou commande
              impliquent l&apos;acceptation pleine et entière des présentes
              conditions générales.
            </p>
          ),
        },
        {
          title: "3. Produits et informations",
          content: (
            <>
              <p>
                Les fiches produits sont fournies à titre informatif. Les
                photographies, descriptions et caractéristiques peuvent être
                mises à jour sans préavis. La disponibilité est confirmée lors
                de la prise de contact avec notre équipe.
              </p>
              <p>
                Les prix affichés « sur demande » font l&apos;objet d&apos;un
                devis personnalisé communiqué avant validation de la commande.
              </p>
            </>
          ),
        },
        {
          title: "4. Commandes et devis",
          content: (
            <>
              <p>
                Une commande n&apos;est définitive qu&apos;après confirmation
                écrite (email, WhatsApp ou tout autre moyen convenu) et accord
                sur le prix, les délais et les conditions de livraison.
              </p>
              <p>
                {`${SITE_NAME} se réserve le droit de refuser ou d'annuler toute commande en cas d'indisponibilité, d'erreur manifeste ou de suspicion de fraude.`}
              </p>
            </>
          ),
        },
        {
          title: "5. Livraison",
          content: (
            <p>
              La livraison est assurée dans les zones actuellement desservies,
              notamment {activeDeliveryCityLabel}. Les délais, frais et modalités
              d&apos;installation sont précisés lors de la confirmation de
              commande.
            </p>
          ),
        },
        {
          title: "6. Paiement",
          content: (
            <p>
              Les modalités de paiement (acompte, solde, moyens acceptés) sont
              communiquées lors de la validation du devis. Aucun paiement ne
              engage définitivement le client sans confirmation préalable des
              conditions convenues.
            </p>
          ),
        },
        {
          title: "7. Garanties et conformité",
          content: (
            <p>
              Le matériel médical proposé est destiné à un usage conforme à sa
              destination et aux recommandations du fabricant. Les garanties
              légales et contractuelles applicables sont précisées sur le devis
              ou la facture.
            </p>
          ),
        },
        {
          title: "8. Responsabilité",
          content: (
            <p>
              {`${SITE_NAME} ne saurait être tenue responsable d'une utilisation non conforme du matériel, ni des dommages indirects. La responsabilité du site est limitée aux obligations légales applicables au Maroc.`}
            </p>
          ),
        },
        {
          title: "9. Données personnelles",
          content: (
            <p>
              Le traitement des données personnelles est décrit dans notre{" "}
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
          title: "10. Droit applicable et litiges",
          content: (
            <>
              <p>Les présentes conditions sont soumises au droit marocain.</p>
              <p>
                En cas de litige, une solution amiable sera recherchée en
                priorité. À défaut, les tribunaux compétents du ressort
                d&apos;Agadir seront seuls compétents, sous réserve des règles
                impératives applicables aux consommateurs.
              </p>
              <p>
                Contact : {CONTACT_EMAIL} — {PHONE_DISPLAY}
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
