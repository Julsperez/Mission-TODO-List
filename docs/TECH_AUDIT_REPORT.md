# Auditoría Técnica — Mission TODO List

**Fecha:** 2026-04-14  
**Auditor:** Guido (Senior Software Architect)  
**Repositorio:** `curso-react-intro`  
**Stack auditado:** React 18, Create React App, vanilla CSS, React Context, localStorage

---

## 1. Resumen ejecutivo

La aplicación es un proyecto de aprendizaje bien encaminado. El dominio es simple, la estructura de carpetas es coherente y hay decisiones correctas — el portal de Modal con `ReactDOM.createPortal`, el manejo de cierre con clic en overlay, el sticky header con `IntersectionObserver`. Para ser un curso introductorio, el nivel es razonablemente sólido.

Sin embargo, hay un conjunto de problemas concretos que, en contexto de aprendizaje, es importante nombrar con precisión porque instalan malos hábitos. Los más importantes son: un bug de pérdida de datos silenciosa en `useLocalStorage`, duplicación de lógica de negocio entre componentes (violación de DRY con impacto real en consistencia), dependencias faltantes en `useEffect` que pueden producir comportamientos stale, y un identificador de objetivo (`objectiveId`) generado con un antipatrón que garantiza colisiones.

No se encontraron vulnerabilidades de seguridad críticas — el scope de la app no lo amerita. Los problemas de accesibilidad son corregibles sin rediseño.

**Conteo de hallazgos:** 6 críticos/altos, 7 medios, 6 bajos.

---

## 2. Fallas de lógica

### 2.1 — `objectiveId` basado en `length` garantiza colisiones

**Archivo:** `src/Components/TodoForm/TodoForm.js`, línea 61  
**Código problemático:**
```js
objectiveId: formData.objectives.length + 1,
```

**Descripción:** El ID del objetivo se calcula como `cantidad_actual + 1`. Si el usuario tiene 3 objetivos (IDs 1, 2, 3), borra el tercero y agrega uno nuevo, el nuevo recibirá ID 3 — colisionando con el historial. En `TodoShowInfo` y `PomodoroTimer`, el toggle de objetivos busca por `objectiveId`. Una colisión causa que el toggle afecte al objetivo incorrecto o que React use la misma `key` para nodos distintos.

**Impacto:** Bug de comportamiento silencioso. El usuario marca un objetivo como completado y otro se marca (o desmarca) en su lugar.

**Solución:**
```js
objectiveId: crypto.randomUUID(),
```
`crypto.randomUUID()` ya se usa en el mismo archivo para `missionId` (línea 9). Aplicar el mismo patrón es consistente y correcto.

---

### 2.2 — `useLocalStorage` guarda el valor inicial sin serializar

**Archivo:** `src/TodoContext/useLocalStorage.js`, líneas 15-17  
**Código problemático:**
```js
if (!localStorageItem) {
  localStorage.setItem(keyItem, initialItemValue); // initialItemValue es []
  parsedItem = [];
}
```

**Descripción:** Cuando no existe el ítem en localStorage, se llama a `localStorage.setItem(keyItem, [])`. `localStorage.setItem` convierte el valor a string mediante `.toString()`, entonces `[]` se convierte en la cadena vacía `""`. En la próxima carga, `localStorageItem` será `""`, que es falsy en JavaScript, por lo que entrará nuevamente al bloque `if (!localStorageItem)` y nunca llegará a `JSON.parse`. El ciclo se repite indefinidamente y el estado nunca persiste correctamente para el valor inicial.

**En la práctica:** Para este caso concreto el bug está enmascarado porque `parsedItem = []` se asigna correctamente y `updateItem` (que sí usa `JSON.stringify`) escribe bien los datos una vez que el usuario crea su primer todo. Pero si alguien borra todos los todos, `updateItem` guardará `"[]"` y el próximo arranque leerá `"[]"` → `JSON.parse("[]")` → `[]`, lo cual sí funciona. El bug dormido se activaría si se cambia el valor inicial a algo distinto de `[]`.

**Impacto:** Medio-alto. Bug latente. La solución incorrecta en el camino "inicialización" produce código que guarda basura en localStorage y es difícil de debuggear.

**Solución:**
```js
if (!localStorageItem) {
  localStorage.setItem(keyItem, JSON.stringify(initialItemValue));
  parsedItem = initialItemValue;
}
```

---

### 2.3 — Estado de filtro (`filterTodos`) no sincronizado con `todos` al editar

**Archivo:** `src/Components/TodoList/TodoList.js`, líneas 36-38  
**Código problemático:**
```js
useEffect(() => {
  handleSelectedPill(pillIndex);
}, [searchedTodos]);
```

