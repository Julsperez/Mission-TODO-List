# DESCRIPCION
"Diseña la experiencia de usuario y los estilos visuales. Asegura el cumplimiento de Mobile-First y la consistencia con el diseño existente (bordes rounded-xl/2xl, paletas coherentes)."

# PARAMETROS
{
    "type": "object",
    "properties": {
        "elemento": {"type": "string"},
        "contexto_estilo": {"type": "string", "description": "Estilos actuales detectados en el proyecto."}
    },
    "required": ["elemento"]
}

# CODIGO
export default async function ({ elemento, contexto_estilo }) {
    return `Diseño UX para ${elemento}: Priorizando Mobile-First. \nEstética: Limpia, bordes redondeados según regla 3.2. \nEvitando fricción cognitiva mediante jerarquía visual clara.`;
}