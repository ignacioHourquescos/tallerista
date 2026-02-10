const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON de origen
const jsonPath = path.join(__dirname, '../src/data/filters.json');

// Verificar que el archivo existe
if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Error: No se encontró el archivo ${jsonPath}`);
  console.log('💡 Asegúrate de que el archivo filters.json existe en src/data/');
  process.exit(1);
}

// Leer el archivo JSON
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Crear un nuevo libro de trabajo
const wb = XLSX.utils.book_new();

// Convertir JSON a hoja de cálculo
const ws = XLSX.utils.json_to_sheet(jsonData);

// Agregar la hoja al libro
XLSX.utils.book_append_sheet(wb, ws, 'Filters');

// Ruta del archivo Excel de destino
const excelPath = path.join(__dirname, '../filters.xlsx');

// Escribir el archivo Excel
XLSX.writeFile(wb, excelPath);

console.log(`✅ Archivo Excel creado exitosamente en: ${excelPath}`);
console.log(`📊 Total de registros exportados: ${jsonData.length}`);
console.log(`📋 Columnas: code, imageUrl, description, type`);

