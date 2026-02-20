const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Leer el archivo JSON
const jsonPath = path.join(__dirname, '../src/data/lubricants.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Normalizar datos: asegurar que los IDs sean strings (aunque Excel puede convertirlos a números)
const normalizedData = jsonData.map((lubricant) => ({
  ...lubricant,
  id: String(lubricant.id || '')
}));

// Crear un nuevo libro de trabajo
const wb = XLSX.utils.book_new();

// Convertir JSON a hoja de cálculo
const ws = XLSX.utils.json_to_sheet(normalizedData);

// Agregar la hoja al libro (usar "oil" para coincidir con el Excel del usuario)
XLSX.utils.book_append_sheet(wb, ws, 'oil');

// Guardar el archivo Excel
const excelPath = path.join(__dirname, '../lubricants.xlsx');
XLSX.writeFile(wb, excelPath);

console.log(`✅ Archivo Excel exportado exitosamente a: ${excelPath}`);
console.log(`📊 Total de registros: ${jsonData.length}`);

