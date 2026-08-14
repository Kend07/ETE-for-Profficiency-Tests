# 🤝 Guía de Contribución — ETE for Proficiency Tests

¡Gracias por querer mejorar el hub! Este proyecto es 100% comunitario y toda ayuda suma: corregir ejercicios, agregar syllabus, mejorar accesibilidad o traducir contenido.

## 🧑‍💻 Flujo de trabajo

1. **Fork** del repositorio.
2. Crea una rama descriptiva:

   ```bash
   git checkout -b feat/nuevo-ejercicio
   ```

3. Realiza tus cambios siguiendo las **convenciones** de abajo.
4. Valida localmente:

   ```bash
   npm install
   npm run lint          # HTML semántico y accesibilidad
   npm run format        # Prettier
   ```

5. Haz commit con mensajes claros en forma imperativa (p. ej. `feat: agregar semana 7 al quiz de Inglés V`).
6. Abre un **Pull Request** hacia `main` describiendo el cambio y su motivación.

## 🎯 ¿Qué se puede aportar?

| Tipo de aporte | Detalle |
|----------------|---------|
| **Syllabus** | Subir el syllabus oficial (.md preferido, .pdf aceptado) a `syllabi/` con la nomenclatura `codigo_curso.md` |
| **Ejercicios** | Nuevos ejercicios o correcciones razonadas en `js/ingles-v.js` (estructura `mc`/`sa` con `rationale` para todo feedback) |
| **UI / UX** | Mejoras de diseño responsive o accesibilidad (WCAG 2.1 AA) |
| **Docs** | Ampliar `README.md`, `syllabi/README.md` o esta guía |
| **DevOps** | Optimizar `.github/workflows/deploy.yml` o el pipeline de linting |

## ✅ Convenciones

- **HTML:** semántica correcta (`header`, `main`, `section`, `footer`), `aria-*` donde aplique, foco visible.
- **JS:** funciones globales únicamente cuando sean requeridas por `onclick` declarativos; explicar con comentarios el *porqué* de cada decisión.
- **CSS:** estilos compartidos en `css/main.css`; usar Tailwind utility classes para lo específico.
- **Enlaces externos:** siempre `rel="noopener noreferrer"`.
- **Idioma:** el contenido pedagógico de los quizzes se escribe en inglés; la documentación del proyecto, en español.

## 💬 Reporte de issues

Antes de abrir un issue, busca si ya existe uno similar. Incluye siempre:

- Descripción del problema o mejora.
- Pasos para reproducir (si aplica).
- Capturas de pantalla (si aplica).

## 📜 Licencia

Al contribuir aceptas que tu trabajo queda bajo la [Licencia MIT](LICENSE) del proyecto.

---

¿Dudas? Abre un issue o participa en los Pull Requests existentes. ¡Comunidad arriba! 🎓