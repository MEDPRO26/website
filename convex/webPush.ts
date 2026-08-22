"use node";

import webpush from "web-push";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalAction, type ActionCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

type PushResult = {
  sent: number;
  failed: number;
  total: number;
};

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject =
    process.env.VAPID_SUBJECT?.trim() || "mailto:noreply@s2mbo.com";

  if (!publicKey || !privateKey) {
    throw new Error(
      "Notifications push non configurées. Ajoutez VAPID_PUBLIC_KEY et VAPID_PRIVATE_KEY dans Convex."
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

async function deliverToSubscriptions(
  ctx: ActionCtx,
  subscriptions: Doc<"pushSubscriptions">[],
  payload: PushPayload
): Promise<PushResult> {
  configureWebPush();
  const body = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body,
          {
            // Keep the message until Chrome wakes (OEM battery savers delay delivery).
            TTL: 60 * 60 * 24 * 3,
            urgency: "high",
            topic: (payload.tag || "s2mbo")
              .replace(/[^A-Za-z0-9\-_]/g, "")
              .slice(0, 32) || "s2mbo",
          }
        );
        sent += 1;
      } catch (err) {
        failed += 1;
        const statusCode =
          err && typeof err === "object" && "statusCode" in err
            ? Number((err as { statusCode?: number }).statusCode)
            : undefined;
        if (statusCode === 404 || statusCode === 410) {
          await ctx.runMutation(internal.pushInternal.deleteSubscriptionById, {
            id: sub._id,
          });
        }
      }
    })
  );

  return { sent, failed, total: subscriptions.length };
}

export const sendToSupplier = internalAction({
  args: {
    supplierId: v.id("suppliers"),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<PushResult> => {
    const subscriptions: Doc<"pushSubscriptions">[] = await ctx.runQuery(
      internal.pushInternal.listSubscriptionsForSupplier,
      { supplierId: args.supplierId }
    );
    if (subscriptions.length === 0) {
      return { sent: 0, failed: 0, total: 0 };
    }

    try {
      return await deliverToSubscriptions(ctx, subscriptions, {
        title: args.title,
        body: args.body,
        url: args.url,
        tag: args.tag,
      });
    } catch (err) {
      console.error("web push sendToSupplier failed", err);
      return {
        sent: 0,
        failed: subscriptions.length,
        total: subscriptions.length,
      };
    }
  },
});

export const sendToApporteur = internalAction({
  args: {
    apporteurId: v.id("apporteurs"),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<PushResult> => {
    const subscriptions: Doc<"pushSubscriptions">[] = await ctx.runQuery(
      internal.pushInternal.listSubscriptionsForApporteur,
      { apporteurId: args.apporteurId }
    );
    if (subscriptions.length === 0) {
      return { sent: 0, failed: 0, total: 0 };
    }

    try {
      return await deliverToSubscriptions(ctx, subscriptions, {
        title: args.title,
        body: args.body,
        url: args.url,
        tag: args.tag,
      });
    } catch (err) {
      console.error("web push sendToApporteur failed", err);
      return {
        sent: 0,
        failed: subscriptions.length,
        total: subscriptions.length,
      };
    }
  },
});

export const sendBroadcast = action({
  args: {
    audience: v.union(
      v.literal("all"),
      v.literal("materiel"),
      v.literal("soins"),
      v.literal("apporteurs")
    ),
    supplierId: v.optional(v.id("suppliers")),
    apporteurId: v.optional(v.id("apporteurs")),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<PushResult> => {
    await ctx.runMutation(api.pushSubscriptions.assertAdminCanBroadcast, {});

    const title = args.title.trim();
    const body = args.body.trim();
    if (!title || !body) {
      throw new Error("Titre et message sont obligatoires.");
    }
    if (title.length > 80) {
      throw new Error("Le titre est trop long (80 caractères max).");
    }
    if (body.length > 240) {
      throw new Error("Le message est trop long (240 caractères max).");
    }

    const subscriptions: Doc<"pushSubscriptions">[] = await ctx.runQuery(
      internal.pushInternal.listSubscriptionsForAudience,
      {
        audience: args.audience,
        supplierId: args.supplierId,
        apporteurId: args.apporteurId,
      }
    );

    if (subscriptions.length === 0) {
      return { sent: 0, failed: 0, total: 0 };
    }

    return await deliverToSubscriptions(ctx, subscriptions, {
      title,
      body,
      url: args.url?.trim() || undefined,
      tag: `sos-admin-${Date.now()}`,
    });
  },
});
