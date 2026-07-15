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
  city: string;
  zones: string[];
  notes: string;
};

const PRIMARY_TEST_SUPPLIER: TestSupplierSeed = {
  email: TEST_SUPPLIER_EMAIL,
  password: TEST_SUPPLIER_PASSWORD,
  name: TEST_SUPPLIER_NAME,
  phone: "+212600000001",
  type: "Location",
  city: "Agadir",
  zones: ["Agadir"],
  notes: "Compte de test pour le portail fournisseur.",
};

const SECOND_TEST_SUPPLIER: TestSupplierSeed = {
  email: TEST_SUPPLIER_2_EMAIL,
  password: TEST_SUPPLIER_2_PASSWORD,
  name: TEST_SUPPLIER_2_NAME,
  phone: "+212600000002",
  type: "Vente matériel médical",
  city: "Casablanca",
  zones: ["Casablanca", "Mohammedia"],
  notes: "Second compte de test pour le portail fournisseur.",
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
      city: seed.city,
      zones: seed.zones,
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
    loginUrl: "/fournisseurs",
    portalUrl: "/supplier",
  };
}

/**
 * Creates or refreshes the default test supplier portal account.
 * Run: npx convex run seedTestSupplier:ensureTestSupplier --prod
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

export const prepare = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    type: v.string(),
    city: v.string(),
    zones: v.array(v.string()),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const now = Date.now();

    let supplier = (await ctx.db.query("suppliers").collect()).find(
      (row) => row.email?.trim().toLowerCase() === email
    );

    const phone = normalizePhone(args.phone);

    if (!supplier) {
      const supplierId = await ctx.db.insert("suppliers", {
        name: args.name,
        type: args.type,
        city: args.city,
        zones: args.zones,
        phone,
        whatsapp: phone,
        email,
        status: "actif",
        verified: true,
        commissionPct: 10,
        items: ["Lit médicalisé électrique", "Fauteuil roulant"],
        services: [],
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
        city: args.city,
        zones: args.zones,
        phone,
        whatsapp: phone,
        email,
        status: "actif",
        verified: true,
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
