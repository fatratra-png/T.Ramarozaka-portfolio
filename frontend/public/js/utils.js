/** Create an element with an optional class and text content. */
export function createEl(tag, className, text) {
  const el = document.createElement(tag);
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

/** Append items built by `buildFn` into a container found by id. */
export function renderListIntoContainer(containerId, items, buildFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  items.forEach((item) => container.appendChild(buildFn(item)));
}

/** Set the text content of an element found by id. */
export function setTextById(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/** Format a number as Malagasy Ariary. */
export function formatPrice(n) {
  return n.toLocaleString("fr-MG") + " Ar";
}

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function formatDate(d) {
  const day = d.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
  const year = d.getFullYear();
  return `${month} ${day}${getOrdinal(day)}, ${year}`;
}

/** Return an HTML string of 5 star SVGs, filled up to `rating`. */
export function starsHTML(rating) {
  return Array.from(
    { length: 5 },
    (_, i) =>
      `<svg width="14" height="14" viewBox="0 0 24 24"
      fill="${i < rating ? "#b91c1c" : "none"}"
      stroke="#b91c1c" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`,
  ).join("");
}
