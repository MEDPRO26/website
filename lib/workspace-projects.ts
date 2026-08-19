import { ADMIN_HOME_PATH, APPORT_AFFAIRES_HOME_PATH } from "@/lib/auth-routes";
import { LOGO } from "@/lib/brand";

export type WorkspaceProjectIcon = "handshake";

export type WorkspaceProject = {
  id: string;
  name: string;
  description: string;
  /** Internal path (`/admin`) or full URL for another app. */
  href: string;
  logoSrc?: string;
  icon?: WorkspaceProjectIcon;
  cta: string;
  status: "active" | "coming_soon";
};

/** Hub tiles after staff login. Add more client projects here later. */
export const WORKSPACE_PROJECTS: WorkspaceProject[] = [
  {
    id: "sos-sante",
    name: "SOS Santé",
    description: "CRM matériel médical, location et soins à domicile.",
    href: ADMIN_HOME_PATH,
    logoSrc: LOGO.crm,
    cta: "Ouvrir le CRM",
    status: "active",
  },
  {
    id: "apport-affaires",
    name: "Tableau de Suivi des Commissions - Apport d’Affaires",
    description:
      "Suivi des commissions versées aux apporteurs d’affaires.",
    href: APPORT_AFFAIRES_HOME_PATH,
    icon: "handshake",
    cta: "Ouvrir le tableau",
    status: "active",
  },
];
