import { data } from "../../tokimahery.data.js";
import { createEl, formatPrice } from "../utils.js";
import { cart, addToCart } from "../cart.js";

// Lang map without emoji for badges
const LANG_CODE = { en: "EN", fr: "FR", mg: "MG" };

function buildCourseCard(course) {
  const card = createEl("article", "course-card");

  // — Image + badges —
  const imgWrap = createEl("div", "course-card__image-wrapper");
  const img = createEl("img", "course-card__image");
  img.src = course.thumbnail;
  img.alt = course.title;
  imgWrap.appendChild(img);

  const badges = createEl("div", "course-card__badges");
  badges.appendChild(createEl("span", "course-card__badge course-card__lang",
    LANG_CODE[course.language] || course.language.toUpperCase()));
  course.technologies.forEach(t =>
    badges.appendChild(createEl("span", "course-card__badge course-card__tech", t.toLowerCase()))
  );
  imgWrap.appendChild(badges);
  imgWrap.appendChild(createEl("span", "course-card__level", course.level.toLowerCase()));
  card.appendChild(imgWrap);

  // — Body —
  const body = createEl("div", "course-card__body");
  body.appendChild(createEl("h3", "course-card__title", course.title));
  body.appendChild(createEl("p",  "course-card__price", formatPriceMGA(course.price)));
  body.appendChild(createEl("p",  "course-card__description", course.description));

  const actions  = createEl("div", "course-card__actions");
  const learnBtn = createEl("button", "course-card__btn course-card__btn--learn", "Learn more");
  const cartBtn  = createEl("button", "course-card__btn course-card__btn--cart",  "Add to cart");

  if (cart.find(c => c.id === course.id)) {
    cartBtn.textContent = "Added ✓";
    cartBtn.disabled = true;
  }

  cartBtn.addEventListener("click", () => {
    addToCart(course);
    cartBtn.textContent = "Added ✓";
    cartBtn.disabled = true;
  });

  actions.appendChild(learnBtn);
  actions.appendChild(cartBtn);
  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

function formatPriceMGA(n) {
  return "MGA " + n.toLocaleString("fr-MG");
}

export function initCoursesPage() {
  const grid = document.getElementById("courses-grid");
  const countEl = document.getElementById("courses-count");
  if (!grid) return;

  // — Filter state —
  let activeLangs = new Set();
  let activeTech  = "all";
  let activeLevel = "all";
  let minPrice    = 0;
  let maxPrice    = 300_000;
  let searchQ     = "";

  function render() {
    grid.innerHTML = "";
    const filtered = data.courses.filter(c => {
      if (activeLangs.size > 0 && !activeLangs.has(c.language))       return false;
      if (activeTech  !== "all" && !c.technologies.includes(activeTech)) return false;
      if (activeLevel !== "all" && c.level !== activeLevel)              return false;
      if (c.price < minPrice || c.price > maxPrice)                      return false;
      if (searchQ && !c.title.toLowerCase().includes(searchQ)
                  && !c.description.toLowerCase().includes(searchQ))   return false;
      return true;
    });

    if (countEl) {
      const n = filtered.length;
      countEl.textContent = n + " COURSE" + (n !== 1 ? "S" : "") + " FOUND";
    }

    if (filtered.length === 0) {
      grid.appendChild(createEl("p", "courses__empty", "No courses match your filters."));
    } else {
      filtered.forEach(c => grid.appendChild(buildCourseCard(c)));
    }
  }

  // — Language flags —
  document.querySelectorAll(".flag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      activeLangs.has(lang) ? (activeLangs.delete(lang), btn.classList.remove("active"))
                             : (activeLangs.add(lang),   btn.classList.add("active"));
      render();
    });
  });

  // — Tech & level selects —
  document.getElementById("tech-select")
    ?.addEventListener("change", e => { activeTech  = e.target.value; render(); });
  document.getElementById("level-select")
    ?.addEventListener("change", e => { activeLevel = e.target.value; render(); });

  // — Price range sliders —
  const minSlider = document.getElementById("min-price");
  const maxSlider = document.getElementById("max-price");
  const priceVal  = document.getElementById("price-values");
  const fill      = document.getElementById("range-fill");

  function updateRange() {
    let lo = parseInt(minSlider.value);
    let hi = parseInt(maxSlider.value);
    if (lo > hi) {
      this === minSlider ? (minSlider.value = hi) : (maxSlider.value = lo);
      lo = parseInt(minSlider.value);
      hi = parseInt(maxSlider.value);
    }
    minPrice = lo;
    maxPrice = hi;
    const p1 = (lo / 300_000) * 100;
    const p2 = (hi / 300_000) * 100;
    if (fill)     { fill.style.left = p1 + "%"; fill.style.width = (p2 - p1) + "%"; }
    if (priceVal) priceVal.textContent = `${lo.toLocaleString("fr-MG")} Ar – ${hi.toLocaleString("fr-MG")} Ar`;
    render();
  }

  if (minSlider) minSlider.addEventListener("input", updateRange);
  if (maxSlider) maxSlider.addEventListener("input", updateRange);
  if (minSlider && maxSlider) updateRange.call(null);

  // — Search —
  document.getElementById("search-input")
    ?.addEventListener("input", e => { searchQ = e.target.value.toLowerCase(); render(); });

  // — Clear all —
  document.getElementById("clear-all")?.addEventListener("click", () => {
    activeLangs.clear();
    document.querySelectorAll(".flag-btn").forEach(b => b.classList.remove("active"));

    activeTech  = "all";
    activeLevel = "all";
    document.getElementById("tech-select")  && (document.getElementById("tech-select").value   = "all");
    document.getElementById("level-select") && (document.getElementById("level-select").value  = "all");

    minPrice = 0;
    maxPrice = 300_000;
    if (minSlider) minSlider.value = 0;
    if (maxSlider) maxSlider.value = 300_000;
    if (fill)     { fill.style.left = "0%"; fill.style.width = "100%"; }
    if (priceVal) priceVal.textContent = "0 Ar – 300,000 Ar";

    searchQ = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    render();
  });

  render();
}
