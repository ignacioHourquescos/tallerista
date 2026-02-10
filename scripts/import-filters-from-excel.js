const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta del archivo Excel (por defecto en la raíz del proyecto)
const excelPath = path.join(__dirname, '../filters.xlsx');

// Verificar que el archivo existe
if (!fs.existsSync(excelPath)) {
  console.error(`❌ Error: No se encontró el archivo ${excelPath}`);
  console.log('💡 Asegúrate de que el archivo filters.xlsx existe en la raíz del proyecto');
  process.exit(1);
}

// Leer el archivo Excel
const wb = XLSX.readFile(excelPath);

// Obtener la primera hoja
const sheetName = wb.SheetNames[0];
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
  cleaned.type = row.type || row.Type || row.Tipo || '';
  
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

