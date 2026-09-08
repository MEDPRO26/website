"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  searchSiteProducts,
  type SiteSearchResult,
} from "@/lib/site-search";

function MaterialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type NavSearchProps = {
  variant?: "desktop" | "mobile";
  compact?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export default function NavSearch({
  variant = "desktop",
  compact = false,
  onNavigate,
  className = "",
}: NavSearchProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = searchSiteProducts(query, 8);
  const showPanel = open && query.trim().length >= 2;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!showPanel) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [showPanel]);

  const closeAndReset = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
    onNavigate?.();
  };

  const goToResult = (result: SiteSearchResult) => {
    closeAndReset();
    router.push(result.href);
  };

  return (
    <div
      ref={rootRef}
      className={classNames(
        "relative",
        variant === "desktop" ? "hidden md:block" : "block",
        className
      )}
    >
      <label className="sr-only" htmlFor={`${listId}-input`}>
        Rechercher un produit
      </label>
      <div
        className={classNames(
          "flex items-center gap-2 rounded-full border border-outline-variant/50 bg-white/90 text-on-surface shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15",
          compact ? "h-9 px-3" : "h-10 px-3.5",
          variant === "mobile" && "h-11 w-full rounded-xl px-3.5"
        )}
      >
        <MaterialIcon
          name="search"
          className="shrink-0 text-lg text-on-surface-variant"
        />
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          placeholder="Rechercher un produit…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
              return;
            }

            if (!showPanel || results.length === 0) return;

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) =>
                index < results.length - 1 ? index + 1 : 0
              );
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) =>
                index > 0 ? index - 1 : results.length - 1
              );
            } else if (event.key === "Enter" && activeIndex >= 0) {
              event.preventDefault();
              goToResult(results[activeIndex]);
            } else if (event.key === "Enter" && results[0]) {
              event.preventDefault();
              goToResult(results[0]);
            }
          }}
          className={classNames(
            "min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70",
            variant === "desktop" && (compact ? "w-36 xl:w-48" : "w-44 xl:w-56")
          )}
        />
        {query ? (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
            }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary"
          >
            <MaterialIcon name="close" className="text-base" />
          </button>
        ) : null}
      </div>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className={classNames(
            "absolute z-[60] overflow-hidden rounded-2xl border border-outline-variant/50 bg-white shadow-xl",
            variant === "mobile"
              ? "left-0 right-0 top-[calc(100%+8px)]"
              : "right-0 top-[calc(100%+10px)] w-[min(22rem,calc(100vw-2rem))]"
          )}
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-on-surface-variant">
              Aucun produit pour « {query.trim()} »
            </p>
          ) : (
            <ul className="max-h-[min(70vh,22rem)] overflow-y-auto py-1.5">
              {results.map((result, index) => (
                <li key={result.id} role="presentation">
                  <Link
                    id={`${listId}-option-${index}`}
                    role="option"
                    aria-selected={activeIndex === index}
                    href={result.href}
                    onClick={closeAndReset}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={classNames(
                      "mx-1.5 flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors",
                      activeIndex === index
                        ? "bg-primary/10"
                        : "hover:bg-surface-container-low"
                    )}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                      <Image
                        src={result.image}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-on-surface">
                        {result.title}
                      </span>
                      <span className="block truncate text-xs text-on-surface-variant">
                        {result.subtitle}
                      </span>
                    </span>
                    <MaterialIcon
                      name="chevron_right"
                      className="shrink-0 text-base text-on-surface-variant/70"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
