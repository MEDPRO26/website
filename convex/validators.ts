import { v } from "convex/values";

export const orderStatusValidator = v.union(
  v.literal("nouvelle"),
  v.literal("a_qualifier"),
  v.literal("a_affecter"),
  v.literal("envoyee_fournisseur"),
  v.literal("vue_fournisseur"),
  v.literal("prix_recu"),
  v.literal("offre_envoyee"),
  v.literal("acceptee"),
  v.literal("planifiee"),
  v.literal("en_cours"),
  v.literal("location_active"),
  v.literal("terminee"),
  v.literal("annulee"),
  v.literal("reclamation")
);

export const roleValidator = v.union(
  v.literal("super_admin"),
  v.literal("admin"),
  v.literal("assistant"),
  v.literal("supplier"),
  v.literal("customer")
);

export const staffStatusValidator = v.union(
  v.literal("actif"),
  v.literal("suspendu"),
  v.literal("en_attente")
);

export const customerStatusValidator = v.union(
  v.literal("actif"),
  v.literal("vip"),
  v.literal("inactif")
);

export const orderEventTypeValidator = v.union(
  v.literal("created"),
  v.literal("status_change"),
  v.literal("note"),
  v.literal("assignment"),
  v.literal("quote"),
  v.literal("offer"),
  v.literal("system")
);

export const supplierQuoteStatusValidator = v.union(
  v.literal("draft"),
  v.literal("submitted"),
  v.literal("accepted"),
  v.literal("rejected")
);

export const clientOfferStatusValidator = v.union(
  v.literal("draft"),
  v.literal("sent"),
  v.literal("accepted"),
  v.literal("rejected"),
  v.literal("expired")
);

export const supplierStatusValidator = v.union(
  v.literal("actif"),
  v.literal("suspendu"),
  v.literal("en_attente")
);

export const supplierInvitationStatusValidator = v.union(
  v.literal("pending"),
  v.literal("accepted"),
  v.literal("expired"),
  v.literal("cancelled")
);

export const complaintStatusValidator = v.union(
  v.literal("ouverte"),
  v.literal("en_traitement"),
  v.literal("resolue")
);

export const complaintPriorityValidator = v.union(
  v.literal("basse"),
  v.literal("moyenne"),
  v.literal("haute")
);

export const notificationTypeValidator = v.union(
  v.literal("order"),
  v.literal("supplier"),
  v.literal("complaint"),
  v.literal("commission"),
  v.literal("system")
);

export const conversationStatusValidator = v.union(
  v.literal("nouveau"),
  v.literal("en_cours"),
  v.literal("traite")
);

export const cmsPageTypeValidator = v.union(
  v.literal("page"),
  v.literal("service"),
  v.literal("materiel"),
  v.literal("ville"),
  v.literal("blog")
);

export const cmsPageStatusValidator = v.union(
  v.literal("published"),
  v.literal("draft")
);

export const whatsappChannelStatusValidator = v.union(
  v.literal("active"),
  v.literal("paused")
);

export const whatsappProviderValidator = v.union(
  v.literal("manual"),
  v.literal("meta"),
  v.literal("360dialog"),
  v.literal("disabled")
);

export const auditActionValidator = v.union(
  v.literal("create"),
  v.literal("update"),
  v.literal("delete"),
  v.literal("status_change"),
  v.literal("system")
);
