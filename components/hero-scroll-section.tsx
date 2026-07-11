"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type HeroGalleryImage = {
  src: string;
  alt: string;
  href?: string;
  objectPosition?: string;
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
          overlay ? "text-[10px] text-white/90" : "text-xs text-secondary"
        }`}
      >
        Défiler
      </span>
    </div>
  );
}

function GalleryDots({
  images,
  activeIndex,
  onSelect,
}: {
  images: HeroGalleryImage[];
  activeIndex: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div
      className="mt-3 flex items-center justify-center gap-2"
      aria-label={`Image ${activeIndex + 1} sur ${images.length}`}
    >
      {images.map((image, index) => {
        const isActive = index === activeIndex;
        const className = `h-2 rounded-full transition-all duration-300 ${
          isActive ? "w-6 bg-primary" : "w-2 bg-secondary/30"
        }`;

        if (onSelect) {
          return (
            <button
              key={image.src}
              type="button"
              aria-label={`Afficher l'image ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(index)}
              className={`${className} p-0`}
            />
          );
        }

        return <span key={image.src} className={className} />;
      })}
    </div>
  );
}

function GalleryFrame({
  images,
  activeIndex,
  galleryOverlay,
  className = "",
  onTouchStart,
  onTouchEnd,
}: {
  images: HeroGalleryImage[];
  activeIndex: number;
  galleryOverlay?: ReactNode;
  className?: string;
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void;
}) {
  const activeImage = images[activeIndex];
  const frame = (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-3xl shadow-2xl ${className} ${
        activeImage?.href ? "cursor-pointer" : ""
      }`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-500 ease-in-out"
          style={{
            opacity: index === activeIndex ? 1 : 0,
            zIndex: index === activeIndex ? 1 : 0,
            objectPosition: image.objectPosition ?? "center",
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
  );

  if (activeImage?.href) {
    return (
      <Link
        href={activeImage.href}
        aria-label={`Voir ${activeImage.alt}`}
        className="block"
      >
        {frame}
      </Link>
    );
  }

  return frame;
}

export default function HeroScrollSection({
  images,
  children,
  galleryOverlay,
}: HeroScrollSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const steps = Math.max(images.length, 1);
  const scrollHeightVh = 100 + (steps - 1) * 45;

  const goToMobileSlide = (index: number) => {
    setMobileIndex((index + images.length) % images.length);
  };

  const handleMobileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? 0;
  };

  const handleMobileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchEndX = event.changedTouches[0]?.clientX ?? 0;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) < 40) return;

    if (deltaX > 0) {
      setMobileIndex((current) => (current + 1) % images.length);
      return;
    }

    setMobileIndex((current) => (current - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(mq.matches);
    updateViewport();
    mq.addEventListener("change", updateViewport);
    return () => mq.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (isDesktop || images.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setMobileIndex((current) => (current + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [isDesktop, images.length]);

  useEffect(() => {
    if (!isDesktop) {
      setProgress(0);
      return;
    }

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
  }, [isDesktop]);

  const activeIndex = Math.min(
    images.length - 1,
    Math.floor(progress * images.length)
  );

  return (
    <div
      ref={trackRef}
      id="accueil"
      className="relative scroll-mt-[var(--site-header-offset,4rem)]"
      style={isDesktop ? { height: `${scrollHeightVh}vh` } : undefined}
    >
      {/* Mobile: swipeable carousel */}
      <div className="px-4 pb-6 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] sm:px-6 lg:hidden">
        <div id="accueil-hero-gallery">
          <GalleryFrame
            images={images}
            activeIndex={mobileIndex}
            galleryOverlay={galleryOverlay}
            className="aspect-[16/10] max-h-[220px] touch-pan-y sm:max-h-[260px]"
            onTouchStart={handleMobileTouchStart}
            onTouchEnd={handleMobileTouchEnd}
          />
          <GalleryDots
            images={images}
            activeIndex={mobileIndex}
            onSelect={goToMobileSlide}
          />
        </div>
        <div className="mt-6">{children}</div>
      </div>

      {/* Desktop: sticky scroll-driven gallery */}
      <div className="sticky top-[var(--site-header-offset,4rem)] hidden h-[calc(100vh-var(--site-header-offset,4rem))] flex-col overflow-hidden lg:flex">
        <div className="relative flex min-h-0 flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-[20%] -top-[20%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-secondary/5 blur-[100px]" />
            <div className="absolute left-1/3 top-1/3 h-[40%] w-[40%] rounded-full bg-primary-fixed/20 blur-[80px]" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="order-2 min-h-0 lg:order-1">{children}</div>

            <div className="order-1 flex flex-col lg:order-2">
              <GalleryFrame
                images={images}
                activeIndex={activeIndex}
                galleryOverlay={galleryOverlay}
                className="aspect-[4/3] max-h-[38vh] lg:aspect-square lg:max-h-none"
              />
              <GalleryDots images={images} activeIndex={activeIndex} />

              {activeIndex < images.length - 1 && (
                <div className="pointer-events-none absolute -bottom-16 left-[51%] z-30 hidden -translate-x-1/2 lg:block">
                  <ScrollHint overlay />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
