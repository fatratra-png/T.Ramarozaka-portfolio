import { data } from "../../tokimahery.data.js";
import { createEl } from "../utils.js";

function formatMonthYear(date) {
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long" }).format(date);
}

function buildPaperEntry({ title, abstract, publishedDate, journal, authors, tags, url }) {
  const entry = createEl("article", "paper-entry");

  // Header: tags + date
  const header   = createEl("div", "paper-entry__header");
  const tagsWrap = createEl("div", "paper-entry__tags");
  tags.forEach(t => tagsWrap.appendChild(createEl("span", "paper-entry__tag", t.toUpperCase())));
  header.appendChild(tagsWrap);
  header.appendChild(createEl("span", "paper-entry__date", formatMonthYear(publishedDate)));
  entry.appendChild(header);

  // Title
  entry.appendChild(createEl("h3", "paper-entry__title", title));

  // Authors · Journal (italic)
  const meta = createEl("p", "paper-entry__meta");
  meta.innerHTML = authors.join(", ") + " · <em>" + journal + "</em>";
  entry.appendChild(meta);

  // Abstract
  entry.appendChild(createEl("p", "paper-entry__abstract", abstract));

  // Read PDF link
  const link = createEl("a", "paper-entry__read-link");
  link.href   = url;
  link.target = "_blank";
  link.rel    = "noopener";
  link.innerHTML = `<span class="paper-entry__read-icon">📄</span> READ PDF`;
  entry.appendChild(link);

  return entry;
}

export function initResearchPage() {
  const list = document.getElementById("papers-list");
  if (!list) return;

  [...data.papers]
    .sort((a, b) => b.publishedDate - a.publishedDate)
    .forEach(p => list.appendChild(buildPaperEntry(p)));
}
