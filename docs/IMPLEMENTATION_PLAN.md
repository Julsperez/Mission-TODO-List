# Plan de Implementación Técnico — Mission TODO List

**Elaborado por:** teff (Senior Software Engineer)  
**Basado en:** UX_AUDIT_REPORT.md (Richard, UX Senior)  
**Fecha:** 14 de abril de 2026  
**Stack:** React (sin TypeScript), vanilla CSS, localStorage  

---

## Notas importantes — Discrepancias con el reporte UX

Antes de entrar al plan, hay diferencias entre el reporte de auditoría y el código real:

1. **Las rutas de archivos usan PascalCase con subdirectorios**, no rutas planas. Por ejemplo: `src/Components/TodoItem/TodoItem.css` (no `src/components/TodoItem.css`).
2. **El botón Editar en `TodoShowInfo.js`** tiene el `onEdit` prop llegando correctamente, pero el handler solo llama `setIsEditTask(true)` sin `setIsShowTaskInfo(false)`. Hay que descomentar el botón Y ajustar el handler en `AppContext.js`.
3. **El `closeButtonModal`** está en `src/App/App.css` (línea 38), no en `AppContext.js`.

---

## Orden de ejecución recomendado

Los pasos 1–5 son **prerequisitos bloqueantes**. Del paso 6 en adelante son independientes entre sí.

| # | Tarea | Archivo(s) | Tipo |
|---|---|---|---|
| 1 | Tokens CSS en `:root` + ajuste opacidad fondo | `src/index.css` | CSS |
| 2 | Google Fonts Orbitron | `public/index.html` | HTML |
| 3 | Modal: overlay + centrado + animación | `src/Components/Modal/Modal.css` + `Modal.js` | CSS + JS |
| 4 | Contraste y cursor del botón X | `src/App/App.css` | CSS |
| 5 | Modal recibe `onClose` prop | `src/App/AppContext.js` | JS |
| 6 | Tarjetas glassmorphism + badges | `src/Components/TodoItem/TodoItem.css` | CSS |
| 7 | Localización labels badge | `src/Components/TodoItem/TodoItem.js` | JS |
| 8 | OverflowMenu: posición + tema + confirmación delete | `src/Components/OverflowMenu/OverflowMenu.css` + `.js` | CSS + JS |
| 9 | TodoShowInfo: descomentar Editar + handler | `src/Components/TodoShowInfo/TodoShowInfo.js` + `AppContext.js` | JS |
| 10 | TodoShowInfo tema oscuro | `src/Components/TodoShowInfo/TodoShowInfo.css` | CSS |
| 11 | TodoForm tema oscuro completo | `src/Components/TodoForm/TodoForm.css` | CSS |
| 12 | TodoForm: `crypto.randomUUID()` | `src/Components/TodoForm/TodoForm.js` | JS |
| 13 | PomodoroTimer tema oscuro | `src/Components/PomodoroTimer/PomodoroTimer.css` | CSS |
| 14 | TodoSearch: potenciar acento dorado | `src/Components/TodoSearch/TodoSearch.css` | CSS |
| 15 | TodoCounter: Orbitron + colores | `src/Components/TodoCounter/TodoCounter.css` | CSS |
| 16 | Barra de progreso | `src/Components/TodoCounter/TodoCounter.js` + `.css` | JS + CSS |
| 17 | Estado vacío por filtro | `src/Components/TodoList/TodoList.js` + `.css` | JS + CSS |
| 18 | Pills de filtro tema oscuro | `src/Components/TodoList/TodoList.css` | CSS |
| 19 | FAB: aria-label + efecto reactor | `src/Components/CreateTodoButton/CreateTodoButton.js` + `.css` | JS + CSS |
| 20 | `position: relative` en OverflowMenu container | `src/Components/OverflowMenu/OverflowMenu.css` | CSS |

---

## Fase 1 — Sistema de tokens CSS globales

**Archivo:** `src/index.css`

Insertar el bloque `:root` al inicio del archivo, antes del selector `body`:

```css
:root {
  --color-void:            #050718;
  --color-nebula-deep:     #0a0a2e;
  --color-nebula-mid:      #12144a;
  --color-star-glow:       #00d4ff;
  --color-pulsar:          #7b2ff7;
  --color-nova:            #ff834a;
  --color-mission-main:    #3b82f6;
  --color-mission-side:    #10b981;
  --color-text-primary:    #e8eaf6;
  --color-text-secondary:  #8892b0;
  --color-text-muted:      #4a5568;
  --color-border-subtle:   rgba(0, 212, 255, 0.15);
}
```

