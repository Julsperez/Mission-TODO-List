PROMPT PARA GOOGLE STITCH — REDISEÑO UI: MISSION TODO LIST
===========================================================

Instrucciones de uso: Ingresa los bloques en orden. El BLOQUE 0 establece
el sistema de diseño completo y DEBE ingresarse primero. Los bloques
siguientes diseñan cada pantalla usando ese sistema como base.

===========================================================
BLOQUE 0 — SISTEMA DE DISEÑO (ingresar primero)
===========================================================

Antes de diseñar cualquier pantalla, aplica estas reglas de sistema de
diseño para toda la propuesta. Todos los componentes deben seguir estos
tokens sin excepción.

TEMA VISUAL: Futurista-espacial limpio. La estética evoca una interfaz de
control de misiones espaciales, pero sin exceso de glows ni ruido visual.
El estilo busca el equilibrio entre ciencia ficción y usabilidad cotidiana:
dark mode profundo, acentos de luz cian eléctrico, jerarquía tipográfica
clara, componentes con bordes finos translúcidos y glassmorphism moderado.
La app debe sentirse como una herramienta de productividad real usada por
alguien que también disfruta la estética sci-fi.

AUDIENCIA: Adultos de 20 a 40 años, trabajadores creativos o técnicos,
experiencia media-alta en apps de productividad. Usan la app principalmente
en mobile. Aprecian la personalidad visual pero priorizan la claridad
funcional.

PALETA DE COLORES:
- void (fondo más profundo):              #050718
- nebula-deep (fondo contenedor):         #0a0a2e
- nebula-mid (fondo elevado):             #12144a
- star-glow (acento primario / activo):   #00d4ff
- pulsar (acento secundario / énfasis):   #7b2ff7
- nova (CTA principal / crear):           #ff834a
- mission-main (badge principal):         #3b82f6
- mission-side (badge secundaria):        #10b981
- danger (error / borrar):               #e05555
- warning (vencida / alerta):            #f59e0b
- success (completada / objetivo):       #2ecc71
- text-primary:                          #e8eaf6
- text-secondary:                        #8892b0
- text-muted:                            #4a5568
- border-subtle:                         rgba(0, 212, 255, 0.15)

TIPOGRAFÍA:
- Display / H1: Orbitron, 700, 2rem, letter-spacing 0.02em
- H2 (título de modal): Orbitron, 700, 1.4rem
- H3 (sección interna): Inter, 600, 1rem, uppercase, letter-spacing 0.05em, color star-glow
- Body: Inter, 400, 0.95rem, line-height 1.5
- Label / caption: Inter, 600, 0.8rem
- Timer (Pomodoro): Orbitron, 700, 5.5rem — NO usar Courier New ni monospace genérico

ESPACIADO BASE (múltiplos de 4px): 4, 8, 12, 16, 20, 24, 32, 48, 64 px

COMPONENTES:
- Cards de misión: border-radius 12px, padding 20px, border 1px solid border-subtle,
  background nebula-deep con backdrop-filter blur(12px)
- Botones CTA primarios: border-radius 8px, padding 12px 24px, background nova, color blanco, font-weight 600
- Botones secundarios: border-radius 8px, padding 12px 24px, background rgba(255,255,255,0.08),
  border 1px solid rgba(255,255,255,0.15), color text-primary
- Botones ghost: sin fondo, sin borde, color text-secondary
- Inputs: border-radius 8px, padding 12px, border 1px solid border-subtle,
  background rgba(255,255,255,0.06), focus ring 2px solid star-glow, sin outline nativo
- Badge Principal: background #3b82f620, border #3b82f680, texto #93c5fd, 0.75rem 600 uppercase, border-radius 6px
- Badge Secundaria: background #10b98120, border #10b98180, texto #6ee7b7, 0.75rem 600 uppercase, border-radius 6px
- Badge En Progreso: gradiente #ffd27a → #ff9f43, texto oscuro, border-radius 20px
- Badge Completada: background #2ecc71, texto blanco, border-radius 20px
- Badge Archivada: background #bdc3c7, texto oscuro, border-radius 20px
- Modal: border-radius 16px, max-width 560px, max-height 88vh,
  background rgba(10,10,46,0.92) backdrop-filter blur(16px), border 1px solid rgba(0,212,255,0.25), scroll interno
- FAB: 64x64px, border-radius 50%, background nova, icono "+" blanco 2.5rem,
  box-shadow 0 4px 20px rgba(255,131,74,0.5)
- Barra de progreso: height 8px, border-radius 4px, fill gradiente star-glow → pulsar, transition 400ms ease

