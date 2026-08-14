# 🎓 ETE for Proficiency Tests

> **Exam Training for Professional Tests** — Hub open source de preparación para **exámenes de suficiencia de inglés** de cualquier institución. El proyecto arranca con el programa de **Inglés de la UTN**.

> 🌀 **Este proyecto es principalmente vibe-coded**  (prompt-driven). Todo el código se revisa, valida y mantiene con criterio humano. Todo es público y auditable en este repositorio.

Aplicaciones web interactivas y quizzes de repaso construidos a partir de los **syllabus oficiales** de los cursos. Todo el material es **gratuito, abierto y colaborativo** (Licencia MIT), desplegado automáticamente en **GitHub Pages**.

## ✨ Características

- ✅ **Autoevaluación con feedback inmediato**: razonamientos y pistas para cada ejercicio.
- 💬 **Enfoque en intenciones comunicativas**: las respuestas cortas se evalúan por transmisión clara del mensaje (nivel B1.1, Marco Común Europeo), tal como en las evaluaciones orales y escritas de la UTN.
- 📚 **Syllabi abiertos** en [`/syllabi/`](syllabi/) (Markdown / PDF) para descargar o contribuir.
- 🚀 **Deploy automático a GitHub Pages** en cada push a `main` (GitHub Actions).
- ♿ **Accesibilidad WCAG 2.1 AA**: skip-links, foco visible, `aria-disabled` en cursos no disponibles y soporte para lectores de pantalla.
- 🔒 **Seguridad**: Content Security Policy (CSP), `rel="noopener noreferrer"` en enlaces externos y sin dependencias de runtime.

## 🚀 Curso disponible

| Curso | Código | Acceso |
|-------|--------|--------|
| **Inglés V** | IDTEC05 | [Ingresar al quiz](courses/ingles_v.html) — 12 semanas, 24 ejercicios |

> 🕓 **Próximamente:** Inglés I, II, III, IV y VI. ¡Tu contribución los acelera!

## 🗂️ Estructura del proyecto

```text
ETE-for-Profficiency-Tests/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Deploy automático a GitHub Pages (push a main)
├── css/
│   └── main.css                # Estilos compartidos (WCAG, foco, micro-interacciones)
├── js/
│   ├── main.js                 # Navegación y componentes UI de la landing
│   └── ingles-v.js             # Datos y lógica del quiz de Inglés V
├── courses/
│   └── ingles_v.html           # Quiz interactivo de Inglés V (IDTEC05)
├── syllabi/                    # Organizado por institución → curso
│   ├── README.md               # Guía de contribución de syllabus
│   └── utn/
│       └── ingles_v/           # Curso: Inglés V (IDTEC05)
│           ├── README.md       # Índice de la carpeta del curso
│           ├── syllabus.md     # Syllabus resumido (markdown)
│           ├── syllabus_ingles_v.pdf   # Syllabus oficial (PDF)
│           └── material/       # Material complementario del curso
├── index.html                  # Landing page del hub
├── favicon.svg                 # Favicon placeholder
├── CONTRIBUTING.md             # Guía para colaborar
├── LICENSE                     # Licencia MIT
├── package.json                # Scripts de desarrollo y linting
├── .gitignore
└── README.md
```

## 🛠️ Uso local

```bash
# 1) Clona el repositorio
git clone https://github.com/Kend07/ETE-for-Profficiency-Tests.git
cd ETE-for-Profficiency-Tests

# 2) Opción A — sin dependencias: abre los .html directamente en el navegador
#    (los enlaces relativos funcionan sin servidor)

# 3) Opción B — servidor de desarrollo con recarga en vivo
npm install
npm run dev        # → http://localhost:5500
```

### Scripts útiles

| Comando             | Descripción                                         |
|---------------------|-----------------------------------------------------|
| `npm run dev`       | Servidor local con live-reload (puerto 5500)        |
| `npm run lint`      | Valida la semántica y accesibilidad del HTML        |
| `npm run format`    | Formatea el código con Prettier                     |
| `npm run format:check` | Verifica el formato sin modificar               |

## 🌐 Despliegue (GitHub Pages)

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica el sitio en cada push a `main`:

1. En el repositorio, ve a **Settings → Pages**.
2. En **Source**, selecciona **GitHub Actions**.
3. Listo: cada `push` a `main` (o un `workflow_dispatch` manual) despliega el sitio.
4. El sitio quedará en `https://<usuario>.github.io/ETE-for-Profficiency-Tests/`.

> **Nota:** el proyecto usa rutas **relativas** para que funcione igual en local (`file://`) y en GitHub Pages (project site).

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para colaborar:

1. Haz *fork* del repositorio y crea una rama (`git checkout -b feature/nueva-funcion`).
2. Realiza tus cambios (agregar un syllabus, nuevos ejercicios, mejoras de UI...).
3. Ejecuta `npm run lint` y `npm run format` antes de enviar.
4. Abre un **Pull Request** describiendo el cambio.

Consulta [`CONTRIBUTING.md`](CONTRIBUTING.md) para más detalles.

## 🛡️ Seguridad y buenas prácticas

- **CSP** vía meta tag: se restringen scripts, estilos y conexiones a orígenes confiables (mitigación XSS).
- La app usa `unsafe-inline` por `onclick` declarativos y la config inline de Tailwind **CDN**; si se desea endurecer en producción, se recomienda mover los handlers a `addEventListener` y usar hashes/nonces.
- Enlaces externos siempre con `rel="noopener noreferrer"`.

## ⚖️ Licencia

Distribuido bajo la [Licencia MIT](LICENSE). Libre de usar, modificar y compartir conservando el aviso de copyright.

## 🏛️ Créditos institucionales

Material de estudio derivado de los programas oficiales de la **Universidad Técnica Nacional (UTN)** — **Programa Institucional de Idiomas para el Trabajo (PIT)**. Proyecto educativo comunitario, **no afiliado oficialmente** a la institución.

---

⭐ ¿Te resulta útil? Dale una estrella al repositorio — es la mejor forma de apoyar el proyecto.