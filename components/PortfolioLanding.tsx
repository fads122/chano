"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PortfolioDetails from "@/components/PortfolioDetails";
import ShinyText from "@/components/ShinyText";
import Header from "@/components/Header";
import PageBackground from "@/components/PageBackground";
import { HeroSidebar, MobileHeroQuickLinks } from "@/components/HeroSidebar";
import {
  ScrollReveal,
  heroFromLeft,
  heroFromRight,
  heroStagger,
} from "@/components/ScrollReveal";
import { profile } from "@/lib/profile";

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[300px] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#2d9cdb] border-t-transparent" />
    </div>
  ),
});

const DESKTOP_LANYARD = {
  position: [0, 0, 18] as [number, number, number],
  fov: 17,
  anchorPosition: [0, 7, 0] as [number, number, number],
  lookAtY: 0.35,
  lookAtX: 0,
  cardScale: 3.35,
  lanyardWidth: 0.9,
};

const MOBILE_LANYARD = {
  position: [0, -0.08, 13] as [number, number, number],
  fov: 22,
  anchorPosition: [0, 5.05, 0] as [number, number, number],
  lookAtY: -0.06,
  lookAtX: 0,
  cardScale: 2.52,
  lanyardWidth: 0.6,
};

function useHeroLayout() {
  const [layout, setLayout] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setLayout(mq.matches ? "desktop" : "mobile");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return layout;
}

