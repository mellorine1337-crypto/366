const revealItems = [...document.querySelectorAll(".reveal")];
const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
const headerNode = document.querySelector(".site-header");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

revealItems.forEach((item) => {
  const siblings = [...item.parentElement.children].filter((node) =>
    node.classList.contains("reveal"),
  );
  const index = siblings.indexOf(item);

  if (index >= 0) {
    item.style.setProperty("--delay", `${Math.min(index, 4) * 90}ms`);
  }
});

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const syncScrollMotion = () => {
  const viewportCenter = window.innerHeight / 2;
  const scrollTop = window.scrollY || window.pageYOffset;

  if (headerNode) {
    headerNode.classList.toggle("is-compact", scrollTop > 24);
  }

  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.parallax || 0);

    if (!depth || prefersReducedMotion.matches) {
      item.style.setProperty("--parallax-shift", "0px");
      return;
    }

    const rect = item.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const shift = clamp((viewportCenter - elementCenter) * depth, -30, 30);

    item.style.setProperty("--parallax-shift", `${shift.toFixed(1)}px`);
  });
};

let ticking = false;

const requestScrollMotion = () => {
  if (ticking) {
    return;
  }

  ticking = true;

  window.requestAnimationFrame(() => {
    syncScrollMotion();
    ticking = false;
  });
};

syncScrollMotion();

if (!prefersReducedMotion.matches) {
  window.addEventListener("scroll", requestScrollMotion, { passive: true });
  window.addEventListener("resize", requestScrollMotion);
}

const yearNode = document.querySelector("#year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
