export type MediaKind = "audio" | "image" | "video" | "document";

export function resolveMessageMediaKind(
  mediaUrl?: string,
  mediaKind?: MediaKind,
  text?: string
): MediaKind | undefined {
  if (!mediaUrl) {
    return mediaKind;
  }

  if (mediaKind && mediaKind !== "document") {
    return mediaKind;
  }

  const lower = mediaUrl.toLowerCase();
  if (isLikelyAudioUrl(lower, text)) {
    return "audio";
  }
  if (/\.(jpe?g|png|gif|webp|heic)(\?|$)/.test(lower)) {
    return "image";
  }
  if (/\.(mp4|mov|3gp|webm|mkv)(\?|$)/.test(lower)) {
    return "video";
  }

  return mediaKind ?? "document";
}

function isLikelyAudioUrl(url: string, text?: string) {
  if (
    /\.(oga|ogg|opus|mp3|m4a|wav|amr|aac)(\?|$)/.test(url) ||
    url.includes("storage-whatsapp") ||
    url.includes("api.360messenger.com/files")
  ) {
    return true;
  }

  const label = text?.trim().toLowerCase();
  return (
    label === "[document]" ||
    label === "[message vocal]" ||
    label === "[fichier]"
  );
}

export function shouldShowMessageText(text: string, mediaUrl?: string) {
  if (!text) {
    return false;
  }
  if (mediaUrl && /^\[[^\]]+\]$/.test(text.trim())) {
    return false;
  }
  return true;
}
