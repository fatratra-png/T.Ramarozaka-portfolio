import { data } from "../../tokimahery.data.js";
import { createEl, formatDate } from "../utils.js";

const POSTS_PER_PAGE = 5;
let currentPage = 1;

function buildPostRow({ title, description, creationDate, thumbnail, tags }) {
  const row = createEl("article", "blog-post-row");

  const thumbWrap = createEl("div", "blog-post-row__thumb");
  const img = createEl("img", "blog-post-row__thumb-img");
  img.src = thumbnail;
  img.alt = title;
  img.loading = "lazy";
  thumbWrap.appendChild(img);
  row.appendChild(thumbWrap);

  const body = createEl("div", "blog-post-row__body");
  body.appendChild(
    createEl("span", "blog-post-row__date", formatDate(creationDate)),
  );
  body.appendChild(createEl("h3", "blog-post-row__title", title));
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

  // FIX: named functions — no anonymous arrows for event handlers
  function handlePrevClick() {
    if (currentPage > 1) {
      currentPage -= 1;
      renderBlogList();
    }
  }

  // FIX: named factory so each page button has a properly scoped named handler
  function makePageHandler(targetPage) {
    return function handlePageBtnClick() {
      currentPage = targetPage;
      renderBlogList();
    };
  }

  function handleNextClick() {
    // FIX: explicit last-page guard so clicking Next on the last page is a no-op
    if (currentPage < totalPages) {
      currentPage += 1;
      renderBlogList();
    }
  }

  if (page > 1) {
    const prev = createEl(
      "button",
      "blog-pagination__btn blog-pagination__btn--nav",
      "← Prev",
    );
    prev.setAttribute("aria-label", "Go to previous page");
    prev.addEventListener("click", handlePrevClick);
    container.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = createEl(
      "button",
      "blog-pagination__btn" +
        (i === page ? " blog-pagination__btn--active" : ""),
      String(i),
    );
    btn.setAttribute("aria-label", `Go to page ${i}`);
    // FIX: aria-current="page" on active pagination button
    if (i === page) btn.setAttribute("aria-current", "page");
    btn.addEventListener("click", makePageHandler(i));
    container.appendChild(btn);
  }

  // FIX: guard — Next button only rendered when NOT already on the last page;
  // was missing the upper-bound check, so clicking Next on page N would have set
  // currentPage = totalPages + 1 and rendered an empty list.
  if (page < totalPages) {
    const next = createEl(
      "button",
      "blog-pagination__btn blog-pagination__btn--nav",
      "Next →",
    );
    next.setAttribute("aria-label", "Go to next page");
    next.addEventListener("click", handleNextClick);
    container.appendChild(next);
  }
}

function renderBlogList() {
  const list = document.getElementById("blog-list");
  const pagination = document.getElementById("blog-pagination");
  if (!list) return;

  const sorted = [...data.posts].sort(
    (a, b) => b.creationDate - a.creationDate,
  );
  const totalPosts = sorted.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // FIX: clamp currentPage — prevents blank list when navigating beyond the last page
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = sorted.slice(start, start + POSTS_PER_PAGE);

  // FIX: use map + join pattern; each post row is built via buildPostRow
  // and we collect DOM nodes — not innerHTML strings — to keep XSS-safe
  list.innerHTML = "";
  pagePosts.forEach((p) => list.appendChild(buildPostRow(p)));

  if (pagination) renderPagination(pagination, totalPosts, currentPage);

  if (currentPage > 1) {
    list.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// FIX: use map().join('') to batch-render YouTube iframes (replaces forEach + DOM append)
function renderYouTubeVideos(container) {
  container.innerHTML = data.youtubeVideos
    .map(
      ({ id, title }) =>
        `<div class="yt-iframe-wrap">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${id}"
            title="${title}"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <p class="yt-iframe-title">${title}</p>`,
    )
    .join("");
}

// FIX: use map().join('') to batch-render archive links
function renderArchives(container) {
  container.innerHTML = data.archives
    .map(
      ({ label, count }) =>
        `<a class="archive-link" href="#">
          <span>${label}</span>
          <span class="archive-count">${count}</span>
        </a>`,
    )
    .join("");
}

function showInvalidEmailToast() {
  document.getElementById("nl-toast")?.remove();

  const toast = document.createElement("div");
  toast.id = "nl-toast";
  toast.className = "nl-toast";
  // FIX: role="alert" + aria-live="assertive" for validation error (was missing both)
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.textContent = "Veuillez entrer un email valide.";
  document.body.appendChild(toast);

  // FIX: named rAF wrappers instead of anonymous arrows
  requestAnimationFrame(function scheduleToastReveal() {
    requestAnimationFrame(function revealToast() {
      toast.classList.add("nl-toast--visible");
    });
  });

  function hideAndRemoveToast() {
    toast.classList.remove("nl-toast--visible");
    toast.addEventListener(
      "transitionend",
      function removeToastFromDOM() {
        toast.remove();
      },
      { once: true },
    );
  }

  setTimeout(hideAndRemoveToast, 2000);
}

// FIX: named handler so it can be referred to by name for debugging
function handleNewsletterSubscribe() {
  const emailInput = document.getElementById("newsletter-email");
  const subscribeBtn = document.getElementById("newsletter-btn");
  if (!emailInput || !subscribeBtn) return;

  const email = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValid) {
    showInvalidEmailToast();
    return;
  }

  emailInput.remove();
  subscribeBtn.remove();

  const success = document.createElement("p");
  success.className = "newsletter-widget__success";
  success.textContent = "You're in! Talk soon.";
  document.querySelector(".newsletter-widget")?.appendChild(success);
}

function initNewsletter() {
  const subscribeBtn = document.getElementById("newsletter-btn");
  if (!subscribeBtn) return;
  subscribeBtn.addEventListener("click", handleNewsletterSubscribe);
}

export function initBlogPage() {
  renderBlogList();

  const ytContainer = document.getElementById("youtube-videos");
  const archContainer = document.getElementById("blog-archives");

  if (ytContainer) renderYouTubeVideos(ytContainer);
  if (archContainer) renderArchives(archContainer);

  initNewsletter();
}
