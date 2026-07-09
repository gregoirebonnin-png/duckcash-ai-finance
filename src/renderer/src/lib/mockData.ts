import type { Project, Category, LineItem, Resource } from '../types'

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-summit-2024',
    name: 'Summit Tech 2024',
    description: 'Conférence technologique annuelle — 500 participants',
    type: 'event',
    currency: 'EUR',
    created_at: '2024-01-15T10:00:00.000Z',
    user_id: 'demo-user'
  },
  {
    id: 'proj-transfo-digitale',
    name: 'Mission Transformation Digitale',
    description: "Accompagnement transformation digitale — Groupe Leclerc",
    type: 'project',
    currency: 'EUR',
    created_at: '2024-02-01T09:00:00.000Z',
    user_id: 'demo-user'
  }
]

export const MOCK_CATEGORIES: Category[] = [
  // Summit Tech 2024 — costs
  { id: 'cat-production', project_id: 'proj-summit-2024', name: 'Production', type: 'cost', color: '#6366f1', budget: 12000 },
  { id: 'cat-technique', project_id: 'proj-summit-2024', name: 'Technique', type: 'cost', color: '#f43f5e', budget: 18000 },
  { id: 'cat-lieu', project_id: 'proj-summit-2024', name: 'Lieu', type: 'cost', color: '#f59e0b', budget: 20000 },
  { id: 'cat-catering', project_id: 'proj-summit-2024', name: 'Catering', type: 'cost', color: '#10b981', budget: 14000 },
  { id: 'cat-speakers', project_id: 'proj-summit-2024', name: 'Speakers', type: 'cost', color: '#3b82f6', budget: 10000 },
  { id: 'cat-communication', project_id: 'proj-summit-2024', name: 'Communication', type: 'cost', color: '#8b5cf6', budget: 6000 },
  // Summit Tech 2024 — revenues
  { id: 'cat-billets', project_id: 'proj-summit-2024', name: 'Billets', type: 'revenue', color: '#10b981', budget: 110000 },
  { id: 'cat-sponsoring', project_id: 'proj-summit-2024', name: 'Sponsoring', type: 'revenue', color: '#6366f1', budget: 30000 },
  { id: 'cat-partenariats', project_id: 'proj-summit-2024', name: 'Partenariats', type: 'revenue', color: '#f59e0b', budget: 8000 },
  // Mission Transformation Digitale — costs
  { id: 'cat-conseil', project_id: 'proj-transfo-digitale', name: 'Conseil & Expertise', type: 'cost', color: '#6366f1', budget: 55000 },
  { id: 'cat-tech-td', project_id: 'proj-transfo-digitale', name: 'Développement', type: 'cost', color: '#f43f5e', budget: 30000 },
  { id: 'cat-formation', project_id: 'proj-transfo-digitale', name: 'Formation', type: 'cost', color: '#f59e0b', budget: 10000 },
  // Mission Transformation Digitale — revenues
  { id: 'cat-honoraires', project_id: 'proj-transfo-digitale', name: 'Honoraires', type: 'revenue', color: '#10b981', budget: 100000 },
  { id: 'cat-licences', project_id: 'proj-transfo-digitale', name: 'Licences & Outils', type: 'revenue', color: '#3b82f6', budget: 10000 }
]

