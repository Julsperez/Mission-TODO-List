# Mission TODO List — Resumen Ejecutivo

**Fecha:** 2026-05-13
**Destinatarios:** Product Manager, Scrum Master
**Preparado por:** Arquitectura de Software

---

## 1. Descripcion general

**Mission TODO List** es una aplicacion web de gestion de tareas personales con estetica espacial. Su propuesta de valor central es organizar actividades del usuario bajo la metafora de "misiones", donde cada tarea puede tener un titulo, una descripcion, objetivos parciales y un estado de progreso.

La aplicacion esta disponible en produccion via GitHub Pages:
https://julsperez.github.io/Mission-TODO-List

Se trata de un proyecto en fase de prototipo funcional — tiene las funcionalidades basicas operativas y una experiencia de usuario cuidada, pero aun no esta preparada para escalar en usuarios ni en datos.

---

## 2. Funcionalidades actuales

### 2.1 Gestion de misiones (tareas)

El usuario puede crear, editar, ver en detalle, archivar, reactivar y eliminar misiones. Cada mision tiene los siguientes campos:

| Campo | Descripcion |
|---|---|
| Titulo | Nombre principal de la mision (obligatorio) |
| Subtitulo | Descripcion corta opcional |
| Descripcion | Texto largo con detalle de la mision |
| Tipo | "Principal" o "Secundaria" (clasifica la importancia) |
| Estado | En progreso / Completada / Archivada |
| Objetivos | Lista de subtareas propias de esa mision |

El formulario de creacion y edicion es el mismo componente — se reutiliza correctamente segun el contexto.

### 2.2 Objetivos dentro de una mision

Cada mision puede tener una lista de objetivos (subtareas). El usuario puede:
- Agregar objetivos al crear o editar una mision
- Marcar cada objetivo como completado o pendiente directamente desde la vista de detalle
- Tambien marcar objetivos como completados desde la sesion Pomodoro (ver abajo)

### 2.3 Filtros y busqueda

- **Busqueda por texto:** filtra misiones en tiempo real por titulo mientras el usuario escribe.
- **Filtros por estado:** pestanas "Todas", "Completadas" y "Archivadas" para segmentar la lista.

### 2.4 Contador y barra de progreso

En la parte superior de la aplicacion se muestra cuantas misiones fueron completadas sobre el total activo, acompanado de una barra de progreso visual. El mensaje cambia segun el estado del usuario (ninguna completada, algunas completadas, todas completadas).

### 2.5 Temporizador Pomodoro

Desde cualquier mision en estado "en progreso", el usuario puede abrir un temporizador Pomodoro de 25 minutos. Durante la sesion puede ver la descripcion de la mision y marcar sus objetivos como completados. El temporizador tiene botones de iniciar, pausar y reiniciar.

### 2.6 Menu de acciones rapidas

Cada tarjeta de mision tiene un menu contextual (tres puntos) con las siguientes acciones disponibles segun el estado actual de la tarea:

- Completar
- Iniciar sesion Pomodoro
- Archivar
- Reactivar (si esta archivada o completada)
- Editar
- Borrar (con confirmacion explicita para evitar eliminaciones accidentales)

### 2.7 Persistencia local

Los datos se guardan automaticamente en el navegador del usuario. No hay necesidad de iniciar sesion ni de conexion a internet para usar la aplicacion una vez cargada. Los datos persisten entre visitas.

---

## 3. Arquitectura simplificada

La aplicacion sigue una estructura de tres capas que se puede resumir asi:

```
Interfaz de usuario (Componentes visuales)
         |
  Logica compartida (Estado global con React Context)
         |
  Almacenamiento (localStorage del navegador)
```

**Componentes visuales:** Cada elemento de pantalla esta encapsulado en su propio componente independiente. Hay 11 componentes en total, cada uno con su propio archivo de estilos. Esta separacion facilita el mantenimiento y la modificacion de partes especificas sin afectar el resto.

**Estado global:** Un mecanismo central (React Context) gestiona todos los datos compartidos entre componentes: la lista de misiones, el valor de busqueda activo, que modal esta abierto, cual tarea esta seleccionada, etc. Esto evita que los componentes necesiten comunicarse entre si directamente.

**Almacenamiento:** Se detalla en la seccion siguiente.

La aplicacion se despliega como archivos estaticos en GitHub Pages — no requiere servidor propio ni infraestructura en la nube.

---

