const body = document.body;
const giftScreen = document.getElementById('giftScreen');
const giftButton = document.getElementById('giftButton');
const siteShell = document.getElementById('siteShell');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const revealItems = [...document.querySelectorAll('.reveal')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const showItems = (items) => items.forEach((item) => item.classList.add('is-visible'));

if (reduceMotion) {
  showItems(revealItems);
}

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  showItems(revealItems);
}

const setMenu = (open) => {
  mobileMenu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('menu-open', open);
};

giftButton.addEventListener('click', () => {
  if (giftButton.classList.contains('is-open')) return;
  giftButton.classList.add('is-open');
  window.setTimeout(() => {
    giftScreen.classList.add('is-opening');
    siteShell.classList.add('is-visible');
    siteShell.setAttribute('aria-hidden', 'false');
    body.classList.remove('is-locked');
    showItems(document.querySelectorAll('.hero .reveal'));
    document.querySelector('.topbar a')?.focus({ preventScroll: true });
  }, reduceMotion ? 0 : 620);
});

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
  }
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    giftScreen.classList.remove('is-opening');
    giftButton.classList.remove('is-open');
    siteShell.classList.remove('is-visible');
    siteShell.setAttribute('aria-hidden', 'true');
    body.classList.add('is-locked');
    setMenu(false);
  }
});
