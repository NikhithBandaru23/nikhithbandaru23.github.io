// =============================================
// NIKHITH BANDARU PORTFOLIO — script.js
// =============================================

console.log("Designed & Developed by Nikhith Bandaru");

/* ── NAV ACTIVE STATE ── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active',
      href === page ||
      (page === '' && href === 'index.html') ||
      (page === 'index.html' && href === 'index.html')
    );
  });
}
setActiveNav();

/* ── SCROLL NAV ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER ── */
const ham = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (ham && mobileNav) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // close on link click
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobileNav.classList.remove('open');
  }));
}

/* ── CANVAS WATER MESH ── */
const canvas = document.getElementById('bgc');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, mx = 0, my = 0;
  const rsz = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
  rsz(); window.addEventListener('resize', rsz);

  class Node {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - .5) * .28;
      this.vy = -(Math.random() * .38 + .07);
      this.r = Math.random() * 1.4 + .3;
      this.life = 0;
      this.ml = Math.random() * 600 + 350;
      this.h = 190 + Math.random() * 50;
    }
    update() {
      const dx = this.x - mx, dy = this.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 140) { const f = (140 - d) / 140 * .36; this.vx += dx / d * f; this.vy += dy / d * f; }
      this.vx *= .992; this.vy *= .992;
      this.x += this.vx; this.y += this.vy;
      this.life++;
      if (this.life > this.ml || this.y < -20) this.reset(false);
    }
  }

  const nodes = Array.from({ length: 85 }, () => new Node());

  function drawBg() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 115) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,180,220,${(1 - d / 115) * .09})`;
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      const t = n.life / n.ml, a = t < .1 ? t * 10 : t > .8 ? (1 - t) * 5 : 1;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.h},80%,65%,${a * .38})`; ctx.fill();
      n.update();
    });
    requestAnimationFrame(drawBg);
  }
  drawBg();

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
}

/* ── BLOB PARALLAX ── */
const blobs = document.querySelectorAll('.blob');
document.addEventListener('mousemove', e => {
  const xn = (e.clientX / innerWidth - .5) * 2;
  const yn = (e.clientY / innerHeight - .5) * 2;
  blobs.forEach((b, i) => {
    const d = (i + 1) * 16;
    b.style.transform = `translate(${xn * d}px,${yn * d}px)`;
  });
});

/* ── CLICK RIPPLE ── */
document.addEventListener('click', e => {
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div'); d.className = 'wd';
    const s = 14 + i * 28;
    d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - s / 2}px;top:${e.clientY - s / 2}px;animation-delay:${i * .1}s;animation-duration:${1 + i * .2}s`;
    document.body.appendChild(d); setTimeout(() => d.remove(), 2000);
  }
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div'); p.className = 'wp';
    const s = Math.random() * 4 + 2;
    p.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX + (Math.random() - .5) * 32}px;top:${e.clientY + (Math.random() - .5) * 32}px;animation-duration:${.7 + Math.random() * .7}s;animation-delay:${Math.random() * .15}s`;
    document.body.appendChild(p); setTimeout(() => p.remove(), 1500);
  }
});

/* ── GLASS TILT ── */
document.querySelectorAll('.g').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `translateY(-4px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.005)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

/* ── SCROLL REVEAL ── */
const revIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('vis'); revIO.unobserve(en.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revIO.observe(el));

/* ── SKILL BARS (skills page) ── */
const skillIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.querySelectorAll('.skill-fill').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
      skillIO.unobserve(en.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-cat').forEach(el => skillIO.observe(el));

/* ── CONTACT FORM ── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    form.reset();
    setTimeout(() => toast.classList.remove('show'), 3500);
  });
}

/* ── SMOOTH PAGE LOAD ── */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity .4s';
window.addEventListener('load', () => { document.body.style.opacity = '1'; });

/* ══════════════════════════════════════
   BUBBLE CURSOR
══════════════════════════════════════ */
(function() {
  // Create bubble elements
  const bubble = document.createElement('div');
  bubble.id = 'bubble-cursor';
  document.body.appendChild(bubble);

  const ball = document.createElement('div');
  ball.id = 'bubble-ball';
  document.body.appendChild(ball);

  // Target mouse position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Bubble (outer ring) — slow lag
  let bx = mouseX, by = mouseY;

  // Ball (inner dot) — faster, offset inside bubble
  let ballX = mouseX, ballY = mouseY;

  // Offset: ball floats inside bubble slightly toward cursor direction
  let velX = 0, velY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover effect on interactive elements
  const interactiveEls = 'a, button, input, textarea, .g, .proj-card, .int-item, .tool-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveEls)) {
      bubble.classList.add('hovering');
      ball.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveEls)) {
      bubble.classList.remove('hovering');
      ball.classList.remove('hovering');
    }
  });

  function animateCursor() {
    // Bubble ring follows mouse with soft lag
    bx += (mouseX - bx) * 0.10;
    by += (mouseY - by) * 0.10;
    bubble.style.left = bx + 'px';
    bubble.style.top  = by + 'px';

    // Ball follows mouse faster, with a slight gravity-like offset
    // giving the "floating ball inside bubble" feel
    const dx = mouseX - bx;
    const dy = mouseY - by;

    // Ball leans inside bubble toward the cursor direction (max offset ~12px)
    const maxOffset = 12;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const offsetX = dist > 0 ? (dx / dist) * Math.min(dist * 0.5, maxOffset) : 0;
    const offsetY = dist > 0 ? (dy / dist) * Math.min(dist * 0.5, maxOffset) : 0;

    ballX += (bx + offsetX - ballX) * 0.18;
    ballY += (by + offsetY - ballY) * 0.18;

    ball.style.left = ballX + 'px';
    ball.style.top  = ballY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hide on mouse leave, show on enter
  document.addEventListener('mouseleave', () => {
    bubble.style.opacity = '0';
    ball.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    bubble.style.opacity = '1';
    ball.style.opacity = '1';
  });
})();
