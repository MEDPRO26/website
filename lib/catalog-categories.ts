export const catalogCategories = [
  { label: "Tous les matériels", value: "all", icon: null, param: "all" },
  {
    label: "Mobilier Médical",
    value: "Mobilier Médical",
    icon: "accessible",
    param: "mobilier-medical",
  },
  {
    label: "Respiratoire",
    value: "Respiratoire",
    icon: "air",
    param: "respiratoire",
  },
  { label: "Confort", value: "Confort", icon: "bed", param: "confort" },
  {
    label: "Diagnostic",
    value: "Diagnostic",
    icon: "monitoring",
    param: "diagnostic",
  },
  {
    label: "Instruments",
    value: "Instruments",
    icon: "medical_services",
    param: "instruments",
  },
] as const;

export const categoryParamToValue: Record<string, string> = {
  all: "all",
  mobilite: "Mobilier Médical",
  "mobilier-medical": "Mobilier Médical",
  respiratoire: "Respiratoire",
  confort: "Confort",
  diagnostic: "Diagnostic",
  instruments: "Instruments",
};

export function categoryValueFromParam(param: string | null): string {
  if (!param) return "all";
  return categoryParamToValue[param] ?? "all";
}

export function isValidCategoryParam(param: string): boolean {
  return param in categoryParamToValue && param !== "all";
}

export const venteCategoryParams = catalogCategories
  .filter((category) => category.param !== "all")
  .map((category) => category.param);

