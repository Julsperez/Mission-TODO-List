# DESCRIPCION
"Usa esta skill para definir modelos de datos, esquemas de bases de datos y logica de negocio. Es el experto en la estructura interna, no en lo visual."

# PARAMETROS
{
    "type": "object",
    "properties": {
        "nombre_modelo": {"type":"string"},
        "campos": {"type":"array", "items": {"type":"string"}},
        "relaciones": {"type":"string"}
    },
    "required": ["nombre_modelo", "campos"]
}

# CODIGO
// Logica para estructurar el esquema de datos
export default async function ({nombre_modelo, campos, relaciones}) {
    const esquema = {
        id: nombre_modelo.toLowerCase(),
        version: "1.0.0",
        estructura: campos,
        vinculos: relaciones || "ninguna"
    }
    return `Modelo de datos '${nombre_modelo}' creado con campos: ${campos.join(', ')}`;
}