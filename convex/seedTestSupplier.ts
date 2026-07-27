import { createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { internalAction, internalMutation, type ActionCtx } from "./_generated/server";
import { linkSupplierStaff } from "./lib/linkSupplierStaff";
import { normalizePhone } from "./lib/refs";

export const TEST_SUPPLIER_EMAIL = "fournisseur.test@sossante.ma";
export const TEST_SUPPLIER_PASSWORD = "SosTest2026!";
const TEST_SUPPLIER_NAME = "Fournisseur Test";

export const TEST_SUPPLIER_2_EMAIL = "fournisseur.test2@sossante.ma";
export const TEST_SUPPLIER_2_PASSWORD = "SosTest2026!";
const TEST_SUPPLIER_2_NAME = "Fournisseur Test 2";

export const TEST_PRESTATAIRE_EMAIL = "prestataire.test@sossante.ma";
export const TEST_PRESTATAIRE_PASSWORD = "SosTest2026!";
const TEST_PRESTATAIRE_NAME = "Prestataire Test Soins";

type EnsureTestSupplierResult = {
  email: string;
  password: string;
  supplierId: Id<"suppliers">;
  loginUrl: string;
  portalUrl: string;
};

type TestSupplierSeed = {
  email: string;
  password: string;
  name: string;
  phone: string;
  type: string;
  types?: string[];
  partnerKind: "materiel" | "soins";
  city: string;
  zones: string[];
  items?: string[];
  services?: string[];
  notes: string;
};

const PRIMARY_TEST_SUPPLIER: TestSupplierSeed = {
  email: TEST_SUPPLIER_EMAIL,
  password: TEST_SUPPLIER_PASSWORD,
  name: TEST_SUPPLIER_NAME,
  phone: "+212600000001",
  type: "Location matériel médical",
  types: ["Location matériel médical"],
  partnerKind: "materiel",
  city: "Agadir",
  zones: ["Agadir"],
  items: ["Lit médicalisé électrique", "Fauteuil roulant"],
  services: [],
  notes: "Compte de test pour le portail fournisseur.",
};

const SECOND_TEST_SUPPLIER: TestSupplierSeed = {
  email: TEST_SUPPLIER_2_EMAIL,
  password: TEST_SUPPLIER_2_PASSWORD,
  name: TEST_SUPPLIER_2_NAME,
  phone: "+212600000002",
  type: "Vente matériel médical",
  types: ["Vente matériel médical"],
  partnerKind: "materiel",
  city: "Casablanca",
  zones: ["Casablanca", "Mohammedia"],
  items: ["Concentrateur d'oxygène", "Lit médicalisé"],
  services: [],
  notes: "Second compte de test pour le portail fournisseur.",
};

const TEST_PRESTATAIRE: TestSupplierSeed = {
  email: TEST_PRESTATAIRE_EMAIL,
  password: TEST_PRESTATAIRE_PASSWORD,
  name: TEST_PRESTATAIRE_NAME,
  phone: "+212600000010",
  type: "Soins infirmiers à domicile",
  types: [
    "Soins infirmiers à domicile",
    "Kinésithérapie à domicile",
    "Aide-soignant à domicile",
  ],
  partnerKind: "soins",
  city: "Agadir",
  zones: ["Agadir", "Inezgane", "Dcheira"],
  items: [],
  services: [
    "Pansements",
    "Injections",
    "Kinésithérapie",
    "Aide à domicile",
  ],
  notes: "Compte de test pour le portail prestataire soins à domicile.",
};

async function ensureTestSupplierAccount(
  ctx: ActionCtx,
  seed: TestSupplierSeed
): Promise<EnsureTestSupplierResult> {
  const prep: { supplierId: Id<"suppliers">; userId: Id<"users"> | null } =
    await ctx.runMutation(internal.seedTestSupplier.prepare, {
      email: seed.email,
      name: seed.name,
      phone: seed.phone,
      type: seed.type,
      types: seed.types,
      partnerKind: seed.partnerKind,
      city: seed.city,
      zones: seed.zones,
      items: seed.items,
      services: seed.services,
      notes: seed.notes,
    });

  let userId = prep.userId;

  if (!userId) {
    const { user } = await createAccount(ctx, {
      provider: "password",
      account: {
        id: seed.email,
        secret: seed.password,
      },
      profile: {
        email: seed.email,
        name: seed.name,
      },
    });
    userId = user._id;
  } else {
    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: {
        id: seed.email,
        secret: seed.password,
      },
    });
  }

  await ctx.runMutation(internal.seedTestSupplier.link, {
    userId,
    supplierId: prep.supplierId,
    email: seed.email,
    name: seed.name,
  });

  return {
    email: seed.email,
    password: seed.password,
    supplierId: prep.supplierId,
    loginUrl:
      seed.partnerKind === "soins" ? "/prestataires" : "/fournisseurs",
    portalUrl: seed.partnerKind === "soins" ? "/prestataire" : "/supplier",
  };
}

