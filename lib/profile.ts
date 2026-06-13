export const profile = {
  name: "Christian Montesor",
  shortName: "Christian",
  initials: "CM",
  title: "Full Stack Software Engineer",
  tagline:
    "Building scalable web applications with Next.js and Angular — from design to deployment.",
  aboutPreview:
    "Full Stack Software Engineer with expertise in scalable web apps, workflow automation, and team leadership during comprehensive internship programs.",
  workPreview:
    "Secure digital notarization, hospital systems, EMR portals, and full-stack platforms at Quanby Solutions — plus personal projects in LMS, inventory, and real-time games.",
  about:
    "Dynamic Full Stack Software Engineer with expertise in building scalable web applications using Next.js and Angular. Proven ability to streamline development workflows and automate processes to improve system reliability. Demonstrated early leadership potential by heading a development team during a comprehensive internship, managing the software life cycle from initial design to deployment.",
  location: "Philippines",
  phone: "(+63) 966-855-3879",
  email: "christianmontesor@gmail.com",
  github: "https://github.com/fads122",
  linkedin: "https://www.linkedin.com/in/chan-montesor",
  photo: "/profile/photo.jpg",
  logo: "/profile/logo.png",
  skills: [
    "Next.js",
    "React.js",
    "TypeScript",
    "Tailwind",
    "Angular",
    "Supabase",
    "PostgreSQL",
    "MySQL",
    "Drizzle",
    "Prisma",
    "Flutter",
    "Dart",
    "OpenClaw",
    "Codex",
    "Claude Code",
    "Git",
    "GitHub",
  ],
  projects: [
    {
      title: "Kodigrow",
      description:
        "A learning management platform built for students and educators to run courses, assignments, quizzes, and learning materials in one place.",
      tags: ["Next.js", "TypeScript", "LMS"],
      github: "https://github.com/fads122/kodigrow_remake",
      live: null,
    },
    {
      title: "Quantify",
      description:
        "An inventory management platform built for businesses to track equipment and retail inventory, manage suppliers, handle bundles, and ship project proposals from one place.",
      tags: ["Full Stack", "Inventory", "Business"],
      github: "https://github.com/fads122/ims",
      live: null,
    },
    {
      title: "Uno-No-Mercy",
      description:
        "An in-house UNO No Mercy table so your crew can practice against bots on one device or play together over the web from shared links — replacing the physical deck with one coordinated online game.",
      tags: ["Real-time", "Multiplayer", "Web"],
      github: "https://github.com/fads122/uno-no-mercy",
      live: null,
    },
  ],
  experience: [
    {
      role: "Software Engineer 1",
      company: "Quanby Solutions Inc",
      period: "January 2026 — Present",
      highlights: [
        "Member of the development of a secure digital notarization system—accredited by the Supreme Court—integrating Blockchain for document integrity, KYC verification, WebRTC video conferencing, and secure digital signing to ensure full legal compliance and system reliability.",
        "Engineered the doctor and patient-facing modules for a comprehensive digital hospital system, specifically developing the real-time video conferencing suite and virtual consultation interface to facilitate secure, high-quality online check-ups and streamlined clinical workflows.",
        "Developed specialized modules and core functionalities for Auditor, Patient, and Billing portals within an Electronic Medical Record system, ensuring seamless data synchronization, role-based access control, and optimized financial/clinical workflows.",
      ],
    },
    {
      role: "Junior Software Engineer",
      company: "Quanby Solutions Inc",
      period: "June 2025 — January 2026",
      highlights: [
        "Collaborated on the foundational development of QLegal, specifically engineering the real-time messaging and video conferencing modules essential for secure, remote electronic notarization and legal consultations.",
        "Engineered a lightweight, in-house digital signing platform to streamline internal document workflows, focusing on secure signature authentication and seamless integration with existing company file management systems.",
        "Developed the organizational hierarchy architecture for the QSign ecosystem, implementing complex administrative features including multi-tier role management (Owner, Department, and Sub-department) and granular access controls for organizational members.",
        "Architected a comprehensive inventory system featuring delivery tracking, an asset-borrowing module for internal equipment, and a project-costing engine that dynamically calculates total expenditures, discounts, and profit margins based on real-time equipment pricing.",
        "Developed and extended specialized modules and core workflows across a unified accounting and operations platform—including inquiry, banking reconciliation, general ledger, accounts receivable and payable, order-to-cash and procure-to-pay, inventory, company configuration, tax and regulatory reporting, analytics and reporting, marketplace integration, and AI-assisted automation—supporting consistent financial data, operational visibility, and administrative controls such as user roles and account settings.",
      ],
    },
    {
      role: "Software Developer Trainee (OJT)",
      company: "Quanby Solutions Inc",
      period: "January 2025 — June 2025",
      highlights: [
        "Spearheaded the initial development of the QSales platform, establishing the fundamental inventory management architecture and core database schemas that served as the foundation for future system iterations and enterprise scaling.",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Information Technology",
      school: "Divine Word College of Legazpi",
      period: "August 2021 — June 2025",
      details: [
        "Thesis: KodiGrow — Interactive Learning Platform for Divine Word College of Legazpi",
        "Award: 3rd Year Dean's Lister Top 1",
      ],
    },
    {
      degree: "Science, Technology, Engineering and Mathematics (STEM)",
      school: "Legazpi City Science High School",
      period: "June 2016 — July 2018",
      details: [],
    },
  ],
} as const;
