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

  const contactContent = document.querySelector('.contact-content');
  if (contactContent) {
    contactContent.classList.add('scroll-animation');
    observer.observe(contactContent);
  }
});
