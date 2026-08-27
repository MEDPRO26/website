import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { computeApportRow } from "../lib/apport-affaires";
import {
  requireAdminStaff,
  requireApportViewer,
  requireApporteurStaff,
} from "./lib/authz";

const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
const ATTACHMENT_MAX_COUNT = 5;
const MAX_UNPAID_OPENED = 2;

function unpaidLockMessage(unpaidCount: number) {
  return `Vous avez ${unpaidCount} projet${unpaidCount > 1 ? "s" : ""} non payé${unpaidCount > 1 ? "s" : ""}. Réglez-les tous dans Honoraires S2MBO pour ouvrir les prochains projets.`;
}

const attachmentValidator = v.object({
  storageId: v.id("_storage"),
  fileName: v.string(),
  contentType: v.string(),
});

function isDemandeUnpaid(demande: Doc<"apportDemandes">) {
  return Boolean(demande.openedAt) && demande.paymentStatus !== "paid";
}

async function countUnpaidOpened(
  ctx: MutationCtx,
  apporteurId: Id<"apporteurs">
) {
  const rows = await ctx.db
    .query("apportDemandes")
    .withIndex("by_apporteurId", (q) => q.eq("apporteurId", apporteurId))
    .collect();
  return rows.filter(isDemandeUnpaid).length;
}

async function appendDemandeEvent(
  ctx: MutationCtx,
  args: {
    demandeId: Id<"apportDemandes">;
    type:
      | "created"
      | "opened"
      | "commission_update"
      | "paid"
      | "payment_submitted"
      | "devis_uploaded"
      | "status_change"
      | "assigned"
      | "system";
    label: string;
    actorStaffId?: Id<"staff">;
  }
) {
  await ctx.db.insert("apportDemandeEvents", {
    demandeId: args.demandeId,
    type: args.type,
    label: args.label,
    actorStaffId: args.actorStaffId,
    createdAt: Date.now(),
  });
}

function normalizeDemandeFields(args: {
  date?: string;
  clientName: string;
  projectType: string;
  localisation?: string;
  phone?: string;
  note: string;
}) {
  const date = args.date?.trim() || undefined;
  const clientName = args.clientName.trim();
  const projectType = args.projectType.trim();
  const localisation = args.localisation?.trim() || undefined;
  const phone = args.phone?.trim() || undefined;
  const note = args.note.trim();

  if (!clientName) {
    throw new Error("Indiquez le nom du client.");
  }
  if (!projectType) {
    throw new Error("Indiquez le type de projet.");
  }
  if (clientName.length > 120) {
    throw new Error("Le nom du client est trop long (120 caractères max).");
  }
  if (projectType.length > 120) {
    throw new Error("Le type de projet est trop long (120 caractères max).");
  }
  if (localisation && localisation.length > 300) {
    throw new Error("La localisation est trop longue (300 caractères max).");
  }
  if (phone && phone.length > 40) {
    throw new Error("Le numéro de téléphone est trop long (40 caractères max).");
  }
  if (note.length > 2000) {
    throw new Error("La note est trop longue (2000 caractères max).");
  }

  return { date, clientName, projectType, localisation, phone, note };
}

function isAllowedAttachment(contentType: string | null | undefined) {
  if (!contentType) return false;
  return contentType.startsWith("image/") || contentType === "application/pdf";
}

async function assertAttachment(
  ctx: MutationCtx,
  storageId: Id<"_storage">,
  fileName: string
) {
  const meta = await ctx.storage.getMetadata(storageId);
  if (!meta) {
    throw new Error(`Fichier introuvable : ${fileName}`);
  }
  if (!isAllowedAttachment(meta.contentType)) {
    throw new Error(
      `« ${fileName} » doit être une image (JPG, PNG, WebP) ou un PDF.`
    );
  }
  if (meta.size > ATTACHMENT_MAX_BYTES) {
    throw new Error(`« ${fileName} » ne doit pas dépasser 10 Mo.`);
  }
  return meta.contentType ?? "application/octet-stream";
}

