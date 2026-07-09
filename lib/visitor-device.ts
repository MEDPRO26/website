export type VisitorDevice = "mobile" | "desktop";

export function detectVisitorDevice(): VisitorDevice {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      ua
    )
  ) {
    return "mobile";
  }

  return "desktop";
}

export function visitorDeviceLabel(device?: VisitorDevice | null) {
  if (device === "mobile") return "Mobile";
  if (device === "desktop") return "Desktop";
  return "Inconnu";
}
