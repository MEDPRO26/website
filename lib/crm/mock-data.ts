export type OrderStatus =
  | "nouvelle"
  | "a_qualifier"
  | "a_affecter"
  | "envoyee_fournisseur"
  | "vue_fournisseur"
  | "prix_recu"
  | "offre_envoyee"
  | "acceptee"
  | "planifiee"
  | "en_cours"
  | "location_active"
  | "terminee"
  | "annulee"
  | "reclamation";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle demande",
  a_qualifier: "client confirme",
  a_affecter: "Nouvelle demande",
  envoyee_fournisseur: "Envoyée fournisseur",
  vue_fournisseur: "Vue fournisseur",
  prix_recu: "Prix reçu",
  offre_envoyee: "Offre envoyée",
  acceptee: "Prix accepté",
  planifiee: "Planifiée",
  en_cours: "En cours de livraison",
  location_active: "Location active",
  terminee: "Commande livrée",
  annulee: "Annulée",
  reclamation: "Réclamation ouverte",
};

export const STATUS_TONE: Record<OrderStatus, "info" | "warning" | "success" | "danger" | "neutral" | "brand"> = {
  nouvelle: "info",
  a_qualifier: "warning",
  a_affecter: "warning",
  envoyee_fournisseur: "brand",
  vue_fournisseur: "brand",
  prix_recu: "info",
  offre_envoyee: "info",
  acceptee: "success",
  planifiee: "success",
  en_cours: "success",
  location_active: "success",
  terminee: "neutral",
  annulee: "danger",
  reclamation: "danger",
};

export type Order = {
  id: string;
  ref: string;
  client: string;
  phone: string;
  whatsapp: string;
  city: string;
  district: string;
  address: string;
  type: string;
  item: string;
  duration: string;
  desiredDate: string;
  slot: string;
  source: string;
  status: OrderStatus;
  supplier?: string;
  supplierPrice?: number;
  delivery?: number;
  install?: number;
  other?: number;
  commissionPct?: number;
  finalPrice?: number;
  assistant: string;
  createdAt: string;
  message: string;
  notes?: string;
  pagePath?: string;
};

