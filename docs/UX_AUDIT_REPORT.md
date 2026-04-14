# Reporte de Auditoría UX/UI — Mission TODO List

**Proyecto:** curso-react-intro / Mission TODO List  
**Fecha de auditoría:** 14 de abril de 2026  
**Auditor:** Richard (UX Senior)  
**Destinatario:** teff (Senior Software Engineer / Frontend Developer)  

---

## 1. Resumen Ejecutivo

La aplicación tiene una premisa temática clara y coherente (gestión de tareas con metáfora espacial), una arquitectura de componentes bien separada y funcionalidad sólida: creación, edición, archivo, completado, búsqueda y pomodoro.

Sin embargo, existe una **fractura visual crítica** que atraviesa toda la aplicación: el fondo y los textos del shell de la app están concebidos para un tema oscuro/cósmico, pero los componentes interiores (tarjetas, modal, formulario, pomodoro) están diseñados sobre fondo blanco en un sistema de color completamente ajeno al tema. El resultado es una experiencia inconsistente que daña la cohesión de marca y genera problemas de accesibilidad.

---

## 2. Diagnóstico del Estado Actual

### Lo que funciona bien

- La metáfora espacial ("misiones", "base espacial", tipos `main/side`) es coherente y da personalidad al producto.
- El `TodoCounter` con mensajes contextuales según el estado de progreso es una buena decisión de microcopy.
- El sticky header con pills de filtro y el efecto de blur al hacer pin es un patrón moderno bien ejecutado.
- El `OverflowMenu` con gestión de `click outside` y `Escape` respeta las heurísticas de control del usuario.
- El auto-focus al abrir el modal del formulario (con `useRef` + `setTimeout`) es una buena práctica de accesibilidad.
- El Pomodoro Timer integrado directamente al flujo de la tarea es un diferenciador funcional valioso.
- La barra de búsqueda fija en el bottom con efecto flotante es visualmente limpia y accesible en móvil.

### El problema estructural

La aplicación tiene **dos mundos visuales que no se comunican**:

| Ámbito | Sistema de color |
|---|---|
| Fondo, header, contador, búsqueda | Oscuro/cósmico: negro, azul profundo, cyan, dorado |
| Tarjetas, modal, formulario, pomodoro | Claro/corporativo: blanco `#ffffff`, grises, `#f6f6f6` |

Esto no es una elección de contraste intencional. Es una inconsistencia acumulada de desarrollo.

---

## 3. Problemas Específicos por Severidad

---

### CRÍTICOS — Bloquean la experiencia o violan accesibilidad WCAG AA

#### C1 — Modal sin overlay backdrop
**Archivo:** `src/components/Modal.css` — `.modalContainer`

El modal usa `position: absolute` sin ningún overlay oscuro detrás. Sin overlay, el usuario no percibe que hay un foco activo. El modal no "detiene" el mundo exterior. Viola la heurística de visibilidad del estado del sistema y la de figura-fondo (Gestalt).

**Corrección:**
- Añadir un overlay `position: fixed; inset: 0; background: rgba(5, 7, 24, 0.8); backdrop-filter: blur(4px); z-index: 100`.
- Cambiar `.modalContainer` de `position: absolute` a `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)` para centrado real en viewport.
- El overlay debe escuchar `onClick` para cerrar el modal (misma función que el botón X).
- El modal debe tener `z-index: 101` (sobre el overlay).

---

#### C2 — Tarjetas con fondo blanco sobre fondo cósmico
**Archivo:** `src/components/TodoItem.css` — `div.missionCard`

Las tarjetas tienen fondo `#ffffff` sobre el fondo cósmico oscuro. El contraste es funcional pero rompe completamente el tema espacial. Las tarjetas parecen recortes de otra aplicación pegados sobre el fondo.

**Corrección (glassmorphism cósmico):**
```css
div.missionCard {
  background: rgba(10, 10, 46, 0.75);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(0, 212, 255, 0.2);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  border-radius: 16px;
  color: #e8eaf6;
}

div.missionCard:hover {
  border: 1px solid rgba(0, 212, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.12), 0 4px 16px rgba(0,0,0,0.4);
  transform: translateY(-2px);
  transition: all 0.25s ease;
}
```

---

#### C3 — Eliminación sin confirmación
**Archivo:** `src/components/OverflowMenu.js` y `src/components/TodoList.js`

La acción "Borrar" elimina la tarea directamente sin ninguna confirmación. El estado se actualiza inmediatamente en `updateTodos` cuando la opción es `"delete"`. Las acciones destructivas sin confirmación violan directamente la heurística de prevención de errores de Nielsen. Un click accidental borra datos persistidos en `localStorage` sin posibilidad de recuperación.

