import { data } from "../../tokimahery.data.js";
import { createEl, setTextById } from "../utils.js";
import { RESEARCH_CTA_CONTENT } from "../config.js";

function formatMonthYear(date) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function buildPaperEntry({
  title,
  abstract,
  publishedDate,
  journal,
  authors,
  tags,
  url,
}) {
  const entry = createEl("article", "paper-entry");

  const header = createEl("div", "paper-entry__header");
  const tagsWrap = createEl("div", "paper-entry__tags");
  tags.forEach((t) =>
    tagsWrap.appendChild(createEl("span", "paper-entry__tag", t.toUpperCase())),
  );
  header.appendChild(tagsWrap);
  header.appendChild(
    createEl("span", "paper-entry__date", formatMonthYear(publishedDate)),
  );
  entry.appendChild(header);

  entry.appendChild(createEl("h3", "paper-entry__title", title));

  const meta = createEl("p", "paper-entry__meta");
  meta.innerHTML =
    authors.map((a) => escapeHtml(a)).join(", ") +
    " · <em>" +
    escapeHtml(journal) +
    "</em>";
  entry.appendChild(meta);

  entry.appendChild(createEl("p", "paper-entry__abstract", abstract));

  const link = createEl("a", "paper-entry__read-link");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Read PDF: ${title}`);
  link.innerHTML = `<span class="paper-entry__read-icon" aria-hidden="true"><i class="fa-solid fa-file-pdf"></i></span> READ PDF`;
  entry.appendChild(link);

  return entry;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function initResearchPage() {
  const list = document.getElementById("papers-list");
  if (!list) return;

  [...data.papers]
    .sort((a, b) => b.publishedDate - a.publishedDate)
    .forEach((p) => list.appendChild(buildPaperEntry(p)));

  setTextById("cta-heading", RESEARCH_CTA_CONTENT.heading);
  setTextById("cta-subheading", RESEARCH_CTA_CONTENT.subheading);
  setTextById("cta-button", RESEARCH_CTA_CONTENT.buttonText);

  function handleResearchCtaClick() {
    location.href = RESEARCH_CTA_CONTENT.page;
  }

  document
    .getElementById("cta-button")
    ?.addEventListener("click", handleResearchCtaClick);
}
