export const APPORT_DEMANDE_STATUSES = [
  "ouverte",
  "en_discussion",
  "client_accepte",
  "client_refuse",
  "traitee",
] as const;

export type ApportDemandeStatus = (typeof APPORT_DEMANDE_STATUSES)[number];

export const APPORT_DEMANDE_STATUS_LABELS: Record<ApportDemandeStatus, string> = {
  ouverte: "Ouverte",
  en_discussion: "En cours de discussion avec client",
  client_accepte: "Client accepté",
  client_refuse: "Client n'a pas accepté",
  traitee: "Projet complété",
};

/** Options for apporteur workflow dropdown (after opening a demande). */
export const APPORT_DEMANDE_WORKFLOW_OPTIONS: {
  value: ApportDemandeStatus;
  label: string;
}[] = [
  { value: "ouverte", label: APPORT_DEMANDE_STATUS_LABELS.ouverte },
  {
    value: "en_discussion",
    label: APPORT_DEMANDE_STATUS_LABELS.en_discussion,
  },
  { value: "client_accepte", label: APPORT_DEMANDE_STATUS_LABELS.client_accepte },
  {
    value: "client_refuse",
    label: APPORT_DEMANDE_STATUS_LABELS.client_refuse,
  },
  { value: "traitee", label: APPORT_DEMANDE_STATUS_LABELS.traitee },
];

export function apportDemandeStatusLabel(status: string | undefined) {
  if (!status) return "—";
  return (
    APPORT_DEMANDE_STATUS_LABELS[status as ApportDemandeStatus] ?? status
  );
}

export function apportDemandeStatusTone(
  status: string | undefined
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "traitee":
    case "client_accepte":
      return "success";
    case "client_refuse":
      return "danger";
    case "en_discussion":
      return "info";
    case "ouverte":
      return "warning";
    default:
      return "neutral";
  }
}
