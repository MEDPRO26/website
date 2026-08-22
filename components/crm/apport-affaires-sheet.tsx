"use client";

import { useMutation, useQuery } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  computeApportRow,
  formatAmountInput,
  formatDh,
  formatPercentInput,
  parseAmountInput,
  parsePercentInput,
} from "@/lib/apport-affaires";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SheetRow = {
  key: string;
  id?: Id<"apportDeals">;
  authorName: string;
  date: string;
  client: string;
  phone: string;
  contractAmount: number | null;
  customRate: number | null;
  depositReceived: number;
  observation: string;
};

const EMPTY_ROW_COUNT = 8;

function newEmptyRow(): SheetRow {
  return {
    key: `draft-${crypto.randomUUID()}`,
    authorName: "",
    date: "",
    client: "",
    phone: "",
    contractAmount: null,
    customRate: null,
    depositReceived: 0,
    observation: "",
  };
}

function rowFromDoc(doc: {
  _id: Id<"apportDeals">;
  authorName?: string;
  date?: string;
  client: string;
  phone?: string;
  contractAmount?: number;
  customRate?: number;
  depositReceived: number;
  observation?: string;
}): SheetRow {
  return {
    key: doc._id,
    id: doc._id,
    authorName: doc.authorName ?? "",
    date: doc.date ?? "",
    client: doc.client,
    phone: doc.phone ?? "",
    contractAmount: doc.contractAmount ?? null,
    customRate: doc.customRate ?? null,
    depositReceived: doc.depositReceived,
    observation: doc.observation ?? "",
  };
}

function isBlank(row: SheetRow) {
  return (
    !row.date.trim() &&
    !row.client.trim() &&
    !row.phone.trim() &&
    (row.contractAmount == null || row.contractAmount === 0) &&
    row.customRate == null &&
    row.depositReceived === 0 &&
    !row.observation.trim()
  );
}

function SheetInput({
  className,
  onKeyDown,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full min-w-0 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 sm:px-3",
        "focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#32a0f3]/35",
        className
      )}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
        onKeyDown?.(event);
      }}
    />
  );
}

function RateField({
  value,
  onCommit,
}: {
  value: number | null;
  onCommit: (next: number | null) => void;
}) {
  const [text, setText] = useState(formatPercentInput(value));
  const focusedRef = useRef(false);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (!focusedRef.current) {
      setText(formatPercentInput(value));
    }
  }, [value]);

  const commit = () => {
    const parsed = parsePercentInput(textRef.current);
    setText(formatPercentInput(parsed));
    onCommit(parsed);
  };

  return (
    <div className="flex h-11 items-center justify-end gap-1 px-2">
      <input
        inputMode="decimal"
        placeholder="—"
        value={text}
        className="h-11 w-full min-w-0 bg-transparent text-right text-sm font-semibold tabular-nums outline-none placeholder:text-muted-foreground/70 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#32a0f3]/35"
        onFocus={() => {
          focusedRef.current = true;
          setText(value == null ? "" : formatPercentInput(value));
        }}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => {
          focusedRef.current = false;
          commit();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
        aria-label="Taux de commission en pourcentage"
      />
      <span className="pr-1 text-xs text-muted-foreground">%</span>
    </div>
  );
}

function CardField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#5c4d12]">
        {label}
      </span>
      {children}
    </div>
  );
}