**Descripción:** `filterTodos` es estado local derivado de `searchedTodos`. Cuando el usuario edita un todo desde el `OverflowMenu` → `handleEdit` (que actúa directamente sobre `todos` global), `searchedTodos` cambia y dispara el efecto, que llama a `handleSelectedPill(pillIndex)`. Esto está correcto para la mayoría de casos. Sin embargo, el efecto tiene `[searchedTodos]` como dependencia pero llama a `handleSelectedPill` que cierra sobre `pillIndex`. Si `pillIndex` cambiara durante el mismo ciclo de render (poco probable pero arquitectónicamente frágil), el efecto usaría el `pillIndex` stale. Más importante: esta sincronización debería ser un estado derivado, no estado local con efecto.

**Impacto:** Bajo en la práctica actual, pero el patrón "estado local que espeja estado global con useEffect" es una fuente conocida de bugs de sincronización y debe ser reemplazado.

**Solución:** `filterTodos` debe ser un valor calculado directamente en render:
```js
const filterTodos = React.useMemo(() => {
  if (pillIndex === 0) return searchedTodos;
  if (pillIndex === 1) return searchedTodos.filter(t => t.isCompleted && t.status !== "archived");
  return searchedTodos.filter(t => t.status === "archived");
}, [searchedTodos, pillIndex]);
```
Eliminar el `useState(filterTodos)` y el `useEffect` de sincronización.

---

### 2.4 — Inconsistencia entre `isCompleted` y `status` al completar un todo

**Archivo:** `src/Components/TodoItem/TodoItem.js`, líneas 16-22  
**Descripción:** Al marcar "complete", se setean `isCompleted: true` Y `status: "completed"`. Al marcar "active", se setea `isCompleted: false` Y `status: "in-progress"`. Pero al archivar (línea 25), solo se cambia `status: "archived"` sin tocar `isCompleted`. Si un todo estaba completado y se archiva, queda con `isCompleted: true` y `status: "archived"`. En el filtro de "Completadas" (línea 45 de `TodoList`), se excluye correctamente `status !== "archived"`, pero el contador de `completedTodos` en `TodoContext` (línea 32) cuenta todos los `isCompleted` sin excluir archivados. El `TodoCounter` muestra entonces un número que no coincide con los que el usuario ve en la pestaña "Completadas".

**Impacto:** Bug de UI visible. El contador de progreso no refleja la realidad percibida por el usuario.

**Solución:** Normalizar en `TodoContext`:
```js
const completedTodos = todos.filter(
  todo => todo.isCompleted && todo.status !== "archived"
).length;
```

---

### 2.5 — El estado `task` en contexto puede quedar stale al editar desde `TodoShowInfo`

**Archivo:** `src/App/AppContext.js`, líneas 86-89; `src/Components/TodoShowInfo/TodoShowInfo.js`, líneas 11-29  
**Descripción:** `TodoShowInfo` recibe `task` como prop desde `AppContext` (que lo obtiene del contexto como `task`). Cuando el usuario hace toggle de un objetivo dentro de `TodoShowInfo`, actualiza `todos` global y llama a `setTask(updatedTask)` para reflejar el cambio localmente. Sin embargo, cuando desde `TodoShowInfo` se presiona "Editar" → el flujo cambia a `TodoForm` con el mismo `task` del contexto. Si el usuario hizo 2-3 toggles de objetivos y luego presiona editar, `TodoForm` recibe el `task` del contexto, que fue actualizado con `setTask`. Esto funciona porque `setTask` actualiza el contexto. Pero `PomodoroTimer` hace lo mismo con `setTask` y si el usuario alterna entre Pomodoro y ShowInfo sin cerrar el modal (flujo no previsto), el `task` del contexto puede desincronizarse con `todos`. Es un problema de fuente de verdad duplicada: `task` en contexto y `todos` en contexto conviven con información que puede divergir.

**Impacto:** Medio. La arquitectura actual tiene dos fuentes de verdad para el mismo dato.

**Solución arquitectónica:** `task` debería derivarse de `todos` por `missionId`, no mantenerse como estado independiente. Ver sección 8.

---

## 3. Problemas de rendimiento

### 3.1 — `matchByTitle` se recrea en cada render del Provider

**Archivo:** `src/TodoContext/index.js`, líneas 8-12  
**Descripción:** `matchByTitle` es una función declarada dentro del cuerpo del componente `TodoProvider`. Se recrea en cada render. No es un problema de rendimiento severo por sí sola — las funciones puras son baratas. El problema real es que `searchedTodos` (línea 33) se calcula también en cada render:

```js
const searchedTodos = matchByTitle(todos, searchValue);
```

Cada vez que cualquier estado del contexto cambia (por ejemplo, `openTaskModal`), `TodoProvider` re-renderiza, recalcula `searchedTodos`, crea un nuevo array, y todos los consumidores del contexto que usen `searchedTodos` re-renderizan aunque `todos` y `searchValue` no hayan cambiado.

**Impacto:** Renders innecesarios en cascada. Con pocos todos el impacto es imperceptible, pero el patrón es incorrecto.

