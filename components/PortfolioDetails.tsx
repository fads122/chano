"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { profile } from "@/lib/profile";

const SKILL_GROUPS = [
  {
    title: "Frontend & Mobile",
    skills: [
      "Next.js",
      "React.js",
      "TypeScript",
      "Tailwind",
      "Angular",
      "Flutter",
      "Dart",
    ],
  },
  {
    title: "Backend & Data",
    skills: ["Supabase", "PostgreSQL", "MySQL", "Drizzle", "Prisma"],
  },
  {
    title: "Tools & AI",
    skills: ["OpenClaw", "Codex", "Claude Code", "Git", "GitHub"],
  },
] as const;

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

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#777]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function DetailPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] via-white/[0.02] to-transparent p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export default function PortfolioDetails() {
  return (
    <>
      <ScrollReveal delay={0.1}>
        <section id="skills" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
          <SectionLabel>Skills</SectionLabel>
          <SectionHeading
            title="Tech stack"
            subtitle="Technologies I use to ship production-ready products end to end."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((group, groupIndex) => (
              <DetailPanel key={group.title} className="h-full">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {group.title}
                  </h3>
                  <span className="rounded-full bg-[#2d9cdb]/10 px-2 py-0.5 text-[10px] font-medium tabular-nums text-[#2d9cdb]">
                    {group.skills.length}
                  </span>
                </div>
                <motion.ul
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.04, delayChildren: groupIndex * 0.05 },
                    },
                  }}
                >
                  {group.skills.map((skill) => (
                    <motion.li
                      key={skill}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                      }}
                      className="rounded-lg border border-white/[0.08] bg-[#141414]/60 px-3 py-1.5 text-xs font-medium text-[#ccc] transition-colors hover:border-[#2d9cdb]/35 hover:text-[#2d9cdb]"
                    >
                      {skill}
                    </motion.li>
                  ))}
                </motion.ul>
              </DetailPanel>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section id="projects" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
          <SectionLabel>Portfolio</SectionLabel>
          <SectionHeading
            title="Selected work"
            subtitle="Projects that reflect how I design, build, and iterate in the real world."
          />
          <div className="flex flex-col gap-5">
            {profile.projects.map((project, index) => (
              <ScrollReveal key={project.title} delay={index * 0.08}>
                <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]/40 p-6 transition-all duration-300 hover:border-[#2d9cdb]/30 hover:bg-[#141414]/70 sm:p-8">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2d9cdb]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 shrink-0 font-mono text-xs font-medium text-[#2d9cdb]/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold transition-colors group-hover:text-[#2d9cdb]">
                          {project.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#888]">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2 pl-10 sm:pl-12">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-[#2d9cdb]/15 bg-[#2d9cdb]/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2d9cdb]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-3 pl-10 sm:pl-12">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2 text-xs font-semibold tracking-wide text-[#bbb] transition hover:border-[#2d9cdb]/45 hover:text-[#2d9cdb]"
                    >
                      GitHub
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg bg-[#2d9cdb] px-4 py-2 text-xs font-semibold tracking-wide text-[#111] transition hover:bg-[#248bbf]"
                      >
                        Live demo
                      </a>
                    )}
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
          <SectionHeading
            title="Where I've worked"
            subtitle="Roles where I shipped production systems across legal, healthcare, and enterprise platforms."
          />
          <div className="relative space-y-6 pl-1">
            <div
              className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-[#2d9cdb]/50 via-white/10 to-transparent"
              aria-hidden
            />
            {profile.experience.map((item, index) => (
              <ScrollReveal key={`${item.company}-${item.period}`} delay={index * 0.08}>
                <div className="relative pl-8">
                  <span
                    className="absolute left-0 top-6 h-3.5 w-3.5 rounded-full border-2 border-[#2d9cdb] bg-[#141414] shadow-[0_0_12px_rgba(45,156,219,0.35)]"
                    aria-hidden
                  />
                  <DetailPanel>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2d9cdb]">
                      {item.period}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{item.role}</h3>
                    <p className="mt-1 text-sm text-[#666]">{item.company}</p>
                    <ul className="mt-4 space-y-2.5 border-t border-white/[0.06] pt-4">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-2.5 text-sm leading-7 text-[#888]"
                        >
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#2d9cdb]/70" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailPanel>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section id="education" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
          <SectionLabel>Education</SectionLabel>
          <SectionHeading title="Background" />
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.education.map((item, index) => (
              <ScrollReveal
                key={`${item.school}-${item.period}`}
                delay={index * 0.08}
              >
                <DetailPanel className="h-full">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2d9cdb]">
                    {item.period}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                    {item.degree}
                  </h3>
                  <p className="mt-1 text-sm text-[#666]">{item.school}</p>
                  {item.details.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                      {item.details.map((detail) => (
                        <li
                          key={detail}
                          className="text-sm leading-relaxed text-[#888]"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </DetailPanel>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section id="contact" className="mt-16 scroll-mt-24 pb-8 sm:mt-20 lg:mt-24 lg:scroll-mt-28">
          <SectionLabel>Contact</SectionLabel>
          <DetailPanel className="overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                  Let&apos;s connect
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#888]">
                  Open to collaborations, freelance work, and full-time
                  opportunities. Based in {profile.location}.
                </p>
                <dl className="mt-6 space-y-3">
                  {[
                    { label: "Email", href: `mailto:${profile.email}`, value: profile.email },
                    {
                      label: "Phone",
                      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
                      value: profile.phone,
                    },
                    {
                      label: "LinkedIn",
                      href: profile.linkedin,
                      value: "linkedin.com/in/chan-montesor",
                      external: true,
                    },
                    {
                      label: "GitHub",
                      href: profile.github,
                      value: "github.com/fads122",
                      external: true,
                    },
                  ].map((item) => (
                    <div key={item.label} className="grid grid-cols-[5.5rem_1fr] gap-2 text-sm">
                      <dt className="font-medium text-[#555]">{item.label}</dt>
                      <dd>
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="text-[#bbb] transition-colors hover:text-[#2d9cdb]"
                        >
                          {item.value}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-xl border border-[#2d9cdb]/20 bg-[#2d9cdb]/[0.06] p-6">
                <p className="text-sm font-medium text-white">
                  Ready to talk about your next project?
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#888]">
                  I typically respond within 24 hours.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center justify-center rounded-lg bg-[#2d9cdb] px-5 py-2.5 text-sm font-semibold text-[#111] transition hover:bg-[#248bbf]"
                  >
                    Email me
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-[#bbb] transition hover:border-[#2d9cdb]/45 hover:text-[#2d9cdb]"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </DetailPanel>
        </section>
      </ScrollReveal>
    </>
  );
}
