"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_CITY_SLUG,
  getCityBySlug,
  type CitySlug,
} from "@/lib/cities";
import { readStoredCitySlug, writeStoredCitySlug } from "@/lib/city-storage";

export function useSelectedCity() {
  const [citySlug, setCitySlugState] = useState<CitySlug>(DEFAULT_CITY_SLUG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCitySlugState(readStoredCitySlug());
    setReady(true);
  }, []);

  const setCitySlug = useCallback((nextCitySlug: CitySlug) => {
    setCitySlugState(nextCitySlug);
    writeStoredCitySlug(nextCitySlug);
  }, []);

  const city = getCityBySlug(citySlug) ?? getCityBySlug(DEFAULT_CITY_SLUG)!;

  return { citySlug, city, setCitySlug, ready };
}
