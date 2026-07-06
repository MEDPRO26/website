import JsonLd from "@/components/json-ld";
import { breadcrumbSchema, buildGraph, webPageSchema } from "@/lib/schema";

type LegalJsonLdProps = {
  path: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
};

export default function LegalJsonLd({
  path,
  title,
  description,
  breadcrumbLabel,
}: LegalJsonLdProps) {
  const schema = buildGraph(
    webPageSchema(path, title, description),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: breadcrumbLabel, item: path },
    ])
  );

  return <JsonLd data={schema} />;
}
