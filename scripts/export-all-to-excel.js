const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Leer los archivos JSON
const filterKitsPath = path.join(__dirname, '../src/data/filter-kits.json');
const filtersPath = path.join(__dirname, '../src/data/filters.json');
const lubricantsPath = path.join(__dirname, '../src/data/lubricants.json');

// Verificar que los archivos existen
if (!fs.existsSync(filterKitsPath)) {
  console.error(`❌ Error: No se encontró el archivo ${filterKitsPath}`);
  process.exit(1);
}

if (!fs.existsSync(filtersPath)) {
  console.error(`❌ Error: No se encontró el archivo ${filtersPath}`);
  process.exit(1);
}

// Leer los datos JSON
const filterKitsData = JSON.parse(fs.readFileSync(filterKitsPath, 'utf8'));
const filtersData = JSON.parse(fs.readFileSync(filtersPath, 'utf8'));

// Leer lubricantes si existe (opcional)
let lubricantsData = [];
if (fs.existsSync(lubricantsPath)) {
  lubricantsData = JSON.parse(fs.readFileSync(lubricantsPath, 'utf8'));
}

// Normalizar datos: asegurar que los IDs sean strings (aunque Excel puede convertirlos a números)
const normalizedFilterKits = filterKitsData.map((kit) => ({
  ...kit,
  id: String(kit.id || '')
}));

const normalizedLubricants = lubricantsData.map((lubricant) => ({
  ...lubricant,
  id: String(lubricant.id || '')
}));

// Crear un nuevo libro de trabajo
const wb = XLSX.utils.book_new();

// Convertir JSON a hojas de cálculo
const filterKitsWs = XLSX.utils.json_to_sheet(normalizedFilterKits);
const filtersWs = XLSX.utils.json_to_sheet(filtersData);

// Agregar hojas al libro
XLSX.utils.book_append_sheet(wb, filterKitsWs, 'Filter Kits');
XLSX.utils.book_append_sheet(wb, filtersWs, 'Filters');

// Agregar hoja de lubricantes si hay datos
if (normalizedLubricants.length > 0) {
  const lubricantsWs = XLSX.utils.json_to_sheet(normalizedLubricants);
  // Usar "oil" como nombre de hoja para coincidir con el Excel del usuario
  XLSX.utils.book_append_sheet(wb, lubricantsWs, 'oil');
}

// Guardar el archivo Excel único
const excelPath = path.join(__dirname, '../data.xlsx');
XLSX.writeFile(wb, excelPath);

console.log(`✅ Archivo Excel exportado exitosamente a: ${excelPath}`);
console.log(`📊 Filter Kits: ${filterKitsData.length} registros`);
console.log(`📊 Filters: ${filtersData.length} registros`);
if (normalizedLubricants.length > 0) {
  console.log(`📊 Lubricants: ${normalizedLubricants.length} registros`);
}
console.log(`📋 Hojas: Filter Kits, Filters${normalizedLubricants.length > 0 ? ', oil' : ''}`);

