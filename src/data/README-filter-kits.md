# Kits de Filtros

Este directorio contiene los datos de los kits de filtros hardcodeados.

## Estructura de un Kit

Cada kit de filtros contiene:
- **id**: Identificador único del kit
- **vehicleName**: Nombre del vehículo
- **description**: Descripción del kit
- **imageUrl**: URL de la imagen del kit
- **oilFilterCode**: Código del filtro de aceite (obligatorio)
- **airFilterCode**: Código del filtro de aire (obligatorio)
- **fuelFilterCode**: Código del filtro de combustible (opcional)
- **cabinFilterCode**: Código del filtro de cabina (opcional)
- **vehicleBrand**: Marca del vehículo (opcional)
- **vehicleModel**: Modelo del vehículo (opcional)
- **vehicleYear**: Año del vehículo (opcional)
- **type**: Tipo de vehículo (opcional) - ej: "auto", "camioneta"

## Uso

```typescript
import { 
  getFilterKits, 
  enrichAllFilterKitsWithPrices 
} from '@/application/services/filter-kits';
import { getArticlesByListCode } from '@/application/services/articles';

// Obtener todos los kits
const kits = getFilterKits();

// Obtener artículos del endpoint
const availableArticles = await getArticlesByListCode('2');

// Cruzar kits con precios del endpoint
const kitsWithPrices = enrichAllFilterKitsWithPrices(availableArticles);
```

## Agregar nuevos kits

Simplemente agrega un nuevo objeto al array en `filter-kits.json` siguiendo la estructura definida.

