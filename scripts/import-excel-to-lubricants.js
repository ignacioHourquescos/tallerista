const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta del archivo Excel (ahora puede ser el archivo único o el individual)
const excelPath = path.join(__dirname, '../data.xlsx');
const fallbackPath = path.join(__dirname, '../lubricants.xlsx');

// Verificar que el archivo existe
let filePath = excelPath;
if (!fs.existsSync(excelPath)) {
  if (fs.existsSync(fallbackPath)) {
    filePath = fallbackPath;
    console.log('⚠️  Usando archivo individual lubricants.xlsx');
  } else {
    console.error(`❌ Error: No se encontró el archivo ${excelPath} ni ${fallbackPath}`);
    process.exit(1);
  }
}

// Leer el archivo Excel
const wb = XLSX.readFile(filePath);

// Buscar la hoja "Lubricants", "Lubricantes", "oil", "Oil" o usar la primera hoja
let sheetName = 'Lubricants';
if (wb.SheetNames.includes('Lubricants')) {
  sheetName = 'Lubricants';
} else if (wb.SheetNames.includes('Lubricantes')) {
  sheetName = 'Lubricantes';
} else if (wb.SheetNames.includes('oil')) {
  sheetName = 'oil';
} else if (wb.SheetNames.includes('Oil')) {
  sheetName = 'Oil';
} else {
  // Buscar cualquier hoja que contenga "lubricant" o "oil"
  const foundSheet = wb.SheetNames.find((name) => {
    const nameLower = name.toLowerCase();
    return nameLower.includes('lubricant') || nameLower.includes('oil');
  });
  if (foundSheet) {
    sheetName = foundSheet;
    console.log(`⚠️  Hoja "Lubricants" no encontrada, usando: ${sheetName}`);
  } else {
    sheetName = wb.SheetNames[0];
    console.log(`⚠️  Hoja "Lubricants" no encontrada, usando: ${sheetName}`);
  }
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
  
  cleaned.code = row.code || row.Code || row.Código || '';
  cleaned.description = row.description || row.Description || row.Descripción || row.descirption || row.Descirption || '';
  cleaned.graduation = row.graduation || row.Graduation || row.graduatio || row.Graduatio || row.Graduación || '';
  cleaned.presentation = row.presentation || row.Presentation || row.Presentación || '';
  cleaned.type = row.type || row.Type || row.Tipo || '';
  cleaned.norm = row.norm || row.Norm || row.Norma || '';
  cleaned.imageUrl = row.imageUrl || row['Image URL'] || row['URL de Imagen'] || row.imageurl || '';
  
  // Eliminar campos vacíos opcionales para mantener el JSON limpio
  if (!cleaned.graduation) delete cleaned.graduation;
  if (!cleaned.presentation) delete cleaned.presentation;
  if (!cleaned.type) delete cleaned.type;
  if (!cleaned.norm) delete cleaned.norm;
  if (!cleaned.imageUrl) delete cleaned.imageUrl;
  
  return cleaned;
});

// Ruta del archivo JSON de destino
const jsonPath = path.join(__dirname, '../src/data/lubricants.json');

// Guardar el JSON con formato legible
fs.writeFileSync(jsonPath, JSON.stringify(cleanedData, null, 2), 'utf8');

console.log(`✅ Archivo JSON actualizado exitosamente en: ${jsonPath}`);
console.log(`📊 Total de registros importados: ${jsonData.length}`);
console.log(`📋 Hoja procesada: ${sheetName}`);