async function normalizeAttachments(
  ctx: MutationCtx,
  attachments:
    | {
        storageId: Id<"_storage">;
        fileName: string;
        contentType?: string;
      }[]
    | undefined
) {
  if (!attachments?.length) return undefined;
  if (attachments.length > ATTACHMENT_MAX_COUNT) {
    throw new Error(`Maximum ${ATTACHMENT_MAX_COUNT} fichiers par demande.`);
  }

  return await Promise.all(
    attachments.map(async (item) => {
      const fileName = item.fileName.trim().slice(0, 180) || "fichier";
      const contentType = await assertAttachment(ctx, item.storageId, fileName);
      return {
        storageId: item.storageId,
        fileName,
        contentType: item.contentType?.trim() || contentType,
      };
    })
  );
}

function isoDateFromTimestamp(ts: number) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Mirror commission fields onto Tableau de suivi (apportDeals) for admin + apporteur. */
async function syncDemandeToSuivi(
  ctx: MutationCtx,
  demande: Doc<"apportDemandes">,
  createdBy: Id<"staff">
) {
  const linked = await ctx.db
    .query("apportDeals")
    .withIndex("by_demandeId", (q) => q.eq("demandeId", demande._id))
    .unique();

  const hasCommission =
    (demande.contractAmount != null && demande.contractAmount > 0) ||
    demande.customRate != null ||
    Boolean(demande.observation?.trim());

  if (!hasCommission) {
    if (linked) {
      await ctx.db.delete(linked._id);
    }
    return;
  }

  const now = Date.now();
  const date =
    demande.date?.trim() || isoDateFromTimestamp(demande.createdAt);
  const client = demande.clientName.trim();
  const phone = demande.phone?.trim() || undefined;
  const computed = computeApportRow({
    contractAmount: demande.contractAmount,
    customRate: demande.customRate,
    depositReceived: linked?.depositReceived ?? 0,
  });
  const depositReceived =
    demande.paymentStatus === "paid"
      ? demande.paymentAmountSent != null && demande.paymentAmountSent > 0
        ? demande.paymentAmountSent
        : computed.commissionDue != null
          ? computed.commissionDue
          : (linked?.depositReceived ?? 0)
      : (linked?.depositReceived ?? 0);

  const payload = {
    date,
    client,
    ...(phone ? { phone } : {}),
    contractAmount: demande.contractAmount,
    ...(demande.customRate != null ? { customRate: demande.customRate } : {}),
    apporteurId: demande.apporteurId,
    demandeId: demande._id,
    depositReceived,
    observation: demande.observation,
    sortOrder: linked?.sortOrder ?? now,
    createdBy: linked?.createdBy ?? createdBy,
    createdAt: linked?.createdAt ?? now,
    updatedAt: now,
  };

  if (linked) {
    await ctx.db.replace(linked._id, payload);
  } else {
    await ctx.db.insert("apportDeals", payload);
  }
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const generatePaymentUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireApporteurStaff(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await requireApportViewer(ctx);
    const rows =
      viewer.kind === "admin"
        ? await ctx.db.query("apportDemandes").collect()
        : await ctx.db
            .query("apportDemandes")
            .withIndex("by_apporteurId", (q) =>
              q.eq("apporteurId", viewer.apporteurId!)
            )
            .collect();

    const unpaidCount =
      viewer.kind === "apporteur"
        ? rows.filter(isDemandeUnpaid).length
        : 0;

    const sorted = rows.sort((a, b) => b.createdAt - a.createdAt);

    return await Promise.all(
      sorted.map(async (row) => {
        const apporteur = await ctx.db.get(row.apporteurId);
        const attachments = await Promise.all(
          (row.attachments ?? []).map(async (file) => {
            const url = await ctx.storage.getUrl(file.storageId);
            return {
              ...file,
              url,
            };
          })
        );
        const paymentReceiptUrl = row.paymentReceiptStorageId
          ? await ctx.storage.getUrl(row.paymentReceiptStorageId)
          : null;
        const devisUrl = row.devisStorageId
          ? await ctx.storage.getUrl(row.devisStorageId)
          : null;
        const isUnpaid = isDemandeUnpaid(row);
        const canOpen =
          viewer.kind === "admin" ||
          Boolean(row.openedAt) ||
          unpaidCount < MAX_UNPAID_OPENED;
        return {
          ...row,
          attachments,
          paymentReceiptUrl,
          devisUrl,
          isUnpaid,
          canOpen,
          unpaidCount,
          lockMessage: canOpen ? null : unpaidLockMessage(unpaidCount),
          apporteurName: apporteur?.name?.trim() || "—",
          apporteurEmail: apporteur?.email?.trim() || "",
        };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("apportDemandes") },
  handler: async (ctx, args) => {
    const viewer = await requireApportViewer(ctx);
    const row = await ctx.db.get(args.id);
    if (!row) {
      return null;
    }
    if (
      viewer.kind === "apporteur" &&
      row.apporteurId !== viewer.apporteurId
    ) {
      throw new Error("Accès refusé.");
    }

    const apporteur = await ctx.db.get(row.apporteurId);
    const attachments = await Promise.all(
      (row.attachments ?? []).map(async (file) => {
        const url = await ctx.storage.getUrl(file.storageId);
        return { ...file, url };
      })
    );
    const paymentReceiptUrl = row.paymentReceiptStorageId
      ? await ctx.storage.getUrl(row.paymentReceiptStorageId)
      : null;
    const devisUrl = row.devisStorageId
      ? await ctx.storage.getUrl(row.devisStorageId)
      : null;

    return {
      ...row,
      attachments,
      paymentReceiptUrl,
      devisUrl,
      apporteurName: apporteur?.name?.trim() || "—",
      apporteurEmail: apporteur?.email?.trim() || "",
    };
  },
});

export const listHistory = query({
  args: { id: v.id("apportDemandes") },
  handler: async (ctx, args) => {
    const viewer = await requireApportViewer(ctx);
    const demande = await ctx.db.get(args.id);
    if (!demande) {
      throw new Error("Demande introuvable.");
    }
    if (
      viewer.kind === "apporteur" &&
      demande.apporteurId !== viewer.apporteurId
    ) {
      throw new Error("Accès refusé.");
    }
    const events = await ctx.db
      .query("apportDemandeEvents")
      .withIndex("by_demandeId", (q) => q.eq("demandeId", args.id))
      .collect();
    return events.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Apporteur crée une demande pour lui-même. */
export const create = mutation({
  args: {
    date: v.optional(v.string()),
    clientName: v.string(),
    projectType: v.string(),
    localisation: v.optional(v.string()),
    phone: v.optional(v.string()),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const { staff, apporteur } = await requireApporteurStaff(ctx);
    const fields = normalizeDemandeFields(args);
    const now = Date.now();
    const id = await ctx.db.insert("apportDemandes", {
      apporteurId: apporteur._id,
      ...fields,
      status: "ouverte",
      createdBy: staff._id,
      createdAt: now,
      updatedAt: now,
    });
    await appendDemandeEvent(ctx, {
      demandeId: id,
      type: "created",
      label: "Demande créée",
      actorStaffId: staff._id,
    });
    return id;
  },
});

/** Admin crée une demande et l’affecte à un apporteur. */
export const createForApporteur = mutation({
  args: {
    apporteurId: v.id("apporteurs"),
    date: v.optional(v.string()),
    clientName: v.string(),
    projectType: v.string(),
    localisation: v.optional(v.string()),
    phone: v.optional(v.string()),
    note: v.string(),
    attachments: v.optional(v.array(attachmentValidator)),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const apporteur = await ctx.db.get(args.apporteurId);
    if (!apporteur || apporteur.status === "suspendu") {
      throw new Error("Apporteur introuvable ou inactif.");
    }
    const fields = normalizeDemandeFields(args);
    const attachments = await normalizeAttachments(ctx, args.attachments);
    const now = Date.now();
    const id = await ctx.db.insert("apportDemandes", {
      apporteurId: args.apporteurId,
      ...fields,
      attachments,
      status: "ouverte",
      createdBy: staff._id,
      createdAt: now,
      updatedAt: now,
    });
    await appendDemandeEvent(ctx, {
      demandeId: id,
      type: "created",
      label: `Demande créée et affectée à ${apporteur.name.trim() || apporteur.email}`,
      actorStaffId: staff._id,
    });
    return id;
  },
});

export const assignApporteur = mutation({
  args: {
    id: v.id("apportDemandes"),
    apporteurId: v.id("apporteurs"),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    const apporteur = await ctx.db.get(args.apporteurId);
    if (!apporteur || apporteur.status === "suspendu") {
      throw new Error("Apporteur introuvable ou inactif.");
    }
    await ctx.db.patch(args.id, {
      apporteurId: args.apporteurId,
      updatedAt: Date.now(),
    });
    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "assigned",
      label: `Affectée à ${apporteur.name.trim() || apporteur.email}`,
      actorStaffId: staff._id,
    });
    return args.id;
  },
});

export const markTreated = mutation({
  args: {
    id: v.id("apportDemandes"),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    const now = Date.now();
    const note = args.adminNote?.trim() || undefined;
    await ctx.db.patch(args.id, {
      status: "traitee",
      treatedAt: now,
      treatedBy: staff._id,
      adminNote: note,
      updatedAt: now,
    });
    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "status_change",
      label: "Demande marquée comme traitée",
      actorStaffId: staff._id,
    });
    return args.id;
  },
});

/** Apporteur déclare le projet terminé — visible comme « Projet complété » côté CRM. */
export const markProjectCompleted = mutation({
  args: { id: v.id("apportDemandes") },
  handler: async (ctx, args) => {
    const { staff, apporteur } = await requireApporteurStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    if (existing.apporteurId !== apporteur._id) {
      throw new Error("Accès refusé.");
    }
    if (!existing.openedAt) {
      throw new Error("Ouvrez d’abord la demande avant de la marquer complétée.");
    }
    if (existing.status === "traitee") {
      return args.id;
    }

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "traitee",
      treatedAt: now,
      treatedBy: staff._id,
      updatedAt: now,
    });
    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "status_change",
      label: "Projet déclaré complété par l’apporteur",
      actorStaffId: staff._id,
    });
    return args.id;
  },
});

