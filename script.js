document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Intro screen ---------- */
document.body.classList.add('intro-active');
const introScreen = document.getElementById('introScreen');
window.addEventListener('load', () => {
  setTimeout(() => {
    if (introScreen) introScreen.classList.add('is-hidden');
    document.body.classList.remove('intro-active');
  }, 1500);
});
setTimeout(() => {
  if (introScreen) introScreen.classList.add('is-hidden');
  document.body.classList.remove('intro-active');
}, 3000);

/* ---------- Header state on scroll ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Word-splitting for reveal-words elements ---------- */
document.querySelectorAll('.reveal-words').forEach((el) => {
  const text = el.textContent;
  const words = text.split(/\s+/).filter(Boolean);
  el.innerHTML = words
    .map((w, i) => `<span class="word"><span class="word-inner" style="transition-delay:${i * 0.04}s">${w}</span></span>`)
    .join(' ');
});

/* ---------- Scroll reveal (handles [data-reveal] and .reveal-words) ---------- */
const revealEls = document.querySelectorAll('[data-reveal], .reveal-words');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

/* ---------- Hero image reveal ---------- */
window.requestAnimationFrame(() => {
  const heroImg = document.querySelector('.hero__img');
  if (heroImg) heroImg.classList.add('is-visible');
});

/* ---------- Depth rail ---------- */
const depthFill = document.getElementById('depthFill');
const railLabels = document.querySelectorAll('.depth-rail__labels li');
const sectionIds = ['hero', 'situations', 'accompagnement', 'approche', 'qui-suis-je', 'temoignages'];
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

function updateDepthRail() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
  if (depthFill) depthFill.style.height = progress + '%';
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.5) activeIndex = i;
  });
  railLabels.forEach((li, i) => li.classList.toggle('is-active', i === activeIndex));
}
window.addEventListener('scroll', updateDepthRail, { passive: true });
window.addEventListener('resize', updateDepthRail);
updateDepthRail();
railLabels.forEach((li) => {
  li.addEventListener('click', () => {
    const target = document.getElementById(li.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- Testimonials carousel ---------- */
const track = document.getElementById('testimonialsTrack');
const dotsWrap = document.getElementById('testimonialDots');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const cards = track ? Array.from(track.children) : [];
let currentIndex = 0;
function cardsPerView() { return window.innerWidth >= 1000 ? 3 : window.innerWidth >= 640 ? 2 : 1; }
function maxIndex() { return Math.max(0, cards.length - cardsPerView()); }
function renderDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  const total = maxIndex() + 1;
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = i === currentIndex ? 'is-active' : '';
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
}
function goTo(index) {
  currentIndex = Math.max(0, Math.min(index, maxIndex()));
  if (!cards.length) return;
  const cardWidth = cards[0].getBoundingClientRect().width + 24;
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  renderDots();
}
prevBtn && prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn && nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
window.addEventListener('resize', () => goTo(currentIndex));
renderDots();

/* ---------- Smooth in-page nav ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ---------- Custom cursor ---------- */
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  function animateCursor() {
    curX += (mouseX - curX) * 0.2;
    curY += (mouseY - curY) * 0.2;
    cursorDot.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = document.querySelectorAll('a, button, .situation-card, .service-card');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hover'));
  });

  const darkZones = document.querySelectorAll('.hero, .role, .approche, .footer, .service-card');
  window.addEventListener('scroll', () => {
    let overDark = false;
    darkZones.forEach((z) => {
      const r = z.getBoundingClientRect();
      if (r.top < window.innerHeight / 2 && r.bottom > window.innerHeight / 2) overDark = true;
    });
    cursorDot.classList.toggle('is-dark', overDark);
  }, { passive: true });
}

/* ---------- Magnetic buttons ---------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}

/* ---------- Animated stat counters ---------- */
document.querySelectorAll('.stat__num').forEach((el) => {
  const target = parseInt(el.dataset.count, 10) || 0;
  const suffix = el.dataset.suffix || '';
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - start) / duration);
          const current = Math.floor(progress * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(el);
});

/* ---------- Stat headlines: pop-in animation matching the counters ---------- */
document.querySelectorAll('.stat__headline').forEach((el) => {
  const headlineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        el.classList.add('is-counted');
        headlineObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  headlineObserver.observe(el);
});

/* ---------- Service cards: darken progressively as they scroll through the viewport ---------- */
const darkenCards = document.querySelectorAll('.service-card');
function updateCardDarkening() {
  const vh = window.innerHeight;
  darkenCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    let progress = 1 - (rect.top / vh);
    progress = Math.max(0, Math.min(1, progress));
    const strength = 0.35 + progress * 0.62;
    card.style.setProperty('--overlay-strength', strength.toFixed(2));
  });
}
window.addEventListener('scroll', updateCardDarkening, { passive: true });
window.addEventListener('resize', updateCardDarkening);
updateCardDarkening();
