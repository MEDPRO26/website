/** Default admin push bodies by audience (Push mobile + Kanban reminder). */
export const DEFAULT_PUSH_BODY = {
  all: "",
  materiel:
    "Une nouvelle commande est disponible dans votre espace fournisseur et attend votre réponse.",
  soins:
    "Une nouvelle commande est disponible dans votre espace prestataire et attend votre réponse.",
  apporteurs:
    "Une nouvelle commande est disponible dans votre espace apporteur et attend votre réponse.",
} as const;

export const DEFAULT_PUSH_TITLE = "Message S2MBO";
