import { useEffect, useState } from "react";

// Labels and initial seeds for the live chart
const METRICS = [
  { label: "Threat Det.", color: "#22d3ee" },   // cyan
  { label: "Patch Rate",  color: "#34d399" },   // emerald
  { label: "Uptime",      color: "#a78bfa" },   // violet
  { label: "Incidents",   color: "#fb923c" },   // orange
  { label: "MTTD",        color: "#38bdf8" },   // sky
  { label: "MTTR",        color: "#4ade80" },   // green
];

function randomVal(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initialBars() {
  return METRICS.map(() => randomVal(30, 95));
}

// Sparkline points for "Threat Detection Trend" line chart
function generateSparkline(count = 24): number[] {
  const pts: number[] = [];
  let v = 50;
  for (let i = 0; i < count; i++) {
    v = Math.max(10, Math.min(95, v + (Math.random() - 0.48) * 18));
    pts.push(v);
  }
  return pts;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 100;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      {/* gradient fill under line */}
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill="url(#spark-fill)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* live dot at last point */}
      {(() => {
        const last = data[data.length - 1];
        const lx = w;
        const ly = h - ((last - min) / range) * (h - 4) - 2;
        return (
          <circle cx={lx} cy={ly} r="2.5" fill={color}>
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </circle>
        );
      })()}
    </svg>
  );
}

export default function DataAnalysisCard() {
  const [bars, setBars] = useState(initialBars);
  const [sparkline, setSparkline] = useState(() => generateSparkline(24));
  const [tick, setTick] = useState(0);

  // Bars update every 2.2s — smooth transition via CSS
  useEffect(() => {
    const id = setInterval(() => {
      setBars(METRICS.map((_, i) => {
        const current = bars[i];
        const delta = randomVal(-12, 12);
        return Math.max(15, Math.min(98, current + delta));
      }));
    }, 2200);
    return () => clearInterval(id);
  }, [bars]);

  // Sparkline shifts right every 1.5s (new data point appended)
  useEffect(() => {
    const id = setInterval(() => {
      setSparkline(prev => {
        const last = prev[prev.length - 1];
        const next = Math.max(10, Math.min(95, last + (Math.random() - 0.47) * 15));
        return [...prev.slice(1), next];
      });
      setTick(t => t + 1);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const liveValue = Math.round(sparkline[sparkline.length - 1]);

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-5 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Power BI · Live Feed</p>
          <h3 className="text-sm font-bold text-white mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Security Operations Dashboard
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ animation: "pulse 1.4s ease-in-out infinite" }}
          />
          LIVE
        </span>
      </div>

      {/* Sparkline — Threat Detection Trend */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest">Threat Detection Trend</span>
          <span className="text-[10px] font-mono text-cyan-300">{liveValue}%</span>
        </div>
        <Sparkline data={sparkline} color="#22d3ee" />
      </div>

      {/* Bar chart */}
      <div className="flex-1 flex flex-col justify-end gap-2 min-h-0">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">KPI Overview</span>
        <div className="flex items-end gap-2 h-24 w-full">
          {METRICS.map((m, i) => (
            <div key={m.label} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${bars[i]}%`,
                  backgroundColor: m.color,
                  opacity: 0.85,
                  boxShadow: `0 0 8px ${m.color}55`,
                  transition: "height 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              <span className="text-[8px] font-mono text-zinc-600 text-center leading-tight whitespace-nowrap">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer tick */}
      <div className="flex items-center justify-between shrink-0 pt-1 border-t border-zinc-800/60">
        <span className="text-[10px] font-mono text-zinc-600">Updated {tick}s ago</span>
        <span className="text-[10px] font-mono text-zinc-600">∆ {randomVal(1, 9)} events/min</span>
      </div>
    </div>
  );
}
