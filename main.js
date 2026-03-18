/* ============================
   ANDES TECH & DATA PARTNERS
   main.js – Premium v3
   ============================ */

// ── Custom Cursor ──────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
if (window.matchMedia('(hover: hover)').matches && cursor) {
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function loop() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.svc-card,.plan-card,.testi-card,.glass-form').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '44px';
      follower.style.height = '44px';
      follower.style.borderColor = 'rgba(201,168,76,.55)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width  = '28px';
      follower.style.height = '28px';
      follower.style.borderColor = 'rgba(201,168,76,.4)';
    });
  });
}

// ── Nav scroll effect ──────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile menu ────────────────────────────────
const burger    = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
burger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const open  = navMobile.classList.contains('open');
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)'  : '';
  spans[1].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ── Smooth scroll ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ── Ripple effect on .ripple elements ──────────
document.querySelectorAll('.ripple').forEach(el => {
  el.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const wave   = document.createElement('span');
    const size   = Math.max(rect.width, rect.height) * 2;
    wave.className = 'ripple-wave';
    wave.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
    `;
    this.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
});

// ── Hero canvas: particle grid ─────────────────
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const N = 45;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.4 + .5,
      a: Math.random() * .7 + .3,
      gold: Math.random() > .62
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid
    const COLS = 12, ROWS = 8;
    ctx.strokeStyle = 'rgba(47,117,181,0.055)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c*(W/COLS),0); ctx.lineTo(c*(W/COLS),H); ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0,r*(H/ROWS)); ctx.lineTo(W,r*(H/ROWS)); ctx.stroke();
    }

    // Particles & connections
    particles.forEach(p => {
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? `rgba(201,168,76,${p.a*.55})` : `rgba(47,117,181,${p.a*.5})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < 115) {
          ctx.strokeStyle = `rgba(47,117,181,${(1 - d/115) * .13})`;
          ctx.lineWidth = .5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ── Reveal on scroll ───────────────────────────
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' })
  .observe.bind(
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' })
  );

// Simpler, direct observer
const ro = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── Counter animation ──────────────────────────
const co = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el  = e.target;
    const to  = +el.dataset.target;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * ease);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    obs.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('.metric-num[data-target]').forEach(el => co.observe(el));

// ── Parallax on orbs ───────────────────────────
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.orb-1').forEach(o => { o.style.transform = `translateY(${sy*.08}px)`; });
  document.querySelectorAll('.orb-2').forEach(o => { o.style.transform = `translateY(${sy*.05}px)`; });
  document.querySelectorAll('.cta-orb--1').forEach(o => { o.style.transform = `translateY(${sy*.04}px)`; });
  document.querySelectorAll('.cta-orb--2').forEach(o => { o.style.transform = `translateY(${sy*.03}px)`; });
}, { passive: true });

// ── Contact form ───────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display   = 'none';
    document.getElementById('thankYou').style.display = 'block';
  });
}
