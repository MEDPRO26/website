import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission, requireAdminStaff } from "./lib/authz";
import { findCustomerByPhone } from "./lib/customers";
import { normalizePhone } from "./lib/refs";
import { customerStatusValidator } from "./validators";

function formatDate(ts?: number) {
  if (!ts) {
    return "—";
  }
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const list = query({
  args: {
    search: v.optional(v.string()),
    city: v.optional(v.string()),
    status: v.optional(customerStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "customers.view");

    let customers = await ctx.db.query("customers").collect();

    if (args.status) {
      customers = customers.filter((customer) => customer.status === args.status);
    }
    if (args.city?.trim()) {
      const city = args.city.trim().toLowerCase();
      customers = customers.filter(
        (customer) => customer.city.toLowerCase() === city
      );
    }
    if (args.search?.trim()) {
      const q = args.search.trim().toLowerCase();
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(q) ||
          customer.phone.includes(q) ||
          customer.email?.toLowerCase().includes(q) ||
          customer.city.toLowerCase().includes(q) ||
          customer.district?.toLowerCase().includes(q)
      );
    }

    return customers
      .sort((a, b) => (b.lastOrderAt ?? 0) - (a.lastOrderAt ?? 0))
      .map((customer) => ({
        ...customer,
        lastOrderLabel: formatDate(customer.lastOrderAt),
      }));
  },
});

export const get = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "customers.view");

    const customer = await ctx.db.get(args.id);
    if (!customer) {
      return null;
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customerId", (q) => q.eq("customerId", args.id))
      .collect();

    const ordersWithMeta = await Promise.all(
      orders
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (order) => {
          const supplier = order.supplierId
            ? await ctx.db.get(order.supplierId)
            : null;
          return {
            ...order,
            supplierName: supplier?.name ?? null,
            createdAtLabel: new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          };
        })
    );

    return {
      customer: {
        ...customer,
        lastOrderLabel: formatDate(customer.lastOrderAt),
        createdAtLabel: formatDate(customer.createdAt),
      },
      orders: ordersWithMeta,
    };
  },
});

/** Live lookup while typing a phone on « Nouvelle commande ». */
export const lookupByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const digits = normalizePhone(args.phone);
    if (digits.length < 9) {
      return null;
    }

    const customer = await findCustomerByPhone(ctx, args.phone);
    if (!customer) {
      return null;
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customerId", (q) => q.eq("customerId", customer._id))
      .collect();

    const priorOrders = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((order) => ({
        _id: order._id,
        ref: order.ref,
        status: order.status,
        type: order.type,
        item: order.item,
        source: order.source,
        createdAt: order.createdAt,
        createdAtLabel: new Date(order.createdAt).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

    return {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        whatsapp: customer.whatsapp,
        email: customer.email,
        city: customer.city,
        district: customer.district,
        address: customer.address,
        ordersCount: priorOrders.length,
        lastOrderLabel: formatDate(customer.lastOrderAt),
      },
      orders: priorOrders,
    };
  },
});
