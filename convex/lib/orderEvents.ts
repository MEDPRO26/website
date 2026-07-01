import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

type OrderStatus = Doc<"orders">["status"];

export async function appendOrderEvent(
  ctx: MutationCtx,
  args: {
    orderId: Id<"orders">;
    type: "created" | "status_change" | "note" | "assignment" | "quote" | "offer" | "system";
    label: string;
    fromStatus?: OrderStatus;
    toStatus?: OrderStatus;
    actorStaffId?: Id<"staff">;
  }
) {
  await ctx.db.insert("orderEvents", {
    orderId: args.orderId,
    type: args.type,
    label: args.label,
    fromStatus: args.fromStatus,
    toStatus: args.toStatus,
    actorStaffId: args.actorStaffId,
    createdAt: Date.now(),
  });
}
