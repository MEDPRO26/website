import { internalMutation, mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission, requireAdminStaff } from "./lib/authz";
import { logAudit } from "./lib/auditLog";
import { normalizePhone } from "./lib/refs";
import { createSupplierInvite } from "./supplierInvitations";
import { supplierStatusValidator } from "./validators";

const supplierInput = {
  name: v.string(),
  type: v.string(),
  city: v.string(),
  zones: v.array(v.string()),
  phone: v.string(),
  whatsapp: v.optional(v.string()),
  email: v.optional(v.string()),
  commissionPct: v.number(),
  items: v.optional(v.array(v.string())),
  services: v.optional(v.array(v.string())),
  notes: v.optional(v.string()),
  verified: v.optional(v.boolean()),
};

export const list = query({
  args: {
    city: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(supplierStatusValidator),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "suppliers.view");

    let suppliers = await ctx.db.query("suppliers").collect();

    if (args.status) {
      suppliers = suppliers.filter((supplier) => supplier.status === args.status);
    }
    if (args.city) {
      suppliers = suppliers.filter(
        (supplier) => supplier.city.toLowerCase() === args.city!.toLowerCase()
      );
    }
    if (args.type) {
      suppliers = suppliers.filter((supplier) => {
        const types =
          supplier.types ??
          (supplier.type && supplier.type !== "—" ? [supplier.type] : []);
        return types.includes(args.type!) || supplier.type === args.type;
      });
    }
    if (args.search?.trim()) {
      const q = args.search.trim().toLowerCase();
      suppliers = suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(q) ||
          supplier.phone.includes(q) ||
          supplier.email?.toLowerCase().includes(q)
      );
    }

    const enriched = await Promise.all(
      suppliers.map(async (supplier) => {
        const orders = await ctx.db
          .query("orders")
          .withIndex("by_supplierId", (q) => q.eq("supplierId", supplier._id))
          .collect();

        const photoUrl = supplier.photoStorageId
          ? await ctx.storage.getUrl(supplier.photoStorageId)
          : null;

        return {
          ...supplier,
          photoUrl,
          ordersCount: orders.length,
        };
      })
    );

    return enriched.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  },
});

export const get = query({
  args: { id: v.id("suppliers") },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "suppliers.view");

    const supplier = await ctx.db.get(args.id);
    if (!supplier) {
      return null;
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_supplierId", (q) => q.eq("supplierId", supplier._id))
      .collect();

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        return {
          ...order,
          customerName: customer?.name ?? "—",
        };
      })
    );

    return {
      supplier,
      ordersCount: orders.length,
      orders: enrichedOrders.sort((a, b) => b.createdAt - a.createdAt),
    };
  },
});

export const create = mutation({
  args: supplierInput,
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "suppliers.create");

    const name = args.name.trim();
    const phone = normalizePhone(args.phone);

    if (!name || !phone || !args.city.trim() || !args.type.trim()) {
      throw new Error("Nom, type, ville et téléphone sont obligatoires.");
    }

    const now = Date.now();
    const supplierId = await ctx.db.insert("suppliers", {
      name,
      type: args.type.trim(),
      city: args.city.trim(),
      zones: args.zones.filter(Boolean),
      phone,
      whatsapp: args.whatsapp?.trim()
        ? normalizePhone(args.whatsapp)
        : phone,
      email: args.email?.trim() || undefined,
      status: "actif",
      verified: args.verified ?? false,
      commissionPct: args.commissionPct,
      items: args.items ?? [],
      services: args.services ?? [],
      notes: args.notes?.trim() || undefined,
      profileComplete: true,
      createdAt: now,
      updatedAt: now,
    });

    if (args.email?.trim()) {
      await createSupplierInvite(ctx, {
        supplierId,
        email: args.email.trim(),
        invitedByStaffId: staff._id,
      });
    }

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "create",
      entityType: "supplier",
      entityId: supplierId,
      entityLabel: name,
    });

    return supplierId;
  },
});

