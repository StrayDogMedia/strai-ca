/* ============================================================
   StrAI.ca — shared site scripts (loaded on every page)
   Stray Dog Media — the stray is watching.
   Guarded so it is safe on the homepage and on subpages alike.
============================================================ */

// --- Language toggle (persists across pages via localStorage) ---
const HTML = document.documentElement;
const langBtn = document.getElementById('lang-btn');
let lang = localStorage.getItem('strai-lang') || 'fr';

function applyLang(l) {
  lang = l;
  localStorage.setItem('strai-lang', l);
  HTML.setAttribute('lang', l);
  HTML.setAttribute('data-lang', l);
  if (langBtn) langBtn.textContent = l === 'fr' ? 'EN' : 'FR';

  // Generic text swap
  document.querySelectorAll('[data-fr]').forEach(el => {
    const val = el.getAttribute('data-' + l);
    if (val != null) el.innerHTML = val;
  });

  // Page-driven <title> and meta description (each page carries its own strings)
  const title = HTML.getAttribute('data-title-' + l);
  if (title) document.title = title;
  const meta = document.getElementById('meta-desc');
  if (meta) {
    const d = meta.getAttribute('data-desc-' + l);
    if (d) meta.setAttribute('content', d);
  }

  // Form placeholders (data-driven, guarded)
  document.querySelectorAll('[data-ph-fr]').forEach(el => {
    const ph = el.getAttribute('data-ph-' + l);
    if (ph != null) el.placeholder = ph;
  });
}

if (langBtn) langBtn.addEventListener('click', () => applyLang(lang === 'fr' ? 'en' : 'fr'));

// --- Nav scroll ---
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// --- Mobile menu ---
const mobileBtn = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileBtn.classList.remove('active');
    });
  });
}

// --- Smooth scroll for on-page anchors (ignores bare "#" and cross-page links) ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth' });
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (mobileBtn) mobileBtn.classList.remove('active');
    }
  });
});

// --- Cursor glow (desktop only) ---
const glow = document.getElementById('cursor-glow');
if (glow) {
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }
  if (!('ontouchstart' in window)) {
    updateGlow();
    glow.style.opacity = '1';
  } else {
    glow.style.display = 'none';
  }
}

// --- Particles (homepage hero only) ---
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2
    };
  }
  for (let i = 0; i < 60; i++) particles.push(createParticle());
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      const pulse = Math.sin(t * p.pulseSpeed * 10 + p.pulsePhase) * 0.3 + 0.7;
      const alpha = p.opacity * pulse;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 174, 239, ${alpha})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(61, 255, 243, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// --- Hero orb parallax (no-op if no orbs on the page) ---
const orbs = document.querySelectorAll('.hero-orb');
if (orbs.length) {
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 15;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

// --- GSAP scroll reveals (shared) ---
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance (gsap.to — CSS pre-hides .gs-reveal, so from() would end at opacity 0)
  if (document.querySelector('#hero .gs-reveal')) {
    gsap.to('#hero .gs-reveal', { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.2 });
  }

  gsap.utils.toArray('.gs-reveal').forEach(el => {
    if (el.closest('#hero')) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    });
  });
  gsap.utils.toArray('.gs-reveal-left').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
    });
  });
  gsap.utils.toArray('.gs-reveal-right').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
    });
  });

  // Staggered grids (no-op if the trigger isn't on this page)
  [['.cap-grid', '.cap-card', 0.12], ['.forfaits-grid', '.forfait', 0.15], ['.examples-grid', '.example-card', 0.12]].forEach(([trigger, target, stagger]) => {
    if (document.querySelector(trigger)) {
      ScrollTrigger.create({
        trigger, start: 'top 85%', once: true,
        onEnter: () => gsap.to(target, { y: 0, opacity: 1, duration: 0.6, stagger, ease: 'power3.out' })
      });
    }
  });
}

// --- Easter egg (5 logo clicks → dog; homepage only) ---
const dogEl = document.getElementById('dog-egg');
const logoEl = document.getElementById('logo');
if (dogEl && logoEl) {
  let clicks = 0, clickT;
  logoEl.addEventListener('click', () => {
    clicks++;
    clearTimeout(clickT);
    clickT = setTimeout(() => { clicks = 0; }, 2000);
    if (clicks >= 5) {
      dogEl.classList.add('up');
      setTimeout(() => dogEl.classList.remove('up'), 3500);
      clicks = 0;
    }
  });
}

// Apply stored/default language once the DOM is ready (script is deferred)
applyLang(lang);
