import { data } from "../../tokimahery.data.js";
import { createEl, starsHTML } from "../utils.js";

const ROLE_ORDER = [
  { key: "student", label: "Students" },
  { key: "collaborator", label: "Collaborators" },
  { key: "customer", label: "Customers" },
];

function buildTestimonialCard({
  role,
  rating,
  description,
  author,
  thumbnail,
}) {
  const card = createEl("article", "testi-card");
  card.classList.add(`testi-card--${role}`);

  // 1. Author + avatar at TOP
  const authorWrap = createEl("div", "testi-card__author");
  const av = createEl("div", "testi-card__avatar");
  const avImg = createEl("img", "testi-card__avatar-img");
  avImg.src = thumbnail;
  avImg.alt = author;
  av.appendChild(avImg);
  authorWrap.appendChild(av);

  const meta = createEl("div", "testi-card__meta");
  meta.appendChild(createEl("span", "testi-card__name", author));
  meta.appendChild(
    createEl(
      "span",
      "testi-card__role",
      role.charAt(0).toUpperCase() + role.slice(1),
    ),
  );
  authorWrap.appendChild(meta);
  card.appendChild(authorWrap);

  // 2. Red separator
  card.appendChild(createEl("span", "testi-card__sep"));

  // 3. Quote text
  card.appendChild(createEl("p", "testi-card__text", description));

  // 4. Stars at BOTTOM
  const stars = createEl("div", "testi-card__stars");
  stars.innerHTML = starsHTML(rating);
  card.appendChild(stars);

  return card;
}

export function initTestimonialsPage() {
  const container = document.getElementById("testimonials-sections");
  if (!container) return;

  ROLE_ORDER.forEach(({ key, label }) => {
    const group = data.testimonials.filter((t) => t.role === key);
    if (group.length === 0) return;

    const section = createEl("div", "testi-section");

    // Section heading with red line prefix
    const heading = createEl("div", "testi-section-heading");
    heading.appendChild(createEl("span", "testi-section-heading__line"));
    heading.appendChild(
      createEl("span", "testi-section-heading__label", label.toUpperCase()),
    );
    section.appendChild(heading);

    // Grid of cards
    const grid = createEl("div", "testimonials-grid");
    grid.classList.add(`testimonials-grid--${key}`);
    section.classList.add(`testi-section--${key}`);
    group.forEach((t) => grid.appendChild(buildTestimonialCard(t)));
    section.appendChild(grid);

    container.appendChild(section);
  });
}
