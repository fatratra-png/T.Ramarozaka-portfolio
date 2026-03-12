import { data } from "./tokimahery.data.js";
/* ── Static config (not sourced from data.js) ── */

const HERO_CONFIG = {
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

const NAV_LINKS = [
  { label: "Home", href: "index.html", active: true },
  { label: "Blog", href: "blog.html", active: false },
  { label: "Courses", href: "courses.html", active: false },
  { label: "Testimonials", href: "testimonials.html", active: false },
  { label: "Research", href: "research.html", active: false },
];

const CTA_CONTENT = {
  heading: "Ready to collaborate?",
  subheading:
    "Whether you're looking for a course, a consultation, or a translation — let's talk.",
  buttonText: "Get in touch",
  mailto: "mailto:toky@mail.hei.school",
};

/* Maps a course tag to its BEM modifier class. */
const CARD_TAG_MODIFIERS = {
  Development: "home-courses__card-tag--development",
};

/* ══════════════════════════════════════════
       DOM HELPERS
       Shared utilities that eliminate repetitive
       createElement / appendChild boilerplate
       across all render functions.
    ══════════════════════════════════════════ */

/**
 * createEl
 * Creates a DOM element, assigns a class, and optionally sets textContent.
 *
 * @param {string} tag       - HTML tag name
 * @param {string} className - Space-separated class string
 * @param {string} [text]    - Optional textContent
 * @returns {HTMLElement}
 */
function createEl(tag, className, text = "") {
  const el = document.createElement(tag);
  el.className = className;
  if (text) el.textContent = text;
  return el;
}

/**
 * renderListIntoContainer
 * Builds DOM nodes from an array and appends them to a container element.
 *
 * @param {string}   containerId - ID of the target container
 * @param {Array}    items       - Data array to iterate over
 * @param {Function} buildFn     - Receives one item, returns an Element
 */
function renderListIntoContainer(containerId, items, buildFn) {
  const container = document.getElementById(containerId);
  items.forEach((item) => container.appendChild(buildFn(item)));
}

/**
 * setTextById
 * Shorthand for setting an element's textContent by ID.
 *
 * @param {string} id   - Element ID
 * @param {string} text - Text to assign
 */
function setTextById(id, text) {
  document.getElementById(id).textContent = text;
}

/* ═══════════ ════════════════════════════════ -->═══════════════════════════════
       NAVBAR
    ══════════════════════════════════════════ */

/**
 * renderNavLinks
 * Builds primary nav anchors from NAV_LINKS config.
 */
function renderNavLinks() {
  renderListIntoContainer(
    "navbar-nav",
    NAV_LINKS,
    ({ label, href, active }) => {
      const a = createEl(
        "a",
        "navbar__nav-link" + (active ? " navbar__nav-link--active" : ""),
        label,
      );
      a.href = href;
      return a;
    },
  );
}

/* ══════════════════════════════════════════
       HERO
    ══════════════════════════════════════════ */

/**
 * renderHeroHeading — fills the two name spans.
 */
function renderHeroHeading() {
  setTextById("hero-firstname", HERO_CONFIG.firstname);
  setTextById("hero-lastname", HERO_CONFIG.lastname);
}

/**
 * renderHeroRoles — joins the roles array with a · separator.
 */
function renderHeroRoles() {
  setTextById("hero-roles", HERO_CONFIG.roles.join(" · "));
}

/**
 * renderHeroDescription — fills the tagline paragraph.
 */
function renderHeroDescription() {
  setTextById("hero-description", HERO_CONFIG.description);
}

/**
 * renderHeroPhoto — sets portrait src and alt text.
 */
function renderHeroPhoto() {
  const img = document.getElementById("hero-photo");
  img.src = HERO_CONFIG.photo;
  img.alt = `${HERO_CONFIG.firstname} ${HERO_CONFIG.lastname} — portrait`;
}

/**
 * renderSocialIcons — creates an anchor + inline SVG per social entry.
 */
function renderSocialIcons() {
  renderListIntoContainer(
    "hero-socials",
    HERO_CONFIG.socials,
    ({ platform, url, svg }) => {
      const a = createEl("a", "hero__social-icon");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", platform);
      a.innerHTML = svg;
      return a;
    },
  );
}

/**
 * bindHeroCtaButtons — wires the two primary CTA buttons.
 */
function bindHeroCtaButtons() {
  document.getElementById("hero-cta-courses").addEventListener("click", () => {
    window.location.href = "courses.html";
  });
  document.getElementById("hero-cta-about").addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  });
}

