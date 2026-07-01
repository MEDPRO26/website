import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission } from "./lib/authz";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "audit.view");
    const limit = Math.min(args.limit ?? 100, 200);
    const rows = await ctx.db.query("auditLogs").collect();

    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
      .map((row) => ({
        ...row,
        dateLabel: formatDate(row.createdAt),
      }));
  },
});
