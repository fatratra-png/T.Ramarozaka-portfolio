import { data } from "../../tokimahery.data.js";
import { createEl, formatDate } from "../utils.js";

const POSTS_PER_PAGE = 5;
let currentPage = 1;

function buildPostRow({ title, description, creationDate, thumbnail, tags }) {
  const row = createEl("article", "blog-post-row");

  const thumbWrap = createEl("div", "blog-post-row__thumb");
  const img = createEl("img", "");
  img.src = thumbnail;
  img.alt = title;
  img.loading = "lazy";
  thumbWrap.appendChild(img);
  row.appendChild(thumbWrap);

  const body = createEl("div", "blog-post-row__body");
  body.appendChild(createEl("h3", "blog-post-row__title", title));
  body.appendChild(
    createEl("span", "blog-post-row__date", formatDate(creationDate)),
  );
  body.appendChild(createEl("p", "blog-post-row__desc", description));

  const tagsWrap = createEl("div", "blog-post-row__tags");
  tags.forEach((t) =>
    tagsWrap.appendChild(createEl("span", "blog-post-row__tag", t)),
  );
  body.appendChild(tagsWrap);

  row.appendChild(body);
  return row;
}

function renderPagination(container, totalPosts, page) {
  container.innerHTML = "";
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  if (totalPages <= 1) return;

  // Prev button
  if (page > 1) {
    const prev = createEl(
      "button",
      "blog-pagination__btn blog-pagination__btn--nav",
      "← Prev",
    );
    prev.addEventListener("click", () => {
      currentPage = page - 1;
      renderBlogList();
    });
    container.appendChild(prev);
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = createEl(
      "button",
      "blog-pagination__btn" +
        (i === page ? " blog-pagination__btn--active" : ""),
      String(i),
    );
    const p = i;
    btn.addEventListener("click", () => {
      currentPage = p;
      renderBlogList();
    });
    container.appendChild(btn);
  }

  // Next button
  if (page < totalPages) {
    const next = createEl(
      "button",
      "blog-pagination__btn blog-pagination__btn--nav",
      "Next →",
    );
    next.addEventListener("click", () => {
      currentPage = page + 1;
      renderBlogList();
    });
    container.appendChild(next);
  }
}

function renderBlogList() {
  const list = document.getElementById("blog-list");
  const pagination = document.getElementById("blog-pagination");
  if (!list) return;

  list.innerHTML = "";
  const sorted = [...data.posts].sort(
    (a, b) => b.creationDate - a.creationDate,
  );
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const page = sorted.slice(start, start + POSTS_PER_PAGE);

  page.forEach((p) => list.appendChild(buildPostRow(p)));

  if (pagination) renderPagination(pagination, sorted.length, currentPage);

  // Scroll to top of blog list
  if (currentPage > 1)
    list.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderYouTubeVideos(container) {
  data.youtubeVideos.forEach(({ id, title }) => {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="yt-iframe-wrap">
        <iframe
          src="https://www.youtube.com/embed/${id}"
          title="${title}"
          allowfullscreen
        ></iframe>
      </div>
      <p class="yt-iframe-title">${title}</p>`;
    container.appendChild(wrap);
  });
}

function renderArchives(container) {
  data.archives.forEach(({ label, count }) => {
    const a = document.createElement("a");
    a.className = "archive-link";
    a.href = "#";
    a.innerHTML = `<span>${label}</span><span class="archive-count">${count}</span>`;
    container.appendChild(a);
  });
}

export function initBlogPage() {
  renderBlogList();

  const ytContainer = document.getElementById("youtube-videos");
  const archContainer = document.getElementById("blog-archives");

  if (ytContainer) renderYouTubeVideos(ytContainer);
  if (archContainer) renderArchives(archContainer);
}
