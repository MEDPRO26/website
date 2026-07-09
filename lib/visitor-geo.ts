export type VisitorGeo = {
  city: string | null;
  countryCode: string | null;
  country: string | null;
  region: string | null;
};

export function countryNameFromCode(code: string | null | undefined) {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export function formatVisitorLocation(input: {
  city?: string | null;
  country?: string | null;
  countryCode?: string | null;
}) {
  const city = input.city?.trim();
  const country =
    input.country?.trim() ||
    countryNameFromCode(input.countryCode) ||
    input.countryCode?.trim();

  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return "Localisation inconnue";
}

export function isMorocco(countryCode: string | null | undefined) {
  return countryCode?.toUpperCase() === "MA";
}