function SheetRowCard({
  row,
  variant,
  onPatch,
  onDelete,
}: {
  row: SheetRow;
  variant: "admin" | "apporteur";
  onPatch: (
    patch: Partial<SheetRow>,
    options?: { immediate?: boolean }
  ) => void;
  onDelete?: () => void;
}) {
  const computed = computeApportRow({ ...row });
  const inputClass =
    "h-11 w-full rounded-xl border border-[#d7deea] bg-[#eef8f1] px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:bg-white focus:ring-2 focus:ring-[#32a0f3]/35";

  return (
    <article className="rounded-2xl border border-[#d7deea] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-4">
      {variant === "admin" && row.authorName ? (
        <p className="mb-2 text-xs font-semibold text-[#5c4d12]">
          Apporteur : <span className="font-bold text-foreground">{row.authorName}</span>
        </p>
      ) : null}
      <div className="flex items-start gap-2">
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
          <CardField label="Client">
            <input
              value={row.client}
              placeholder="Nom du client"
              className={cn(inputClass, "font-bold")}
              onChange={(event) => onPatch({ client: event.target.value })}
              onBlur={(event) =>
                onPatch(
                  { client: event.target.value.trim() },
                  { immediate: true }
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.blur();
                }
              }}
            />
          </CardField>
          <CardField label="Date">
            <input
              type="date"
              value={row.date}
              className={cn(inputClass, "min-w-0")}
              onChange={(event) => onPatch({ date: event.target.value })}
            />
          </CardField>
        </div>
        {onDelete ? (
          <button
            type="button"
            className="mt-5 grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
            aria-label="Supprimer la ligne"
          >
            <Trash2 className="size-4" />
          </button>
        ) : null}
      </div>

      <CardField label="Téléphone" className="mt-3">
        <input
          type="tel"
          value={row.phone}
          placeholder="Numéro de téléphone"
          className={inputClass}
          onChange={(event) => onPatch({ phone: event.target.value })}
          onBlur={(event) =>
            onPatch(
              { phone: event.target.value.trim() },
              { immediate: true }
            )
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
        />
      </CardField>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <CardField label="Montant contrat">
          <div className="overflow-hidden rounded-xl border border-[#d7deea] bg-[#eef8f1]">
            <AmountField
              value={row.contractAmount}
              onCommit={(next) => onPatch({ contractAmount: next })}
            />
          </div>
        </CardField>
        <CardField label="Taux commission">
          <div className="overflow-hidden rounded-xl border border-[#d7deea] bg-[#eef8f1]">
            <RateField
              value={row.customRate}
              onCommit={(next) =>
                onPatch({ customRate: next }, { immediate: true })
              }
            />
          </div>
        </CardField>
      </div>

      <CardField label="Commission due" className="mt-3">
        <div className="flex h-11 items-center justify-end rounded-xl border border-[#d7deea] bg-[#eef8f1] px-3 text-sm font-bold tabular-nums">
          {computed.commissionDue == null
            ? "—"
            : formatDh(computed.commissionDue)}
        </div>
      </CardField>

      {variant === "admin" ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <CardField label="Acompte reçu">
            <div className="overflow-hidden rounded-xl border border-[#d7deea] bg-[#eef8f1]">
              <AmountField
                value={row.depositReceived || null}
                onCommit={(next) =>
                  onPatch({ depositReceived: next ?? 0 })
                }
              />
            </div>
          </CardField>
          <CardField label="Reste à payer">
            <div
              className={cn(
                "flex h-11 items-center justify-end rounded-xl border border-[#d7deea] bg-[#eef8f1] px-3 text-sm font-semibold tabular-nums",
                computed.remaining == null
                  ? "text-muted-foreground"
                  : computed.remaining > 0
                    ? "text-[#c2410c]"
                    : "text-[#15803d]"
              )}
            >
              {computed.remaining == null
                ? "—"
                : formatDh(computed.remaining)}
            </div>
          </CardField>
        </div>
      ) : null}

      <CardField label="Observation" className="mt-3">
        <textarea
          value={row.observation}
          placeholder="Note"
          rows={3}
          title={row.observation}
          className="min-h-[5.5rem] w-full resize-y rounded-xl border border-[#d7deea] bg-[#eef8f1] px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:bg-white focus:ring-2 focus:ring-[#32a0f3]/35"
          onChange={(event) => onPatch({ observation: event.target.value })}
        />
      </CardField>
    </article>
  );
}

