import { data } from "../../tokimahery.data.js";
import { createEl, starsHTML } from "../utils.js";

const ROLE_ORDER = [
  { key: "student", label: "Students" },
  { key: "collaborator", label: "Collaborators" },
  { key: "customer", label: "Customers" },
];

const INITIAL_VISIBLE = 2;

function buildTestimonialCard({ role, rating, description, author, thumbnail }) {
  const card = createEl("article", "testi-card");
  card.classList.add(`testi-card--${role}`);

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

  card.appendChild(createEl("span", "testi-card__sep"));
  card.appendChild(createEl("p", "testi-card__text", description));

  const stars = createEl("div", "testi-card__stars");
  // FIX: add aria-label so screen readers convey rating without reading raw SVG
  stars.setAttribute("aria-label", `Rating: ${rating} out of 5`);
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

    // FIX: <div> → <section> for semantic grouping; aria-labelledby wired to heading id
    const section = createEl("section", "testi-section");
    section.setAttribute("aria-labelledby", `testi-label-${key}`);
    section.classList.add(`testi-section--${key}`);

    const heading = createEl("div", "testi-section-heading");
    heading.appendChild(createEl("span", "testi-section-heading__line"));
    const headingLabel = createEl(
      "span",
      "testi-section-heading__label",
      label.toUpperCase(),
    );
    // FIX: id added so section's aria-labelledby resolves correctly
    headingLabel.id = `testi-label-${key}`;
    heading.appendChild(headingLabel);
    section.appendChild(heading);

    const grid = createEl("div", "testimonials-grid");
    grid.classList.add(`testimonials-grid--${key}`);

    const hiddenCards = [];

    group.forEach((t, index) => {
      const card = buildTestimonialCard(t);
      if (index >= INITIAL_VISIBLE) {
        card.classList.add("testi-card--hidden");
        hiddenCards.push(card);
      }
      grid.appendChild(card);
    });

    section.appendChild(grid);

    if (hiddenCards.length > 0) {
      const showMoreWrap = createEl("div", "testi-show-more-wrap");

      const btn = createEl("button", "testi-show-more-btn");
      // FIX: aria-expanded on the button for accessibility
      btn.setAttribute("aria-expanded", "false");

      const btnText = createEl("span", "testi-show-more-btn__text");
      btnText.textContent = `SHOW MORE ${label.toUpperCase()}`;
      const btnArrow = createEl("span", "testi-show-more-btn__arrow");
      btnArrow.textContent = "→";
      btn.appendChild(btnText);
      btn.appendChild(btnArrow);

      const countBadge = createEl("span", "testi-show-more-btn__count");
      countBadge.textContent = `+${hiddenCards.length}`;

      showMoreWrap.appendChild(btn);
      showMoreWrap.appendChild(countBadge);

      let expanded = false;

      // FIX: named function instead of anonymous arrow
      function handleShowMoreClick() {
        expanded = !expanded;

        hiddenCards.forEach((card, i) => {
          if (expanded) {
            card.classList.remove("testi-card--hidden");
            card.style.animationDelay = `${i * 60}ms`;
            card.classList.add("testi-card--revealed");
          } else {
            card.classList.add("testi-card--hidden");
            card.classList.remove("testi-card--revealed");
            card.style.animationDelay = "";
          }
        });

        if (expanded) {
          btnText.textContent = `SHOW LESS ${label.toUpperCase()}`;
          btnArrow.textContent = "↑";
          countBadge.style.display = "none";
          btn.classList.add("testi-show-more-btn--expanded");
          btn.setAttribute("aria-expanded", "true");
        } else {
          btnText.textContent = `SHOW MORE ${label.toUpperCase()}`;
          btnArrow.textContent = "→";
          countBadge.style.display = "";
          btn.classList.remove("testi-show-more-btn--expanded");
          btn.setAttribute("aria-expanded", "false");
          heading.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      btn.addEventListener("click", handleShowMoreClick);
      section.appendChild(showMoreWrap);
    }

    container.appendChild(section);
  });
}
