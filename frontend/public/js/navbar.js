import { NAV_LINKS } from "./config.js";
import { createEl } from "./utils.js";
import { updateCartBadge, openCartPopup } from "./cart.js";

export function renderNavLinks() {
  const nav = document.getElementById("navbar-nav");
  if (!nav) return;

  const current = location.pathname.split("/").pop() || "index.html";

  NAV_LINKS.forEach(({ label, href }) => {
    const isActive =
      href === current || (current === "" && href === "index.html");
    const a = createEl(
      "a",
      "navbar__nav-link" + (isActive ? " navbar__nav-link--active" : ""),
      label,
    );
    a.href = href;
    // FIX: add aria-current="page" to the active desktop nav link
    if (isActive) a.setAttribute("aria-current", "page");
    nav.appendChild(a);
  });

  // ── Mobile nav drawer ──
  _renderMobileNav(current);
}

function _renderMobileNav(current) {
  const mobileNav = createEl("nav", "navbar__mobile-nav");
  mobileNav.id = "navbar-mobile-nav";
  mobileNav.setAttribute("aria-label", "Mobile navigation");

  NAV_LINKS.forEach(({ label, href }) => {
    const isActive =
      href === current || (current === "" && href === "index.html");
    const a = createEl(
      "a",
      "navbar__mobile-nav-link" +
        (isActive ? " navbar__mobile-nav-link--active" : ""),
      label,
    );
    a.href = href;
    // FIX: add aria-current="page" to the active mobile nav link
    if (isActive) a.setAttribute("aria-current", "page");
    mobileNav.appendChild(a);
  });

  const header = document.getElementById("navbar");
  if (header && header.parentNode) {
    header.parentNode.insertBefore(mobileNav, header.nextSibling);
  }
}

export function initHamburger() {
  const btn = document.getElementById("navbar-hamburger");
  const mobileNav = document.getElementById("navbar-mobile-nav");
  if (!btn || !mobileNav) return;

  // FIX: named function instead of anonymous arrow
  function handleHamburgerClick() {
    const isOpen = btn.classList.toggle("is-open");
    mobileNav.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  }

  // FIX: named function instead of anonymous arrow (reused for links + outside click)
  function closeMobileNav() {
    btn.classList.remove("is-open");
    mobileNav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", handleHamburgerClick);

  // Close on link click
  mobileNav.querySelectorAll(".navbar__mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  // FIX: named function instead of anonymous arrow
  function handleOutsideClick(e) {
    if (!btn.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMobileNav();
    }
  }

  document.addEventListener("click", handleOutsideClick);
}

export function initCart() {
  const wrapper = document.getElementById("navbar-cart-wrapper");
  if (!wrapper) return;

  let badge = document.getElementById("cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.id = "cart-badge";
    badge.className = "navbar__cart-badge";
    badge.style.display = "none";
    wrapper.appendChild(badge);
  }

  updateCartBadge();

  const cartBtn = document.getElementById("navbar-cart-button");

  // FIX: named function instead of anonymous arrow
  function handleCartButtonClick(e) {
    e.stopPropagation();
    openCartPopup();
  }

  cartBtn?.addEventListener("click", handleCartButtonClick);
}
