export type CareServiceWhyCard = {
  number: string;
  title: string;
  text: (city: string) => string;
};

export type CareServiceValueProp = {
  title: string;
  text: (city: string) => string;
  accent: "mint" | "lavender" | "peach" | "rose" | "sky";
};

export type CareServiceContentBlock = {
  title: string | ((city: string) => string);
  paragraphs: (city: string) => string[];
  bullets?: (city: string) => string[];
};

export type CareServiceSeoProfile = {
  heroSubheadline: (city: string) => string;
  seoIntro: (city: string) => string;
  seoIntroHeading: (city: string) => string;
  whyChoose: CareServiceWhyCard[];
  valueProps: CareServiceValueProp[];
  expertise: CareServiceContentBlock;
  benefits: CareServiceContentBlock[];
  specialties: CareServiceContentBlock[];
  trust: CareServiceContentBlock;
  community: CareServiceContentBlock;
  extendedFaqs: (city: string) => { question: string; answer: string }[];
};

const accentClasses: Record<CareServiceValueProp["accent"], string> = {
  mint: "bg-emerald-50",
  lavender: "bg-violet-50",
  peach: "bg-orange-50",
  rose: "bg-rose-50",
  sky: "bg-sky-50",
};

export function getValuePropAccentClass(accent: CareServiceValueProp["accent"]) {
  return accentClasses[accent];
}

function blockTitle(
  title: CareServiceContentBlock["title"],
  city: string
): string {
  return typeof title === "function" ? title(city) : title;
}

export function resolveContentBlock(
  block: CareServiceContentBlock,
  city: string
) {
  return {
    title: blockTitle(block.title, city),
    paragraphs: block.paragraphs(city),
    bullets: block.bullets?.(city),
  };
}

const sharedWhyChoose: CareServiceWhyCard[] = [
  {
    number: "01",
    title: "Rapidité de réponse",
    text: (city) =>
      `Notre équipe de coordination SOS Santé à ${city} traite votre demande rapidement et vous met en relation avec un professionnel partenaire disponible, y compris le week-end et les jours fériés selon les créneaux.`,
  },
  {
    number: "02",
    title: "Professionnels vérifiés",
    text: (city) =>
      `Nous orientons vers des intervenants diplômés et expérimentés à ${city}. Chaque mise en relation fait l'objet d'une vérification préalable des compétences et de la disponibilité.`,
  },
  {
    number: "03",
    title: "Proximité géographique",
    text: (city) =>
      `SOS Santé couvre ${city} et ses quartiers environnants pour limiter les délais d'intervention et vous garantir un suivi de proximité adapté à votre situation.`,
  },
];

const sharedTrust: CareServiceContentBlock = {
  title: "Pourquoi faire confiance à SOS Santé ?",
  paragraphs: (city) => [
    `SOS Santé est un service marocain de coordination et de mise en relation en santé à domicile à ${city}. Nous facilitons l'accès à des professionnels partenaires tout en restant transparents sur nos rôles : nous coordonnons, nous ne remplaçons pas un établissement de soins ni un service d'urgence officiel.`,
    `Notre priorité est votre tranquillité d'esprit. Nous vous accompagnons de la première prise de contact jusqu'à la confirmation de l'intervention, avec une communication claire sur les disponibilités et les tarifs annoncés à l'avance.`,
  ],
};

const sharedCommunity: CareServiceContentBlock = {
  title: "L'accompagnement au cœur de notre mission",
  paragraphs: (city) => [
    `Chez SOS Santé ${city}, nous croyons que les soins à domicile doivent allier qualité médicale, respect de la dignité du patient et simplicité d'organisation pour les familles.`,
    `Votre retour d'expérience nous aide à améliorer continuellement la coordination entre patients, proches et professionnels partenaires. Chaque demande est traitée avec attention, qu'il s'agisse d'un besoin ponctuel ou d'un suivi régulier.`,
  ],
};

