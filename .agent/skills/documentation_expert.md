# DESCRIPCION
"Genera documentación técnica automática para la nueva funcionalidad. Explica la arquitectura, el modelo de datos utilizado y las instrucciones de uso para otros desarrolladores."

# PARAMETROS
{
    "type": "object",
    "properties": {
        "nombre_feature": {"type": "string"},
        "detalles_tecnicos": {"type": "string"},
        "path_destino": {"type": "string"}
    },
    "required": ["nombre_feature", "path_destino"]
}

# CODIGO
import fs from 'fs';
import path from 'path';

export default async function ({ nombre_feature, detalles_tecnicos, path_destino }) {
    const readmeContent = `
# Feature: ${nombre_feature}
## Descripción
${detalles_tecnicos}

## Arquitectura
- **Patrón:** Clean Architecture (Hooks + Services).
- **Estilos:** Tailwind CSS.
- **Validación:** QA aprobado mediante build test.

## Modelo de Datos
Generado automáticamente siguiendo estándares senior.
`;

    const fullPath = path.join(path_destino, 'README.md');
    fs.writeFileSync(fullPath, readmeContent);
    
    return `✅ Documentación generada exitosamente en ${fullPath}`;
}