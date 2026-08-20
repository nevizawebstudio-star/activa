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

  /* ---- Panel de empresas: widget con vistas (Uso / Facturación) ---- */
  const empresasViews = {
    uso: [
      { value: '6', label: 'Convenios activos hoy, creciendo cada trimestre' },
      { value: '1', label: 'Panel de administración para todo el equipo' },
      { value: '0', label: 'Procesos manuales de vouchers o reembolsos' },
      { value: '24h', label: 'Tiempo promedio de activación por colaborador' },
    ],
    facturacion: [
      { value: '1', label: 'Factura mensual consolidada por empresa' },
      { value: '100%', label: 'Gasto visible por colaborador y por área' },
      { value: '0', label: 'Reembolsos o comprobantes por revisar' },
      { value: 'Detallado', label: 'Reporte de uso descargable cada mes' },
    ],
  };
  const empresasTabs = document.querySelectorAll('.empresas-card-tabs button');
  const empresasGrid = document.querySelector('.empresas-metric-grid');
  if (empresasTabs.length && empresasGrid) {
    const metricEls = empresasGrid.querySelectorAll('.empresas-metric');
    empresasTabs.forEach((tab, i) => {
      const key = i === 0 ? 'uso' : 'facturacion';
      tab.addEventListener('click', () => {
        empresasTabs.forEach(t => t.classList.toggle('active', t === tab));
        empresasViews[key].forEach((metric, idx) => {
          const el = metricEls[idx];
          if (!el) return;
          el.querySelector('b').textContent = metric.value;
          el.querySelector('span').textContent = metric.label;
        });
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
