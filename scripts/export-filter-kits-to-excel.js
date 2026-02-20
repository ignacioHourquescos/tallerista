const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Leer el archivo JSON
const jsonPath = path.join(__dirname, '../src/data/filter-kits.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Normalizar datos: asegurar que los IDs sean strings (aunque Excel puede convertirlos a números)
const normalizedData = jsonData.map((kit) => ({
  ...kit,
  id: String(kit.id || '')
}));

// Crear un nuevo libro de trabajo
const wb = XLSX.utils.book_new();

// Convertir JSON a hoja de cálculo
const ws = XLSX.utils.json_to_sheet(normalizedData);

// Agregar la hoja al libro
XLSX.utils.book_append_sheet(wb, ws, 'Filter Kits');

// Guardar el archivo Excel
const excelPath = path.join(__dirname, '../filter-kits.xlsx');
XLSX.writeFile(wb, excelPath);

console.log(`✅ Archivo Excel exportado exitosamente a: ${excelPath}`);
console.log(`📊 Total de registros: ${jsonData.length}`);

