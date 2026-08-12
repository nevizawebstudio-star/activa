// ============ Activa landing — interactions ============

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky nav shadow on scroll ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const navToggle = document.getElementById('navToggle');
  const mobileSheet = document.getElementById('mobileSheet');
  if (navToggle && mobileSheet) {
    navToggle.addEventListener('click', () => {
      mobileSheet.classList.toggle('open');
    });
    mobileSheet.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileSheet.classList.remove('open'));
    });
  }

  /* ---- Audience switch (Empresas / Colaboradores) ---- */
  const switchButtons = document.querySelectorAll('.audience-switch button');
  const panels = document.querySelectorAll('.audience-panel');
  switchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.audience;
      switchButtons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

});
