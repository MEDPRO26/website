"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FrenchTimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function FrenchTimePicker({
  value,
  onChange,
  min,
  disabled,
  id,
  className,
}: FrenchTimePickerProps) {
  return (
    <Input
      id={id}
      type="time"
      lang="fr-FR"
      step={900}
      value={value}
      min={min}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={cn("bg-background", className)}
    />
  );
}
