/* ============================
   HIDATA GROUP
   main.js – v8 Refresh
   ============================ */

// ── Nav scroll (transparent → solid) ─────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ───────────────────────────────
const burger    = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
burger.addEventListener('click', () => {
  const open  = navMobile.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)'  : '';
  spans[1].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
});
navMobile.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  })
);

// ── Smooth scroll ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  });
});

// ── Reveal on scroll ──────────────────────────
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
  });
}, { threshold: .07, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Counter animation ─────────────────────────
const countObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = +el.dataset.target;
    let start = null;
    (function step(ts) {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / 1500, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * ease);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
    obs.unobserve(el);
  });
}, { threshold: .4 });
document.querySelectorAll('.count[data-target]').forEach(el => countObs.observe(el));

// ── Ripple effect ─────────────────────────────
document.querySelectorAll('.ripple').forEach(el => {
  el.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    this.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
});

// ── Card spotlight / mouse glow ───────────────
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  });
});

// ── Hero parallax: glow follows mouse ────────
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', function(e) {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    const g1 = heroSection.querySelector('.hero-glow--1');
    const g2 = heroSection.querySelector('.hero-glow--2');
    if (g1) g1.style.transform = `translate(${x * 24}px, ${y * 24}px)`;
    if (g2) g2.style.transform = `translate(${x * -16}px, ${y * -16}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    const g1 = heroSection.querySelector('.hero-glow--1');
    const g2 = heroSection.querySelector('.hero-glow--2');
    if (g1) g1.style.transform = '';
    if (g2) g2.style.transform = '';
  });
}

// ── Plan cards 3D tilt ────────────────────────
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
  });
});

// ── Marquee pause on hover ────────────────────
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ── Magnetic CTAs ─────────────────────────────
document.querySelectorAll('.btn-primary, .btn-ghost, .cf-submit').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2))  * 0.15;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.15;
    this.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// ── Active nav scroll spy ─────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe;
sections.forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

// ── Contact form ──────────────────────────────
const form      = document.getElementById('contactForm');
const feedback  = document.getElementById('formFeedback');
const submitTxt = document.getElementById('submitTxt');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.cf-submit');
    btn.classList.add('sending');
    submitTxt.textContent = 'Enviando...';

    setTimeout(() => {
      btn.classList.remove('sending');
      submitTxt.textContent = 'Enviar mensaje';
      feedback.innerHTML = '✓ ¡Mensaje enviado! Te contactamos pronto.';
      feedback.style.color = '#16a34a';
      form.reset();
      setTimeout(() => { feedback.innerHTML = ''; }, 5000);
    }, 1800);
  });
}
