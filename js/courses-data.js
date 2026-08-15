/* ==========================================================================
   ETE for Proficiency Tests — Catálogo de instituciones, carreras y cursos
   --------------------------------------------------------------------------
   Fuente única de verdad para:
   - Menú "Cursos" del header (desktop y móvil): institución → carrera → curso.
   - Contadores del hero ("Sílabos presentes" y "Ejercicios interactivos").
   - Sección "¿Listo para tu próxima evaluación?" de la landing.

   Para agregar un curso: añádelo al catálogo y menús y contadores se
   actualizarán solos. `exercises` = ejercicios planificados del quiz del
   curso; `syllabus` = true cuando exista su syllabus en /syllabi/.
   ========================================================================== */

'use strict';

window.ETE_CATALOG = (() => {
  const institutions = [
    {
      id: 'utn',
      name: 'UTN',
      fullName: 'Universidad Técnica Nacional',
      icon: 'fa-building-columns',
      careers: [
        {
          id: 'ingenieria-software',
          name: 'Ingeniería de Software',
          icon: 'fa-laptop-code',
          programs: [
            {
              id: 'programa-ingles',
              name: 'Programa de Inglés',
              courses: [
                { code: 'IDTEC01', name: 'Inglés I',   href: null,                    available: false, exercises: 24, syllabus: false, description: 'Nivel inicial del programa' },
                { code: 'IDTEC02', name: 'Inglés II',  href: null,                    available: false, exercises: 24, syllabus: false, description: 'Fundamentos de comunicación' },
                { code: 'IDTEC03', name: 'Inglés III', href: null,                    available: false, exercises: 24, syllabus: false, description: 'Interacción laboral cotidiana' },
                { code: 'IDTEC04', name: 'Inglés IV',  href: null,                    available: false, exercises: 24, syllabus: false, description: 'Funciones comunicativas intermedias' },
                { code: 'IDTEC05', name: 'Inglés V',   href: 'courses/ingles_v.html', available: true,  exercises: 24, syllabus: true,  description: 'Quizzes semanales e integrador' },
                { code: 'IDTEC06', name: 'Inglés VI',  href: null,                    available: false, exercises: 24, syllabus: false, description: 'Nivel avanzado del programa' }
              ]
            }
          ]
        }
      ]
    }
  ];

  function allCourses() {
    const courses = [];
    institutions.forEach(institution =>
      institution.careers.forEach(career =>
        career.programs.forEach(program =>
          program.courses.forEach(course => courses.push(course))
        )
      )
    );
    return courses;
  }

  return {
    institutions,
    allCourses,
    totalExercises: () => allCourses().reduce((sum, course) => sum + (course.exercises || 0), 0),
    totalSyllabi: () => allCourses().filter(course => course.syllabus).length
  };
})();