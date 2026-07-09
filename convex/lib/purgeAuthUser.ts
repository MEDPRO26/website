import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export type PurgeAuthUserResult = {
  deleted: boolean;
  reason?: "user_not_found";
  email: string;
  accountsRemoved: number;
  sessionsRemoved: number;
  staffRemoved: number;
};

export async function purgeAuthUserById(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<PurgeAuthUserResult> {
  const authUser = await ctx.db.get(userId);
  if (!authUser) {
    return {
      deleted: false,
      reason: "user_not_found",
      email: "",
      accountsRemoved: 0,
      sessionsRemoved: 0,
      staffRemoved: 0,
    };
  }

  const email = authUser.email?.trim().toLowerCase() ?? "";

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
    deleted: true,
    email,
    accountsRemoved: accounts.length,
    sessionsRemoved: sessions.length,
    staffRemoved: staff ? 1 : 0,
  };
}

export async function purgeAuthUserByEmail(
  ctx: MutationCtx,
  emailInput: string
): Promise<PurgeAuthUserResult> {
  const email = emailInput.trim().toLowerCase();
  const authUser = (await ctx.db.query("users").collect()).find(
    (user) => user.email?.trim().toLowerCase() === email
  );

  if (!authUser) {
    return {
      deleted: false,
      reason: "user_not_found",
      email,
      accountsRemoved: 0,
      sessionsRemoved: 0,
      staffRemoved: 0,
    };
  }

  return purgeAuthUserById(ctx, authUser._id);
}
