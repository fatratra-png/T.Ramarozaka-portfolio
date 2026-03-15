const STORAGE_KEY = "cart";

export let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

export function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addToCart(course) {
  if (!cart.find(c => c.id === course.id)) {
    cart.push(course);
    saveCart();
    updateCartBadge();
  }
}

export function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  badge.textContent = cart.length;
  badge.style.display = cart.length ? "flex" : "none";
}
