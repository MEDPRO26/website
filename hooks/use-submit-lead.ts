"use client";

import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { LeadSubmissionInput } from "@/lib/lead-submission";

export function useSubmitLead() {
  const submitOrder = useMutation(api.orders.submitFromWebsite);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (input: LeadSubmissionInput) => {
      if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
        throw new Error(
          "Service indisponible. Veuillez réessayer plus tard ou nous contacter par WhatsApp."
        );
      }

      setIsSubmitting(true);
      setError(null);

      try {
        return await submitOrder(input);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Une erreur est survenue. Veuillez réessayer.";
        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitOrder]
  );

  return { submit, isSubmitting, error };
}