ELEVACIÓN:
- Cards:    box-shadow 0 4px 24px rgba(0,0,0,0.4)
- Modal:    box-shadow 0 8px 40px rgba(0,0,0,0.6)
- Dropdown: box-shadow 0 8px 24px rgba(0,0,0,0.5)
- Hover:    box-shadow 0 8px 32px rgba(0,212,255,0.1)

REGLAS OBLIGATORIAS:
- NO usar Courier New ni monospace para display visual
- NO exponer enums en inglés: main → Principal, side → Secundaria,
  in-progress → En Progreso, completed → Completada, archived → Archivada
- NO mostrar opción "Archivada" al CREAR misión nueva (solo en edición)
- Toda acción destructiva requiere confirmación en dos pasos
- Accesibilidad WCAG AA: contraste 4.5:1 texto body, focus-visible con ring star-glow,
  touch targets mínimos 44x44px, no comunicar estado solo con color


===========================================================
BLOQUE 1 — PANTALLA PRINCIPAL: Lista de Misiones
===========================================================

Diseña la pantalla principal mobile-first de Mission TODO List aplicando
el sistema de diseño definido. Fondo: #050718 con imagen de galaxia
difuminada al 75%.

ESTRUCTURA (de arriba hacia abajo):

1. HEADER DE PROGRESO:
   - Título H1 Orbitron centrado, dinámico:
     * Sin misiones: "¡Bienvenid@ a tu lista de misiones!"
     * 0 completadas: "No has completado ninguna misión"
     * Todas completadas: "¡Has completado todas tus misiones!"
     * Parcial: "¡Has completado 3 de 7 misiones!"
   - Párrafo motivacional body text-secondary centrado debajo del título
   - Barra de progreso (8px, gradiente star-glow → pulsar) + porcentaje "42%"
     en caption text-secondary alineado a la derecha justo encima de la barra.
     Solo visible si hay misiones.

2. BARRA DE FILTROS (sticky al scrollear):
   - Tres pills full-ancho con gap 8px: "Todas" | "Completadas" | "Archivadas"
   - Inactivo: background rgba(255,255,255,0.08), border rgba(255,255,255,0.1), texto text-secondary
   - Activo: background rgba(0,212,255,0.2), border star-glow, texto text-primary, ícono check pequeño
   - Al hacer sticky: backdrop-filter blur(10px), box-shadow hacia abajo, top 0

3. CARDS DE MISIONES:
   - Fila superior: badge Tipo (izq.) + botón "···" 32x28px background rgba(255,255,255,0.1) border-radius 8px (der.)
   - Badge "VENCIDA" si aplica: background rgba(255,77,77,0.15), color #ff4d4d,
     border 1px solid #ff4d4d, border-radius 10px, 0.7rem 600
   - Título Inter 600 1.2rem text-primary. Si completada: line-through + text-muted
   - Subtítulo Inter 400 0.9rem text-secondary. Si completada: line-through + text-muted
   - Mini barra progreso objetivos (4px) + "2 de 5 objetivos" caption text-muted (solo si hay objetivos)
   - Archivada: opacity 0.6, borde más sutil, badge desaturado
   - Mobile < 768px: una columna. Tablet+: grid 2-3 columnas, gap 16px
   - Antes de la lista: separador H3 + línea horizontal border-subtle

4. BARRA DE ACCIÓN INFERIOR (fija, 64px de alto):
   - Buscador pill centrado: ícono lupa + placeholder "Buscar misión...",
     glassmorphism nebula-deep, border #ffd27a al 55%
   - FAB 64px circular en esquina inferior derecha, ligeramente elevado sobre la barra
   - padding-bottom: env(safe-area-inset-bottom)

5. ANIMACIONES:
   - Cards al montar: fade-in + translateY(8px→0) en 300ms ease
   - Card hover: translateY(-2px) + intensificación glow borde en 250ms ease


===========================================================
BLOQUE 2 — MODAL DETALLE DE MISIÓN
===========================================================

Modal glassmorphism del sistema (max-width 560px, max-height 88vh).
Overlay rgba(5,7,24,0.82) backdrop-filter blur(4px).

CONTENIDO:

1. Botón cierre: X 30px esquina superior derecha, color danger, sin fondo

2. Título H2 Orbitron + subtítulo Inter body text-secondary.
   Si completada: line-through + text-muted en ambos.

3. Fila metadatos:
   - Izq.: badge Tipo + badge Estado (estilos del sistema, siempre en español)
   - Der.: fecha vencimiento con ícono calendario en text-secondary.
     Si vencida: texto rojo #e05555 con ícono alerta

