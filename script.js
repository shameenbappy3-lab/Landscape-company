// ── Intersection Observer (section fade-ins) ───────────────────
const animatedSections = document.querySelectorAll(".section-fade");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || "0";
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

animatedSections.forEach((el, index) => {
  el.dataset.delay = String((index % 5) * 75);
  observer.observe(el);
});

// ── Mobile menu ────────────────────────────────────────────────
const menuToggle = document.querySelector(".menu-toggle");
const mainNav    = document.querySelector(".main-nav");
const navLinks   = document.querySelectorAll(".main-nav a");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    })
  );
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ── Scroll — header border & orb parallax ─────────────────────
const header = document.querySelector(".site-header");
const orbs   = document.querySelectorAll(".bg-orb");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (header) {
    header.style.borderBottomColor =
      y > 30 ? "rgb(255 255 255 / 14%)" : "rgb(255 255 255 / 7%)";
  }
  orbs.forEach((orb, idx) => {
    const speed = idx === 0 ? 0.07 : -0.05;
    orb.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });

// ── Contact form ───────────────────────────────────────────────
// ── Contact form ───────────────────────────────────────────────
const form       = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");

if (form && formStatus) {
  const formStart = document.querySelector("#form-start");
  if (formStart) formStart.value = String(Date.now());

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // UI Feedback
    formStatus.className = "form-status";
    formStatus.textContent = "Sending your request...";

    const formData  = new FormData(form);
    const data      = Object.fromEntries(formData.entries());
    
    // Security Checks
    const tooFast   = data._formStart && Date.now() - Number(data._formStart) < 3000;
    const hasHoney  = typeof data._honey === "string" && data._honey.trim().length > 0;

    if (tooFast || hasHoney) {
      formStatus.classList.add("error");
      formStatus.textContent = "Please wait a moment and try again.";
      return;
    }

    try {
      // Professional API Call to your Vercel Function
      const res = await fetch('/api/send', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json" 
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Network error");

      // Analytics Trigger
      if (typeof window.gtag === "function") {
        window.gtag("event", "form_submit", { method: "resend_api", form_name: "estimate_form" });
      }

      // Success: Instant redirect to your custom thank-you page
      window.location.href = "thank-you.html";

    } catch (error) {
      // Fallback: This only triggers if the API fails
      console.error("Submission error:", error);
      formStatus.classList.add("error");
      formStatus.textContent = "Submission failed. Please call or WhatsApp us directly.";
    }
  });
}
// ── Footer year ────────────────────────────────────────────────
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());


// ── Analytics — call & WhatsApp click tracking ─────────────────
document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "call_click", { location: "floating_button" });
    }
  });
});

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_click", { location: "floating_button" });
    }
  });
});