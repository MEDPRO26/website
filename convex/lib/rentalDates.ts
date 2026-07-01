const DAY_MS = 24 * 60 * 60 * 1000;

/** Parse French rental duration strings into milliseconds. */
export function parseRentalDurationMs(duration?: string): number | null {
  if (!duration?.trim()) {
    return null;
  }

  const value = duration.trim().toLowerCase();

  const dayMatch = value.match(/(\d+)\s*jou/);
  if (dayMatch) {
    return Number(dayMatch[1]) * DAY_MS;
  }

  const weekMatch = value.match(/(\d+)\s*semaine/);
  if (weekMatch) {
    return Number(weekMatch[1]) * 7 * DAY_MS;
  }

  const monthMatch = value.match(/(\d+)\s*mois/);
  if (monthMatch) {
    return Number(monthMatch[1]) * 30 * DAY_MS;
  }

  return null;
}

export const RENTAL_REMINDER_WINDOW_MS = 3 * DAY_MS;
