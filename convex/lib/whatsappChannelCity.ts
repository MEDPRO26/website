import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type ChannelRow = Doc<"whatsappChannels">;

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
