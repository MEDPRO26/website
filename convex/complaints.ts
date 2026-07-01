import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminStaff } from "./lib/authz";
import { logAudit } from "./lib/auditLog";
import { buildComplaintRef, notifyStaff } from "./lib/notifications";
import {
  complaintPriorityValidator,
  complaintStatusValidator,
} from "./validators";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const list = query({
  args: {
    status: v.optional(complaintStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    let rows = await ctx.db.query("complaints").collect();
    if (args.status) {
      rows = rows.filter((row) => row.status === args.status);
    }

    const enriched = await Promise.all(
      rows.map(async (row) => {
        const assignee = row.assigneeStaffId
          ? await ctx.db.get(row.assigneeStaffId)
          : null;
        return {
          ...row,
          assigneeName: assignee?.name ?? "—",
          dateLabel: formatDate(row.createdAt),
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    orderId: v.optional(v.id("orders")),
    clientName: v.string(),
    supplierId: v.optional(v.id("suppliers")),
    type: v.string(),
    priority: complaintPriorityValidator,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const now = Date.now();
    const count = (await ctx.db.query("complaints").collect()).length;
    const ref = buildComplaintRef(count + 1);

    let orderRef: string | undefined;
    if (args.orderId) {
      const order = await ctx.db.get(args.orderId);
      orderRef = order?.ref;
    }

    let supplierName: string | undefined;
    if (args.supplierId) {
      const supplier = await ctx.db.get(args.supplierId);
      supplierName = supplier?.name;
    }

    const id = await ctx.db.insert("complaints", {
      ref,
      orderId: args.orderId,
      orderRef,
      clientName: args.clientName.trim(),
      supplierId: args.supplierId,
      supplierName,
      type: args.type.trim(),
      status: "ouverte",
      priority: args.priority,
      assigneeStaffId: staff._id,
      notes: args.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "create",
      entityType: "complaint",
      entityId: id,
      entityLabel: ref,
      toValue: args.type.trim(),
    });

    await notifyStaff(ctx, "complaint_opened", {
      type: "complaint",
      title: `Nouvelle réclamation ${ref}`,
      description: `${args.type.trim()} · ${args.clientName.trim()}`,
      link: "/admin/complaints",
      entityId: id,
    });

    return id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("complaints"),
    status: complaintStatusValidator,
  },
  handler: async (ctx, args) => {
    const staff = await requireAdminStaff(ctx);
    const complaint = await ctx.db.get(args.id);
    if (!complaint) {
      throw new Error("Réclamation introuvable.");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    await logAudit(ctx, {
      actorStaffId: staff._id,
      actorName: staff.name,
      action: "status_change",
      entityType: "complaint",
      entityId: args.id,
      entityLabel: complaint.ref,
      fromValue: complaint.status,
      toValue: args.status,
    });
  },
});
