
function handleContactFormSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById("contact-toast");
  if (!toast) return;
  toast.classList.add("is-visible");
  e.target.reset();
  function hideToast() {
    toast.classList.remove("is-visible");
  }
  setTimeout(hideToast, 4000);
}

function initContactPage() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", handleContactFormSubmit);
}

document.addEventListener("DOMContentLoaded", initContactPage);