**Solución:**
```js
const searchedTodos = React.useMemo(
  () => todos.filter(todo =>
    todo.title.toLowerCase().includes(searchValue.toLowerCase())
  ),
  [todos, searchValue]
);
```
Y mover `matchByTitle` fuera del componente o eliminarlo directamente.

---

### 3.2 — El valor del contexto crea un objeto nuevo en cada render

**Archivo:** `src/TodoContext/index.js`, líneas 36-56  
**Descripción:** El objeto pasado a `value` del Provider se crea inline en cada render:
```js
<TodoContext.Provider value={{ completedTodos, error, ... }}>
```
Esto garantiza que todos los consumidores del contexto re-rendericen en cada render del Provider, independientemente de qué cambió. Sin `React.memo` en los consumidores ni separación de contextos, el efecto es amplificado.

**Impacto:** Bajo en escala actual, pero el patrón establece un techo de rendimiento bajo si la app crece.

**Solución parcial** (sin over-engineering):
```js
const contextValue = React.useMemo(() => ({
  completedTodos, error, loading, totalTodos, searchedTodos,
  todos, setTodos, searchValue, setSearchValue,
  openTaskModal, setOpenTaskModal, isEditTask, setIsEditTask,
  isShowTaskInfo, setIsShowTaskInfo, task, setTask,
  isShowPomodoro, setIsShowPomodoro
}), [completedTodos, error, loading, totalTodos, searchedTodos,
    todos, searchValue, openTaskModal, isEditTask, isShowTaskInfo,
    task, isShowPomodoro]);
```

---

### 3.3 — `usePomodoro`: el efecto se ejecuta en cada tick del timer

**Archivo:** `src/Hooks/usePomodoro.js`, líneas 17-31  
**Descripción:** La dependencia del efecto incluye `[isActive, timeLeft]`. Como `timeLeft` cambia cada segundo cuando el timer está activo, el efecto se desmonta y remonta cada segundo: limpia el `setInterval` anterior y crea uno nuevo. Esto es funcionalmente correcto pero ineficiente. El patrón correcto para un timer que debe persistir es usar `useRef` para el interval y solo reaccionar a cambios de `isActive`.

**Impacto:** Bajo para un timer de 25 minutos. Sin impacto visible. Pero es una mala práctica de referencia para aprender.

**Solución:**
```js
React.useEffect(() => {
  if (!isActive) {
    clearInterval(timerRef.current);
    return;
  }
  timerRef.current = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        setIsActive(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timerRef.current);
}, [isActive]); // solo depende de isActive
```

---

### 3.4 — `TodoList` usa `React.Fragment` innecesario como wrapper de `TodoItem`

**Archivo:** `src/Components/TodoList/TodoList.js`, líneas 95-99  
**Descripción:**
```jsx
<React.Fragment key={todo.missionId}>
  <TodoItem todo={todo} onItemUpdated={updateTodos} />
</React.Fragment>
```
El `Fragment` existe solo para colocar el `key`. Se puede poner directamente en `TodoItem`.

**Impacto:** Ninguno en rendimiento. Es ruido sintáctico.

**Solución:**
```jsx
<TodoItem key={todo.missionId} todo={todo} onItemUpdated={updateTodos} />
```

---

## 4. Malas prácticas de React

### 4.1 — `useEffect` con dependencias faltantes en `TodoForm`

**Archivo:** `src/Components/TodoForm/TodoForm.js`, línea 43  
**Código problemático:**
```js
React.useEffect(() => {
  if (editView && Object.keys(task).length !== 0) {
    setFormData({ ...task });
  }
}, [task]); // falta editView
```

**Descripción:** El efecto depende de `editView` pero no lo declara en el array de dependencias. Si `editView` cambia (por ejemplo, el modal se reutiliza para crear después de editar sin unmount completo), el efecto no se dispara con el nuevo valor de `editView`. ESLint con `eslint-plugin-react-hooks` marcaría esto como error.

**Impacto:** Comportamiento stale potencial en el formulario. Difícil de reproducir en el flujo actual porque el modal se cierra al enviar, pero es una bomba de tiempo si el flujo cambia.

**Solución:** `}, [task, editView]);`

---

### 4.2 — `useEffect` sin dependencias en `useLocalStorage` puede ignorar cambios de `keyItem`

**Archivo:** `src/TodoContext/useLocalStorage.js`, líneas 9-28  
**Descripción:** El efecto que inicializa desde localStorage tiene dependencias vacías `[]`. Si `keyItem` cambiara (no ocurre en esta app, pero es un hook genérico), el efecto no se volvería a ejecutar y el hook quedaría leyendo datos del key anterior. Además, `initialItemValue` se usa dentro del efecto sin estar en las dependencias, lo que viola la regla de exhaustividad.

**Impacto:** Bajo en el uso actual. Medio si el hook se reutiliza con keys dinámicos.

**Solución:** Si el hook debe ser realmente genérico:
```js
}, [keyItem]); // initialItemValue debería ser estable (useRef o valor primitivo)
```

