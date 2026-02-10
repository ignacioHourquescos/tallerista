# Scripts de Exportación/Importación de Filter Kits

Este directorio contiene scripts para exportar e importar datos de filter kits entre formato JSON y Excel.

## 📋 Scripts Disponibles

### 1. Exportar JSON a Excel

Convierte el archivo `src/data/filter-kits.json` a un archivo Excel (`filter-kits.xlsx`) en la raíz del proyecto.

**Uso:**
```bash
npm run export:filter-kits
```

**Resultado:**
- Crea/sobrescribe el archivo `filter-kits.xlsx` en la raíz del proyecto
- El archivo Excel contiene todos los registros del JSON con sus columnas correspondientes

### 2. Importar Excel a JSON

Convierte el archivo Excel (`filter-kits.xlsx`) de vuelta a JSON, actualizando `src/data/filter-kits.json`.

**Uso:**
```bash
npm run import:filter-kits
```

**Requisitos:**
- El archivo `filter-kits.xlsx` debe existir en la raíz del proyecto
- El archivo debe tener al menos una hoja con los datos

**Resultado:**
- Actualiza el archivo `src/data/filter-kits.json` con los datos del Excel
- Mantiene el formato JSON legible (con indentación)

## 🔄 Flujo de Trabajo Recomendado

1. **Exportar a Excel:**
   ```bash
   npm run export:filter-kits
   ```

2. **Editar el archivo Excel:**
   - Abre `filter-kits.xlsx` con Excel, Google Sheets, o cualquier editor de hojas de cálculo
   - Realiza tus modificaciones, agregar nuevos registros, etc.
   - Guarda el archivo

3. **Importar de vuelta a JSON:**
   ```bash
   npm run import:filter-kits
   ```

## ⚠️ Notas Importantes

- **Backup:** Se recomienda hacer un backup del archivo JSON antes de importar desde Excel
- **Estructura:** Asegúrate de mantener la estructura de columnas en el Excel (id, vehicleName, description, etc.)
- **Ubicación:** El archivo Excel debe estar en la raíz del proyecto (`filter-kits.xlsx`)
- **Formato:** Los datos se importan tal como están en el Excel, asegúrate de mantener los tipos de datos correctos

## 📊 Columnas Esperadas

El archivo Excel debe contener las siguientes columnas:
- `id`
- `vehicleName`
- `description`
- `imageUrl`
- `oilFilterCode`
- `airFilterCode`
- `fuelFilterCode` (opcional)
- `cabinFilterCode` (opcional) - Filtro de habitáculo/cabina
- `vehicleBrand`
- `vehicleModel`
- `vehicleYear`

