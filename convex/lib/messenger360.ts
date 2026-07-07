const API_BASE = "https://api.360messenger.com";

export function phoneDigits(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = `212${digits.slice(1)}`;
  }
  return digits;
}

export function webhookUrl(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/whatsapp/webhook`;
}

export type InboundMediaKind = "audio" | "image" | "video" | "document";

export type Inbound360Message = {
  externalId?: string;
  fromPhone: string;
  toPhone?: string;
  text: string;
  type: "chat" | "file";
  /** Raw 360Messenger type (chat, file, ptt, image, …). */
  sourceType?: string;
  mediaUrl?: string;
  mediaKind?: InboundMediaKind;
  apiKeyHint?: string;
};

export type Delivery360Update = {
  trackingCode: string;
  delivery: string;
};

function readString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

/** 360Messenger sends PascalCase keys (From, Chat, Type, ID, Hash). */
function normalizeRecord(raw: Record<string, unknown>) {
  const record: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    record[key.toLowerCase()] = value;
  }
  return record;
}

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

/** Pull a media URL from known 360Messenger file fields only (not arbitrary payload URLs). */
export function extractMediaUrl(record: Record<string, unknown>) {
  const direct =
    readString(record.url) ||
    readString(record.mediaurl) ||
    readString(record.link) ||
    readString(record.fileurl) ||
    readString(record.file) ||
    readString(record.attachment) ||
    readString(record.media);

  if (isHttpUrl(direct)) {
    return direct;
  }

  const chat = readString(record.chat);
  if (isHttpUrl(chat)) {
    return chat;
  }

  return "";
}

const FILE_MESSAGE_TYPES = new Set([
  "file",
  "ptt",
  "audio",
  "voice",
  "document",
  "image",
  "video",
]);

const AUDIO_MESSAGE_TYPES = new Set(["ptt", "audio", "voice"]);

function isDeliveryPayload(record: Record<string, unknown>) {
  return Boolean(record.delivery && (record.id || record.tracking_code));
}

export function parseInboundPayload(raw: unknown): Inbound360Message | Delivery360Update | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = normalizeRecord(raw as Record<string, unknown>);

  if (isDeliveryPayload(record)) {
    return {
      trackingCode: readString(record.id ?? record.tracking_code),
      delivery: readString(record.delivery),
    };
  }

  const nested = record.data;
  if (Array.isArray(nested) && nested.length > 0) {
    return parseInboundPayload(nested[0]);
  }

  const dataType = readString(record.datatype).toLowerCase();
  if (dataType && dataType !== "message") {
    return null;
  }

  const type = (readString(record.type) || "chat").toLowerCase();
  const fromPhone = readString(record.from ?? record.phonenumber ?? record.phone);
  const mediaUrl = extractMediaUrl(record);
  const chatText =
    readString(record.chat) ||
    readString(record.text) ||
    readString(record.message);
  const caption =
    chatText && chatText.toUpperCase() !== "N/A" && !isHttpUrl(chatText)
      ? chatText
      : "";

  if (!fromPhone) {
    return null;
  }

  if (type !== "chat" && !FILE_MESSAGE_TYPES.has(type)) {
    return null;
  }

  const isFile = FILE_MESSAGE_TYPES.has(type);

  if (!isFile && !caption) {
    return null;
  }

  const resolvedMediaUrl = isFile ? mediaUrl || undefined : undefined;
  const mediaKind = resolvedMediaUrl
    ? detectMediaKind(resolvedMediaUrl, record, type)
    : undefined;
  const fallbackLabel = mediaKind ? MEDIA_LABEL[mediaKind] : "Fichier";
  const text = isFile ? caption || `[${fallbackLabel}]` : caption;

  return {
    externalId: readString(record.id ?? record.whatsappid) || undefined,
    fromPhone,
    toPhone: readString(record.to) || undefined,
    text,
    type: isFile ? "file" : "chat",
    sourceType: type,
    mediaUrl: resolvedMediaUrl,
    mediaKind,
    apiKeyHint: readString(record.hash) || undefined,
  };
}

const MEDIA_LABEL: Record<InboundMediaKind, string> = {
  audio: "Message vocal",
  image: "Image",
  video: "Vidéo",
  document: "Document",
};

export function detectMediaKind(
  url: string,
  record: Record<string, unknown>,
  type = "file"
): InboundMediaKind {
  if (AUDIO_MESSAGE_TYPES.has(type)) {
    return "audio";
  }
  if (type === "image") {
    return "image";
  }
  if (type === "video") {
    return "video";
  }

  const hint = `${url} ${readString(record.mimetype)} ${readString(
    record.filetype
  )} ${readString(record.datatype)} ${type}`.toLowerCase();

  if (
    /(audio|voice|ptt|ogg|oga|opus|mp3|m4a|wav|amr|aac)/.test(hint) ||
    /storage-whatsapp.*\.(oga|ogg|opus|mp3|m4a|wav|amr|aac)/.test(hint)
  ) {
    return "audio";
  }
  if (/(image|jpg|jpeg|png|gif|webp|heic)/.test(hint)) {
    return "image";
  }
  if (/(video|mp4|mov|3gp|webm|mkv)/.test(hint)) {
    return "video";
  }
  return "document";
}

export function classifyMediaUrl(url: string, type = "file") {
  return detectMediaKind(url, {}, type);
}

type Received360Row = Record<string, unknown>;

function readReceivedRows(body: unknown): Received360Row[] {
  if (!body || typeof body !== "object") {
    return [];
  }

  const record = body as Record<string, unknown>;
  if (Array.isArray(record.data)) {
    return record.data.filter(
      (row): row is Received360Row => !!row && typeof row === "object"
    );
  }

  if (Array.isArray(body)) {
    return body.filter(
      (row): row is Received360Row => !!row && typeof row === "object"
    );
  }

  return [];
}

export type Fetched360Media = {
  mediaUrl: string;
  sourceType: string;
  record: Record<string, unknown>;
};

/** Fetch file URL from 360Messenger when the webhook omits it. */
export async function fetchReceivedMessageMedia(
  apiKey: string,
  opts: { messageId: string; fromPhone?: string }
): Promise<Fetched360Media | null> {
  if (!opts.messageId) {
    return null;
  }

  const phoneDigitsValue = opts.fromPhone ? phoneDigits(opts.fromPhone) : "";
  const phoneFilter = phoneDigitsValue
    ? `&phonenumber=${encodeURIComponent(phoneDigitsValue)}`
    : "";
  const response = await fetch(
    `${API_BASE}/showAllGetMessages/${encodeURIComponent(apiKey)}?page=1${phoneFilter}`
  );
  if (!response.ok) {
    return null;
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return null;
  }

  const rows = readReceivedRows(body);
  for (const row of rows) {
    const record = normalizeRecord(row);
    const id = readString(record.id);
    if (!id || id !== opts.messageId) {
      continue;
    }

    const rowType = (readString(record.type) || "chat").toLowerCase();
    if (rowType === "chat") {
      return null;
    }

    const mediaUrl = extractMediaUrl(record);
    if (mediaUrl) {
      return { mediaUrl, sourceType: rowType, record };
    }
  }

  return null;
}

function authHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export async function set360Webhook(apiKey: string, url: string) {
  const response = await fetch(`${API_BASE}/v2/settings/webhook/set`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify({ url }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Webhook 360Messenger (${response.status}): ${body}`);
  }
  return body;
}

