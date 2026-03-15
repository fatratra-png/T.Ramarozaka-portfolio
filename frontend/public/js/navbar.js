import { NAV_LINKS } from "./config.js";
import { createEl } from "./utils.js";
import { updateCartBadge } from "./cart.js";

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
      label
    );
    a.href = href;
    nav.appendChild(a);
  });
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
}