export const reopen = mutation({
  args: { id: v.id("apportDemandes") },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    await ctx.db.patch(args.id, {
      status: "ouverte",
      treatedAt: undefined,
      treatedBy: undefined,
      updatedAt: Date.now(),
    });
    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "status_change",
      label: "Demande rouverte",
      actorStaffId: staff._id,
    });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("apportDemandes") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    for (const file of existing.attachments ?? []) {
      try {
        await ctx.storage.delete(file.storageId);
      } catch {
        // Ignore cleanup failures.
      }
    }
    if (existing.paymentReceiptStorageId) {
      try {
        await ctx.storage.delete(existing.paymentReceiptStorageId);
      } catch {
        // Ignore.
      }
    }
    if (existing.devisStorageId) {
      try {
        await ctx.storage.delete(existing.devisStorageId);
      } catch {
        // Ignore.
      }
    }
    const linked = await ctx.db
      .query("apportDeals")
      .withIndex("by_demandeId", (q) => q.eq("demandeId", args.id))
      .unique();
    if (linked) {
      await ctx.db.delete(linked._id);
    }
    const events = await ctx.db
      .query("apportDemandeEvents")
      .withIndex("by_demandeId", (q) => q.eq("demandeId", args.id))
      .collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const markOpened = mutation({
  args: { id: v.id("apportDemandes") },
  handler: async (ctx, args) => {
    const { staff, apporteur } = await requireApporteurStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    if (existing.apporteurId !== apporteur._id) {
      throw new Error("Accès refusé.");
    }
    if (existing.openedAt) {
      return { id: args.id, alreadyOpen: true };
    }

    const unpaid = await countUnpaidOpened(ctx, apporteur._id);
    if (unpaid >= MAX_UNPAID_OPENED) {
      throw new Error(unpaidLockMessage(unpaid));
    }

    const now = Date.now();
    await ctx.db.patch(args.id, {
      openedAt: now,
      paymentStatus: existing.paymentStatus ?? "unpaid",
      updatedAt: now,
    });
    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "opened",
      label: "Demande ouverte par l’apporteur",
      actorStaffId: staff._id,
    });
    return { id: args.id, alreadyOpen: false };
  },
});

