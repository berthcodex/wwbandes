/* ============================
   ANDES TECH & DATA PARTNERS
   main.js – Premium v2
   ============================ */

// ── Custom Cursor ──────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
if (window.matchMedia('(hover: hover)').matches) {
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
  document.querySelectorAll('a,button,.svc-card,.plan-card,.testi-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '48px';
      follower.style.height = '48px';
      follower.style.borderColor = 'rgba(201,168,76,.6)';
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
  const open = navMobile.classList.contains('open');
  const spans = burger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.transform = 'rotate(-45deg) translate(4px,-4px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
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
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Hero canvas: animated particle grid ────────
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], lines = [];
  const COLS = 12, ROWS = 8, N_PARTICLES = 40;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildGrid();
  }

  function buildGrid() {
    lines = [];
    const cw = W / COLS, rh = H / ROWS;
    // vertical
    for (let c = 0; c <= COLS; c++) lines.push([c*cw,0,c*cw,H]);
    // horizontal
    for (let r = 0; r <= ROWS; r++) lines.push([0,r*rh,W,r*rh]);
    // Reset particles
    particles = Array.from({length: N_PARTICLES}, () => makeParticle());
  }

  function makeParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4,
      r: Math.random() * 1.5 + .5,
      a: Math.random(),
      gold: Math.random() > .6
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(47,117,181,0.06)';
    ctx.lineWidth = 1;
    lines.forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.gold
        ? `rgba(201,168,76,${p.a * .6})`
        : `rgba(47,117,181,${p.a * .5})`;
      ctx.fill();
    });

    // Connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(47,117,181,${(1 - dist/120) * 0.15})`;
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
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── Hero title lines stagger ───────────────────
document.querySelectorAll('.hero-title .line').forEach(line => {
  const delay = line.dataset.delay || 0;
  line.style.animationDelay = delay + 'ms';
});

// ── Counter animation ──────────────────────────
function animateCount(el, to, dur = 1400) {
  let start = null;
  const from = 0;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(from + (to - from) * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateCount(el, parseInt(el.dataset.target, 10));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('.metric-num[data-target]').forEach(el => counterObserver.observe(el));

// ── Contact form ───────────────────────────────
const form = document.getElementById('contactForm');
const submitTxt = document.getElementById('submitTxt');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    submitTxt.textContent = '✓ Solicitud enviada — te contactamos pronto';
    btn.disabled = true;
    btn.style.opacity = '.8';
    setTimeout(() => {
      submitTxt.textContent = 'Enviar solicitud';
      btn.disabled = false;
      btn.style.opacity = '';
      form.reset();
    }, 5000);
  });
}

// ── Parallax on hero orbs ──────────────────────
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.hero-glow-orb').forEach((orb, i) => {
    orb.style.transform = `translateY(${sy * (i === 0 ? .08 : .05)}px)`;
  });
  document.querySelectorAll('.cta-orb').forEach((orb, i) => {
    orb.style.transform = `translateY(${sy * (i === 0 ? .04 : .03)}px)`;
  });
}, { passive: true });
