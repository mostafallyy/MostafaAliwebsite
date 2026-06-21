import { useEffect, useRef, useState } from "react";

const AUDIT_LINES = [
  "> Initializing C security audit...",
  "> Scanning for buffer overflows in heap.c...",
  "> Checking malloc/free pairs...           [OK]",
  "> Analyzing pointer arithmetic in parser.c...",
  "  WARNING: potential out-of-bounds at line 247",
  "> Running use-after-free detection...",
  "  DETECTED: freed ptr accessed in net_recv() :312",
  "> Validating format string arguments...   [OK]",
  "> Checking integer overflow guards...",
  "  WARNING: unchecked cast (int32 → uint8) :89",
  "> Static analysis complete.",
  "> 2 warnings  |  1 critical  |  0 errors",
];

const CHAR_DELAY = 28;   // ms per character
const LINE_PAUSE = 600;  // ms pause after each line finishes
const RESTART_PAUSE = 2000; // ms before restarting from top

function classifyLine(line: string) {
  if (line.includes("DETECTED") || line.includes("critical")) return "text-red-400";
  if (line.includes("WARNING")) return "text-yellow-400";
  if (line.includes("[OK]")) return "text-emerald-400";
  if (line.startsWith(">")) return "text-green-300";
  return "text-zinc-400";
}

export default function SentryCard() {
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

      const line = AUDIT_LINES[lineIdx];

      if (charIdx < line.length) {
        // type next character
        setTimeout(() => {
          if (cancelled) return;
          charIdx++;
          setCurrentLine(line.slice(0, charIdx));
          scheduleNext();
        }, CHAR_DELAY);
      } else {
        // line complete — commit it, pause, then move to next
        setTimeout(() => {
          if (cancelled) return;
          completed = [...completed, line];
          setVisibleLines([...completed]);
          setCurrentLine("");
          charIdx = 0;
          lineIdx++;

          if (lineIdx >= AUDIT_LINES.length) {
            // restart after a longer pause
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

  // auto-scroll terminal to bottom
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
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-slate-500 font-mono tracking-wide">sentry — audit.sh</span>
        <a href="https://github.com/momo-Hendy/Sentry-Real-Time-Process-Auditor" target="_blank" rel="noopener noreferrer" className="ml-auto text-[10px] font-mono text-slate-600 hover:text-indigo-400 transition-colors">GitHub ↗</a>
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
        {/* current typing line */}
        {currentLine && (
          <div className={classifyLine(AUDIT_LINES[visibleLines.length])}>
            {currentLine}
            <span className="animate-pulse">█</span>
          </div>
        )}
        {/* idle cursor when between lines */}
        {!currentLine && visibleLines.length < AUDIT_LINES.length && (
          <span className="text-green-300 animate-pulse">█</span>
        )}
      </div>

      {/* Footer badge */}
      <div className="px-4 py-2 border-t border-slate-700/40 bg-slate-800/60 shrink-0 flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Sentry / C Security Audit</span>
        <span className="text-[10px] font-mono text-zinc-600">v2.4.1</span>
      </div>
    </div>
  );
}
