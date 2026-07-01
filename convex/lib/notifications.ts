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
  | "supplier_response"
  | "client_accepted"
  | "complaint_opened"
  | "rental_ending";

async function getPlatformSettings(ctx: MutationCtx) {
  return await ctx.db
    .query("platformSettings")
    .withIndex("by_key", (q) => q.eq("key", "global"))
    .unique();
}

function shouldEmailForEvent(
  settings: Awaited<ReturnType<typeof getPlatformSettings>>,
  event: StaffNotificationEvent
) {
  if (!settings) {
    return event === "new_order" || event === "complaint_opened";
  }
  switch (event) {
    case "new_order":
      return settings.notifyNewOrderEmail !== false;
    case "supplier_response":
      return settings.notifySupplierResponseEmail !== false;
    case "client_accepted":
      return settings.notifyClientAcceptedEmail !== false;
    case "complaint_opened":
      return settings.notifyComplaintEmail !== false;
    case "rental_ending":
      return settings.notifyRentalEndingEmail === true;
    default:
      return false;
  }
}

async function getStaffRecipientEmails(ctx: MutationCtx) {
  const staff = await ctx.db.query("staff").collect();
  return staff
    .filter(
      (row) =>
        row.status === "actif" &&
        ["super_admin", "admin", "assistant"].includes(row.role) &&
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
  await pushNotification(ctx, input);

  const settings = await getPlatformSettings(ctx);
  if (!shouldEmailForEvent(settings, event)) {
    return;
  }

  const recipients = await getStaffRecipientEmails(ctx);
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
