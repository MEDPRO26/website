"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
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
};

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
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const isPortrait = orientation === "portrait";

  useEffect(() => {
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
          playsinline: 1,
          fs: 0,
          disablekb: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            setReady(true);
            setDuration(event.target.getDuration() || 0);
            raf = window.requestAnimationFrame(tick);
          },
          onStateChange: (event) => {
            if (!window.YT) return;
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
  }, [videoId]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || !ready) return;
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [playing, ready]);

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
        {/*
          Landscape: slight vertical crop hides YouTube chrome.
          Portrait: no top/bottom crop — scale 16:9 YouTube frame to fill 9:16
          so the phone screen is fully visible (side bars cropped instead).
        */}
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
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <span className="grid size-14 place-items-center rounded-full bg-white/95 text-[#32a0f3] shadow-lg">
              <Play className="size-6 fill-current pl-0.5" aria-hidden />
            </span>
          </div>
        ) : null}
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
          tabIndex={0}
          className="relative h-8 flex-1 cursor-pointer touch-none"
          onPointerDown={(event) => {
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