/**
 * initHeroSection — orchestrates all hero render calls.
 */
function initHeroSection() {
  renderHeroHeading();
  renderHeroRoles();
  renderHeroDescription();
  renderHeroPhoto();
  renderSocialIcons();
  bindHeroCtaButtons();
}

/* ══════════════════════════════════════════
       ABOUT
    ══════════════════════════════════════════ */

/**
 * renderAboutText — fills both bio paragraphs from data.
 */
function renderAboutText() {
  setTextById("about-part1", data.aboutMe_part1);
  setTextById("about-part2", data.aboutMe_part2);
}

/**
 * buildStatBlock — constructs one about__stat from a data.overview entry.
 */
function buildStatBlock({ number, label }) {
  const stat = createEl("div", "about__stat");
  stat.appendChild(createEl("span", "about__stat-number", String(number)));
  stat.appendChild(createEl("span", "about__stat-label", label));
  return stat;
}

/**
 * initAboutSection — renders text and stats.
 */
function initAboutSection() {
  renderAboutText();
  renderListIntoContainer("about-stats", data.overview, buildStatBlock);
}

/* ══════════════════════════════════════════
       HOME-COURSES
    ══════════════════════════════════════════ */

/**
 * buildCourseCard — constructs one course card from a homeCourses entry.
 */
function buildCourseCard({ tag, title, mode, duration }) {
  const card = createEl("article", "home-courses__card");
  const modifier = CARD_TAG_MODIFIERS[tag] || "";
  card.appendChild(
    createEl("span", ("home-courses__card-tag " + modifier).trim(), tag),
  );
  card.appendChild(createEl("h3", "home-courses__card-title", title));

  const meta = createEl("div", "home-courses__card-meta");
  meta.appendChild(createEl("span", "home-courses__card-meta-text", mode));
  meta.appendChild(createEl("span", "home-courses__card-meta-text", duration));
  card.appendChild(meta);

  return card;
}

/**
 * initHomeCoursesSection — renders all course preview cards.
 */
function initHomeCoursesSection() {
  renderListIntoContainer(
    "home-courses-grid",
    data.homeCourses,
    buildCourseCard,
  );
}

/* ══════════════════════════════════════════
       EXPERIENCE
    ══════════════════════════════════════════ */

/**
 * buildExperienceEntry — constructs one experience grid entry.
 */
function buildExperienceEntry({ year, role, org, desc }) {
  const entry = createEl("article", "experience__entry");
  entry.appendChild(
    createEl("span", "experience__entry-year", year.toUpperCase()),
  );
  entry.appendChild(createEl("h3", "experience__entry-role", role));
  entry.appendChild(
    createEl("span", "experience__entry-org", org.toUpperCase()),
  );
  entry.appendChild(createEl("p", "experience__entry-desc", desc));
  return entry;
}

/**
 * initExperienceSection — renders all experience entries.
 */
function initExperienceSection() {
  renderListIntoContainer(
    "experience-grid",
    data.experiences,
    buildExperienceEntry,
  );
}

/* ══════════════════════════════════════════
       CTA BANNER
    ══════════════════════════════════════════ */

/**
 * renderCtaBannerContent — injects copy into banner elements.
 */
function renderCtaBannerContent() {
  setTextById("cta-heading", CTA_CONTENT.heading);
  setTextById("cta-subheading", CTA_CONTENT.subheading);
  setTextById("cta-button", CTA_CONTENT.buttonText);
}

/**
 * bindCtaBannerButton — opens the contact email on click.
 */
function bindCtaBannerButton() {
  document.getElementById("cta-button").addEventListener("click", () => {
    window.location.href = CTA_CONTENT.mailto;
  });
}

/**
 * initCtaBanner — orchestrates CTA banner setup.
 */
function initCtaBanner() {
  renderCtaBannerContent();
  bindCtaBannerButton();
}

/* ══════════════════════════════════════════
       BOOT
    ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  renderNavLinks();
  initHeroSection();
  initAboutSection();
  initHomeCoursesSection();
  initExperienceSection();
  initCtaBanner();
});
