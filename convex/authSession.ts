import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

/** Confirms the Convex auth token is active on the server (not just client-side). */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    return {
      userId,
      email: user.email ?? "",
      name: user.name ?? "",
    };
  },
});
