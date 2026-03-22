import { data } from "../../tokimahery.data.js";
import { HERO_CONFIG, CTA_CONTENT, CARD_TAG_MODIFIERS } from "../config.js";
import { createEl, renderListIntoContainer, setTextById } from "../utils.js";

// FIX: named builder instead of anonymous arrow inside renderListIntoContainer
function buildSocialLink({ platform, url, svg }) {
  const a = createEl("a", "hero__social-icon");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", platform);
  a.innerHTML = svg;
  return a;
}

export function initHeroSection() {
  setTextById("hero-firstname", HERO_CONFIG.firstname);
  setTextById("hero-lastname", HERO_CONFIG.lastname);
  setTextById("hero-roles", HERO_CONFIG.roles.join(" · "));
  setTextById("hero-description", HERO_CONFIG.description);

  const img = document.getElementById("hero-photo");
  if (img) {
    img.src = HERO_CONFIG.photo;
    img.alt = `${HERO_CONFIG.firstname} ${HERO_CONFIG.lastname}`;
  }

  renderListIntoContainer("hero-socials", HERO_CONFIG.socials, buildSocialLink);

  // FIX: named event handlers instead of anonymous arrows
  function handleCTACourses() {
    location.href = "courses.html";
  }
  function handleCTAAbout() {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }

  document
    .getElementById("hero-cta-courses")
    ?.addEventListener("click", handleCTACourses);

  document
    .getElementById("hero-cta-about")
    ?.addEventListener("click", handleCTAAbout);
}

// FIX: named builder for about stats
function buildStatItem({ number, label }) {
  const stat = createEl("div", "about__stat");
  stat.appendChild(createEl("span", "about__stat-number", String(number)));
  stat.appendChild(createEl("span", "about__stat-label", label));
  return stat;
}

export function initAboutSection() {
  setTextById("about-part1", data.aboutMe_part1);
  setTextById("about-part2", data.aboutMe_part2);
  renderListIntoContainer("about-stats", data.overview, buildStatItem);
}

// FIX: named builder for home course cards
function buildHomeCourseCard({ tag, title, mode, duration }) {
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

export function initHomeCoursesSection() {
  renderListIntoContainer(
    "home-courses-grid",
    data.homeCourses,
    buildHomeCourseCard,
  );
}

// FIX: named builder for experience entries
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

export function initExperienceSection() {
  renderListIntoContainer(
    "experience-grid",
    data.experiences,
    buildExperienceEntry,
  );
}

export function initExperienceScrollReveal() {
  const mq = window.matchMedia("(max-width: 1023px)");
  if (!mq.matches) return;

  const entries = document.querySelectorAll(".experience__entry");
  if (!entries.length) return;

  // FIX: named function instead of anonymous arrow
  function highlightCentered() {
    const viewportMid = window.innerHeight / 2;
    let closestEntry = null;
    let closestDist = Infinity;

    entries.forEach((entry) => {
      const rect = entry.getBoundingClientRect();
      const entryMid = rect.top + rect.height / 2;
      const dist = Math.abs(entryMid - viewportMid);
      if (dist < closestDist) {
        closestDist = dist;
        closestEntry = entry;
      }
    });

    entries.forEach((entry) => {
      entry.classList.toggle("is-active", entry === closestEntry);
    });
  }

  window.addEventListener("scroll", highlightCentered, { passive: true });
  highlightCentered();
}

export function initCtaBanner() {
  setTextById("cta-heading", CTA_CONTENT.heading);
  setTextById("cta-subheading", CTA_CONTENT.subheading);
  setTextById("cta-button", CTA_CONTENT.buttonText);

  // FIX: named function instead of anonymous arrow
  function handleCtaButtonClick() {
    location.href = CTA_CONTENT.page;
  }

  document
    .getElementById("cta-button")
    ?.addEventListener("click", handleCtaButtonClick);
}
