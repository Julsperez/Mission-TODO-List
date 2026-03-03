---
description: Flujo integral que vincula la arquitectura de datos con el desarrollo frontend senior.
---

steps:
    - name: fase_analisis_arquitectonico
      action: "Analizar la petición del usuario bajo la mentalidad del 'reglamento_react_basico'."
      call_skill: software_architect
      arguments:
        propuesta: "{{user_objective}}"

    - name: fase_estructura_datos
      action: "Definir el modelo de datos necesario para la funcionalidad."
      call_skill: arquitecto_de_datos
      arguments:
        nombre_modelo: "{{user_objective}}"
        campos: ["id", "uuid", "created_at", "updated_at", "status", "payload"]
        relaciones: "Analizar dependencias con modelos existentes"

    - name: fase_diseño_experiencia
      action: "Diseñar la interfaz basándose en el modelo de datos definido previamente."
      call_skill: ui_ux_designer
      arguments:
        elemento: "{{user_objective}}"
        contexto_estilo: "Extraer tokens de diseño del proyecto"

    - name: fase_generacion_codigo
      action: "Ejecutar el engine para crear carpetas, hooks y servicios vinculados al modelo de datos."
      call_skill: frontend_feature_engine
      arguments:
        nombre: "{{user_objective}}"
        alcance: "feature"
        descripcion_funcional: "Implementar la lógica definida por el Arquitecto de Datos y el UI Designer."
        usa_backend: true

    - name: fase_aseguramiento_calidad
      action: "Validar que el código compila y que el modelo de datos no rompe tipos existentes."
      call_skill: quality_assurance
      arguments:
        verificar_build: true

    - name: cierre_y_aprobacion
      action: "Explicar la arquitectura final, mostrar el esquema de datos y solicitar confirmación (SI/NO)."