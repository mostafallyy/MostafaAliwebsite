import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import EarthScene from "@/components/EarthScene";
import SentryCard from "@/components/SentryCard";
import RscmsCard from "@/components/RscmsCard";
import DataAnalysisCard from "@/components/DataAnalysisCard";
import AiBookReaderCard from "@/components/AiBookReaderCard";
import PantryChefCard from "@/components/PantryChefCard";

// ─── Shared spring config ─────────────────────────────────────────────────────
const SP = { type: "spring", stiffness: 480, damping: 32, mass: 0.8 } as const;

// ─── Fonts ────────────────────────────────────────────────────────────────────
const DISPLAY = "'Space Grotesk', 'Inter', system-ui, sans-serif";
const MONO    = "'JetBrains Mono', 'Fira Code', monospace";

// ─── Hero subtitle lines ──────────────────────────────────────────────────────
const SUBTITLE_LINES = [
  "Mostafa Ali — Computer Science Student",
];

// ─── Fade-in line ─────────────────────────────────────────────────────────────
function FadeLine({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.span
      className="block"
      initial={{ opacity: 0, filter: "blur(10px)", y: 4 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {text}
    </motion.span>
  );
}

// ─── Resume card ──────────────────────────────────────────────────────────────
function ResumeCard() {
  return (
    <motion.div
      className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-md p-8 flex flex-col justify-between"
      initial={{ x: 240, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ ...SP, delay: 0 }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <div>
        <p
          className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-4"
          style={{ fontFamily: MONO }}
        >
          Résumé
        </p>

        <h3
          className="text-2xl font-bold text-white mb-5 tracking-tight"
          style={{ fontFamily: DISPLAY, fontWeight: 700 }}
        >
          Experience &amp; Skills
        </h3>

        <ul className="space-y-3 text-slate-400 text-sm" style={{ fontFamily: DISPLAY }}>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
            <span>
              <strong className="text-slate-300 font-semibold">Systems programming</strong>
              {" "}— C, low-level optimisation &amp; memory safety
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
            <span>
              <strong className="text-slate-300 font-semibold">Full-stack web</strong>
              {" "}— React, TypeScript, Node.js, Vite
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
            <span>
              <strong className="text-slate-300 font-semibold">Security &amp; compliance</strong>
              {" "}— static analysis, ISO/NIST standards, SIEM
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
            <span>
              <strong className="text-slate-300 font-semibold">Data analysis</strong>
              {" "}— Power BI, real-time dashboards, visualisation
            </span>
          </li>
        </ul>
      </div>

      <a
        href="/Mostafa_Ali_Resume_2026.pdf"
        download="Mostafa_Ali_Resume_2026.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-mono text-indigo-400 hover:text-indigo-300 transition-colors pointer-events-auto"
        style={{ fontFamily: MONO }}
      >
        Download PDF ↓
      </a>
    </motion.div>
  );
}

// ─── Name card ────────────────────────────────────────────────────────────────
function NameCard() {
  return (
    <motion.div
      className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-md p-8 flex flex-col justify-between"
      initial={{ x: -240, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ ...SP, delay: 0 }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <div>
        <p
          className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-4"
          style={{ fontFamily: MONO }}
        >
          Computer Science Student
        </p>

        <h2
          className="text-[clamp(3.5rem,10vw,6.5rem)] font-black leading-[0.9] text-white"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MOSTAFA
          </span>
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ALI
          </span>
        </h2>

        <p
          className="mt-4 text-slate-400 text-sm leading-snug"
          style={{ fontFamily: DISPLAY }}
        >
          Building fast, clean, and thoughtful software.
        </p>
      </div>

      <p
        className="text-slate-500 text-sm leading-relaxed mt-6"
        style={{ fontFamily: DISPLAY }}
      >
        C · Python · TypeScript · React
        <br />
        <span className="text-slate-600">Toronto, ON</span>
      </p>
    </motion.div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mostafa-ali-84520934a/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: "https://github.com/mostafallyy",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
    },
    {
      label: "mostafabali266@outlook.com",
      href: "mailto:mostafabali266@outlook.com",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative z-20 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md pb-0">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-600"
          style={{ fontFamily: MONO }}
        >
          © 2026 Mostafa Ali · Computer Science Student
        </span>

        <div className="flex items-center gap-6">
          {links.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors duration-200 text-xs font-mono group"
              style={{ fontFamily: MONO }}
            >
              <span className="group-hover:drop-shadow-[0_0_6px_rgba(129,140,248,0.7)] transition-all duration-200">
                {icon}
              </span>
              <span className="hidden md:inline">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scrollProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollProgress, "change", (v) => setProgress(Math.min(v, 1)));

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="relative" style={{ background: "#0d1117" }}>

      {/* ── Fixed Earth Canvas ── */}
      <div className="fixed inset-0 z-0">
        <EarthScene scrollProgress={progress} />
      </div>

      {/* ── Hero overlay ── */}
      <div className="fixed inset-0 z-10 pointer-events-none flex flex-col items-center justify-center px-6">
        <motion.div className="text-center max-w-4xl" style={{ opacity: heroOpacity }}>

          {/* Name */}
          <h1
            className="text-[clamp(4rem,14vw,10rem)] font-black leading-[0.85] tracking-[-0.03em] uppercase mb-8"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffffff 30%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <FadeLine text="MOSTAFA" delay={0.1} />
            <FadeLine text="ALI" delay={0.25} />
          </h1>

          {/* Subtitle */}
          <div
            className="text-base md:text-lg leading-relaxed tracking-[0.06em] border-t border-slate-700/60 pt-6"
            style={{
              fontFamily: DISPLAY,
              color: "rgba(203,213,225,0.9)",
              textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.6)",
            }}
          >
            {SUBTITLE_LINES.map((line, i) => (
              <FadeLine key={i} text={line} delay={0.45 + i * 0.12} />
            ))}
          </div>

          <motion.p
            className="mt-8 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 1 }}
            style={{ fontFamily: MONO }}
          >
            ↓ Scroll to explore
          </motion.p>
        </motion.div>
      </div>

      {/* ── Portfolio content ── */}
      <div className="relative z-20 pt-[100vh]">

        {/* === 1. Name ↔ Resume === */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-stretch">
            <NameCard />
            <ResumeCard />
          </div>
        </section>

        {/* === 2. Bento grid: projects === */}
        <section className="flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Row 1: RSCMS + Sentry */}
            <motion.div
              className="h-80"
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ ...SP, delay: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <RscmsCard />
            </motion.div>

            <motion.div
              className="h-80"
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ ...SP, delay: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <SentryCard />
            </motion.div>

            {/* Row 2: AI Book Reader + PantryChef */}
            <motion.div
              className="h-80"
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ ...SP, delay: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <AiBookReaderCard />
            </motion.div>

            <motion.div
              className="h-80"
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ ...SP, delay: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <PantryChefCard />
            </motion.div>

            {/* Row 3: Analytics — full width */}
            <motion.div
              className="md:col-span-2 h-72"
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ ...SP, delay: 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <DataAnalysisCard />
            </motion.div>

          </div>
        </section>

        {/* === Footer === */}
        <Footer />

      </div>
    </div>
  );
};

export default Index;
