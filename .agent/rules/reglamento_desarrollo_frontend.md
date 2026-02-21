---
trigger: always_on
---

---
trigger: always_on
domain: frontend
---

# REGLAMENTO DE DESARROLLO FRONTEND (SENIOR STANDARDS)

## 1. COMUNICACIÓN Y FILOSOFÍA DE PRODUCTO
- **Idioma:** Responde siempre en español neutro con tono profesional y orientado a producto.
- **Control de Cambios:** Antes de realizar cualquier modificación estructural o de arquitectura, explica el "qué" y el "por qué". Requiere confirmación explícita (SI/NO) del usuario.
- **Mentalidad Senior:** Actúa como un revisor de código. Si una instrucción del usuario viola una buena práctica de escalabilidad, adviértelo antes de proceder.

## 2. ARQUITECTURA Y STACK TÉCNICO
- **Core:** Prioriza el uso de **React** con **TypeScript**. Está estrictamente prohibido el uso de `any`.
- **Estrategia:** Adopta un enfoque **Mobile-First** y diseño responsivo para todos los componentes.
- **Patrones de Diseño:** Implementa una separación clara entre componentes de presentación y lógica (Hooks). Fomenta el uso de componentes reutilizables y atómicos.
- **Mantenibilidad:** Sigue los principios **DRY** (Don't Repeat Yourself) y **SOLID**. Si un archivo excede las 200 líneas, sugiere una descomposición modular.

## 3. ESTÉTICA Y UX
- **Estilos:** Prioriza el uso de **Tailwind CSS** para un diseño limpio y consistente.
- **UI:** Aplica bordes redondeados (standard: `rounded-xl` o `2xl`) y una paleta de colores coherente con el modo claro/oscuro.
- **Rendimiento:** Implementa carga perezosa (`React.lazy`) para rutas y optimiza imágenes para mejorar el Core Web Vitals (LCP/CLS).

## 4. GESTIÓN DE DATOS Y ERRORES
- **Mocking:** Genera datos locales estructurados (mock data) para asegurar demos funcionales sin dependencia de backend inmediato.
- **Robustez:** Implementa **Error Boundaries** y validaciones de tipos en todas las entradas de datos. Asegura que los estados de carga (loading) y error estén contemplados en la UI.

## 5. CICLO DE VIDA DE DESARROLLO (QA)
- **Calidad:** Mantén el código formateado y libre de advertencias de linter.
- **Validación en Tiempo Real:** Antes de entregar cualquier cambio, ejecuta `npm run start` internamente para verificar la funcionalidad y resuelve el 100% de los errores detectados.
- **Verificación Final:** Ejecuta obligatoriamente `npm run build`. Solo tras una compilación exitosa sin errores de tipado o dependencias, sugiere al usuario la aprobación final de los cambios.