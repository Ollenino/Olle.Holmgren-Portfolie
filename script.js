// ===== Config =====
const NAV_OFFSET = 80;

// ===== Helpers =====
const rafThrottle = (fn) => {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      window.requestAnimationFrame(() => { fn(...args); ticking = false; });
      ticking = true;
    }
  };
};

// ===== Smooth scrolling =====
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - NAV_OFFSET,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });
});

// ===== Active section highlight =====
const highlightOnScroll = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - (NAV_OFFSET + 20);
    const height = section.clientHeight;
    if (scrollY >= top && scrollY < top + height) current = section.id;
  });

  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};
window.addEventListener('scroll', rafThrottle(highlightOnScroll));
window.addEventListener('load', highlightOnScroll);

// ===== Scroll-in animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  const observeList = (selector, delayStep = 0) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('scroll-animation');
      if (delayStep) el.style.transitionDelay = `${i * delayStep}s`;
      observer.observe(el);
    });
  };
  observeList('h2');
  observeList('.skill-card', 0.1);
  observeList('.project-card', 0.15);
  observeList('.about-text', 0.2);
  observeList('.contact-item', 0.1);
});

// ===== Modal gallery (GreenQuest) =====
const modal = document.getElementById('project-modal');
const modalImg = document.getElementById('modalImg');
const thumbs = document.getElementById('modalThumbs');
const nextBtn = document.getElementById('nextImg');
const prevBtn = document.getElementById('prevImg');

const IMAGES = [
  'bilder/greenquest1.jpg',
  'bilder/greenquest2.jpg',
  'bilder/greenquest3.jpg',
  'bilder/greenquest4.jpg'
];
let current = 0;

function openModal() {
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('body-lock');
  renderModal();
}
function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('body-lock');
}
function renderModal() {
  modalImg.src = IMAGES[current];
  thumbs.innerHTML = '';
  IMAGES.forEach((src, i) => {
    const t = new Image();
    t.src = src;
    if (i === current) t.classList.add('active');
    t.addEventListener('click', () => { current = i; renderModal(); });
    thumbs.appendChild(t);
  });
}

nextBtn.addEventListener('click', () => { current = (current + 1) % IMAGES.length; renderModal(); });
prevBtn.addEventListener('click', () => { current = (current - 1 + IMAGES.length) % IMAGES.length; renderModal(); });

// Öppna modalen när man klickar var som helst på GreenQuest-kortet
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-project="greenquest"]');
  if (card) { e.preventDefault(); openModal(); }
});

// Stängning (bakgrund, X, Esc + piltangenter)
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
window.addEventListener('keydown', (e) => {
  if (modal.getAttribute('aria-hidden') === 'true') return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
});
