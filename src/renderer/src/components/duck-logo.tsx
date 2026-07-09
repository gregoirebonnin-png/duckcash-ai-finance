import { cn } from "../lib/utils";

export function DuckLogo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full opacity-60 blur-xl bg-gradient-ai"
        aria-hidden
      />
      <svg viewBox="0 0 48 48" width={size} height={size} className="relative">
        <defs>
          <linearGradient id="duckBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00d9ff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="duckBeak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {/* Body */}
        <path
          d="M14 30c0-7 5-12 12-12s12 5 12 12c0 4-2 6-2 6H16s-2-2-2-6z"
          fill="url(#duckBody)"
        />
        {/* Head */}
        <circle cx="32" cy="18" r="8" fill="url(#duckBody)" />
        {/* Eye */}
        <circle cx="34" cy="16" r="1.6" fill="#08090c" />
        <circle cx="34.6" cy="15.4" r="0.5" fill="#fff" />
        {/* Beak */}
        <path d="M38 18c4 0 7 1.4 7 3s-3 3-7 3v-6z" fill="url(#duckBeak)" />
      </svg>
    </div>
  );
}

export function SparkleIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="55%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l1.8 5.6L19.4 9.4 13.8 11.2 12 16.8 10.2 11.2 4.6 9.4l5.6-1.8L12 2zM18.5 14l.9 2.6L22 17.5l-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"
        fill="url(#sparkGrad)"
      />
    </svg>
  );
}