/** Invite a supplier by email — they complete their profile after accepting. */
export const inviteByEmail = mutation({
  args: {
    email: v.string(),
    commissionPct: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "suppliers.create");
    const email = args.email.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      throw new Error("Email valide obligatoire.");
    }

    const commissionPct = args.commissionPct ?? 0;
    if (commissionPct < 0 || commissionPct > 100) {
      throw new Error("Commission invalide (0–100 %).");
    }

    const duplicate = (await ctx.db.query("suppliers").collect()).find(
      (row) => row.email?.toLowerCase() === email
    );
    if (duplicate) {
      throw new Error("Un fournisseur avec cet email existe déjà.");
    }

    const now = Date.now();
    const placeholderName = email.split("@")[0] ?? "Fournisseur";

    const supplierId = await ctx.db.insert("suppliers", {
      name: placeholderName,
      type: "—",
      city: "—",
      zones: [],
      phone: "—",
      email,
      status: "en_attente",
      verified: false,
      commissionPct,
      items: [],
      services: [],
      profileComplete: false,
      createdAt: now,
      updatedAt: now,
    });

    await createSupplierInvite(ctx, {
      supplierId,
      email,
      invitedByStaffId: staff._id,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "create",
      entityType: "supplier",
      entityId: supplierId,
      entityLabel: email,
      toValue: "invited",
    });

    return supplierId;
  },
});

export const update = mutation({
  args: {
    id: v.id("suppliers"),
    ...supplierInput,
    status: v.optional(supplierStatusValidator),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "suppliers.update");

    const supplier = await ctx.db.get(args.id);
    if (!supplier) {
      throw new Error("Fournisseur introuvable.");
    }

    const name = args.name.trim();
    const phone = normalizePhone(args.phone);
    const nextEmail = args.email?.trim() || undefined;

    if (!name || !phone || !args.city.trim() || !args.type.trim()) {
      throw new Error("Nom, type, ville et téléphone sont obligatoires.");
    }

    await ctx.db.patch(args.id, {
      name,
      type: args.type.trim(),
      city: args.city.trim(),
      zones: args.zones.filter(Boolean),
      phone,
      whatsapp: args.whatsapp?.trim()
        ? normalizePhone(args.whatsapp)
        : phone,
      email: nextEmail,
      status: args.status ?? supplier.status,
      verified: args.verified ?? supplier.verified,
      commissionPct: args.commissionPct,
      items: args.items ?? [],
      services: args.services ?? [],
      notes: args.notes?.trim() || undefined,
      updatedAt: Date.now(),
    });

    const emailChanged =
      nextEmail &&
      nextEmail.toLowerCase() !== (supplier.email?.toLowerCase() ?? "");

    if (emailChanged) {
      await createSupplierInvite(ctx, {
        supplierId: args.id,
        email: nextEmail,
        invitedByStaffId: staff._id,
      });
    }

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "update",
      entityType: "supplier",
      entityId: args.id,
      entityLabel: name,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("suppliers"),
    status: supplierStatusValidator,
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "suppliers.suspend");

    const supplier = await ctx.db.get(args.id);
    if (!supplier) {
      throw new Error("Fournisseur introuvable.");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "status_change",
      entityType: "supplier",
      entityId: args.id,
      entityLabel: supplier.name,
      fromValue: supplier.status,
      toValue: args.status,
    });
  },
});

async function deleteSupplierRecord(ctx: MutationCtx, supplierId: Id<"suppliers">) {
  const supplier = await ctx.db.get(supplierId);
  if (!supplier) {
    throw new Error("Fournisseur introuvable.");
  }

  const invites = await ctx.db
    .query("supplierInvitations")
    .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
    .collect();
  for (const invite of invites) {
    await ctx.db.delete(invite._id);
  }

  const staffRows = await ctx.db
    .query("staff")
    .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
    .collect();
  for (const staff of staffRows) {
    await ctx.db.delete(staff._id);
  }

  const quotes = await ctx.db
    .query("orderSupplierQuotes")
    .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
    .collect();
  const clientOffers = await ctx.db.query("clientOffers").collect();
  for (const quote of quotes) {
    for (const offer of clientOffers.filter((row) => row.quoteId === quote._id)) {
      await ctx.db.delete(offer._id);
    }
    await ctx.db.delete(quote._id);
  }

  const orders = await ctx.db
    .query("orders")
    .withIndex("by_supplierId", (q) => q.eq("supplierId", supplierId))
    .collect();
  for (const order of orders) {
    await ctx.db.patch(order._id, { supplierId: undefined });
  }

  const complaints = await ctx.db.query("complaints").collect();
  for (const complaint of complaints.filter((row) => row.supplierId === supplierId)) {
    await ctx.db.patch(complaint._id, {
      supplierId: undefined,
      supplierName: undefined,
    });
  }

  await ctx.db.delete(supplierId);

  return supplier;
}

