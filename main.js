// ============================
// ANDES TECH & DATA PARTNERS
// Main JS
// ============================

// --- NAV scroll effect ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// --- Mobile menu ---
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const isOpen = mobileMenu.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// --- Intersection Observer: fade-in on scroll ---
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.service-card, .step, .pricing-card, .testimonial-card, .why__feature, .why__card, .contact-form'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
  observer.observe(el);
});

// Add .visible styles via JS
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// --- Contact form ---
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ Solicitud enviada — te contactamos pronto';
    btn.disabled = true;
    btn.style.background = 'linear-gradient(135deg, #1a9c6b, #22c55e)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 5000);
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Stats counter animation ---
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const prefix = el.textContent.startsWith('+') ? '+' : '';
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = prefix + Math.round(start);
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const num = entry.target;
      const raw = num.textContent.replace('+', '').replace(',', '');
      const val = parseInt(raw, 10);
      if (!isNaN(val)) animateCounter(num, val);
      statsObserver.unobserve(num);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num').forEach(el => statsObserver.observe(el));
