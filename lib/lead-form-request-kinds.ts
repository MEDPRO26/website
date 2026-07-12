/** Request kinds temporarily unavailable on public lead forms. */
export const DISABLED_LEAD_REQUEST_KINDS = new Set(["location", "service"]);

export function isLeadRequestKindDisabled(value: string) {
  return DISABLED_LEAD_REQUEST_KINDS.has(value);
}

export function getLeadRequestKindOptionLabel(baseLabel: string, value: string) {
  if (isLeadRequestKindDisabled(value)) {
    return `${baseLabel} - bientôt disponible`;
  }
  return baseLabel;
}
