import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { normalizePhone, phoneLookupVariants } from "./refs";

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
  for (const variant of phoneLookupVariants(phone)) {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_phone", (q) => q.eq("phone", variant))
      .unique();
    if (customer) {
      return customer;
    }
  }

  const target = normalizePhone(phone);
  if (!target) {
    return null;
  }

  const customers = await ctx.db.query("customers").collect();
  return (
    customers.find((customer) => normalizePhone(customer.phone) === target) ??
    null
  );
}

export async function findCustomerForConversation(
  ctx: MutationCtx | QueryCtx,
  conversation: {
    customerId?: Id<"customers">;
    phone: string;
    name: string;
  }
) {
  if (conversation.customerId) {
    const linked = await ctx.db.get(conversation.customerId);
    if (linked) {
      return linked;
    }
  }

  const byPhone = await findCustomerByPhone(ctx, conversation.phone);
  if (byPhone) {
    return byPhone;
  }

  const normalizedName = conversation.name.trim().toLowerCase();
  if (!normalizedName || normalizedName.startsWith("client ")) {
    return null;
  }

  const customers = await ctx.db.query("customers").collect();
  return (
    customers.find(
      (customer) => customer.name.trim().toLowerCase() === normalizedName
    ) ?? null
  );
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
