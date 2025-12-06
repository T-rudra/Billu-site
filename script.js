/* script.js
   Shared JS for World Explorer Travel
   - Navigation highlighting
   - Gallery slider logic
   - Contact form handling
*/

/* -----------------------------
   Utility: safe query selector
   ----------------------------- */
function $qs(sel, root = document) { return root.querySelector(sel); }
function $qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

/* -----------------------------
   Navigation highlighting
   - uses window.location.pathname when possible
   - falls back to data-page attribute on body
   ----------------------------- */
function highlightNav() {
  const navLinks = $qsa(".nav-link");
  // Determine page key from location or body data-page
  const bodyPage = document.body.getAttribute("data-page");
  let pageKey = null;

  if (bodyPage) {
    pageKey = bodyPage.toLowerCase();
  } else {
    // derive from pathname (works for local file:// too)
    const path = window.location.pathname || "";
    const file = path.split("/").pop() || "index.html";
    pageKey = file.split(".")[0].toLowerCase();
  }

  navLinks.forEach(link => {
    // remove existing
    link.classList.remove("active");
    // compare href filename to pageKey
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href.includes(pageKey) || (pageKey === "index" && (href === "" || href.includes("index")))) {
      link.classList.add("active");
    }
  });
}

/* -----------------------------
   Gallery slider logic
   - uses #gallery-main-img, #gallery-caption, #prev-btn, #next-btn, #gallery-indicator
   ----------------------------- */
const Gallery = (function () {
  // Array of image objects: src + caption
  const images = [
    {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=60&auto=format&fit=crop",
      caption: "Turquoise lagoon and sun-drenched beaches — perfect for relaxation."
    },
    {
      src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=60&auto=format&fit=crop",
      caption: "City skylines and cultural nights — explore vibrant urban life."
    },
    {
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=60&auto=format&fit=crop",
      caption: "Snow-capped mountains and alpine trails for active explorers."
    },
    {
      src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600&q=60&auto=format&fit=crop",
      caption: "Sunset over historic streets and hidden cafés."
    },
    {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=60&auto=format&fit=crop",
      caption: "Waves and palm trees — island living at its best."
    },
    {
      src: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1600&q=60&auto=format&fit=crop",
      caption: "Rugged coastlines and dramatic cliffs for scenic drives."
    }
  ];

  let currentIndex = 0;

  function updateView() {
    const imgEl = $qs("#gallery-main-img");
    const captionEl = $qs("#gallery-caption");
    const indicatorEl = $qs("#gallery-indicator");

    if (!imgEl || !captionEl || !indicatorEl) return;

    const item = images[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.caption || `Image ${currentIndex + 1}`;
    captionEl.textContent = item.caption || "";
    indicatorEl.textContent = `Image ${currentIndex + 1} of ${images.length}`;
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    updateView();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateView();
  }

  function attachEvents() {
    const nextBtn = $qs("#next-btn");
    const prevBtn = $qs("#prev-btn");

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // allow keyboard arrow navigation when gallery is present
    window.addEventListener("keydown", function (e) {
      if (!$qs("#gallery-main-img")) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  function init() {
    // only initialize if gallery DOM exists
    if (!$qs("#gallery-main-img")) return;
    updateView();
    attachEvents();
  }

  return { init };
})();

/* -----------------------------
   Contact form handling
   - basic validation + submit handler
   ----------------------------- */
function setupContactForm() {
  const form = $qs("#contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Simple required field checks in addition to HTML constraints
    const name = $qs("#fullName").value.trim();
    const email = $qs("#email").value.trim();
    const message = $qs("#message").value.trim();

    // Use HTML5 validity as base
    if (!form.checkValidity()) {
      // If browser supports reportValidity, show native messages
      if (typeof form.reportValidity === "function") {
        form.reportValidity();
      } else {
        alert("Please fill in the required fields correctly.");
      }
      return;
    }

    // Extra checks
    if (!name || !email || !message) {
      alert("Please complete the required fields (Name, Email, Message).");
      return;
    }

    // All good - show confirmation
    alert(`Thank you, ${name}! Your inquiry has been submitted.`);

    // Optionally, clear form (or leave to user). We'll reset for demo.
    form.reset();
  });
}

/* -----------------------------
   DOMContentLoaded init
   ----------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  highlightNav();
  Gallery.init();
  setupContactForm();
});