**Corrección:**
Gestionar un estado local `isConfirmingDelete` (booleano) en `OverflowMenu.js`. Cuando es `true`, mostrar confirmación inline dentro del menú:

```jsx
// En OverflowMenu.js
const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

// En el render, reemplazar el item "Borrar":
{isConfirmingDelete ? (
  <div className="overflowMenu-confirmDelete">
    <span>¿Eliminar esta misión?</span>
    <button onClick={() => onAction('delete')}>Sí</button>
    <button onClick={() => setIsConfirmingDelete(false)}>No</button>
  </div>
) : (
  <button onClick={() => setIsConfirmingDelete(true)}>Borrar</button>
)}
```

---

#### C4 — Botón Editar comentado en la vista de detalle
**Archivo:** `src/components/TodoShowInfo.js` — línea 93

El botón "Editar" está comentado en el JSX. La vista de detalle muestra toda la información pero no ofrece vía directa de edición. El flujo actual obliga al usuario a cerrar el modal de detalle, abrir el OverflowMenu y seleccionar Editar — tres pasos innecesarios.

**Corrección:**
1. Descomentar el botón de la línea 93.
2. Conectar el `onClick` para llamar a `setIsEditTask(true)` y `setIsShowTaskInfo(false)` desde `TodoContext`.

```jsx
<button
  className="taskBtn secondary"
  onClick={() => {
    setIsEditTask(true);
    setIsShowTaskInfo(false);
  }}
>
  Editar
</button>
```

---

#### C5 — Formulario con fondo blanco dentro del modal
**Archivo:** `src/components/TodoForm.css`

El formulario tiene fondo blanco dentro de un modal que tendrá fondo oscuro. La barra de acciones sticky usa `background: #f6f6f6` que se ve como una mancha blanca.

**Corrección — Inputs y textarea:**
```css
.todoForm input,
.todoForm textarea,
.todoForm select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: #e8eaf6;
}

.todoForm input::placeholder,
.todoForm textarea::placeholder {
  color: rgba(136, 146, 176, 0.6);
}

.todoForm input:focus,
.todoForm textarea:focus {
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  background: rgba(255, 255, 255, 0.08);
}
```

**Corrección — Barra de acciones sticky:**
```css
.todoForm-actions {
  background: rgba(10, 10, 46, 0.95);
  backdrop-filter: blur(10px);
  /* reemplaza background: #f6f6f6 */
}
```

---

#### C6 — Accesibilidad: aria-labels ausentes y contraste insuficiente
**Archivos:** `src/components/CreateTodoButton.js`, `src/AppContext.js`

- El FAB (`+`) no tiene `aria-label`.
- El botón X de cierre del modal no tiene `aria-label`.
- El rojo `color: red` en el botón de cierre tiene ratio de contraste 3.99:1 — no alcanza WCAG AA (mínimo 4.5:1).

**Correcciones:**
```jsx
// CreateTodoButton.js
<button aria-label="Crear nueva misión" className="createTodoButton">+</button>

// AppContext.js — botón cerrar modal
<button aria-label="Cerrar" className="closeButtonModal" style={{ color: '#c0392b' }}>X</button>
```

---

### MEJORAS — Impactan negativamente la usabilidad

#### M1 — Estado vacío por filtro no existe
**Archivo:** `src/components/TodoList.js`

Cuando un filtro (Completadas, Archivadas) no tiene resultados, el panel queda en blanco sin mensaje. El usuario no sabe si no hay datos o si hubo un error.

**Corrección:** Añadir mensaje contextual cuando `filterTodos.length === 0`:
```jsx
{filterTodos.length === 0 && (
  <p className="emptyState">
    {pillIndex === 1
      ? "Aún no has completado ninguna misión. ¡Sigue así, comandante!"
      : "No hay misiones archivadas."}
  </p>
)}
```

---

#### M2 — OverflowMenu con posicionamiento hardcodeado
**Archivo:** `src/components/OverflowMenu.css` — `div.overflowMenu-menu`

El menú usa `top: -95px; right: 60px` fijo. Si la tarjeta tiene más opciones, el menú puede salir del viewport o tapar el título.

**Corrección:**
```css
div.overflowMenu-menu {
  top: auto;
  bottom: calc(100% + 8px);
  right: 0;
  /* eliminar top: -95px; right: 60px; */
}
```

---

#### M3 — Timer del Pomodoro no persiste al cerrar el modal
**Archivo:** `src/hooks/usePomodoro.js`, `src/components/PomodoroTimer.js`

Al cerrar el modal y volver a abrirlo, el timer se reinicia a 25:00. El hook `usePomodoro` vive en el scope del componente, no en el contexto global ni en `localStorage`.

**Corrección (diseño):** Elevar el estado `isActive` del hook `usePomodoro` al contexto de la app. En `AppContext.js`, función `handleCloseModal`, verificar si el timer está activo y mostrar una guardia de confirmación antes de cerrar.