Ajuste en `body`: cambiar `--background-opacity: 0.6` a `--background-opacity: 0.75`. Solo ese valor.

---

## Fase 2 — Fuente Orbitron

**Archivo:** `public/index.html`

Añadir dentro de `<head>`, antes del `<title>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&display=swap" rel="stylesheet">
```

`display=swap` garantiza que si Google Fonts falla, el texto sigue visible en la fuente de sistema.

---

## Fase 3 — Modal: overlay + centrado + tema oscuro (C1 — CRÍTICO)

### `src/Components/Modal/Modal.js`

**Cambios en JS:**
- Eliminar el `useEffect` con `scrollIntoView` — ya no aplica con centrado por flexbox.
- Eliminar la ref `modalRef` del div del modal.
- Añadir `onClose` a la firma: `function Modal({ children, onClose })`.
- Eliminar la lectura de `openTaskModal` desde el contexto dentro de Modal (la condición ya se maneja desde AppContext con `{openTaskModal && <Modal>}`).
- Envolver el contenido en un div de overlay:

```jsx
return ReactDOM.createPortal(
  <div className="modalOverlay" onClick={onClose}>
    <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>,
  document.getElementById('modal-root')
);
```

### `src/Components/Modal/Modal.css`

Reemplazar todo el contenido actual:

```css
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 24, 0.82);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

div.modalContainer {
  position: relative;
  background: rgba(10, 10, 46, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(0, 212, 255, 0.25);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1rem;
  z-index: 101;
  width: 90%;
  max-width: 560px;
  max-height: 88vh;
  overflow-y: auto;
  animation: modalEnter 0.2s ease forwards;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (min-width: 768px) {
  div.modalContainer {
    max-width: 600px;
  }
}

/* Scrollbar personalizado */
div.modalContainer::-webkit-scrollbar { width: 5px; }
div.modalContainer::-webkit-scrollbar-track { background: transparent; }
div.modalContainer::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 3px;
}
```

> **Compatibilidad `backdrop-filter`:** Compatible Chrome 76+, Firefox 103+, Safari 9+ (con prefijo). Fallback: fondo opaco. No hay rotura.

---

## Fase 4 — Contraste del botón X (C6 parcial)

**Archivo:** `src/App/App.css` — líneas 32-43

```css
button.closeButtonModal {
  border: none;
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: xx-large;
  color: #e05555;     /* era: red — ratio 4.6:1, pasa WCAG AA */
  background: none;
  display: flex;
  position: absolute;
  z-index: 10;
  cursor: pointer;
}
```

---

## Fase 5 — AppContext.js: pasar `onClose` al Modal (C1 + C4)

**Archivo:** `src/App/AppContext.js`

**Cambio 1 — Modal recibe `onClose`:**
```jsx
<Modal onClose={handleCloseModal}>
```

**Cambio 2 — Descomentar botón Editar en handler (C4):**
```jsx
// Prop onEdit del TodoShowInfo:
onEdit={() => {
  setIsEditTask(true);
  setIsShowTaskInfo(false);
}}
```

**Cambio 3 — aria-label en botón cerrar:**
```jsx
<button onClick={handleCloseModal} className="closeButtonModal" aria-label="Cerrar">
  <HiOutlineXCircle />
</button>
```

---

## Fase 6 — Tarjetas glassmorphism cósmico (C2 — CRÍTICO)

**Archivo:** `src/Components/TodoItem/TodoItem.css`

**`div.missionCard`** — reemplazar fondo y sombra, mantener layout:
```css
div.missionCard {
  background: rgba(10, 10, 46, 0.78);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(0, 212, 255, 0.18);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  color: var(--color-text-primary);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  animation: cardEnter 0.3s ease;
}

div.missionCard:hover {
  border-color: rgba(0, 212, 255, 0.45);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

div.missionCard.archived {
  background: rgba(20, 20, 55, 0.5);
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--color-text-muted);
}
```

**Textos:**
```css
h3.missionCard-title  { color: var(--color-text-primary); }
p.missionCard-subtitle { color: var(--color-text-secondary); }
h3.missionCard-title.completed,
p.missionCard-subtitle.completed { color: var(--color-text-muted); }
```

**Badges translúcidos:**
```css
span.main {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #93c5fd;
}

span.side {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #6ee7b7;
}

span.archived {
  background: rgba(100, 100, 120, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--color-text-muted);
}
```

