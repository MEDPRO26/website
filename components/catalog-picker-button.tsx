"use client";

import { useState, type ReactNode } from "react";
import CityCatalogPickerDialog from "@/components/city-catalog-picker-dialog";

type CatalogPickerButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function CatalogPickerButton({
  children,
  className,
}: CatalogPickerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <CityCatalogPickerDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
