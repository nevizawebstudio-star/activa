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

  /* ---- Login dropdown (Soy colaborador / Soy empresa) ---- */
  const loginTrigger = document.getElementById('loginTrigger');
  const loginMenu = document.getElementById('loginMenu');
  let closeLoginMenu = () => {};
  if (loginTrigger && loginMenu) {
    closeLoginMenu = () => {
      loginMenu.classList.remove('open');
      loginTrigger.setAttribute('aria-expanded', 'false');
    };
    const toggleLoginMenu = () => {
      const isOpen = loginMenu.classList.toggle('open');
      loginTrigger.setAttribute('aria-expanded', String(isOpen));
    };
    loginTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLoginMenu();
    });
    document.addEventListener('click', (e) => {
      if (!loginMenu.contains(e.target) && e.target !== loginTrigger) closeLoginMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLoginMenu();
    });
  }

  /* ---- Login modal: "Soy colaborador" / "Soy empresa" abren el mismo pop up de login (aún no activo) ---- */
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    const openModalTriggers = document.querySelectorAll('[data-open-login-modal]');
    const closeModalTriggers = loginModal.querySelectorAll('[data-modal-close]');

    const openLoginModal = () => {
      loginModal.classList.add('open');
      loginModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeLoginMenu();
      if (mobileSheet) mobileSheet.classList.remove('open');
    };
    const closeLoginModal = () => {
      loginModal.classList.remove('open');
      loginModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    };

    openModalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
      });
    });
    closeModalTriggers.forEach(trigger => {
      trigger.addEventListener('click', closeLoginModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal.classList.contains('open')) closeLoginModal();
    });

    const modalLoginForm = document.getElementById('modalLoginForm');
    if (modalLoginForm) {
      modalLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  }

  /* ---- Marquee de establecimientos: selección al hacer clic ---- */
  const marqueeChips = document.querySelectorAll('.marquee-chip');
  if (marqueeChips.length) {
    marqueeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const alreadySelected = chip.classList.contains('is-selected');
        marqueeChips.forEach(c => c.classList.remove('is-selected'));
        if (!alreadySelected) chip.classList.add('is-selected');
      });
    });
  }

  /* ---- Login colaboradores: botón visible, aún no accionable ---- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.getElementById('loginNote');
      if (note) note.textContent = 'El login todavía no está activo. Muy pronto podrás entrar con tu correo de empresa.';
    });
  }

  /* ---- Refiere Activa a tu empresa: arma un correo con los datos ---- */
  const referForm = document.getElementById('referForm');
  if (referForm) {
    referForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('referNombre').value.trim();
      const correo = document.getElementById('referCorreo').value.trim();
      const empresa = document.getElementById('referEmpresa').value.trim();
      const mensaje = document.getElementById('referMensaje').value.trim();

      const subject = encodeURIComponent(`Referido Activa: ${empresa || 'nueva empresa'}`);
      const body = encodeURIComponent(
        `Nombre de quien refiere: ${nombre}\nCorreo de contacto: ${correo}\nEmpresa a contactar: ${empresa}\n\nMensaje:\n${mensaje}`
      );
      window.location.href = `mailto:bernardo@activabeneficios.com?subject=${subject}&body=${body}`;

      const success = document.getElementById('referSuccess');
      if (success) success.classList.add('visible');
    });
  }

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