**Animación de entrada:**
```css
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## Fase 7 — Localización de labels (S2)

**Archivo:** `src/Components/TodoItem/TodoItem.js` — línea 48

```jsx
{todo.typeofMission === "main" ? "Principal" : "Secundaria"}
```

---

## Fase 8 — OverflowMenu: confirmación delete + posición + tema (C3 + M2)

### `src/Components/OverflowMenu/OverflowMenu.js`

**Añadir estado:**
```js
const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
```

**En `toggleIsOpen` al cerrar:**
```js
if (isOpen) setIsConfirmingDelete(false);
```

**En `handleClickOutside`, añadir:**
```js
setIsConfirmingDelete(false);
```

**Reemplazar el `<span>` de Borrar:**
```jsx
{isConfirmingDelete ? (
  <div className="overflowMenu-confirmDelete" onClick={(e) => e.stopPropagation()}>
    <span className="confirmDelete-text">¿Eliminar esta misión?</span>
    <div className="confirmDelete-actions">
      <button
        className="confirmDelete-btn yes"
        onClick={(event) => { handleOption(event, "delete"); }}
      >
        Sí, borrar
      </button>
      <button
        className="confirmDelete-btn no"
        onClick={(event) => { event.stopPropagation(); setIsConfirmingDelete(false); }}
      >
        Cancelar
      </button>
    </div>
  </div>
) : (
  <span
    onClick={(event) => { event.stopPropagation(); setIsConfirmingDelete(true); }}
    className="overflowMenu-option delete"
    role="menuitem"
    tabIndex={0}
  >
    Borrar
    <HiOutlineTrash className="option-icon" />
  </span>
)}
```

### `src/Components/OverflowMenu/OverflowMenu.css`

**Posicionamiento dinámico:**
```css
div.overflowMenu-container {
  position: relative;
}

