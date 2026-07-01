import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export async function linkSupplierStaff(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    supplierId: Id<"suppliers">;
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
      role: "supplier",
      supplierId: args.supplierId,
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
    role: "supplier",
    status: "actif",
    supplierId: args.supplierId,
    createdAt: now,
    updatedAt: now,
  });
}
