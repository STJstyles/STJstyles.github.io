// Mark that JS is running, so scroll animations only apply when they can finish
document.documentElement.classList.add("js");

// ===== Light / dark theme =====
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeButton() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  themeBtn.textContent = next === "dark" ? "Dark" : "Light";
  themeBtn.setAttribute("aria-label", "Switch to " + next + " mode");
}

try {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
} catch (e) { /* storage blocked, use system theme */ }
updateThemeButton();

themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  updateThemeButton();
});

// ===== Mobile menu =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ===== Highlight the nav link for the section on screen =====
const sections = document.querySelectorAll("main section[id]");
const linkFor = {};
navLinks.querySelectorAll('a[href^="#"]').forEach((a) => { linkFor[a.getAttribute("href").slice(1)] = a; });

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      Object.values(linkFor).forEach((a) => a.classList.remove("active"));
      const link = linkFor[entry.target.id];
      if (link) link.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => navObserver.observe(s));
}

// ===== Fade sections in as you scroll =====
const revealItems = document.querySelectorAll(".card, .project, .timeline > li, .looking li");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el) => { el.classList.add("reveal"); revealObserver.observe(el); });
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
