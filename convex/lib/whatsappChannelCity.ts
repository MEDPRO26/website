import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type ChannelRow = Doc<"whatsappChannels">;

/** True when the lead came from the public website form (not WhatsApp). */
export function isWebsiteFormSource(source?: string | null) {
  const normalized = source?.trim().toLowerCase() ?? "";
  return (
    normalized.includes("formulaire") ||
    normalized.includes("site web") ||
    normalized === "website"
  );
}

/** True when the conversation thread started on WhatsApp (inbound). */
export function isInboundWhatsAppSource(source?: string | null) {
  const normalized = source?.trim().toLowerCase() ?? "";
  return (
    normalized.includes("whatsapp") &&
    !normalized.includes("offre commande") &&
    !normalized.includes("commande crm")
  );
}

export function cityMatches(orderCity: string, channelCity: string) {
  const order = orderCity.trim().toLowerCase();
  const channel = channelCity.trim().toLowerCase();
  if (!order || !channel) {
    return false;
  }
  return order === channel || order.startsWith(`${channel} `) || order.includes(channel);
}

export function resolveChannelForCity(
  channels: ChannelRow[],
  cityName?: string | null
) {
  const normalizedCity = cityName?.trim();
  if (normalizedCity) {
    const match = channels.find(
      (channel) => channel.city && cityMatches(normalizedCity, channel.city)
    );
    if (match) {
      return match;
    }
  }

  return (
    channels.find((channel) => channel.isDefault) ??
    [...channels].sort((a, b) => a.sortOrder - b.sortOrder)[0] ??
    null
  );
}

export async function resolveChannelIdForCity(
  ctx: QueryCtx | MutationCtx,
  cityName?: string | null
) {
  const channels = await ctx.db.query("whatsappChannels").collect();
  return resolveChannelForCity(channels, cityName)?._id ?? null;
}

/** Pick a WhatsApp line with a 360Messenger API key for outbound sends. */
export function resolveOutboundChannelForCity(
  channels: ChannelRow[],
  cityName?: string | null
) {
  const connected = channels.filter((channel) => channel.messenger360ApiKey);
  if (connected.length === 0) {
    return null;
  }
  return resolveChannelForCity(connected, cityName);
}

/** Default outbound line for website-form leads — Ligne Agadir. */
export function resolveAgadirOutboundChannel(channels: ChannelRow[]) {
  const connected = channels.filter((channel) => channel.messenger360ApiKey);
  if (connected.length === 0) {
    return null;
  }

  return (
    connected.find((channel) => channel.isDefault) ??
    connected.find(
      (channel) => channel.city?.trim().toLowerCase() === "agadir"
    ) ??
    connected.find((channel) => channel.slug === "materiel-medical") ??
    connected.find((channel) => /agadir/i.test(channel.label)) ??
    [...connected].sort((a, b) => a.sortOrder - b.sortOrder)[0] ??
    null
  );
}

export async function resolveAgadirOutboundChannelId(
  ctx: QueryCtx | MutationCtx
) {
  const channels = await ctx.db.query("whatsappChannels").collect();
  return resolveAgadirOutboundChannel(channels)?._id ?? null;
}

export async function resolveOutboundChannelIdForCity(
  ctx: QueryCtx | MutationCtx,
  cityName?: string | null
) {
  const channels = await ctx.db.query("whatsappChannels").collect();
  return resolveOutboundChannelForCity(channels, cityName)?._id ?? null;
}

/**
 * Outbound WhatsApp line for CRM sends:
 * - existing inbound WhatsApp thread → same channel the client used
 * - website form lead → Ligne Agadir
 * - otherwise → city-matched line
 */
export async function resolveOutboundChannelIdForContact(
  ctx: QueryCtx | MutationCtx,
  args: {
    phone: string;
    customerCity?: string | null;
    orderSource?: string | null;
  }
) {
  const channels = await ctx.db.query("whatsappChannels").collect();
  const conversations = await ctx.db
    .query("conversations")
    .withIndex("by_phone", (q) => q.eq("phone", args.phone))
    .collect();

  const inboundWhatsApp = conversations
    .filter((row) => isInboundWhatsAppSource(row.source) && row.channelId)
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt)[0];

  if (inboundWhatsApp?.channelId) {
    const linked = channels.find((row) => row._id === inboundWhatsApp.channelId);
    if (linked?.messenger360ApiKey) {
      return inboundWhatsApp.channelId;
    }
  }

  if (isWebsiteFormSource(args.orderSource)) {
    return resolveAgadirOutboundChannel(channels)?._id ?? null;
  }

  return resolveOutboundChannelForCity(channels, args.customerCity)?._id ?? null;
}