export const ORDERS: Order[] = [
  {
    id: "1", ref: "SOS-AG-2026-0001",
    client: "Mohamed El Amrani", phone: "+212 6 61 23 45 67", whatsapp: "+212 6 61 23 45 67",
    city: "Agadir", district: "Hay Mohammadi", address: "Rue 12, Imm. 3, Apt 5",
    type: "Location matériel médical", item: "Lit médicalisé électrique",
    duration: "1 mois", desiredDate: "2026-06-28", slot: "Matin (9h-12h)",
    source: "WhatsApp manuel", status: "prix_recu",
    supplier: "Fournisseur Démo Agadir", supplierPrice: 1200, delivery: 150, install: 100, other: 0,
    commissionPct: 15, finalPrice: 1668,
    assistant: "Salma B.", createdAt: "2026-06-26 09:14",
    message: "Pour mon père, opéré récemment. Besoin pour 1 mois.",
    notes: "Client prioritaire, le rappeler avant 18h.",
  },
  {
    id: "2", ref: "SOS-AG-2026-0002",
    client: "Fatima Zahra Idrissi", phone: "+212 6 62 11 22 33", whatsapp: "+212 6 62 11 22 33",
    city: "Inezgane", district: "Centre", address: "Av. Mohammed V",
    type: "Garde-malade", item: "Garde de nuit, 7 jours",
    duration: "1 semaine", desiredDate: "2026-06-27", slot: "Nuit",
    source: "Formulaire site", status: "nouvelle",
    assistant: "Salma B.", createdAt: "2026-06-26 11:02",
    message: "Ma mère sort de l'hôpital, on cherche une garde de nuit sérieuse.",
  },
  {
    id: "3", ref: "SOS-AG-2026-0003",
    client: "Youssef Bouzidi", phone: "+212 6 70 88 99 10", whatsapp: "+212 6 70 88 99 10",
    city: "Agadir", district: "Dakhla", address: "Lotissement Annour",
    type: "Livraison matériel", item: "Concentrateur d'oxygène",
    duration: "Achat", desiredDate: "2026-06-26", slot: "Après-midi",
    source: "Appel téléphonique", status: "offre_envoyee",
    supplier: "MedAgadir Pro", supplierPrice: 4500, delivery: 0, install: 200, other: 0,
    commissionPct: 12, finalPrice: 5264,
    assistant: "Karim T.", createdAt: "2026-06-26 08:30",
    message: "Urgent, prescription du médecin disponible.",
  },
  {
    id: "4", ref: "SOS-AG-2026-0004",
    client: "Aicha Naciri", phone: "+212 6 55 44 33 22", whatsapp: "+212 6 55 44 33 22",
    city: "Dcheira", district: "Centre", address: "Quartier Al Wifaq",
    type: "Aide à domicile", item: "3h/jour, 5 jours/semaine",
    duration: "1 mois", desiredDate: "2026-06-29", slot: "Matin",
    source: "Google Maps", status: "vue_fournisseur",
    supplier: "Fournisseur Démo Agadir",
    assistant: "Salma B.", createdAt: "2026-06-26 13:45",
    message: "Pour ma grand-mère, autonome mais besoin d'aide ménagère.",
  },
  {
    id: "5", ref: "SOS-AG-2026-0005",
    client: "Rachid El Houari", phone: "+212 6 12 34 56 78", whatsapp: "+212 6 12 34 56 78",
    city: "Agadir", district: "Founty", address: "Résidence Marina",
    type: "Location matériel médical", item: "Fauteuil roulant",
    duration: "2 semaines", desiredDate: "2026-06-30", slot: "Après-midi",
    source: "WhatsApp manuel", status: "envoyee_fournisseur",
    supplier: "Fournisseur Démo Agadir",
    assistant: "Karim T.", createdAt: "2026-06-26 14:10",
    message: "Suite à fracture, besoin temporaire.",
  },
  {
    id: "6", ref: "SOS-AG-2026-0006",
    client: "Nadia Berrada", phone: "+212 6 78 12 34 56", whatsapp: "+212 6 78 12 34 56",
    city: "Agadir", district: "Talborjt", address: "Rue de la Plage",
    type: "Soin à domicile", item: "Pansement post-opératoire",
    duration: "10 jours", desiredDate: "2026-06-27", slot: "Matin",
    source: "Réseaux sociaux", status: "acceptee",
    supplier: "InfiSoins Agadir", supplierPrice: 800, delivery: 0, install: 0, other: 0,
    commissionPct: 18, finalPrice: 944,
    assistant: "Salma B.", createdAt: "2026-06-25 17:22",
    message: "Pansement quotidien pendant 10 jours.",
  },
  {
    id: "7", ref: "SOS-AG-2026-0007",
    client: "Hassan Tazi", phone: "+212 6 99 88 77 66", whatsapp: "+212 6 99 88 77 66",
    city: "Agadir", district: "Cité Suisse", address: "Imm. Atlas",
    type: "Location matériel médical", item: "Lit médicalisé + matelas anti-escarres",
    duration: "3 mois", desiredDate: "2026-07-01", slot: "Matin",
    source: "Formulaire site", status: "location_active",
    supplier: "MedAgadir Pro", supplierPrice: 3000, delivery: 200, install: 150, other: 0,
    commissionPct: 15, finalPrice: 3852,
    assistant: "Karim T.", createdAt: "2026-06-20 10:00",
    message: "Location longue durée pour parent âgé.",
  },
  {
    id: "8", ref: "SOS-AG-2026-0008",
    client: "Souad El Karim", phone: "+212 6 11 22 33 44", whatsapp: "+212 6 11 22 33 44",
    city: "Inezgane", district: "Tarrast", address: "—",
    type: "Garde-malade", item: "24h/24, 1 semaine",
    duration: "1 semaine", desiredDate: "2026-06-28", slot: "Continu",
    source: "WhatsApp manuel", status: "terminee",
    supplier: "Fournisseur Démo Agadir", supplierPrice: 900, delivery: 100, install: 0, other: 0,
    commissionPct: 15, finalPrice: 1150,
    assistant: "Salma B.", createdAt: "2026-06-24 16:30",
    message: "Garde de nuit — prestation effectuée.",
  },
  {
    id: "9", ref: "SOS-AG-2026-0009",
    client: "Karim Benali", phone: "+212 6 45 67 89 01", whatsapp: "+212 6 45 67 89 01",
    city: "Agadir", district: "Dcheira", address: "Lot Al Amal, Bloc B",
    type: "Location matériel médical", item: "Concentrateur d'oxygène 5L",
    duration: "15 jours", desiredDate: "2026-06-27", slot: "Matin (9h-12h)",
    source: "Formulaire site", status: "envoyee_fournisseur",
    supplier: "Fournisseur Démo Agadir",
    assistant: "Karim T.", createdAt: "2026-06-26 15:20",
    message: "Besoin urgent pour oxygénothérapie à domicile.",
  },
];

