import type { CitySlug } from "@/lib/cities";
import { getCityBySlug } from "@/lib/cities";

export function getVenteCatalogFaqs(citySlug: CitySlug) {
  const city = getCityBySlug(citySlug)!;

  return [
    {
      question: `Comment commander du matériel médical à ${city.name} ?`,
      answer: `Parcourez le catalogue, ouvrez la fiche produit et envoyez une demande de devis. Notre équipe vous répond rapidement avec disponibilité, livraison et conditions.`,
    },
    {
      question: "Les prix sont-ils affichés en ligne ?",
      answer:
        "Nous travaillons sur devis personnalisé : le tarif dépend du produit, de la quantité et de la zone de livraison. Contactez-nous pour une proposition adaptée.",
    },
    {
      question: `Livrez-vous à ${city.name} et environs ?`,
      answer: city.deliveryText,
    },
    {
      question: "Le matériel est-il neuf et certifié ?",
      answer:
        "Oui. Nous proposons du matériel neuf ou reconditionné contrôlé, conforme aux usages médicaux, avec conseil à la commande.",
    },
  ];
}
