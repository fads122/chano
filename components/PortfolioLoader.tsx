"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";

const BOOT_LINES = [
  "clm.portfolio.init()",
  "mounting lanyard physics…",
  "hydrating components…",
  "compiling experience[]…",
  "ready.",
] as const;

export default function PortfolioLoader() {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [typedLine, setTypedLine] = useState("");

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) return 100;
        const step = value < 55 ? 2.4 : value < 85 ? 1.2 : 0.55;
        return Math.min(100, value + step);
      });
    }, 40);

    return () => window.clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const fullLine = BOOT_LINES[lineIndex] ?? "";
    let charIndex = 0;
    setTypedLine("");

    const typeTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedLine(fullLine.slice(0, charIndex));

      if (charIndex >= fullLine.length) {
        window.clearInterval(typeTimer);
        window.setTimeout(() => {
          setLineIndex((index) =>
            index < BOOT_LINES.length - 1 ? index + 1 : index,
          );
        }, 260);
      }
    }, 28);

    return () => window.clearInterval(typeTimer);
  }, [lineIndex]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0c0c0c]"
      initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: "blur(10px)",
      }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,156,219,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(45,156,219,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(circle at center, black 20%, transparent 78%)",
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-[#2d9cdb]/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center px-6">
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="h-16 w-3 rounded-full bg-gradient-to-b from-[#1a1a1a] via-[#050505] to-[#1a1a1a] shadow-[inset_0_0_8px_rgba(255,255,255,0.08)]" />
          <motion.div
            className="relative -mt-1"
            initial={{ rotate: -14 }}
            animate={{ rotate: [-14, 10, -6, 4, 0] }}
            transition={{ delay: 0.55, duration: 0.9, ease: "easeOut" }}
          >
            <svg
              width="54"
              height="34"
              viewBox="0 0 54 34"
              fill="none"
              aria-hidden
              className="text-[#2a2a2a] drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
            >
              <path
                d="M12 8h30c2.2 0 4 1.8 4 4v3c0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4v-3c0-2.2 1.8-4 4-4Z"
                fill="currentColor"
              />
              <path
                d="M21 19v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6"
                stroke="#555"
                strokeWidth="2"
              />
              <circle cx="27" cy="28" r="3" fill="#666" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mt-1 w-[min(72vw,220px)] overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute left-1/2 top-3 h-2.5 w-10 -translate-x-1/2 rounded-full bg-[#0a0a0a] ring-1 ring-white/10" />

          <div className="relative flex aspect-[3/4] flex-col items-center justify-center px-6 pt-8">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-[#2d9cdb]/10 via-transparent to-transparent"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />

            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2d9cdb] to-transparent shadow-[0_0_18px_#2d9cdb]"
              animate={{ top: ["8%", "92%", "8%"] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.p
              className="font-mono text-2xl tracking-tight text-[#2d9cdb]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {"</>"}
            </motion.p>

            <motion.p
              className="mt-3 text-3xl font-bold tracking-[0.18em] text-white"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.45 }}
            >
              {profile.initials}
            </motion.p>

            <motion.p
              className="mt-2 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-[#666]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.45 }}
            >
              Software Engineer
            </motion.p>
          </div>

          <div className="border-t border-white/5 px-4 py-3">
            <p className="truncate font-mono text-[11px] text-[#2d9cdb]/90">
              {typedLine}
              <span className="loader-cursor ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 bg-[#2d9cdb]" />
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 w-[min(72vw,220px)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#555]">
            <span>boot sequence</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1a7fb0] via-[#2d9cdb] to-[#7dd3fc] transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
