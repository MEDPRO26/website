import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { venteProductPath } from "@/lib/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyProductPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(venteProductPath(slug, DEFAULT_CITY_SLUG));
}
