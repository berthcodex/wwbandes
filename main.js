/* ============================
   ANDES TECH & DATA PARTNERS
   main.js – v5 Interactive
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
      const p    = Math.min((ts - start) / 1400, 1);
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

// ── Card spotlight / mouse glow effect ────────
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
  card.addEventListener('mouseleave', function() {
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  });
});

// ── Magnetic hover on CTA buttons ─────────────
document.querySelectorAll('.btn-primary, .cf-submit, .plan-link--solid').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.18;
    const dy = (e.clientY - cy) * 0.18;
    this.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// ── Hero parallax on mouse ────────────────────
const heroSection = document.querySelector('.hero');
const heroShapes  = document.querySelector('.hero-bg-shapes');
if (heroSection && heroShapes) {
  heroSection.addEventListener('mousemove', function(e) {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    const hbs1 = heroShapes.querySelector('.hbs-1');
    const hbs2 = heroShapes.querySelector('.hbs-2');
    if (hbs1) hbs1.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
    if (hbs2) hbs2.style.transform = `translate(${x * -12}px, ${y * -12}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    const hbs1 = heroShapes.querySelector('.hbs-1');
    const hbs2 = heroShapes.querySelector('.hbs-2');
    if (hbs1) hbs1.style.transform = '';
    if (hbs2) hbs2.style.transform = '';
  });
}

// ── Stat items stagger on scroll ──────────────
const statObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const items = e.target.querySelectorAll('.stat-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('in'), i * 80);
      });
      obs.unobserve(e.target);
    }
  });
}, { threshold: .2 });
const statGrid = document.querySelector('.stats-grid');
if (statGrid) {
  statGrid.querySelectorAll('.stat-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(16px)';
    item.style.transition = 'opacity .5s ease, transform .5s ease';
  });
  statGrid.addEventListener('transitionend', () => {}, { once: true });
  statObs.observe(statGrid);
  document.addEventListener('DOMContentLoaded', () => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.stat-item').forEach((item, i) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, i * 90);
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: .25 }).observe(e.target);
  });
}

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

// ── Active nav link on scroll ─────────────────
const sections = document.querySelectorAll('section[id], div[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => scrollSpy.observe(s));

// ── Contact form ──────────────────────────────
const form      = document.getElementById('contactForm');
const feedback  = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  // Floating label interaction
  form.querySelectorAll('.cf-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.cf-field').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.cf-field').classList.remove('focused');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.cf-submit');
    btn.classList.add('sending');
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      btn.classList.remove('sending');
      submitBtn.textContent = 'Enviar mensaje';
      feedback.innerHTML = '✓ ¡Mensaje enviado! Te contactamos pronto.';
      feedback.style.color = '#16a34a';
      form.reset();
      setTimeout(() => { feedback.innerHTML = ''; }, 5000);
    }, 1800);
  });
}

// ── Tilt on plan cards ────────────────────────
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
  });
});
