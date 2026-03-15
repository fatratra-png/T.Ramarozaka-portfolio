export const HERO_CONFIG = {
  firstname: "Tokimahery",
  lastname: "Ramarozaka",
  roles: ["CONSULTANT", "TEACHER", "DEVELOPER", "TRANSLATOR", "PHD"],
  description:
    "Bridging knowledge across disciplines — from cutting-edge software development to academic research and multilingual expertise.",
  photo: "./assets/square-image.jpg",
  socials: [
    {
      platform: "Facebook",
      url: "https://facebook.com",
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`,
    },
    {
      platform: "YouTube",
      url: "https://youtube.com",
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>`,
    },
    {
      platform: "Instagram",
      url: "https://instagram.com",
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com",
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    },
  ],
};

export const NAV_LINKS = [
  { label: "Home",         href: "index.html" },
  { label: "Blog",         href: "blog.html" },
  { label: "Courses",      href: "courses.html" },
  { label: "Testimonials", href: "testimonials.html" },
  { label: "Research",     href: "research.html" },
];

export const CTA_CONTENT = {
  heading:     "Ready to collaborate?",
  subheading:  "Whether you're looking for a course, a consultation, or a translation — let's talk.",
  buttonText:  "Get in touch",
  mailto:      "mailto:toky@mail.hei.school",
};

export const CARD_TAG_MODIFIERS = {
  Development: "home-courses__card-tag--development",
};

export const LANG_MAP = { en: "🇬🇧 EN", fr: "🇫🇷 FR", mg: "🇲🇬 MG" };
