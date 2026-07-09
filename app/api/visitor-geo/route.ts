import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { countryNameFromCode, type VisitorGeo } from "@/lib/visitor-geo";

function decodeHeader(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function GET(request: NextRequest) {
  const city = decodeHeader(request.headers.get("x-vercel-ip-city"));
  const countryCode = request.headers.get("x-vercel-ip-country")?.toUpperCase() ?? null;
  const region = decodeHeader(request.headers.get("x-vercel-ip-country-region"));

  const payload: VisitorGeo = {
    city,
    countryCode,
    country: countryNameFromCode(countryCode),
    region,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "private, max-age=3600",
    },
  });
}
