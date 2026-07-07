export type MediaKind = "audio" | "image" | "video" | "document";

export function resolveMessageMediaKind(
  mediaUrl?: string,
  mediaKind?: MediaKind,
  text?: string
): MediaKind | undefined {
  if (!mediaUrl) {
    return mediaKind;
  }

  if (mediaKind) {
    return mediaKind;
  }

  const lower = mediaUrl.toLowerCase();
  if (isLikelyAudioUrl(lower)) {
    return "audio";
  }
  if (/\.(jpe?g|png|gif|webp|heic)(\?|$)/.test(lower)) {
    return "image";
  }
  if (/\.(mp4|mov|3gp|webm|mkv)(\?|$)/.test(lower)) {
    return "video";
  }

  return "document";
}

function isLikelyAudioUrl(url: string) {
  return (
    /\.(oga|ogg|opus|mp3|m4a|wav|amr|aac)(\?|$)/.test(url) ||
    /storage-whatsapp.*\.(oga|ogg|opus|mp3|m4a|wav|amr|aac)/.test(url)
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

export function shouldRenderAudioPlayer(
  mediaUrl?: string,
  mediaKind?: MediaKind,
  text?: string
) {
  return resolveMessageMediaKind(mediaUrl, mediaKind, text) === "audio";
}
