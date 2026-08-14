/* ==========================================================================
   ETE for Proficiency Tests — Landing Page Interactions
   --------------------------------------------------------------------------
   Responsabilidades:
   - Toggle del menú móvil (accesible: aria-expanded, aria-controls).
   - Dropdown de cursos (Desktop): hover directo sobre el botón con demora
     de cierre tolerante, clic fuera o Esc para cerrar.
   - openCoursesMenu(): global, abre el menú grande de cursos desde el CTA
     de la sección "¿Listo para tu próxima evaluación?" (desktop: dropdown
     del header; móvil: panel del menú móvil).
   - Prevención de clic / teclado en ítems "Próximamente" (aria-disabled)
     con toast de aviso vía Toastify (CDN).
   ========================================================================== */

'use strict';

(() => {
  // Referencias de menú y dropdown (se resuelven en el DOMContentLoaded)
  let coursesTrigger = null;
  let coursesMenu = null;
  let mobileToggle = null;
  let mobileMenu = null;

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCoursesDropdown();
    initInstitutionToggles();
    initDisabledItems();
  });

  /* ------------------------------------------------------------------------
     showToast — notificaciones con Toastify (CDN)
     ------------------------------------------------------------------------
     Tipos: 'info' (azul), 'success' (verde), 'warning' (ámbar), 'error'
     (rojo). Si el CDN de Toastify no cargó, cae a window.alert para no
     romper el flujo.
     ------------------------------------------------------------------------ */
  function showToast(message, type = 'info') {
    const palette = {
      info: 'linear-gradient(to right, #0056B3, #003366)',
      success: 'linear-gradient(to right, #16a34a, #15803d)',
      warning: 'linear-gradient(to right, #d97706, #b45309)',
      error: 'linear-gradient(to right, #dc2626, #b91c1c)'
    };

    if (typeof Toastify === 'undefined') {
      window.alert(message);
      return;
    }

    Toastify({
      text: message,
      duration: 3500,
      gravity: 'top',
      position: 'right',
      style: { background: palette[type] || palette.info }
    }).showToast();
  }

  /* ------------------------------------------------------------------------
     Menú móvil (hamburguesa)
     ------------------------------------------------------------------------ */
  function initMobileMenu() {
    mobileToggle = document.getElementById('mobile-menu-toggle');
    mobileMenu = document.getElementById('mobile-menu');

    if (!mobileToggle || !mobileMenu) return;

    mobileToggle.addEventListener('click', () => {
      mobileToggle.getAttribute('aria-expanded') === 'true'
        ? closeMobileMenu()
        : openMobileMenu();
    });

    // Cerrar al presionar Escape y devolver el foco al botón
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });
  }

  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('flex');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------------------
     Dropdown "Cursos" (desktop)
     ------------------------------------------------------------------------
     - Se abre con hover DIRECTO sobre el botón (nunca al rozar el header),
       o con clic / teclado (Enter o Espacio).
     - El cierre usa una demora de tolerancia (300 ms): si el mouse sale del
       botón o del panel y vuelve a entrar dentro de esa ventana, el menú
       no se cierra. Asi, pasar el mouse lento entre la tab y el panel ya no
       cierra el menú.
     - Escape o clic externo cierran de inmediato.
     ------------------------------------------------------------------------ */
  const HOVER_CLOSE_GRACE_MS = 300;
  let hoverCloseTimer = null;

  function cancelHoverClose() {
    if (hoverCloseTimer !== null) {
      clearTimeout(hoverCloseTimer);
      hoverCloseTimer = null;
    }
  }

  function scheduleHoverClose() {
    cancelHoverClose();
    hoverCloseTimer = setTimeout(closeCoursesDropdown, HOVER_CLOSE_GRACE_MS);
  }

  function initCoursesDropdown() {
    coursesTrigger = document.getElementById('courses-trigger');
    coursesMenu = document.getElementById('courses-menu');

    if (!coursesTrigger || !coursesMenu) return;

    const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

    // Abrir con hover solo sobre el botón (nunca al rozar el header)…
    coursesTrigger.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      cancelHoverClose();
      openCoursesDropdown();
    });

    // …y mantener abierto mientras el mouse esté sobre el botón o el panel
    coursesTrigger.addEventListener('mouseleave', scheduleHoverClose);
    coursesMenu.addEventListener('mouseenter', cancelHoverClose);
    coursesMenu.addEventListener('mouseleave', scheduleHoverClose);

    coursesTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      coursesTrigger.getAttribute('aria-expanded') === 'true'
        ? closeCoursesDropdown()
        : openCoursesDropdown();
    });

    coursesTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cancelHoverClose();
        closeCoursesDropdown();
        coursesTrigger.focus();
      }
    });

    // Cierre al hacer clic fuera (se respetan los botones "abrir menú de cursos")
    const header = document.getElementById('site-header');
    document.addEventListener('click', (e) => {
      if (e.target.closest('.js-open-courses-menu')) return;
      if (!header || !header.contains(e.target)) {
        cancelHoverClose();
        closeCoursesDropdown();
      }
    });
  }

  function openCoursesDropdown() {
    if (!coursesMenu || !coursesTrigger) return;
    coursesMenu.classList.remove('hidden');
    coursesTrigger.setAttribute('aria-expanded', 'true');
  }

  function closeCoursesDropdown() {
    if (!coursesMenu || !coursesTrigger) return;
    coursesMenu.classList.add('hidden');
    coursesTrigger.setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------------------
     openCoursesMenu (global — usada por el CTA de la landing)
     ------------------------------------------------------------------------
     Abre el "menú grande" de cursos del header:
     - ≥ 1024px (desktop): despliega el dropdown de cursos.
     - < 1024px (móvil/tablet): despliega el panel del menú móvil.
     Expuesta en window para los manejadores onclick declarativos del HTML.
     ------------------------------------------------------------------------ */
  window.openCoursesMenu = function openCoursesMenu() {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      openCoursesDropdown();
    } else {
      openMobileMenu();
    }
  };

  /* ------------------------------------------------------------------------
     Acordeón "Institución → Cursos" (desktop dropdown y menú móvil)
     ------------------------------------------------------------------------
     Cada toggle ([data-institution-toggle]) despliega/oculta el grupo de
     cursos de esa institución y rota su chevron. Maneja aria-expanded y
     aria-controls para lectores de pantalla.
     ------------------------------------------------------------------------ */
  function initInstitutionToggles() {
    document.querySelectorAll('[data-institution-toggle]').forEach((toggle) => {
      const panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;

      const chevron = toggle.querySelector('.js-chevron');
      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        panel.classList.toggle('hidden', !open);
        if (chevron) chevron.classList.toggle('rotate-180', open);
      };

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });

      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
      });
    });
  }

  /* ------------------------------------------------------------------------
     Ítems deshabilitados ("Próximamente"): se intercepta clic y teclado y se
     muestra un toast de aviso. (pointer-events no se usa en CSS para que el
     evento de clic llegue al manejador y podamos informar al usuario.)
     ------------------------------------------------------------------------ */
  function initDisabledItems() {
    document.querySelectorAll('[aria-disabled="true"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Este curso estará disponible próximamente.', 'info');
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showToast('Este curso estará disponible próximamente.', 'info');
        }
      });
    });
  }
})();