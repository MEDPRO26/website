import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { venteCategoryPath } from "@/lib/routes";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function LegacyVenteCategoryPage({ params }: PageProps) {
  const { category } = await params;
  redirect(venteCategoryPath(category, DEFAULT_CITY_SLUG));
}
