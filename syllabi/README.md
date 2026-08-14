# 📚 Syllabi del Programa

Esta carpeta almacena los **syllabus y materiales de estudio** de los cursos
disponibles en el hub. Está organizada por institución y curso para que el
contenido de cada programa viva en un solo lugar, listo para alimentar los
quizzes interactivos de `/courses`.

## Estructura de carpetas

```text
syllabi/
└── {nombre_institucion}/
    └── {curso}/
        ├── README.md              # Índice de la carpeta del curso
        ├── syllabus.md            # Syllabus en Markdown (preferido)
        ├── syllabus_*.pdf         # Syllabus oficial original (PDF)
        └── material/              # Guías, ejercicios extra, audios, etc.
            └── .gitkeep
```

**Reglas:**

- Instituciones en **minúsculas** (`utn`, `una`, `unam`, ...).
- Cursos en **minúsculas con guiones bajos** (`ingles_v`, `ingles_iv`, ...).
- Prefiere `.md`; usa `.pdf` para el documento oficial original.
- Actualiza siempre el `README.md` de la carpeta del curso.

## ¿Cómo agregar un syllabus?

1. Crea la estructura `syllabi/{institucion}/{curso}/` (si no existe).
2. Sube el syllabus (`syllabus.md` y/o `syllabus_*.pdf`) y demás material.
3. Actualiza el `README.md` de la carpeta del curso.
4. Abre un Pull Request. ¡Toda contribución es bienvenida! 🎓

## Bibliotecas disponibles

| Institución | Curso | Contenido | Estado |
|-------------|-------|-----------|--------|
| [`utn`](utn/) | [`ingles_v`](utn/ingles_v/) (Inglés V, IDTEC05) | Syllabus MD + PDF oficial + material | ✅ Disponible |

## Cursos pendientes

- UTN · Inglés I, II, III, IV y VI
- Otras instituciones (¡participa para sumarlas!)

---

> **Nota:** El material académico aquí publicado pertenece o es derivado de los
> programas oficiales de cada institución y se comparte con fines educativos.
> Este repositorio no está afiliado ni avalado por ninguna institución.