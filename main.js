/* ============================
   ANDES TECH & DATA PARTNERS
   main.js – v4 McKinsey Light
   ============================ */

// ── Nav scroll ────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
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
}, { threshold: .08, rootMargin: '0px 0px -36px 0px' });
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
      const p    = Math.min((ts - start) / 1300, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * ease);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
    obs.unobserve(el);
  });
}, { threshold: .5 });
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

// ── Contact form ──────────────────────────────
const form     = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');
const submitTxt = document.getElementById('submitTxt');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.classList.add('sending');
    submitTxt.textContent = 'Enviando...';

    setTimeout(() => {
      submitBtn.classList.remove('sending');
      submitTxt.textContent = 'Enviar mensaje →';
      feedback.innerHTML = '✓ ¡Mensaje enviado! Te contactaremos pronto.';
      form.reset();
      setTimeout(() => { feedback.innerHTML = ''; }, 5000);
    }, 1800);
  });
}