export const remove = mutation({
  args: { id: v.id("suppliers") },
  handler: async (ctx, args) => {
    const staff = await requireAdminPermission(ctx, "suppliers.delete");
    const supplier = await deleteSupplierRecord(ctx, args.id);

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "delete",
      entityType: "supplier",
      entityId: args.id,
      entityLabel: supplier.name,
    });

    return { deleted: true as const, name: supplier.name };
  },
});

export const ensureDemoSuppliers = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    if (process.env.DEMO_SUPPLIER_SEED !== "1") {
      return {
        seeded: false,
        count: (await ctx.db.query("suppliers").collect()).length,
        disabled: true as const,
      };
    }
    return await seedDemoSuppliersImpl(ctx);
  },
});

async function seedDemoSuppliersImpl(ctx: MutationCtx) {
  const existing = await ctx.db.query("suppliers").first();
  if (existing) {
    return {
      seeded: false,
      count: (await ctx.db.query("suppliers").collect()).length,
    };
  }

  const now = Date.now();
  const demoSuppliers = [
    {
      name: "Fournisseur Démo Agadir",
      type: "Matériel médical",
      city: "Agadir",
      zones: ["Agadir", "Inezgane", "Dcheira"],
      phone: "+212528221100",
      whatsapp: "+212600112233",
      email: "contact@demo-agadir.ma",
      status: "actif" as const,
      verified: true,
      commissionPct: 15,
      items: ["Lit médicalisé", "Fauteuil roulant", "Béquilles", "Déambulateur"],
      services: ["Livraison", "Installation"],
      responseAvg: "1h12",
    },
    {
      name: "MedAgadir Pro",
      type: "Matériel médical",
      city: "Agadir",
      zones: ["Agadir", "Aourir", "Taghazout"],
      phone: "+212528332211",
      whatsapp: "+212611223344",
      email: "pro@medagadir.ma",
      status: "actif" as const,
      verified: true,
      commissionPct: 12,
      items: ["Concentrateur d'oxygène", "Lit médicalisé", "Matelas anti-escarres"],
      services: ["Livraison", "Installation", "Maintenance"],
      responseAvg: "45min",
    },
    {
      name: "InfiSoins Agadir",
      type: "Soins à domicile",
      city: "Agadir",
      zones: ["Agadir", "Inezgane"],
      phone: "+212528110099",
      whatsapp: "+212622334455",
      email: "infi@soins.ma",
      status: "actif" as const,
      verified: true,
      commissionPct: 18,
      items: [] as string[],
      services: ["Pansement", "Injection", "Prélèvement", "Suivi post-op"],
      responseAvg: "30min",
    },
    {
      name: "AideFamille Sud",
      type: "Aide à domicile",
      city: "Inezgane",
      zones: ["Inezgane", "Dcheira", "Agadir"],
      phone: "+212528445566",
      whatsapp: "+212644556677",
      email: "contact@aidefamille.ma",
      status: "en_attente" as const,
      verified: false,
      commissionPct: 20,
      items: [] as string[],
      services: ["Aide ménagère", "Garde de jour", "Garde de nuit", "Accompagnement"],
      responseAvg: "3h",
    },
  ];

  for (const supplier of demoSuppliers) {
    await ctx.db.insert("suppliers", {
      ...supplier,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { seeded: true, count: demoSuppliers.length };
}

export const seedDemo = internalMutation({
  args: {},
  handler: async (ctx) => seedDemoSuppliersImpl(ctx),
});

/** Dev/admin cleanup — removes supplier and related records so email can be re-invited. */
export const purgeByEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const supplier = (await ctx.db.query("suppliers").collect()).find(
      (row) => row.email?.toLowerCase() === email
    );

    if (!supplier) {
      return { deleted: false, reason: "not_found" as const };
    }

    await deleteSupplierRecord(ctx, supplier._id);

    return {
      deleted: true as const,
      email,
      name: supplier.name,
    };
  },
});