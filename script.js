// ===== Config =====
const NAV_OFFSET = 80; // Justera om din fixed nav är högre

// ===== Helpers =====
const rafThrottle = (fn) => {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// ===== Smooth scrolling (respekterar prefers-reduced-motion) =====
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.offsetTop - NAV_OFFSET;

      window.scrollTo({
        top: offsetTop,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });
});

// ===== Highlight aktiv sektion i navigation (throttlad) =====
const highlightOnScroll = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - (NAV_OFFSET + 20);
    const height = section.clientHeight;
    if (scrollY >= top && scrollY < top + height) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};


window.addEventListener('scroll', rafThrottle(highlightOnScroll));
window.addEventListener('load', highlightOnScroll);

// ===== Scroll animationer via IntersectionObserver =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target); // sluta observera när animerad
    }
  });
}, observerOptions);

// Registrera allt som ska animeras
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

  // --- Bildkällor per projekt ---
const SLIDES = {
  greenquest: [
    'bilder/greenquest1.jpg',
    'bilder/greenquest2.jpg',
    'bilder/greenquest3.jpg',
    'bilder/greenquest4.jpg'
  ]
};

// --- Initiera alla sliders ---
document.querySelectorAll('[data-slider]').forEach(setupSlider);

function setupSlider(sliderEl){
  const key = sliderEl.getAttribute('data-slider');
  const imgs = SLIDES[key] || [];
  const imgEl = sliderEl.querySelector('.slider-img');
  const prevBtn = sliderEl.querySelector('.prev');
  const nextBtn = sliderEl.querySelector('.next');
  const dotsEl = sliderEl.querySelector('.slider-dots');

  if (!imgs.length) return;

  let i = 0;
  render();

  // knappar
  prevBtn.addEventListener('click', e => { e.stopPropagation(); i = (i - 1 + imgs.length) % imgs.length; render(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); i = (i + 1) % imgs.length; render(); });

  // autoplay (pausas vid hover)
  let timer = setInterval(next, 3500);
  sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
  sliderEl.addEventListener('mouseleave', () => timer = setInterval(next, 3500));

  function next(){ i = (i + 1) % imgs.length; render(); }

  function render(){
    imgEl.src = imgs[i];
    // dots
    dotsEl.innerHTML = '';
    imgs.forEach((_, idx) => {
      const b = document.createElement('button');
      if (idx === i) b.classList.add('active');
      b.addEventListener('click', e => { e.stopPropagation(); i = idx; render(); });
      dotsEl.appendChild(b);
    });
  }
}


  const contactContent = document.querySelector('.contact-content');
  if (contactContent) {
    contactContent.classList.add('scroll-animation');
    observer.observe(contactContent);
  }
});
