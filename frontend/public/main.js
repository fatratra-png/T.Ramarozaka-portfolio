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
};

function handleDOMContentLoaded() {
  renderNavLinks();
  initCart();
  initHamburger();

  const page = location.pathname.split("/").pop() || "index.html";
  PAGE_INIT[page]?.();
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