---

### SUGERENCIAS — Oportunidades de mejora no urgentes

- **S1** — Barra de progreso en `TodoCounter`: visualizar `(completedTodos / totalTodos) * 100%` con un gradiente cyan-to-purple.
- **S2** — Localizar labels de tipo de misión en `TodoItem.js` línea 48: `main` → `"Principal"`, `side` → `"Secundaria"`.
- **S3** — Fuente Orbitron (Google Fonts) solo para `h1.todoTitle` y `.pomodoro-title` — refuerza el tema sin afectar legibilidad del cuerpo.
- **S4** — Reemplazar `Math.random()` para IDs en `TodoForm.js` por `crypto.randomUUID()` para evitar colisiones.

---

## 4. Sistema de Color Propuesto

El principio rector: **todo debe existir dentro del espacio**. Los elementos no flotan en blanco; flotan en la oscuridad del cosmos.

Agregar en `src/index.css` dentro de `:root`:

```css
:root {
  --color-void:           #050718;                   /* Fondo base */
  --color-nebula-deep:    #0a0a2e;                   /* Tarjetas y modal */
  --color-nebula-mid:     #12144a;                   /* Hover de tarjetas */
  --color-star-glow:      #00d4ff;                   /* Acento primario cyan */
  --color-pulsar:         #7b2ff7;                   /* Acento secundario púrpura */
  --color-nova:           #ff834a;                   /* FAB — conservar */
  --color-mission-main:   #3b82f6;                   /* Badge tipo Principal */
  --color-mission-side:   #10b981;                   /* Badge tipo Secundaria */
  --color-text-primary:   #e8eaf6;
  --color-text-secondary: #8892b0;
  --color-text-muted:     #4a5568;
  --color-border-subtle:  rgba(0, 212, 255, 0.15);
}
```

> El gradiente de fondo existente en `index.css` es correcto y **debe mantenerse**. Solo ajustar la opacidad de la overlay a `0.75` para que la imagen de fondo sea menos dominante.

---

## 5. Componentes Adicionales por Sistema Visual

### Barra de búsqueda (`TodoSearch.css`)

El borde dorado `#ffd27a` es un acento excelente — **conservarlo y potenciarlo**:

```css
.todoSearchInput {
  background: rgba(10, 10, 46, 0.85);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 210, 122, 0.5);
  color: #e8eaf6;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 210, 122, 0.1);
}

.todoSearchInput:focus {
  border-color: rgba(255, 210, 122, 0.9);
}
```

### Botón FAB (`CreateTodoButton.css`)

El naranja `#ff834a` es correcto. Añadir el efecto "reactor encendido":

```css
button.createTodoButton {
  box-shadow: 0 4px 20px rgba(255, 131, 74, 0.5), 0 0 0 1px rgba(255,131,74,0.2);
  transition: all 0.3s ease;
}

button.createTodoButton:hover {
  box-shadow: 0 6px 28px rgba(255, 131, 74, 0.7), 0 0 20px rgba(255,131,74,0.3);
}
```

### PomodoroTimer (`PomodoroTimer.css`)

```css
.pomodoro-title    { color: #4aa4ff; text-shadow: 0 0 12px rgba(74, 164, 255, 0.5); }
.pomodoro-timer    { text-shadow: 0 0 20px rgba(255, 77, 77, 0.6); }  /* conservar color rojo */
.pomodoro-description { color: #8892b0; }
.pomodoro-status   { color: #8892b0; }
.objective-text    { color: #e8eaf6; }
.pomodoro-objectives { border-top: 1px solid rgba(0, 212, 255, 0.15); } /* reemplaza #f0f0f0 */
```

### Badges de tipo de misión

Reemplazar los fondos sólidos actuales por versiones translúcidas que funcionen sobre el fondo oscuro:

```css
/* Principal */
.badge-main {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #93c5fd;
}

/* Secundaria */
.badge-side {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #6ee7b7;
}
```

---

## 6. Flujos de Usuario — Correcciones

### Flujo: Crear tarea

**Actual:** FAB → Modal se abre sin overlay → Formulario blanco → Guardar → Cierra

**Propuesto:** FAB → Overlay fade-in (150ms) → Modal oscuro entra con `scale(0.95→1) + opacity(0→1)` (200ms) → Guardar con feedback visual → Modal fade-out → Tarea aparece con animación sutil.

### Flujo: Eliminar tarea

**Actual:** OverflowMenu → "Borrar" → Eliminación inmediata

**Propuesto:** OverflowMenu → "Borrar" → Confirmación inline en el menú → Acción o cancelación.

### Flujo: Ver detalle → Editar

**Actual:** Click tarjeta → TodoShowInfo → Cerrar modal → OverflowMenu → Editar → Nuevo modal

