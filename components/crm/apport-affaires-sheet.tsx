"use client";

import { useMutation, useQuery } from "convex/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState, type InputHTMLAttributes } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  DEFAULT_APPORT_RATE_SETTINGS,
  apportRateTiers,
  computeApportRow,
  formatAmountInput,
  formatDh,
  formatPercentInput,
  formatRate,
  normalizeApportRateSettings,
  parseAmountInput,
  parsePercentInput,
  type ApportRateSettings,
} from "@/lib/apport-affaires";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SheetRow = {
  key: string;
  id?: Id<"apportDeals">;
  date: string;
  client: string;
  contractAmount: number | null;
  customRate: number | null;
  depositReceived: number;
  observation: string;
};

const EMPTY_ROW_COUNT = 8;

function newEmptyRow(): SheetRow {
  return {
    key: `draft-${crypto.randomUUID()}`,
    date: "",
    client: "",
    contractAmount: null,
    customRate: null,
    depositReceived: 0,
    observation: "",
  };
}

function rowFromDoc(doc: {
  _id: Id<"apportDeals">;
  date?: string;
  client: string;
  contractAmount?: number;
  customRate?: number;
  depositReceived: number;
  observation?: string;
}): SheetRow {
  return {
    key: doc._id,
    id: doc._id,
    date: doc.date ?? "",
    client: doc.client,
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
    (row.contractAmount == null || row.contractAmount === 0) &&
    row.customRate == null &&
    row.depositReceived === 0 &&
    !row.observation.trim()
  );
}

function SheetInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full min-w-0 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70",
        "focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#32a0f3]/35",
        className
      )}
    />
  );
}

