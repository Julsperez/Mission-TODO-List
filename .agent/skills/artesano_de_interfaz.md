# DESCRIPCION
"Usa esta skill para generar componentes visuales, layouts y estilos. Es el experto en Tailwind CSS y experiencia de usuario."

# PARAMETROS
{
    "type": "object",
    "properties": {
        "tipo_componente": {"type":"string", "enum": ["panel", "portada", "formulario", "lista"]},
        "color_primario": {"type":"string"},
        "es_interactivo": {"type":"boolean"}
    },
    "required": ["tipo_componente"]
}

# CODIGO
// Logica para generar el diseño visual
export default async function ({tipo_componente, color_primario, es_interactivo}) {
    return `Diseñando interfaz tipo ${tipo_componente} con color predominante ${color_primario || '#2563eb'}. Interactividad: ${es_interactivo ? 'Activada':'Basica'}.`;
}