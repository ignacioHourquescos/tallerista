# Filtros - Documentación

Este archivo contiene información sobre cómo gestionar los filtros y sus imágenes.

## Estructura de Datos

El archivo `filters.json` contiene un array de objetos con la siguiente estructura:

```json
{
  "code": "CH10759",
  "imageUrl": "https://example.com/filter-image.jpg",
  "description": "Filtro de aceite",
  "type": "oil"
}
```

### Campos

- **code** (obligatorio): Código único del filtro
- **imageUrl** (opcional): URL de la imagen del filtro
- **description** (opcional): Descripción del filtro
- **type** (opcional): Tipo de filtro: `oil`, `air`, `fuel`, `cabin`

## Comandos Disponibles

### Exportar JSON a Excel

```bash
npm run export:filters
```

Este comando genera el archivo `filters.xlsx` en la raíz del proyecto con todos los filtros del JSON.

### Importar Excel a JSON

```bash
npm run import:filters
```

Este comando lee el archivo `filters.xlsx` y actualiza `src/data/filters.json`.

**Nota:** Asegúrate de cerrar el archivo Excel antes de ejecutar el comando de importación.

## Columnas del Excel

El Excel debe tener las siguientes columnas (en cualquier orden):

- `code` o `Code` o `Código`
- `imageUrl` o `Image URL` o `URL de Imagen`
- `description` o `Description` o `Descripción`
- `type` o `Type` o `Tipo`

## Uso en la Aplicación

Los filtros se consumen automáticamente en las tarjetas de kits. Cuando un kit tiene códigos de filtros, el sistema busca automáticamente las imágenes correspondientes en `filters.json` y las muestra en un carrusel.

### Flujo de Trabajo Recomendado

1. Editar `filters.xlsx` con las URLs de las imágenes
2. Ejecutar `npm run import:filters` para actualizar el JSON
3. Las imágenes aparecerán automáticamente en el carrusel de las tarjetas

## Ventajas de esta Estructura

- **Centralización**: Cada filtro se define una sola vez
- **Reutilización**: El mismo código de filtro puede usarse en múltiples kits
- **Mantenimiento**: Actualizar una imagen de filtro se hace en un solo lugar
- **Consistencia**: Los mismos códigos siempre tienen la misma imagen

