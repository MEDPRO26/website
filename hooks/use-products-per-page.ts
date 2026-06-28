"use client";

import { useEffect, useState } from "react";

/** 2 cols below lg, 3 cols at lg+ — 3 rows => 6 mobile / desktopCount desktop */
export function useProductsPerPage(mobileCount: number, desktopCount: number) {
  const [perPage, setPerPage] = useState(mobileCount);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerPage(mq.matches ? desktopCount : mobileCount);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobileCount, desktopCount]);

  return perPage;
}
