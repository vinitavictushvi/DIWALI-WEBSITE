
// ==========================================
// DEEPAVALI.26 — INTERACTIVE EXPERIENCE
// ==========================================

// 1. INTRO + MUSIC
const introScreen = document.getElementById("introScreen");
const enterButton = document.getElementById("enterButton");
const music = document.getElementById("diwaliMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

function updateMusicUI() {
  const playing = !music.paused;

  musicToggle.classList.toggle("playing", playing);
  musicIcon.textContent = playing ? "♫" : "♪";
  musicLabel.textContent = playing ? "SOUND ON" : "SOUND OFF";
}

async function toggleMusic() {
  if (music.paused) {
    try {
      await music.play();
    } catch (error) {
      console.warn("Check assets/diwali-music.mp3", error);
      musicLabel.textContent = "MUSIC UNAVAILABLE";
    }
  } else {
    music.pause();
  }

  updateMusicUI();
}

enterButton.addEventListener("click", async () => {
  introScreen.classList.add("hide");

  // Music starts only after the visitor's click.
  await toggleMusic();

  setTimeout(() => {
    introScreen.style.display = "none";
  }, 1100);
});

musicToggle.addEventListener("click", toggleMusic);
music.addEventListener("play", updateMusicUI);
music.addEventListener("pause", updateMusicUI);

// 2. SCROLL REVEAL
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

// 3. 3D CARD TILT
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".festival-card").forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = (x / rect.width - 0.5) * 7;
      const rotateX = (0.5 - y / rect.height) * 7;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// 4. CURSOR GLOW
const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", event => {
    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
  });
}

// 5. DIWALI COUNTDOWN
// Target: 8 November 2026, 00:00 IST.
const diwaliDate = new Date(
  "2026-11-08T00:00:00+05:30"
).getTime();

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdown-message");

function updateCountdown() {
  const distance = diwaliDate - Date.now();

  if (distance <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    countdownMessage.textContent =
      "The celebration is here. Happy Diwali!";

    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// 6. PERSONALIZED WISH GENERATOR
const nameInput = document.getElementById("userName");
const generateButton = document.getElementById("generateBtn");
const wishResult = document.getElementById("wishResult");
const shareButton = document.getElementById("shareBtn");

const greetings = [
  "May your home shine with happiness and your heart glow with peace.",
  "May this Diwali bring beautiful beginnings and endless opportunities.",
  "May every diya bring hope and every moment create a lovely memory.",
  "Wishing you a life filled with light, laughter, love and prosperity.",
  "May your dreams sparkle brighter than the Diwali lights.",
  "May happiness find its way to your home and stay forever.",
  "May the festival of lights fill your days with warmth and joy."
];

let generatedGreeting = "";

function createGreeting() {
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    nameInput.setCustomValidity("Please enter your name first.");
    nameInput.reportValidity();
    return;
  }

  nameInput.setCustomValidity("");

  const greeting =
    greetings[Math.floor(Math.random() * greetings.length)];

  generatedGreeting =
    `Happy Diwali 2026, ${name}!\n\n${greeting}\n\n` +
    "Wishing you and your family a beautiful and prosperous Diwali. 🪔✨";

  wishResult.style.opacity = "0";

  setTimeout(() => {
    // textContent prevents user input from being interpreted as HTML.
    wishResult.textContent = generatedGreeting;
    wishResult.style.opacity = "1";
    shareButton.hidden = false;
  }, 180);
}

generateButton.addEventListener("click", createGreeting);

nameInput.addEventListener("input", () => {
  nameInput.setCustomValidity("");
});

nameInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    createGreeting();
  }
});

shareButton.addEventListener("click", () => {
  if (!generatedGreeting) return;

  const url =
    "https://wa.me/?text=" +
    encodeURIComponent(generatedGreeting);

  window.open(url, "_blank", "noopener,noreferrer");
});

// 7. FLOATING GOLDEN PARTICLES
const particleCanvas = document.getElementById("particles");
const particleContext = particleCanvas.getContext("2d");

let particles = [];
let particleFrame = null;

function resizeParticleCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  particleCanvas.width = window.innerWidth * ratio;
  particleCanvas.height = window.innerHeight * ratio;

  particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  createParticles();
}

