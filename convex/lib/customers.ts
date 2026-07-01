import type { MutationCtx, QueryCtx } from "../_generated/server";
import { normalizePhone } from "./refs";

type UpsertCustomerInput = {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city: string;
  district?: string;
  address?: string;
  source: string;
};

export async function findCustomerByPhone(
  ctx: MutationCtx | QueryCtx,
  phone: string
) {
  const normalized = normalizePhone(phone);
  return await ctx.db
    .query("customers")
    .withIndex("by_phone", (q) => q.eq("phone", normalized))
    .unique();
}

export async function upsertCustomer(
  ctx: MutationCtx,
  input: UpsertCustomerInput
) {
  const now = Date.now();
  const phone = normalizePhone(input.phone);
  const existing = await ctx.db
    .query("customers")
    .withIndex("by_phone", (q) => q.eq("phone", phone))
    .unique();

  const whatsapp = input.whatsapp?.trim()
    ? normalizePhone(input.whatsapp)
    : phone;

  if (existing) {
    await ctx.db.patch(existing._id, {
      name: input.name.trim(),
      email: input.email?.trim() || existing.email,
      city: input.city.trim(),
      district: input.district?.trim() || existing.district,
      address: input.address?.trim() || existing.address,
      whatsapp,
      ordersCount: existing.ordersCount + 1,
      lastOrderAt: now,
      updatedAt: now,
    });
    return existing._id;
  }

  return await ctx.db.insert("customers", {
    name: input.name.trim(),
    phone,
    whatsapp,
    email: input.email?.trim() || undefined,
    city: input.city.trim(),
    district: input.district?.trim() || undefined,
    address: input.address?.trim() || undefined,
    status: "actif",
    source: input.source,
    ordersCount: 1,
    lastOrderAt: now,
    createdAt: now,
    updatedAt: now,
  });
}