## 4. Almacenamiento actual: localStorage

### Como funciona hoy

Los datos se guardan en **localStorage**, una pequeña base de datos que los navegadores web incluyen de forma nativa en cada dispositivo. Es como un bloc de notas que el navegador mantiene por dominio. Los datos se escriben y leen instantaneamente, sin pasar por ningun servidor externo.

### Ventajas (por que es una buena decision para este momento)

- **Sin infraestructura:** No hay servidor, no hay base de datos, no hay costos de hosting ni de mantenimiento de backend.
- **Velocidad:** La lectura y escritura de datos es inmediata — no hay llamadas de red.
- **Simplicidad operativa:** El sistema no puede "caerse" por un problema de servidor o de conectividad.
- **Ideal para prototipo:** Permitio construir y validar la experiencia de usuario sin friccion tecnica adicional.

### Desventajas y limitaciones (por que no puede ser la solucion definitiva)

- **Los datos solo existen en ese navegador, en ese dispositivo.** Si el usuario abre la aplicacion en su telefono, no vera las misiones que creo en su computadora. No hay sincronizacion.
- **Los datos se pierden si el usuario limpia la cache o el historial del navegador.** Es una operacion comun que muchos usuarios hacen periodicamente sin saber que borra datos de aplicaciones.
- **Capacidad maxima de aproximadamente 5 MB.** Para una lista de tareas con texto esto es suficiente en el corto plazo, pero no escala si se agregan adjuntos, imagenes u otros tipos de contenido.
- **No hay multi-usuario.** No es posible compartir misiones con otras personas, asignar tareas a un equipo ni colaborar.
- **No hay historial ni auditoria.** No se puede saber cuando fue creada una mision, quien la modifico, ni recuperar versiones anteriores.
- **No hay respaldo.** Si el dispositivo falla, los datos se pierden definitivamente.

### Conclusion sobre el almacenamiento

localStorage es la decision correcta para un prototipo de validacion. No es la decision correcta para un producto que vaya a crecer en usuarios o en funcionalidad. La migracion a una base de datos real es un paso necesario antes de cualquier expansion seria.

---

## 5. Por que migrar a una base de datos real

Cuando la aplicacion pase de ser un prototipo personal a un producto con mas de un usuario o con datos que importa no perder, localStorage deja de ser viable. Una base de datos real (como PostgreSQL, MySQL o incluso Firebase para una primera version) aporta:

- **Acceso desde cualquier dispositivo y navegador** — los datos viven en un servidor, no en el navegador.
- **Durabilidad garantizada** — los datos no desaparecen por limpiar cache ni por cambiar de equipo.
- **Soporte para multiples usuarios** — cada persona tendria su cuenta y sus datos separados.
- **Posibilidad de compartir y colaborar** — base necesaria para features como equipos, asignacion de tareas, comentarios.
- **Capacidad sin limite practico** — miles de tareas, adjuntos, historial de cambios.
- **Seguridad y autenticacion** — los datos estan protegidos y asociados a una identidad verificada.

Esta migracion implica agregar un backend (API) y un sistema de autenticacion de usuarios — es el siguiente salto de complejidad tecnica del proyecto.

---

## 6. Areas de mejora identificadas

### Experiencia de usuario (UX)

- No existe una fecha de vencimiento (deadline) para las misiones. Es una de las features mas esperadas en cualquier gestor de tareas.
- El temporizador Pomodoro no genera ninguna notificacion cuando termina el tiempo. El usuario tiene que estar mirando la pantalla para saberlo.
- No hay forma de reordenar manualmente las misiones (drag-and-drop o prioridad numerica).
- Las misiones "completadas" no se excluyen automaticamente del contador total, lo que puede generar confusion en la barra de progreso en casos bordes.
- No hay confirmacion visible al guardar una mision — el modal simplemente se cierra.

### Accesibilidad

- La navegacion completa por teclado no esta garantizada en todos los componentes (el menu contextual de tres puntos y las pestanas de filtro usan `span` en lugar de elementos semanticos como `button`).
- No hay manejo de foco explicito cuando se abre o cierra el modal — un lector de pantalla puede perder el contexto.
- Los colores de estado (completado, archivado) no tienen iconos alternativos, lo que puede ser problematico para usuarios con daltonismo.

### Calidad de codigo

