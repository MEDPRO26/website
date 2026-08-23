import { replaceZipTextFile } from "@/lib/crm/docx-zip";

const TEMPLATE_URL =
  "/contracts/engagement-collaboration-independante-template.docx";

export type CollaborationContractFields = {
  fullName: string;
  city: string;
  phone: string;
  /** ISO or display; empty leaves blanks for the prestataire to fill. */
  date: Date | null;
  /** CIN number if known; we do not store it yet so usually empty. */
  cinNumber?: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blankLine(fallback = "__________________") {
  return fallback;
}

function formatContractDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day} / ${month} / ${year}`;
}

function displayOrBlank(value: string | undefined | null) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "—") {
    return blankLine();
  }
  return escapeXml(trimmed);
}

function fillDocumentXml(xml: string, fields: CollaborationContractFields) {
  const name = displayOrBlank(fields.fullName);
  const cityFilled = Boolean(fields.city?.trim() && fields.city.trim() !== "—");
  const city = displayOrBlank(fields.city);
  const phone = displayOrBlank(fields.phone);
  const cin = displayOrBlank(fields.cinNumber);
  const dateText = fields.date
    ? escapeXml(formatContractDate(fields.date))
    : "____ / ____ / ______";

  let next = xml;
  next = next.split("VOTRE NOM ICI").join(name);
  if (cityFilled) {
    next = next.split("Casablanca").join(city);
  }
  next = next.replace(
    "Fait à : __________________",
    `Fait à : ${city}`
  );
  next = next.replace("Le : ____ / ____ / ______", `Le : ${dateText}`);
  next = next.replace(
    "Nom complet : __________________",
    `Nom complet : ${name}`
  );
  next = next.replace("CIN : __________________", `CIN : ${cin}`);
  next = next.replace(
    "Téléphone : __________________",
    `Téléphone : ${phone}`
  );

  return next;
}

export async function buildCollaborationContractDocx(
  fields: CollaborationContractFields
) {
  const response = await fetch(TEMPLATE_URL);
  if (!response.ok) {
    throw new Error("Impossible de charger le modèle de contrat.");
  }
  const buffer = await response.arrayBuffer();
  return replaceZipTextFile(buffer, "word/document.xml", (xml) =>
    fillDocumentXml(xml, fields)
  );
}

export function downloadUint8Array(bytes: Uint8Array, filename: string) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy.buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function collaborationContractFilename(fullName: string) {
  const slug = fullName
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `engagement-collaboration-${slug || "prestataire"}.docx`;
}
