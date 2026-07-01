import type { Doc } from "../_generated/dataModel";

/** Legacy suppliers without the field are treated as complete. */
export function isSupplierProfileComplete(supplier: Doc<"suppliers">) {
  return supplier.profileComplete !== false;
}
