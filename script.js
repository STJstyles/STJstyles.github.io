// Mark that JS is running, so scroll animations only apply when they can finish
document.documentElement.classList.add("js");

// ===== Header shadow after scrolling =====
const header = document.getElementById("header");
function updateHeader() { header.classList.toggle("scrolled", window.scrollY > 10); }
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ===== Mobile menu =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ===== Highlight the nav link for the section on screen =====
const navLinks = {};
nav.querySelectorAll(':scope > a[href^="#"]').forEach((a) => { navLinks[a.getAttribute("href").slice(1)] = a; });

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = navLinks[entry.target.id];
      if (!link) return;
      Object.values(navLinks).forEach((a) => a.classList.remove("active"));
      link.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));
}

// ===== Fade cards in as you scroll =====
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el) => revealObserver.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("visible"));
}

// ===== Copy email =====
const copyBtn = document.getElementById("copyBtn");
const email = document.getElementById("email");

copyBtn.addEventListener("click", async () => {
  const text = email.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
  } catch (e) {
    const range = document.createRange();
    range.selectNodeContents(email);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    copyBtn.textContent = "Press Ctrl+C";
  }
  setTimeout(() => { copyBtn.textContent = "Copy email"; }, 1800);
});

// ===== Show the resume button only if resume.pdf exists =====
const resumeBtn = document.getElementById("resumeBtn");
if (location.protocol.startsWith("http")) {
  fetch("resume.pdf", { method: "HEAD" })
    .then((res) => { if (res.ok) resumeBtn.hidden = false; })
    .catch(() => { /* no resume yet */ });
}

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