/**
 * Creates or refreshes the default test supplier portal account.
 * Run: npx convex run seedTestSupplier:ensureTestSupplier
 */
export const ensureTestSupplier = internalAction({
  args: {},
  handler: async (ctx) => ensureTestSupplierAccount(ctx, PRIMARY_TEST_SUPPLIER),
});

/**
 * Creates or refreshes a second test supplier portal account.
 * Run: npx convex run seedTestSupplier:ensureTestSupplier2
 */
export const ensureTestSupplier2 = internalAction({
  args: {},
  handler: async (ctx) => ensureTestSupplierAccount(ctx, SECOND_TEST_SUPPLIER),
});

/**
 * Creates or refreshes the test soins / prestataire portal account.
 * Run: npx convex run seedTestSupplier:ensureTestPrestataire
 */
export const ensureTestPrestataire = internalAction({
  args: {},
  handler: async (ctx) => ensureTestSupplierAccount(ctx, TEST_PRESTATAIRE),
});

export const prepare = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    type: v.string(),
    types: v.optional(v.array(v.string())),
    partnerKind: v.optional(v.union(v.literal("materiel"), v.literal("soins"))),
    city: v.string(),
    zones: v.array(v.string()),
    items: v.optional(v.array(v.string())),
    services: v.optional(v.array(v.string())),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const now = Date.now();
    const partnerKind = args.partnerKind ?? "materiel";
    const types =
      args.types && args.types.length > 0 ? args.types : [args.type];
    const items =
      args.items ??
      (partnerKind === "materiel"
        ? ["Lit médicalisé électrique", "Fauteuil roulant"]
        : []);
    const services = args.services ?? [];

    let supplier = (await ctx.db.query("suppliers").collect()).find(
      (row) => row.email?.trim().toLowerCase() === email
    );

    const phone = normalizePhone(args.phone);

    if (!supplier) {
      const supplierId = await ctx.db.insert("suppliers", {
        name: args.name,
        type: args.type,
        types,
        partnerKind,
        city: args.city,
        zones: args.zones,
        phone,
        whatsapp: phone,
        email,
        status: "actif",
        verified: true,
        commissionPct: 10,
        items,
        services,
        notes: args.notes,
        profileComplete: true,
        createdAt: now,
        updatedAt: now,
      });
      supplier = (await ctx.db.get(supplierId))!;
    } else {
      await ctx.db.patch(supplier._id, {
        name: args.name,
        type: args.type,
        types,
        partnerKind,
        city: args.city,
        zones: args.zones,
        phone,
        whatsapp: phone,
        email,
        status: "actif",
        verified: true,
        items,
        services,
        notes: args.notes,
        profileComplete: true,
        updatedAt: now,
      });
    }

    const authUser = (await ctx.db.query("users").collect()).find(
      (user) => user.email?.trim().toLowerCase() === email
    );

    return {
      supplierId: supplier._id,
      userId: authUser?._id ?? null,
    };
  },
});

export const link = internalMutation({
  args: {
    userId: v.id("users"),
    supplierId: v.id("suppliers"),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await linkSupplierStaff(ctx, {
      userId: args.userId,
      supplierId: args.supplierId,
      email: args.email,
      name: args.name,
    });
  },
});
