import { cn } from "../lib/utils";
import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// ─── Santé financière ─────────────────────────────────────────────────────────
// Score = marge réelle / marge budgétée (en %)
// Prend en compte coûts ET revenus — si les deux augmentent, la marge reste saine.

export type HealthLevel = "good" | "warning" | "risk"

export type HealthResult = {
  score: number        // 0-100+, réalisation de la marge budgétée
  level: HealthLevel
  label: string
  color: string        // CSS color for charts/bars
}

export function computeHealth(
  revenueActual: number,
  costActual: number,
  revenueBudget: number,
  costBudget: number,
): HealthResult {
  const budgetMargin = revenueBudget - costBudget
  const actualMargin = revenueActual - costActual

  // Si pas de marge budgétée, on se base sur le ratio coût/revenu
  let score: number
  if (budgetMargin <= 0) {
    score = revenueActual > 0 ? Math.max(0, ((revenueActual - costActual) / revenueActual) * 100) : 0
  } else {
    score = Math.max(0, (actualMargin / budgetMargin) * 100)
  }

  let level: HealthLevel
  let label: string
  let color: string
  if (score >= 90) {
    level = "good"; label = "En cours"; color = "#22d3a8"
  } else if (score >= 70) {
    level = "warning"; label = "Attention"; color = "#facc15"
  } else {
    level = "risk"; label = "À risque"; color = "#f87171"
  }

  return { score, level, label, color }
}

export function GlassCard({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "violet" | "pink" | "orange" | "green" | "none";
}) {
  const glowColor: Record<string, string> = {
    cyan: "rgba(0,217,255,0.18)",
    violet: "rgba(167,139,250,0.20)",
    pink: "rgba(236,72,153,0.18)",
    orange: "rgba(249,115,22,0.18)",
    green: "rgba(34,211,168,0.18)",
    none: "transparent",
  };
  const g = glow ?? "none";
  return (
    <div className={cn("relative rounded-2xl glass p-5", className)}>
      {g !== "none" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px -z-10 rounded-2xl blur-2xl opacity-70"
          style={{ background: `radial-gradient(60% 80% at 30% 0%, ${glowColor[g]}, transparent 60%)` }}
        />
      )}
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  hint,
  glow = "cyan",
  icon,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  hint?: string;
  glow?: "cyan" | "violet" | "pink" | "orange" | "green";
  icon?: ReactNode;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <GlassCard glow={glow} className="overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-[28px] font-semibold tracking-tight tabular-nums">{value}</div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[12px]">
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
              positive ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </GlassCard>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(160, Math.max(0, (value / max) * 100));
  const color =
    pct < 85 ? "#22d3a8" : pct <= 100 ? "#facc15" : "#f87171";
  return (
    <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/6">
      <div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ width: `${Math.min(100, pct)}%`, background: color, boxShadow: `0 0 8px ${color}80` }}
      />
      {pct > 100 && (
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: "100%",
            width: `${Math.min(60, pct - 100)}%`,
            transform: "translateX(-100%)",
            background: "repeating-linear-gradient(90deg, #f87171 0 4px, transparent 4px 8px)",
          }}
        />
      )}
    </div>
  );
}

type StatusBadgeProps = {
  status: "active" | "at-risk" | "closed"
  revenueActual?: number
  costActual?: number
  revenueBudget?: number
  costBudget?: number
}

export function StatusBadge({ status, revenueActual = 0, costActual = 0, revenueBudget = 0, costBudget = 0 }: StatusBadgeProps) {
  if (status === "closed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium bg-white/5 text-muted-foreground border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
        Clôturé
      </span>
    )
  }

  const { level, label } = computeHealth(revenueActual, costActual, revenueBudget, costBudget)
  const cls = {
    good:    "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-400/20",
    risk:    "bg-red-500/10 text-red-400 border-red-400/20",
  }[level]

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-brand" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-[28px] font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}