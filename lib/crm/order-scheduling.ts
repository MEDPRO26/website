/** Duration, desired date and time slot apply to rental and care services, not product sales. */
export function orderShowsSchedulingFields(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("vente")) {
    return false;
  }
  return (
    lower.includes("location") ||
    lower.includes("service") ||
    lower.includes("soin") ||
    lower.includes("garde") ||
    lower.includes("aide") ||
    lower.includes("domicile")
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

export function validateDesiredDateRange(from: string, to: string): string | null {
  const start = from.trim();
  const end = to.trim();
  if (!start && !end) {
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

const SUPPLIER_DELIVERY_STATUSES = new Set([
  "acceptee",
  "planifiee",
  "en_cours",
  "location_active",
]);

/** Supplier should contact the client to deliver or perform the service. */
export function supplierShouldDeliverOrder(status: string) {
  return SUPPLIER_DELIVERY_STATUSES.has(status);
}
