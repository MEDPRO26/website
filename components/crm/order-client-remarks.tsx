import { parseClientRemarks } from "@/lib/crm/parse-client-remarks";
import { cn } from "@/lib/utils";

type OrderClientRemarksProps = {
  message?: string | null;
  emptyLabel?: string;
  className?: string;
  noteClassName?: string;
};

export function OrderClientRemarks({
  message,
  emptyLabel = "Aucune remarque.",
  className,
  noteClassName,
}: OrderClientRemarksProps) {
  const trimmed = message?.trim();
  if (!trimmed) {
    return (
      <p
        className={cn(
          "rounded-xl border border-border/60 bg-muted/30 p-3.5 text-sm italic text-muted-foreground",
          className
        )}
      >
        {emptyLabel}
      </p>
    );
  }

  const { fields, notes } = parseClientRemarks(trimmed);

  if (fields.length === 0) {
    return (
      <p
        className={cn(
          "rounded-xl border border-border/60 bg-muted/30 p-3.5 text-sm italic leading-relaxed text-foreground/90 whitespace-pre-line",
          className
        )}
      >
        {trimmed}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-muted/30",
        className
      )}
    >
      <dl className="divide-y divide-border/50">
        {fields.map((field) => (
          <div
            key={field.label}
            className="grid gap-1 px-3.5 py-2.5 sm:grid-cols-[7.5rem_1fr] sm:items-baseline sm:gap-4"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {field.label}
            </dt>
            <dd className="text-sm font-medium text-foreground">{field.value}</dd>
          </div>
        ))}
        {notes.map((note, index) => (
          <div
            key={`${note}-${index}`}
            className={cn(
              "grid gap-1 px-3.5 py-2.5 sm:grid-cols-[7.5rem_1fr] sm:items-baseline sm:gap-4",
              noteClassName
            )}
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Message client
            </dt>
            <dd className="text-sm italic leading-relaxed text-foreground/90 whitespace-pre-line">
              {note}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
