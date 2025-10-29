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

// ===== Modal galleries (multi-project) =====
// 1) Peka ut var varje modals element finns (unika IDs)
const MODALS = {
  greenquest: {
    modal:  '#project-modal',
    img:    '#modalImg',
    thumbs: '#modalThumbs',
    next:   '#nextImg',
    prev:   '#prevImg',
    opener: '[data-project="greenquest"]'
  },
  studentquiz: {
    modal:  '#project-modal-studentquiz',
    img:    '#modalImg-studentquiz',
    thumbs: '#modalThumbs-studentquiz',
    next:   '#nextImg-studentquiz',
    prev:   '#prevImg-studentquiz',
    opener: '[data-project="studentquiz"]'
  },
  transit: {
    modal:  '#project-modal-transit',
    img:    '#modalImg-transit',
    thumbs: '#modalThumbs-transit',
    next:   '#nextImg-transit',
    prev:   '#prevImg-transit',
    opener: '[data-project="transit"]'
  }
};

// 2) Bildlistor per projekt
const GALLERIES = {
  greenquest: [
    'bilder/greenquest1.jpg',
    'bilder/greenquest2.jpg',
    'bilder/greenquest3.jpg',
    'bilder/greenquest4.jpg',
  ],
  studentquiz: [
    'bilder/Quiz1.png',
    'bilder/quiz2.png',
    'bilder/quiz3.png',
    'bilder/quiz4.png',
  ],
  transit: [
    'bilder/transit.png',
    'bilder/transit1.png',
  ],
};

// 3) Initiera en modal med all logik (öppna, stäng, rendera, pilar, thumbs, tangentbord)
function initModal(key){
  const cfg = MODALS[key];
  const modalEl  = document.querySelector(cfg.modal);
  const imgEl    = document.querySelector(cfg.img);
  const thumbsEl = document.querySelector(cfg.thumbs);
  const nextBtn  = document.querySelector(cfg.next);
  const prevBtn  = document.querySelector(cfg.prev);
  const list     = GALLERIES[key] || [];

  if (!modalEl || !imgEl || !thumbsEl || !list.length) return;

  let idx = 0;

  function render(){
    imgEl.src = list[idx];
    thumbsEl.innerHTML = '';
    list.forEach((src, i) => {
      const t = new Image();
      t.src = src;
      if (i === idx) t.classList.add('active');
      t.addEventListener('click', () => { idx = i; render(); });
      thumbsEl.appendChild(t);
    });
  }

  function open(){
    idx = 0;
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body-lock');
    render();
  }

  function close(){
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-lock');
  }

  // Öppna när man klickar på rätt projektkort
  document.addEventListener('click', (e) => {
    if (e.target.closest(cfg.opener)) {
      e.preventDefault();
      open();
    }
    if (e.target.matches(`${cfg.modal} [data-close], ${cfg.modal} .modal-backdrop`)) {
      close();
    }
  });

  // Piltangenter + Esc när modalen är aktiv
  window.addEventListener('keydown', (e) => {
    if (modalEl.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'ArrowLeft')  prevBtn?.click();
  });

  // Nästa/föregående
  nextBtn?.addEventListener('click', () => { idx = (idx + 1) % list.length; render(); });
  prevBtn?.addEventListener('click', () => { idx = (idx - 1 + list.length) % list.length; render(); });
}

// 4) Starta båda modalerna
initModal('greenquest');
initModal('studentquiz');
initModal('transit');


