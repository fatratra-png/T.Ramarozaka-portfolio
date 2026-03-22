import { formatPrice } from "./utils.js";

const STORAGE_KEY = "cart";

export let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

export function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addToCart(course) {
  if (!cart.find((c) => c.id === course.id)) {
    cart.push(course);
    saveCart();
    updateCartBadge();
  }
}

export function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
  updateCartBadge();
  renderCartPopup();
}

export function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
}

export function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  badge.textContent = cart.length;
  badge.style.display = cart.length ? "flex" : "none";
}

function getOrCreatePopup() {
  let overlay = document.getElementById("cart-overlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "cart-overlay";
  overlay.className = "cart-overlay";
  overlay.setAttribute("aria-hidden", "true");

  const modal = document.createElement("div");
  modal.id = "cart-modal";
  modal.className = "cart-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Your cart");

  const header = document.createElement("div");
  header.className = "cart-modal__header";
  const title = document.createElement("h2");
  title.className = "cart-modal__title";
  title.textContent = "Your cart";
  const closeBtn = document.createElement("button");
  closeBtn.className = "cart-modal__close";
  closeBtn.setAttribute("aria-label", "Close cart");
  closeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;
  closeBtn.addEventListener("click", closeCartPopup);
  header.appendChild(title);
  header.appendChild(closeBtn);
  modal.appendChild(header);

  const body = document.createElement("div");
  body.id = "cart-modal-body";
  body.className = "cart-modal__body";
  modal.appendChild(body);

  const footer = document.createElement("div");
  footer.id = "cart-modal-footer";
  footer.className = "cart-modal__footer";
  modal.appendChild(footer);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeCartPopup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCartPopup();
  });

  return overlay;
}

function renderCartPopup() {
  const body = document.getElementById("cart-modal-body");
  const footer = document.getElementById("cart-modal-footer");
  if (!body || !footer) return;

  body.innerHTML = "";
  footer.innerHTML = "";

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cart-modal__empty";
    empty.textContent = "Your cart is empty.";
    body.appendChild(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "cart-modal__list";

  cart.forEach((course) => {
    const li = document.createElement("li");
    li.className = "cart-modal__item";

    const name = document.createElement("span");
    name.className = "cart-modal__item-name";
    name.textContent = course.title;

    const right = document.createElement("div");
    right.className = "cart-modal__item-right";

    const price = document.createElement("span");
    price.className = "cart-modal__item-price";
    price.textContent = formatPrice(course.price);

    const removeBtn = document.createElement("button");
    removeBtn.className = "cart-modal__item-remove";
    removeBtn.setAttribute("aria-label", `Remove ${course.title}`);
    removeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>`;
    removeBtn.addEventListener("click", () => removeFromCart(course.id));

    right.appendChild(price);
    right.appendChild(removeBtn);
    li.appendChild(name);
    li.appendChild(right);
    list.appendChild(li);
  });

  body.appendChild(list);

  const total = cart.reduce((sum, c) => sum + c.price, 0);

  const totalRow = document.createElement("div");
  totalRow.className = "cart-modal__total";
  const totalLabel = document.createElement("span");
  totalLabel.className = "cart-modal__total-label";
  totalLabel.textContent = "TOTAL";
  const totalAmt = document.createElement("span");
  totalAmt.className = "cart-modal__total-amount";
  totalAmt.textContent = formatPrice(total);
  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalAmt);

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "cart-modal__confirm";
  confirmBtn.textContent = "CONFIRM ORDER";
  confirmBtn.addEventListener("click", () => {
    closeCartPopup();
    clearCart();
    document.querySelectorAll(".course-card__btn--cart").forEach((btn) => {
      btn.textContent = "Add to cart";
      btn.disabled = false;
    });
    showOrderToast();
  });

  footer.appendChild(totalRow);
  footer.appendChild(confirmBtn);
}

export function openCartPopup() {
  const overlay = getOrCreatePopup();
  renderCartPopup();
  overlay.offsetHeight;
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

export function closeCartPopup() {
  const overlay = document.getElementById("cart-overlay");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

export function showOrderToast() {
  let toast = document.getElementById("order-toast");
  if (toast) toast.remove();

  toast = document.createElement("div");
  toast.id = "order-toast";
  toast.className = "order-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  const content = document.createElement("div");
  content.className = "order-toast__content";

  const icon = document.createElement("span");
  icon.className = "order-toast__icon";
  icon.textContent = "🎉";

  const text = document.createElement("div");
  text.className = "order-toast__text";

  const title = document.createElement("p");
  title.className = "order-toast__title";
  title.textContent = "Thank you so much for buying our course!";

  const sub = document.createElement("p");
  sub.className = "order-toast__sub";
  sub.textContent =
    "We'll be in touch shortly with all the details. Welcome aboard!";

  text.appendChild(title);
  text.appendChild(sub);
  content.appendChild(icon);
  content.appendChild(text);

  const closeBtn = document.createElement("button");
  closeBtn.className = "order-toast__close";
  closeBtn.setAttribute("aria-label", "Dismiss");
  closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;
  closeBtn.addEventListener("click", () => dismissToast(toast));

  toast.appendChild(content);
  toast.appendChild(closeBtn);
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("is-visible"));
  });

  setTimeout(() => dismissToast(toast), 5000);
}

function dismissToast(toast) {
  if (!toast || !toast.isConnected) return;
  toast.classList.remove("is-visible");
  toast.addEventListener("transitionend", () => toast.remove(), { once: true });
}