4. Sección DESCRIPCIÓN:
   - Label H3 uppercase star-glow
   - Párrafo body text-secondary. Sin descripción: "Sin descripción." text-muted italic

5. Sección OBJETIVOS (n de m):
   - Label H3 uppercase star-glow + mini barra 6px debajo
   - Cada objetivo: borde izq. 3px solid star-glow, padding 10px,
     background rgba(255,255,255,0.04), border-radius 0 8px 8px 0
   - Checkbox 18px accent-color star-glow + texto Inter 400 1rem
   - Al completar: line-through + opacity 0.7, transición 300ms
   - Sin objetivos: "No hay objetivos para esta misión." text-muted italic

6. Footer (alineado a la derecha):
   - "Editar": estilo secundario
   - "Cerrar": background star-glow, color void, font-weight 700

Entrada modal: scale(0.95→1) + opacity(0→1) en 200ms ease


===========================================================
BLOQUE 3 — MODAL FORMULARIO: Crear / Editar Misión
===========================================================

Mismo contenedor modal. Footer de acciones sticky al bottom. Scroll interno.
Título H2 Orbitron centrado: "Crear Nueva Misión" o "Editar Misión".

SECCIÓN 1 — INFORMACIÓN BÁSICA (H3 uppercase star-glow):
- Input Título: label + badge "* requerido" en danger. Error al enviar vacío:
  borde rojo + mensaje "Este campo es requerido"
- Input Subtítulo
- Input fecha vencimiento type="date" con ícono calendario inline derecha
- Textarea descripción: auto-expandible, min 2 filas
- Todos los inputs: background rgba(255,255,255,0.06), border 1px solid rgba(0,212,255,0.22),
  border-radius 8px, padding 12px. Focus: border star-glow + ring 2px rgba(0,212,255,0.12)

SECCIÓN 2 — ESTADO (H3 uppercase star-glow):
- Segmented "Tipo": "Principal" | "Secundaria" — siempre en fila horizontal (nunca apilados)
- Segmented "Estado": "En Progreso" | "Completada" — en edición agregar "Archivada"
  (NO mostrar "Archivada" al crear misión nueva)
- Activo: background rgba(0,212,255,0.15), border star-glow, color text-primary
- Inactivo: background rgba(255,255,255,0.05), border rgba(0,212,255,0.2), color text-secondary

SECCIÓN 3 — OBJETIVOS (H3 uppercase star-glow):
- Input + botón check verde #2ecc71 en fila. Enter para confirmar.
- Lista: índice en star-glow, texto, ícono editar al hover, botón X rojo para eliminar
- Edición inline: texto reemplazado por input con autoFocus

FOOTER STICKY (backdrop-filter blur(10px), borde superior rgba(0,212,255,0.12)):
- Mobile: "Cancelar" (ghost) arriba + "Crear Misión" (CTA nova) abajo, full-width
- Desktop: "Cancelar" (ghost) | "Crear Misión" (CTA nova), alineados a la derecha


===========================================================
BLOQUE 4 — DROPDOWN DE ACCIONES
===========================================================

Botón disparador "···": 32x28px, background rgba(255,255,255,0.1), border-radius 8px.
Hover/active: background rgba(255,255,255,0.2), color text-primary.

Menú: background rgba(12,12,48,0.96) backdrop-filter blur(12px),
border 1px solid rgba(0,212,255,0.2), border-radius 12px, padding 10px, min-width 160px.

POSICIÓN ADAPTIVA:
- Tercio superior del viewport → abre hacia abajo
- Resto → abre hacia arriba (bottom: calc(100% + 8px))
- Siempre alineado al borde derecho del botón

