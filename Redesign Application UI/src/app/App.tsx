import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  LayoutDashboard, FolderOpen, Tag, Users, Plus, ArrowRight,
  TrendingUp, Pencil, Trash2, ChevronRight, ArrowUpRight,
} from "lucide-react";

type Page = "dashboard" | "projets" | "categories" | "ressources";

// ─── data ────────────────────────────────────────────────────────────────────

const barData = [
  { name: "LPC Paris 2026", revenus: 158500, couts: 115000 },
  { name: "Mission Transform.", revenus: 113400, couts: 96950 },
];

const donut = [
  { name: "Conseil & Expertise", value: 49500, pct: "27.2%", color: "#00d9ff" },
  { name: "Développement",       value: 35000, pct: "19.2%", color: "#ff9500" },
  { name: "Lieu",                value: 22000, pct: "12.1%", color: "#ffd600" },
  { name: "Technique",           value: 19300, pct: "10.6%", color: "#00e676" },
  { name: "Catering",            value: 15500, pct: "8.5%",  color: "#ff4757" },
  { name: "Formation",           value: 12500, pct: "6.9%",  color: "#26de81" },
  { name: "Speakers",            value: 11500, pct: "6.3%",  color: "#fd9644" },
  { name: "Production",          value: 9700,  pct: "5.3%",  color: "#00b4d8" },
  { name: "Communication",       value: 7200,  pct: "4.0%",  color: "#ff6b81" },
];

const projects = [
  {
    id: 1,
    name: "LPC Paris 2026",
    desc: "Conférence technologique annuelle — 1300 participants",
    type: "Événement",
    revenus: "158,5k €",
    resultat: "+43,5k €",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=320&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Mission Transformation Digitale",
    desc: "Accompagnement transformation digitale — Groupe Leclerc",
    type: "Projet",
    revenus: "113,4k €",
    resultat: "+16,4k €",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=320&fit=crop&auto=format",
  },
];

const cats = {
  couts: [
    { name: "Production",           project: "LPC Paris 2026",                 color: "#ff4757", icon: "⚙️" },
    { name: "Technique",            project: "LPC Paris 2026",                 color: "#00d9ff", icon: "🔧" },
    { name: "Lieu",                 project: "LPC Paris 2026",                 color: "#ffd600", icon: "📍" },
    { name: "Catering",             project: "LPC Paris 2026",                 color: "#ff9500", icon: "🍽️" },
    { name: "Speakers",             project: "LPC Paris 2026",                 color: "#00e676", icon: "🎤" },
    { name: "Communication",        project: "LPC Paris 2026",                 color: "#fd9644", icon: "📢" },
    { name: "Formation",            project: "Mission Transformation Digitale", color: "#26de81", icon: "📚" },
    { name: "Conseil & Expertise",  project: "Mission Transformation Digitale", color: "#00b4d8", icon: "💼" },
    { name: "Développement",        project: "Mission Transformation Digitale", color: "#ff6b81", icon: "💻" },
  ],
  revenus: [
    { name: "Billets",              project: "LPC Paris 2026",                 color: "#00d9ff", icon: "🎫" },
    { name: "Sponsoring",           project: "LPC Paris 2026",                 color: "#ffd600", icon: "🤝" },
    { name: "Partenariats",         project: "LPC Paris 2026",                 color: "#00e676", icon: "🌟" },
    { name: "Honoraires",           project: "Mission Transformation Digitale", color: "#ff9500", icon: "💰" },
    { name: "Licences & Outils",    project: "Mission Transformation Digitale", color: "#fd9644", icon: "🔑" },
  ],
};

const resources = [
  { name: "Sophie Marchand",  role: "Directrice de production",    project: "LPC Paris 2026", tjm: 750, jours: 15, total: 11250 },
  { name: "Antoine Leroux",   role: "Chef de projet événementiel", project: "LPC Paris 2026", tjm: 650, jours: 20, total: 13000 },
  { name: "Camille Rousseau", role: "Communication & Marketing",   project: "LPC Paris 2026", tjm: 550, jours: 10, total: 5500  },
];

function fmt(n: number) {
  return n.toLocaleString("fr-FR") + " €";
}