- La logica de actualizacion de tareas esta duplicada: existe en `AppContext.js`, en `TodoList.js` y parcialmente en `TodoContext/index.js` (funcion `updateTodo`). Hay tres lugares que hacen cosas similares — esto es deuda tecnica que complica futuros cambios.
- La clave de localStorage (`defaultTodosV1`) esta escrita directamente en el codigo. El propio codigo tiene un comentario senalando que deberia estar en un archivo de configuracion de entorno. Es una mejora pequena con impacto real en mantenibilidad.
- No hay ningun test automatizado. Cualquier cambio se verifica manualmente.
- El Pomodoro siempre inicia con 25 minutos fijos. La duracion no es configurable por el usuario.

---

## 7. Nuevas funcionalidades posibles

### Prioridad alta — faciles de implementar (bajo costo, alto valor)

Estas features se pueden agregar sin cambiar la arquitectura actual:

| Feature | Descripcion | Esfuerzo estimado |
|---|---|---|
| Fecha de vencimiento | Campo de fecha en el formulario, indicador visual si la mision vencio | Bajo |
| Notificacion al terminar Pomodoro | Alerta del navegador cuando el temporizador llega a cero | Bajo |
| Duracion configurable del Pomodoro | El usuario elige cuantos minutos quiere (15, 25, 50) | Bajo |
| Contador de objetivos completados | Mostrar "2 de 5 objetivos" en la tarjeta de mision | Bajo |
| Exportar lista como PDF o texto | Descargar las misiones activas en un formato portable | Medio |

### Prioridad media — requieren trabajo de disenio y algo mas de desarrollo

| Feature | Descripcion | Esfuerzo estimado |
|---|---|---|
| Etiquetas o categorias | Clasificar misiones por proyecto, area o tema | Medio |
| Prioridad numerica o drag-and-drop | Reordenar misiones manualmente | Medio |
| Modo oscuro / claro | Preferencia visual persistida | Medio |
| Vista de calendario | Ver misiones con fecha en formato calendario | Alto |

### Prioridad baja — requieren migracion a backend primero

Estas features no son viables con localStorage y requieren la infraestructura de base de datos mencionada en la seccion 5:

| Feature | Descripcion |
|---|---|
| Registro e inicio de sesion | Autenticacion de usuarios |
| Sincronizacion multi-dispositivo | Datos en la nube, accesibles desde cualquier lugar |
| Colaboracion en equipo | Compartir listas, asignar misiones a otras personas |
| Historial de cambios | Ver quien modifico que y cuando |
| Notificaciones push | Recordatorios por correo o notificacion movil |

---

## 8. Conclusion y siguiente paso recomendado

Mission TODO List tiene una base solida para un prototipo: la logica de negocio esta bien separada, la interfaz es consistente, hay features no triviales ya implementadas (Pomodoro, objetivos por tarea, menu contextual con confirmacion), y el codigo tiene una estructura que facilita el crecimiento.

El riesgo principal es tecnico y de datos: la persistencia en localStorage es el techo del proyecto actual. Antes de agregar funcionalidades que generen expectativa en usuarios reales, el equipo debe decidir si va a dar el paso hacia una arquitectura con backend.

**Recomendacion concreta para el proximo sprint o ciclo de trabajo:**

1. **Corto plazo (sin cambiar arquitectura):** Implementar fecha de vencimiento y notificacion al finalizar el Pomodoro. Son las mejoras de mayor valor con menor costo tecnico. Adicionalmente, eliminar la duplicacion de logica de actualizacion de tareas para reducir la deuda tecnica antes de que escale.

2. **Mediano plazo (decision estrategica):** Definir si el producto va a escalar a multiples usuarios. Si la respuesta es si, el equipo tecnico debe iniciar el disenio del backend y el sistema de autenticacion. Esta decision determina el roadmap de los proximos tres a seis meses.

3. **En paralelo:** Agregar tests automaticos al menos para las operaciones criticas (crear, editar, completar, borrar una mision). Sin tests, cada nueva feature agrega riesgo de romper lo que ya funciona.

---

**Preguntas abiertas para el equipo antes de priorizar el backlog:**

- ¿El producto esta pensado para uso personal (un solo usuario) o para equipos?
- ¿Hay un plazo o evento que requiera tener la version con backend lista?
- ¿Cuales son las metricas de exito actuales? ¿Retencion de usuario, numero de misiones creadas, sesiones Pomodoro completadas?
- ¿Existe presupuesto para infraestructura en la nube si se decide avanzar con backend?
