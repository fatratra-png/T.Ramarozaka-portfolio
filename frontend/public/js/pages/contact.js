/**
 * contact.js
 * Handles the contact form submit feedback.
 * FIX: extracted from an inline <script> block in contact.html
 *      so that no inline JS exists anywhere in HTML.
 */

// FIX: named function instead of anonymous event handler
function handleContactFormSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById("contact-toast");
  if (!toast) return;
  toast.classList.add("is-visible");
  e.target.reset();
  // FIX: named function instead of anonymous arrow in setTimeout
  function hideToast() {
    toast.classList.remove("is-visible");
  }
  setTimeout(hideToast, 4000);
}

// FIX: named function to guard against missing element
function initContactPage() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", handleContactFormSubmit);
}

document.addEventListener("DOMContentLoaded", initContactPage);
