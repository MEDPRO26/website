"use client";

import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function isoToDate(iso: string): Date | undefined {
  if (!iso) {
    return undefined;
  }
  const parsed = parse(iso, "yyyy-MM-dd", new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function dateToIso(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  return format(date, "yyyy-MM-dd");
}

type FrenchDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
};

export function FrenchDatePicker({
  value,
  onChange,
  placeholder = "Choisir une date",
  min,
  max,
  disabled,
  id,
}: FrenchDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = isoToDate(value);
  const minDate = min ? isoToDate(min) : undefined;
  const maxDate = max ? isoToDate(max) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start rounded-md border border-input bg-background px-3 text-left font-normal shadow-sm hover:bg-background",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0 opacity-60" />
          {selected
            ? format(selected, "dd/MM/yyyy", { locale: fr })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          locale={fr}
          weekStartsOn={1}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          onSelect={(date) => {
            onChange(dateToIso(date));
            setOpen(false);
          }}
        />
        <div className="flex items-center justify-between border-t border-border px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            Effacer
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => {
              onChange(dateToIso(new Date()));
              setOpen(false);
            }}
          >
            Aujourd&apos;hui
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