function LanyardScene({
  variant,
  className = "",
}: {
  variant: "mobile" | "desktop";
  className?: string;
}) {
  const settings = variant === "desktop" ? DESKTOP_LANYARD : MOBILE_LANYARD;

  return (
    <Lanyard
      position={settings.position}
      fov={settings.fov}
      gravity={[0, -40, 0]}
      frontImage={profile.photo}
      backImage={profile.logo}
      backImageFit="contain"
      lanyardWidth={settings.lanyardWidth}
      lanyardLogo={profile.logo}
      anchorPosition={settings.anchorPosition}
      lookAtY={settings.lookAtY}
      lookAtX={settings.lookAtX}
      cardScale={settings.cardScale}
      idCard={{
        name: profile.name,
        title: profile.title,
        idCode: `${profile.initials}-2026`,
        location: profile.location,
        email: profile.email,
        github: profile.github.replace("https://", ""),
        linkedin: "linkedin.com/in/chan-montesor",
        skills: profile.skills.slice(0, 6),
      }}
      className={className}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 bg-[#2d9cdb]/50" />
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#2d9cdb]">
        {children}
      </p>
    </div>
  );
}

export default function PortfolioLanding() {
  const heroLayout = useHeroLayout();
  const isDesktop = heroLayout === "desktop";

  return (
    <div className="relative overflow-x-visible text-white lg:overflow-x-clip">
      <PageBackground />
      <Header />

      {/* Hero — desktop: full-bleed lanyard behind grid; mobile: lanyard layer behind content */}
      <section
        id="home"
        className="relative isolate overflow-visible pb-10 pt-[4.25rem] max-lg:pb-14 lg:min-h-screen lg:pb-12 lg:pt-[4.5rem]"
      >
        {isDesktop && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
            <div className="pointer-events-auto h-full w-full overflow-visible">
              <LanyardScene
                variant="desktop"
                className="h-full min-h-0 overflow-visible"
              />
            </div>
          </div>
        )}

        {heroLayout === "mobile" && (
          <div className="pointer-events-none absolute inset-x-0 top-[7.4rem] bottom-6 z-0 overflow-visible lg:hidden">
            <div className="pointer-events-auto relative h-full w-full overflow-visible">
              <div
                className="pointer-events-none absolute inset-x-4 top-12 bottom-2 rounded-full bg-[#2d9cdb]/[0.06] blur-3xl"
                aria-hidden
              />
              <LanyardScene
                variant="mobile"
                className="h-full min-h-[335px] overflow-visible sm:min-h-[355px]"
              />
            </div>
          </div>
        )}

        {heroLayout === null && (
          <div className="pointer-events-none relative z-10 mx-auto max-w-[1320px] px-5 lg:hidden lg:px-8">
            <div
              className="h-[330px] w-full animate-pulse rounded-2xl bg-white/[0.03] sm:h-[350px]"
              aria-hidden
            />
          </div>
        )}

        <div className="pointer-events-none relative z-10 mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="flex flex-col items-center gap-5 max-lg:text-center lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 xl:gap-6">
            {/* Intro copy */}
            <motion.div
              className="relative z-10 w-full max-lg:max-w-md max-lg:rounded-2xl max-lg:bg-[#141414]/88 max-lg:px-4 max-lg:py-4 max-lg:backdrop-blur-md lg:col-span-3 lg:bg-transparent lg:py-4 lg:text-left lg:backdrop-blur-none"
              variants={heroStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={heroFromLeft}
                className="mb-4 h-px w-10 bg-white/80 max-lg:mx-auto lg:mb-6 lg:w-12"
              />
              <motion.h1
                variants={heroFromLeft}
                className="text-[1.625rem] font-bold leading-[1.25] tracking-tight sm:text-[1.875rem] md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              >
                <ShinyText
                  text={`I'm ${profile.shortName},`}
                  color="#ffffff"
                  shineColor="#b8e4ff"
                  speed={3}
                  delay={1.2}
                  spread={120}
                  direction="left"
                  className="block"
                />
                <ShinyText
                  text={`a ${profile.title}`}
                  color="#ffffff"
                  shineColor="#b8e4ff"
                  speed={3}
                  delay={1.2}
                  spread={120}
                  direction="left"
                  className="block"
                />
              </motion.h1>
              <motion.p
                variants={heroFromLeft}
                className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-[#999] sm:mt-5 lg:mx-0 lg:mt-6 lg:text-base"
              >
                {profile.tagline}
              </motion.p>

              <motion.a
                variants={heroFromLeft}
                href="#details"
                aria-label="Scroll to details"
                className="scroll-bounce pointer-events-auto mt-8 hidden h-11 w-11 items-center justify-center rounded-full bg-[#2d9cdb] text-white shadow-lg shadow-[#2d9cdb]/25 transition-transform hover:scale-105 lg:mt-10 lg:inline-flex lg:h-12 lg:w-12"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.a>
            </motion.div>

            {heroLayout === "mobile" && (
              <div
                className="relative z-0 mt-3 h-[335px] w-full sm:mt-4 sm:h-[355px] lg:hidden"
                aria-hidden
              />
            )}

            {/* Lanyard — desktop: empty spacer for absolute canvas */}
            <div className="hidden w-full justify-center overflow-visible lg:col-span-6 lg:flex">
              {isDesktop && (
                <div className="min-h-[68vh]" aria-hidden />
              )}
            </div>

            <motion.div
              variants={heroFromLeft}
              initial="hidden"
              animate="visible"
              className="pointer-events-auto relative z-20 mt-1 w-full max-w-md max-lg:rounded-2xl max-lg:border max-lg:border-white/[0.06] max-lg:bg-[#141414]/92 max-lg:px-4 max-lg:py-5 max-lg:backdrop-blur-md lg:hidden"
            >
              <MobileHeroQuickLinks />
            </motion.div>

            {/* Sidebar blocks — desktop only; mobile uses quick links below lanyard */}
            <motion.div
              className="hidden w-full self-start lg:col-span-3 lg:mt-16 lg:block lg:pb-6 lg:pt-4 xl:mt-20"
              variants={heroStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={heroFromRight}>
                <HeroSidebar />
              </motion.div>
            </motion.div>
          </div>
        </div>

        <p className="pointer-events-none relative z-20 mx-auto mt-1 max-w-[1320px] px-5 text-center text-[10px] tracking-wide text-[#555] max-lg:rounded-full max-lg:bg-[#141414]/80 max-lg:py-1.5 max-lg:backdrop-blur-sm sm:text-xs lg:-mt-6 lg:bg-transparent lg:px-8 lg:text-[#666]">
          Drag the card to flip it
        </p>
      </section>

      {/* Details — scroll-animated sections */}
      <div
        id="details"
        className="relative z-10 border-t border-white/[0.08] bg-[#111]/55 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <ScrollReveal>
            <section id="about" className="scroll-mt-24 lg:scroll-mt-28">
              <SectionLabel>About</SectionLabel>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Full stack engineer focused on scalable systems and real-world impact.
              </h2>
              <p className="mt-6 text-base leading-8 text-[#888]">
                {profile.about}
              </p>
            </section>
          </ScrollReveal>

          <PortfolioDetails />
        </div>
      </div>
    </div>
  );
}
