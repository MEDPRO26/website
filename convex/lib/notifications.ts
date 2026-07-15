import { internal } from "../_generated/api";
import type { MutationCtx } from "../_generated/server";

type NotificationInput = {
  type: "order" | "supplier" | "complaint" | "commission" | "system";
  title: string;
  description: string;
  link?: string;
  entityId?: string;
};

export type StaffNotificationEvent =
  | "new_order"
  | "order_delivered"
  | "supplier_response"
  | "client_accepted"
  | "complaint_opened"
  | "rental_ending";

/** In-app inbox: only new orders and supplier-confirmed delivery. */
const IN_APP_EVENTS = new Set<StaffNotificationEvent>([
  "new_order",
  "order_delivered",
]);

export function isInAppNotificationTitle(title: string) {
  const text = title.trim();
  return (
    text.startsWith("Nouvelle demande") || text.includes("commande livrée")
  );
}

async function getPlatformSettings(ctx: MutationCtx) {
  return await ctx.db
    .query("platformSettings")
    .withIndex("by_key", (q) => q.eq("key", "global"))
    .unique();
}

/** Super-admin emails only for new orders and supplier-confirmed delivery. */
function shouldEmailSuperAdmin(
  settings: Awaited<ReturnType<typeof getPlatformSettings>>,
  event: StaffNotificationEvent
) {
  switch (event) {
    case "new_order":
      return settings?.notifyNewOrderEmail !== false;
    case "order_delivered":
      return true;
    default:
      return false;
  }
}

async function getSuperAdminEmails(ctx: MutationCtx) {
  const staff = await ctx.db.query("staff").collect();
  return staff
    .filter(
      (row) =>
        row.status === "actif" &&
        row.role === "super_admin" &&
        row.email.includes("@")
    )
    .map((row) => row.email.trim().toLowerCase());
}

export async function pushNotification(ctx: MutationCtx, input: NotificationInput) {
  await ctx.db.insert("notifications", {
    type: input.type,
    title: input.title,
    description: input.description,
    read: false,
    link: input.link,
    entityId: input.entityId,
    createdAt: Date.now(),
  });
}

export async function notifyStaff(
  ctx: MutationCtx,
  event: StaffNotificationEvent,
  input: NotificationInput
) {
  if (IN_APP_EVENTS.has(event)) {
    await pushNotification(ctx, input);
  }

  const settings = await getPlatformSettings(ctx);
  if (!shouldEmailSuperAdmin(settings, event)) {
    return;
  }

  const recipients = await getSuperAdminEmails(ctx);
  if (recipients.length === 0) {
    return;
  }

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const link = input.link ? `${siteUrl}${input.link}` : siteUrl;

  await ctx.scheduler.runAfter(0, internal.email.sendStaffNotification, {
    to: recipients,
    subject: input.title,
    description: input.description,
    link,
  });
}

export function buildComplaintRef(sequence: number) {
  const year = new Date().getFullYear();
  return `REC-${year}-${String(sequence).padStart(4, "0")}`;
}
