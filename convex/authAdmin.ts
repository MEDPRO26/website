import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { purgeAuthUserByEmail as purgeAuthUserByEmailImpl } from "./lib/purgeAuthUser";

/**
 * One-time prod recovery — removes a broken auth user so they can sign up again.
 * Run: npx convex run authAdmin:purgeAuthUserByEmail '{"email":"..."}' --prod
 */
export const purgeAuthUserByEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return purgeAuthUserByEmailImpl(ctx, args.email);
  },
});
