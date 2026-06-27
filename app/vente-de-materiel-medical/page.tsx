import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { venteCityPath } from "@/lib/routes";

export default function LegacyVentePage() {
  redirect(venteCityPath(DEFAULT_CITY_SLUG));
}
