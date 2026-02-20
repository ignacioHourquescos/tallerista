const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta del archivo Excel (ahora puede ser el archivo único o el individual)
const excelPath = path.join(__dirname, '../data.xlsx');
const fallbackPath = path.join(__dirname, '../filter-kits.xlsx');

// Verificar que el archivo existe
let filePath = excelPath;
if (!fs.existsSync(excelPath)) {
  if (fs.existsSync(fallbackPath)) {
    filePath = fallbackPath;
    console.log('⚠️  Usando archivo individual filter-kits.xlsx');
  } else {
    console.error(`❌ Error: No se encontró el archivo ${excelPath} ni ${fallbackPath}`);
    process.exit(1);
  }
}

// Leer el archivo Excel
const wb = XLSX.readFile(filePath);

// Buscar la hoja "Filter Kits" o usar la primera hoja
let sheetName = 'Filter Kits';
if (!wb.SheetNames.includes(sheetName)) {
  sheetName = wb.SheetNames[0];
  console.log(`⚠️  Hoja "Filter Kits" no encontrada, usando: ${sheetName}`);
}

const ws = wb.Sheets[sheetName];

// Convertir la hoja a JSON
const jsonData = XLSX.utils.sheet_to_json(ws);

// Debug: mostrar las claves de la primera fila para ver qué columnas tiene el Excel
if (jsonData.length > 0) {
  console.log('🔍 Columnas encontradas en el Excel:', Object.keys(jsonData[0]));
  console.log('📋 Primera fila completa:', JSON.stringify(jsonData[0], null, 2));
}

// Limpiar y normalizar los datos
const cleanedData = jsonData.map((row) => {
  const cleaned = {};
  
  // Convertir id a string (TypeScript espera string, no number)
  const idValue = row.id || row.ID || '';
  cleaned.id = String(idValue);
  
  cleaned.vehicleName = row.vehicleName || row['Vehicle Name'] || row['Nombre del Vehículo'] || '';
  cleaned.description = row.description || row.Description || row.Descripción || '';
  cleaned.imageUrl = row.imageUrl || row['Image URL'] || row['URL de Imagen'] || '/placeholder.jpg';
  cleaned.oilFilterCode = row.oilFilterCode || row['Oil Filter Code'] || row['Código Filtro Aceite'] || '';
  cleaned.airFilterCode = row.airFilterCode || row['Air Filter Code'] || row['Código Filtro Aire'] || '';
  cleaned.fuelFilterCode = row.fuelFilterCode || row['Fuel Filter Code'] || row['Código Filtro Combustible'] || '';
  
  // Mapear cabinFilterCode (puede venir como cabinFilter, __EMPTY, cabinFilterCode, o Habitáculo)
  cleaned.cabinFilterCode = row.cabinFilter || row.cabinFilterCode || row['Cabin Filter Code'] || row['Código Filtro Cabina'] || row['Habitáculo'] || row.__EMPTY || '';
  
  cleaned.vehicleBrand = row.vehicleBrand || row['Vehicle Brand'] || row['Marca del Vehículo'] || '';
  cleaned.vehicleModel = row.vehicleModel || row['Vehicle Model'] || row['Modelo del Vehículo'] || '';
  cleaned.vehicleYear = row.vehicleYear || row['Vehicle Year'] || row['Año del Vehículo'] || '';
  
  // Eliminar campos vacíos opcionales para mantener el JSON limpio
  if (!cleaned.fuelFilterCode) delete cleaned.fuelFilterCode;
  if (!cleaned.cabinFilterCode) delete cleaned.cabinFilterCode;
  if (!cleaned.vehicleBrand) delete cleaned.vehicleBrand;
  if (!cleaned.vehicleModel) delete cleaned.vehicleModel;
  if (!cleaned.vehicleYear) delete cleaned.vehicleYear;
  
  return cleaned;
});

// Ruta del archivo JSON de destino
const jsonPath = path.join(__dirname, '../src/data/filter-kits.json');

// Guardar el JSON con formato legible
fs.writeFileSync(jsonPath, JSON.stringify(cleanedData, null, 2), 'utf8');

console.log(`✅ Archivo JSON actualizado exitosamente en: ${jsonPath}`);
console.log(`📊 Total de registros importados: ${jsonData.length}`);
console.log(`📋 Hoja procesada: ${sheetName}`);

