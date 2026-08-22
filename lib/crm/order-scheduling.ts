/** Care / domicile prestation orders (not matériel vente/location). */
export function isServiceOrderType(type?: string | null) {
  const lower = (type ?? "").toLowerCase();
  return (
    lower.includes("service") ||
    lower.includes("soin") ||
    lower.includes("garde") ||
    lower.includes("aide") ||
    lower.includes("domicile")
  );
}

/** Duration, desired date and time slot apply to rental and care services, not product sales. */
export function orderShowsSchedulingFields(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("vente")) {
    return false;
  }
  return (
    lower.includes("location") ||
    isServiceOrderType(type)
  );
}

export function formatIsoDateFr(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) {
    return iso;
  }
  return `${day}/${month}/${year}`;
}

export function formatDesiredDateRange(from: string, to: string) {
  const start = from.trim();
  const end = to.trim();
  if (!start && !end) {
    return undefined;
  }
  if (start && !end) {
    return formatIsoDateFr(start);
  }
  if (!start && end) {
    return formatIsoDateFr(end);
  }
  if (start === end) {
    return formatIsoDateFr(start);
  }
  return `${formatIsoDateFr(start)} — ${formatIsoDateFr(end)}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Inclusive calendar days between two ISO `YYYY-MM-DD` dates. */
export function inclusiveDayCount(fromIso: string, toIso: string): number | null {
  const start = fromIso.trim();
  const end = toIso.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return null;
  }
  if (end < start) {
    return null;
  }
  const startMs = Date.parse(`${start}T12:00:00`);
  const endMs = Date.parse(`${end}T12:00:00`);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return null;
  }
  return Math.round((endMs - startMs) / DAY_MS) + 1;
}

export function formatDurationLabel(dayCount: number) {
  return dayCount === 1 ? "1 jour" : `${dayCount} jours`;
}

/** Persist duration from the admin date range (inclusive). */
export function formatDurationFromDateRange(from: string, to: string) {
  const days = inclusiveDayCount(from, to);
  if (days == null) {
    return undefined;
  }
  return formatDurationLabel(days);
}

function parseFrDateToIso(fr: string): string | null {
  const match = fr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return null;
  }
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  const year = match[3];
  return `${year}-${month}-${day}`;
}

/**
 * Prefer stored duration; otherwise derive it from a desired-date range
 * like `03/08/2026 — 17/08/2026`.
 */
export function resolveOrderDuration(
  duration?: string | null,
  desiredDate?: string | null
) {
  const stored = duration?.trim();
  if (stored) {
    return stored;
  }

  const range = desiredDate?.trim();
  if (!range) {
    return undefined;
  }

  const parts = range.split(/\s*[—–-]\s*/).map((part) => part.trim());
  if (parts.length !== 2) {
    return undefined;
  }

  const fromIso = parseFrDateToIso(parts[0]);
  const toIso = parseFrDateToIso(parts[1]);
  if (!fromIso || !toIso) {
    return undefined;
  }

  return formatDurationFromDateRange(fromIso, toIso);
}

/** Extract day count from labels like `15 jours` or a desired-date range. */
export function parseDurationDays(
  duration?: string | null,
  desiredDate?: string | null
): number | null {
  const label = resolveOrderDuration(duration, desiredDate);
  if (!label) {
    return null;
  }
  const match = label.match(/(\d+)\s*jou/i);
  if (!match) {
    return null;
  }
  const days = Number(match[1]);
  return Number.isFinite(days) && days > 0 ? days : null;
}

export type PrestationPricingMode = "hour" | "day" | "flat";

export function prestationModeLabel(mode: PrestationPricingMode) {
  if (mode === "hour") return "à l'heure";
  if (mode === "day") return "à la journée";
  return "forfait";
}

/** Parse `8h18`, `8:18`, `21h` → minutes from midnight. */
export function parseFrenchTimeToMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2})(?:[h:](\d{1,2}))?$/i);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = match[2] !== undefined ? Number(match[2]) : 0;
  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours > 23 ||
    minutes > 59
  ) {
    return null;
  }
  return hours * 60 + minutes;
}

/**
 * Hours in one créneau, e.g. `de 8h18 à 21h18` → 13.
 * Multiple slots joined by `;` are summed.
 */
export function parseSlotHoursPerDay(slot?: string | null): number | null {
  if (!slot?.trim()) {
    return null;
  }

  let totalHours = 0;
  let matched = false;

  for (const part of slot.split(/\s*;\s*/)) {
    const range = part.match(
      /(?:de\s+)?(\d{1,2}(?:[h:]\d{1,2})?)\s+(?:à|a|[-–—])\s+(\d{1,2}(?:[h:]\d{1,2})?)/i
    );
    if (!range) {
      continue;
    }
    const start = parseFrenchTimeToMinutes(range[1]);
    const end = parseFrenchTimeToMinutes(range[2]);
    if (start == null || end == null || end <= start) {
      continue;
    }
    totalHours += (end - start) / 60;
    matched = true;
  }

  if (!matched) {
    return null;
  }

  // Keep quarter-hour precision (e.g. 8h30 → 12.5 h).
  return Math.round(totalHours * 4) / 4;
}

/** Total hours for the prestation: hours/day × number of days. */
export function estimatePrestationTotalHours(
  duration?: string | null,
  desiredDate?: string | null,
  slot?: string | null
): number | null {
  const days = parseDurationDays(duration, desiredDate);
  const hoursPerDay = parseSlotHoursPerDay(slot);
  if (days == null || hoursPerDay == null || hoursPerDay <= 0) {
    return null;
  }
  return Math.round(days * hoursPerDay * 4) / 4;
}

export function validateDesiredDateRange(
  from: string,
  to: string,
  options?: { allowPartial?: boolean }
): string | null {
  const start = from.trim();
  const end = to.trim();
  if (!start && !end) {
    return null;
  }
  if (options?.allowPartial) {
    if (start && end && end < start) {
      return "La date de fin doit être après la date de début.";
    }
    return null;
  }
  if (start && !end) {
    return "Indiquez la date de fin.";
  }
  if (!start && end) {
    return "Indiquez la date de début.";
  }
  if (end < start) {
    return "La date de fin doit être après la date de début.";
  }
  return null;
}

/** Parse stored `03/08/2026 — 17/08/2026` back to ISO date inputs. */
export function parseDesiredDateRangeToIso(desiredDate?: string | null): {
  from: string;
  to: string;
} {
  const range = desiredDate?.trim();
  if (!range) {
    return { from: "", to: "" };
  }

  const parts = range.split(/\s*[—–-]\s*/).map((part) => part.trim());
  if (parts.length === 2) {
    return {
      from: parseFrDateToIso(parts[0]) ?? "",
      to: parseFrDateToIso(parts[1]) ?? "",
    };
  }

  const single = parseFrDateToIso(range);
  return { from: single ?? "", to: single ?? "" };
}

/** Parse `de 8h18 à 21h18` into time picker values (`08:18`). */
export function parseSlotToTimeSlotInput(slot?: string | null): TimeSlotInput {
  const empty = { from: "", to: "" };
  if (!slot?.trim()) {
    return empty;
  }

  const range = slot.match(
    /(?:de\s+)?(\d{1,2}(?:[h:]\d{1,2})?)\s+(?:à|a|[-–—])\s+(\d{1,2}(?:[h:]\d{1,2})?)/i
  );
  if (!range) {
    return empty;
  }

  const fromMinutes = parseFrenchTimeToMinutes(range[1]);
  const toMinutes = parseFrenchTimeToMinutes(range[2]);
  if (fromMinutes == null || toMinutes == null) {
    return empty;
  }

  const toHhmm = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  return {
    from: toHhmm(fromMinutes),
    to: toHhmm(toMinutes),
  };
}

export function serviceOrderSchedulingComplete(order: {
  desiredDate?: string | null;
  slot?: string | null;
}) {
  return Boolean(order.desiredDate?.trim() && order.slot?.trim());
}

export function formatTimeFr(hhmm: string) {
  const [hours, minutes] = hhmm.split(":");
  if (!hours) {
    return hhmm;
  }
  const hour = String(Number.parseInt(hours, 10));
  const minute = (minutes ?? "00").padStart(2, "0");
  return `${hour}h${minute}`;
}

export function formatTimeSlotRange(from: string, to: string) {
  const start = from.trim();
  const end = to.trim();
  if (!start && !end) {
    return undefined;
  }
  if (start && !end) {
    return `de ${formatTimeFr(start)}`;
  }
  if (!start && end) {
    return `jusqu'à ${formatTimeFr(end)}`;
  }
  if (start === end) {
    return formatTimeFr(start);
  }
  return `de ${formatTimeFr(start)} à ${formatTimeFr(end)}`;
}