export type Supplier = {
  id: string;
  name: string;
  type: string;
  city: string;
  zones: string[];
  phone: string;
  whatsapp: string;
  email: string;
  status: "actif" | "suspendu" | "en_attente";
  verified: boolean;
  ordersCount: number;
  responseAvg: string;
  commissionPct: number;
  items?: string[];
  services?: string[];
};

export const SUPPLIERS: Supplier[] = [
  {
    id: "s1", name: "Fournisseur Démo Agadir", type: "Matériel médical",
    city: "Agadir", zones: ["Agadir", "Inezgane", "Dcheira"],
    phone: "+212 5 28 22 11 00", whatsapp: "+212 6 00 11 22 33", email: "contact@demo-agadir.ma",
    status: "actif", verified: true, ordersCount: 47, responseAvg: "1h12", commissionPct: 15,
    items: ["Lit médicalisé", "Fauteuil roulant", "Béquilles", "Déambulateur"],
    services: ["Livraison", "Installation"],
  },
  {
    id: "s2", name: "MedAgadir Pro", type: "Matériel médical",
    city: "Agadir", zones: ["Agadir", "Aourir", "Taghazout"],
    phone: "+212 5 28 33 22 11", whatsapp: "+212 6 11 22 33 44", email: "pro@medagadir.ma",
    status: "actif", verified: true, ordersCount: 32, responseAvg: "45min", commissionPct: 12,
    items: ["Concentrateur d'oxygène", "Lit médicalisé", "Matelas anti-escarres"],
    services: ["Livraison", "Installation", "Maintenance"],
  },
  {
    id: "s3", name: "InfiSoins Agadir", type: "Soins à domicile",
    city: "Agadir", zones: ["Agadir", "Inezgane"],
    phone: "+212 5 28 11 00 99", whatsapp: "+212 6 22 33 44 55", email: "infi@soins.ma",
    status: "actif", verified: true, ordersCount: 28, responseAvg: "30min", commissionPct: 18,
    services: ["Pansement", "Injection", "Prélèvement", "Suivi post-op"],
  },
  {
    id: "s4", name: "AideFamille Sud", type: "Aide à domicile",
    city: "Inezgane", zones: ["Inezgane", "Dcheira", "Agadir"],
    phone: "+212 5 28 44 55 66", whatsapp: "+212 6 44 55 66 77", email: "contact@aidefamille.ma",
    status: "en_attente", verified: false, ordersCount: 5, responseAvg: "3h", commissionPct: 20,
    services: ["Aide ménagère", "Garde de jour", "Garde de nuit", "Accompagnement"],
  },
];

export const DEMO_SUPPLIER_ID = "s1";