div.overflowMenu-menu {
  top: auto;
  bottom: calc(100% + 8px);
  right: 0;
  /* eliminar top: -95px; right: 60px; */
}
```

**Tema oscuro del menú:**
```css
div.overflowMenu-menu {
  background: rgba(12, 12, 48, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(0, 212, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

span.overflowMenu-option {
  border-bottom-color: rgba(255, 255, 255, 0.08);
  color: var(--color-text-primary);
}

span.overflowMenu-option:hover {
  background-color: rgba(255, 255, 255, 0.06);
}

button.overflowMenu-button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
}
button.overflowMenu-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
}
```

**Estilos de confirmación:**
```css
.overflowMenu-confirmDelete {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.confirmDelete-text {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.confirmDelete-actions {
  display: flex;
  gap: 0.5rem;
}

.confirmDelete-btn {
  flex: 1;
  padding: 0.4rem 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.confirmDelete-btn.yes {
  background: rgba(231, 76, 60, 0.25);
  color: #ff6b6b;
  border: 1px solid rgba(231, 76, 60, 0.4);
}
.confirmDelete-btn.yes:hover {
  background: rgba(231, 76, 60, 0.45);
}

.confirmDelete-btn.no {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.confirmDelete-btn.no:hover {
  background: rgba(255, 255, 255, 0.14);
}
```

---

## Fase 9 — TodoShowInfo: descomentar Editar (C4 — CRÍTICO)

**Archivo:** `src/Components/TodoShowInfo/TodoShowInfo.js` — línea 93

Descomentar el botón y usar el `onEdit` prop:
```jsx
<button
  className="taskBtn secondary"
  onClick={() => onEdit && onEdit()}
>
  Editar
</button>
```

(El handler en AppContext ya se ajustó en Fase 5.)

### `src/Components/TodoShowInfo/TodoShowInfo.css`

```css
.taskInfoContainer { color: var(--color-text-primary); }
.taskTitle { color: var(--color-text-primary); }
.taskSubtitle { color: var(--color-text-secondary); }
.sectionHeading { color: var(--color-star-glow); }
.taskDescription p { color: var(--color-text-secondary); }
.objectiveText { color: var(--color-text-primary); }
.noObjectives { color: var(--color-text-muted); }

.objectiveRow {
  background: rgba(255, 255, 255, 0.04);
  border-left-color: var(--color-star-glow);
}

.objectiveRow input[type="checkbox"] {
  accent-color: var(--color-star-glow);
}

.taskBtn.primary {
  background: var(--color-star-glow);
  color: var(--color-void);
}

.taskBtn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-primary);
  border-color: rgba(255, 255, 255, 0.15);
}

.taskBtn.secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}
```

Los `statusBadge` (`.status-inprogress`, `.status-completed`, `.status-archived`) se mantienen sin cambios.

---

## Fase 10 — TodoForm: tema oscuro (C5 — CRÍTICO)

**Archivo:** `src/Components/TodoForm/TodoForm.css`

| Selector | Propiedad actual | Nuevo valor |
|---|---|---|
| `.todoForm-title` | `color: #2c3e50` | `color: var(--color-text-primary)` |
| `.todoForm-label` | `color: #2c3e50` | `color: var(--color-text-secondary)` |
| `.todoForm-sectionTitle` | `color: #007fff` | `color: var(--color-star-glow)` |
| `.todoForm-input, .todoForm-select, .todoForm-textarea` | `background-color: white` | `background: rgba(255,255,255,0.06); border-color: rgba(0,212,255,0.22); color: var(--color-text-primary)` |
| `:focus` de inputs | border azul sólido | `border-color: rgba(0,212,255,0.6); box-shadow: 0 0 0 3px rgba(0,212,255,0.12); background: rgba(255,255,255,0.09)` |
| `::placeholder` | gris claro | `color: rgba(136, 146, 176, 0.55)` |
| SVG flecha del select | `stroke='%23007fff'` | `stroke='%2300d4ff'` (cambio en data URI) |
| `.todoForm-select option` | heredado | `background-color: #0d0d3a; color: var(--color-text-primary)` |
| `.segmentedControl-btn` | fondo blanco | `background: rgba(255,255,255,0.05); border-color: rgba(0,212,255,0.2); color: var(--color-text-secondary)` |
| `.segmentedControl-btn.active` | azul sólido | `background: rgba(0,212,255,0.15); color: var(--color-text-primary); border-color: var(--color-star-glow)` |
| `.todoForm-objectiveItem` | fondo blanco | `background: rgba(255,255,255,0.04); border-left-color: var(--color-star-glow)` |
| `.objectiveDescription:hover` | `background-color: #f0f7ff` | `background: rgba(0,212,255,0.08)` |
| `.objectiveIndex` | `color: #007fff` | `color: var(--color-star-glow)` |
| `.objectiveDescription` | `color: #2c3e50` | `color: var(--color-text-primary)` |
| `.todoForm-actions` | `background: #f6f6f6` | `background: rgba(10,10,46,0.97); backdrop-filter: blur(10px); border-top: 1px solid rgba(0,212,255,0.12)` |
| `.todoForm-checkboxLabel` | `color: #2c3e50` | `color: var(--color-text-primary)` |
| `.required-field` | `color: red` | `color: #ff6b6b` |
| scrollbar track | `background-color: #ecf0f1` | `background: rgba(255,255,255,0.05)` |

---

## Fase 11 — TodoForm: `crypto.randomUUID()` (S4)

**Archivo:** `src/Components/TodoForm/TodoForm.js` — línea 9

```js
const generateRandomId = () => crypto.randomUUID();
```

Disponible en Chrome 92+, Firefox 95+, Safari 15.4+. Funciona en `localhost` sin restricciones.

---

## Fase 12 — PomodoroTimer: tema oscuro

**Archivo:** `src/Components/PomodoroTimer/PomodoroTimer.css`

| Selector | Cambio |
|---|---|
| `.pomodoro-container` | Añadir `color: var(--color-text-primary)` (quitar `color: #0d0c22`) |
| `.pomodoro-description` | `color: #919191` → `color: var(--color-text-secondary)` |
| `.pomodoro-status` | `color: #888` → `color: var(--color-text-secondary)` |
| `.pomodoro-objectives` | `border-top: 2px solid #f0f0f0` → `border-top: 1px solid var(--color-border-subtle)` |
| `.objective-item:hover` | `background: #f8f9fa` → `background: rgba(255,255,255,0.05)` |
| `.objective-text` | `color: #2d2d2d` → `color: var(--color-text-primary)` |
| `.no-objectives` | `color: #999` → `color: var(--color-text-muted)` |
| `.objective-checkbox` | `accent-color: #949494` → `accent-color: var(--color-star-glow)` |
| `.pomodoro-title` | Añadir `text-shadow: 0 0 12px rgba(74, 164, 255, 0.5)` |
| `.pomodoro-timer` | Añadir `text-shadow: 0 0 20px rgba(255, 77, 77, 0.6)` (conservar color rojo) |

---

## Fase 13 — TodoSearch: acento dorado potenciado

**Archivo:** `src/Components/TodoSearch/TodoSearch.css`

```css
input.todoSearchInput {
  background: rgba(10, 10, 46, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 210, 122, 0.55);
  color: var(--color-text-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 210, 122, 0.08);
}

input.todoSearchInput:focus {
  border-color: rgba(255, 210, 122, 0.9);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(255, 210, 122, 0.12);
}

input.todoSearchInput::placeholder {
  color: var(--color-text-muted);
}
```

---

## Fase 14 — TodoCounter: Orbitron + barra de progreso (S1 + S3)

### `src/Components/TodoCounter/TodoCounter.css`

```css
h1.todoTitle {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  color: var(--color-text-primary);
}

p.adviceText {
  color: var(--color-text-secondary);
}

.progressBarContainer {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.progressBar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-star-glow), var(--color-pulsar));
  border-radius: 2px;
  transition: width 0.4s ease;
}
```

### `src/Components/TodoCounter/TodoCounter.js`

Añadir la barra condicionalmente cuando `totalTodos > 0`:

```jsx
{totalTodos > 0 && (
  <div
    className="progressBarContainer"
    aria-label={`Progreso: ${completedTodos} de ${totalTodos}`}
  >
    <div
      className="progressBar"
      style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
    />
  </div>
)}
```

---

## Fase 15 — TodoList: estado vacío + pills tema oscuro (M1)

### `src/Components/TodoList/TodoList.js`

Refactorizar la condición de lista en cada panel:

```jsx
<div className="todoListPanel">
  <ListDivider dividerText={dividerText} />
  {filterTodos.length === 0 ? (
    <p className="emptyState">
      {pillIndex === 0
        ? "No hay misiones. ¡Crea tu primera misión, comandante!"
        : pillIndex === 1
        ? "Aún no has completado ninguna misión. ¡Sigue así!"
        : "No hay misiones archivadas."}
    </p>
  ) : (
    <div className="todoListPanelContent">
      {filterTodos.map(todo => (...))}
    </div>
  )}
</div>
```

### `src/Components/TodoList/TodoList.css`

```css
.emptyState {
  color: var(--color-text-muted);
  text-align: center;
  font-style: italic;
  padding: 2rem 1rem;
  font-size: 0.95rem;
}

/* Pills */
span.headerPill {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.headerPill.active {
  background: rgba(0, 212, 255, 0.2);
  color: var(--color-text-primary);
  border-color: rgba(0, 212, 255, 0.4);
}

.todoListHeader {
  color: var(--color-text-primary);  /* era color: black */
}
```

---

## Fase 16 — FAB: aria-label + efecto reactor (C6 + S)

### `src/Components/CreateTodoButton/CreateTodoButton.js`

```jsx
<button aria-label="Crear nueva misión" className="createTodoButton">
  +
</button>
```

### `src/Components/CreateTodoButton/CreateTodoButton.css`

```css
button.createTodoButton {
  box-shadow: 0 4px 20px rgba(255, 131, 74, 0.5), 0 0 0 1px rgba(255, 131, 74, 0.2);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

button.createTodoButton:hover {
  box-shadow: 0 6px 28px rgba(255, 131, 74, 0.7), 0 0 20px rgba(255, 131, 74, 0.3);
  transform: scale(1.05);
}
```

---

## Puntos de atención transversales

### `backdrop-filter` — compatibilidad

Usado en: overlay modal, contenedor modal, tarjetas, menú overflow, barra de búsqueda.

- **Chrome 76+, Edge 79+:** soporte completo
- **Firefox 103+:** soporte completo (agosto 2022)
- **Safari 9+:** soporte con prefijo `-webkit-` (ya incluido en todas las propuestas)
- **Fallback:** el fondo queda opaco. No hay rotura visual.

### `field-sizing: content` en textarea

`TodoForm.css` línea 157 usa esta propiedad experimental (solo Chrome 123+ / Edge 123+). No eliminar — los demás navegadores la ignoran graciosamente con el `rows="4"` del HTML.

### Stacking context del OverflowMenu

`div.missionCard` tiene `position: relative`. El menú usa `position: absolute` dentro del container de la tarjeta. El `z-index: 2` del menú es suficiente para quedar sobre el contenido de la tarjeta. Si hay solapamiento visual con la tarjeta de arriba, subir a `z-index: 10` — no afecta el modal que tiene `z-index: 100+`.

---

*Este plan es completo y accionable. Cada fase puede ejecutarse en orden y es verificable visualmente antes de pasar a la siguiente.*
