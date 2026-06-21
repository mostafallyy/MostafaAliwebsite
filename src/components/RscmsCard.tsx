import { useEffect, useRef, useState } from "react";

const RSCMS_LINES = [
  "[RSCMS] Initializing compliance engine v3.1...",
  "[INFO]  Loading ISO/IEC 27001 control set...",
  "[RSCMS] Verifying MTTR/MTTD baseline values...",
  "        MTTR: 00:14:32  MTTD: 00:03:17      [OK]",
  "[INFO]  Auditing NIST CSF — Identify phase...",
  "        Asset inventory coverage: 98.4%       [OK]",
  "[INFO]  Auditing NIST CSF — Protect phase...",
  "        Access controls compliant: YES        [OK]",
  "[INFO]  Auditing NIST CSF — Detect phase...",
  "        SIEM rules active: 247/247            [OK]",
  "[RSCMS] Cross-referencing CIS Benchmark v8...",
  "        Critical controls passed: 18/20",
  "        WARNING: Control 4.1 — patch cadence",
  "[PASS]  Baseline Compliance Confirmed.",
  "[RSCMS] Report saved → /reports/audit-2025.pdf",
];

const CHAR_DELAY = 22;
const LINE_PAUSE = 500;
const RESTART_PAUSE = 2500;

function classifyLine(line: string) {
  if (line.includes("[PASS]")) return "text-emerald-400";
  if (line.includes("WARNING")) return "text-yellow-400";
  if (line.includes("[OK]")) return "text-cyan-400";
  if (line.startsWith("[RSCMS]")) return "text-blue-300";
  if (line.startsWith("[INFO]")) return "text-zinc-300";
  return "text-zinc-500";
}

export default function RscmsCard() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    let completed: string[] = [];

    function scheduleNext() {
      if (cancelled) return;
      const line = RSCMS_LINES[lineIdx];

      if (charIdx < line.length) {
        setTimeout(() => {
          if (cancelled) return;
          charIdx++;
          setCurrentLine(line.slice(0, charIdx));
          scheduleNext();
        }, CHAR_DELAY);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          completed = [...completed, line];
          setVisibleLines([...completed]);
          setCurrentLine("");
          charIdx = 0;
          lineIdx++;

          if (lineIdx >= RSCMS_LINES.length) {
            setTimeout(() => {
              if (cancelled) return;
              lineIdx = 0;
              completed = [];
              setVisibleLines([]);
              scheduleNext();
            }, RESTART_PAUSE);
          } else {
            scheduleNext();
          }
        }, LINE_PAUSE);
      }
    }

    scheduleNext();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines, currentLine]);

  return (
    <div className="relative flex flex-col h-full rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/40 bg-slate-800/80 shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-blue-500/80" />
        <span className="ml-2 text-xs text-slate-500 font-mono tracking-wide">rscms — compliance-audit.sh</span>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed scrollbar-none"
        style={{ minHeight: 0 }}
      >
        {visibleLines.map((line, i) => (
          <div key={i} className={classifyLine(line)}>
            {line}
          </div>
        ))}
        {currentLine && (
          <div className={classifyLine(RSCMS_LINES[visibleLines.length])}>
            {currentLine}
            <span className="animate-pulse text-blue-400">█</span>
          </div>
        )}
        {!currentLine && visibleLines.length < RSCMS_LINES.length && (
          <span className="text-blue-400 animate-pulse">█</span>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-700/40 bg-slate-800/60 shrink-0 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">RSCMS / ISO·NIST Compliance</span>
        <span className="text-[10px] font-mono text-blue-400/40">v3.1.0</span>
      </div>
    </div>
  );
}
