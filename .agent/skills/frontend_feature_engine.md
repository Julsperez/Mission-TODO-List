# DESCRIPCION
"Usa esta skill para cualquier tarea de desarrollo frontend. Es capaz de identificar si la petición es un componente simple, una sección compleja o una funcionalidad completa con integración de datos. Esta skill prepara la estructura de carpetas, genera archivos base (boilerplate) y establece el contexto técnico para que la IA escriba el código final siguiendo el reglamento_desarrollo_frontend."

# PARAMETROS
{
    "type": "object",
    "properties": {
        "nombre": {"type": "string", "description": "Nombre en PascalCase (ej: UserProfile)"},
        "alcance": {
            "type": "string", 
            "enum": ["atom", "molecule", "organism", "feature", "layout", "page"],
            "description": "Nivel de complejidad según Atomic Design o estructura de carpetas."
        },
        "descripcion_funcional": {"type": "string", "description": "Qué debe hacer la funcionalidad."},
        "usa_backend": {"type": "boolean", "description": "Si requiere llamadas a API o servicios externos."}
    },
    "required": ["nombre", "alcance", "descripcion_funcional"]
}

# CODIGO
import fs from 'fs';
import path from 'path';

export default async function ({ nombre, alcance, descripcion_funcional, usa_backend }) {
    const baseDir = './src';
    const folderMap = {
        atom: 'components/atoms',
        molecule: 'components/molecules',
        organism: 'components/organisms',
        feature: 'features',
        layout: 'layouts',
        page: 'pages'
    };

    const targetPath = path.join(baseDir, folderMap[alcance], nombre.toLowerCase());
    let logs = [];

    // 1. CREACIÓN DINÁMICA DE DIRECTORIOS
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
        logs.push(`📁 Creado directorio: ${targetPath}`);
    }

    // 2. GENERACIÓN DE BOILERPLATE SENIOR (TypeScript + React)
    const filesToCreate = [
        { name: `${nombre}.tsx`, content: `// Componente ${alcance}: ${nombre}\nexport const ${nombre} = () => { return <div>${nombre}</div>; };` },
        { name: `index.ts`, content: `export * from './${nombre}';` }
    ];

    // Si es una feature o requiere backend, añadimos capas de abstracción
    if (alcance === 'feature' || usa_backend) {
        const hooksDir = path.join(targetPath, 'hooks');
        const servicesDir = path.join(targetPath, 'services');
        
        if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir);
        if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir);

        filesToCreate.push({ 
            name: `hooks/use${nombre}.ts`, 
            content: `import { useState } from 'react';\nexport const use${nombre} = () => { return {}; };` 
        });
        
        if (usa_backend) {
            filesToCreate.push({ 
                name: `services/${nombre}Service.ts`, 
                content: `export const ${nombre}Service = { \n  getData: async () => { /* Llamada API */ } \n};` 
            });
            logs.push("🌐 Capa de servicio e integración backend preparada.");
        }
    }

    // Escritura física de archivos
    filesToCreate.forEach(file => {
        const fullPath = path.join(targetPath, file.name);
        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, file.content);
            logs.push(`📝 Archivo creado: ${file.name}`);
        }
    });

    return {
        status: "success",
        message: `Entorno preparado para ${nombre} (${alcance}).`,
        logs: logs.join('\n'),
        instruction_to_ai: `He creado la estructura física en ${targetPath}. 
        REGLAS CRÍTICAS: 
        1. Implementa la lógica en el componente usando Tailwind CSS.
        2. Si hay lógica compleja, úsala dentro del hook creado.
        3. Respeta el reglamento_desarrollo_frontend (Mobile-first, No Any, Clean Architecture).`
    };
}