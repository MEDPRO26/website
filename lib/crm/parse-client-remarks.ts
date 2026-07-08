export type ClientRemarkField = {
  label: string;
  value: string;
};

export type ParsedClientRemarks = {
  fields: ClientRemarkField[];
  notes: string[];
};

const STRUCTURED_LABELS = [
  "Catégorie",
  "Quantité",
  "Durée",
  "Créneau",
  "Ville",
  "District",
  "Date souhaitée",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseByLines(lines: string[]): ParsedClientRemarks {
  const fields: ClientRemarkField[] = [];
  const notes: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([^:]+)\s*:\s*(.+)$/);
    if (match) {
      fields.push({ label: match[1].trim(), value: match[2].trim() });
      continue;
    }
    notes.push(line);
  }

  return { fields, notes };
}

function splitQuantityValue(value: string) {
  const match = value.match(/^(\d+)\s+(.+)$/);
  if (!match) {
    return { quantity: value, note: null as string | null };
  }
  return { quantity: match[1], note: match[2].trim() };
}

function parseSingleLine(message: string): ParsedClientRemarks {
  const labelPattern = STRUCTURED_LABELS.map(escapeRegExp).join("|");
  const regex = new RegExp(`\\b(${labelPattern})\\s*:\\s*`, "gi");
  const matches = [...message.matchAll(regex)];

  if (matches.length === 0) {
    return { fields: [], notes: [message] };
  }

  const fields: ClientRemarkField[] = [];
  const notes: string[] = [];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const label = match[1].trim();
    const valueStart = match.index! + match[0].length;
    const valueEnd =
      index + 1 < matches.length ? matches[index + 1].index! : message.length;
    let value = message.slice(valueStart, valueEnd).trim();
    if (!value) {
      continue;
    }

    if (label.toLowerCase() === "quantité") {
      const { quantity, note } = splitQuantityValue(value);
      fields.push({ label, value: quantity });
      if (note) {
        notes.push(note);
      }
      continue;
    }

    fields.push({ label, value });
  }

  return { fields, notes };
}

export function parseClientRemarks(message: string): ParsedClientRemarks {
  const trimmed = message.trim();
  if (!trimmed) {
    return { fields: [], notes: [] };
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    const parsed = parseByLines(lines);
    const quantityField = parsed.fields.find(
      (field) => field.label.toLowerCase() === "quantité"
    );
    if (quantityField) {
      const { quantity, note } = splitQuantityValue(quantityField.value);
      quantityField.value = quantity;
      if (note) {
        parsed.notes.push(note);
      }
    }
    return parsed;
  }

  return parseSingleLine(trimmed);
}