export const submitPaymentReceipt = mutation({
  args: {
    id: v.id("apportDemandes"),
    receiptStorageId: v.id("_storage"),
    fileName: v.string(),
    amountSent: v.number(),
  },
  handler: async (ctx, args) => {
    const { staff, apporteur } = await requireApporteurStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    if (existing.apporteurId !== apporteur._id) {
      throw new Error("Accès refusé.");
    }
    if (!existing.openedAt) {
      throw new Error("Ouvrez d’abord la demande avant d’envoyer un reçu.");
    }
    if (existing.paymentStatus === "paid") {
      throw new Error("Ce paiement a déjà été confirmé par S2MBO.");
    }
    if (!Number.isFinite(args.amountSent) || args.amountSent <= 0) {
      throw new Error("Indiquez le montant envoyé (supérieur à 0).");
    }
    if (args.amountSent > 50_000_000) {
      throw new Error("Montant envoyé trop élevé.");
    }

    const contentType = await assertAttachment(
      ctx,
      args.receiptStorageId,
      args.fileName
    );
    const amountSent = Math.round(args.amountSent * 100) / 100;
    const now = Date.now();
    const previousReceipt = existing.paymentReceiptStorageId;
    await ctx.db.patch(args.id, {
      paymentStatus: "pending_review",
      paymentReceiptStorageId: args.receiptStorageId,
      paymentReceiptFileName: args.fileName.trim().slice(0, 180) || "reçu",
      paymentReceiptContentType: contentType,
      paymentAmountSent: amountSent,
      updatedAt: now,
    });

    if (previousReceipt && previousReceipt !== args.receiptStorageId) {
      try {
        await ctx.storage.delete(previousReceipt);
      } catch {
        // Ignore.
      }
    }

    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "payment_submitted",
      label: `Reçu bancaire envoyé (${amountSent.toLocaleString("fr-FR")} DH) — en attente de confirmation S2MBO`,
      actorStaffId: staff._id,
    });
    return args.id;
  },
});

