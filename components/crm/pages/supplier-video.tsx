"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, Play, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { HERO_IMAGE, LOGO, LOGO_ALT, SITE_WEBSITE } from "@/lib/brand";
import { cn } from "@/lib/utils";

const SUPPLIER_VIDEOS = [
  {
    id: "8PeZJuEQsOg",
    title: "Version ordinateur",
    description:
      "Comment utiliser votre espace fournisseur SOS Santé sur ordinateur.",
    orientation: "landscape" as const,
  },
  {
    id: "ab08IIZn3Qg",
    title: "Version mobile",
    description:
      "Comment utiliser votre espace fournisseur SOS Santé sur téléphone.",
    orientation: "portrait" as const,
  },
] as const;

const YT_API_SRC = "https://www.youtube.com/iframe_api";

type YtPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
  unloadModule?: (module: string) => void;
  setOption?: (module: string, option: string, value: unknown) => void;
};

function disableCaptions(player: YtPlayer) {
  try {
    player.unloadModule?.("captions");
    player.unloadModule?.("cc");
    player.setOption?.("captions", "track", {});
  } catch {
    /* YouTube may not expose caption modules on every build */
  }
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YtPlayer }) => void;
            onStateChange?: (event: { data: number; target: YtPlayer }) => void;
          };
        }
      ) => YtPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = YT_API_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

function BrandCover({
  title,
  orientation,
  onPlay,
}: {
  title: string;
  orientation: "landscape" | "portrait";
  onPlay: () => void;
}) {
  const isPortrait = orientation === "portrait";
  const Icon = isPortrait ? Smartphone : Monitor;

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 overflow-hidden bg-[#0b1f33] px-6 text-center"
      aria-label={`Lire — ${title}`}
    >
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
        sizes={isPortrait ? "384px" : "768px"}
        priority={false}
      />
      <span className="absolute inset-0 bg-gradient-to-b from-[#0b1f33]/70 via-[#0b1f33]/55 to-[#0b1f33]/85" />

      <div className="relative z-10 flex max-w-[85%] flex-col items-center gap-3">
        <Image
          src={LOGO.white}
          alt={LOGO_ALT}
          width={isPortrait ? 180 : 240}
          height={isPortrait ? 51 : 68}
          className="h-auto w-auto max-w-full object-contain drop-shadow"
        />
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
          {SITE_WEBSITE}
        </p>
        <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Icon className="size-3.5" aria-hidden />
          {title}
        </div>
      </div>

      <span
        className={cn(
          "relative z-10 mt-2 grid place-items-center rounded-full bg-[#32a0f3] text-white shadow-lg shadow-black/30",
          "transition-transform group-hover:scale-105",
          isPortrait ? "size-14" : "size-16"
        )}
      >
        <Play
          className={cn(
            "fill-current pl-0.5",
            isPortrait ? "size-6" : "size-7"
          )}
          aria-hidden
        />
      </span>
    </button>
  );
}

