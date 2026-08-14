/* ==========================================================================
   ETE for Proficiency Tests — Landing Page Interactions
   --------------------------------------------------------------------------
   Responsabilidades:
   - Toggle del menú móvil (accesible: aria-expanded, aria-controls).
   - Dropdown de cursos (Desktop) con cierre al hacer clic fuera o con Esc.
   - openCoursesMenu(): global, abre el menú grande de cursos desde el CTA
     de la sección "¿Listo para tu próxima evaluación?" (desktop: dropdown
     del header; móvil: panel del menú móvil).
   - Prevención de clic / teclado en ítems "Próximamente" (aria-disabled).
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
     Dropdown "Cursos" (desktop): se abre SOLO con clic o teclado (Enter/
     Espacio). No se usa hover para abrir: asi es imposible que se despliegue
     al pasar el mouse por el header. Cierre por Escape o clic externo.
     ------------------------------------------------------------------------ */
  function initCoursesDropdown() {
    coursesTrigger = document.getElementById('courses-trigger');
    coursesMenu = document.getElementById('courses-menu');

    if (!coursesTrigger || !coursesMenu) return;

    coursesTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      coursesTrigger.getAttribute('aria-expanded') === 'true'
        ? closeCoursesDropdown()
        : openCoursesDropdown();
    });

    coursesTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCoursesDropdown();
        coursesTrigger.focus();
      }
    });

    // Cierre al hacer clic fuera (se respetan los botones "abrir menú de cursos")
    const header = document.getElementById('site-header');
    document.addEventListener('click', (e) => {
      if (e.target.closest('.js-open-courses-menu')) return;
      if (!header || !header.contains(e.target)) closeCoursesDropdown();
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
     Ítems deshabilitados ("Próximamente"): prevención de interacción
     ------------------------------------------------------------------------ */
  function initDisabledItems() {
    document.querySelectorAll('[aria-disabled="true"]').forEach((el) => {
      el.addEventListener('click', (e) => e.preventDefault());
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
      });
    });
  }
})();