---

### 4.3 — `key` basada en índice de array en lista de objetivos

**Archivo:** `src/Components/TodoForm/TodoForm.js`, línea 276  
**Código problemático:**
```jsx
{formData.objectives.map((objective, index) => (
  <div key={index} className="todoForm-objectiveItem">
```

**Descripción:** Usar el índice como `key` en una lista donde los elementos pueden reordenarse o eliminarse causa que React recicle nodos DOM incorrectamente. Si el usuario borra el objetivo 1 de 3, React considera que el "nodo 0" sigue siendo el mismo y no desmonta el componente — el estado interno de ese nodo (como el `autoFocus` del input de edición) puede quedar en el elemento equivocado.

**Impacto:** Bug de UX al editar y borrar objetivos. Si se edita el objetivo 1 y luego se borra el 0, el input de edición puede aparecer en el objetivo incorrecto.

**Solución:** Usar `objective.objectiveId` como key (una vez corregido el punto 2.1):
```jsx
<div key={objective.objectiveId} className="todoForm-objectiveItem">
```

---

### 4.4 — `onKeyPress` deprecado

**Archivo:** `src/Components/TodoForm/TodoForm.js`, línea 261  
**Código problemático:**
```jsx
onKeyPress={(e) => e.key === "Enter" && handleAddObjective()}
```

**Descripción:** `onKeyPress` está deprecado desde React 17 y eliminado del estándar de navegadores modernos. Algunos navegadores ya no lo disparan para ciertas teclas.

**Solución:** Reemplazar con `onKeyDown`:
```jsx
onKeyDown={(e) => e.key === "Enter" && handleAddObjective()}
```

---

### 4.5 — `generateRandomId` se llama en la inicialización del estado con función inline

**Archivo:** `src/Components/TodoForm/TodoForm.js`, líneas 9, 11  
**Código problemático:**
```js
const generateRandomId = () => crypto.randomUUID();
const [formData, setFormData] = useState({
  missionId: generateRandomId(),
  ...
});
```

**Descripción:** `generateRandomId()` se llama como parte del objeto de estado inicial. React solo usa el valor inicial del `useState` en el primer render. Esto es correcto. Sin embargo, si el componente se desmonta y remonta (por ejemplo, al cerrar y reabrir el modal sin navegación de página), se genera un nuevo UUID — que es el comportamiento deseado para crear. El problema es que `generateRandomId` se define en cada render aunque nunca se vuelve a llamar después del primer render. Es ruido menor.

**Impacto:** Despreciable en rendimiento. Es ruido conceptual.

**Solución:** Usar inicializador lazy de useState:
```js
const [formData, setFormData] = useState(() => ({
  missionId: crypto.randomUUID(),
  ...
}));
```

---

### 4.6 — `TodoList` duplica la función `updateTodos` que podría vivir en el contexto

**Archivo:** `src/Components/TodoList/TodoList.js`, líneas 56-66  
**Descripción:** `updateTodos` es lógica de negocio (eliminar o modificar un todo) que vive en un componente de presentación. Esta lógica debería estar en el contexto o en un hook de dominio, no en `TodoList`. El componente debería solo renderizar y delegar.

**Impacto:** Bajo en la app actual. Medio en mantenibilidad: si se necesita eliminar un todo desde otro componente, hay que duplicar la lógica.

---

### 4.7 — `TodoForm` llama `setOpenTaskModal(false)` internamente además de usar `onSubmit`

**Archivo:** `src/Components/TodoForm/TodoForm.js`, línea 117  
**Código problemático:**
```js
const handleSubmit = (e) => {
  e.preventDefault();
  if (formData.title.trim()) {
    if (onSubmit) onSubmit(formData, editView); // AppContext ya llama handleCloseModal
    setOpenTaskModal(false); // duplicado e innecesario
  }
};
```

**Descripción:** `onSubmit` en `AppContext` llama `handleCloseModal()` que ya llama `setOpenTaskModal(false)`. El componente `TodoForm` también llama `setOpenTaskModal(false)` directamente, accediendo al contexto. Esto viola la encapsulación: un componente hijo no debería manipular el estado global directamente cuando tiene un callback disponible para hacerlo. En este caso es inofensivo, pero establece un patrón de acoplamiento innecesario.

**Solución:** Eliminar `const { setOpenTaskModal, openTaskModal } = React.useContext(TodoContext)` de `TodoForm` y dejar que toda la orquestación del modal la maneje el padre a través de los callbacks.

---

## 5. Malas prácticas de CSS

### 5.1 — Selectores con elemento + clase innecesariamente específicos

**Archivos:** `src/App/App.css`, `src/Components/TodoItem/TodoItem.css`, `src/Components/Modal/Modal.css`  
**Ejemplos:**
```css
/* App.css */
h2.appLoadingMessage { ... }
div.appContainerHeader { ... }
button.closeButtonModal { ... }

/* TodoItem.css */
div.missionCard { ... }
span.missionLabel { ... }
h3.missionCard-title { ... }
p.missionCard-subtitle { ... }

/* Modal.css */
div.modalContainer { ... }
```

