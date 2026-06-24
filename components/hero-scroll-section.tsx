"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type HeroGalleryImage = {
  src: string;
  alt: string;
};

type HeroScrollSectionProps = {
  images: HeroGalleryImage[];
  children: ReactNode;
  galleryOverlay?: ReactNode;
};

function MaterialIcon({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function ScrollHint({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className={`pointer-events-none flex flex-col items-center gap-1 ${
        overlay
          ? "rounded-full bg-black/30 px-3.5 py-2.5 shadow-lg backdrop-blur-md"
          : "gap-2"
      }`}
      aria-hidden="true"
    >
      <div className={`relative overflow-hidden ${overlay ? "h-9 w-5" : "h-12 w-6"}`}>
        {[0, 1, 2].map((i) => (
          <MaterialIcon
            key={i}
            name="keyboard_arrow_up"
            className={`scroll-hint-arrow absolute bottom-0 left-1/2 ${
              overlay
                ? "text-[22px] text-white drop-shadow"
                : "text-3xl text-primary drop-shadow-sm"
            }`}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
      <span
        className={`whitespace-nowrap font-semibold uppercase tracking-widest ${
          overlay
            ? "text-[10px] text-white/90"
            : "text-xs text-secondary"
        }`}
      >
        Défiler
      </span>
    </div>
  );
}

export default function HeroScrollSection({
  images,
  children,
  galleryOverlay,
}: HeroScrollSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const steps = Math.max(images.length, 1);
  const scrollHeightVh = 100 + (steps - 1) * 45;

  useEffect(() => {
    const updateProgress = () => {
      const track = trackRef.current;
      if (!track) return;

      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      const rect = track.getBoundingClientRect();
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      setProgress(scrolled / scrollable);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const activeIndex = Math.min(
    images.length - 1,
    Math.floor(progress * images.length)
  );

  return (
    <div
      ref={trackRef}
      id="accueil"
      className="relative"
      style={{ height: `${scrollHeightVh}vh` }}
    >
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col overflow-hidden md:top-20 md:h-[calc(100vh-5rem)]">
        <div className="relative flex min-h-0 flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-[20%] -top-[20%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-secondary/5 blur-[100px]" />
            <div className="absolute left-1/3 top-1/3 h-[40%] w-[40%] rounded-full bg-primary-fixed/20 blur-[80px]" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="order-2 min-h-0 lg:order-1">{children}</div>

            <div className="order-1 flex flex-col lg:order-2">
              <div className="relative mx-auto aspect-[4/3] w-full max-h-[34vh] overflow-hidden rounded-3xl shadow-2xl sm:max-h-[38vh] lg:aspect-square lg:max-h-none">
                {images.map((image, index) => (
                  <Image
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    style={{
                      opacity: index === activeIndex ? 1 : 0,
                      zIndex: index === activeIndex ? 1 : 0,
                    }}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {galleryOverlay && (
                  <div className="pointer-events-none absolute inset-0 z-20">
                    {galleryOverlay}
                  </div>
                )}
              </div>

              <div
                className="mt-3 flex items-center justify-center gap-2"
                aria-label={`Image ${activeIndex + 1} sur ${images.length}`}
              >
                {images.map((image, index) => (
                  <span
                    key={image.src}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-secondary/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {activeIndex < images.length - 1 && (
              <>
                <div className="pointer-events-none absolute -bottom-16 left-[51%] z-30 hidden -translate-x-1/2 lg:block">
                  <ScrollHint overlay />
                </div>
                <div className="order-3 flex justify-center py-1 lg:hidden">
                  <ScrollHint overlay={false} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
