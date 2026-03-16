import { renderNavLinks, initCart, initHamburger } from "./js/navbar.js";
import {
  initHeroSection,
  initAboutSection,
  initHomeCoursesSection,
  initExperienceSection,
  initCtaBanner,
} from "./js/pages/home.js";
import { initCoursesPage } from "./js/pages/courses.js";
import { initBlogPage } from "./js/pages/blog.js";
import { initTestimonialsPage } from "./js/pages/testimonials.js";
import { initResearchPage } from "./js/pages/research.js";

const PAGE_INIT = {
  "index.html": () => {
    initHeroSection();
    initAboutSection();
    initHomeCoursesSection();
    initExperienceSection();
    initCtaBanner();
  },
  "courses.html": initCoursesPage,
  "blog.html": initBlogPage,
  "testimonials.html": initTestimonialsPage,
  "research.html": initResearchPage,
};

document.addEventListener("DOMContentLoaded", () => {
  renderNavLinks();
  initCart();
  initHamburger();

  const page = location.pathname.split("/").pop() || "index.html";
  PAGE_INIT[page]?.();
});