**Descripción:** Prefixar el selector de clase con el tipo de elemento (`div.missionCard`, `h2.appLoadingMessage`) aumenta la especificidad sin necesidad. Si en algún momento se cambia el elemento HTML (por razones semánticas, como cambiar un `div` por un `article`), el CSS deja de aplicarse silenciosamente.

**Impacto:** Bajo en mantenibilidad. Medio en escalabilidad del CSS.

**Solución:** Usar solo la clase: `.missionCard { ... }`, `.appLoadingMessage { ... }`.

---

### 5.2 — Colores hardcodeados mezclados con variables CSS

**Archivos:** múltiples CSS  
**Ejemplos:**
```css
/* TodoItem.css */
background: rgba(10, 10, 46, 0.78);          /* debería ser var(--color-nebula-deep) con alpha */
border: 1px solid rgba(0, 212, 255, 0.18);   /* debería ser var(--color-star-glow) con alpha */
color: #93c5fd;                               /* sin variable */
color: #6ee7b7;                               /* sin variable */

/* App.css */
color: #e05555;                               /* sin variable */
```

**Descripción:** `index.css` define un sistema de design tokens completo (custom properties). Sin embargo, los componentes mezclan el uso de esas variables con colores hardcodeados. Esto hace que un cambio de paleta requiera editar múltiples archivos.

**Solución:** Extender las variables existentes para cubrir todos los valores de color usados:
```css
:root {
  --color-danger:        #e05555;
  --color-mission-main-text: #93c5fd;
  --color-mission-side-text: #6ee7b7;
}
```

---

### 5.3 — `width: -webkit-fill-available` sin fallback estándar

**Archivo:** `src/Components/TodoList/TodoList.css`, línea 36  
**Código problemático:**
```css
width: -webkit-fill-available;
```

**Descripción:** `-webkit-fill-available` es una propiedad no estándar (vendor-prefixed). Firefox no la soporta con ese nombre. El equivalente estándar es `width: stretch` o `width: -moz-available` para Firefox.

**Solución:**
```css
width: -webkit-fill-available;
width: -moz-available;
width: stretch;
```

---

### 5.4 — Clase `.appHeaderActions` definida pero sin uso

**Archivo:** `src/App/App.css`, línea 21  
**Código problemático:**
```css
div.appHeaderActions {
    display: flex;
    justify-content: space-between;
}
```

**Descripción:** Esta clase está definida en CSS pero no aparece en ningún componente JSX del proyecto. Es CSS muerto.

**Impacto:** Ninguno en runtime. Ruido en mantenibilidad.

---

### 5.5 — `span.archived::after` agrega texto via CSS

**Archivo:** `src/Components/TodoItem/TodoItem.css`, líneas 64-67  
**Código problemático:**
```css
span.archived::after {
    content: "Archivado";
    margin-left: 6px;
}
```

**Descripción:** Insertar texto semántico (la palabra "Archivado") mediante CSS `::after` es una mala práctica de accesibilidad y mantenibilidad. El texto CSS no es leído por todos los lectores de pantalla, no puede ser traducido/internacionalizado, y desaparece silenciosamente si el CSS no carga. Además, el texto "Archivado" ya se renderiza condicionalmente en el JSX de `TodoShowInfo` como badge de estado, por lo que podría haber duplicación.

**Solución:** Renderizar el texto en el JSX donde corresponda, con lógica condicional.

---

## 6. Accesibilidad

### 6.1 — Modal no gestiona el foco ni tiene `role="dialog"`

**Archivo:** `src/Components/Modal/Modal.js`  
**Descripción:** El componente `Modal` no implementa:
1. `role="dialog"` en el contenedor.
2. `aria-modal="true"` para indicar a los lectores de pantalla que el contenido detrás no es interactivo.
3. `aria-labelledby` apuntando al título del modal.
4. Gestión de foco: al abrir el modal, el foco debería moverse al primer elemento interactivo dentro del modal. Al cerrarlo, debería regresar al elemento que lo abrió.
5. Trampa de foco (focus trap): el usuario con teclado puede salir del modal con Tab y seguir interactuando con el fondo.

**Impacto:** Alto para usuarios de tecnología asistiva y usuarios que navegan con teclado.

**Solución mínima:**
```jsx
<div
  className="modalContainer"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  onClick={(e) => e.stopPropagation()}
>
```
Para la trampa de foco, usar una librería como `focus-trap-react` (estable, en npm) o implementar la lógica manualmente con `querySelectorAll` de elementos focusables.

---

### 6.2 — Elementos interactivos implementados como `<span>` sin semántica

