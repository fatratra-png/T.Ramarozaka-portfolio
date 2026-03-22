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
    return function () {
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
  if (currentPage > 1)
    list.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderYouTubeVideos(container) {
  container.innerHTML = data.youtubeVideos
    .map(
      ({ id, title }) =>
        `<div class="yt-iframe-wrap">
        <iframe src="https://www.youtube-nocookie.com/embed/${id}"
          title="${title}" allowfullscreen loading="lazy"></iframe>
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

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add("nl-toast--visible");
    });
  });

  setTimeout(function () {
    toast.classList.remove("nl-toast--visible");
    toast.addEventListener(
      "transitionend",
      function () {
        toast.remove();
      },
      { once: true },
    );
  }, 2000);
}

// ── iOS ding via Web Audio API ─────────────────────────────────────────────
function playDingSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    function tone(freq, vol, start, dur) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(vol, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.start(start);
      osc.stop(start + dur);
    }
    const t = ctx.currentTime;
    tone(1318, 0.4, t, 0.8);
    tone(1760, 0.2, t, 0.6);
    tone(1318, 0.12, t + 0.08, 0.5);
  } catch (e) {}
}

// ── Email notification ─────────────────────────────────────────────────────
function showEmailNotification(email) {
  document.getElementById("email-notif")?.remove();

  const now = new Date();
  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const notif = document.createElement("div");
  notif.id = "email-notif";
  notif.className = "email-notif";
  notif.setAttribute("role", "status");

  notif.innerHTML = `
    <div class="email-notif__bar">
      <span class="email-notif__bar-left">
        <i class="fa-solid fa-envelope" style="color:#b91c1c;font-size:13px;margin-right:6px;"></i>
        <span class="email-notif__bar-app">Mail</span>
      </span>
      <span class="email-notif__bar-time">${timeStr}</span>
      <button class="email-notif__dismiss" aria-label="Fermer">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="email-notif__content">
      <div class="email-notif__icon-wrap">
        <i class="fa-solid fa-paper-plane" style="color:#b91c1c;font-size:18px;"></i>
      </div>
      <div class="email-notif__text">
        <p class="email-notif__from">tokyramarozaka@gmail.com</p>
        <p class="email-notif__subject">Nouvelle souscription à la newsletter</p>
        <p class="email-notif__preview">Votre adresse <strong>${email}</strong> a bien été enregistrée. Bienvenue !</p>
      </div>
    </div>
    <div class="email-notif__progress">
      <div class="email-notif__progress-bar"></div>
    </div>
  `;

  document.body.appendChild(notif);

  notif
    .querySelector(".email-notif__dismiss")
    .addEventListener("click", function () {
      dismissNotif(notif);
    });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      notif.classList.add("email-notif--visible");
      notif
        .querySelector(".email-notif__progress-bar")
        .classList.add("email-notif__progress-bar--run");
    });
  });

  setTimeout(function () {
    dismissNotif(notif);
  }, 5000);
}

function dismissNotif(notif) {
  notif.classList.remove("email-notif--visible");
  notif.classList.add("email-notif--out");
  notif.addEventListener(
    "transitionend",
    function () {
      notif.remove();
    },
    { once: true },
  );
}

// ── Self-subscribe easter egg ──────────────────────────────────────────────
function showSelfSubscribeToast() {
  document.getElementById("easter-toast")?.remove();

  const isMobile = window.innerWidth < 640;
  const toast = document.createElement("div");
  toast.id = "easter-toast";

  // On mobile: fixed top, full width, slide from top
  // On desktop: centered bottom, slide from bottom
  if (isMobile) {
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      left: 12px;
      right: 12px;
      z-index: 9999;
      background: #7f1d1d;
      color: white;
      font-size: 13px;
      font-weight: 500;
      padding: 12px 20px;
      border-radius: 10px;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 220ms ease, transform 220ms ease;
      text-align: center;
      line-height: 1.5;
      pointer-events: none;
    `;
  } else {
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(16px);
      z-index: 9999;
      background: #7f1d1d;
      color: white;
      font-size: 13px;
      font-weight: 500;
      padding: 12px 24px;
      border-radius: 8px;
      opacity: 0;
      max-width: 420px;
      width: max-content;
      transition: opacity 220ms ease, transform 220ms ease;
      text-align: center;
      line-height: 1.5;
      pointer-events: none;
    `;
  }

  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span style="font-size:16px;margin-right:8px;">🤦</span>
    Monsieur… vous vous souscrivez à vous-même ?
    <span style="font-size:14px;margin-left:6px;">C'est votre newsletter.</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.style.opacity = "1";
      if (isMobile) {
        toast.style.transform = "translateY(0)";
      } else {
        toast.style.transform = "translateX(-50%) translateY(0)";
      }
    });
  });

  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = isMobile
      ? "translateY(-20px)"
      : "translateX(-50%) translateY(16px)";
    toast.addEventListener(
      "transitionend",
      function () {
        toast.remove();
      },
      { once: true },
    );
  }, 4000);
}

// ── Newsletter ─────────────────────────────────────────────────────────────
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

  // Easter egg — prof subscribes with his own email
  if (email.toLowerCase() === "tokyramarozaka@gmail.com") {
    showSelfSubscribeToast();
    return;
  }

  emailInput.remove();
  subscribeBtn.remove();

  const success = document.createElement("p");
  success.className = "newsletter-widget__success";
  success.textContent = "You're in! Talk soon.";
  document.querySelector(".newsletter-widget")?.appendChild(success);

  playDingSound();
  setTimeout(function () {
    showEmailNotification(email);
  }, 350);
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
