export type CostLine = {
  id: string;
  label: string;
  category: string;
  budget: number;
  actual: number;
  month?: string;
};

export type RevenueLine = {
  id: string;
  label: string;
  category: string;
  budget: number;
  actual: number;
  month?: string;
};

export type Resource = {
  id: string;
  name: string;
  role: string;
  tjm: number;
  salaire?: number;
  daysBudget: number;
  daysActual: number;
  photo?: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: "active" | "at-risk" | "closed";
  owner: string;
  startDate: string;
  endDate: string;
  revenueBudget: number;
  revenueActual: number;
  costBudget: number;
  costActual: number;
  costs: CostLine[];
  revenues: RevenueLine[];
  resources: Resource[];
  monthly: { month: string; revenue: number; cost: number; budgetRevenue: number; budgetCost: number }[];
};

const PORTRAITS: Record<string, string> = {
  "Léa Moreau":    "https://randomuser.me/api/portraits/women/44.jpg",
  "Yanis Berger":  "https://randomuser.me/api/portraits/men/32.jpg",
  "Inès Cordier":  "https://randomuser.me/api/portraits/women/68.jpg",
  "Karim Said":    "https://randomuser.me/api/portraits/men/55.jpg",
  "Tom Vasseur":   "https://randomuser.me/api/portraits/men/17.jpg",
  "Sara Lemoine":  "https://randomuser.me/api/portraits/women/21.jpg",
  "Marc Olivier":  "https://randomuser.me/api/portraits/men/41.jpg",
  "Camille Roy":   "https://randomuser.me/api/portraits/women/12.jpg",
  "Nora Ben":      "https://randomuser.me/api/portraits/women/57.jpg",
  "Hugo Tan":      "https://randomuser.me/api/portraits/men/76.jpg",
  "Adrien Faure":  "https://randomuser.me/api/portraits/men/23.jpg",
  "Eva Mancini":   "https://randomuser.me/api/portraits/women/33.jpg",
}

function avatar(name: string): string {
  return PORTRAITS[name] ?? `https://randomuser.me/api/portraits/lego/1.jpg`
}

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function makeMonthly(rev: number, cost: number, bRev: number, bCost: number) {
  return months.slice(0, 9).map((m, i) => ({
    month: m,
    revenue: Math.round((rev / 9) * (0.7 + Math.random() * 0.6)),
    cost: Math.round((cost / 9) * (0.7 + Math.random() * 0.6)),
    budgetRevenue: Math.round(bRev / 9),
    budgetCost: Math.round(bCost / 9),
  }));
}

