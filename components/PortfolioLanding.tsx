"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  position: [0, -0.05, 11.5] as [number, number, number],
  fov: 21,
  anchorPosition: [0, 4.6, 0] as [number, number, number],
  lookAtY: 0.05,
  lookAtX: 0,
  cardScale: 2.55,
  lanyardWidth: 0.65,
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
      }}
      className={className}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-4 h-px w-10 bg-white/30" />
      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-white">
        {children}
      </p>
    </>
  );
}

export default function PortfolioLanding() {
  const heroLayout = useHeroLayout();
  const isDesktop = heroLayout === "desktop";

  return (
    <div className="relative overflow-x-clip text-white">
      <PageBackground />
      <Header />

      {/* Hero — desktop: full-bleed lanyard behind grid; mobile: lanyard layer behind content */}
      <section
        id="home"
        className="relative isolate overflow-visible pb-8 pt-[4.25rem] max-lg:pb-10 lg:min-h-screen lg:pb-12 lg:pt-[4.5rem]"
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
          <div className="pointer-events-none absolute inset-x-0 top-[6.75rem] bottom-6 z-0 flex justify-center overflow-visible lg:hidden">
            <div className="pointer-events-auto relative h-full w-full max-w-[320px] overflow-visible">
              <div
                className="pointer-events-none absolute inset-x-4 top-8 bottom-4 rounded-full bg-[#2d9cdb]/[0.07] blur-3xl"
                aria-hidden
              />
              <LanyardScene
                variant="mobile"
                className="h-full min-h-0 overflow-visible"
              />
            </div>
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
                I&apos;m {profile.shortName},
                <br />
                a {profile.title}
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

            {/* Mobile: reserve space for the absolute lanyard layer */}
            {heroLayout === "mobile" && (
              <div
                className="relative z-0 h-[210px] w-full max-w-[320px] sm:h-[235px] lg:hidden"
                aria-hidden
              />
            )}
            {heroLayout === null && (
              <div
                className="h-[210px] w-full max-w-[320px] animate-pulse rounded-2xl bg-white/[0.03] sm:h-[235px] lg:hidden"
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
              className="pointer-events-auto relative z-20 w-full max-w-md max-lg:rounded-2xl max-lg:border max-lg:border-white/[0.06] max-lg:bg-[#141414]/92 max-lg:px-4 max-lg:py-5 max-lg:backdrop-blur-md lg:hidden"
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

          <ScrollReveal delay={0.1}>
            <section id="skills" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
              <SectionLabel>Skills</SectionLabel>
              <h2 className="text-2xl font-bold">Tech stack</h2>
              <motion.ul
                className="mt-8 flex flex-wrap gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {profile.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, y: 16, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.45 },
                      },
                    }}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#bbb] transition-colors hover:border-[#2d9cdb]/40 hover:text-[#2d9cdb]"
                  >
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section id="projects" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
              <SectionLabel>Portfolio</SectionLabel>
              <h2 className="text-2xl font-bold">Selected work</h2>
              <div className="mt-10 flex flex-col gap-6">
                {profile.projects.map((project, index) => (
                  <ScrollReveal key={project.title} delay={index * 0.08}>
                    <article className="group rounded-xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-300 hover:border-[#2d9cdb]/30 hover:bg-white/[0.04]">
                      <h3 className="text-xl font-semibold transition-colors group-hover:text-[#2d9cdb]">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#888]">
                        {project.description}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded bg-[#2d9cdb]/10 px-2.5 py-1 text-xs font-medium text-[#2d9cdb]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-xs font-semibold tracking-wide text-[#bbb] transition hover:border-[#2d9cdb]/50 hover:text-[#2d9cdb]"
                        >
                          GitHub
                        </a>
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full bg-[#2d9cdb] px-4 py-2 text-xs font-semibold tracking-wide text-[#111] transition hover:bg-[#248bbf]"
                          >
                            Live demo
                          </a>
                        )}
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-xs text-[#555] transition-colors hover:text-[#2d9cdb]"
                        >
                          {project.github.replace("https://", "")}
                        </a>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section id="experience" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
              <SectionLabel>Experience</SectionLabel>
              <h2 className="text-2xl font-bold">Where I&apos;ve worked</h2>
              <div className="mt-10 space-y-10">
                {profile.experience.map((item, index) => (
                  <ScrollReveal key={`${item.company}-${item.period}`} delay={index * 0.1}>
                    <div className="border-l-2 border-[#2d9cdb]/50 pl-6">
                      <p className="text-sm font-medium text-[#2d9cdb]">
                        {item.period}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">{item.role}</h3>
                      <p className="text-sm text-[#666]">{item.company}</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#888]">
                        {item.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section id="education" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
              <SectionLabel>Education</SectionLabel>
              <h2 className="text-2xl font-bold">Background</h2>
              <div className="mt-10 space-y-10">
                {profile.education.map((item, index) => (
                  <ScrollReveal
                    key={`${item.school}-${item.period}`}
                    delay={index * 0.1}
                  >
                    <div className="border-l-2 border-[#2d9cdb]/50 pl-6">
                      <p className="text-sm font-medium text-[#2d9cdb]">
                        {item.period}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        {item.degree}
                      </h3>
                      <p className="text-sm text-[#666]">{item.school}</p>
                      {item.details.length > 0 && (
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-[#888]">
                          {item.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section id="contact" className="mt-16 scroll-mt-24 pb-8 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
              <SectionLabel>Contact</SectionLabel>
              <h2 className="text-2xl font-bold">Let&apos;s connect</h2>
              <p className="mt-4 text-[#888]">
                Open to collaborations, freelance work, and full-time
                opportunities. Based in {profile.location}.
              </p>
              <div className="mt-3 flex flex-col gap-1 text-sm text-[#666]">
                <a
                  href={`mailto:${profile.email}`}
                  className="w-fit transition-colors hover:text-[#2d9cdb]"
                >
                  {profile.email}
                </a>
                <a
                  href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                  className="w-fit transition-colors hover:text-[#2d9cdb]"
                >
                  {profile.phone}
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition-colors hover:text-[#2d9cdb]"
                >
                  linkedin.com/in/chan-montesor
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition-colors hover:text-[#2d9cdb]"
                >
                  github.com/fads122
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center rounded-full bg-[#2d9cdb] px-6 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#248bbf]"
                >
                  Email me
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-[#bbb] transition hover:border-[#2d9cdb]/50 hover:text-[#2d9cdb]"
                >
                  GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-[#bbb] transition hover:border-[#2d9cdb]/50 hover:text-[#2d9cdb]"
                >
                  LinkedIn
                </a>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
