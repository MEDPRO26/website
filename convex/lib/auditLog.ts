import type { MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "status_change"
  | "system";

export type AuditLogInput = {
  actorStaffId?: Doc<"staff">["_id"];
  actorName: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  entityLabel: string;
  fromValue?: string;
  toValue?: string;
};

export async function isAuditEnabled(ctx: MutationCtx) {
  const settings = await ctx.db
    .query("platformSettings")
    .withIndex("by_key", (q) => q.eq("key", "global"))
    .unique();
  return settings?.auditLogsEnabled !== false;
}

export async function logAudit(ctx: MutationCtx, input: AuditLogInput) {
  if (!(await isAuditEnabled(ctx))) {
    return;
  }

  await ctx.db.insert("auditLogs", {
    actorStaffId: input.actorStaffId,
    actorName: input.actorName,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    entityLabel: input.entityLabel,
    fromValue: input.fromValue,
    toValue: input.toValue,
    createdAt: Date.now(),
  });
}