export async function enable360Receive(apiKey: string) {
  const response = await fetch(`${API_BASE}/v2/settings/receive`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify({ receive: "on" }),
  });
  const body = await response.text();
  // Non-blocking: some plans auto-enable receive; ignore 404 on this optional call.
  if (!response.ok && response.status !== 404) {
    throw new Error(`Receive 360Messenger (${response.status}): ${body}`);
  }
  return body;
}

export async function send360Message(
  apiKey: string,
  toPhone: string,
  text: string,
  mediaUrl?: string
) {
  const trimmedText = text.trim() || (mediaUrl ? "Message vocal" : "");
  if (!trimmedText && !mediaUrl) {
    throw new Error("Message vide.");
  }

  if (mediaUrl) {
    const form = new URLSearchParams();
    form.set("phonenumber", phoneDigits(toPhone));
    form.set("text", trimmedText);
    form.set("url", mediaUrl);

    const response = await fetch(
      `${API_BASE}/sendMessage/${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      }
    );
    const body = await response.text();
    if (!response.ok) {
      throw new Error(`Envoi média 360Messenger (${response.status}): ${body}`);
    }
    return body.trim();
  }

  const response = await fetch(`${API_BASE}/v2/sendMessage`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify({
      phonenumber: phoneDigits(toPhone),
      text: trimmedText,
    }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Envoi 360Messenger (${response.status}): ${body}`);
  }
  return body.trim();
}

export async function parseHttpBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch {
      return null;
    }
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    const record: Record<string, string> = {};
    form.forEach((value, key) => {
      record[key] = String(value);
    });
    return record;
  }

  const text = await request.text();
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    const params = new URLSearchParams(text);
    const record: Record<string, string> = {};
    params.forEach((value, key) => {
      record[key] = value;
    });
    return Object.keys(record).length > 0 ? record : { text };
  }
}
