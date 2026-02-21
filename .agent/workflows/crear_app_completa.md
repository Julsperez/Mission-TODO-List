---
description: Flujo orquestado para crear una aplicacion desde cero siguiendo el reglamento
---

steps:
    - name: analizar_peticion
      action: "Analizar la peticion del usuario bajo la Rule 'reglamento'."

    - name: definir_estructura_datos
      call_skill: arquitecto_de_datos
      arguments:
        nombre_modelo: "{{user_objective}}"
        campos: ["id","nombre","creado_el","estado"]
    
    - name: diseñar_interfaz
      call_skill: artesano_de_interfaz
      arguments:
        tipo_componente: "panel"
        color_primario: "#1E88E5"
        es_interactivo: true
    
    -name: validacion_final
      action: "Validar que el resultado cumple con el reglamento y pedir confirmacion al usuario."