OPCIONES (padding 10px 12px, border-radius 6px al hover, ícono a la derecha):
- "Completar" + check — lightseagreen. Solo si NO completada Y NO archivada
- "Pomodoro" + reloj — #ff6b6b. Solo si En Progreso
- "Archivar" + caja — #9b59b6. Solo si NO archivada
- "Reactivar" + flecha — dodgerblue. Solo si archivada O completada
- "Editar" + lápiz — dodgerblue. Solo si NO archivada Y NO completada
- "Borrar" + papelera — danger (#e05555). Siempre visible

CONFIRMACIÓN BORRADO (reemplaza el ítem inline):
- Texto "¿Eliminar esta misión?" 0.85rem text-secondary centrado
- "Sí, borrar": background rgba(231,76,60,0.25), border rgba(231,76,60,0.4), color #ff6b6b
- "Cancelar": background rgba(255,255,255,0.08), color text-secondary


===========================================================
BLOQUE 5 — MODAL POMODORO TIMER
===========================================================

Mismo contenedor modal. Contenido centrado verticalmente (flex column align-items center).

1. Nombre de la misión: H2 Orbitron 1.4rem, color star-glow,
   text-shadow 0 0 12px rgba(0,212,255,0.5), text-align center

2. Subtítulo y descripción: 0.8rem text-secondary centrado, gap 4px

3. Selector duración: pills "15 min" | "25 min" | "50 min"
   - Inactivo: border 2px solid rgba(0,212,255,0.15), color text-secondary, border-radius 20px
   - Activo: border 2px solid star-glow, background rgba(0,212,255,0.15), color star-glow, font-weight 600

4. Timer: Orbitron 700 5.5rem, centrado, margin 20px 0
   - En espera / pausado: color star-glow
   - Corriendo: color #ff4d4d, text-shadow 0 0 20px rgba(255,77,77,0.6)
   - Completado (00:00): color success #2ecc71, text-shadow verde, animación pulso

5. Estado textual: Inter italic 0.9rem text-secondary debajo del timer
   "Listo para iniciar tarea" / "Enfocado en la misión..." / "Pausado" / "¡Misión completada!"

6. Controles (flex row, gap 20px, centrados):
   - Play: 64px círculo, border 4px solid #97ca3f, color #97ca3f. Hover: fondo #97ca3f, color void
   - Pause: 64px círculo, border 4px solid #ff4d4d, color #ff4d4d. Hover: fondo #ff4d4d, color white
   - Reset: 56px círculo, border 4px solid star-glow, color star-glow. Hover: fondo star-glow, color void

7. Objetivos: borde superior border-subtle, label H3 uppercase star-glow,
   checkboxes idénticos al BLOQUE 2, max-height 200px con scroll.
   Sin objetivos: text-muted italic centrado.


===========================================================
BLOQUE 6 — ESTADOS GLOBALES
===========================================================

CARGANDO:
- Ícono astronauta flotando (keyframe up-down 2s infinite ease-in-out)
  o círculo con glow star-glow girando
- H2 Orbitron "Cargando misiones..." centrado
- Subtexto "Sincronizando con la base espacial..." body text-secondary centrado

ERROR:
- Ícono alerta centrado
- H2 Orbitron "Error al cargar las misiones" color danger
- Descripción del problema en body text-secondary con instrucción de recuperación
- Botón "Reintentar" estilo secundario, centrado

VACÍO (adaptar texto al contexto):
- Ilustración astronauta con banderín o planeta con anillo, tonos star-glow/pulsar
- H2 Orbitron según contexto activo:
  * Sin misiones: "¡Bienvenid@ a tu lista de misiones!"
  * Filtro Completadas: "Aún no has completado ninguna misión."
  * Filtro Archivadas: "No hay misiones archivadas."
- Subtexto motivacional body text-secondary
- Solo en vacío general: botón CTA "Crear primera misión" en nova (#ff834a)


===========================================================
BLOQUE 7 — INSTRUCCIONES FINALES DE COHERENCIA
===========================================================

ANIMACIONES GLOBALES:
- Cards al montar: opacity 0→1 + translateY(8px→0) 300ms ease
- Entrada modales: scale(0.95→1) + opacity(0→1) 200ms ease
- Hover cards: translateY(-2px) + glow borde 250ms ease
- Barra progreso: transition width 400ms ease
- Checkboxes al completar: opacity + text-decoration 300ms

CONSISTENCIA — VERIFICAR:
- Badges de tipo idénticos en card, modal detalle, formulario y Pomodoro
- Botón cierre modal siempre: X danger 30px esquina superior derecha
- Títulos de sección siempre: H3 uppercase letter-spacing color star-glow
- Inputs de formulario y buscador tienen el mismo estilo base
- Checkboxes de objetivos idénticos en modal detalle y Pomodoro
- Botones CTA primarios siempre nova (#ff834a), nunca star-glow

RESPONSIVE:
- Mobile first base 375px
- 768px: grid 2 cols para cards, segmented controls en fila horizontal
- 1024px: max-width 800px centrado, grid 3 cols para cards
- Touch targets 44x44px mínimo
- Footer con padding-bottom env(safe-area-inset-bottom)

ACCESIBILIDAD:
- focus-visible en todos los interactivos: outline 2px solid star-glow, offset 2px
- Modal atrapa el foco mientras está abierto (focus trap)
- Al abrir formulario: foco automático en input Título
- Mensajes de error descriptivos con acción de recuperación