function glow(color: string) {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px ${color}30, 0 8px 32px ${color}25, 0 0 60px ${color}12`;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.boxShadow = "";
    },
  };
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────

function TopNav({ page, setPage, scrolled }: { page: Page; setPage: (p: Page) => void; scrolled: boolean }) {
  const nav = [
    { id: "dashboard"  as Page, label: "Dashboard",  icon: LayoutDashboard },
    { id: "projets"    as Page, label: "Projets",    icon: FolderOpen },
    { id: "categories" as Page, label: "Catégories", icon: Tag },
    { id: "ressources" as Page, label: "Ressources", icon: Users },
  ];

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300"
      style={scrolled ? {
        background: "rgba(7, 10, 13, 0.80)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
      } : {}}
    >
      {/* Logo — left */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "#00d9ff", boxShadow: "0 0 16px rgba(0,217,255,0.45)" }}
        >
          <TrendingUp size={15} style={{ color: "#040d10" }} />
        </div>
        <span className="font-bold text-sm tracking-tight text-foreground">P&L Tool</span>
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest border"
          style={{ background: "rgba(0,217,255,0.12)", color: "#00d9ff", borderColor: "rgba(0,217,255,0.2)" }}
        >
          DEMO
        </span>
      </div>

      {/* Smoked glass pill nav — center */}
      <nav
        className="flex items-center gap-1 px-2 py-2 rounded-2xl"
        style={{
          background: "rgba(12, 16, 20, 0.70)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={page === n.id ? {
              background: "rgba(0,217,255,0.15)",
              color: "#00d9ff",
              boxShadow: "inset 0 0 0 1px rgba(0,217,255,0.25)",
            } : {}}
          >
            <n.icon
              size={15}
              strokeWidth={page === n.id ? 2.5 : 2}
              className={page === n.id ? "" : "text-muted-foreground"}
            />
            <span className={page === n.id ? "" : "text-muted-foreground hover:text-foreground"}>
              {n.label}
            </span>
          </button>
        ))}
      </nav>

      {/* User — right */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, #00d9ff, #00b4d8)",
            color: "#040d10",
            boxShadow: "0 0 16px rgba(0,217,255,0.3)",
          }}
        >
          G
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold leading-tight">Grégoire Bonnin</p>
          <p className="text-xs text-muted-foreground">Mode démo</p>
        </div>
      </div>
    </header>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, glowColor, up, trend }: {
  label: string; value: string; sub: string; glowColor: string; up: boolean; trend: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:border-white/15 transition-all duration-300" {...glow(glowColor)}>
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{ background: glowColor }}
      />
      <p className="relative text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <div className="relative">
        <p className="text-2xl font-extrabold tracking-tight leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
      </div>
      <div className="relative">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={up
            ? { background: "rgba(0,230,118,0.12)", color: "#00e676" }
            : { background: "rgba(255,71,87,0.12)",  color: "#ff4757" }
          }
        >
          {up ? "▲" : "▼"} {trend}
        </span>
      </div>
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs shadow-2xl">
      <p className="font-semibold mb-1.5 text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
          {p.name}: <span className="text-foreground font-medium">{(p.value / 1000).toFixed(0)}k €</span>
        </p>
      ))}
    </div>
  );
};

function Dashboard() {
  return (
    <div className="p-8 space-y-7">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Mode démo — données fictives</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Revenus"      value="271,9k €"   sub="271 900 €"       glowColor="#00d9ff" up={true}  trend="12%" />
        <KpiCard label="Coûts"        value="211,9k €"   sub="211 950 €"       glowColor="#ff4757" up={false} trend="8%"  />
        <KpiCard label="Résultat net" value="60,0k €"    sub="59 950 €"        glowColor="#00e676" up={true}  trend="15%" />
        <KpiCard label="Marge"        value="+22.0%"     sub="sur les revenus"  glowColor="#ffd600" up={true}  trend="3%"  />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300" {...glow("#00d9ff")}>
          <h3 className="font-bold text-base">Revenus vs Coûts par projet</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-5">Comparaison financière par projet</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={barData} barGap={8} barCategoryGap="35%">
              <XAxis dataKey="name" tick={{ fill: "#546070", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#546070", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="revenus" name="Revenus" fill="#00d9ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="couts"   name="Coûts"   fill="#ff4757" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#00d9ff" }} />Revenus
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#ff4757" }} />Coûts
            </span>
          </div>
        </div>

        {/* Donut */}
        <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300" {...glow("#ff9500")}>
          <h3 className="font-bold text-base">Répartition des coûts</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">Par catégorie de dépenses</p>
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0">
              <PieChart width={140} height={140}>
                <Pie data={donut} cx={70} cy={70} innerRadius={42} outerRadius={66} dataKey="value" stroke="none">
                  {donut.map((e) => <Cell key={`donut-${e.name}`} fill={e.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="flex-1 space-y-1.5 overflow-hidden">
              {donut.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="font-semibold text-foreground flex-shrink-0">{c.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300" {...glow("#00e676")}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base">Projets récents</h3>
          <button className="text-xs flex items-center gap-1 transition-colors" style={{ color: "#00d9ff" }}>
            Voir tout <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{p.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">{p.revenus}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#00e676" }}>{p.resultat}</p>
              </div>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 border"
                style={p.type === "Événement"
                  ? { background: "rgba(0,217,255,0.12)", color: "#00d9ff", borderColor: "rgba(0,217,255,0.2)" }
                  : { background: "rgba(255,149,0,0.12)",  color: "#ff9500",  borderColor: "rgba(255,149,0,0.2)" }
                }
              >
                {p.type}
              </span>
              <ChevronRight size={15} className="text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Projets ─────────────────────────────────────────────────────────────────

function Projets() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Projets</h1>
          <p className="text-sm text-muted-foreground mt-1">2 projets actifs</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold active:scale-[0.98] transition-all"
          style={{ background: "#00d9ff", color: "#040d10", boxShadow: "0 0 20px rgba(0,217,255,0.3)" }}
        >
          <Plus size={15} />Nouveau projet
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden h-48 bg-muted">
        <img
          src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400&h=400&fit=crop&auto=format"
          alt="Projets en cours"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 flex items-center px-10">
          <div>
            <p className="text-2xl font-extrabold tracking-tight">Gérez vos projets</p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              Suivez revenus, coûts et résultats pour chaque projet en temps réel.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-card border border-border rounded-2xl overflow-hidden group transition-all duration-300"
            {...glow("#00d9ff")}
          >
            <div className="relative h-48 overflow-hidden bg-muted">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span
                  className="text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border"
                  style={p.type === "Événement"
                    ? { background: "rgba(0,217,255,0.2)", color: "#7ef8ff", borderColor: "rgba(0,217,255,0.3)" }
                    : { background: "rgba(255,149,0,0.2)",  color: "#ffd080",  borderColor: "rgba(255,149,0,0.3)" }
                  }
                >
                  {p.type}
                </span>
                <div className="flex items-center gap-1.5">
                  <button className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
                    <Pencil size={11} className="text-white" />
                  </button>
                  <button className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
                    <Trash2 size={11} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-base leading-tight">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">EUR</p>
                  <p className="text-base font-extrabold mt-0.5">
                    {p.revenus}{" "}
                    <span className="text-sm font-semibold" style={{ color: "#00e676" }}>{p.resultat}</span>
                  </p>
                </div>
                <button
                  className="flex items-center gap-1.5 text-sm font-bold hover:gap-3 transition-all duration-200"
                  style={{ color: "#00d9ff" }}
                >
                  Voir <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Catégories ──────────────────────────────────────────────────────────────

function CatCard({ name, project, color, icon }: { name: string; project: string; color: string; icon: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3.5 hover:border-white/15 hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer" {...glow(color)}>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: color + "20", boxShadow: `0 0 18px ${color}25` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{project}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
          <Pencil size={11} className="text-muted-foreground" />
        </button>
        <button className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
          <Trash2 size={11} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function Categories() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Catégories</h1>
          <p className="text-sm text-muted-foreground mt-1">Vue globale des catégories de tous vos projets</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold active:scale-[0.98] transition-all"
          style={{ background: "#00d9ff", color: "#040d10", boxShadow: "0 0 20px rgba(0,217,255,0.3)" }}
        >
          <Plus size={15} />Nouvelle catégorie
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden h-36 bg-muted">
        <img
          src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&h=300&fit=crop&auto=format"
          alt="Catégories"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(7,10,13,0.95) 0%, rgba(7,10,13,0.6) 60%, rgba(0,217,255,0.1) 100%)" }} />
        <div className="absolute inset-0 flex items-center px-8 gap-8">
          <div>
            <p className="text-lg font-bold">
              <span style={{ color: "#ff4757" }}>{cats.couts.length}</span> coûts ·{" "}
              <span style={{ color: "#00e676" }}>{cats.revenus.length}</span> revenus
            </p>
            <p className="text-xs text-muted-foreground mt-1">Organisez vos flux financiers par catégorie</p>
          </div>
          <div className="ml-auto opacity-70">
            <PieChart width={80} height={80}>
              <Pie data={donut.slice(0, 5)} cx={40} cy={40} innerRadius={22} outerRadius={36} dataKey="value" stroke="none">
                {donut.slice(0, 5).map((e) => <Cell key={`mini-${e.name}`} fill={e.color} />)}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full" style={{ background: "#ff4757" }} />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Coûts ({cats.couts.length})
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {cats.couts.map((c) => <CatCard key={c.name} {...c} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full" style={{ background: "#00e676" }} />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Revenus ({cats.revenus.length})
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {cats.revenus.map((c) => <CatCard key={c.name} {...c} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Ressources ──────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

const avatarStyles = [
  { background: "linear-gradient(135deg, #00d9ff, #00b4d8)", color: "#040d10" },
  { background: "linear-gradient(135deg, #ff9500, #ff6b35)", color: "#040d10" },
  { background: "linear-gradient(135deg, #00e676, #26de81)", color: "#040d10" },
];

function Ressources() {
  const total = resources.reduce((s, r) => s + r.total, 0);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Ressources</h1>
          <p className="text-sm text-muted-foreground mt-1">Vue globale de toutes les ressources</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold active:scale-[0.98] transition-all"
          style={{ background: "#00d9ff", color: "#040d10", boxShadow: "0 0 20px rgba(0,217,255,0.3)" }}
        >
          <Plus size={15} />Ajouter une ressource
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-3.5 border-b border-border bg-muted/30">
          {["Nom", "Projet", "TJM", "Jours", "Coût total"].map((h) => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{h}</p>
          ))}
        </div>

        {resources.map((r, i) => (
          <div
            key={r.name}
            className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-all duration-300 group ${
              i < resources.length - 1 ? "border-b border-border" : ""
            }`}
            {...glow(avatarStyles[i % avatarStyles.length].background.includes("00d9ff") ? "#00d9ff" : avatarStyles[i % avatarStyles.length].background.includes("ff9500") ? "#ff9500" : "#00e676")}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md"
                style={avatarStyles[i % avatarStyles.length]}
              >
                {initials(r.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground truncate">{r.role}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{r.project}</p>
            <p className="text-sm font-mono font-medium">{fmt(r.tjm)}</p>
            <p className="text-sm font-mono font-medium">{r.jours}j</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono" style={{ color: "#ff4757" }}>{fmt(r.total)}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Pencil size={11} className="text-muted-foreground" />
                </button>
                <button className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Trash2 size={11} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 border-t border-border bg-muted/30">
          <p className="col-span-4 text-sm font-semibold text-muted-foreground">Coût total toutes ressources</p>
          <p className="text-base font-extrabold font-mono" style={{ color: "#ff4757" }}>{fmt(total)}</p>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden h-44 bg-muted">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=360&fit=crop&auto=format"
          alt="Équipe au travail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 flex items-center px-10 gap-6">
          <div>
            <p className="text-xl font-extrabold tracking-tight">Votre équipe, au complet</p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              Suivez les TJM, jours alloués et coûts de chaque ressource en temps réel.
            </p>
          </div>
          <button className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-white/5 transition-colors flex-shrink-0">
            Voir le rapport <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="dark min-h-screen bg-background"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <TopNav page={page} setPage={setPage} scrolled={scrolled} />
      <main ref={mainRef} className="pt-24 overflow-y-auto h-screen" style={{ scrollbarWidth: "none" }}>
        {page === "dashboard"   && <Dashboard />}
        {page === "projets"     && <Projets />}
        {page === "categories"  && <Categories />}
        {page === "ressources"  && <Ressources />}
      </main>
    </div>
  );
}
