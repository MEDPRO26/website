export const LEGAL_ROUTES = {
  conditions: "/conditions-generales",
  privacy: "/politique-de-confidentialite",
  cookies: "/politique-de-cookies",
  mentions: "/mentions-legales",
} as const;

export const legalPages = [
  {
    href: LEGAL_ROUTES.mentions,
    label: "Mentions légales",
  },
  {
    href: LEGAL_ROUTES.conditions,
    label: "Conditions générales",
  },
  {
    href: LEGAL_ROUTES.privacy,
    label: "Confidentialité",
  },
  {
    href: LEGAL_ROUTES.cookies,
    label: "Cookies",
  },
] as const;
