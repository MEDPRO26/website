const EXTENSION_BY_MIME: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "audio/opus": "ogg",
  "audio/amr": "amr",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

const MIME_BY_EXTENSION: Record<string, string> = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  ogg: "audio/ogg",
  amr: "audio/amr",
  wav: "audio/wav",
};

export function normalizeAudioMimeType(contentType: string) {
  return contentType.toLowerCase().split(";")[0]?.trim() ?? "";
}

export function isWebmAudio(contentType: string) {
  const mime = normalizeAudioMimeType(contentType);
  return mime === "audio/webm" || mime.endsWith("/webm");
}

export function isWhatsAppAudioSupported(contentType: string) {
  const mime = normalizeAudioMimeType(contentType);
  if (!mime || isWebmAudio(mime)) {
    return false;
  }
  return mime in EXTENSION_BY_MIME;
}

export function audioExtensionForMime(contentType: string) {
  const mime = normalizeAudioMimeType(contentType);
  return EXTENSION_BY_MIME[mime] ?? null;
}

export function mimeForAudioExtension(extension: string) {
  return MIME_BY_EXTENSION[extension.toLowerCase()] ?? "application/octet-stream";
}

export function assertWhatsAppAudioContentType(contentType: string) {
  if (isWebmAudio(contentType)) {
    throw new Error(
      "Format WebM non supporté par WhatsApp. Réessayez l'envoi pour relancer la conversion."
    );
  }
  if (!isWhatsAppAudioSupported(contentType)) {
    const mime = normalizeAudioMimeType(contentType) || "inconnu";
    throw new Error(
      `Format audio non supporté (${mime}). Utilisez MP3, OGG ou M4A.`
    );
  }
}

export function buildWhatsAppMediaUrl(
  siteUrl: string,
  storageId: string,
  contentType: string
) {
  const ext = audioExtensionForMime(contentType);
  if (!ext) {
    throw new Error("Extension audio introuvable pour ce format.");
  }
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/whatsapp/media/${storageId}.${ext}`;
}

export function parseStorageIdFromMediaPath(pathname: string) {
  const match = pathname.match(/\/whatsapp\/media\/([^/]+)$/);
  if (!match) {
    return null;
  }
  const filePart = match[1];
  const dotIndex = filePart.lastIndexOf(".");
  if (dotIndex <= 0) {
    return { storageId: filePart, extension: null };
  }
  return {
    storageId: filePart.slice(0, dotIndex),
    extension: filePart.slice(dotIndex + 1),
  };
}
