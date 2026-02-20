const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta del archivo Excel (ahora puede ser el archivo único o el individual)
const excelPath = path.join(__dirname, '../data.xlsx');
const fallbackPath = path.join(__dirname, '../filters.xlsx');

// Verificar que el archivo existe
let filePath = excelPath;
if (!fs.existsSync(excelPath)) {
  if (fs.existsSync(fallbackPath)) {
    filePath = fallbackPath;
    console.log('⚠️  Usando archivo individual filters.xlsx');
  } else {
    console.error(`❌ Error: No se encontró el archivo ${excelPath} ni ${fallbackPath}`);
    process.exit(1);
  }
}

// Leer el archivo Excel
const wb = XLSX.readFile(filePath);

// Buscar la hoja "Filters" o usar la primera hoja
let sheetName = 'Filters';
if (!wb.SheetNames.includes(sheetName)) {
  sheetName = wb.SheetNames[0];
  console.log(`⚠️  Hoja "Filters" no encontrada, usando: ${sheetName}`);
}

const ws = wb.Sheets[sheetName];

// Convertir la hoja a JSON
const jsonData = XLSX.utils.sheet_to_json(ws);

// Limpiar y normalizar los datos
const cleanedData = jsonData.map((row) => {
  const cleaned = {};
  
  // Mapear campos conocidos
  cleaned.code = row.code || row.Code || row.Código || '';
  cleaned.imageUrl = row.imageUrl || row['Image URL'] || row['URL de Imagen'] || row.imageurl || '';
  cleaned.description = row.description || row.Description || row.Descripción || '';
  
  // Validar que type sea uno de los valores permitidos
  const typeValue = (row.type || row.Type || row.Tipo || '').toLowerCase();
  const validTypes = ['oil', 'air', 'fuel', 'cabin'];
  if (validTypes.includes(typeValue)) {
    cleaned.type = typeValue;
  }
  
  // Eliminar campos vacíos opcionales para mantener el JSON limpio
  if (!cleaned.imageUrl) delete cleaned.imageUrl;
  if (!cleaned.description) delete cleaned.description;
  if (!cleaned.type) delete cleaned.type;
  
  return cleaned;
});

// Ruta del archivo JSON de destino
const jsonPath = path.join(__dirname, '../src/data/filters.json');

// Guardar el JSON con formato legible
fs.writeFileSync(jsonPath, JSON.stringify(cleanedData, null, 2), 'utf8');

console.log(`✅ Archivo JSON actualizado exitosamente en: ${jsonPath}`);
console.log(`📊 Total de registros importados: ${jsonData.length}`);
console.log(`📋 Hoja procesada: ${sheetName}`);

