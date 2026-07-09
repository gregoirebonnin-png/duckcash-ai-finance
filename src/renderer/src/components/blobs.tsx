export function Blobs({ density = "high" }: { density?: "high" | "low" }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full blur-3xl opacity-30 animate-blob-a"
        style={{ background: "radial-gradient(circle at 30% 30%, #a78bfa, transparent 60%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-25 animate-blob-b"
        style={{ background: "radial-gradient(circle at 50% 50%, #ec4899, transparent 60%)" }}
      />
      <div
        className="absolute bottom-[-180px] left-1/3 h-[560px] w-[560px] rounded-full blur-3xl opacity-20 animate-blob-c"
        style={{ background: "radial-gradient(circle at 60% 40%, #00d9ff, transparent 60%)" }}
      />
      {density === "high" && (
        <div
          className="absolute top-10 right-1/4 h-[380px] w-[380px] rounded-full blur-3xl opacity-15 animate-blob-c"
          style={{ background: "radial-gradient(circle at 50% 50%, #f97316, transparent 60%)" }}
        />
      )}
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
    </div>
  );
}