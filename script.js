const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const yearElement = document.querySelector("#current-year");
const heroCanvas = document.querySelector(".hero-canvas");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (heroCanvas) {
  const context = heroCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let frame = 0;
  let animationId;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = heroCanvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    heroCanvas.width = Math.floor(width * ratio);
    heroCanvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const drawHeroVisual = () => {
    frame += 0.006;
    context.clearRect(0, 0, width, height);

    const spacing = width < 720 ? 34 : 48;
    context.strokeStyle = "rgba(159, 176, 199, 0.12)";
    context.lineWidth = 1;

    for (let x = 0; x <= width + spacing; x += spacing) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height + spacing; y += spacing) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    for (let i = 0; i < 18; i += 1) {
      const x = ((i * 173 + frame * 2800) % (width + 160)) - 80;
      const y = height * (0.16 + ((i * 29) % 70) / 100);
      const pulse = 0.45 + Math.sin(frame * 5 + i) * 0.25;

      context.fillStyle = `rgba(57, 208, 200, ${pulse})`;
      context.beginPath();
      context.arc(x, y, i % 4 === 0 ? 3 : 2, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "rgba(104, 224, 167, 0.18)";
      context.beginPath();
      context.moveTo(x - 42, y);
      context.lineTo(x + 42, y);
      context.stroke();
    }

    animationId = window.requestAnimationFrame(drawHeroVisual);
  };

  resizeCanvas();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawHeroVisual();
  }

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationId);
    resizeCanvas();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawHeroVisual();
    }
  });
}