**Propuesto:** Click tarjeta → TodoShowInfo → Botón "Editar" en footer → Transición dentro del mismo modal a `TodoForm` en modo edición → Guardar o cancelar → Regresa a detalle o cierra.

---

## 7. Jerarquía Tipográfica

| Elemento | Fuente | Tamaño | Peso | Color |
|---|---|---|---|---|
| `h1.todoTitle` | Orbitron | `2rem` | 700 | `#e8eaf6` |
| `p.adviceText` | Sistema | `1rem` | 400 | `#8892b0` |
| `h3.missionCard-title` | Sistema | `1rem` | 600 | `#e8eaf6` |
| `p.missionCard-subtitle` | Sistema | `0.85rem` | 400 | `#8892b0` |
| `.todoForm-title` | Sistema | `1.3rem` | 700 | `#e8eaf6` |
| `.pomodoro-timer` | Courier New (conservar) | `5.8rem` | 700 | `#ff4d4d` |

> Para Orbitron: añadir en `public/index.html`:  
> `<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&display=swap" rel="stylesheet">`

---

## 8. Animaciones Propuestas

```css
/* Modal de entrada */
@keyframes modalEnter {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.modalContainer {
  animation: modalEnter 0.2s ease forwards;
}

/* Entrada de tarjetas */
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
div.missionCard {
  animation: cardEnter 0.3s ease;
}
```

---

## 9. Plan de Implementación para teff

Ordenado por prioridad de impacto. Cada ítem es independiente.

### Prioridad 1 — Correcciones críticas

| Tarea | Archivo | Esfuerzo estimado |
|---|---|---|
| C1 — Overlay del modal | `Modal.css`, `Modal.js` o `AppContext.js` | Bajo |
| C2 — Tarjetas con glassmorphism cósmico | `TodoItem.css` | Bajo |
| C3 — Confirmación inline de eliminación | `OverflowMenu.js` | Bajo |
| C4 — Descomentar botón Editar en detalle | `TodoShowInfo.js` | Muy bajo |
| C5 — Formulario tema oscuro | `TodoForm.css` | Bajo |
| C6 — Aria-labels y contraste del botón X | `CreateTodoButton.js`, `AppContext.js` | Muy bajo |

### Prioridad 2 — Sistema de color unificado

1. Declarar variables CSS en `src/index.css` (sección 4 de este reporte).
2. Reemplazar valores hardcodeados en todos los CSS de componentes por tokens.
3. Aplicar tema oscuro a `Modal.css`, `TodoForm.css`, `PomodoroTimer.css`.
4. Ajustar `TodoSearch.css` y `CreateTodoButton.css` (sección 5).

### Prioridad 3 — Mejoras de UX

1. **Estado vacío** en `TodoList.js` — mensajes contextuales por filtro.
2. **Localización de labels** en `TodoItem.js` línea 48.
3. **Barra de progreso** en `TodoCounter.js`.
4. **Guardia del Pomodoro activo** en `AppContext.js` → `handleCloseModal`.

### Prioridad 4 — Pulido

1. Animaciones de entrada en modal y tarjetas.
2. Fuente Orbitron en `public/index.html` y `src/index.css`.
3. Efecto glow reactor en el FAB.
4. Posicionamiento dinámico del OverflowMenu.

---

## 10. Tabla de Hallazgos

| ID | Categoría | Estado actual | Prioridad |
|---|---|---|---|
| C1 | Overlay de modal | Ausente | P1 — crítico |
| C2 | Coherencia temática tarjetas | Fractura total | P1 — crítico |
| C3 | Confirmación de eliminación | Ausente | P1 — crítico |
| C4 | Flujo detalle → edición | Botón comentado | P1 — crítico |
| C5 | Formulario fondo blanco | Inconsistente | P1 — crítico |
| C6 | Accesibilidad aria-labels | Parcial | P1 — crítico |
| M1 | Estado vacío por filtro | Ausente | P3 — medio |
| M2 | Posicionamiento OverflowMenu | Hardcodeado | P3 — medio |
| M3 | Persistencia timer Pomodoro | Ausente | P3 — medio |
| S1 | Barra de progreso | Ausente | P4 — bajo |
| S2 | Localización de labels | Parcial | P3 — bajo |
| S3 | Tipografía Orbitron | No aplicada | P4 — bajo |
| S4 | IDs con crypto.randomUUID | Math.random | P4 — bajo |

---

*La aplicación tiene una base técnica sólida y un concepto creativo con potencial real. Las correcciones de Prioridad 1 son de bajo esfuerzo de implementación y alto impacto perceptual. El trabajo de Prioridad 2 (sistema de color oscuro unificado) es el que transformará la percepción global de la app de "prototipo" a "producto terminado", sin sacrificar el estilo espacial que le da identidad.*
