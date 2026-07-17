"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

type SuggestableItemFieldProps = {
  id?: string;
  name?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  tone?: "dark" | "light";
  inputClassName?: string;
  disabled?: boolean;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function SuggestableItemField({
  id,
  name,
  required,
  value,
  onChange,
  options,
  placeholder = "Rechercher ou saisir…",
  tone = "light",
  inputClassName,
  disabled,
}: SuggestableItemFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const filtered = useMemo(() => {
    const query = normalize(value);
    if (!query) {
      return options.slice(0, 12);
    }
    return options
      .filter((option) => normalize(option).includes(query))
      .slice(0, 12);
  }, [options, value]);

  const exactMatch = useMemo(
    () => options.some((option) => normalize(option) === normalize(value)),
    [options, value]
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selectOption = (option: string) => {
    onChange(option);
    setOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      setHighlightIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightIndex(filtered.length > 0 ? 0 : -1);
        return;
      }
      if (filtered.length === 0) return;
      setHighlightIndex((current) =>
        current < filtered.length - 1 ? current + 1 : 0
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open || filtered.length === 0) return;
      setHighlightIndex((current) =>
        current > 0 ? current - 1 : filtered.length - 1
      );
      return;
    }

    if (event.key === "Enter" && open && highlightIndex >= 0) {
      event.preventDefault();
      selectOption(filtered[highlightIndex]!);
    }
  };

  const listTone =
    tone === "dark"
      ? "border-white/20 bg-white text-on-surface shadow-xl"
      : "border-outline-variant/40 bg-white text-on-surface shadow-lg";

  return (
    <div ref={rootRef} className="relative">
      <input
        id={inputId}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          highlightIndex >= 0 ? `${listboxId}-option-${highlightIndex}` : undefined
        }
        required={required}
        disabled={disabled}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setHighlightIndex(-1);
        }}
        onFocus={() => {
          setOpen(true);
          setHighlightIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className={cn(inputClassName)}
      />

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border py-1",
            listTone
          )}
        >
          {filtered.length > 0 ? (
            filtered.map((option, index) => (
              <button
                key={option}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={highlightIndex === index}
                className={cn(
                  "flex w-full px-3 py-2 text-left text-sm transition-colors",
                  highlightIndex === index
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-surface-container-low"
                )}
                onMouseEnter={() => setHighlightIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectOption(option);
                }}
              >
                {option}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-on-surface-variant">
              {value.trim()
                ? "Aucun résultat — continuez à saisir votre demande"
                : "Commencez à taper pour filtrer…"}
            </p>
          )}
          {value.trim() && !exactMatch ? (
            <p className="border-t border-outline-variant/30 px-3 py-2 text-xs text-on-surface-variant">
              Votre saisie libre sera envoyée telle quelle.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
