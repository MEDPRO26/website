export const blogPosts = [
  {
    slug: "concentreur-oxygene-agadir-avantages",
    title: "Concentrateur d’oxygène à Agadir : avantages et utilisation",
    excerpt:
      "Tout savoir sur le concentrateur d’oxygène : fonctionnement, entretien, coût de location et livraison à domicile à Agadir.",
    metaTitle:
      "Concentrateur d’oxygène à Agadir : location, prix et conseils | SOS Santé",
    metaDescription:
      "Louez un concentrateur d’oxygène à Agadir avec livraison et maintenance. Découvrez les avantages, l’entretien et les tarifs de location.",
    category: "Conseil",
    author: "SOS Santé",
    publishedAt: "2026-06-15",
    modifiedAt: "2026-06-15",
    readTime: "5 min",
    image: "/products/concentrateur-oxygene-5l.webp",
    alt: "Concentrateur d’oxygène stationnaire pour utilisation à domicile",
    sections: [
      {
        type: "paragraph",
        content:
          "Le concentrateur d’oxygène est un appareil médical qui extrait l’oxygène de l’air ambiant et le délivre au patient de manière continue. Il remplace souvent les bouteilles d’oxygène encombrantes.",
      },
      {
        type: "heading",
        content: "Les avantages du concentrateur d’oxygène",
      },
      {
        type: "list",
        items: [
          "Oxygène illimité sans changer de bouteille",
          "Plus sûr et plus pratique au quotidien",
          "Fonctionnement silencieux sur prise électrique",
          "Solution économique pour une utilisation prolongée",
        ],
      },
      {
        type: "heading",
        content: "Location à domicile à Agadir",
      },
      {
        type: "paragraph",
        content:
          "SOS Santé livre et installe le concentrateur d’oxygène à votre domicile à Agadir. Nous vous expliquons le fonctionnement et assurons le suivi technique.",
      },
      {
        type: "tip",
        title: "Entretien",
        content:
          "Nettoyez régulièrement le filtre à air et vérifiez le positionnement de l’appareil pour une ventilation optimale.",
      },
    ],
    faqs: [
      {
        question: "Faut-il une ordonnance pour louer un concentrateur d’oxygène ?",
        answer:
          "Il est recommandé de consulter votre médecin. Notre équipe peut vous accompagner selon les indications médicales.",
      },
      {
        question: "Livrez-vous en urgence à Agadir ?",
        answer:
          "Oui, nous assurons une livraison rapide du concentrateur d’oxygène à Agadir et aux environs.",
      },
    ],
    relatedProducts: ["concentrateur-oxygene-5l", "concentrateur-oxygene-10l-optimium"],
  },
];

export type BlogPost = (typeof blogPosts)[number];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
