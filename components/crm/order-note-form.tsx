"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type OrderNoteFormProps = {
  orderId: Id<"orders">;
};

export function OrderNoteForm({ orderId }: OrderNoteFormProps) {
  const addNote = useMutation(api.orders.addNote);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = note.trim();
    if (!trimmed) {
      return;
    }

    setSubmitting(true);
    try {
      await addNote({ orderId, note: trimmed });
      setNote("");
      toast.success("Note ajoutée.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'ajouter la note."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2 border-t border-border/60 bg-muted/15 px-5 py-4 -mx-5 -mb-5 mt-5 rounded-b-xl">
      <Textarea
        rows={3}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Ajouter une note interne…"
        className="resize-none border-border/70 bg-white"
      />
      <Button
        size="sm"
        className="w-full bg-brand hover:bg-brand-deep"
        disabled={submitting || !note.trim()}
        onClick={() => void handleSubmit()}
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Envoi…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Ajouter une note
          </>
        )}
      </Button>
    </div>
  );
}