/** Apporteur joint le devis envoyé au client (contrôle S2MBO). */
export const submitDevis = mutation({
  args: {
    id: v.id("apportDemandes"),
    devisStorageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const { staff, apporteur } = await requireApporteurStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    if (existing.apporteurId !== apporteur._id) {
      throw new Error("Accès refusé.");
    }
    if (!existing.openedAt) {
      throw new Error("Ouvrez d’abord la demande avant de joindre le devis.");
    }

    const contentType = await assertAttachment(
      ctx,
      args.devisStorageId,
      args.fileName
    );
    const now = Date.now();
    const previous = existing.devisStorageId;
    await ctx.db.patch(args.id, {
      devisStorageId: args.devisStorageId,
      devisFileName: args.fileName.trim().slice(0, 180) || "devis",
      devisContentType: contentType,
      devisUploadedAt: now,
      updatedAt: now,
    });

    if (previous && previous !== args.devisStorageId) {
      try {
        await ctx.storage.delete(previous);
      } catch {
        // Ignore.
      }
    }

    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "devis_uploaded",
      label: previous
        ? "Devis client mis à jour"
        : "Devis client joint par l’apporteur",
      actorStaffId: staff._id,
    });
    return args.id;
  },
});

/** Admin confirme le paiement après vérification du virement en banque. */
export const confirmPaid = mutation({
  args: { id: v.id("apportDemandes") },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    if (!existing.openedAt) {
      throw new Error("Cette demande n’a pas encore été ouverte.");
    }
    if (existing.paymentStatus === "paid") {
      return args.id;
    }
    if (existing.paymentStatus !== "pending_review") {
      throw new Error(
        "L’apporteur doit d’abord envoyer le reçu bancaire avant confirmation."
      );
    }
    if (!existing.paymentReceiptStorageId) {
      throw new Error("Aucun reçu bancaire joint à cette demande.");
    }
    if (
      existing.paymentAmountSent == null ||
      existing.paymentAmountSent <= 0
    ) {
      throw new Error(
        "L’apporteur doit indiquer le montant envoyé avant confirmation."
      );
    }

    const now = Date.now();
    await ctx.db.patch(args.id, {
      paymentStatus: "paid",
      paidAt: now,
      paymentConfirmedBy: staff._id,
      paymentConfirmedAt: now,
      updatedAt: now,
    });

    const updated = await ctx.db.get(args.id);
    if (updated) {
      await syncDemandeToSuivi(ctx, updated, staff._id);
    }

    await appendDemandeEvent(ctx, {
      demandeId: args.id,
      type: "paid",
      label: `Paiement confirmé par S2MBO (${existing.paymentAmountSent.toLocaleString("fr-FR")} DH → acompte reçu)`,
      actorStaffId: staff._id,
    });
    return args.id;
  },
});

