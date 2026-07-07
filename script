// ==========================================================================
// VOIES BASSES — interactions
// ==========================================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Header state on scroll ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

/* ---------- Hero image reveal (immediate, separate from scroll) ---------- */
window.requestAnimationFrame(() => {
  const heroImg = document.querySelector('.hero__img');
  if (heroImg) heroImg.classList.add('is-visible');
});

/* ---------- Depth rail: progress fill + active section label ---------- */
const depthFill = document.getElementById('depthFill');
const railLabels = document.querySelectorAll('.depth-rail__labels li');
const sectionIds = ['hero', 'situations', 'accompagnement', 'approche', 'qui-suis-je', 'temoignages'];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

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

function cardsPerView() {
  return window.innerWidth >= 1000 ? 3 : window.innerWidth >= 640 ? 2 : 1;
}

function maxIndex() {
  return Math.max(0, cards.length - cardsPerView());
}

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
  const cardWidth = cards[0].getBoundingClientRect().width + 24; // gap
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
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
