"use client";

import { useMutation } from "convex/react";
import { usePathname } from "next/navigation";
import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useRef,
} from "react";
import { api } from "@/convex/_generated/api";
import { getCitySlugFromPath } from "@/lib/routes";
import {
  getCachedVisitorGeo,
  getOrCreateSessionKey,
  getVisitorDeviceType,
  loadVisitorGeo,
} from "@/lib/visitor-session";
import type { WhatsAppPlacement } from "@/lib/whatsapp-tracking";

type TrackedWhatsAppLinkProps = {
  href: string;
  placement: WhatsAppPlacement;
  line?: string;
  label?: string;
  children: ReactNode;
  className?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  "aria-label"?: string;
  title?: string;
};

export function TrackedWhatsAppLink({
  href,
  placement,
  line,
  label,
  children,
  className,
  target = "_blank",
  rel = "noopener noreferrer",
  "aria-label": ariaLabel,
  title,
}: TrackedWhatsAppLinkProps) {
  const pathname = usePathname();
  const recordClick = useMutation(api.whatsappClicks.recordClick);
  const recordingRef = useRef(false);

  const track = () => {
    if (recordingRef.current) return;
    recordingRef.current = true;
    window.setTimeout(() => {
      recordingRef.current = false;
    }, 800);

    const sessionKey = getOrCreateSessionKey();
    if (!sessionKey) return;

    const path = pathname || "/";
    const pageCitySlug = getCitySlugFromPath(path);
    const geo = getCachedVisitorGeo();
    const deviceType = getVisitorDeviceType();

    void (async () => {
      const resolvedGeo = geo ?? (await loadVisitorGeo());
      await recordClick({
        sessionKey,
        path,
        placement,
        pageCitySlug,
        city: resolvedGeo?.city ?? undefined,
        country: resolvedGeo?.country ?? undefined,
        countryCode: resolvedGeo?.countryCode ?? undefined,
        deviceType,
        line,
        label,
      });
    })().catch(() => {
      // Never block WhatsApp navigation on analytics errors.
    });
  };

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Fire-and-forget; do not preventDefault.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      track();
      return;
    }
    track();
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      onAuxClick={(event) => {
        if (event.button === 1) track();
      }}
    >
      {children}
    </a>
  );
}
