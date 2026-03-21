import { renderNavLinks, initCart, initHamburger } from "./js/navbar.js";
import {
  initHeroSection,
  initAboutSection,
  initHomeCoursesSection,
  initExperienceSection,
  initExperienceScrollReveal,
  initCtaBanner,
} from "./js/pages/home.js";
import { initCoursesPage } from "./js/pages/courses.js";
import { initBlogPage } from "./js/pages/blog.js";
import { initTestimonialsPage } from "./js/pages/testimonials.js";
import { initResearchPage } from "./js/pages/research.js";

// FIX: named function declaration for the index page init (was anonymous arrow)
function initHomePage() {
  initHeroSection();
  initAboutSection();
  initHomeCoursesSection();
  initExperienceSection();
  initExperienceScrollReveal();
  initCtaBanner();
}

const PAGE_INIT = {
  "index.html": initHomePage,
  "courses.html": initCoursesPage,
  "blog.html": initBlogPage,
  "testimonials.html": initTestimonialsPage,
  "research.html": initResearchPage,
  // contact.html form logic lives in js/pages/contact.js (loaded via <script> in HTML)
};

// FIX: named function instead of anonymous arrow passed to addEventListener
function handleDOMContentLoaded() {
  renderNavLinks();
  initCart();
  initHamburger();

  const page = location.pathname.split("/").pop() || "index.html";
  PAGE_INIT[page]?.();
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