**Archivo:** `src/Components/OverflowMenu/OverflowMenu.js`, líneas 89, 101, 128, 140, 149, 181  
**Descripción:** Las opciones del menú se implementan como `<span role="menuitem" tabIndex={0}>` con manejadores `onClick`. Si bien tienen `role="menuitem"` y `tabIndex`, les falta:
1. Manejo de `onKeyDown` para activar con Enter/Space (el estándar de ARIA para menuitem).
2. Los usuarios de teclado pueden alcanzar el elemento con Tab pero no pueden activarlo con Enter.

**Impacto:** Medio. Menú inutilizable para usuarios de teclado y lectores de pantalla que esperan activación con Enter.

**Solución:** Cambiar los `<span>` de opciones a `<button type="button">` con los estilos correspondientes, o agregar `onKeyDown`:
```jsx
onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleOption(e, "complete");
  }
}}
```

---

### 6.3 — `TodoSearch` sin `<label>` asociado

**Archivo:** `src/Components/TodoSearch/TodoSearch.js`, línea 10  
**Descripción:** El input de búsqueda no tiene un `<label>` asociado ni atributos `aria-label` o `aria-labelledby`. El `placeholder` no es un sustituto válido de label según WCAG 2.1.

**Solución:**
```jsx
<label htmlFor="search-input" className="sr-only">Buscar misión</label>
<input
  id="search-input"
  aria-label="Buscar misión"
  ...
/>
```

---

### 6.4 — `TodoCounter` usa `<h1>` que cambia de texto dinámicamente sin anuncio

**Archivo:** `src/Components/TodoCounter/TodoCounter.js`  
**Descripción:** El `<h1>` cambia de contenido basado en el estado de completitud. Los lectores de pantalla no anuncian automáticamente cambios en headings. Para que el cambio sea notificado al usuario, el elemento debería tener `aria-live="polite"`.

**Solución:**
```jsx
<div aria-live="polite" aria-atomic="true">
  <h1 className="todoTitle">...</h1>
</div>
```

---

### 6.5 — `lang` del HTML en inglés, app en español

**Archivo:** `public/index.html`, línea 2  
**Código problemático:**
```html
<html lang="en">
```

**Descripción:** Todo el contenido de la app está en español. El atributo `lang="en"` hace que los lectores de pantalla usen pronunciación inglesa para texto español, produciendo una experiencia ininteligible.

**Solución:**
```html
<html lang="es">
```

---

### 6.6 — `progressBarContainer` no tiene `role="progressbar"` completo

**Archivo:** `src/Components/TodoCounter/TodoCounter.js`, líneas 35-41  
**Descripción:** La barra de progreso tiene `aria-label` pero le faltan `role="progressbar"`, `aria-valuenow`, `aria-valuemin` y `aria-valuemax` para ser correctamente interpretada por tecnología asistiva.

**Solución:**
```jsx
<div
  className="progressBarContainer"
  role="progressbar"
  aria-valuenow={completedTodos}
  aria-valuemin={0}
  aria-valuemax={totalTodos}
  aria-label={`Progreso: ${completedTodos} de ${totalTodos} misiones completadas`}
>
```

---

## 7. Seguridad

### 7.1 — Sin sanitización de input antes de guardar en localStorage

**Archivos:** `src/Components/TodoForm/TodoForm.js`, `src/TodoContext/useLocalStorage.js`  
**Descripción:** Los valores de `title`, `subtitle` y `description` se guardan directamente en localStorage sin sanitización. Sin embargo, dado que los datos se renderizan como texto (`{todo.title}`, `{task.description}`) y no como HTML (`dangerouslySetInnerHTML`), React escapa automáticamente los caracteres especiales. No hay vector de XSS en el flujo actual.

**Impacto:** Bajo. Sin riesgo de XSS en la implementación actual. Si en algún momento se agregara renderizado de Markdown o HTML, esto cambiaría a crítico.

**Recomendación:** Documentar explícitamente que el contenido se renderiza siempre como texto plano. Agregar validación de longitud máxima en los inputs para evitar que localStorage crezca sin límite.

---

### 7.2 — `crypto.randomUUID()` requiere contexto seguro

**Archivo:** `src/Components/TodoForm/TodoForm.js`, línea 9  
**Descripción:** `crypto.randomUUID()` solo está disponible en contextos seguros (HTTPS o localhost). En un entorno HTTP de producción, la app rompería silenciosamente al intentar crear un todo. Create React App en desarrollo usa localhost (seguro), pero en producción sobre HTTP esto fallaría.

**Impacto:** Medio. El deploy está configurado en GitHub Pages (HTTPS), así que no es un problema activo. Pero si se despliega en un servidor HTTP sin TLS, la app rompe.

**Recomendación:** Agregar un fallback:
```js
const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
```

---

### 7.3 — `description` de la página es el texto por defecto de CRA

**Archivo:** `public/index.html`, línea 9  
**Código problemático:**
```html
<meta name="description" content="Web site created using create-react-app" />
```

**Descripción:** No es un problema de seguridad, pero sí de identidad y profesionalismo. Cualquier crawler indexará la app con la descripción de CRA.

