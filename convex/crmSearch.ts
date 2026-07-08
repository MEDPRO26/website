import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminStaff } from "./lib/authz";
import { resolveOrderClientName } from "./lib/orderClient";

export const global = query({
  args: { q: v.string() },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);

    const q = args.q.trim().toLowerCase();
    if (q.length < 2) {
      return { orders: [], customers: [], suppliers: [] };
    }

    const orders = await ctx.db.query("orders").collect();
    const orderMatches: Array<{
      _id: (typeof orders)[0]["_id"];
      ref: string;
      status: string;
      item: string;
      clientName: string;
    }> = [];

    for (const order of orders) {
      const customer = await ctx.db.get(order.customerId);
      const clientName = resolveOrderClientName(order, customer);
      const phone = customer?.phone ?? "";
      const matches =
        order.ref.toLowerCase().includes(q) ||
        order.item.toLowerCase().includes(q) ||
        clientName.toLowerCase().includes(q) ||
        phone.includes(q);

      if (!matches) {
        continue;
      }

      orderMatches.push({
        _id: order._id,
        ref: order.ref,
        status: order.status,
        item: order.item,
        clientName: clientName || "—",
      });

      if (orderMatches.length >= 8) {
        break;
      }
    }

    const customers = await ctx.db.query("customers").collect();
    const customerMatches = customers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(q) ||
          customer.phone.includes(q) ||
          customer.email?.toLowerCase().includes(q) ||
          customer.city.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map((customer) => ({
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        city: customer.city,
      }));

    const suppliers = await ctx.db.query("suppliers").collect();
    const supplierMatches = suppliers
      .filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(q) ||
          supplier.phone.includes(q) ||
          supplier.email?.toLowerCase().includes(q) ||
          supplier.city.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map((supplier) => ({
        _id: supplier._id,
        name: supplier.name,
        city: supplier.city,
        status: supplier.status,
      }));

    return {
      orders: orderMatches,
      customers: customerMatches,
      suppliers: supplierMatches,
    };
  },
});
