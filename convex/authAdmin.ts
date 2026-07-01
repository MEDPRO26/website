import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * One-time prod recovery — removes a broken auth user so they can sign up again.
 * Run: npx convex run authAdmin:purgeAuthUserByEmail '{"email":"..."}' --prod
 */
export const purgeAuthUserByEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    const authUser = (await ctx.db.query("users").collect()).find(
      (user) => user.email?.trim().toLowerCase() === email
    );

    if (!authUser) {
      return { deleted: false as const, reason: "user_not_found" as const, email };
    }

    const userId = authUser._id;

    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      const codes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of codes) {
        await ctx.db.delete(code._id);
      }
      await ctx.db.delete(account._id);
    }

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of refreshTokens) {
        await ctx.db.delete(token._id);
      }

      const verifiers = await ctx.db.query("authVerifiers").collect();
      for (const verifier of verifiers) {
        if (verifier.sessionId === session._id) {
          await ctx.db.delete(verifier._id);
        }
      }

      await ctx.db.delete(session._id);
    }

    const staff = await ctx.db
      .query("staff")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (staff) {
      await ctx.db.delete(staff._id);
    }

    await ctx.db.delete(userId);

    return {
      deleted: true as const,
      email,
      accountsRemoved: accounts.length,
      sessionsRemoved: sessions.length,
      staffRemoved: staff ? 1 : 0,
    };
  },
});