**Solución:** Actualizar a una descripción real: `"Mission TODO List — gestiona tus misiones espaciales"`.

---

## 8. Propuesta arquitectónica y patrones de diseño

Esta es una app de aprendizaje pequeña. Las recomendaciones que siguen están calibradas para ese contexto: no se propone reescribir todo, sino identificar los patrones que, aprendidos ahora, evitarán deuda técnica real en proyectos futuros.

### 8.1 — Separar "fuentes de verdad": eliminar `task` del contexto global

**Problema actual:** `task` en el contexto es una copia de un elemento de `todos`. Dos fuentes de verdad para el mismo dato.

**Patrón aplicable:** Derived State / Single Source of Truth.

**Propuesta:** Guardar en contexto solo `selectedTaskId` (el ID de la tarea activa). Los componentes que necesiten los datos completos de la tarea la derivan de `todos`:

```js
// En contexto:
const [selectedTaskId, setSelectedTaskId] = React.useState(null);

// En los componentes que necesitan la tarea:
const task = React.useMemo(
  () => todos.find(t => t.missionId === selectedTaskId) ?? null,
  [todos, selectedTaskId]
);
```

Beneficio: cuando `handleToggleObjective` actualiza `todos`, el componente automáticamente ve los datos actualizados sin necesidad de llamar `setTask` manualmente.

---

### 8.2 — Extraer lógica de negocio de los componentes a un hook de dominio

**Problema actual:** `updateTodos` (eliminar/modificar un todo) vive en `TodoList`. `handleSubmitTodo` (crear/editar) vive en `AppContext`. `handleToggleObjective` está duplicada en `TodoShowInfo` y `PomodoroTimer`.

**Patrón aplicable:** Custom Hook como capa de dominio.

**Propuesta:** Crear `src/TodoContext/useTodos.js`:

```js
function useTodos() {
  const { todos, setTodos } = React.useContext(TodoContext);

  const addTodo = (newTodo) => setTodos(prev => [newTodo, ...prev]);

  const updateTodo = (updatedTodo) =>
    setTodos(prev => prev.map(t =>
      t.missionId === updatedTodo.missionId ? updatedTodo : t
    ));

  const deleteTodo = (missionId) =>
    setTodos(prev => prev.filter(t => t.missionId !== missionId));

  const toggleObjective = (missionId, objectiveId) =>
    setTodos(prev => prev.map(t =>
      t.missionId !== missionId ? t : {
        ...t,
        objectives: t.objectives.map(obj =>
          obj.objectiveId === objectiveId
            ? { ...obj, isCompleted: !obj.isCompleted }
            : obj
        )
      }
    ));

  return { todos, addTodo, updateTodo, deleteTodo, toggleObjective };
}
```

Beneficio: elimina la duplicación de `handleToggleObjective` en `TodoShowInfo` y `PomodoroTimer`, centraliza las operaciones y hace testeable la lógica de negocio de forma aislada.

---

### 8.3 — Separar el contexto de UI del contexto de datos

**Problema actual:** `TodoContext` mezcla estado de datos (`todos`, `loading`, `error`) con estado de UI (`openTaskModal`, `isEditTask`, `isShowTaskInfo`, `isShowPomodoro`, `task`). Cualquier cambio de estado de UI (abrir el modal) hace que todos los consumidores de datos también re-rendericen.

**Patrón aplicable:** Context Splitting.

**Propuesta:** Dividir en dos contextos:
- `TodoDataContext`: `todos`, `loading`, `error`, operaciones CRUD.
- `TodoUIContext`: estado del modal, tarea seleccionada, filtros de UI.

Los componentes suscriben solo al contexto que necesitan. `TodoCounter` solo necesita `TodoDataContext`. `Modal` solo necesita `TodoUIContext`.

---

### 8.4 — Considerar `useReducer` para el estado del modal

**Problema actual:** El estado del modal son 4 flags booleanos (`openTaskModal`, `isEditTask`, `isShowTaskInfo`, `isShowPomodoro`) que se deben mantener sincronizados manualmente. `handleCloseModal` los resetea todos. Si se agrega una vista nueva al modal, hay que agregar otro booleano y actualizar `handleCloseModal`.

**Patrón aplicable:** State Machine via `useReducer`.

**Propuesta:**
```js
const modalReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_CREATE': return { view: 'create', taskId: null };
    case 'OPEN_EDIT':   return { view: 'edit',   taskId: action.taskId };
    case 'OPEN_INFO':   return { view: 'info',   taskId: action.taskId };
    case 'OPEN_POMODORO': return { view: 'pomodoro', taskId: action.taskId };
    case 'CLOSE':       return { view: null,     taskId: null };
    default: return state;
  }
};

const [modalState, dispatchModal] = React.useReducer(modalReducer, { view: null, taskId: null });
```