export function getDemoSupplier() {
  return SUPPLIERS.find((s) => s.id === DEMO_SUPPLIER_ID)!;
}

export function getDemoSupplierOrders() {
  return ORDERS.filter((o) => o.supplier === getDemoSupplier().name);
}

export type Customer = {
  id: string; name: string; phone: string; city: string; district: string;
  orders: number; lastOrder: string; source: string; status: "actif" | "vip" | "inactif";
};
export const CUSTOMERS: Customer[] = ORDERS.map((o, i) => ({
  id: `c${i + 1}`, name: o.client, phone: o.phone, city: o.city, district: o.district,
  orders: 1 + (i % 3), lastOrder: o.createdAt, source: o.source,
  status: i === 0 ? "vip" : "actif",
}));

export const CONVERSATIONS = [
  { id: "w1", name: "Mohamed El Amrani", phone: "+212 6 61 23 45 67", last: "D'accord, je confirme pour demain matin.", time: "10:24", unread: 0, status: "Traité" },
  { id: "w2", name: "Fatima Zahra Idrissi", phone: "+212 6 62 11 22 33", last: "Bonjour, je voudrais une garde de nuit svp", time: "11:02", unread: 2, status: "Nouveau" },
  { id: "w3", name: "+212 6 33 44 55 66", phone: "+212 6 33 44 55 66", last: "Combien pour un lit médicalisé ?", time: "12:45", unread: 1, status: "Nouveau" },
  { id: "w4", name: "Rachid El Houari", phone: "+212 6 12 34 56 78", last: "Merci, j'attends votre devis.", time: "Hier", unread: 0, status: "En cours" },
];

export const COMPLAINTS = [
  { id: "r1", ref: "REC-2026-0012", order: "SOS-AG-2026-0007", client: "Hassan Tazi", supplier: "MedAgadir Pro", type: "Retard livraison", status: "Ouverte", priority: "Haute", date: "2026-06-25", assignee: "Karim T." },
  { id: "r2", ref: "REC-2026-0011", order: "SOS-AG-2026-0003", client: "Youssef Bouzidi", supplier: "MedAgadir Pro", type: "Matériel non conforme", status: "En traitement", priority: "Moyenne", date: "2026-06-24", assignee: "Salma B." },
  { id: "r3", ref: "REC-2026-0010", order: "SOS-AG-2026-0001", client: "Mohamed El Amrani", supplier: "Fournisseur Démo Agadir", type: "Facturation", status: "Résolue", priority: "Basse", date: "2026-06-22", assignee: "Karim T." },
];

export const USERS = [
  { id: "u1", name: "Yassine Admin", email: "yassine@sossante.ma", role: "Admin", status: "Actif", lastLogin: "2026-06-26 09:00", createdAt: "2025-11-01" },
  { id: "u2", name: "Salma B.", email: "salma@sossante.ma", role: "Assistant", status: "Actif", lastLogin: "2026-06-26 13:42", createdAt: "2026-01-10" },
  { id: "u3", name: "Karim T.", email: "karim@sossante.ma", role: "Assistant", status: "Actif", lastLogin: "2026-06-26 08:15", createdAt: "2026-01-10" },
  { id: "u4", name: "Fournisseur Démo", email: "demo@demo-agadir.ma", role: "Fournisseur", status: "Actif", lastLogin: "2026-06-25 18:20", createdAt: "2026-02-14" },
  { id: "u5", name: "AideFamille Sud", email: "contact@aidefamille.ma", role: "Fournisseur", status: "En attente", lastLogin: "—", createdAt: "2026-06-20" },
];

