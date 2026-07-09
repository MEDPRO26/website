import { careServices } from "@/lib/care-services";

export const SUPPLIER_OTHER_TYPE = "Autre";

export const SUPPLIER_MATERIAL_TYPES = [
  "Vente matériel médical",
  "Location matériel médical",
] as const;

export const SUPPLIER_CARE_TYPES = careServices.map((service) => service.title);

export const SUPPLIER_ACTIVITY_TYPES = [
  ...SUPPLIER_MATERIAL_TYPES,
  ...SUPPLIER_CARE_TYPES,
  SUPPLIER_OTHER_TYPE,
] as const;

const KNOWN_SUPPLIER_TYPES = new Set<string>([
  ...SUPPLIER_MATERIAL_TYPES,
  ...SUPPLIER_CARE_TYPES,
]);

export function splitSupplierTypes(types: string[]) {
  const known: string[] = [];
  const custom: string[] = [];

  for (const type of types) {
    if (KNOWN_SUPPLIER_TYPES.has(type)) {
      known.push(type);
    } else if (type.trim()) {
      custom.push(type.trim());
    }
  }

  const selected = [...known];
  if (custom.length > 0) {
    selected.push(SUPPLIER_OTHER_TYPE);
  }

  return {
    selected,
    otherText: custom.join(", "),
  };
}

export function buildSupplierTypes(
  selected: string[],
  otherText: string
): string[] | null {
  const result = selected.filter((type) => type !== SUPPLIER_OTHER_TYPE);

  if (selected.includes(SUPPLIER_OTHER_TYPE)) {
    const custom = otherText.trim();
    if (!custom) {
      return null;
    }
    result.push(custom);
  }

  return result.length > 0 ? result : null;
}