export const MOCK_LINE_ITEMS: LineItem[] = [
  // Summit Tech 2024 — Production
  { id: 'li-prod-01', category_id: 'cat-production', project_id: 'proj-summit-2024', description: 'Régie générale événement', amount: 8500, date: '2024-03-10', notes: 'Société Scène & Co' },
  { id: 'li-prod-02', category_id: 'cat-production', project_id: 'proj-summit-2024', description: 'Impression badges & signalétique', amount: 1200, date: '2024-03-15', notes: '500 badges + kakémonos' },
  // Summit Tech 2024 — Technique
  { id: 'li-tech-01', category_id: 'cat-technique', project_id: 'proj-summit-2024', description: 'Location son & lumière', amount: 12000, date: '2024-03-01', notes: 'AudioTech Pro' },
  { id: 'li-tech-02', category_id: 'cat-technique', project_id: 'proj-summit-2024', description: 'Streaming live & captation vidéo', amount: 4500, date: '2024-03-05', notes: 'Retransmission YouTube' },
  { id: 'li-tech-03', category_id: 'cat-technique', project_id: 'proj-summit-2024', description: 'WiFi renforcé salle', amount: 2800, date: '2024-03-08', notes: 'Réseau dédié 1 Gbps' },
  // Summit Tech 2024 — Lieu
  { id: 'li-lieu-01', category_id: 'cat-lieu', project_id: 'proj-summit-2024', description: 'Location Palais des Congrès — 2 jours', amount: 22000, date: '2024-02-01', notes: 'Salle plénière + 4 salles atelier' },
  // Summit Tech 2024 — Catering
  { id: 'li-cat-01', category_id: 'cat-catering', project_id: 'proj-summit-2024', description: 'Déjeuner J1 — 500 couverts', amount: 7500, date: '2024-03-20', notes: 'Traiteur Saveurs & Sens' },
  { id: 'li-cat-02', category_id: 'cat-catering', project_id: 'proj-summit-2024', description: 'Cocktail dînatoire J1 soir', amount: 4800, date: '2024-03-20', notes: '200 personnes VIP' },
  { id: 'li-cat-03', category_id: 'cat-catering', project_id: 'proj-summit-2024', description: 'Pauses café & collations — 2 jours', amount: 3200, date: '2024-03-21' },
  // Summit Tech 2024 — Speakers
  { id: 'li-spk-01', category_id: 'cat-speakers', project_id: 'proj-summit-2024', description: 'Keynote speaker principal', amount: 8000, date: '2024-03-15', notes: 'Frais + honoraires' },
  { id: 'li-spk-02', category_id: 'cat-speakers', project_id: 'proj-summit-2024', description: 'Frais de déplacement & hébergement speakers', amount: 3500, date: '2024-03-20', notes: '12 speakers' },
  // Summit Tech 2024 — Communication
  { id: 'li-com-01', category_id: 'cat-communication', project_id: 'proj-summit-2024', description: 'Campagne Social Media & SEA', amount: 5000, date: '2024-02-10' },
  { id: 'li-com-02', category_id: 'cat-communication', project_id: 'proj-summit-2024', description: 'Design graphique site & supports', amount: 2200, date: '2024-02-15', notes: 'Agence Pixel Storm' },
  // Summit Tech 2024 — Revenus Billets
  { id: 'li-bil-01', category_id: 'cat-billets', project_id: 'proj-summit-2024', description: 'Pass 2 jours — 350 billets × 250€', amount: 87500, date: '2024-03-21' },
  { id: 'li-bil-02', category_id: 'cat-billets', project_id: 'proj-summit-2024', description: 'Pass VIP — 50 billets × 600€', amount: 30000, date: '2024-03-21' },
  // Summit Tech 2024 — Revenus Sponsoring
  { id: 'li-spo-01', category_id: 'cat-sponsoring', project_id: 'proj-summit-2024', description: 'Sponsor platine — TechCorp', amount: 20000, date: '2024-01-20' },
  { id: 'li-spo-02', category_id: 'cat-sponsoring', project_id: 'proj-summit-2024', description: 'Sponsor or — DataSoft & CloudBase', amount: 16000, date: '2024-01-25', notes: '2 × 8 000€' },
  // Summit Tech 2024 — Revenus Partenariats
  { id: 'li-par-01', category_id: 'cat-partenariats', project_id: 'proj-summit-2024', description: 'Partenariat média — TechMag', amount: 5000, date: '2024-02-05', notes: 'Visibilité + article dédié' },
  // Mission Transformation Digitale — Coûts
  { id: 'li-cons-01', category_id: 'cat-conseil', project_id: 'proj-transfo-digitale', description: 'Direction de mission — 15j', amount: 22500, date: '2024-02-10', notes: '1 500€/j' },
  { id: 'li-cons-02', category_id: 'cat-conseil', project_id: 'proj-transfo-digitale', description: 'Consultants seniors — 30j', amount: 27000, date: '2024-02-15', notes: '900€/j × 30j' },
  { id: 'li-dev-01', category_id: 'cat-tech-td', project_id: 'proj-transfo-digitale', description: 'Développement plateforme digitale', amount: 35000, date: '2024-03-01', notes: 'Sprint 1–4' },
  { id: 'li-form-01', category_id: 'cat-formation', project_id: 'proj-transfo-digitale', description: 'Ateliers formation équipes — 5 sessions', amount: 12500, date: '2024-04-10', notes: '2 500€/session' },
  // Mission Transformation Digitale — Revenus
  { id: 'li-hon-01', category_id: 'cat-honoraires', project_id: 'proj-transfo-digitale', description: 'Honoraires phase diagnostic', amount: 30000, date: '2024-02-28' },
  { id: 'li-hon-02', category_id: 'cat-honoraires', project_id: 'proj-transfo-digitale', description: 'Honoraires phase implémentation', amount: 75000, date: '2024-04-30' },
  { id: 'li-lic-01', category_id: 'cat-licences', project_id: 'proj-transfo-digitale', description: 'Refacturation licences SaaS — an 1', amount: 8400, date: '2024-03-15', notes: 'Marge revendue client' }
]

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res-01',
    project_id: 'proj-summit-2024',
    name: 'Sophie Marchand',
    role: 'Directrice de production',
    daily_rate: 750,
    days: 15,
    currency: 'EUR'
  },
  {
    id: 'res-02',
    project_id: 'proj-summit-2024',
    name: 'Antoine Leroux',
    role: 'Chef de projet événementiel',
    daily_rate: 650,
    days: 20,
    currency: 'EUR'
  },
  {
    id: 'res-03',
    project_id: 'proj-summit-2024',
    name: 'Camille Rousseau',
    role: 'Communication & Marketing',
    daily_rate: 550,
    days: 10,
    currency: 'EUR'
  },
  {
    id: 'res-04',
    project_id: 'proj-transfo-digitale',
    name: 'Marc Dupont',
    role: 'Partner / Directeur de mission',
    daily_rate: 1500,
    days: 15,
    currency: 'EUR'
  },
  {
    id: 'res-05',
    project_id: 'proj-transfo-digitale',
    name: 'Julie Bernard',
    role: 'Consultante senior',
    daily_rate: 900,
    days: 30,
    currency: 'EUR'
  },
  {
    id: 'res-06',
    project_id: 'proj-transfo-digitale',
    name: 'Thomas Klein',
    role: 'Lead Développeur',
    daily_rate: 800,
    days: 45,
    currency: 'EUR'
  }
]
