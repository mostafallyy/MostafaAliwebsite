import { useEffect, useRef, useState } from "react";

const LINES = [
  "$ python ai_book_reader.py Pride_and_Prejudice.pdf",
  "[INFO]  Loading Kokoro-82M TTS model...      [OK]",
  "[INFO]  Extracting text via PyMuPDF...",
  "        Pages parsed: 432 / 432              [OK]",
  "[INFO]  Detecting embedded images...",
  "        Found 12 images — querying Gemini 1.5 Flash",
  '        Image 3/12: "Victorian ballroom scene" [OK]',
  "[NLTK]  Sentence tokenisation complete.",
  "        847 sentences queued for synthesis",
  "[TTS]   Generating audio chunks (Kokoro-82M)...",
  '        Chunk 001/847: "It is a truth..."    [OK]',
  '        Chunk 002/847: "universally acknowledged..."',
  "[PLAY]  Producer-consumer pipeline: active",
  "        Buffer: 12 / 16 chunks prefetched",
  "[PLAY]  Gapless playback started ▶",
];

const CHAR_DELAY = 22;
const LINE_PAUSE = 520;
const RESTART_PAUSE = 2200;

function classifyLine(line: string) {
  if (line.includes("[OK]")) return "text-emerald-400";
  if (line.startsWith("$")) return "text-sky-300";
  if (line.startsWith("[PLAY]")) return "text-violet-400";
  if (line.startsWith("[TTS]")) return "text-indigo-300";
  if (line.startsWith("[INFO]") || line.startsWith("[NLTK]")) return "text-slate-300";
  if (line.startsWith("        ")) return "text-slate-400";
  return "text-slate-500";
}

export default function AiBookReaderCard() {
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
      const line = LINES[lineIdx];

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

          if (lineIdx >= LINES.length) {
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
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-slate-500 font-mono tracking-wide">ai-book-reader — tts_pipeline.py</span>
        <a
          href="https://github.com/mostafallyy/ai-book-reader"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[10px] font-mono text-slate-600 hover:text-indigo-400 transition-colors"
        >
          GitHub ↗
        </a>
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
          <div className={classifyLine(LINES[visibleLines.length])}>
            {currentLine}
            <span className="animate-pulse text-sky-300">█</span>
          </div>
        )}
        {!currentLine && visibleLines.length < LINES.length && (
          <span className="text-sky-300 animate-pulse">█</span>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-700/40 bg-slate-800/60 shrink-0 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">AI Book Reader / Kokoro-82M · Gemini</span>
        <span className="text-[10px] font-mono text-slate-500">Python · Streamlit</span>
      </div>
    </div>
  );
}
