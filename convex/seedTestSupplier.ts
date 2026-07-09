import { createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";
import { linkSupplierStaff } from "./lib/linkSupplierStaff";
import { normalizePhone } from "./lib/refs";

export const TEST_SUPPLIER_EMAIL = "fournisseur.test@sossante.ma";
export const TEST_SUPPLIER_PASSWORD = "SosTest2026!";
const TEST_SUPPLIER_NAME = "Fournisseur Test";

type EnsureTestSupplierResult = {
  email: string;
  password: string;
  supplierId: Id<"suppliers">;
  loginUrl: string;
  portalUrl: string;
};

/**
 * Creates or refreshes the default test supplier portal account.
 * Run: npx convex run seedTestSupplier:ensureTestSupplier --prod
 */
export const ensureTestSupplier = internalAction({
  args: {},
  handler: async (ctx): Promise<EnsureTestSupplierResult> => {
    const prep: { supplierId: Id<"suppliers">; userId: Id<"users"> | null } =
      await ctx.runMutation(internal.seedTestSupplier.prepare, {});

    let userId = prep.userId;

    if (!userId) {
      const { user } = await createAccount(ctx, {
        provider: "password",
        account: {
          id: TEST_SUPPLIER_EMAIL,
          secret: TEST_SUPPLIER_PASSWORD,
        },
        profile: {
          email: TEST_SUPPLIER_EMAIL,
          name: TEST_SUPPLIER_NAME,
        },
      });
      userId = user._id;
    } else {
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: {
          id: TEST_SUPPLIER_EMAIL,
          secret: TEST_SUPPLIER_PASSWORD,
        },
      });
    }

    await ctx.runMutation(internal.seedTestSupplier.link, {
      userId,
      supplierId: prep.supplierId,
    });

    return {
      email: TEST_SUPPLIER_EMAIL,
      password: TEST_SUPPLIER_PASSWORD,
      supplierId: prep.supplierId,
      loginUrl: "/admin/login",
      portalUrl: "/supplier",
    };
  },
});

export const prepare = internalMutation({
  args: {},
  handler: async (ctx) => {
    const email = TEST_SUPPLIER_EMAIL.toLowerCase();
    const now = Date.now();

    let supplier = (await ctx.db.query("suppliers").collect()).find(
      (row) => row.email?.trim().toLowerCase() === email
    );

    if (!supplier) {
      const supplierId = await ctx.db.insert("suppliers", {
        name: TEST_SUPPLIER_NAME,
        type: "Location",
        city: "Agadir",
        zones: ["Agadir"],
        phone: normalizePhone("+212600000001"),
        whatsapp: normalizePhone("+212600000001"),
        email,
        status: "actif",
        verified: true,
        commissionPct: 10,
        items: ["Lit médicalisé électrique", "Fauteuil roulant"],
        services: [],
        notes: "Compte de test pour le portail fournisseur.",
        profileComplete: true,
        createdAt: now,
        updatedAt: now,
      });
      supplier = (await ctx.db.get(supplierId))!;
    } else {
      await ctx.db.patch(supplier._id, {
        name: TEST_SUPPLIER_NAME,
        type: "Location",
        city: "Agadir",
        zones: ["Agadir"],
        phone: normalizePhone("+212600000001"),
        whatsapp: normalizePhone("+212600000001"),
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
  },
  handler: async (ctx, args) => {
    await linkSupplierStaff(ctx, {
      userId: args.userId,
      supplierId: args.supplierId,
      email: TEST_SUPPLIER_EMAIL,
      name: TEST_SUPPLIER_NAME,
    });
  },
});
