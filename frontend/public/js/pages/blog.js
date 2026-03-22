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

  function handlePrevClick() {
    if (currentPage > 1) {
      currentPage -= 1;
      renderBlogList();
    }
  }

  function makePageHandler(targetPage) {
    return function handlePageBtnClick() {
      currentPage = targetPage;
      renderBlogList();
    };
  }

  function handleNextClick() {
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
    if (i === page) btn.setAttribute("aria-current", "page");
    btn.addEventListener("click", makePageHandler(i));
    container.appendChild(btn);
  }

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

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = sorted.slice(start, start + POSTS_PER_PAGE);

  list.innerHTML = "";
  pagePosts.forEach((p) => list.appendChild(buildPostRow(p)));

  if (pagination) renderPagination(pagination, totalPosts, currentPage);

  if (currentPage > 1) {
    list.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

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
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.textContent = "Veuillez entrer un email valide.";
  document.body.appendChild(toast);

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

// ── iOS-style ding sound via Web Audio API ─────────────────────────────────
function playDingSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Bell-like tone: two oscillators layered
    function createTone(freq, gainVal, startTime, duration) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    const now = ctx.currentTime;
    createTone(1318, 0.4, now, 0.8); // E6 — bright bell hit
    createTone(1760, 0.2, now, 0.6); // A6 — shimmer
    createTone(1318, 0.15, now + 0.08, 0.5); // slight echo
  } catch (e) {
    // Silently fail if AudioContext is blocked
  }
}

// ── Gmail-style email notification ────────────────────────────────────────
function showGmailNotification(email) {
  // Remove any existing notification
  document.getElementById("gmail-notif")?.remove();

  const now = new Date();
  const timeStr =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  const notif = document.createElement("div");
  notif.id = "gmail-notif";
  notif.className = "gmail-notif";
  notif.setAttribute("role", "status");
  notif.setAttribute("aria-live", "polite");

  notif.innerHTML = `
    <div class="gmail-notif__header">
      <div class="gmail-notif__logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
          <path d="M0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73L0 7.09V5.457z" fill="#34A853"/>
          <path d="M18.545 11.73v9.273h3.819A1.636 1.636 0 0024 19.366V7.09l-5.455 4.64z" fill="#4285F4"/>
          <path d="M0 7.09l5.455 4.64L12 9.549 18.545 11.73 24 7.09V5.457c0-2.023-2.309-3.178-3.927-1.964L18.545 4.64 12 9.548 5.455 4.64 3.927 3.493C2.309 2.279 0 3.434 0 5.457V7.09z" fill="#FBBC05"/>
        </svg>
      </div>
      <div class="gmail-notif__app">Gmail</div>
      <div class="gmail-notif__time">${timeStr}</div>
      <button class="gmail-notif__close" aria-label="Fermer">✕</button>
    </div>
    <div class="gmail-notif__body">
      <div class="gmail-notif__avatar">T</div>
      <div class="gmail-notif__content">
        <div class="gmail-notif__from">tokyramarozaka@gmail.com</div>
        <div class="gmail-notif__subject">Demande de souscription à la newsletter</div>
        <div class="gmail-notif__preview">Bonjour, je souhaite m'abonner à votre newsletter pour recevoir vos derniers articles…</div>
      </div>
    </div>
  `;

  document.body.appendChild(notif);

  // Close button
  notif
    .querySelector(".gmail-notif__close")
    .addEventListener("click", function () {
      dismissGmailNotif(notif);
    });

  // Animate in
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      notif.classList.add("gmail-notif--visible");
    });
  });

  // Auto-dismiss after 5s
  setTimeout(function () {
    dismissGmailNotif(notif);
  }, 5000);
}

function dismissGmailNotif(notif) {
  notif.classList.remove("gmail-notif--visible");
  notif.addEventListener(
    "transitionend",
    function () {
      notif.remove();
    },
    { once: true },
  );
}

// ── Newsletter init ────────────────────────────────────────────────────────
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

  // Play ding + show Gmail notification
  playDingSound();
  setTimeout(function () {
    showGmailNotification(email);
  }, 300);
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