export const careServiceSeoProfiles: Record<string, CareServiceSeoProfile> = {
  "kinesitherapie-a-domicile": {
    heroSubheadline: (city) =>
      `SOS Santé met à votre disposition des kinésithérapeutes partenaires à ${city}, prêts à intervenir à domicile selon disponibilité — rééducation motrice, respiratoire et neurologique.`,
    seoIntroHeading: (city) =>
      `Kiné à domicile à ${city} : soins de qualité à votre porte`,
    seoIntro: (city) =>
      `Bienvenue sur la page « Kinésithérapie à domicile à ${city} ». Vous cherchez des soins kinésithérapiques à domicile ? Notre service de kiné à domicile à ${city} vous met en relation avec des kinésithérapeutes partenaires pour des traitements personnalisés, dans le confort de votre foyer. Découvrez pourquoi de nombreuses familles choisissent SOS Santé pour leurs besoins en kinésithérapie à domicile à ${city} et dans toute la région.`,
    whyChoose: sharedWhyChoose,
    valueProps: [
      {
        title: "Un suivi à long terme",
        text: (city) =>
          `Nos kinésithérapeutes partenaires à ${city} vous accompagnent tout au long de votre parcours de rééducation, avec un protocole adapté à votre évolution et à vos objectifs fonctionnels.`,
        accent: "mint",
      },
      {
        title: "Une équipe compétente",
        text: (city) =>
          `Nous orientons vers des masseurs-kinésithérapeutes diplômés, expérimentés en rééducation à domicile à ${city} et sensibles aux contraintes des patients et de leurs proches.`,
        accent: "lavender",
      },
      {
        title: "Surveillance médicale",
        text: (city) =>
          `Chaque séance à domicile à ${city} s'inscrit dans une logique de sécurité : évaluation de l'état du patient, adaptation des exercices et communication avec le médecin traitant si nécessaire.`,
        accent: "peach",
      },
      {
        title: "Protocole sur mesure",
        text: (city) =>
          `Rééducation post-opératoire, neurologique ou respiratoire : le plan de soins kinésithérapiques à domicile à ${city} est personnalisé selon votre diagnostic et votre environnement.`,
        accent: "rose",
      },
      {
        title: "Tarifs transparents",
        text: (city) =>
          `Les tarifs sont annoncés à l'avance lors de votre demande à ${city}. Aucun frais caché : vous savez à quoi vous attendre avant la première séance.`,
        accent: "sky",
      },
    ],
    expertise: {
      title: "L'expertise de notre réseau de kinésithérapeutes",
      paragraphs: (city) => [
        `SOS Santé coordonne à ${city} la mise en relation avec des kinésithérapeutes partenaires capables de prendre en charge une large variété de situations : rééducation après fracture, entorse, chirurgie orthopédique, pathologies respiratoires, troubles neurologiques ou pédiatriques.`,
        `Intervenir à domicile permet au professionnel d'adapter les exercices à votre espace de vie réel — escaliers, salle de bain, chambre — pour une rééducation plus concrète et plus efficace.`,
      ],
      bullets: (city) => [
        `Kiné urgence à domicile à ${city}`,
        `Kiné respiratoire à domicile à ${city}`,
        `Kiné vestibulaire à domicile à ${city}`,
        `Kiné bébé et pédiatrique à domicile à ${city}`,
        `Rééducation neurologique à domicile à ${city}`,
      ],
    },
    benefits: [
      {
        title: "Confort et tranquillité à domicile",
        paragraphs: (city) => [
          `Recevoir votre kinésithérapeute à ${city} directement chez vous évite les trajets, les salles d'attente et le stress lié aux déplacements. Vous restez dans un environnement familier, propice à la détente et à la récupération.`,
          `Cette approche est particulièrement adaptée aux personnes âgées, aux patients post-opératoires ou à mobilité réduite qui souhaitent une kinésithérapie à domicile à ${city} sans contrainte.`,
        ],
      },
      {
        title: "Flexibilité dans la prise de rendez-vous",
        paragraphs: (city) => [
          `SOS Santé facilite la planification de vos séances de kiné à domicile à ${city} selon vos disponibilités : matin, après-midi, week-end. Notre équipe de coordination reste joignable pour ajuster ou reprogrammer une visite.`,
          `Que vous soyez à ${city}, Inezgane, Hay Riad ou ailleurs dans notre zone couverte, nous cherchons un créneau compatible avec votre emploi du temps et celui du kinésithérapeute partenaire.`,
        ],
      },
      {
        title: "Approche personnalisée et directe",
        paragraphs: (city) => [
          `À domicile, le kinésithérapeute observe votre quotidien et adapte les exercices à votre réalité. C'est l'un des grands avantages du kiné qui se déplace à ${city} : un suivi direct, humain et individualisé.`,
          `Vous pouvez impliquer vos proches dans la rééducation, poser vos questions en direct et progresser à votre rythme, encadré par un professionnel de confiance.`,
        ],
      },
    ],
    specialties: [
      {
        title: (city) => `Kiné urgente et soins immédiats à ${city}`,
        paragraphs: (city) => [
          `Pour certaines situations nécessitant une prise en charge rapide à ${city}, SOS Santé tente de vous orienter vers un kinésithérapeute partenaire disponible dans les meilleurs délais. Contactez-nous par WhatsApp ou formulaire pour qualifier votre urgence.`,
          `Nous couvrons ${city} et les communes avoisinantes. En cas d'urgence vitale, composez les numéros d'urgence compétents — SOS Santé coordonne des soins à domicile, pas les urgences hospitalières.`,
        ],
      },
      {
        title: (city) => `Kiné respiratoire à domicile à ${city}`,
        paragraphs: (city) => [
          `La kinésithérapie respiratoire à domicile à ${city} aide les patients atteints d'asthme, BPCO, bronchite chronique ou convalescence post-pneumonie. Le kiné enseigne les techniques d'expectoration, renforce la musculature respiratoire et améliore le confort au quotidien.`,
        ],
      },
      {
        title: (city) => `Réhabilitation vestibulaire à domicile à ${city}`,
        paragraphs: (city) => [
          `Vertiges, instabilité, troubles de l'équilibre : nos kinésithérapeutes partenaires spécialisés en kiné vestibulaire à domicile à ${city} proposent des exercices ciblés pour retrouver confiance dans vos déplacements.`,
        ],
      },
      {
        title: (city) => `Soins pédiatriques à domicile à ${city}`,
        paragraphs: (city) => [
          `Le kiné bébé à domicile à ${city} accompagne les nourrissons et enfants en retard moteur, torticolis, plagiocéphalie ou rééducation post-chirurgicale. L'intervention à domicile rassure l'enfant et facilite la régularité des séances pour les parents.`,
        ],
      },
    ],
    trust: sharedTrust,
    community: sharedCommunity,
    extendedFaqs: (city) => [
      {
        question: `Quels types de soins kinésithérapiques sont proposés à domicile à ${city} ?`,
        answer: `Rééducation motrice, kinésithérapie respiratoire, rééducation neurologique, vestibulaire, pédiatrique, post-opératoire, renforcement musculaire, drainage lymphatique et mobilisation articulaire. SOS Santé à ${city} qualifie votre besoin et vous oriente vers le bon professionnel partenaire.`,
      },
      {
        question: `Comment organiser une première visite de kinésithérapeute à ${city} ?`,
        answer: `Remplissez le formulaire ou contactez-nous par WhatsApp. Indiquez votre ville, quartier, type de rééducation souhaité et vos disponibilités. Notre équipe vous rappelle pour confirmer la mise en relation avec un kiné partenaire à ${city}.`,
      },
      {
        question: `Quels sont les horaires de disponibilité à ${city} ?`,
        answer: `La coordination SOS Santé est disponible 7j/7. Les créneaux de séance à domicile à ${city} dépendent des kinésithérapeutes partenaires : matin, après-midi, soirée et week-end selon disponibilité.`,
      },
      {
        question: `Quels sont vos tarifs de kinésithérapie à domicile à ${city} ?`,
        answer: `Les tarifs varient selon le type de séance, la durée et la zone à ${city}. Ils vous sont communiqués clairement avant validation. Aucun frais caché : transparence totale dès la demande.`,
      },
      {
        question: `Comment garantissez-vous la qualité des kinésithérapeutes à ${city} ?`,
        answer: `Nous orientons vers des professionnels diplômés d'État, inscrits à l'ordre et expérimentés. SOS Santé vérifie les références et la disponibilité avant toute mise en relation à ${city}.`,
      },
      {
        question: `Puis-je changer de kinésithérapeute si je ne suis pas satisfait ?`,
        answer: `Oui. Contactez notre équipe de coordination à ${city}. Nous rechercherons un autre kinésithérapeute partenaire adapté à votre situation et à vos attentes.`,
      },
      {
        question: `Comment annuler ou reprogrammer une séance à ${city} ?`,
        answer: `Prévenez SOS Santé ou le professionnel partenaire dans les meilleurs délais. Nous faisons notre possible pour reprogrammer un créneau compatible avec votre planning à ${city}.`,
      },
    ],
  },

  "soins-infirmiers-a-domicile": {
    heroSubheadline: (city) =>
      `SOS Santé coordonne des soins infirmiers à domicile à ${city} : pansements, injections, perfusions et surveillance par des infirmiers diplômés partenaires.`,
    seoIntroHeading: (city) =>
      `Infirmier à domicile à ${city} : soins professionnels chez vous`,
    seoIntro: (city) =>
      `Vous recherchez un infirmier à domicile à ${city} ? SOS Santé facilite la mise en relation avec des infirmiers et infirmières diplômés d'État pour des soins à domicile sécurisés : pansements complexes, injections, perfusions, prise de sang et suivi des constantes vitales. Notre service de soins infirmiers à domicile à ${city} vous garantit réactivité, professionnalisme et transparence.`,
    whyChoose: sharedWhyChoose,
    valueProps: [
      {
        title: "Soins techniques",
        text: (city) =>
          `Pansements, injections IM/IV/SC, perfusions et prélèvements réalisés à domicile à ${city} par des infirmiers qualifiés, dans le respect des protocoles d'hygiène.`,
        accent: "mint",
      },
      {
        title: "Suivi post-opératoire",
        text: (city) =>
          `Après une chirurgie, l'infirmier à domicile à ${city} assure le suivi de la plaie, la surveillance des signes d'alerte et la coordination avec votre médecin.`,
        accent: "lavender",
      },
      {
        title: "Disponibilité étendue",
        text: (city) =>
          `Interventions ponctuelles ou régulières à ${city}, y compris le week-end selon disponibilité des infirmiers partenaires.`,
        accent: "peach",
      },
      {
        title: "Surveillance des constantes",
        text: (city) =>
          `Prise de tension, température, glycémie et saturation : un suivi infirmier à domicile à ${city} pour les patients chroniques ou convalescents.`,
        accent: "rose",
      },
      {
        title: "Tarifs clairs",
        text: (city) =>
          `Devis et tarifs communiqués avant intervention à ${city}. Pas de surprise, pas de frais cachés.`,
        accent: "sky",
      },
    ],
    expertise: {
      title: "Compétences de nos infirmiers partenaires",
      paragraphs: (city) => [
        `Les infirmiers coordonnés par SOS Santé à ${city} interviennent pour des soins techniques et du suivi régulier à domicile. Ils maîtrisent les gestes infirmiers courants et les situations post-hospitalisation.`,
        `L'intervention à domicile limite les risques d'infection liés aux déplacements et permet un suivi dans le confort du patient.`,
      ],
      bullets: (city) => [
        `Pansements et soins de plaies à ${city}`,
        `Injections et perfusions à domicile à ${city}`,
        `Prise de sang à domicile à ${city}`,
        `Soins post-opératoires à ${city}`,
        `Surveillance infirmière 24h/7j à ${city} (selon disponibilité)`,
      ],
    },
    benefits: [
      {
        title: "Sécurité et hygiène à domicile",
        paragraphs: (city) => [
          `Les soins infirmiers à domicile à ${city} respectent les protocoles d'asepsie et d'hygiène hospitalière. Le matériel est adapté à chaque intervention pour garantir votre sécurité.`,
        ],
      },
      {
        title: "Continuité des soins",
        paragraphs: (city) => [
          `Après une sortie d'hospitalisation à ${city}, l'infirmier à domicile assure la continuité des prescriptions médicales et alerte en cas de complication.`,
        ],
      },
      {
        title: "Accompagnement des familles",
        paragraphs: (city) => [
          `Les proches bénéficient de conseils pratiques et d'un interlocuteur infirmier de confiance à ${city} pour mieux gérer le quotidien du patient.`,
        ],
      },
    ],
    specialties: [
      {
        title: (city) => `Soins post-opératoires à domicile à ${city}`,
        paragraphs: (city) => [
          `Pansements, ablation de fils, surveillance de cicatrisation : l'infirmier à domicile à ${city} prend le relais après votre opération pour un suivi rassurant et professionnel.`,
        ],
      },
      {
        title: (city) => `Injections et perfusions à ${city}`,
        paragraphs: (city) => [
          `Anticoagulants, antibiotiques, vitamines ou perfusions : nos infirmiers partenaires à ${city} réalisent les injections prescrites par votre médecin, à domicile.`,
        ],
      },
      {
        title: (city) => `Prise de sang à domicile à ${city}`,
        paragraphs: (city) => [
          `Évitez les files d'attente : la prise de sang à domicile à ${city} est pratique pour les personnes âgées, les patients chroniques ou les familles pressées.`,
        ],
      },
    ],
    trust: sharedTrust,
    community: sharedCommunity,
    extendedFaqs: (city) => [
      {
        question: `Quels soins infirmiers proposez-vous à ${city} ?`,
        answer: `Pansements simples et complexes, injections, perfusions, prise de sang, surveillance des constantes, soins post-opératoires et suivi infirmier régulier à domicile à ${city}.`,
      },
      {
        question: `Les infirmiers sont-ils diplômés d'État à ${city} ?`,
        answer: `Oui. Nous orientons vers des infirmiers diplômés et inscrits. SOS Santé agit comme coordinateur, pas comme établissement de soins.`,
      },
      {
        question: `Quel délai pour une intervention infirmière à ${city} ?`,
        answer: `Pour les soins urgents, nous visons une mise en relation sous 2 à 4 heures à ${city} selon disponibilité. Pour un suivi planifié, sous 24 à 48 h.`,
      },
      {
        question: `Intervenez-vous la nuit à ${city} ?`,
        answer: `Une surveillance infirmière de nuit est possible selon disponibilité des prestataires partenaires à ${city}. Précisez vos besoins lors de la demande.`,
      },
      {
        question: `Comment sont calculés les tarifs à ${city} ?`,
        answer: `Selon le type de soin, la durée et la fréquence. Tarifs annoncés à l'avance, sans frais cachés.`,
      },
      {
        question: `Faut-il une ordonnance pour les soins infirmiers à ${city} ?`,
        answer: `Oui, pour la plupart des actes techniques (injections, perfusions, pansements complexes). Notre équipe vous indique les documents nécessaires lors de votre demande.`,
      },
      {
        question: `Puis-je avoir le même infirmier à chaque visite à ${city} ?`,
        answer: `Nous faisons notre possible pour assurer la continuité avec le même infirmier partenaire à ${city}, selon son planning et vos créneaux.`,
      },
    ],
  },

  "medecin-a-domicile": {
    heroSubheadline: (city) =>
      `Consultation et suivi médical à domicile à ${city}. SOS Santé coordonne la mise en relation avec des médecins généralistes partenaires.`,
    seoIntroHeading: (city) =>
      `Médecin à domicile à ${city} : consultation médicale chez vous`,
    seoIntro: (city) =>
      `Besoin d'un médecin à domicile à ${city} ? SOS Santé facilite l'accès à des consultations médicales à domicile pour les personnes à mobilité réduite, les convalescents ou les familles qui préfèrent éviter les déplacements. Notre service de médecin à domicile à ${city} assure une coordination rapide et transparente avec des médecins généralistes partenaires.`,
    whyChoose: sharedWhyChoose,
    valueProps: [
      {
        title: "Consultation à domicile",
        text: (city) =>
          `Examen clinique, diagnostic et prescription réalisés chez vous à ${city} par un médecin généraliste partenaire.`,
        accent: "mint",
      },
      {
        title: "Suivi post-hospitalisation",
        text: (city) =>
          `Reprise du suivi médical après une hospitalisation à ${city}, dans le confort de votre domicile.`,
        accent: "lavender",
      },
      {
        title: "Orientation spécialisée",
        text: (city) =>
          `Si nécessaire, le médecin à domicile à ${city} vous oriente vers un spécialiste ou une structure adaptée.`,
        accent: "peach",
      },
      {
        title: "Gain de temps",
        text: (city) =>
          `Évitez les salles d'attente : la consultation médicale à domicile à ${city} s'adapte à votre emploi du temps.`,
        accent: "rose",
      },
      {
        title: "Transparence",
        text: (city) =>
          `Honoraires et modalités communiqués avant la visite à ${city}. SOS Santé reste votre interlocuteur de coordination.`,
        accent: "sky",
      },
    ],
    expertise: {
      title: "Consultations médicales à domicile",
      paragraphs: (city) => [
        `Le médecin à domicile à ${city} réalise un examen complet, évalue votre état de santé et établit ou renouvelle les prescriptions nécessaires. Cette formule convient aux personnes âgées, aux patients post-opératoires et aux familles avec jeunes enfants.`,
        `SOS Santé n'est pas un cabinet médical : nous coordonnons la mise en relation. En cas d'urgence vitale, contactez les services d'urgence officiels.`,
      ],
      bullets: (city) => [
        `Consultation générale à domicile à ${city}`,
        `Suivi post-hospitalisation à ${city}`,
        `Renouvellement d'ordonnance à ${city}`,
        `Certificats médicaux à domicile à ${city}`,
        `Orientation vers un spécialiste depuis ${city}`,
      ],
    },
    benefits: [
      {
        title: "Confort du patient",
        paragraphs: (city) => [
          `La consultation médicale à domicile à ${city} préserve la dignité et le repos du patient, particulièrement important pour les personnes fragiles ou en fin de convalescence.`,
        ],
      },
      {
        title: "Flexibilité des rendez-vous",
        paragraphs: (city) => [
          `Planifiez votre consultation à domicile à ${city} selon vos disponibilités. Notre équipe cherche un créneau compatible avec le médecin partenaire.`,
        ],
      },
      {
        title: "Suivi personnalisé",
        paragraphs: (city) => [
          `Le médecin observe votre environnement de vie à ${city}, ce qui enrichit le diagnostic et les recommandations pratiques pour votre quotidien.`,
        ],
      },
    ],
    specialties: [
      {
        title: (city) => `Consultation générale à domicile à ${city}`,
        paragraphs: (city) => [
          `Fièvre, infection, douleurs, fatigue : le médecin généraliste à domicile à ${city} examine, diagnostique et prescrit le traitement adapté sans que vous ayez à vous déplacer.`,
        ],
      },
      {
        title: (city) => `Suivi des personnes âgées à ${city}`,
        paragraphs: (city) => [
          `Pour les seniors à ${city}, la visite médicale à domicile limite les risques de chute et de fatigue liés aux trajets, tout en assurant un suivi régulier.`,
        ],
      },
    ],
    trust: sharedTrust,
    community: sharedCommunity,
    extendedFaqs: (city) => [
      {
        question: `Peut-on avoir un médecin à domicile à ${city} ?`,
        answer: `Oui, sur demande et selon disponibilité. SOS Santé coordonne la mise en relation avec un médecin généraliste partenaire à ${city}.`,
      },
      {
        question: `SOS Santé est-il un cabinet médical ?`,
        answer: `Non. Nous sommes un service de coordination. Le médecin partenaire exerce en son nom propre. En urgence vitale, appelez les numéros d'urgence.`,
      },
      {
        question: `Quels actes le médecin peut-il réaliser à domicile à ${city} ?`,
        answer: `Consultation, examen clinique, prescription, certificats et orientation. Les actes nécessitant un équipement hospitalier ne sont pas réalisables à domicile.`,
      },
      {
        question: `Comment prendre rendez-vous à ${city} ?`,
        answer: `Via le formulaire ou WhatsApp. Indiquez vos symptômes, votre adresse à ${city} et vos disponibilités. Nous vous rappelons rapidement.`,
      },
      {
        question: `Quels sont les tarifs d'une consultation à domicile à ${city} ?`,
        answer: `Les honoraires vous sont communiqués avant la visite à ${city}. Transparence totale, sans frais cachés de coordination.`,
      },
      {
        question: `Le médecin à domicile remplace-t-il mon médecin traitant ?`,
        answer: `Non. Il complète votre parcours de soins à ${city}. Pour un suivi chronique régulier, conservez votre médecin traitant.`,
      },
      {
        question: `Intervenez-vous le week-end à ${city} ?`,
        answer: `Selon disponibilité des médecins partenaires à ${city}. Contactez-nous pour vérifier les créneaux week-end et jours fériés.`,
      },
    ],
  },

  "aide-soignant-a-domicile": {
    heroSubheadline: (city) =>
      `Aide-soignant à domicile à ${city} pour l'hygiène, la mobilité et l'accompagnement quotidien des personnes âgées ou dépendantes.`,
    seoIntroHeading: (city) =>
      `Aide-soignant à domicile à ${city} : accompagnement bienveillant`,
    seoIntro: (city) =>
      `Vous recherchez un aide-soignant à domicile à ${city} ? SOS Santé met en relation les familles avec des aide-soignants partenaires pour l'aide à la toilette, l'habillage, la mobilité, la préparation des repas et la surveillance. Notre service d'aide à domicile à ${city} allie réactivité, professionnalisme et respect de la dignité.`,
    whyChoose: sharedWhyChoose,
    valueProps: [
      {
        title: "Aide à la toilette",
        text: (city) =>
          `Hygiène corporelle et confort assurés à domicile à ${city} par des aide-soignants formés et bienveillants.`,
        accent: "mint",
      },
      {
        title: "Aide à la mobilité",
        text: (city) =>
          `Lever, coucher, transferts et déplacements sécurisés à ${city} pour préserver l'autonomie du patient.`,
        accent: "lavender",
      },
      {
        title: "Surveillance nocturne",
        text: (city) =>
          `Garde de nuit à domicile à ${city} selon disponibilité, pour rassurer les familles et veiller sur le patient.`,
        accent: "peach",
      },
      {
        title: "Aide aux repas",
        text: (city) =>
          `Préparation de repas adaptés et aide à la prise alimentaire à domicile à ${city}.`,
        accent: "rose",
      },
      {
        title: "Tarifs annoncés",
        text: (city) =>
          `Forfaits horaires ou packages communiqués clairement à ${city} avant le début de l'accompagnement.`,
        accent: "sky",
      },
    ],
    expertise: {
      title: "Accompagnement au quotidien",
      paragraphs: (city) => [
        `L'aide-soignant à domicile à ${city} intervient pour les actes essentiels du quotidien : toilette, habillage, repas, mobilité et présence rassurante. Il ne réalise pas d'actes médicaux réservés aux infirmiers.`,
        `SOS Santé sélectionne des aide-soignants partenaires expérimentés avec les personnes âgées et les personnes en perte d'autonomie à ${city}.`,
      ],
      bullets: (city) => [
        `Aide à la toilette à domicile à ${city}`,
        `Aide à l'habillage à ${city}`,
        `Aide à la mobilité et transferts à ${city}`,
        `Garde-malade à ${city}`,
        `Surveillance nocturne à ${city}`,
      ],
    },
    benefits: [
      {
        title: "Dignité et respect",
        paragraphs: (city) => [
          `L'aide-soignant à domicile à ${city} intervient avec discrétion et bienveillance, en respectant les habitudes et la vie privée du patient.`,
        ],
      },
      {
        title: "Soulagement des familles",
        paragraphs: (city) => [
          `Les proches retrouvent du répit grâce à un accompagnement fiable à ${city}, que ce soit quelques heures par semaine ou une garde prolongée.`,
        ],
      },
      {
        title: "Maintien à domicile",
        paragraphs: (city) => [
          `L'aide à domicile à ${city} permet de rester chez soi plus longtemps, dans un environnement familier et sécurisé.`,
        ],
      },
    ],
    specialties: [
      {
        title: (city) => `Garde-malade à ${city}`,
        paragraphs: (city) => [
          `Présence diurne ou nocturne à domicile à ${city} pour accompagner une personne dépendante, alerter en cas de besoin et assurer le confort quotidien.`,
        ],
      },
      {
        title: (city) => `Aide aux personnes âgées à ${city}`,
        paragraphs: (city) => [
          `Toilette, repas, promenades et stimulation : l'aide-soignant à domicile à ${city} favorise le bien-être et la socialisation des seniors.`,
        ],
      },
    ],
    trust: sharedTrust,
    community: sharedCommunity,
    extendedFaqs: (city) => [
      {
        question: `Comment trouver un aide-soignant à ${city} ?`,
        answer: `Contactez SOS Santé avec vos besoins (horaires, durée, type d'aide). Nous orientons vers un aide-soignant partenaire disponible à ${city}.`,
      },
      {
        question: `Proposez-vous la garde de nuit à ${city} ?`,
        answer: `Oui, selon disponibilité des prestataires partenaires à ${city}. Précisez vos besoins lors de la demande.`,
      },
      {
        question: `L'aide-soignant peut-il administrer des médicaments à ${city} ?`,
        answer: `L'aide au traitement oui, mais pas d'actes infirmiers (injections, perfusions). Pour des soins médicaux à ${city}, demandez un infirmier à domicile.`,
      },
      {
        question: `Quels tarifs pour un aide-soignant à domicile à ${city} ?`,
        answer: `Tarifs horaires ou forfaits selon la durée et le type d'accompagnement à ${city}. Annoncés à l'avance, sans surprise.`,
      },
      {
        question: `Intervention ponctuelle ou régulière à ${city} ?`,
        answer: `Les deux. Quelques heures par semaine ou accompagnement quotidien à ${city}, selon vos besoins et la disponibilité.`,
      },
      {
        question: `Les aide-soignants sont-ils qualifiés à ${city} ?`,
        answer: `Oui, nous orientons vers des aide-soignants diplômés et expérimentés. SOS Santé vérifie les références avant mise en relation.`,
      },
      {
        question: `Puis-je essayer avant un engagement long à ${city} ?`,
        answer: `Oui, une première intervention ou période d'essai est possible à ${city} selon disponibilité, pour valider l'adéquation avec le patient.`,
      },
    ],
  },

  "ambulance-maroc": {
    heroSubheadline: (city) =>
      `Transport médical et ambulance à ${city} et au Maroc. SOS Santé coordonne avec des prestataires partenaires selon disponibilité.`,
    seoIntroHeading: (city) =>
      `Ambulance à ${city} : transport médical coordonné`,
    seoIntro: (city) =>
      `Besoin d'une ambulance à ${city} ? SOS Santé coordonne le transport médical et l'ambulance à domicile avec des prestataires partenaires au Maroc. Transferts médicalisés, transport inter-villes et mise à disposition selon disponibilité. Notre service d'ambulance à ${city} assure une prise en charge rapide et transparente.`,
    whyChoose: [
      {
        number: "01",
        title: "Coordination rapide",
        text: (city) =>
          `Contactez SOS Santé à ${city} par téléphone ou WhatsApp. Nous vérifions la disponibilité d'un transporteur partenaire et vous confirmons les modalités dans les meilleurs délais.`,
      },
      {
        number: "02",
        title: "Transport médicalisé",
        text: (city) =>
          `Ambulances équipées pour le transport de patients à ${city} et entre villes, selon l'état de santé et les recommandations médicales.`,
      },
      {
        number: "03",
        title: "Couverture élargie",
        text: (city) =>
          `Depuis ${city}, nous coordonnons des transferts vers d'autres villes du Maroc : Rabat, Casablanca, Marrakech et au-delà, selon disponibilité.`,
      },
    ],
    valueProps: [
      {
        title: "Transport médicalisé",
        text: (city) =>
          `Ambulance avec matériel adapté pour le transport sécurisé de patients à ${city}.`,
        accent: "mint",
      },
      {
        title: "Transfert inter-villes",
        text: (city) =>
          `Depuis ${city}, transferts vers hôpitaux, cliniques ou domicile dans d'autres villes du Maroc.`,
        accent: "lavender",
      },
      {
        title: "Disponibilité confirmée",
        text: (city) =>
          `Nous confirmons la disponibilité et le délai d'intervention avant validation à ${city}.`,
        accent: "peach",
      },
      {
        title: "Tarifs annoncés",
        text: (city) =>
          `Devis transparent pour le transport ambulance à ${city}, selon distance et type de véhicule.`,
        accent: "rose",
      },
      {
        title: "Accompagnement",
        text: (city) =>
          `Notre équipe reste joignable pendant la coordination du transport à ${city}.`,
        accent: "sky",
      },
    ],
    expertise: {
      title: "Transport médical à domicile",
      paragraphs: (city) => [
        `SOS Santé coordonne l'ambulance à ${city} pour les transferts médicaux non urgents, les retours de clinique et les déplacements inter-établissements. Nous ne sommes pas un service d'urgence vitale officiel.`,
        `En cas d'urgence vitale, composez immédiatement les numéros d'urgence compétents. Pour un transport médical planifié ou semi-urgent à ${city}, contactez notre équipe.`,
      ],
      bullets: (city) => [
        `Ambulance à domicile à ${city}`,
        `Transport médicalisé à ${city}`,
        `Transfert inter-villes depuis ${city}`,
        `Retour de clinique à ${city}`,
        `Transport patient alité à ${city}`,
      ],
    },
    benefits: [
      {
        title: "Simplicité de réservation",
        paragraphs: (city) => [
          `Une seule prise de contact avec SOS Santé à ${city} pour organiser votre transport ambulance. Nous gérons la coordination avec le prestataire partenaire.`,
        ],
      },
      {
        title: "Transparence des tarifs",
        paragraphs: (city) => [
          `Le devis transport à ${city} est communiqué avant validation : distance, type d'ambulance, accompagnement médical si nécessaire.`,
        ],
      },
      {
        title: "Couverture nationale",
        paragraphs: (city) => [
          `Depuis ${city}, nous coordonnons des transferts vers l'ensemble du Maroc selon disponibilité des transporteurs partenaires.`,
        ],
      },
    ],
    specialties: [
      {
        title: (city) => `Ambulance à domicile à ${city}`,
        paragraphs: (city) => [
          `Prise en charge à votre domicile à ${city} et transport vers hôpital, clinique ou autre destination, avec véhicule médicalisé adapté.`,
        ],
      },
      {
        title: (city) => `Transfert inter-villes depuis ${city}`,
        paragraphs: (city) => [
          `Transport médical de ${city} vers Rabat, Casablanca, Marrakech ou toute autre ville du Maroc, selon disponibilité et prescription médicale si requise.`,
        ],
      },
    ],
    trust: sharedTrust,
    community: sharedCommunity,
    extendedFaqs: (city) => [
      {
        question: `Comment réserver une ambulance à ${city} ?`,
        answer: `Contactez SOS Santé par téléphone ou WhatsApp. Indiquez l'adresse de départ à ${city}, la destination, l'état du patient et l'urgence. Nous confirmons la disponibilité.`,
      },
      {
        question: `Intervenez-vous en urgence vitale à ${city} ?`,
        answer: `Non. SOS Santé n'est pas un service d'urgence officiel. En urgence vitale, composez les numéros d'urgence. Nous coordonnons le transport médical selon disponibilité.`,
      },
      {
        question: `Quels types d'ambulance à ${city} ?`,
        answer: `VSL, ambulance simple ou médicalisée selon l'état du patient et la distance. Nous vous orientons vers le véhicule adapté à ${city}.`,
      },
      {
        question: `Tarifs ambulance à ${city} ?`,
        answer: `Selon distance, type de véhicule et horaire. Devis communiqué avant validation, sans frais cachés.`,
      },
      {
        question: `Transfert de ${city} vers une autre ville ?`,
        answer: `Oui, nous coordonnons des transferts inter-villes depuis ${city} vers Rabat, Casablanca, Marrakech et autres destinations au Maroc.`,
      },
      {
        question: `Faut-il une prescription médicale à ${city} ?`,
        answer: `Pour certains transports médicalisés, oui. Notre équipe vous indique les documents nécessaires lors de votre demande à ${city}.`,
      },
      {
        question: `Délai d'intervention ambulance à ${city} ?`,
        answer: `Variable selon disponibilité et urgence. Contactez-nous pour une estimation en temps réel à ${city}.`,
      },
    ],
  },
};

