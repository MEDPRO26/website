import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export async function linkApporteurStaff(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    apporteurId: Id<"apporteurs">;
    email: string;
    name: string;
  }
) {
  const existing = await ctx.db
    .query("staff")
    .withIndex("by_userId", (q) => q.eq("userId", args.userId))
    .unique();

  const now = Date.now();

  if (existing) {
    await ctx.db.patch(existing._id, {
      role: "apporteur",
      apporteurId: args.apporteurId,
      name: args.name,
      email: args.email,
      status: "actif",
      updatedAt: now,
    });
    return existing._id;
  }

  return await ctx.db.insert("staff", {
    userId: args.userId,
    name: args.name,
    email: args.email,
    role: "apporteur",
    status: "actif",
    apporteurId: args.apporteurId,
    createdAt: now,
    updatedAt: now,
  });
}
