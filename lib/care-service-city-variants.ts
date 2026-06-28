import type { CareServiceResolvedSeo } from "@/lib/care-service-seo";
import type { CitySlug } from "@/lib/cities";

export type CareServiceCityContentVariant = CareServiceResolvedSeo & {
  extendedFaqs: { question: string; answer: string }[];
};

const rabatVariants: Record<string, CareServiceCityContentVariant> = {
  "kinesitherapie-a-domicile": {
    heroSubheadline:
      "À Rabat, SOS Santé vous connecte avec des masseurs-kinésithérapeutes partenaires pour des séances à domicile : rééducation orthopédique, respiratoire, neurologique ou pédiatrique, selon les disponibilités.",
    seoIntroHeading: "Kinésithérapie à Rabat : rééducation chez vous, sans contrainte",
    seoIntro:
      "Vous habitez Rabat, Salé ou Temara et cherchez un kiné qui se déplace ? SOS Santé centralise votre demande et vous oriente vers un kinésithérapeute partenaire disponible dans la région de Rabat-Salé-Kénitra. Rééducation après accident, chirurgie, AVC ou simple renforcement musculaire : bénéficiez d'un suivi adapté à votre domicile, avec des tarifs annoncés avant la première séance.",
    whyChoose: [
      {
        number: "01",
        title: "Réactivité locale",
        text: "Notre cellule de coordination à Rabat traite les demandes en continu et cherche un créneau compatible avec votre quartier — Hay Riad, Agdal, Souissi, Salé ou Temara.",
      },
      {
        number: "02",
        title: "Réseau vérifié",
        text: "Les kinésithérapeutes que nous recommandons à Rabat sont diplômés d'État, habitués aux séances à domicile et sélectionnés pour leur sérieux clinique.",
      },
      {
        number: "03",
        title: "Intervention de proximité",
        text: "Limiter les trajets vers un cabinet : c'est l'objectif de notre service kiné à domicile dans l'agglomération rabat-Salé-Témara.",
      },
    ],
    valueProps: [
      {
        title: "Parcours de rééducation suivi",
        text: "Votre programme de kinésithérapie à Rabat est réévalué à chaque étape pour ajuster exercices, fréquence et objectifs de récupération.",
        accent: "mint",
      },
      {
        title: "Praticiens expérimentés",
        text: "Nous privilégions des kinés partenaires habitués aux pathologies courantes à Rabat : lombalgies, entorses, rééducation post-prothèse, BPCO.",
        accent: "lavender",
      },
      {
        title: "Sécurité du patient",
        text: "Avant chaque séance à domicile, l'état du patient est évalué et les exercices sont modulés en fonction de sa fatigue et de son environnement.",
        accent: "peach",
      },
      {
        title: "Plan individualisé",
        text: "Chaque protocole tient compte de votre logement, de vos escaliers et de vos objectifs — retour au travail, marche autonome ou douleur chronique.",
        accent: "rose",
      },
      {
        title: "Devis clair dès la demande",
        text: "À Rabat, le tarif par séance ou par forfait vous est communiqué avant validation. Pas de mauvaise surprise après l'intervention.",
        accent: "sky",
      },
    ],
    expertise: {
      title: "Un réseau de kinésithérapeutes couvrant Rabat et environs",
      paragraphs: [
        "Notre équipe de coordination à Rabat identifie le profil de kinésithérapeute le plus adapté : rééducation du membre inférieur, épaule, colonne vertébrale, rééducation respiratoire ou prise en charge neurologique.",
        "Travailler dans votre salon ou votre chambre permet d'intégrer des exercices fonctionnels concrets — se lever du lit, monter quelques marches, s'asseoir sur une chaise — directement dans votre cadre de vie.",
      ],
      bullets: [
        "Rééducation post-chirurgicale à Rabat",
        "Kinésithérapie respiratoire à Salé et Temara",
        "Rééducation vestibulaire et équilibre",
        "Kiné pédiatrique à domicile",
        "Renforcement musculaire et prévention des chutes",
      ],
    },
    benefits: [
      {
        title: "Éviter les déplacements pénibles",
        paragraphs: [
          "Pour un senior à Souissi ou un patient convalescent à Hay Riad, recevoir le kiné à domicile supprime le stress du transport et favorise une récupération plus sereine.",
        ],
      },
      {
        title: "Créneaux adaptés à votre rythme",
        paragraphs: [
          "Matinée, fin de journée ou week-end : nous cherchons un horaire qui convient à votre famille et au professionnel disponible dans la région de Rabat.",
        ],
      },
      {
        title: "Relation directe avec le praticien",
        paragraphs: [
          "Le kinésithérapeute observe votre quotidien réel à Rabat et ajuste les consignes en direct. Vos proches peuvent aussi être impliqués dans les exercices de maintien.",
        ],
      },
    ],
    specialties: [
      {
        title: "Prise en charge rapide à Rabat",
        paragraphs: [
          "Certaines situations demandent une rééducation précoce. Contactez SOS Santé par WhatsApp en précisant votre quartier à Rabat : nous tentons de vous orienter rapidement vers un kiné partenaire disponible.",
          "Rappel important : en cas d'urgence vitale, composez les numéros d'urgence officiels. SOS Santé coordonne des soins programmés ou semi-urgents à domicile.",
        ],
      },
      {
        title: "Rééducation respiratoire dans la région de Rabat",
        paragraphs: [
          "Pour les patients BPCO, asthmatiques ou en sortie d'hospitalisation pulmonaire, le kiné respiratoire intervient à domicile pour enseigner les techniques de toux, l'utilisation d'inhalateurs et les exercices de renforcement.",
        ],
      },
      {
        title: "Troubles de l'équilibre et vertiges",
        paragraphs: [
          "Après une otite, un AVC léger ou des chutes répétées, des exercices vestibulaires ciblés à domicile aident à retrouver une marche plus stable dans les rues et les escaliers de Rabat.",
        ],
      },
      {
        title: "Kinésithérapie pour nourrissons et enfants",
        paragraphs: [
          "Torticolis, plagiocéphalie ou retard moteur : une prise en charge à domicile rassure l'enfant et facilite la régularité des séances pour les parents actifs de Rabat et Temara.",
        ],
      },
    ],
    trust: {
      title: "SOS Santé, votre interlocuteur de confiance à Rabat",
      paragraphs: [
        "SOS Santé Rabat est un service de coordination : nous facilitons la mise en relation avec des professionnels de santé à domicile, sans remplacer un établissement hospitalier ni les services d'urgence.",
        "De la prise de contact à la confirmation du rendez-vous, nous restons transparents sur les délais, les disponibilités et les tarifs communiqués par les praticiens partenaires.",
      ],
    },
    community: {
      title: "Des soins humains, pensés pour les familles de Rabat",
      paragraphs: [
        "Nous croyons qu'une bonne rééducation combine compétence médicale, respect du patient et simplicité pour les proches aidants.",
        "Chaque retour d'expérience à Rabat nous aide à affiner notre réseau de kinésithérapeutes partenaires et à mieux répondre aux besoins des foyers de la capitale.",
      ],
    },
    extendedFaqs: [
      {
        question: "Quels types de rééducation sont disponibles à Rabat ?",
        answer:
          "Orthopédique, respiratoire, neurologique, vestibulaire, pédiatrique, post-opératoire et renforcement musculaire. Décrivez votre besoin et nous orientons vers le bon profil à Rabat, Salé ou Temara.",
      },
      {
        question: "Comment réserver une première séance de kiné à Rabat ?",
        answer:
          "Via WhatsApp ou le formulaire en ligne. Indiquez votre adresse, votre pathologie et vos disponibilités. Notre équipe vous rappelle pour confirmer la mise en relation.",
      },
      {
        question: "Intervenez-vous le week-end à Rabat ?",
        answer:
          "Oui, selon les disponibilités des kinésithérapeutes partenaires. La coordination SOS Santé reste joignable 7j/7 pour organiser ou reprogrammer une séance.",
      },
      {
        question: "Comment sont fixés les tarifs à Rabat ?",
        answer:
          "Selon le type de séance, la durée et le quartier. Le montant vous est annoncé avant validation, sans frais cachés de coordination.",
      },
      {
        question: "Les kinésithérapeutes sont-ils inscrits à l'ordre ?",
        answer:
          "Nous orientons vers des professionnels diplômés et inscrits. SOS Santé vérifie les références avant toute mise en relation dans la région de Rabat.",
      },
      {
        question: "Puis-je changer de kinésithérapeute ?",
        answer:
          "Oui. Si le premier praticien ne convient pas, contactez-nous : nous chercherons une autre disponibilité adaptée à votre situation à Rabat.",
      },
      {
        question: "Comment annuler une séance à Rabat ?",
        answer:
          "Prévenez SOS Santé ou le professionnel partenaire dès que possible. Nous faisons le nécessaire pour reprogrammer un créneau compatible avec votre planning.",
      },
    ],
  },

  "soins-infirmiers-a-domicile": {
    heroSubheadline:
      "Pansements, injections, perfusions et surveillance à Rabat : SOS Santé coordonne des infirmiers diplômés partenaires pour des soins techniques directement chez vous.",
    seoIntroHeading: "Infirmier à domicile à Rabat : soins professionnels sans vous déplacer",
    seoIntro:
      "Après une opération, pour un pansement complexe ou une perfusion prescrite, vous avez besoin d'un infirmier fiable à Rabat. SOS Santé centralise votre demande et vous met en relation avec une infirmière ou un infirmier partenaire disponible à Rabat, Salé ou Temara. Hygiène rigoureuse, respect des protocoles et tarifs annoncés à l'avance.",
    whyChoose: [
      {
        number: "01",
        title: "Organisation rapide",
        text: "Notre équipe à Rabat qualifie votre demande et cherche un infirmier partenaire disponible, y compris en soirée ou week-end selon les créneaux.",
      },
      {
        number: "02",
        title: "Compétences certifiées",
        text: "Injections, pansements, perfusions : nous orientons vers des infirmiers diplômés d'État habitués aux soins techniques à domicile dans la région de Rabat.",
      },
      {
        number: "03",
        title: "Couverture Salé-Temara",
        text: "Au-delà de Rabat centre, nous couvrons Salé, Temara, Hay Riad, Agdal et Souissi pour limiter les délais d'intervention infirmière.",
      },
    ],
    valueProps: [
      {
        title: "Gestes techniques maîtrisés",
        text: "Pansements d'escarres, injections sous-cutanées ou intraveineuses, pose de perfusion : réalisés à domicile selon la prescription médicale.",
        accent: "mint",
      },
      {
        title: "Relais après hospitalisation",
        text: "L'infirmier assure le suivi de la plaie, surveille les signes d'infection et informe le médecin traitant si nécessaire.",
        accent: "lavender",
      },
      {
        title: "Créneaux souples",
        text: "Soins ponctuels ou passages réguliers à Rabat, adaptés à votre emploi du temps et à celui de l'infirmier partenaire.",
        accent: "peach",
      },
      {
        title: "Surveillance des constantes",
        text: "Tension, température, glycémie, saturation : un suivi utile pour les patients diabétiques, cardiaques ou en convalescence.",
        accent: "rose",
      },
      {
        title: "Prix annoncés à l'avance",
        text: "Le coût de l'intervention infirmière à Rabat vous est communiqué avant le passage, sans frais dissimulés.",
        accent: "sky",
      },
    ],
    expertise: {
      title: "Des infirmiers partenaires pour les soins à domicile",
      paragraphs: [
        "Les infirmiers coordonnés par SOS Santé à Rabat interviennent pour des actes techniques et un suivi régulier après sortie de clinique ou d'hôpital.",
        "Rester chez soi réduit l'exposition aux infections nosocomiales et permet un confort supérieur pour les personnes fragiles.",
      ],
      bullets: [
        "Pansements et soins de plaies complexes",
        "Injections et perfusions à Rabat",
        "Prélèvements sanguins à domicile",
        "Soins post-opératoires",
        "Surveillance infirmière de nuit (selon disponibilité)",
      ],
    },
    benefits: [
      {
        title: "Protocoles d'hygiène stricts",
        paragraphs: [
          "Matériel stérile, désinfection des mains, gestes aseptiques : les soins infirmiers à domicile à Rabat respectent les standards hospitaliers.",
        ],
      },
      {
        title: "Continuité après la sortie de clinique",
        paragraphs: [
          "L'infirmier reprend le fil des prescriptions et alerte rapidement en cas de fièvre, douleur ou complication à Rabat ou Temara.",
        ],
      },
      {
        title: "Soutien aux aidants familiaux",
        paragraphs: [
          "Les proches reçoivent des conseils pratiques pour accompagner le patient au quotidien entre deux passages infirmiers.",
        ],
      },
    ],
    specialties: [
      {
        title: "Suivi post-opératoire à Rabat",
        paragraphs: [
          "Ablation de fils, pansements, surveillance de cicatrisation : l'infirmier prend le relais après votre chirurgie pour un retour à domicile plus rassurant.",
        ],
      },
      {
        title: "Injections et perfusions à domicile",
        paragraphs: [
          "Anticoagulants, antibiotiques, vitamines ou perfusions longues : les actes prescrits sont réalisés chez vous à Rabat, Salé ou Temara.",
        ],
      },
      {
        title: "Prélèvements sans file d'attente",
        paragraphs: [
          "La prise de sang à domicile convient aux seniors, aux personnes à mobilité réduite ou aux familles qui manquent de temps pour se rendre en laboratoire.",
        ],
      },
    ],
    trust: {
      title: "Transparence et coordination à Rabat",
      paragraphs: [
        "SOS Santé Rabat coordonne la mise en relation avec des infirmiers partenaires. Nous ne sommes pas un établissement de soins : nous organisons l'intervention et restons votre interlocuteur.",
        "Les tarifs et délais vous sont confirmés avant le passage infirmier, pour une organisation sereine des soins à domicile.",
      ],
    },
    community: {
      title: "Accompagner les foyers de Rabat avec sérieux",
      paragraphs: [
        "Les soins infirmiers à domicile demandent rigueur et bienveillance. Nous sélectionnons des professionnels capables de concilier les deux.",
        "Vos retours nous aident à améliorer la qualité de coordination dans la région Rabat-Salé-Kénitra.",
      ],
    },
    extendedFaqs: [
      {
        question: "Quels actes infirmiers sont possibles à Rabat ?",
        answer:
          "Pansements, injections, perfusions, prise de sang, surveillance des constantes et suivi post-opératoire à domicile, selon prescription médicale.",
      },
      {
        question: "Les infirmiers sont-ils diplômés d'État ?",
        answer:
          "Oui. Nous orientons vers des infirmiers inscrits. SOS Santé agit comme coordinateur, pas comme cabinet de soins.",
      },
      {
        question: "Quel délai pour un passage infirmier urgent à Rabat ?",
        answer:
          "Nous visons une mise en relation sous 2 à 4 heures selon disponibilité. Pour un suivi planifié, comptez 24 à 48 h.",
      },
      {
        question: "Proposez-vous une garde infirmière de nuit ?",
        answer:
          "Possible selon disponibilité des prestataires partenaires à Rabat. Précisez vos besoins lors de la demande.",
      },
      {
        question: "Comment sont calculés les tarifs infirmiers ?",
        answer:
          "Selon le type de soin, la durée et la fréquence. Montant annoncé avant intervention, sans surprise.",
      },
      {
        question: "Faut-il une ordonnance à Rabat ?",
        answer:
          "Oui pour la plupart des actes techniques. Notre équipe vous indique les documents nécessaires lors de votre demande.",
      },
      {
        question: "Puis-je garder le même infirmier à chaque visite ?",
        answer:
          "Nous faisons le nécessaire pour assurer la continuité avec le même professionnel partenaire, selon son planning.",
      },
    ],
  },

  "medecin-a-domicile": {
    heroSubheadline:
      "Consultation médicale à domicile à Rabat : SOS Santé coordonne la visite d'un médecin généraliste partenaire pour les personnes immobilisées, convalescentes ou pressées.",
    seoIntroHeading: "Médecin à domicile à Rabat : un généraliste qui vient chez vous",
    seoIntro:
      "Fièvre, infection, impossibilité de se déplacer ou simple besoin de consultation sans salle d'attente : SOS Santé Rabat organise la mise en relation avec un médecin généraliste partenaire disponible dans votre secteur. Examen clinique, prescription et orientation si besoin — le tout coordonné avec transparence sur les honoraires.",
    whyChoose: [
      {
        number: "01",
        title: "Prise en charge coordonnée",
        text: "Une seule demande suffit : notre équipe à Rabat qualifie votre situation et cherche un médecin partenaire disponible dans les meilleurs délais.",
      },
      {
        number: "02",
        title: "Médecins généralistes partenaires",
        text: "Nous orientons vers des praticiens expérimentés, capables d'examiner, diagnostiquer et prescrire à domicile dans l'agglomération rabat-Salé-Témara.",
      },
      {
        number: "03",
        title: "Couverture élargie",
        text: "Rabat centre, Hay Riad, Agdal, Souissi, Salé et Temara : nous cherchons un créneau proche de chez vous.",
      },
    ],
    valueProps: [
      {
        title: "Examen complet à domicile",
        text: "Auscultation, diagnostic, prescription et certificats médicaux réalisés dans votre logement à Rabat.",
        accent: "mint",
      },
      {
        title: "Suivi post-hospitalisation",
        text: "Reprise du suivi après une sortie de clinique, sans contrainte de transport pour le patient.",
        accent: "lavender",
      },
      {
        title: "Orientation adaptée",
        text: "Si une spécialité est nécessaire, le médecin vous oriente vers la structure la plus pertinente à Rabat ou ailleurs.",
        accent: "peach",
      },
      {
        title: "Gain de temps",
        text: "Fini les longues attentes en cabinet : la consultation s'organise selon vos disponibilités à Rabat.",
        accent: "rose",
      },
      {
        title: "Honoraires transparents",
        text: "Les modalités tarifaires vous sont communiquées avant la visite. SOS Santé reste votre interlocuteur de coordination.",
        accent: "sky",
      },
    ],
    expertise: {
      title: "Consultations médicales adaptées au domicile",
      paragraphs: [
        "Le médecin généraliste partenaire examine le patient, évalue les symptômes et établit ou renouvelle les ordonnances nécessaires. Cette formule convient particulièrement aux seniors, aux convalescents et aux familles avec jeunes enfants.",
        "SOS Santé n'exerce pas la médecine : nous coordonnons la visite. En cas d'urgence vitale, contactez immédiatement les services d'urgence officiels.",
      ],
      bullets: [
        "Consultation générale à Rabat",
        "Suivi post-hospitalisation",
        "Renouvellement d'ordonnance",
        "Certificats médicaux à domicile",
        "Orientation vers un spécialiste",
      ],
    },
    benefits: [
      {
        title: "Préserver le repos du patient",
        paragraphs: [
          "La consultation à domicile à Rabat limite la fatigue liée au transport, surtout pour les personnes âgées ou en fin de convalescence.",
        ],
      },
      {
        title: "Rendez-vous flexibles",
        paragraphs: [
          "Nous cherchons un créneau compatible avec votre emploi du temps et la disponibilité du médecin partenaire dans la région de Rabat.",
        ],
      },
      {
        title: "Diagnostic contextualisé",
        paragraphs: [
          "Observer le logement aide le médecin à formuler des recommandations pratiques — prévention des chutes, aération, organisation des soins.",
        ],
      },
    ],
    specialties: [
      {
        title: "Consultation pour symptômes courants",
        paragraphs: [
          "Fièvre, toux, douleurs, infection urinaire ou fatigue persistante : le médecin généraliste se déplace à Rabat pour examiner et prescrire le traitement adapté.",
        ],
      },
      {
        title: "Visites médicales pour seniors",
        paragraphs: [
          "À Hay Riad, Souissi ou Salé, la visite à domicile évite les risques de chute en route et assure un suivi régulier des personnes âgées.",
        ],
      },
    ],
    trust: {
      title: "Clarté et rôle de SOS Santé à Rabat",
      paragraphs: [
        "SOS Santé Rabat est un service de coordination, pas un cabinet médical. Le médecin partenaire intervient en son nom propre.",
        "Nous vous accompagnons de la demande à la confirmation du rendez-vous, avec des honoraires annoncés avant la visite.",
      ],
    },
    community: {
      title: "La médecine de proximité, simplifiée",
      paragraphs: [
        "Accéder à un médecin ne devrait pas être un parcours du combattant. Nous facilitons cette étape pour les habitants de Rabat et environs.",
        "Vos retours nous aident à améliorer la qualité de mise en relation avec les généralistes partenaires.",
      ],
    },
    extendedFaqs: [
      {
        question: "Peut-on consulter un médecin à domicile à Rabat ?",
        answer:
          "Oui, sur demande et selon disponibilité. SOS Santé coordonne la mise en relation avec un médecin généraliste partenaire.",
      },
      {
        question: "SOS Santé remplace-t-il mon médecin traitant ?",
        answer:
          "Non. Il complète votre parcours pour un besoin ponctuel à Rabat. Pour un suivi chronique, conservez votre médecin référent.",
      },
      {
        question: "Quels actes sont réalisables à domicile ?",
        answer:
          "Consultation, examen clinique, prescription, certificats et orientation. Les actes nécessitant un plateau technique hospitalier ne le sont pas.",
      },
      {
        question: "Comment prendre rendez-vous à Rabat ?",
        answer:
          "Via WhatsApp ou le formulaire. Décrivez vos symptômes, votre adresse et vos disponibilités. Nous vous rappelons rapidement.",
      },
      {
        question: "Quels sont les honoraires à Rabat ?",
        answer:
          "Communiqués avant la visite, sans frais cachés de coordination. Le montant dépend du créneau et du type de consultation.",
      },
      {
        question: "Intervention le week-end à Rabat ?",
        answer:
          "Selon disponibilité des médecins partenaires. Contactez-nous pour vérifier les créneaux week-end et jours fériés.",
      },
      {
        question: "Que faire en cas d'urgence vitale ?",
        answer:
          "Composez les numéros d'urgence officiels. SOS Santé coordonne des consultations programmées, pas les urgences hospitalières.",
      },
    ],
  },

  "aide-soignant-a-domicile": {
    heroSubheadline:
      "Aide-soignant à domicile à Rabat pour l'hygiène, les repas, la mobilité et la présence rassurante auprès des personnes âgées ou en perte d'autonomie.",
    seoIntroHeading: "Aide à domicile à Rabat : accompagnement bienveillant et fiable",
    seoIntro:
      "Toilette, habillage, lever-coucher, préparation des repas ou simple présence : SOS Santé Rabat met en relation les familles avec des aide-soignants partenaires disponibles à Rabat, Salé et Temara. Un service discret, respectueux et adapté à la perte d'autonomie.",
    whyChoose: [
      {
        number: "01",
        title: "Réponse adaptée",
        text: "Nous qualifions votre besoin — quelques heures par semaine ou garde prolongée — et cherchons un aide-soignant disponible dans votre secteur à Rabat.",
      },
      {
        number: "02",
        title: "Professionnels formés",
        text: "Les aide-soignants partenaires sont diplômés et habitués à travailler avec des personnes âgées ou dépendantes dans la région de Rabat.",
      },
      {
        number: "03",
        title: "Quartiers couverts",
        text: "Hay Riad, Agdal, Souissi, Salé, Temara : nous couvrons l'agglomération pour des interventions de proximité.",
      },
    ],
    valueProps: [
      {
        title: "Aide à l'hygiène",
        text: "Toilette, soins de confort et habillage réalisés avec respect de l'intimité du patient à Rabat.",
        accent: "mint",
      },
      {
        title: "Mobilité sécurisée",
        text: "Transfers lit-fauteuil, aide à la marche et prévention des chutes dans le logement.",
        accent: "lavender",
      },
      {
        title: "Présence nocturne",
        text: "Garde de nuit à domicile selon disponibilité, pour rassurer les familles de Rabat.",
        accent: "peach",
      },
      {
        title: "Aide alimentaire",
        text: "Préparation de repas adaptés et aide à la prise alimentaire si nécessaire.",
        accent: "rose",
      },
      {
        title: "Forfaits clairs",
        text: "Tarifs horaires ou packages communiqués avant le début de l'accompagnement à Rabat.",
        accent: "sky",
      },
    ],
    expertise: {
      title: "Un accompagnement au quotidien, pas des actes médicaux",
      paragraphs: [
        "L'aide-soignant intervient pour les gestes essentiels du quotidien : confort, mobilité, repas et présence. Les actes infirmiers ou médicaux relèvent d'autres professionnels.",
        "SOS Santé sélectionne des aide-soignants partenaires expérimentés avec les seniors et les personnes en perte d'autonomie dans la région de Rabat.",
      ],
      bullets: [
        "Aide à la toilette à Rabat",
        "Aide à l'habillage et à la mobilité",
        "Garde-malade diurne ou nocturne",
        "Préparation des repas",
        "Stimulation et présence sociale",
      ],
    },
    benefits: [
      {
        title: "Respect et discrétion",
        paragraphs: [
          "L'intervention à domicile à Rabat respecte les habitudes de vie et l'intimité du patient, dans un esprit de dignité.",
        ],
      },
      {
        title: "Répit pour les proches aidants",
        paragraphs: [
          "Quelques heures de relais ou une garde régulière permettent aux familles de souffler, en toute confiance.",
        ],
      },
      {
        title: "Vieillir chez soi",
        paragraphs: [
          "L'aide à domicile favorise le maintien à domicile à Rabat, dans un environnement familier et sécurisé.",
        ],
      },
    ],
    specialties: [
      {
        title: "Garde-malade à Rabat",
        paragraphs: [
          "Présence diurne ou nocturne pour veiller sur une personne dépendante, assurer son confort et alerter la famille si besoin.",
        ],
      },
      {
        title: "Accompagnement des seniors",
        paragraphs: [
          "Toilette, repas, promenades courtes et conversation : l'aide-soignant contribue au bien-être des seniors de Rabat et Temara.",
        ],
      },
    ],
    trust: {
      title: "Confiance et transparence à Rabat",
      paragraphs: [
        "SOS Santé Rabat coordonne la mise en relation avec des aide-soignants partenaires. Nous vérifions les références avant toute intervention.",
        "Les tarifs et modalités vous sont confirmés avant le début de l'accompagnement.",
      ],
    },
    community: {
      title: "Soutenir les familles de la capitale",
      paragraphs: [
        "Accompagner un proche âgé demande de l'énergie. Nous voulons rendre cette étape plus simple pour les foyers de Rabat.",
        "Chaque retour d'expérience nourrit l'amélioration de notre réseau d'aide-soignants partenaires.",
      ],
    },
    extendedFaqs: [
      {
        question: "Comment trouver un aide-soignant à Rabat ?",
        answer:
          "Contactez SOS Santé avec vos besoins : horaires, durée, type d'aide. Nous orientons vers un aide-soignant partenaire disponible.",
      },
      {
        question: "Proposez-vous la garde de nuit à Rabat ?",
        answer:
          "Oui, selon disponibilité. Précisez vos besoins lors de la demande pour une orientation adaptée.",
      },
      {
        question: "L'aide-soignant peut-il faire des injections ?",
        answer:
          "Non. L'aide au traitement oui, mais pas d'actes infirmiers. Pour des soins médicaux, demandez un infirmier à domicile.",
      },
      {
        question: "Quels tarifs à Rabat ?",
        answer:
          "Tarifs horaires ou forfaits selon durée et type d'accompagnement. Annoncés à l'avance, sans surprise.",
      },
      {
        question: "Intervention ponctuelle ou régulière ?",
        answer:
          "Les deux sont possibles à Rabat : quelques heures par semaine ou accompagnement quotidien selon vos besoins.",
      },
      {
        question: "Les aide-soignants sont-ils qualifiés ?",
        answer:
          "Oui, nous orientons vers des professionnels diplômés. SOS Santé vérifie les références avant mise en relation.",
      },
      {
        question: "Peut-on faire une période d'essai ?",
        answer:
          "Une première intervention est possible à Rabat selon disponibilité, pour valider l'adéquation avec le patient.",
      },
    ],
  },

  "ambulance-maroc": {
    heroSubheadline:
      "Transport médical et ambulance à Rabat : SOS Santé organise votre transfert médicalisé avec des prestataires partenaires, en ville ou vers d'autres grandes agglomérations.",
    seoIntroHeading: "Ambulance à Rabat : transport médical coordonné et transparent",
    seoIntro:
      "Retour de clinique, transfert vers un hôpital ou déplacement inter-villes : SOS Santé Rabat coordonne l'ambulance et le transport médicalisé avec des prestataires partenaires. Nous confirmons disponibilité, délai et tarif avant validation. Rappel : SOS Santé n'est pas un service d'urgence vitale officiel.",
    whyChoose: [
      {
        number: "01",
        title: "Coordination immédiate",
        text: "Un appel ou un message WhatsApp suffit : nous vérifions la disponibilité d'un transporteur partenaire à Rabat et vous confirmons les modalités.",
      },
      {
        number: "02",
        title: "Véhicules médicalisés",
        text: "Ambulances et VSL adaptées à l'état du patient, selon la distance et les recommandations médicales depuis Rabat.",
      },
      {
        number: "03",
        title: "Transferts inter-villes",
        text: "Depuis Rabat, nous organisons des transports vers Casablanca, Marrakech, Tanger ou d'autres destinations au Maroc.",
      },
    ],
    valueProps: [
      {
        title: "Transport sécurisé",
        text: "Véhicule équipé pour le transport de patients alités ou semi-autonomes depuis Rabat.",
        accent: "mint",
      },
      {
        title: "Liaisons inter-villes",
        text: "Transferts Rabat ↔ Casablanca, Marrakech, Tanger et autres villes selon disponibilité.",
        accent: "lavender",
      },
      {
        title: "Confirmation avant départ",
        text: "Disponibilité, délai et tarif validés avant l'envoi du véhicule à Rabat.",
        accent: "peach",
      },
      {
        title: "Devis détaillé",
        text: "Distance, type de véhicule et accompagnement médical intégrés dans le devis transparent.",
        accent: "rose",
      },
      {
        title: "Suivi de coordination",
        text: "Notre équipe reste joignable pendant l'organisation du transport depuis Rabat.",
        accent: "sky",
      },
    ],
    expertise: {
      title: "Organiser un transport médical depuis Rabat",
      paragraphs: [
        "SOS Santé coordonne les transferts médicaux non urgents, les retours de clinique et les déplacements inter-établissements depuis Rabat et Salé.",
        "En cas d'urgence vitale, composez immédiatement les numéros d'urgence. Pour un transport planifié ou semi-urgent, contactez notre équipe.",
      ],
      bullets: [
        "Ambulance à domicile à Rabat",
        "Transport médicalisé local",
        "Transfert Rabat → autres villes",
        "Retour de clinique",
        "Transport patient alité",
      ],
    },
    benefits: [
      {
        title: "Une seule interlocution",
        paragraphs: [
          "Vous contactez SOS Santé Rabat : nous gérons la coordination avec le transporteur partenaire, de la prise en charge à la destination.",
        ],
      },
      {
        title: "Tarifs annoncés à l'avance",
        paragraphs: [
          "Le devis intègre distance, type d'ambulance et horaire. Aucun frais caché après le trajet.",
        ],
      },
      {
        title: "Couverture nationale",
        paragraphs: [
          "Depuis Rabat, nous organisons des transferts vers l'ensemble du Maroc selon disponibilité des transporteurs partenaires.",
        ],
      },
    ],
    specialties: [
      {
        title: "Ambulance depuis votre domicile à Rabat",
        paragraphs: [
          "Prise en charge à votre adresse à Rabat, Salé ou Temara et transport vers hôpital, clinique ou autre destination avec véhicule adapté.",
        ],
      },
      {
        title: "Transferts inter-villes depuis Rabat",
        paragraphs: [
          "Transport médical de Rabat vers Casablanca, Marrakech, Tanger ou toute autre ville du Maroc, selon prescription médicale si requise.",
        ],
      },
    ],
    trust: {
      title: "Rôle de SOS Santé dans le transport médical",
      paragraphs: [
        "SOS Santé Rabat coordonne les transports médicaux avec des prestataires partenaires. Nous ne sommes pas un service d'urgence officiel.",
        "Nous restons transparents sur les délais, les tarifs et les conditions de transport avant validation.",
      ],
    },
    community: {
      title: "Faciliter les déplacements médicaux",
      paragraphs: [
        "Organiser un transport médicalisé peut être stressant. Nous simplifions cette étape pour les familles de Rabat et de la région.",
        "Vos retours nous aident à améliorer la qualité de coordination avec les transporteurs partenaires.",
      ],
    },
    extendedFaqs: [
      {
        question: "Comment réserver une ambulance à Rabat ?",
        answer:
          "Contactez SOS Santé par téléphone ou WhatsApp. Indiquez adresse de départ, destination, état du patient et urgence. Nous confirmons la disponibilité.",
      },
      {
        question: "Intervenez-vous en urgence vitale ?",
        answer:
          "Non. En urgence vitale, composez les numéros d'urgence. SOS Santé coordonne les transports médicaux selon disponibilité.",
      },
      {
        question: "Quels types de véhicules à Rabat ?",
        answer:
          "VSL, ambulance simple ou médicalisée selon l'état du patient et la distance. Nous orientons vers le véhicule adapté.",
      },
      {
        question: "Tarifs ambulance à Rabat ?",
        answer:
          "Selon distance, type de véhicule et horaire. Devis communiqué avant validation, sans frais cachés.",
      },
      {
        question: "Transfert de Rabat vers une autre ville ?",
        answer:
          "Oui, nous coordonnons des transferts inter-villes depuis Rabat vers Casablanca, Marrakech, Tanger et autres destinations.",
      },
      {
        question: "Faut-il une prescription médicale ?",
        answer:
          "Pour certains transports médicalisés, oui. Notre équipe vous indique les documents nécessaires lors de votre demande.",
      },
      {
        question: "Délai d'intervention à Rabat ?",
        answer:
          "Variable selon disponibilité et urgence. Contactez-nous pour une estimation en temps réel.",
      },
    ],
  },
};

export function getCareServiceCityContentVariant(
  serviceSlug: string,
  citySlug: CitySlug
): CareServiceCityContentVariant | null {
  if (citySlug === "rabat") {
    return rabatVariants[serviceSlug] ?? null;
  }
  return null;
}
