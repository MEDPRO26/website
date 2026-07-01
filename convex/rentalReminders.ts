import { internalMutation } from "./_generated/server";
import { notifyStaff } from "./lib/notifications";
import { RENTAL_REMINDER_WINDOW_MS } from "./lib/rentalDates";

export const checkEndingRentals = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "location_active"))
      .collect();

    for (const order of orders) {
      if (!order.rentalEndAt || order.rentalEndingNotifiedAt) {
        continue;
      }

      const msUntilEnd = order.rentalEndAt - now;
      if (msUntilEnd <= 0 || msUntilEnd > RENTAL_REMINDER_WINDOW_MS) {
        continue;
      }

      const customer = await ctx.db.get(order.customerId);
      await notifyStaff(ctx, "rental_ending", {
        type: "order",
        title: `Location bientôt terminée — ${order.ref}`,
        description: `${customer?.name ?? "Client"} · ${order.item}`,
        link: `/admin/orders/${order._id}`,
        entityId: order._id,
      });

      await ctx.db.patch(order._id, {
        rentalEndingNotifiedAt: now,
        updatedAt: now,
      });
    }
  },
});