/** Apporteur (ou admin) met à jour le suivi commission d’une demande. */
export const updateCommission = mutation({
  args: {
    id: v.id("apportDemandes"),
    contractAmount: v.optional(v.union(v.number(), v.null())),
    customRate: v.optional(v.union(v.number(), v.null())),
    observation: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const viewer = await requireApportViewer(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Demande introuvable.");
    }
    if (
      viewer.kind === "apporteur" &&
      existing.apporteurId !== viewer.apporteurId
    ) {
      throw new Error("Accès refusé.");
    }
    if (viewer.kind === "apporteur" && !existing.openedAt) {
      throw new Error("Ouvrez d’abord la demande pour saisir la commission.");
    }

    const patch: {
      contractAmount?: number;
      customRate?: number;
      observation?: string;
      updatedAt: number;
    } = { updatedAt: Date.now() };

    if (args.contractAmount !== undefined) {
      if (args.contractAmount == null) {
        patch.contractAmount = undefined;
      } else if (!Number.isFinite(args.contractAmount) || args.contractAmount < 0) {
        throw new Error("Montant contrat invalide.");
      } else {
        patch.contractAmount = args.contractAmount;
      }
    }

    if (args.customRate !== undefined) {
      if (args.customRate == null) {
        patch.customRate = undefined;
      } else if (!Number.isFinite(args.customRate)) {
        throw new Error("Taux commission invalide.");
      } else {
        patch.customRate = Math.min(1, Math.max(0, args.customRate));
      }
    }

    if (args.observation !== undefined) {
      const text = args.observation?.trim() || undefined;
      if (text && text.length > 2000) {
        throw new Error("L’observation est trop longue (2000 caractères max).");
      }
      patch.observation = text;
    }

    await ctx.db.patch(args.id, {
      updatedAt: patch.updatedAt,
      ...(args.contractAmount !== undefined
        ? { contractAmount: patch.contractAmount }
        : {}),
      ...(args.customRate !== undefined ? { customRate: patch.customRate } : {}),
      ...(args.observation !== undefined
        ? { observation: patch.observation }
        : {}),
    });

    const updated = await ctx.db.get(args.id);
    if (updated) {
      await syncDemandeToSuivi(ctx, updated, viewer.staff._id);
    }

    return args.id;
  },
});