export const projects: Project[] = [
  {
    id: "atlas",
    name: "Refonte CRM Atlas",
    client: "Banque Helios",
    status: "active",
    owner: "Léa Moreau",
    startDate: "2026-01-15",
    endDate: "2026-09-30",
    revenueBudget: 480000,
    revenueActual: 392000,
    costBudget: 310000,
    costActual: 268500,
    costs: [
      { id: "c1", label: "Équipe dev", category: "Ressources humaines", budget: 180000, actual: 162000 },
      { id: "c2", label: "Design system", category: "Ressources humaines", budget: 42000, actual: 38500 },
      { id: "c3", label: "Infra cloud", category: "Infrastructure", budget: 28000, actual: 24000 },
      { id: "c4", label: "Licences SaaS", category: "Outillage", budget: 18000, actual: 19200 },
      { id: "c5", label: "Sous-traitance QA", category: "Sous-traitance", budget: 42000, actual: 24800 },
    ],
    revenues: [
      { id: "r1", label: "Phase 1 — Discovery", category: "Forfait", budget: 90000, actual: 90000 },
      { id: "r2", label: "Phase 2 — Build", category: "Forfait", budget: 280000, actual: 230000 },
      { id: "r3", label: "Régie complémentaire", category: "Régie", budget: 110000, actual: 72000 },
    ],
    resources: [
      { id: "h1", name: "Léa Moreau", role: "Lead PM", tjm: 950, daysBudget: 120, daysActual: 102, photo: avatar("Léa Moreau") },
      { id: "h2", name: "Yanis Berger", role: "Tech Lead", tjm: 1100, daysBudget: 110, daysActual: 96, photo: avatar("Yanis Berger") },
      { id: "h3", name: "Inès Cordier", role: "Designer", tjm: 780, daysBudget: 60, daysActual: 54, photo: avatar("Inès Cordier") },
      { id: "h4", name: "Karim Said", role: "Dev Senior", tjm: 850, daysBudget: 140, daysActual: 118, photo: avatar("Karim Said") },
    ],
    monthly: makeMonthly(480000, 310000, 480000, 310000),
  },
  {
    id: "orion",
    name: "Plateforme Data Orion",
    client: "Energie Nord",
    status: "at-risk",
    owner: "Tom Vasseur",
    startDate: "2025-11-02",
    endDate: "2026-07-15",
    revenueBudget: 720000,
    revenueActual: 540000,
    costBudget: 520000,
    costActual: 548000,
    costs: [
      { id: "c1", label: "Data engineers", category: "Ressources humaines", budget: 280000, actual: 312000 },
      { id: "c2", label: "Plateforme cloud", category: "Infrastructure", budget: 120000, actual: 134000 },
      { id: "c3", label: "Modèles ML", category: "Sous-traitance", budget: 80000, actual: 64000 },
      { id: "c4", label: "Licences", category: "Outillage", budget: 40000, actual: 38000 },
    ],
    revenues: [
      { id: "r1", label: "Build plateforme", category: "Forfait", budget: 520000, actual: 380000 },
      { id: "r2", label: "Run & TMA", category: "Régie", budget: 200000, actual: 160000 },
    ],
    resources: [
      { id: "h1", name: "Tom Vasseur", role: "Architecte data", tjm: 1200, daysBudget: 140, daysActual: 148, photo: avatar("Tom Vasseur") },
      { id: "h2", name: "Sara Lemoine", role: "Data Eng", tjm: 900, daysBudget: 160, daysActual: 172, photo: avatar("Sara Lemoine") },
      { id: "h3", name: "Marc Olivier", role: "ML Engineer", tjm: 1050, daysBudget: 80, daysActual: 64, photo: avatar("Marc Olivier") },
    ],
    monthly: makeMonthly(720000, 520000, 720000, 520000),
  },
  {
    id: "nova",
    name: "App mobile Nova",
    client: "Retail Méridien",
    status: "active",
    owner: "Camille Roy",
    startDate: "2026-02-10",
    endDate: "2026-08-30",
    revenueBudget: 260000,
    revenueActual: 210000,
    costBudget: 180000,
    costActual: 142000,
    costs: [
      { id: "c1", label: "Équipe mobile", category: "Ressources humaines", budget: 130000, actual: 102000 },
      { id: "c2", label: "Design produit", category: "Ressources humaines", budget: 30000, actual: 26000 },
      { id: "c3", label: "Stores & infra", category: "Infrastructure", budget: 20000, actual: 14000 },
    ],
    revenues: [
      { id: "r1", label: "MVP", category: "Forfait", budget: 160000, actual: 140000 },
      { id: "r2", label: "V1", category: "Forfait", budget: 100000, actual: 70000 },
    ],
    resources: [
      { id: "h1", name: "Camille Roy", role: "PM", tjm: 880, daysBudget: 90, daysActual: 72, photo: avatar("Camille Roy") },
      { id: "h2", name: "Nora Ben", role: "Dev iOS", tjm: 920, daysBudget: 80, daysActual: 64, photo: avatar("Nora Ben") },
      { id: "h3", name: "Hugo Tan", role: "Dev Android", tjm: 900, daysBudget: 80, daysActual: 62, photo: avatar("Hugo Tan") },
    ],
    monthly: makeMonthly(260000, 180000, 260000, 180000),
  },
  {
    id: "lumen",
    name: "Portail B2B Lumen",
    client: "Groupe Solaris",
    status: "closed",
    owner: "Adrien Faure",
    startDate: "2025-06-01",
    endDate: "2026-01-30",
    revenueBudget: 340000,
    revenueActual: 358000,
    costBudget: 240000,
    costActual: 222000,
    costs: [
      { id: "c1", label: "Équipe full-stack", category: "Ressources humaines", budget: 160000, actual: 152000 },
      { id: "c2", label: "Infra & SRE", category: "Infrastructure", budget: 48000, actual: 44000 },
      { id: "c3", label: "Audit sécurité", category: "Sous-traitance", budget: 32000, actual: 26000 },
    ],
    revenues: [
      { id: "r1", label: "Build", category: "Forfait", budget: 280000, actual: 298000 },
      { id: "r2", label: "Avenant scope", category: "Forfait", budget: 60000, actual: 60000 },
    ],
    resources: [
      { id: "h1", name: "Adrien Faure", role: "Lead", tjm: 1000, daysBudget: 110, daysActual: 108, photo: avatar("Adrien Faure") },
      { id: "h2", name: "Eva Mancini", role: "Dev Senior", tjm: 880, daysBudget: 120, daysActual: 116, photo: avatar("Eva Mancini") },
    ],
    monthly: makeMonthly(340000, 240000, 340000, 240000),
  },
];

export const categories = [
  { id: "rh", name: "Ressources humaines", type: "cost", color: "#a78bfa", count: 8, total: 642000 },
  { id: "infra", name: "Infrastructure", type: "cost", color: "#00d9ff", count: 4, total: 216000 },
  { id: "outils", name: "Outillage", type: "cost", color: "#f97316", count: 3, total: 75200 },
  { id: "sous", name: "Sous-traitance", type: "cost", color: "#ec4899", count: 3, total: 114800 },
  { id: "forfait", name: "Forfait", type: "revenue", color: "#22d3a8", count: 7, total: 1478000 },
  { id: "regie", name: "Régie", type: "revenue", color: "#facc15", count: 3, total: 232000 },
];

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export function fmtMoney(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function fmtPct(n: number) {
  return `${(n * 100).toFixed(0)}%`;
}