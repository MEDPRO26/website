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

export type Inbound360Message = {
  externalId?: string;
  fromPhone: string;
  toPhone?: string;
  text: string;
  type: "chat" | "file";
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

function isDeliveryPayload(record: Record<string, unknown>) {
  return Boolean(record.delivery && (record.id || record.tracking_Code));
}

export function parseInboundPayload(raw: unknown): Inbound360Message | Delivery360Update | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;

  if (isDeliveryPayload(record)) {
    return {
      trackingCode: readString(record.id ?? record.tracking_Code),
      delivery: readString(record.delivery),
    };
  }

  const nested = record.data;
  if (Array.isArray(nested) && nested.length > 0) {
    return parseInboundPayload(nested[0]);
  }

  const type = readString(record.type) || "chat";
  const fromPhone = readString(record.from ?? record.phonenumber ?? record.phone);
  const text =
    readString(record.chat) ||
    readString(record.text) ||
    readString(record.message) ||
    readString(record.file);

  if (!fromPhone || !text) {
    return null;
  }

  if (type !== "chat" && type !== "file") {
    return null;
  }

  return {
    externalId: readString(record.id) || undefined,
    fromPhone,
    toPhone: readString(record.to) || undefined,
    text: type === "file" ? `[Fichier] ${text}` : text,
    type,
    apiKeyHint: readString(record.hash) || undefined,
  };
}

export async function set360Webhook(apiKey: string, url: string) {
  const encoded = encodeURIComponent(url);
  const response = await fetch(
    `${API_BASE}/webhook/set/${encodeURIComponent(apiKey)}?url=${encoded}`
  );
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Webhook 360Messenger (${response.status}): ${body}`);
  }
  return body;
}

export async function enable360Receive(apiKey: string) {
  const response = await fetch(
    `${API_BASE}/receive/${encodeURIComponent(apiKey)}?receive=on`
  );
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Receive 360Messenger (${response.status}): ${body}`);
  }
  return body;
}

export async function send360Message(apiKey: string, toPhone: string, text: string) {
  const form = new FormData();
  form.set("phonenumber", phoneDigits(toPhone));
  form.set("text", text.trim());

  const response = await fetch(
    `${API_BASE}/sendMessage/${encodeURIComponent(apiKey)}`,
    { method: "POST", body: form }
  );
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