function SupplierExplainerPlayer({
  videoId,
  title,
  orientation = "landscape",
}: {
  videoId: string;
  title: string;
  orientation?: "landscape" | "portrait";
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const draggingRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const isPortrait = orientation === "portrait";

  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    let raf = 0;

    const tick = () => {
      const player = playerRef.current;
      if (player && !draggingRef.current) {
        setCurrent(player.getCurrentTime() || 0);
        const nextDuration = player.getDuration() || 0;
        if (nextDuration > 0) setDuration(nextDuration);
      }
      raf = window.requestAnimationFrame(tick);
    };

    void loadYouTubeApi().then(() => {
      if (cancelled || !hostRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          hl: "fr",
          playsinline: 1,
          fs: 0,
          disablekb: 1,
          enablejsapi: 1,
          autoplay: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            disableCaptions(event.target);
            setReady(true);
            setDuration(event.target.getDuration() || 0);
            event.target.playVideo();
            // Captions often re-enable after autoplay — clear again shortly after.
            window.setTimeout(() => disableCaptions(event.target), 400);
            window.setTimeout(() => disableCaptions(event.target), 1200);
            raf = window.requestAnimationFrame(tick);
          },
          onStateChange: (event) => {
            if (!window.YT) return;
            disableCaptions(event.target);
            setPlaying(event.data === window.YT.PlayerState.PLAYING);
            if (event.data === window.YT.PlayerState.ENDED) {
              setPlaying(false);
              setCurrent(event.target.getDuration() || 0);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [started, videoId]);

  const togglePlay = useCallback(() => {
    if (!started) {
      setStarted(true);
      return;
    }
    const player = playerRef.current;
    if (!player || !ready) return;
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [playing, ready, started]);

  const seekFromClientX = useCallback(
    (clientX: number, track: HTMLElement) => {
      const player = playerRef.current;
      if (!player || duration <= 0) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const next = ratio * duration;
      setCurrent(next);
      player.seekTo(next, true);
    },
    [duration]
  );

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm",
        isPortrait && "mx-auto w-full max-w-sm"
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-black",
          isPortrait ? "aspect-[9/16] max-h-[70vh]" : "aspect-video"
        )}
      >
        {started ? (
          <>
            {isPortrait ? (
              <div className="absolute left-1/2 top-0 h-full w-[177.78%] -translate-x-1/2">
                <div ref={hostRef} className="h-full w-full" />
              </div>
            ) : (
              <div
                className="absolute left-0 w-full"
                style={{ top: "-12%", height: "124%" }}
              >
                <div ref={hostRef} className="h-full w-full" />
              </div>
            )}

            <button
              type="button"
              onClick={togglePlay}
              disabled={!ready}
              className="absolute inset-0 z-10"
              aria-label={
                playing ? `Mettre en pause — ${title}` : `Lire — ${title}`
              }
            />

            {!playing && ready ? (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/25">
                <span className="grid size-14 place-items-center rounded-full bg-[#32a0f3] text-white shadow-lg">
                  <Play className="size-6 fill-current pl-0.5" aria-hidden />
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <BrandCover
            title={title}
            orientation={orientation}
            onPlay={() => setStarted(true)}
          />
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-border/60 bg-card px-3 py-2.5 sm:px-4">
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
          {formatTime(current)}
        </span>

        <div
          role="slider"
          aria-label={`Position — ${title}`}
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(current)}
          tabIndex={started ? 0 : -1}
          className={cn(
            "relative h-8 flex-1 touch-none",
            started ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          )}
          onPointerDown={(event) => {
            if (!started) return;
            draggingRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            seekFromClientX(event.clientX, event.currentTarget);
          }}
          onPointerMove={(event) => {
            if (!draggingRef.current) return;
            seekFromClientX(event.clientX, event.currentTarget);
          }}
          onPointerUp={(event) => {
            draggingRef.current = false;
            try {
              event.currentTarget.releasePointerCapture(event.pointerId);
            } catch {
              /* already released */
            }
          }}
          onKeyDown={(event) => {
            const player = playerRef.current;
            if (!player || duration <= 0) return;
            const step = event.shiftKey ? 10 : 5;
            if (event.key === "ArrowRight") {
              event.preventDefault();
              const next = Math.min(duration, current + step);
              setCurrent(next);
              player.seekTo(next, true);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              const next = Math.max(0, current - step);
              setCurrent(next);
              player.seekTo(next, true);
            }
          }}
        >
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted">
            <div
              className="relative h-full rounded-full bg-[#32a0f3]"
              style={{ width: `${progress}%` }}
            >
              <span
                className={cn(
                  "absolute right-0 top-1/2 size-3.5 -translate-y-1/2 translate-x-1/2 rounded-full",
                  "bg-[#32a0f3] shadow ring-2 ring-white"
                )}
              />
            </div>
          </div>
        </div>

        <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

export function SupplierVideoPage() {
  return (
    <div>
      <PageHeader
        title="Vidéo explicatif"
        description="Regardez ces courtes vidéos pour comprendre comment utiliser votre espace fournisseur SOS Santé sur ordinateur et sur mobile."
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {SUPPLIER_VIDEOS.map((video) => (
          <section key={video.id} className="space-y-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {video.title}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {video.description}
              </p>
            </div>
            <SupplierExplainerPlayer
              videoId={video.id}
              title={video.title}
              orientation={video.orientation}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