function RateField({
  effectiveRate,
  defaultRate,
  customRate,
  onCommit,
}: {
  effectiveRate: number | null;
  defaultRate: number | null;
  customRate: number | null;
  onCommit: (next: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const skipCommit = useRef(false);
  const isCustom = customRate != null;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = (raw: string) => {
    const parsed = parsePercentInput(raw);
    if (parsed == null) {
      onCommit(null);
      return;
    }
    if (
      defaultRate != null &&
      Math.abs(parsed - defaultRate) < 0.00001
    ) {
      onCommit(null);
      return;
    }
    onCommit(parsed);
  };

  if (!editing) {
    return (
      <div className="flex h-11 items-center justify-end gap-1 px-2">
        <span
          className={cn(
            "tabular-nums",
            isCustom ? "font-semibold text-foreground" : "text-muted-foreground"
          )}
        >
          {effectiveRate == null ? "" : formatRate(effectiveRate)}
        </span>
        <button
          type="button"
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-md transition hover:bg-white hover:text-foreground",
            isCustom
              ? "text-[#1d4ed8]"
              : "text-muted-foreground/70 group-hover:text-muted-foreground"
          )}
          onClick={() => {
            setText(
              effectiveRate == null ? "" : formatPercentInput(effectiveRate)
            );
            setEditing(true);
          }}
          aria-label="Modifier le taux"
          title={
            isCustom
              ? "Taux modifié — vider le champ pour revenir au taux automatique"
              : "Modifier le taux de cette ligne"
          }
        >
          <Pencil className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-11 items-center justify-end gap-1 px-1">
      <input
        ref={inputRef}
        inputMode="decimal"
        className="h-8 w-16 rounded-md border border-[#32a0f3]/50 bg-white px-2 text-right text-sm tabular-nums outline-none focus:ring-2 focus:ring-[#32a0f3]/35"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => {
          if (skipCommit.current) {
            skipCommit.current = false;
            setEditing(false);
            return;
          }
          commit(text);
          setEditing(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            skipCommit.current = true;
            setEditing(false);
          }
        }}
        aria-label="Taux de commission en pourcentage"
      />
      <span className="pr-1 text-xs text-muted-foreground">%</span>
    </div>
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

  useEffect(() => {
    if (!focused) {
      setText(formatAmountInput(value));
    }
  }, [focused, value]);

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
        onCommit(parseAmountInput(text));
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
  const settingsQuery = useQuery(api.apportAffaires.getSettings);
  const upsert = useMutation(api.apportAffaires.upsert);
  const remove = useMutation(api.apportAffaires.remove);
  const settings = settingsQuery ?? DEFAULT_APPORT_RATE_SETTINGS;
  const [rows, setRows] = useState<SheetRow[]>([]);
  const syncedRef = useRef(false);
  const saveTimers = useRef(new Map<string, number>());

  useEffect(() => {
    if (saved === undefined) return;
    setRows((current) => {
      const drafts = syncedRef.current
        ? current.filter((row) => !row.id)
        : [];
      const nextDrafts =
        drafts.length >= EMPTY_ROW_COUNT
          ? drafts
          : [
              ...drafts,
              ...Array.from({ length: EMPTY_ROW_COUNT - drafts.length }, newEmptyRow),
            ];
      syncedRef.current = true;
      return [...saved.map(rowFromDoc), ...nextDrafts];
    });
  }, [saved]);

  const persist = (row: SheetRow) => {
    const previous = saveTimers.current.get(row.key);
    if (previous) window.clearTimeout(previous);
    const timer = window.setTimeout(() => {
      void (async () => {
        const result = await upsert({
          id: row.id,
          date: row.date || undefined,
          client: row.client,
          contractAmount: row.contractAmount ?? undefined,
          observation: row.observation || undefined,
          ...(variant === "admin"
            ? {
                customRate: row.customRate,
                depositReceived: row.depositReceived,
              }
            : {}),
        });
        if (result.id && result.id !== row.id) {
          setRows((current) =>
            current.map((item) =>
              item.key === row.key ? { ...item, key: result.id!, id: result.id! } : item
            )
          );
        }
        if (result.deleted) {
          setRows((current) => {
            const without = current.filter((item) => item.key !== row.key);
            return [...without, newEmptyRow()];
          });
        }
      })();
    }, 350);
    saveTimers.current.set(row.key, timer);
  };

  const updateRow = (key: string, patch: Partial<SheetRow>) => {
    setRows((current) => {
      const next = current.map((row) =>
        row.key === key ? { ...row, ...patch } : row
      );
      const updated = next.find((row) => row.key === key);
      if (updated) persist(updated);
      return next;
    });
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const computed = computeApportRow({ ...row, settings });
        if (row.contractAmount) acc.contracts += row.contractAmount;
        if (computed.commissionDue != null) acc.due += computed.commissionDue;
        acc.deposits += row.depositReceived;
        if (computed.remaining != null) acc.remaining += computed.remaining;
        return acc;
      },
      { contracts: 0, due: 0, deposits: 0, remaining: 0 }
    );
  }, [rows, settings]);

  if (saved === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement du tableau…</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.5rem] border border-[#d7deea] bg-white shadow-[0_8px_40px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className={cn(
            "w-full border-collapse text-sm",
            variant === "apporteur" ? "min-w-[1120px]" : "min-w-[1240px]"
          )}>
            <thead>
              <tr className="bg-[#f6e27a] text-[11px] font-bold uppercase tracking-wide text-[#5c4d12]">
                <th className="border-b border-[#ead56a] px-3 py-3 text-left font-bold">
                  Date
                </th>
                <th className="border-b border-[#ead56a] px-3 py-3 text-left font-bold">
                  Client
                </th>
                <th className="border-b border-[#ead56a] px-3 py-3 text-right font-bold">
                  Montant contrat
                </th>
                <th className="border-b border-[#ead56a] px-3 py-3 text-right font-bold">
                  Taux commission
                </th>
                <th className="border-b border-[#ead56a] px-3 py-3 text-right font-bold">
                  Commission due
                </th>
                {variant === "admin" ? (
                  <>
                    <th className="border-b border-[#ead56a] px-3 py-3 text-right font-bold">
                      Acompte reçu
                    </th>
                    <th className="border-b border-[#ead56a] px-3 py-3 text-right font-bold">
                      Reste à payer
                    </th>
                  </>
                ) : null}
                <th className="min-w-[280px] border-b border-[#ead56a] px-3 py-3 text-left font-bold">
                  Observation
                </th>
                <th className="w-12 border-b border-[#ead56a]" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const computed = computeApportRow({ ...row, settings });
                const stripe = index % 2 === 1;
                return (
                  <tr key={row.key} className="group">
                    <td className={cn("border-b border-[#e6edf3] bg-[#eef8f1]", stripe && "bg-[#e6f3ea]")}>
                      <SheetInput
                        type="date"
                        value={row.date}
                        onChange={(event) =>
                          updateRow(row.key, { date: event.target.value })
                        }
                      />
                    </td>
                    <td className={cn("border-b border-[#e6edf3] bg-[#eef8f1]", stripe && "bg-[#e6f3ea]")}>
                      <SheetInput
                        value={row.client}
                        placeholder="Nom du client"
                        onChange={(event) =>
                          updateRow(row.key, { client: event.target.value })
                        }
                      />
                    </td>
                    <td className="border-b border-[#e6edf3] bg-white">
                      <AmountField
                        value={row.contractAmount}
                        onCommit={(next) =>
                          updateRow(row.key, { contractAmount: next })
                        }
                      />
                    </td>
                    {variant === "admin" ? (
                      <td
                      className={cn(
                        "border-b border-[#e6edf3] bg-[#eef8f1]",
                        stripe && "bg-[#e6f3ea]"
                      )}
                    >
                      <RateField
                        effectiveRate={computed.rate}
                        defaultRate={computed.defaultRate}
                        customRate={row.customRate}
                        onCommit={(next) =>
                          updateRow(row.key, { customRate: next })
                        }
                      />
                    </td>
                    ) : (
                    <td
                      className={cn(
                        "border-b border-[#e6edf3] bg-[#eef8f1] px-3 text-right tabular-nums text-muted-foreground",
                        stripe && "bg-[#e6f3ea]"
                      )}
                    >
                      {computed.rate == null ? "" : formatRate(computed.rate)}
                    </td>
                    )}
                    <td className="border-b border-[#e6edf3] bg-white px-3 text-right font-semibold tabular-nums">
                      {computed.commissionDue == null
                        ? ""
                        : formatDh(computed.commissionDue)}
                    </td>
                    {variant === "admin" ? (
                      <Fragment>
                    <td className="border-b border-[#e6edf3] bg-white">
                      <AmountField
                        value={row.depositReceived || null}
                        onCommit={(next) =>
                          updateRow(row.key, { depositReceived: next ?? 0 })
                        }
                      />
                    </td>
                    <td
                      className={cn(
                        "border-b border-[#e6edf3] bg-[#eef8f1] px-3 text-right font-semibold tabular-nums",
                        stripe && "bg-[#e6f3ea]",
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
                    <td
                      className={cn(
                        "min-w-[280px] border-b border-[#e6edf3] bg-[#eef8f1]",
                        stripe && "bg-[#e6f3ea]"
                      )}
                    >
                      <SheetInput
                        value={row.observation}
                        placeholder="Note"
                        title={row.observation}
                        onChange={(event) =>
                          updateRow(row.key, { observation: event.target.value })
                        }
                      />
                    </td>
                    <td className="border-b border-[#e6edf3] bg-white text-center">
                      {row.id && !isBlank(row) ? (
                        <button
                          type="button"
                          className="grid size-9 place-items-center rounded-lg text-muted-foreground opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
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
                <td className="px-3 py-3.5" colSpan={2}>
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

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setRows((current) => [...current, newEmptyRow()])}
        >
          <Plus className="size-4" />
          Ajouter une ligne
        </Button>
      </div>
    </div>
  );
}

export function ApportRateNote() {
  const savedSettings = useQuery(api.apportAffaires.getSettings);
  const saveSettings = useMutation(api.apportAffaires.saveSettings);
  const [draft, setDraft] = useState<ApportRateSettings | null>(null);
  const settings = draft ?? savedSettings ?? DEFAULT_APPORT_RATE_SETTINGS;
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (savedSettings && !draft) {
      setDraft(savedSettings);
    }
  }, [draft, savedSettings]);

  const persist = async (next: ApportRateSettings) => {
    const normalized = normalizeApportRateSettings(next);
    setDraft(normalized);
    setSaving(true);
    try {
      await saveSettings(normalized);
    } finally {
      setSaving(false);
    }
  };

  const update = (patch: Partial<ApportRateSettings>) => {
    const next = normalizeApportRateSettings({ ...settings, ...patch });
    setDraft(next);
    void persist(next);
  };

  const tiers = apportRateTiers(settings);

  return (
    <div className="rounded-2xl border border-[#f0d9a8] bg-[#fff8e8] px-4 py-4 text-sm text-[#7a5b16] sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">
          Commission automatique selon le montant du contrat
        </p>
        {saving ? (
          <span className="text-xs text-[#9a7a2e]">Enregistrement…</span>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <label className="flex flex-col gap-1 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-[#ead56a]">
          <span className="text-[11px] font-semibold uppercase tracking-wide">
            {tiers[0]?.hint}
          </span>
          <span className="flex items-center gap-1.5">
            <input
              inputMode="decimal"
              className="h-9 w-16 rounded-lg border border-[#ead56a] bg-white px-2 text-right text-sm font-semibold text-[#5c4d12] outline-none focus:ring-2 focus:ring-[#32a0f3]/30"
              defaultValue={formatPercentInput(settings.lowRate)}
              key={`low-${settings.lowRate}`}
              onBlur={(event) => {
                const rate = parsePercentInput(event.target.value);
                if (rate == null) return;
                update({ lowRate: rate });
              }}
            />
            <span className="text-xs font-semibold">%</span>
          </span>
        </label>
        <label className="flex flex-col gap-1 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-[#ead56a]">
          <span className="text-[11px] font-semibold uppercase tracking-wide">
            {tiers[1]?.hint}
          </span>
          <span className="flex items-center gap-1.5">
            <input
              inputMode="decimal"
              className="h-9 w-16 rounded-lg border border-[#ead56a] bg-white px-2 text-right text-sm font-semibold text-[#5c4d12] outline-none focus:ring-2 focus:ring-[#32a0f3]/30"
              defaultValue={formatPercentInput(settings.midRate)}
              key={`mid-${settings.midRate}`}
              onBlur={(event) => {
                const rate = parsePercentInput(event.target.value);
                if (rate == null) return;
                update({ midRate: rate });
              }}
            />
            <span className="text-xs font-semibold">%</span>
          </span>
        </label>
        <label className="flex flex-col gap-1 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-[#ead56a]">
          <span className="text-[11px] font-semibold uppercase tracking-wide">
            {tiers[2]?.hint}
          </span>
          <span className="flex items-center gap-1.5">
            <input
              inputMode="decimal"
              className="h-9 w-16 rounded-lg border border-[#ead56a] bg-white px-2 text-right text-sm font-semibold text-[#5c4d12] outline-none focus:ring-2 focus:ring-[#32a0f3]/30"
              defaultValue={formatPercentInput(settings.highRate)}
              key={`high-${settings.highRate}`}
              onBlur={(event) => {
                const rate = parsePercentInput(event.target.value);
                if (rate == null) return;
                update({ highRate: rate });
              }}
            />
            <span className="text-xs font-semibold">%</span>
          </span>
        </label>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 text-xs ring-1 ring-[#ead56a]/80">
          <span className="font-medium">Plafond 1er palier</span>
          <span className="flex items-center gap-1">
            <input
              inputMode="decimal"
              className="h-8 w-28 rounded-lg border border-[#ead56a] bg-white px-2 text-right text-sm font-semibold text-[#5c4d12] outline-none focus:ring-2 focus:ring-[#32a0f3]/30"
              defaultValue={formatAmountInput(settings.lowMax)}
              key={`lowMax-${settings.lowMax}`}
              onBlur={(event) => {
                const amount = parseAmountInput(event.target.value);
                if (amount == null) return;
                update({ lowMax: amount });
              }}
            />
            <span>DH</span>
          </span>
        </label>
        <label className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 text-xs ring-1 ring-[#ead56a]/80">
          <span className="font-medium">Plafond 2e palier</span>
          <span className="flex items-center gap-1">
            <input
              inputMode="decimal"
              className="h-8 w-28 rounded-lg border border-[#ead56a] bg-white px-2 text-right text-sm font-semibold text-[#5c4d12] outline-none focus:ring-2 focus:ring-[#32a0f3]/30"
              defaultValue={formatAmountInput(settings.midMax)}
              key={`midMax-${settings.midMax}`}
              onBlur={(event) => {
                const amount = parseAmountInput(event.target.value);
                if (amount == null) return;
                update({ midMax: amount });
              }}
            />
            <span>DH</span>
          </span>
        </label>
      </div>
    </div>
  );
}