export function getCareServiceSeoProfile(serviceSlug: string) {
  return careServiceSeoProfiles[serviceSlug] ?? null;
}

export type CareServiceResolvedSeo = {
  heroSubheadline: string;
  seoIntroHeading: string;
  seoIntro: string;
  whyChoose: { number: string; title: string; text: string }[];
  valueProps: {
    title: string;
    text: string;
    accent: CareServiceValueProp["accent"];
  }[];
  expertise: { title: string; paragraphs: string[]; bullets?: string[] };
  benefits: { title: string; paragraphs: string[] }[];
  specialties: { title: string; paragraphs: string[] }[];
  trust: { title: string; paragraphs: string[] };
  community: { title: string; paragraphs: string[] };
};

export function resolveCareServiceSeo(
  profile: CareServiceSeoProfile,
  city: string
): CareServiceResolvedSeo {
  return {
    heroSubheadline: profile.heroSubheadline(city),
    seoIntroHeading: profile.seoIntroHeading(city),
    seoIntro: profile.seoIntro(city),
    whyChoose: profile.whyChoose.map((card) => ({
      number: card.number,
      title: card.title,
      text: card.text(city),
    })),
    valueProps: profile.valueProps.map((prop) => ({
      title: prop.title,
      text: prop.text(city),
      accent: prop.accent,
    })),
    expertise: resolveContentBlock(profile.expertise, city),
    benefits: profile.benefits.map((block) => resolveContentBlock(block, city)),
    specialties: profile.specialties.map((block) =>
      resolveContentBlock(block, city)
    ),
    trust: resolveContentBlock(profile.trust, city),
    community: resolveContentBlock(profile.community, city),
  };
}
