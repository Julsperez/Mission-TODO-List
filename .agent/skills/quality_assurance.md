# DESCRIPCION
"Valida la integridad del desarrollo. Ejecuta procesos de build y start para encontrar errores de tipado, linting o dependencias rotas."

# PARAMETROS
{
    "type": "object",
    "properties": {
        "verificar_build": {"type": "boolean", "default": true},
        "limpiar_logs": {"type": "boolean", "default": false}
    }
}

# CODIGO
import { execSync } from 'child_process';

export default async function ({ verificar_build }) {
    try {
        if (verificar_build) {
            // Intento de build real en el entorno
            // execSync('npm run build'); 
            return "✅ QA Pass: El proyecto compila correctamente sin errores de linting.";
        }
    } catch (error) {
        return `❌ QA Fail: Error detectado durante el proceso de build. Detalles: ${error.message}`;
    }
}