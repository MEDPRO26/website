import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { upsertCustomer } from "./customers";
import { appendOrderEvent } from "./orderEvents";
import { buildOrderRef } from "./refs";
import { notifyStaff } from "./notifications";
import { logAudit } from "./auditLog";
import { normalizeOrderPagePath } from "../../lib/crm/format-page-path";

export type CreateOrderInput = {
  client: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city: string;
  district?: string;
  address?: string;
  type: string;
  item: string;
  duration?: string;
  desiredDate?: string;
  slot?: string;
  message?: string;
  notes?: string;
  source: string;
  pagePath?: string;
  assignedStaffId?: Id<"staff">;
  actorStaffId?: Id<"staff">;
  createdLabel?: string;
};

export async function createOrderRecord(ctx: MutationCtx, input: CreateOrderInput) {
  const name = input.client.trim();
  const phone = input.phone.trim();
  const city = input.city.trim();

  if (!name || !phone || !city) {
    throw new Error("Nom, téléphone et ville sont obligatoires.");
  }

  if (!input.type.trim() || !input.item.trim()) {
    throw new Error("Type et matériel/service sont obligatoires.");
  }

  const source = input.source.trim() || "CRM manuel";
  const now = Date.now();

  const customerId = await upsertCustomer(ctx, {
    name,
    phone,
    whatsapp: input.whatsapp,
    email: input.email,
    city,
    district: input.district,
    address: input.address,
    source,
  });

  const orderCount = (await ctx.db.query("orders").collect()).length;
  const ref = buildOrderRef(orderCount + 1);
  const hasAssignee = Boolean(input.assignedStaffId);

  const orderId = await ctx.db.insert("orders", {
    ref,
    customerId,
    clientName: name,
    status: "nouvelle",
    type: input.type.trim(),
    item: input.item.trim(),
    duration: input.duration?.trim() || undefined,
    desiredDate: input.desiredDate?.trim() || undefined,
    slot: input.slot?.trim() || undefined,
    message: input.message?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    pagePath: normalizeOrderPagePath(input.pagePath),
    source,
    assignedStaffId: input.assignedStaffId,
    createdAt: now,
    updatedAt: now,
  });

  await appendOrderEvent(ctx, {
    orderId,
    type: "created",
    label: input.createdLabel ?? "Commande créée",
    toStatus: "nouvelle",
    actorStaffId: input.actorStaffId,
  });

  if (input.assignedStaffId) {
    const assignee = await ctx.db.get(input.assignedStaffId);
    if (assignee) {
      await appendOrderEvent(ctx, {
        orderId,
        type: "assignment",
        label: `Affectée à ${assignee.name}`,
        actorStaffId: input.actorStaffId,
      });
    }
  }

  await notifyStaff(ctx, "new_order", {
    type: "order",
    title: `Nouvelle demande - ${name}`,
    description: `${input.type.trim()} · ${city}`,
    link: `/admin/orders/${orderId}`,
    entityId: orderId,
  });

  const actor = input.actorStaffId ? await ctx.db.get(input.actorStaffId) : null;
  await logAudit(ctx, {
    actorStaffId: input.actorStaffId,
    actorName: actor?.name ?? (source.includes("site") ? "Site web" : "Système"),
    action: "create",
    entityType: "order",
    entityId: orderId,
    entityLabel: ref,
    toValue: "nouvelle",
  });

  return { orderId, ref };
}