export type TimeSlotInput = {
  from: string;
  to: string;
};

export function formatTimeSlots(slots: TimeSlotInput[]) {
  const parts = slots
    .map((slot) => formatTimeSlotRange(slot.from, slot.to))
    .filter((part): part is string => Boolean(part));

  if (parts.length === 0) {
    return undefined;
  }

  return parts.join(" ; ");
}

export function validateTimeSlotRange(from: string, to: string): string | null {
  const start = from.trim();
  const end = to.trim();
  if (!start && !end) {
    return null;
  }
  if (start && !end) {
    return "Indiquez l'heure de fin.";
  }
  if (!start && end) {
    return "Indiquez l'heure de début.";
  }
  if (end <= start) {
    return "L'heure de fin doit être après l'heure de début.";
  }
  return null;
}

export function validateTimeSlots(slots: TimeSlotInput[]): string | null {
  for (let index = 0; index < slots.length; index += 1) {
    const error = validateTimeSlotRange(slots[index].from, slots[index].to);
    if (error) {
      return slots.length > 1 ? `Créneau ${index + 1} : ${error}` : error;
    }
  }
  return null;
}

const SUPPLIER_CLIENT_ACTION_STATUSES = new Set([
  "envoyee_fournisseur",
  "vue_fournisseur",
  "en_contact_client",
  "prix_recu",
  "offre_envoyee",
  "acceptee",
  "planifiee",
  "en_cours",
  "location_active",
]);

/** Supplier may contact the client and use delivery actions once assigned. */
export function supplierShouldDeliverOrder(status: string) {
  return SUPPLIER_CLIENT_ACTION_STATUSES.has(status);
}

export function supplierIsEarlyClientContactPhase(status: string) {
  return (
    status === "envoyee_fournisseur" ||
    status === "vue_fournisseur" ||
    status === "en_contact_client" ||
    status === "prix_recu" ||
    status === "offre_envoyee"
  );
}
