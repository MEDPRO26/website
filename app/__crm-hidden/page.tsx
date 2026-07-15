import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPrivateRobotsMetadata } from "@/lib/indexing";

export const metadata: Metadata = {
  robots: getPrivateRobotsMetadata(),
};

/** Internal rewrite target for unauthenticated CRM probes. */
export default function HiddenNotFoundPage() {
  notFound();
}