Beneficio: el estado del modal es una máquina de estados explícita. Imposible tener `isEditTask: true` e `isShowTaskInfo: true` al mismo tiempo porque solo hay un `view`. Agregar nuevas vistas es trivial.

---

### 8.5 — Evaluación de TypeScript

Para un proyecto de aprendizaje que progresa, la introducción de TypeScript resolvería varios de los bugs documentados antes de que lleguen a producción:

- El bug de `objectiveId` (punto 2.1) sería evidente si `ObjectiveId` fuera `string` (UUID) vs `number` (length+1).
- La inconsistencia entre `isCompleted` y `status` (punto 2.4) se modelaría con un tipo discriminado.
- Las dependencias faltantes en `useEffect` se detectan con ESLint + TypeScript en la mayoría de los IDEs.

No es urgente en un curso intro, pero es el siguiente paso lógico.

---

## 9. Priorización de mejoras

| # | Problema | Archivo(s) | Severidad | Esfuerzo | Impacto |
|---|----------|-----------|-----------|----------|---------|
| 1 | `objectiveId` con `length+1` garantiza colisiones | `TodoForm.js:61` | Alto | Bajo (1 línea) | Alto — bug de datos silencioso |
| 2 | `lang="en"` con contenido en español | `index.html:2` | Alto | Bajo (1 atributo) | Alto — accesibilidad rota para todos los usuarios de lector de pantalla |
| 3 | Modal sin `role="dialog"`, sin focus trap, sin gestión de foco | `Modal.js` | Alto | Medio | Alto — inutilizable con teclado/lector de pantalla |
| 4 | Contador de completadas incluye archivadas | `TodoContext/index.js:32` | Alto | Bajo (1 línea) | Medio — bug de UI visible |
| 5 | `localStorage.setItem` sin `JSON.stringify` en inicialización | `useLocalStorage.js:16` | Alto | Bajo (1 línea) | Alto — bug latente de pérdida de datos |
| 6 | `handleToggleObjective` duplicada en `TodoShowInfo` y `PomodoroTimer` | ambos archivos | Medio | Bajo | Medio — violación de DRY, inconsistencia garantizada en el futuro |
| 7 | `key={index}` en lista de objetivos | `TodoForm.js:276` | Medio | Bajo (1 línea) | Medio — bug de UX al reordenar/borrar objetivos |
| 8 | `onKeyPress` deprecado | `TodoForm.js:261` | Medio | Bajo (1 palabra) | Bajo — puede dejar de funcionar en browsers futuros |
| 9 | Opciones de OverflowMenu como `<span>` sin activación por teclado | `OverflowMenu.js` | Medio | Medio | Medio — inutilizable con teclado |
| 10 | `TodoSearch` sin label accesible | `TodoSearch.js` | Medio | Bajo | Medio — accesibilidad |
| 11 | `searchedTodos` sin `useMemo` en Provider | `TodoContext/index.js:33` | Medio | Bajo | Bajo — renders innecesarios |
| 12 | Estado del modal como 4 booleanos (fragile state) | `TodoContext/index.js`, `AppContext.js` | Medio | Medio | Medio — mantenibilidad |
| 13 | `filterTodos` como estado local espejando estado global | `TodoList.js:10-38` | Medio | Bajo | Bajo — fuente de bugs de sincronización |
| 14 | `useEffect` del timer re-ejecuta cada segundo | `usePomodoro.js:17-31` | Bajo | Bajo | Bajo — ineficiencia pedagógica |
| 15 | `task` duplicado en contexto vs en array `todos` | `TodoContext/index.js:27` | Medio | Medio | Medio — dos fuentes de verdad |
| 16 | CSS: colores hardcodeados mezclados con variables | múltiples `.css` | Bajo | Bajo | Bajo — mantenibilidad |
| 17 | CSS: selectores elemento+clase con especificidad innecesaria | múltiples `.css` | Bajo | Bajo | Bajo — mantenibilidad |
| 18 | CSS: `.appHeaderActions` muerta | `App.css:21` | Bajo | Bajo (borrar) | Bajo |
| 19 | CSS: `::after` con texto semántico | `TodoItem.css:64` | Bajo | Bajo | Bajo — accesibilidad periférica |
| 20 | `description` meta tag con texto de CRA | `index.html:9` | Bajo | Bajo (1 línea) | Bajo — identidad |

---

*Fin del reporte. Preguntas abiertas que el equipo debe responder antes de avanzar:*

1. *¿El sistema de estados (`in-progress`, `completed`, `archived`) es la fuente de verdad, o lo es `isCompleted`? Actualmente coexisten y divergen. Elegir uno y eliminar el otro.*
2. *¿Se planea agregar más vistas al modal en el futuro? Si la respuesta es sí, implementar el reducer de estado de modal ahora es más barato que después.*
3. *¿Se planea persistir los datos en un backend? Si es así, la arquitectura de `useLocalStorage` necesita una capa de abstracción (repositorio) antes de que el acoplamiento al storage concreto se expanda.*
