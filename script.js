const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];
let width = 0;
let height = 0;
let dpr = 1;

const initialHash = window.location.hash;
if (initialHash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo(0, 0);
  window.addEventListener(
    "load",
    () => {
      requestAnimationFrame(() => window.scrollTo(0, 0));
    },
    { once: true },
  );
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(180, Math.floor((width * height) / 7800));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.8 + 0.3,
    a: Math.random() * 0.7 + 0.18,
    vx: (Math.random() - 0.5) * 0.08,
    vy: Math.random() * 0.06 + 0.02,
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255, 246, 224, 0.85)";

  for (const star of stars) {
    star.x += star.vx;
    star.y += star.vy;
    if (star.y > height + 8) star.y = -8;
    if (star.x < -8) star.x = width + 8;
    if (star.x > width + 8) star.x = -8;

    ctx.globalAlpha = star.a * (0.7 + Math.sin((performance.now() / 900) + star.x) * 0.25);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

function parallax() {
  const y = window.scrollY || 0;
  const bg = document.querySelector(".hero-bg");
  const panels = document.querySelectorAll(".orbit-panel");
  if (bg) bg.style.transform = `scale(1.04) translate3d(0, ${Math.min(y * 0.05, 28)}px, 0)`;
  panels.forEach((panel, index) => {
    const drift = Math.sin((y / 220) + index) * 4;
    panel.style.translate = `0 ${drift}px`;
  });
}

resize();
draw();
parallax();

window.addEventListener("resize", resize, { passive: true });
window.addEventListener("scroll", parallax, { passive: true });