function AmountField({
  value,
  onCommit,
  placeholder = "0",
  className,
}: {
  value: number | null;
  onCommit: (next: number | null) => void;
  placeholder?: string;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(formatAmountInput(value));
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (!focused) {
      setText(formatAmountInput(value));
    }
  }, [focused, value]);

  const commit = () => {
    const parsed = parseAmountInput(textRef.current);
    setText(formatAmountInput(parsed));
    onCommit(parsed);
  };

  return (
    <SheetInput
      inputMode="decimal"
      placeholder={placeholder}
      value={focused ? text : formatAmountInput(value)}
      className={cn("text-right tabular-nums", className)}
      onFocus={() => {
        setFocused(true);
        setText(value == null || value === 0 ? "" : String(value));
      }}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => {
        setFocused(false);
        commit();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    />
  );
}

export function ApportAffairesSheet({
  variant = "admin",
}: {
  variant?: "admin" | "apporteur";
}) {
  const saved = useQuery(api.apportAffaires.list);
  const upsert = useMutation(api.apportAffaires.upsert);
  const remove = useMutation(api.apportAffaires.remove);
  const [rows, setRows] = useState<SheetRow[]>([]);
  const syncedRef = useRef(false);
  const rowsRef = useRef<SheetRow[]>([]);
  const saveTimers = useRef(new Map<string, number>());
  const saveSeq = useRef(new Map<string, number>());
  const dirtyKeys = useRef(new Set<string>());
  /** Keys where the user edited the commission % (incl. clearing it). */
  const rateTouchedKeys = useRef(new Set<string>());

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  useEffect(() => {
    if (saved === undefined) return;
    setRows((current) => {
      const localById = new Map(
        current.filter((row) => row.id).map((row) => [row.id!, row])
      );
      const fromServer = saved.map((doc) => {
        const local = localById.get(doc._id);
        // Keep in-progress edits so a slow save cannot wipe the % the user just typed.
        if (
          local &&
          (dirtyKeys.current.has(local.key) || dirtyKeys.current.has(doc._id))
        ) {
          return {
            ...local,
            id: doc._id,
            authorName: doc.authorName ?? local.authorName,
            // If a slow amount-save wiped the server %, keep the local % while dirty.
            // When local % is empty but server has one, prefer server.
            customRate: local.customRate ?? doc.customRate ?? null,
          };
        }
        const mapped = rowFromDoc(doc);
        // Keep a stable React/persist key if we already had this row locally.
        if (local) {
          return { ...mapped, key: local.key };
        }
        return mapped;
      });
      const serverIds = new Set(saved.map((doc) => doc._id));
      const drafts = syncedRef.current
        ? current.filter((row) => !row.id || !serverIds.has(row.id))
        : [];
      // Drop drafts that already got an id and are on the server.
      const pendingDrafts = drafts.filter((row) => !row.id);
      const nextDrafts =
        pendingDrafts.length >= EMPTY_ROW_COUNT
          ? pendingDrafts
          : [
              ...pendingDrafts,
              ...Array.from(
                { length: EMPTY_ROW_COUNT - pendingDrafts.length },
                newEmptyRow
              ),
            ];
      syncedRef.current = true;
      const next = [...fromServer, ...nextDrafts];
      rowsRef.current = next;
      return next;
    });
  }, [saved]);

  const persist = (
    key: string,
    immediate = false,
    rateTouched = false
  ) => {
    const previous = saveTimers.current.get(key);
    if (previous) window.clearTimeout(previous);
    const seq = (saveSeq.current.get(key) ?? 0) + 1;
    saveSeq.current.set(key, seq);
    dirtyKeys.current.add(key);
    if (rateTouched) {
      rateTouchedKeys.current.add(key);
    }

    const run = () => {
      void (async () => {
        const row = rowsRef.current.find((item) => item.key === key);
        if (!row) {
          dirtyKeys.current.delete(key);
          rateTouchedKeys.current.delete(key);
          return;
        }
        try {
          // Never send customRate: null on unrelated edits — that wiped the %
          // via db.replace. Only send the rate when the user edited it, or when
          // reinforcing a non-null value already in local state.
          const includeRate =
            rateTouchedKeys.current.has(key) || row.customRate != null;
          const result = await upsert({
            id: row.id,
            date: row.date || undefined,
            client: row.client,
            phone: row.phone || undefined,
            contractAmount: row.contractAmount ?? undefined,
            ...(includeRate ? { customRate: row.customRate } : {}),
            observation: row.observation || undefined,
            ...(variant === "admin"
              ? { depositReceived: row.depositReceived }
              : {}),
          });

          // A newer edit started while this save was in flight — save again.
          if (saveSeq.current.get(key) !== seq) {
            persist(key, true, rateTouchedKeys.current.has(key));
            return;
          }

          // Keep local key stable — only attach the server id.
          if (result.id && result.id !== row.id) {
            setRows((current) => {
              const next = current.map((item) =>
                item.key === key ? { ...item, id: result.id! } : item
              );
              rowsRef.current = next;
              return next;
            });
          }

          if (result.deleted) {
            dirtyKeys.current.delete(key);
            rateTouchedKeys.current.delete(key);
            setRows((current) => {
              const next = [
                ...current.filter((item) => item.key !== key),
                newEmptyRow(),
              ];
              rowsRef.current = next;
              return next;
            });
            return;
          }

          dirtyKeys.current.delete(key);
          rateTouchedKeys.current.delete(key);
        } catch {
          if (saveSeq.current.get(key) === seq) {
            dirtyKeys.current.delete(key);
            rateTouchedKeys.current.delete(key);
          }
        }
      })();
    };

    if (immediate) {
      run();
      return;
    }

    const timer = window.setTimeout(run, 200);
    saveTimers.current.set(key, timer);
  };

  const updateRow = (
    key: string,
    patch: Partial<SheetRow>,
    options?: { immediate?: boolean }
  ) => {
    setRows((current) => {
      const next = current.map((row) =>
        row.key === key ? { ...row, ...patch } : row
      );
      rowsRef.current = next;
      return next;
    });
    persist(
      key,
      options?.immediate,
      Object.prototype.hasOwnProperty.call(patch, "customRate")
    );
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const computed = computeApportRow({ ...row });
        if (row.contractAmount) acc.contracts += row.contractAmount;
        if (computed.commissionDue != null) acc.due += computed.commissionDue;
        acc.deposits += row.depositReceived;
        if (computed.remaining != null) acc.remaining += computed.remaining;
        return acc;
      },
      { contracts: 0, due: 0, deposits: 0, remaining: 0 }
    );
  }, [rows]);

  const cardRows = useMemo(() => {
    const filled = rows.filter((row) => !isBlank(row));
    const firstBlank = rows.find((row) => isBlank(row));
    return firstBlank ? [...filled, firstBlank] : filled;
  }, [rows]);

  if (saved === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement du tableau…</p>
    );
  }

  return (
    <div className="min-w-0 space-y-4">
      <div className="space-y-3 md:hidden">
        {cardRows.map((row) => (
          <SheetRowCard
            key={row.key}
            row={row}
            variant={variant}
            onPatch={(patch, options) => updateRow(row.key, patch, options)}
            onDelete={
              row.id && !isBlank(row)
                ? () => {
                    void remove({ id: row.id! }).then(() => {
                      setRows((current) => [
                        ...current.filter((item) => item.key !== row.key),
                        newEmptyRow(),
                      ]);
                    });
                  }
                : undefined
            }
          />
        ))}
        <div className="rounded-2xl border border-[#d7deea] bg-[#f8fafc] px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold">Totaux</span>
            <span className="tabular-nums">{formatDh(totals.contracts)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 text-muted-foreground">
            <span>Commission due</span>
            <span className="font-semibold text-foreground tabular-nums">
              {formatDh(totals.due)}
            </span>
          </div>
          {variant === "admin" ? (
            <>
              <div className="mt-1 flex items-center justify-between gap-3 text-muted-foreground">
                <span>Acomptes reçus</span>
                <span className="tabular-nums">{formatDh(totals.deposits)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3 text-muted-foreground">
                <span>Reste à payer</span>
                <span className="font-semibold tabular-nums text-[#c2410c]">
                  {formatDh(totals.remaining)}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="hidden min-w-0 md:block">
      <div className="overflow-hidden rounded-[1.5rem] border border-[#d7deea] bg-white shadow-[0_8px_40px_rgba(15,23,42,0.08)]">
        <div className="w-full min-w-0">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-[#f6e27a] text-[11px] font-bold uppercase tracking-wide text-[#5c4d12]">
                {variant === "admin" ? (
                  <th className="w-[9%] border-b border-[#ead56a] px-1.5 py-3 text-left font-bold sm:px-2">
                    Apporteur
                  </th>
                ) : null}
                <th
                  className={cn(
                    "border-b border-[#ead56a] px-2 py-3 text-left font-bold sm:px-3",
                    variant === "admin" ? "w-[9%]" : "w-[10%]"
                  )}
                >
                  Date
                </th>
                <th className="w-[10%] border-b border-[#ead56a] px-2 py-3 text-left font-bold sm:px-3">
                  Client
                </th>
                <th className="w-[9%] border-b border-[#ead56a] px-1.5 py-3 text-left font-bold sm:px-2">
                  Téléphone
                </th>
                <th className="w-[8%] border-b border-[#ead56a] px-1.5 py-3 text-right font-bold sm:px-2">
                  Montant contrat
                </th>                <th className="w-[6%] border-b border-[#ead56a] px-1.5 py-3 text-right font-bold sm:px-2">
                  Taux commission
                </th>
                <th className="w-[8%] border-b border-[#ead56a] px-1.5 py-3 text-right font-bold sm:px-2">
                  Commission due
                </th>
                {variant === "admin" ? (
                  <>
                    <th className="w-[7%] border-b border-[#ead56a] px-1.5 py-3 text-right font-bold sm:px-2">
                      Acompte reçu
                    </th>
                    <th className="w-[7%] border-b border-[#ead56a] px-1.5 py-3 text-right font-bold sm:px-2">
                      Reste à payer
                    </th>
                  </>
                ) : null}
                <th className="w-[24%] min-w-[10rem] border-b border-[#ead56a] px-2 py-3 text-left font-bold sm:px-3">
                  Observation
                </th>                <th className="w-10 border-b border-[#ead56a]" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const computed = computeApportRow({ ...row });
                const stripe = index % 2 === 1;
                const cellMint = cn(
                  "border-b border-[#e6edf3] bg-[#eef8f1]",
                  stripe && "bg-[#e6f3ea]"
                );
                return (
                  <tr key={row.key} className="group">
                    {variant === "admin" ? (
                      <td
                        className={cn(
                          cellMint,
                          "px-1.5 py-2 text-sm font-bold sm:px-2"
                        )}
                      >
                        {row.id ? row.authorName || "—" : ""}
                      </td>
                    ) : null}
                    <td className={cellMint}>
                      <SheetInput
                        type="date"
                        value={row.date}
                        className="px-2 sm:px-3"
                        onChange={(event) =>
                          updateRow(row.key, { date: event.target.value })
                        }
                      />
                    </td>
                    <td className={cellMint}>
                      <SheetInput
                        value={row.client}
                        placeholder="Nom du client"
                        className="px-2 font-bold sm:px-3"
                        onChange={(event) =>
                          updateRow(row.key, { client: event.target.value })
                        }
                        onBlur={(event) =>
                          updateRow(
                            row.key,
                            { client: event.target.value.trim() },
                            { immediate: true }
                          )
                        }
                      />
                    </td>
                    <td className={cellMint}>
                      <SheetInput
                        type="tel"
                        value={row.phone}
                        placeholder="Téléphone"
                        className="px-1.5 sm:px-2"
                        onChange={(event) =>
                          updateRow(row.key, { phone: event.target.value })
                        }
                        onBlur={(event) =>
                          updateRow(
                            row.key,
                            { phone: event.target.value.trim() },
                            { immediate: true }
                          )
                        }
                      />
                    </td>
                    <td className={cellMint}>
                      <AmountField
                        value={row.contractAmount}
                        onCommit={(next) =>
                          updateRow(row.key, { contractAmount: next })
                        }
                      />
                    </td>                    <td className={cellMint}>
                      <RateField
                        value={row.customRate}
                        onCommit={(next) =>
                          updateRow(
                            row.key,
                            { customRate: next },
                            { immediate: true }
                          )
                        }
                      />
                    </td>
                    <td className="border-b border-[#e6edf3] bg-white px-1.5 text-right font-semibold tabular-nums sm:px-2">
                      {computed.commissionDue == null
                        ? ""
                        : formatDh(computed.commissionDue)}
                    </td>
                    {variant === "admin" ? (
                      <Fragment>
                    <td className={cellMint}>
                      <AmountField
                        value={row.depositReceived || null}
                        onCommit={(next) =>
                          updateRow(row.key, { depositReceived: next ?? 0 })
                        }
                      />
                    </td>
                    <td
                      className={cn(
                        cellMint,
                        "px-1.5 text-right font-semibold tabular-nums sm:px-2",
                        computed.remaining == null
                          ? "text-muted-foreground"
                          : computed.remaining > 0
                            ? "text-[#c2410c]"
                            : "text-[#15803d]"
                      )}
                    >
                      {computed.remaining == null
                        ? ""
                        : formatDh(computed.remaining)}
                    </td>
                      </Fragment>
                    ) : null}
                    <td className={cn(cellMint, "min-w-0")}>
                      <SheetInput
                        value={row.observation}
                        placeholder="Note"
                        title={row.observation}
                        className="px-2 sm:px-3"
                        onChange={(event) =>
                          updateRow(row.key, { observation: event.target.value })
                        }
                      />
                    </td>
                    <td className={cn(cellMint, "text-center")}>
                      {row.id && !isBlank(row) ? (
                        <button
                          type="button"
                          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100"
                          onClick={() => {
                            void remove({ id: row.id! }).then(() => {
                              setRows((current) => [
                                ...current.filter((item) => item.key !== row.key),
                                newEmptyRow(),
                              ]);
                            });
                          }}
                          aria-label="Supprimer la ligne"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#f8fafc] text-sm font-semibold">
                <td className="px-3 py-3.5" colSpan={variant === "admin" ? 3 : 2}>
                  Totaux
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums">
                  {formatDh(totals.contracts)}
                </td>
                {variant === "admin" ? (
                  <Fragment>
                    <td />
                    <td className="px-3 py-3.5 text-right tabular-nums">
                      {formatDh(totals.due)}
                    </td>
                    <td className="px-3 py-3.5 text-right tabular-nums">
                      {formatDh(totals.deposits)}
                    </td>
                    <td className="px-3 py-3.5 text-right tabular-nums text-[#c2410c]">
                      {formatDh(totals.remaining)}
                    </td>
                    <td colSpan={2} />
                  </Fragment>
                ) : (
                  <>
                    <td />
                    <td className="px-3 py-3.5 text-right tabular-nums">
                      {formatDh(totals.due)}
                    </td>
                    <td colSpan={2} />
                  </>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => setRows((current) => [...current, newEmptyRow()])}
        >
          <Plus className="size-4" />
          Ajouter une ligne
        </Button>
      </div>
    </div>
  );
}