export const NOTIFICATIONS = [
  { id: "n1", type: "Nouvelle commande", title: "Nouvelle demande — Aicha Naciri", desc: "Aide à domicile · Dcheira", time: "Il y a 5 min", read: false },
  { id: "n2", type: "Fournisseur a répondu", title: "MedAgadir Pro a soumis un prix", desc: "SOS-AG-2026-0003 · 4 500 MAD", time: "Il y a 32 min", read: false },
  { id: "n3", type: "Client accepté", title: "Nadia Berrada a accepté l'offre", desc: "SOS-AG-2026-0006", time: "Il y a 1h", read: true },
  { id: "n4", type: "Réclamation", title: "Nouvelle réclamation REC-2026-0012", desc: "Retard livraison · Hassan Tazi", time: "Il y a 3h", read: true },
  { id: "n5", type: "Commission due", title: "Commission à régler", desc: "Fournisseur Démo Agadir · 250 MAD", time: "Hier", read: true },
];

export const AUDIT_LOGS = [
  { date: "2026-06-26 14:12", user: "Salma B.", action: "Mise à jour statut", entity: "SOS-AG-2026-0003", before: "Prix reçu", after: "Offre envoyée", ip: "•••.•••.12.45" },
  { date: "2026-06-26 13:45", user: "Salma B.", action: "Création commande", entity: "SOS-AG-2026-0004", before: "—", after: "Nouvelle demande", ip: "•••.•••.12.45" },
  { date: "2026-06-26 11:02", user: "Système", action: "Notification envoyée", entity: "Fournisseur Démo Agadir", before: "—", after: "WhatsApp", ip: "—" },
  { date: "2026-06-26 09:14", user: "Karim T.", action: "Affectation fournisseur", entity: "SOS-AG-2026-0001", before: "—", after: "Fournisseur Démo Agadir", ip: "•••.•••.18.07" },
];

export const CMS_PAGES = [
  { id: "p1", title: "Accueil", slug: "/", type: "Page", status: "Publié", indexable: true, updated: "2026-06-20" },
  { id: "p2", title: "Location matériel médical", slug: "/services/location-materiel", type: "Service", status: "Publié", indexable: true, updated: "2026-06-18" },
  { id: "p3", title: "Garde-malade à Agadir", slug: "/services/garde-malade", type: "Service", status: "Publié", indexable: true, updated: "2026-06-15" },
  { id: "p4", title: "Lit médicalisé électrique", slug: "/materiel/lit-medicalise", type: "Matériel", status: "Publié", indexable: true, updated: "2026-06-12" },
  { id: "p5", title: "Aide à domicile Inezgane", slug: "/villes/inezgane", type: "Ville", status: "Brouillon", indexable: false, updated: "2026-06-10" },
  { id: "p6", title: "FAQ", slug: "/faq", type: "Page", status: "Publié", indexable: true, updated: "2026-06-05" },
];

export const KPI = {
  newToday: 7, waitingSupplier: 6, pricesReceived: 3,
  offersSent: 5, confirmed: 9, activeRentals: 14, openComplaints: 2, dueCommissions: 1840,
};

export const CHART_ORDERS_7D = [
  { day: "Ven", count: 8 }, { day: "Sam", count: 6 }, { day: "Dim", count: 4 },
  { day: "Lun", count: 11 }, { day: "Mar", count: 9 }, { day: "Mer", count: 13 }, { day: "Jeu", count: 7 },
];
export const CHART_BY_SOURCE = [
  { name: "WhatsApp", value: 42 }, { name: "Site", value: 28 },
  { name: "Appel", value: 15 }, { name: "Google Maps", value: 10 }, { name: "Autre", value: 5 },
];
export const CHART_BY_CITY = [
  { city: "Agadir", count: 64 }, { city: "Inezgane", count: 22 },
  { city: "Dcheira", count: 12 }, { city: "Aourir", count: 6 },
];
export const CHART_BY_TYPE = [
  { name: "Location matériel", value: 38 },
  { name: "Garde-malade", value: 24 },
  { name: "Aide à domicile", value: 18 },
  { name: "Soin à domicile", value: 12 },
  { name: "Livraison", value: 8 },
];

export const CHART_COLORS = [
  "var(--brand)", "var(--info)", "var(--success)", "var(--warning)", "var(--accent-foreground)",
];