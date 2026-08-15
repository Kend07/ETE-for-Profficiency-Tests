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
    renderCatalog();
    updateHeroStats();
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

  /* ------------------------------------------------------------------------
     Catálogo: institución → carrera → programa → curso
     ------------------------------------------------------------------------
     Renderiza desde window.ETE_CATALOG (js/courses-data.js):
     - Dropdown "Cursos" del header (desktop) y panel del menú móvil.
     - Contadores del hero (sílabos presentes y ejercicios interactivos).
     - Sección "¿Listo para tu próxima evaluación?" (instituciones + cursos).
     ------------------------------------------------------------------------ */
  function renderCatalog() {
    renderDesktopCatalog();
    renderMobileCatalog();
    renderCtaInstitutions();
  }

  function updateHeroStats() {
    const syllabi = document.getElementById('stat-syllabi');
    const exercises = document.getElementById('stat-exercises');
    if (syllabi) syllabi.textContent = String(ETE_CATALOG.totalSyllabi());
    if (exercises) exercises.textContent = String(ETE_CATALOG.totalExercises());
  }

  function renderDesktopCatalog() {
    const root = document.getElementById('desktop-catalog-root');
    if (!root || typeof ETE_CATALOG === 'undefined') return;
    root.innerHTML = '';

    const label = document.createElement('p');
    label.className = 'px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold text-slate-400';
    label.setAttribute('role', 'presentation');
    label.textContent = 'Instituciones';
    root.appendChild(label);

    ETE_CATALOG.institutions.forEach((institution) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'px-2 pb-1';
      wrapper.setAttribute('role', 'none');

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = `desktop-${institution.id}-toggle`;
      toggle.dataset.institutionToggle = '';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', `desktop-${institution.id}-courses`);
      toggle.className = 'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-utn-blue hover:bg-slate-100 transition';
      toggle.innerHTML = `
        <span class="flex items-center gap-2.5">
          <i class="fa-solid ${institution.icon} text-utn-accent" aria-hidden="true"></i>
          ${institution.name}
          <span class="text-[10px] font-semibold text-slate-400 normal-case">${institution.fullName}</span>
        </span>
        <i class="fa-solid fa-chevron-down text-[10px] js-chevron" aria-hidden="true"></i>`;

      const panel = document.createElement('div');
      panel.id = `desktop-${institution.id}-courses`;
      panel.setAttribute('role', 'group');
      panel.setAttribute('aria-label', `Cursos de ${institution.name}`);
      panel.className = 'hidden space-y-0.5 border-l-2 border-utn-blue/20 ml-5 pl-2 mt-1';

      institution.careers.forEach((career) => {
        panel.appendChild(buildCareerHeader(career, 'desktop'));
        career.programs.forEach((program) => {
          panel.appendChild(buildProgramHeader(program, 'desktop'));
          program.courses.forEach((course) => panel.appendChild(buildMenuCourseLink(course, 'desktop')));
        });
      });

      wrapper.appendChild(toggle);
      wrapper.appendChild(panel);
      root.appendChild(wrapper);
    });
  }

  function renderMobileCatalog() {
    const root = document.getElementById('mobile-catalog-root');
    if (!root || typeof ETE_CATALOG === 'undefined') return;
    root.innerHTML = '';

    const label = document.createElement('p');
    label.className = 'px-3 pt-3 pb-1 text-[11px] uppercase tracking-wider font-bold text-blue-300';
    label.setAttribute('role', 'presentation');
    label.textContent = 'Instituciones';
    root.appendChild(label);

    ETE_CATALOG.institutions.forEach((institution) => {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = `mobile-${institution.id}-toggle`;
      toggle.dataset.institutionToggle = '';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', `mobile-${institution.id}-courses`);
      toggle.className = 'w-full px-3 py-2.5 rounded-lg bg-white/10 flex items-center justify-between font-bold text-utn-gold';
      toggle.innerHTML = `
        <span class="flex items-center gap-2.5">
          <i class="fa-solid ${institution.icon} text-xs" aria-hidden="true"></i>
          ${institution.name}
          <span class="text-[10px] font-semibold text-blue-300 normal-case">${institution.fullName}</span>
        </span>
        <i class="fa-solid fa-chevron-down text-[10px] js-chevron" aria-hidden="true"></i>`;

      const panel = document.createElement('div');
      panel.id = `mobile-${institution.id}-courses`;
      panel.setAttribute('role', 'group');
      panel.setAttribute('aria-label', `Cursos de ${institution.name}`);
      panel.className = 'hidden space-y-0.5 mt-1 ml-4 pl-3 border-l-2 border-white/20';

      institution.careers.forEach((career) => {
        panel.appendChild(buildCareerHeader(career, 'mobile'));
        career.programs.forEach((program) => {
          panel.appendChild(buildProgramHeader(program, 'mobile'));
          program.courses.forEach((course) => panel.appendChild(buildMenuCourseLink(course, 'mobile')));
        });
      });

      root.appendChild(toggle);
      root.appendChild(panel);
    });
  }

  function buildCareerHeader(career, variant) {
    const p = document.createElement('p');
    p.setAttribute('role', 'presentation');
    p.className = variant === 'mobile'
      ? 'px-1 pt-1.5 pb-0.5 text-[10px] uppercase tracking-wider font-bold text-blue-300'
      : 'px-2 pt-1.5 pb-0.5 text-[10px] uppercase tracking-wider font-bold text-slate-400';
    p.innerHTML = `<i class="fa-solid ${career.icon} mr-1" aria-hidden="true"></i>${career.name}`;
    return p;
  }

  function buildProgramHeader(program, variant) {
    const p = document.createElement('p');
    p.setAttribute('role', 'presentation');
    p.className = variant === 'mobile'
      ? 'px-1 pt-1 pb-0.5 text-[10px] uppercase tracking-wider font-bold text-blue-300'
      : 'px-2 pt-1 pb-0.5 text-[10px] uppercase tracking-wider font-bold text-slate-400';
    p.textContent = program.name;
    return p;
  }

  function buildMenuCourseLink(course, variant) {
    const link = document.createElement('a');

    if (course.available) {
      link.href = course.href;
      link.setAttribute('role', 'menuitem');
      link.setAttribute('aria-current', 'true');
      link.className = variant === 'mobile'
        ? 'px-3 py-2.5 rounded-lg bg-utn-gold text-utn-blue font-bold flex items-center justify-between'
        : 'flex items-center justify-between px-3 py-2 rounded-md text-sm bg-utn-gold/15 text-utn-blue font-bold border-y border-utn-gold/30 hover:bg-utn-gold/25 transition';
      link.innerHTML = `
        <span class="flex items-center gap-2.5">
          <i class="fa-solid fa-circle-check ${variant === 'mobile' ? '' : 'text-green-600'}" aria-hidden="true"></i> ${course.name}
        </span>
        <span class="text-[10px] ${variant === 'mobile' ? 'uppercase tracking-wide font-extrabold text-utn-blue/70' : 'bg-utn-gold text-utn-blue px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide'}">Activo · ${course.code}</span>`;
      return link;
    }

    link.href = '#';
    link.setAttribute('role', 'menuitem');
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
    link.className = variant === 'mobile'
      ? 'px-3 py-2.5 rounded-lg opacity-50 cursor-not-allowed flex items-center justify-between'
      : 'flex items-center justify-between px-3 py-2 rounded-md text-sm opacity-50 cursor-not-allowed hover:bg-slate-50';
    link.innerHTML = `
      <span class="flex items-center gap-2.5">
        <i class="fa-solid fa-lock ${variant === 'mobile' ? 'text-xs' : 'text-slate-400'}" aria-hidden="true"></i> ${course.name}
      </span>
      <span class="text-[10px] font-bold ${variant === 'mobile' ? 'uppercase tracking-wide text-blue-300' : 'text-slate-400 uppercase tracking-wide'}">${course.code} · Próximamente</span>`;
    return link;
  }

  function renderCtaInstitutions() {
    const root = document.getElementById('cta-institutions');
    if (!root || typeof ETE_CATALOG === 'undefined') return;
    root.innerHTML = '';

    ETE_CATALOG.institutions.forEach((institution) => {
      const article = document.createElement('article');
      article.className = 'rounded-xl border border-white/10 bg-white/5 p-6';

      const header = document.createElement('div');
      header.className = 'flex items-center gap-3 border-b border-white/10 pb-4';
      header.innerHTML = `
        <span class="inline-flex w-11 h-11 rounded-xl bg-utn-gold text-utn-blue items-center justify-center text-lg shadow flex-shrink-0" aria-hidden="true">
          <i class="fa-solid ${institution.icon}"></i>
        </span>
        <div>
          <p class="font-extrabold text-white text-lg leading-tight">${institution.name}</p>
          <p class="text-[11px] text-blue-200">${institution.fullName}</p>
        </div>`;
      article.appendChild(header);

      institution.careers.forEach((career) => {
        const careerBox = document.createElement('div');
        careerBox.className = 'mt-5';

        const careerTitle = document.createElement('p');
        careerTitle.className = 'text-[11px] uppercase tracking-wider font-bold text-utn-gold';
        careerTitle.innerHTML = `<i class="fa-solid ${career.icon} mr-1" aria-hidden="true"></i>${career.name}`;
        careerBox.appendChild(careerTitle);

        career.programs.forEach((program) => {
          const programLabel = document.createElement('p');
          programLabel.className = 'mt-2 text-[10px] uppercase tracking-wider font-bold text-blue-200';
          programLabel.textContent = program.name;
          careerBox.appendChild(programLabel);

          const grid = document.createElement('div');
          grid.className = 'mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
          program.courses.forEach((course) => grid.appendChild(buildCtaCourseCard(course)));
          careerBox.appendChild(grid);
        });

        article.appendChild(careerBox);
      });

      root.appendChild(article);
    });
  }

  function buildCtaCourseCard(course) {
    const card = document.createElement('a');

    if (course.available) {
      card.href = course.href;
      card.className = 'block rounded-xl border-2 border-utn-gold bg-utn-gold p-5 shadow-lg transition-transform hover:scale-[1.02]';
      card.innerHTML = `
        <p class="text-[11px] uppercase tracking-wider font-extrabold text-utn-blue">${course.name} · ${course.code}</p>
        <p class="mt-1 text-xs text-utn-blue/80">${course.description}</p>
        <span class="inline-flex items-center gap-1.5 mt-3 text-[10px] font-extrabold uppercase tracking-wide bg-utn-blue text-utn-gold px-2.5 py-1 rounded-full">
          <i class="fa-solid fa-circle-check" aria-hidden="true"></i> Disponible ahora
        </span>`;
      return card;
    }

    card.href = '#';
    card.setAttribute('aria-disabled', 'true');
    card.setAttribute('tabindex', '-1');
    card.className = 'block rounded-xl border border-white/10 bg-white/5 p-5 opacity-50 cursor-not-allowed';
    card.innerHTML = `
      <p class="text-[11px] uppercase tracking-wider font-bold text-blue-300">${course.name} · ${course.code}</p>
      <p class="mt-1 text-xs text-blue-200">${course.description}</p>
      <span class="inline-block mt-3 text-[10px] font-bold uppercase tracking-wide bg-white/10 text-blue-200 px-2.5 py-1 rounded-full">Próximamente</span>`;
    return card;
  }
})();