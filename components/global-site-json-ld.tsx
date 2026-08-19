"use client";

import { usePathname } from "next/navigation";
import JsonLd from "@/components/json-ld";
import { isCrmPath } from "@/lib/hosts";
import { buildGraph, organizationSchema, websiteSchema } from "@/lib/schema";

export default function GlobalSiteJsonLd() {
  const pathname = usePathname();
  if (isCrmPath(pathname ?? "/")) {
    return null;
  }
  return <JsonLd data={buildGraph(organizationSchema(), websiteSchema())} />;
}
