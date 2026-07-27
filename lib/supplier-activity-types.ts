export const SUPPLIER_OTHER_TYPE = "Autre";

export const SUPPLIER_MATERIAL_TYPES = [
  "Vente matériel médical",
  "Location matériel médical",
] as const;

/**
 * Keep in sync with `careServices[].title` in lib/care-services.ts.
 * Hardcoded so Convex can import this file without Next path aliases / SEO deps.
 */
export const SUPPLIER_CARE_TYPES = [
  "Kinésithérapie à domicile",
  "Soins infirmiers à domicile",
  "Médecin à domicile",
  "Aide-soignant à domicile",
  "Ambulance Maroc",
] as const;

export const SUPPLIER_ACTIVITY_TYPES = [
  ...SUPPLIER_MATERIAL_TYPES,
  ...SUPPLIER_CARE_TYPES,
  SUPPLIER_OTHER_TYPE,
] as const;

/** Admin CRM segments: matériel partenaires vs soins à domicile. */
export type SupplierPartnerKind = "materiel" | "soins";

/** Legacy labels still present in seed / older records. */
const LEGACY_MATERIAL_TYPES = ["Matériel médical"] as const;
const LEGACY_CARE_TYPES = [
  "Aide à domicile",
  "Soins à domicile",
  "Garde-malade",
] as const;

const KNOWN_SUPPLIER_TYPES = new Set<string>([
  ...SUPPLIER_MATERIAL_TYPES,
  ...SUPPLIER_CARE_TYPES,
]);

const MATERIAL_TYPE_SET = new Set<string>([
  ...SUPPLIER_MATERIAL_TYPES,
  ...LEGACY_MATERIAL_TYPES,
]);

const CARE_TYPE_SET = new Set<string>([
  ...SUPPLIER_CARE_TYPES,
  ...LEGACY_CARE_TYPES,
]);

export function getSupplierTypeList(supplier: {
  type: string;
  types?: string[];
}): string[] {
  if (supplier.types && supplier.types.length > 0) {
    return supplier.types;
  }
  if (supplier.type && supplier.type !== "—") {
    return supplier.type
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

export function isMaterialSupplierType(type: string): boolean {
  if (MATERIAL_TYPE_SET.has(type)) return true;
  const lower = type.toLowerCase();
  return (
    lower.includes("matériel") ||
    lower.includes("materiel") ||
    lower.includes("vente matériel") ||
    lower.includes("location matériel")
  );
}

export function isCareSupplierType(type: string): boolean {
  if (CARE_TYPE_SET.has(type)) return true;
  const lower = type.toLowerCase();
  return (
    lower.includes("soins") ||
    lower.includes("aide") ||
    lower.includes("garde") ||
    lower.includes("kiné") ||
    lower.includes("kinesi") ||
    lower.includes("infirm") ||
    lower.includes("médecin") ||
    lower.includes("medecin") ||
    lower.includes("ambulance") ||
    lower.includes("aide-soignant")
  );
}

export function resolveSupplierPartnerKind(supplier: {
  type: string;
  types?: string[];
  partnerKind?: SupplierPartnerKind;
}): SupplierPartnerKind | null {
  if (supplier.partnerKind === "materiel" || supplier.partnerKind === "soins") {
    return supplier.partnerKind;
  }

  const types = getSupplierTypeList(supplier);
  if (types.length === 0) return null;

  const hasMaterial = types.some(isMaterialSupplierType);
  const hasCare = types.some(isCareSupplierType);

  if (hasCare && !hasMaterial) return "soins";
  if (hasMaterial && !hasCare) return "materiel";
  if (hasCare) return "soins";
  if (hasMaterial) return "materiel";
  return null;
}

export function supplierMatchesPartnerKind(
  supplier: {
    type: string;
    types?: string[];
    partnerKind?: SupplierPartnerKind;
  },
  kind: SupplierPartnerKind
): boolean {
  const resolved = resolveSupplierPartnerKind(supplier);
  if (resolved === kind) return true;

  // Incomplete invites: only show on the list they were invited from.
  if (resolved === null) {
    return supplier.partnerKind === kind;
  }

  // Multi-activity partners can appear in both lists.
  const types = getSupplierTypeList(supplier);
  if (kind === "materiel") {
    return types.some(isMaterialSupplierType);
  }
  return types.some(isCareSupplierType);
}

export function partnerKindTypeOptions(kind: SupplierPartnerKind): string[] {
  if (kind === "soins") {
    return [...SUPPLIER_CARE_TYPES, SUPPLIER_OTHER_TYPE];
  }
  return [...SUPPLIER_MATERIAL_TYPES, SUPPLIER_OTHER_TYPE];
}

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
