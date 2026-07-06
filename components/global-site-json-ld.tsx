import JsonLd from "@/components/json-ld";
import { buildGraph, organizationSchema, websiteSchema } from "@/lib/schema";

export default function GlobalSiteJsonLd() {
  return <JsonLd data={buildGraph(organizationSchema(), websiteSchema())} />;
}
