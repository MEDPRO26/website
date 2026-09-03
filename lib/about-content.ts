export const ABOUT_PATH = "/a-propos";

export const ABOUT_TITLE =
  "À propos de SOS Santé | Matériel médical et soins à domicile au Maroc";

export const ABOUT_DESCRIPTION =
  "SOS Santé a des locaux à Agadir et Casablanca : location, vente et livraison de matériel médical, et coordination avec des prestataires partenaires pour les soins à domicile.";

export const ABOUT_DEFINITION =
  "SOS Santé est une entreprise marocaine de matériel médical et de coordination de soins à domicile. Nous disposons d'un local opérationnel à Agadir (siège) et à Casablanca. Depuis ces locaux, nous gérons notre matériel, organisons les livraisons et coordonnons avec des prestataires partenaires.";

export const ABOUT_SHORT =
  "SOS Santé opère depuis des locaux à Agadir et Casablanca : livraison de matériel médical, et coordination avec des prestataires partenaires pour les soins à domicile.";

export const ABOUT_ROLE =
  "Nous ne sommes ni un hôpital, ni un cabinet médical, ni un service d'urgence vitale. Pour le matériel, nous opérons depuis nos locaux : préparation, livraison et installation. Pour les soins à domicile, nous qualifions votre demande et coordonnons avec des prestataires partenaires (kinésithérapeutes, infirmiers, médecins, aide-soignants, transporteurs sanitaires). Le prestataire reste responsable de l'exécution de sa prestation.";

export const ABOUT_OPERATIONS =
  "Nos locaux ne sont pas seulement une adresse : c'est là que nous stockons et préparons le matériel médical, organisons les tournées de livraison, et assurons le suivi avec les familles et les prestataires partenaires.";

export const SERVICES_HERO_INTRO =
  "Depuis nos locaux, SOS Santé coordonne la mise en relation avec des kinésithérapeutes, infirmiers, médecins, aide-soignants et transporteurs sanitaires partenaires. Nous organisons la demande : nous ne soignons pas directement.";

export function aboutCityEntity(cityName: string) {
  if (cityName === "Agadir") {
    return "SOS Santé Agadir dispose d'un local opérationnel (Lerac, Avenue Abderrahim Bouabid). Depuis ce local, nous gérons le matériel médical, la livraison et l'installation, et nous coordonnons avec des prestataires partenaires pour les soins à domicile. Nous ne sommes ni un hôpital ni un service d'urgence.";
  }
  if (cityName === "Casablanca") {
    return "SOS Santé Casablanca dispose d'un local opérationnel (Boulevard Anoual). Depuis ce local, nous gérons le matériel médical, la livraison et la coordination avec des prestataires partenaires. Nous ne sommes ni un hôpital ni un service d'urgence.";
  }
  return `SOS Santé ${cityName} organise la livraison de matériel médical et la mise en relation avec des prestataires partenaires, en lien avec nos locaux d'Agadir et de Casablanca. Nous ne sommes ni un hôpital ni un service d'urgence.`;
}

export function aboutCareEntity(cityName: string) {
  return `SOS Santé ${cityName} coordonne, depuis ses locaux opérationnels, la mise en relation avec des prestataires partenaires. Nous ne remplaçons pas un cabinet médical ni les urgences officielles.`;
}

export const ABOUT_FAQS = [
  {
    question: "Qu'est-ce que SOS Santé ?",
    answer:
      "SOS Santé est une entreprise marocaine de matériel médical et de coordination de soins à domicile. Nous avons un local à Agadir (siège) et à Casablanca. Nous livrons du matériel médical et travaillons avec des prestataires partenaires pour les soins à domicile à Agadir, Casablanca et Rabat.",
  },
  {
    question: "SOS Santé a-t-il un local physique ?",
    answer:
      "Oui. Notre siège et local opérationnel sont à Agadir (Lerac, Avenue Abderrahim Bouabid, 80000). Nous avons aussi un local à Casablanca (Boulevard Anoual, 20102). C'est depuis ces locaux que nous préparons le matériel, organisons les livraisons et coordonnons avec les prestataires partenaires.",
  },
  {
    question: "SOS Santé est-il un hôpital ou un cabinet médical ?",
    answer:
      "Non. SOS Santé ne soigne pas les patients directement. Nous opérons la livraison de matériel médical depuis nos locaux, et nous coordonnons la mise en relation avec des infirmiers, kinésithérapeutes, médecins, aide-soignants et transporteurs sanitaires partenaires.",
  },
  {
    question: "Dans quelles villes SOS Santé intervient-il ?",
    answer:
      "SOS Santé intervient aujourd'hui à Agadir, Casablanca et Rabat, avec des locaux opérationnels à Agadir et Casablanca. Marrakech et Tanger sont prévues. En cas d'urgence vitale, composez les numéros d'urgence officiels : SOS Santé n'est pas le SAMU.",
  },
  {
    question: "Comment fonctionne une demande chez SOS Santé ?",
    answer:
      "Vous nous contactez par WhatsApp, téléphone ou formulaire. Un conseiller qualifie le besoin (ville, matériel ou type de soin, délai). Pour le matériel, nous organisons la préparation et la livraison depuis nos locaux. Pour les soins, nous coordonnons avec un prestataire partenaire après confirmation de disponibilité et de tarif.",
  },
  {
    question: "Comment contacter SOS Santé ?",
    answer:
      "Par WhatsApp ou téléphone à Agadir (06 07 34 73 28) et Casablanca (06 03 13 58 88), par email à contact@sossante.ma, ou via le formulaire de contact. La coordination est joignable 7j/7.",
  },
] as const;

/** FAQ AEO for /contact: short answers for AI Overviews. */
export const CONTACT_FAQS = [
  ABOUT_FAQS[0],
  ABOUT_FAQS[1],
  ABOUT_FAQS[5],
  {
    question: "Quel est le délai de réponse de SOS Santé ?",
    answer:
      "En général, un conseiller SOS Santé vous répond sous 15 minutes par WhatsApp, téléphone ou email, 7j/7. Pour une urgence vitale, composez les numéros d'urgence officiels.",
  },
] as const;