function createParticles() {
  const amount = Math.min(
    100,
    Math.floor(window.innerWidth / 12)
  );

  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.5 + 0.15,
    opacity: Math.random() * 0.55 + 0.15,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawParticles() {
  particleContext.clearRect(
    0, 0, window.innerWidth, window.innerHeight
  );

  particles.forEach(p => {
    p.y -= p.speed;
    p.phase += 0.018;

    if (p.y < -5) {
      p.y = window.innerHeight + 5;
      p.x = Math.random() * window.innerWidth;
    }

    const alpha =
      p.opacity * (0.65 + Math.sin(p.phase) * 0.35);

    particleContext.beginPath();
    particleContext.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    particleContext.fillStyle = `rgba(255,210,140,${alpha})`;
    particleContext.shadowColor = "#e6bd7b";
    particleContext.shadowBlur = 9;
    particleContext.fill();
  });

  particleContext.shadowBlur = 0;
}

function animateParticles() {
  drawParticles();
  particleFrame = requestAnimationFrame(animateParticles);
}

resizeParticleCanvas();
window.addEventListener("resize", resizeParticleCanvas);

if (!reducedMotion) {
  animateParticles();
}

// 8. FIREWORKS
const fireworksCanvas = document.getElementById("fireworksCanvas");
const fireworksContext = fireworksCanvas.getContext("2d");

let fireworks = [];
let rockets = [];
let fireworksFrame = null;
let fireworksRunning = false;

function resizeFireworksCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  fireworksCanvas.width = window.innerWidth * ratio;
  fireworksCanvas.height = window.innerHeight * ratio;

  fireworksContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

resizeFireworksCanvas();
window.addEventListener("resize", resizeFireworksCanvas);

const fireworkColors = [
  "#ffd166",
  "#ff9f68",
  "#f8e6a0",
  "#e7a6ff",
  "#ffffff"
];

function launchFirework() {
  if (reducedMotion) return;

  const color = fireworkColors[
    Math.floor(Math.random() * fireworkColors.length)
  ];

  rockets.push({
    x: window.innerWidth * (0.12 + Math.random() * 0.76),
    y: window.innerHeight,
    targetY: window.innerHeight * (0.12 + Math.random() * 0.35),
    speed: 6 + Math.random() * 3,
    color
  });

  startFireworks();
}

function explode(x, y, color) {
  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;

    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: Math.random() * 0.018 + 0.009,
      color,
      size: Math.random() * 2 + 1
    });
  }
}

function startFireworks() {
  if (fireworksRunning || reducedMotion) return;

  fireworksRunning = true;

  function animate() {
    fireworksContext.clearRect(
      0, 0, window.innerWidth, window.innerHeight
    );

    // Rocket movement
    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i];
      rocket.y -= rocket.speed;

      fireworksContext.beginPath();
      fireworksContext.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
      fireworksContext.fillStyle = rocket.color;
      fireworksContext.fill();

      if (rocket.y <= rocket.targetY) {
        explode(rocket.x, rocket.y, rocket.color);
        rockets.splice(i, 1);
      }
    }

    // Explosion particles
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035;
      p.vx *= 0.99;
      p.alpha -= p.decay;

      fireworksContext.globalAlpha = Math.max(0, p.alpha);
      fireworksContext.fillStyle = p.color;

      fireworksContext.beginPath();
      fireworksContext.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fireworksContext.fill();

      if (p.alpha <= 0) {
        fireworks.splice(i, 1);
      }
    }

    fireworksContext.globalAlpha = 1;

    if (rockets.length || fireworks.length) {
      fireworksFrame = requestAnimationFrame(animate);
    } else {
      fireworksRunning = false;
      fireworksFrame = null;
      fireworksContext.clearRect(
        0, 0, window.innerWidth, window.innerHeight
      );
    }
  }

  fireworksFrame = requestAnimationFrame(animate);
}

// Button interaction
document.getElementById("fireworksButton").addEventListener("click", () => {
  if (reducedMotion) return;

  for (let i = 0; i < 5; i++) {
    setTimeout(launchFirework, i * 350);
  }
});

// 9. PAUSE VISUAL EFFECTS WHEN TAB IS HIDDEN
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (particleFrame) {
      cancelAnimationFrame(particleFrame);
      particleFrame = null;
    }

    if (!music.paused) {
      music.pause();
    }
  } else if (!reducedMotion && !particleFrame) {
    animateParticles();
  }
});

