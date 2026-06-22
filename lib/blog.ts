export type BlogSection = {
  type: "paragraph" | "heading" | "list" | "tip" | "faq";
  content?: string;
  items?: string[];
  title?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  image: string;
  alt: string;
  sections: BlogSection[];
  relatedProducts?: string[];
  faqs?: { question: string; answer: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "quel-lit-medicalise-choisir-senior",
    title: "Quel lit médicalisé choisir pour une personne âgée ?",
    metaTitle:
      "Quel lit médicalisé choisir pour senior | Guide MediDomicile",
    metaDescription:
      "Découvrez comment choisir un lit médicalisé pour personne âgée : dimensions, réglages électriques, accessoires et prix de location à Agadir.",
    excerpt:
      "Guide complet pour choisir le bon lit médicalisé électrique selon l’autonomie, l’espace disponible et les besoins de soins.",
    category: "Confort",
    readTime: "6 min",
    publishedAt: "2026-06-20",
    modifiedAt: "2026-06-20",
    author: "MediDomicile",
    image: "/products/lit-medicalise-electrique.jpg",
    alt: "Lit médicalisé électrique pour senior dans une chambre",
    sections: [
      {
        type: "paragraph",
        content:
          "Choisir un lit médicalisé pour une personne âgée dépend de plusieurs critères : son niveau d’autonomie, la fréquence des soins, l’espace disponible dans la chambre et le budget. Un bon lit médicalisé améliore le confort, facilite les soins et réduit les risques de chutes.",
      },
      {
        type: "heading",
        content: "Les critères essentiels de choix",
      },
      {
        type: "list",
        items: [
          "Hauteur réglable électriquement pour faciliter les transferts",
          "Réglage du dossier et des jambes pour le confort respiratoire et la circulation",
          "Barrières de sécurité latérales pour éviter les chutes",
          "Dimensions adaptées à la chambre et au matelas",
          "Roulettes avec freins pour des déplacements ponctuels",
        ],
      },
      {
        type: "heading",
        content: "Lit médicalisé manuel ou électrique ?",
      },
      {
        type: "paragraph",
        content:
          "Le lit électrique est recommandé pour les personnes à mobilité réduite ou les aidants qui interviennent fréquemment. Le réglage se fait par télécommande, ce qui permet d’adapter la position sans effort. Le lit manuel convient aux besoins temporaires et aux budgets plus serrés.",
      },
      {
        type: "tip",
        title: "Conseil MediDomicile",
        content:
          "Pour une location courte durée ou une convalescence, privilégiez un lit médicalisé électrique. Il offre plus d’autonomie au patient et facilite le travail des soignants.",
      },
      {
        type: "heading",
        content: "Prix de location d’un lit médicalisé à Agadir",
      },
      {
        type: "paragraph",
        content:
          "Le prix de location d’un lit médicalisé à Agadir varie selon la durée et les options choisies. Chez MediDomicile, la livraison et l’installation sont incluses. Contactez-nous pour un devis personnalisé sous 15 minutes.",
      },
    ],
    relatedProducts: ["lit-medicalise-agadir", "matelas-air-anti-escarres"],
    faqs: [
      {
        question: "Quelles sont les dimensions d’un lit médicalisé standard ?",
        answer:
          "Un lit médicalisé standard mesure 90 cm de large sur 200 cm de long. Nous proposons également des largeurs adaptées selon les besoins.",
      },
      {
        question: "Le lit médicalisé est-il livré monté ?",
        answer:
          "Oui, notre équipe livre et installe le lit médicalisé chez vous à Agadir. Nous vous expliquons également le fonctionnement de la télécommande.",
      },
    ],
  },
  {
    slug: "comment-choisir-fauteuil-roulant",
    title: "Comment choisir un fauteuil roulant ?",
    metaTitle: "Comment choisir un fauteuil roulant | Guide complet",
    metaDescription:
      "Apprenez à choisir un fauteuil roulant adapté : pliable, léger, électrique ou manuel. Conseils et tarifs de location à Agadir et au Maroc.",
    excerpt:
      "Manuel, électrique, pliable ou standard : voici les critères pour choisir un fauteuil roulant adapté à votre mobilité et votre quotidien.",
    category: "Mobilité",
    readTime: "5 min",
    publishedAt: "2026-06-20",
    modifiedAt: "2026-06-20",
    author: "MediDomicile",
    image: "/products/fauteuil-roulant-leger.jpg",
    alt: "Fauteuil roulant léger dans un intérieur clair",
    sections: [
      {
        type: "paragraph",
        content:
          "Le choix d’un fauteuil roulant dépend de l’usage quotidien, de la force physique de l’utilisateur ou de l’aidant, et des déplacements prévus. Un mauvais choix peut entraîner fatigue, inconfort ou difficultés de manipulation.",
      },
      {
        type: "heading",
        content: "Fauteuil roulant manuel ou électrique ?",
      },
      {
        type: "paragraph",
        content:
          "Le fauteuil manuel est léger, pliable et facile à transporter. Il convient aux personnes ayant une bonne force dans les bras ou disposant d’un aidant. Le fauteuil électrique offre une autonomie totale pour les déplacements intérieurs et extérieurs.",
      },
      {
        type: "heading",
        content: "Les points à vérifier avant de louer",
      },
      {
        type: "list",
        items: [
          "Poids du fauteuil pour le transport",
          "Largeur d’assise et confort",
          "Pliage rapide pour la voiture",
          "Freins accessibles et fiables",
          "Repose-pieds et accoudoirs amovibles",
        ],
      },
      {
        type: "heading",
        content: "Location de fauteuil roulant à Agadir",
      },
      {
        type: "paragraph",
        content:
          "MediDomicile propose la location de fauteuils roulants légers à Agadir et dans tout le Maroc. La livraison est incluse et le matériel est désinfecté avant chaque location.",
      },
    ],
    relatedProducts: ["fauteuil-roulant-leger", "rollator-4-roues"],
    faqs: [
      {
        question: "Quel fauteuil roulant choisir pour une sortie occasionnelle ?",
        answer:
          "Pour une utilisation occasionnelle, choisissez un fauteuil pliable et léger en aluminium, facile à transporter dans le coffre d’une voiture.",
      },
      {
        question: "Puis-je louer un fauteuil roulant pour une semaine ?",
        answer:
          "Oui, la durée minimale de location est généralement d’une semaine. Nous proposons aussi des tarifs dégressifs pour les locations longue durée.",
      },
    ],
  },
  {
    slug: "guide-concentrateur-oxygene",
    title: "Concentrateur d’oxygène : guide d’utilisation à domicile",
    metaTitle:
      "Concentrateur d'oxygène : guide d'utilisation | MediDomicile",
    metaDescription:
      "Tout savoir sur le concentrateur d’oxygène à domicile : fonctionnement, débit, entretien et location à Agadir et au Maroc.",
    excerpt:
          "Guide pratique pour utiliser un concentrateur d’oxygène en toute sécurité à domicile : réglages, entretien et précautions.",
    category: "Respiratoire",
    readTime: "7 min",
    publishedAt: "2026-06-20",
    modifiedAt: "2026-06-20",
    author: "MediDomicile",
    image: "/products/concentrateur-oxygene.jpg",
    alt: "Concentrateur d'oxygène blanc sur fond médical épuré",
    sections: [
      {
        type: "paragraph",
        content:
          "Le concentrateur d’oxygène est un appareil médical qui aspire l’air ambiant, le filtre et restitue de l’oxygène concentré au patient via une tubulure. Il est prescrit pour les personnes souffrant d’insuffisance respiratoire, de BPCO ou d’autres pathologies pulmonaires.",
      },
      {
        type: "heading",
        content: "Comment fonctionne un concentrateur d’oxygène ?",
      },
      {
        type: "list",
        items: [
          "L’appareil aspire l’air ambiant",
          "Il filtre l’azote et concentre l’oxygène",
          "L’oxygène est délivré au patient par une tubulure nasale",
          "Le débit est réglable selon la prescription médicale",
        ],
      },
      {
        type: "heading",
        content: "Entretien et précautions",
      },
      {
        type: "paragraph",
        content:
          "Il est important de vérifier régulièrement le filtre à air, de nettoyer la tubulure et de respecter la distance de sécurité avec des sources de chaleur. L’appareil doit rester allumé en continu selon les recommandations du médecin.",
      },
      {
        type: "tip",
        title: "À savoir",
        content:
          "Nos concentrateurs sont silencieux et économiques en énergie. Nous vous expliquons le fonctionnement lors de l’installation à domicile.",
      },
    ],
    relatedProducts: ["concentrateur-oxygene"],
    faqs: [
      {
        question: "Quel débit d’oxygène faut-il régler ?",
        answer:
          "Le débit est défini par le médecin traitant. Il ne doit jamais être modifié sans avis médical.",
      },
      {
        question: "Le concentrateur d’oxygène fait-il du bruit ?",
        answer:
          "Nos concentrateurs sont sélectionnés pour leur faible niveau sonore, généralement inférieur à 45 dB, comparable à un réfrigérateur.",
      },
    ],
  },
  {
    slug: "location-vs-achat-materiel-medical",
    title: "Location ou achat de matériel médical : que choisir ?",
    metaTitle:
      "Location ou achat matériel médical | Guide MediDomicile",
    metaDescription:
      "Location ou achat de matériel médical ? Découvrez les avantages de la location à domicile à Agadir : flexibilité, entretien inclus, pas d’engagement.",
    excerpt:
      "Pourquoi louer plutôt qu’acheter son matériel médical ? Analyse des avantages, coûts et situations où la location est préférable.",
    category: "Conseils",
    readTime: "5 min",
    publishedAt: "2026-06-20",
    modifiedAt: "2026-06-20",
    author: "MediDomicile",
    image: "/medidomicile-hero.jpg",
    alt: "Matériel médical à domicile : lit et fauteuil roulant",
    sections: [
      {
        type: "paragraph",
        content:
          "Face à un besoin temporaire de matériel médical, beaucoup de familles hésitent entre l’achat et la location. La location présente de nombreux avantages pratiques et économiques, notamment pour les convalescences, les post-opératoires et le maintien à domicile.",
      },
      {
        type: "heading",
        content: "Avantages de la location",
      },
      {
        type: "list",
        items: [
          "Pas d’investissement initial lourd",
          "Flexibilité selon la durée du besoin",
          "Entretien, réparation et désinfection inclus",
          "Livraison et installation à domicile",
          "Matériel adapté et récent",
        ],
      },
      {
        type: "heading",
        content: "Quand acheter plutôt que louer ?",
      },
      {
        type: "paragraph",
        content:
          "L’achat est pertinent lorsque le besoin est permanent et que l’utilisateur maîtrise parfaitement l’entretien du matériel. Dans la plupart des cas de convalescence ou de dépendance progressive, la location reste la solution la plus sereine.",
      },
      {
        type: "heading",
        content: "Tarifs de location à Agadir",
      },
      {
        type: "paragraph",
        content:
          "Chez MediDomicile, les tarifs de location sont transparents et adaptés à la durée. La livraison et l’installation sont incluses à Agadir. Demandez un devis personnalisé pour connaître le coût selon votre matériel et votre ville.",
      },
    ],
    relatedProducts: [
      "lit-medicalise-agadir",
      "fauteuil-roulant-leger",
      "concentrateur-oxygene",
    ],
    faqs: [
      {
        question: "La location de matériel médical est-elle moins chère que l’achat ?",
        answer:
          "Sur une courte ou moyenne durée, la location est souvent plus économique. Elle évite aussi les frais d’entretien et de stockage.",
      },
      {
        question: "Puis-je changer de matériel pendant la location ?",
        answer:
          "Oui, selon la disponibilité, nous pouvons adapter le matériel à l’évolution des besoins du patient.",
      },
    ],
  },
  {
    slug: "matelas-anti-escarres-fonctionnement",
    title: "Matelas anti-escarres : comment ça marche ?",
    metaTitle:
      "Matelas anti-escarres : fonctionnement et utilisation | MediDomicile",
    metaDescription:
      "Comprendre le fonctionnement du matelas à air anti-escarres, ses bénéfices pour les personnes alitées et les tarifs de location à Agadir.",
    excerpt:
      "Le matelas à air anti-escarres prévient les plaies de pression. Découvrez son fonctionnement et quand il est recommandé.",
    category: "Confort",
    readTime: "5 min",
    publishedAt: "2026-06-20",
    modifiedAt: "2026-06-20",
    author: "MediDomicile",
    image: "/products/matelas-air-anti-escarres.jpg",
    alt: "Matelas à air anti-escarres pour lit médicalisé",
    sections: [
      {
        type: "paragraph",
        content:
          "Le matelas anti-escarres est un dispositif médical essentiel pour les personnes alitées longtemps. Il répartit la pression du corps de manière dynamique pour prévenir l’apparition des plaies de pression, également appelées escarres.",
      },
      {
        type: "heading",
        content: "Fonctionnement du matelas à air",
      },
      {
        type: "list",
        items: [
          "Des cellules gonflables se relaient pour modifier les points de pression",
          "Un compresseur silencieux assure le mouvement alterné",
          "La pression est réglable selon le poids du patient",
          "Le matelas s’adapte à la plupart des lits médicalisés",
        ],
      },
      {
        type: "heading",
        content: "Qui a besoin d’un matelas anti-escarres ?",
      },
      {
        type: "paragraph",
        content:
          "Il est recommandé pour les personnes alitées de façon prolongée, les seniors à mobilité réduite, les patients en post-opératoire et toute personne présentant un risque élevé de développer des escarres.",
      },
      {
        type: "heading",
        content: "Location à domicile à Agadir",
      },
      {
        type: "paragraph",
        content:
          "MediDomicile loue des matelas à air anti-escarres à Agadir avec livraison et installation. Chaque matelas est nettoyé et désinfecté avant location.",
      },
    ],
    relatedProducts: ["matelas-air-anti-escarres", "lit-medicalise-agadir"],
    faqs: [
      {
        question: "Un matelas anti-escarres est-il bruyant ?",
        answer:
          "Non, nos matelas sont équipés de compresseurs silencieux adaptés à un usage nocturne.",
      },
      {
        question: "Faut-il un lit médicalisé pour utiliser ce matelas ?",
        answer:
          "Non, le matelas s’adapte à la plupart des lits standards, mais il est idéalement associé à un lit médicalisé pour les soins.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
