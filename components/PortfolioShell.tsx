"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import PortfolioLoader from "@/components/PortfolioLoader";
import { profile } from "@/lib/profile";

const PortfolioLanding = dynamic(() => import("@/components/PortfolioLanding"), {
  ssr: false,
});

const MIN_LOADER_MS = 2800;
const LOADER_SEEN_KEY = "clm-portfolio-loader-seen";

export default function PortfolioShell() {
  const [showLoader, setShowLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasSeenLoader = sessionStorage.getItem(LOADER_SEEN_KEY) === "1";

    if (reducedMotion || hasSeenLoader) {
      setShowLoader(false);
      setShowContent(true);
      return;
    }

    setShowLoader(true);

    [profile.photo, profile.logo].forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });

    const startedAt = Date.now();

    const beginExit = () => {
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_LOADER_MS - elapsed);

      window.setTimeout(() => {
        sessionStorage.setItem(LOADER_SEEN_KEY, "1");
        setShowContent(true);
        setShowLoader(false);
      }, wait);
    };

    if (document.readyState === "complete") {
      beginExit();
    } else {
      window.addEventListener("load", beginExit, { once: true });
      return () => window.removeEventListener("load", beginExit);
    }
  }, []);

  const handleLoaderExitComplete = useCallback(() => {
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden";
    }
  }, [showLoader]);

  return (
    <>
      <AnimatePresence onExitComplete={handleLoaderExitComplete}>
        {showLoader && <PortfolioLoader key="portfolio-loader" />}
      </AnimatePresence>

      <motion.div
        className={
          showContent
            ? "relative"
            : "pointer-events-none fixed inset-0 overflow-hidden opacity-0"
        }
        initial={false}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!showContent}
      >
        <PortfolioLanding />
      </motion.div>
    </>
  );
}
