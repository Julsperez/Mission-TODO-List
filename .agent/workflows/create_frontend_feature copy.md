---
description: Flujo de ciclo de vida completo (SDLC) con documentación automática.
---


steps:
    - name: fase_analisis_arquitectonico
      action: "Analizar la petición bajo el 'reglamento_react_basico'."
      call_skill: software_architect
      arguments:
        propuesta: "{{user_objective}}"

    - name: fase_estructura_datos
      call_skill: arquitecto_de_datos
      arguments:
        nombre_modelo: "{{user_objective}}"
        campos: ["id", "uuid", "created_at", "status"]

    - name: fase_diseño_ux
      call_skill: ui_ux_designer
      arguments:
        elemento: "{{user_objective}}"

    - name: fase_generacion_codigo
      call_skill: frontend_feature_engine
      arguments:
        nombre: "{{user_objective}}"
        alcance: "feature"
        usa_backend: true

    - name: fase_aseguramiento_calidad
      call_skill: quality_assurance
      arguments:
        verificar_build: true

    - name: fase_documentacion
      action: "Generar el manual técnico de la feature."
      call_skill: documentation_expert
      arguments:
        nombre_feature: "{{user_objective}}"
        detalles_tecnicos: "Funcionalidad desarrollada siguiendo el reglamento senior."
        path_destino: "./src/features/{{user_objective}}"

    - name: cierre_y_aprobacion
      action: "Explicar la solución, mostrar el README y solicitar confirmación (SI/NO)."