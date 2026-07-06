import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal-page-layout";
import { SITE_FULL_NAME, SITE_NAME } from "@/lib/brand";
import { LEGAL_ROUTES } from "@/lib/legal-routes";
import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/products";

export const metadata: Metadata = {
  title: `Conditions générales d'utilisation et de services | ${SITE_NAME}`,
  description: `Conditions générales d'utilisation et de services de ${SITE_FULL_NAME} : devis, vente, location de matériel médical et mise en relation avec des prestataires.`,
  alternates: { canonical: LEGAL_ROUTES.conditions },
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ConditionsGeneralesPage() {
  return (
    <LegalPageLayout
      title="Conditions générales d'utilisation et de services"
      breadcrumbLabel="Conditions générales"
      intro={`Les présentes Conditions Générales régissent l'utilisation du site internet ${SITE_NAME} ainsi que les demandes de devis, d'information, de mise en relation, de vente, de location de matériel médical et, le cas échéant, les demandes de services d'aide à domicile, d'accompagnement, de soins à domicile, de kinésithérapie, de transport sanitaire ou de prestations similaires proposées directement ou par l'intermédiaire de prestataires partenaires.

Le site est exploité sous la marque ${SITE_FULL_NAME}.

Contact : ${CONTACT_EMAIL}
Téléphone / WhatsApp : ${PHONE_DISPLAY}`}
      sections={[
        {
          title: "1. Objet des Conditions Générales",
          content: (
            <>
              <p>
                Les présentes Conditions Générales ont pour objet de définir les
                conditions dans lesquelles les utilisateurs peuvent consulter le
                site {SITE_NAME}, demander des informations, obtenir un devis,
                passer une commande, louer ou acheter du matériel médical, ou être
                mis en relation avec des prestataires indépendants intervenant dans
                le domaine du matériel médical, de l&apos;aide à domicile, du
                transport sanitaire, de la kinésithérapie, des soins à domicile ou
                de l&apos;assistance aux personnes.
              </p>
              <p>
                {SITE_NAME} a pour mission principale de faciliter l&apos;accès des
                familles et des patients à des solutions adaptées, notamment par
                l&apos;information, l&apos;orientation, la mise en relation avec
                des prestataires partenaires et, le cas échéant, la vente ou la
                location directe de certains produits ou matériels.
              </p>
            </>
          ),
        },
        {
          title: "2. Acceptation des Conditions Générales",
          content: (
            <>
              <p>
                Toute utilisation du site, toute demande de devis, de
                renseignement, de commande, de location, de livraison,
                d&apos;installation ou de mise en relation implique
                l&apos;acceptation pleine et entière des présentes Conditions
                Générales.
              </p>
              <p>
                L&apos;utilisateur reconnaît avoir pris connaissance des
                présentes Conditions Générales avant toute validation de demande
                ou de commande.
              </p>
              <p>
                {SITE_NAME} se réserve le droit de modifier les présentes
                Conditions Générales à tout moment. La version applicable est
                celle en vigueur au jour de la demande, du devis ou de la
                commande.
              </p>
            </>
          ),
        },
        {
          title: "3. Nature de l'activité de SOS Santé",
          content: (
            <>
              <p>{SITE_NAME} peut intervenir selon deux modes distincts :</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  En qualité d&apos;intermédiaire ou de plateforme de mise en
                  relation entre le client et des prestataires tiers
                  indépendants, notamment fournisseurs de matériel médical,
                  infirmiers, aides à domicile, kinésithérapeutes, ambulanciers,
                  sociétés de transport sanitaire ou autres intervenants
                  spécialisés.
                </li>
                <li>
                  En qualité de vendeur, loueur ou prestataire direct, uniquement
                  lorsque cela est expressément indiqué par écrit dans le devis,
                  la facture, la confirmation de commande ou tout autre document
                  contractuel.
                </li>
              </ol>
              <p>
                Sauf mention contraire expresse et écrite, {SITE_NAME} agit
                principalement comme plateforme d&apos;information,
                d&apos;orientation et de mise en relation.
              </p>
            </>
          ),
        },
        {
          title: "4. Absence de qualité d'établissement de santé",
          content: (
            <>
              <p>
                {SITE_NAME} n&apos;est pas une clinique, un hôpital, un cabinet
                médical, un cabinet infirmier, un service d&apos;ambulance, une
                société de transport sanitaire, ni un établissement de santé au
                sens strict, sauf autorisation ou mention contraire expresse.
              </p>
              <p>
                {SITE_NAME} ne réalise pas d&apos;actes médicaux, ne pose pas de
                diagnostic médical, ne prescrit pas de traitement, ne remplace pas
                un médecin, un pharmacien, un infirmier, un kinésithérapeute ou
                tout autre professionnel de santé habilité.
              </p>
              <p>
                Les informations présentes sur le site sont fournies à titre
                informatif et ne constituent en aucun cas un avis médical, un
                diagnostic, une prescription ou une recommandation thérapeutique
                personnalisée.
              </p>
              <p>
                En cas d&apos;urgence médicale, l&apos;utilisateur doit
                contacter les services d&apos;urgence compétents ou se rendre
                dans l&apos;établissement de santé le plus proche.
              </p>
            </>
          ),
        },
        {
          title: "5. Produits, matériels et informations disponibles sur le site",
          content: (
            <>
              <p>
                Le site peut présenter différents produits et matériels médicaux,
                notamment mais sans s&apos;y limiter :
              </p>
              <BulletList
                items={[
                  "lits médicalisés",
                  "fauteuils roulants",
                  "concentrateurs d'oxygène",
                  "matelas anti-escarres",
                  "déambulateurs",
                  "chaises percées",
                  "matériel d'aide à la mobilité",
                  "matériel respiratoire",
                  "matériel de rééducation",
                  "accessoires médicaux ou paramédicaux",
                ]}
              />
              <p>
                Les fiches produits, photographies, descriptions,
                caractéristiques, disponibilités et indications sont fournies à
                titre informatif. Elles peuvent être modifiées ou mises à jour à
                tout moment.
              </p>
              <p>
                Certains produits ou matériels peuvent nécessiter un avis
                médical, une prescription médicale, une configuration spécifique
                ou l&apos;intervention d&apos;un professionnel compétent. Le
                client est tenu de respecter les recommandations du fabricant, du
                médecin, du pharmacien ou du professionnel de santé concerné.
              </p>
              <p>
                Les prix affichés comme « sur demande » ou « à partir de » font
                l&apos;objet d&apos;un devis personnalisé communiqué au client
                avant toute validation.
              </p>
            </>
          ),
        },
        {
          title: "6. Demandes de devis, commandes et confirmation",
          content: (
            <>
              <p>
                Toute demande effectuée via le site, WhatsApp, téléphone, email
                ou formulaire de contact constitue une demande d&apos;information
                ou de devis et non une commande définitive.
              </p>
              <p>
                Une commande, une location, une livraison, une installation ou
                une prestation n&apos;est considérée comme confirmée
                qu&apos;après accord clair entre les parties, notamment par
                email, WhatsApp, facture, devis signé, confirmation écrite ou tout
                autre moyen convenu.
              </p>
              <p>La confirmation peut préciser :</p>
              <BulletList
                items={[
                  "le produit ou service demandé",
                  "le prix",
                  "les frais de livraison ou d'installation",
                  "la durée de location, le cas échéant",
                  "le montant de la caution, le cas échéant",
                  "les modalités de paiement",
                  "le nom du fournisseur ou du prestataire, si la prestation est réalisée par un tiers",
                  "les délais estimés",
                  "les conditions particulières applicables",
                ]}
              />
              <p>
                {SITE_NAME} se réserve le droit de refuser ou d&apos;annuler toute
                demande ou commande en cas d&apos;indisponibilité, d&apos;erreur
                manifeste, de fausse information, de suspicion de fraude,
                d&apos;impossibilité logistique, ou lorsque la demande ne
                correspond pas à ses capacités ou à celles de ses partenaires.
              </p>
            </>
          ),
        },
        {
          title: "7. Vente, location et livraison de matériel médical",
          content: (
            <>
              <p>
                Lorsque {SITE_NAME} agit comme vendeur ou loueur direct, les
                conditions de vente, de location, de garantie, de livraison,
                d&apos;installation, d&apos;entretien, de caution et de retour
                sont précisées dans le devis, la facture ou la confirmation
                écrite.
              </p>
              <p>
                Lorsque le matériel est vendu, loué, livré, installé ou entretenu
                par un fournisseur partenaire indépendant, la responsabilité
                relative à la disponibilité, à la conformité, à la qualité, à
                l&apos;état du matériel, à la garantie, à la livraison, à
                l&apos;installation, au service après-vente et à l&apos;entretien
                incombe au fournisseur concerné.
              </p>
              <p>
                Le client reconnaît que les conditions propres du fournisseur
                partenaire peuvent s&apos;appliquer, notamment en matière de prix,
                caution, durée de location, livraison, installation, retour,
                annulation, remplacement, garantie et service après-vente.
              </p>
              <p>
                {SITE_NAME} peut faciliter la communication entre le client et le
                fournisseur partenaire, sans se substituer à ce dernier ni
                assumer une responsabilité qui ne lui incombe pas.
              </p>
            </>
          ),
        },
        {
          title: "8. Utilisation du matériel médical",
          content: (
            <>
              <p>
                Le client s&apos;engage à utiliser le matériel médical
                conformément à sa destination, aux instructions du fabricant, aux
                recommandations du fournisseur, et, le cas échéant, aux
                indications du professionnel de santé compétent.
              </p>
              <p>
                Le client est responsable de l&apos;utilisation du matériel après
                sa réception, sauf défaut établi imputable au vendeur, au loueur
                ou au fournisseur responsable.
              </p>
              <p>{SITE_NAME} ne peut être tenue responsable :</p>
              <BulletList
                items={[
                  "d'une mauvaise utilisation du matériel",
                  "d'une utilisation contraire aux recommandations du fabricant",
                  "d'une utilisation sans avis médical lorsque celui-ci est nécessaire",
                  "d'une mauvaise manipulation par le client ou un tiers",
                  "d'un défaut d'entretien ou de conservation",
                  "d'une installation modifiée par le client ou par un tiers non autorisé",
                  "de dommages indirects résultant de l'utilisation du matériel",
                ]}
              />
              <p>
                Tout problème constaté lors de la réception du matériel doit être
                signalé immédiatement à {SITE_NAME} ou au fournisseur concerné,
                avec photos ou preuves utiles lorsque cela est possible.
              </p>
            </>
          ),
        },
        {
          title: "9. Services à domicile et prestataires indépendants",
          content: (
            <>
              <p>
                Certains services peuvent être proposés par l&apos;intermédiaire de
                prestataires indépendants, notamment :
              </p>
              <BulletList
                items={[
                  "aide à domicile",
                  "garde malade",
                  "accompagnement de personnes âgées",
                  "soins infirmiers à domicile",
                  "kinésithérapie à domicile",
                  "transport sanitaire ou accompagnement non urgent",
                  "assistance après hospitalisation",
                  "autres prestations liées au maintien à domicile",
                ]}
              />
              <p>
                Sauf mention contraire expresse et écrite, ces prestations sont
                réalisées par des prestataires tiers indépendants, sous leur
                propre responsabilité professionnelle, administrative, civile et,
                le cas échéant, pénale.
              </p>
              <p>
                {SITE_NAME} ne constitue pas l&apos;employeur direct des
                infirmiers, aides à domicile, kinésithérapeutes, ambulanciers,
                chauffeurs, accompagnateurs ou autres intervenants proposés, sauf
                stipulation contraire expresse et écrite.
              </p>
              <p>Chaque prestataire demeure seul responsable :</p>
              <BulletList
                items={[
                  "de ses autorisations professionnelles",
                  "de ses diplômes ou qualifications",
                  "de ses assurances",
                  "de ses actes",
                  "de ses omissions",
                  "de ses horaires",
                  "de son comportement",
                  "de la qualité et de la conformité de sa prestation",
                  "de ses obligations légales et professionnelles",
                ]}
              />
            </>
          ),
        },
        {
          title: "10. Vérification de l'identité de l'intervenant par le client",
          content: (
            <>
              <p>
                Avant toute intervention à domicile, le client doit vérifier
                l&apos;identité de la personne qui se présente à son domicile.
              </p>
              <p>
                Le client doit notamment demander une carte nationale
                d&apos;identité ou tout document professionnel utile et vérifier
                que le nom de l&apos;intervenant correspond aux informations
                communiquées préalablement par {SITE_NAME} ou par le prestataire
                partenaire.
              </p>
              <p>
                En cas de doute sur l&apos;identité, le comportement, la
                qualification ou la qualité de l&apos;intervenant, le client doit
                refuser l&apos;intervention et contacter immédiatement {SITE_NAME}{" "}
                ou le prestataire concerné.
              </p>
              <p>
                Le client reconnaît que l&apos;accès à son domicile relève de sa
                décision et de sa vigilance personnelle.
              </p>
              <p>
                {SITE_NAME} ne saurait être tenue responsable si le client accepte
                l&apos;intervention d&apos;une personne dont l&apos;identité
                n&apos;a pas été vérifiée ou qui ne correspond pas aux
                informations communiquées.
              </p>
            </>
          ),
        },
        {
          title: "11. Responsabilité liée aux prestations réalisées par des tiers",
          content: (
            <>
              <p>
                Lorsque la prestation est réalisée par un prestataire tiers
                indépendant, {SITE_NAME} intervient uniquement comme facilitateur,
                intermédiaire ou plateforme de mise en relation.
              </p>
              <p>
                {SITE_NAME} ne saurait être tenue responsable des actes, omissions,
                retards, fautes professionnelles, comportements, accidents,
                dommages, pertes, litiges ou incidents survenant entre le client
                et le prestataire ou l&apos;intervenant tiers.
              </p>
              <p>
                En cas de réclamation liée à une prestation exécutée par un
                tiers, {SITE_NAME} pourra, dans la mesure du possible, faciliter
                l&apos;échange entre le client et le prestataire concerné, sans se
                substituer à ce dernier ni reconnaître une responsabilité qui ne
                lui incombe pas.
              </p>
              <p>
                Le client reconnaît que toute intervention médicale,
                paramédicale, d&apos;aide à domicile, de transport sanitaire ou
                d&apos;accompagnement peut être soumise aux conditions propres du
                prestataire partenaire.
              </p>
            </>
          ),
        },
        {
          title: "12. Responsabilité générale de SOS Santé",
          content: (
            <>
              <p>
                La responsabilité de {SITE_NAME} est limitée à ses propres
                obligations, selon le rôle expressément confirmé dans le devis, la
                facture ou la confirmation écrite.
              </p>
              <p>
                Lorsque {SITE_NAME} agit comme intermédiaire, sa responsabilité
                est limitée à l&apos;information, l&apos;orientation et la
                transmission de la demande au prestataire concerné.
              </p>
              <p>
                Lorsque {SITE_NAME} agit comme vendeur, loueur ou prestataire
                direct, sa responsabilité est limitée aux obligations légales et
                contractuelles applicables à cette vente, location ou prestation
                directe.
              </p>
              <p>{SITE_NAME} ne peut être tenue responsable :</p>
              <BulletList
                items={[
                  "des informations inexactes communiquées par le client",
                  "du refus d'un prestataire de prendre en charge une demande",
                  "de l'indisponibilité d'un produit ou d'un intervenant",
                  "du retard d'un prestataire indépendant",
                  "d'un cas de force majeure",
                  "d'un dommage indirect, perte d'exploitation, perte d'opportunité ou préjudice moral indirect",
                  "d'un usage inadapté du matériel ou du service demandé",
                ]}
              />
            </>
          ),
        },
        {
          title: "13. Devoirs du client",
          content: (
            <>
              <p>
                Le client s&apos;engage à fournir des informations exactes,
                complètes et actualisées lors de sa demande, notamment :
              </p>
              <BulletList
                items={[
                  "nom et prénom",
                  "numéro de téléphone",
                  "adresse ou ville d'intervention",
                  "nature du besoin",
                  "urgence éventuelle",
                  "informations nécessaires à la livraison, à l'installation ou à l'intervention",
                ]}
              />
              <p>
                Le client s&apos;engage à ne pas utiliser le site pour des demandes
                frauduleuses, abusives, illégales ou contraires aux bonnes mœurs.
              </p>
              <p>
                Le client reste libre d&apos;accepter ou de refuser tout devis,
                toute proposition de fournisseur, toute intervention, tout matériel
                ou toute prestation proposés.
              </p>
            </>
          ),
        },
        {
          title: "14. Prix, paiement et commissions",
          content: (
            <>
              <p>
                Les prix des produits, locations ou prestations sont communiqués au
                client avant confirmation, selon les informations disponibles au
                moment de la demande.
              </p>
              <p>
                Lorsque le service est réalisé par un prestataire partenaire, le
                prix final peut être fixé par ce prestataire. {SITE_NAME} peut
                percevoir, selon les cas, une commission, des frais de mise en
                relation, des frais de service, ou une rémunération commerciale
                convenue avec le prestataire partenaire.
              </p>
              <p>
                Ces frais ne constituent pas un acte médical et rémunèrent
                uniquement le service d&apos;information, d&apos;orientation, de
                coordination ou de mise en relation, sauf mention contraire.
              </p>
              <p>
                Les modalités de paiement, d&apos;acompte, de solde, de caution
                ou de remboursement sont précisées lors de la confirmation du
                devis ou de la commande.
              </p>
            </>
          ),
        },
        {
          title: "15. Annulation, indisponibilité et modification",
          content: (
            <>
              <p>
                Toute annulation ou modification de commande, de location, de
                livraison ou d&apos;intervention doit être communiquée dans les
                meilleurs délais.
              </p>
              <p>
                Des frais peuvent être appliqués en cas d&apos;annulation
                tardive, de déplacement déjà effectué, de matériel réservé, de
                prestation engagée ou de conditions particulières prévues par le
                fournisseur ou le prestataire partenaire.
              </p>
              <p>
                En cas d&apos;indisponibilité d&apos;un produit ou d&apos;un
                prestataire, {SITE_NAME} peut proposer une alternative, sans
                obligation de résultat.
              </p>
            </>
          ),
        },
        {
          title: "16. Réclamations",
          content: (
            <>
              <p>
                Toute réclamation doit être adressée à {SITE_NAME} par téléphone,
                WhatsApp ou email, en précisant :
              </p>
              <BulletList
                items={[
                  "le nom du client",
                  "la date de la demande",
                  "le produit ou service concerné",
                  "le nom du fournisseur ou intervenant, le cas échéant",
                  "la nature du problème",
                  "les preuves disponibles, notamment photos, messages, devis ou factures",
                ]}
              />
              <p>
                {SITE_NAME} s&apos;efforcera de traiter les réclamations dans un
                délai raisonnable et, lorsque la réclamation concerne un
                prestataire tiers, de transmettre la réclamation au prestataire
                concerné.
              </p>
            </>
          ),
        },
        {
          title: "17. Données personnelles",
          content: (
            <>
              <p>
                Dans le cadre de ses activités, {SITE_NAME} peut collecter et
                traiter certaines données personnelles nécessaires au traitement
                des demandes, notamment nom, prénom, numéro de téléphone, adresse,
                ville, besoin exprimé, messages, informations de livraison et
                données utiles à la mise en relation.
              </p>
              <p>
                Certaines informations communiquées par le client peuvent être
                sensibles ou liées à l&apos;état de santé, notamment lorsqu&apos;elles
                concernent une hospitalisation, un handicap, une perte de mobilité,
                un besoin d&apos;oxygène, de soins ou d&apos;assistance à domicile.
              </p>
              <p>
                Ces données sont utilisées uniquement pour répondre à la demande du
                client, établir un devis, organiser une livraison, transmettre la
                demande à un prestataire partenaire, assurer le suivi de la
                prestation ou respecter les obligations légales applicables.
              </p>
              <p>
                Le client reconnaît que ses informations peuvent être transmises
                aux prestataires partenaires strictement nécessaires au traitement
                de sa demande.
              </p>
              <p>
                {SITE_NAME} s&apos;engage à traiter les données personnelles avec
                confidentialité et à mettre en œuvre des mesures raisonnables de
                protection.
              </p>
              <p>
                Le traitement des données personnelles est régi par la{" "}
                <a
                  href={LEGAL_ROUTES.privacy}
                  className="font-semibold text-primary hover:underline"
                >
                  politique de confidentialité
                </a>{" "}
                du site, établie conformément aux règles applicables au Maroc en
                matière de protection des données personnelles.
              </p>
            </>
          ),
        },
        {
          title: "18. Confidentialité",
          content: (
            <>
              <p>
                {SITE_NAME} s&apos;engage à ne pas divulguer les informations
                personnelles des clients à des tiers non concernés par la demande,
                sauf obligation légale, demande d&apos;une autorité compétente ou
                nécessité de traitement de la demande.
              </p>
              <p>
                Les prestataires partenaires auxquels des informations sont
                transmises doivent les utiliser uniquement pour répondre à la
                demande du client.
              </p>
            </>
          ),
        },
        {
          title: "19. Propriété intellectuelle",
          content: (
            <p>
              Le site {SITE_NAME}, sa marque, son logo, ses textes, photographies,
              visuels, contenus, fiches produits, éléments graphiques et éléments
              techniques sont protégés par les règles applicables en matière de
              propriété intellectuelle. Toute reproduction, modification,
              diffusion, utilisation commerciale ou exploitation non autorisée est
              interdite sans accord écrit préalable.
            </p>
          ),
        },
        {
          title: "20. Force majeure",
          content: (
            <p>
              {SITE_NAME} ne pourra être tenue responsable d&apos;un retard, d&apos;une
              inexécution ou d&apos;une impossibilité d&apos;exécution résultant
              d&apos;un événement indépendant de sa volonté, notamment catastrophe
              naturelle, accident, panne technique, indisponibilité d&apos;un
              fournisseur, rupture de stock, grève, restriction administrative,
              problème de transport, urgence sanitaire ou tout événement de force
              majeure reconnu par le droit applicable.
            </p>
          ),
        },
        {
          title: "21. Droit applicable",
          content: (
            <>
              <p>
                Les présentes Conditions Générales sont soumises au droit marocain.
              </p>
              <p>
                En cas de difficulté ou de litige, les parties s&apos;engagent à
                rechercher en priorité une solution amiable.
              </p>
              <p>
                À défaut de solution amiable, les tribunaux compétents du ressort
                d&apos;Agadir seront compétents, sous réserve des règles
                impératives applicables aux consommateurs.
              </p>
            </>
          ),
        },
        {
          title: "22. Contact",
          content: (
            <>
              <p>
                Pour toute question relative aux présentes Conditions Générales,
                à une commande, une location, une livraison, une prestation ou une
                demande de mise en relation, l&apos;utilisateur peut contacter{" "}
                {SITE_NAME} :
              </p>
              <p>
                Email : {CONTACT_EMAIL}
                <br />
                Téléphone / WhatsApp : {PHONE_DISPLAY}
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
