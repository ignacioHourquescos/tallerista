const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta del archivo Excel (archivo único o individuales)
const excelPath = path.join(__dirname, '../data.xlsx');
const filterKitsFallback = path.join(__dirname, '../filter-kits.xlsx');
const filtersFallback = path.join(__dirname, '../filters.xlsx');
const lubricantsFallback = path.join(__dirname, '../lubricants.xlsx');

console.log('🔄 Importando desde Excel...\n');

// ============================================
// IMPORTAR FILTER KITS
// ============================================
let filterKitsPath = excelPath;
let filterKitsFile = excelPath;

if (!fs.existsSync(excelPath)) {
  if (fs.existsSync(filterKitsFallback)) {
    filterKitsFile = filterKitsFallback;
    console.log('⚠️  Usando archivo individual filter-kits.xlsx');
  } else {
    console.error(`❌ Error: No se encontró el archivo ${excelPath} ni ${filterKitsFallback}`);
    process.exit(1);
  }
}

const wbFilterKits = XLSX.readFile(filterKitsFile);
let filterKitsSheetName = 'Filter Kits';
if (!wbFilterKits.SheetNames.includes(filterKitsSheetName)) {
  filterKitsSheetName = wbFilterKits.SheetNames[0];
  console.log(`⚠️  Hoja "Filter Kits" no encontrada, usando: ${filterKitsSheetName}`);
}

const filterKitsWs = wbFilterKits.Sheets[filterKitsSheetName];
const filterKitsJsonData = XLSX.utils.sheet_to_json(filterKitsWs);

const cleanedFilterKits = filterKitsJsonData.map((row) => {
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
  cleaned.cabinFilterCode = row.cabinFilter || row.cabinFilterCode || row['Cabin Filter Code'] || row['Código Filtro Cabina'] || row['Habitáculo'] || row.__EMPTY || '';
  cleaned.vehicleBrand = row.vehicleBrand || row['Vehicle Brand'] || row['Marca del Vehículo'] || '';
  cleaned.vehicleModel = row.vehicleModel || row['Vehicle Model'] || row['Modelo del Vehículo'] || '';
  cleaned.vehicleYear = row.vehicleYear || row['Vehicle Year'] || row['Año del Vehículo'] || '';
  cleaned.type = row.type || row.Type || row['Tipo'] || row['Tipo de Auto'] || '';
  
  if (!cleaned.fuelFilterCode) delete cleaned.fuelFilterCode;
  if (!cleaned.cabinFilterCode) delete cleaned.cabinFilterCode;
  if (!cleaned.vehicleBrand) delete cleaned.vehicleBrand;
  if (!cleaned.vehicleModel) delete cleaned.vehicleModel;
  if (!cleaned.vehicleYear) delete cleaned.vehicleYear;
  if (!cleaned.type) delete cleaned.type;
  
  return cleaned;
});

const filterKitsJsonPath = path.join(__dirname, '../src/data/filter-kits.json');
fs.writeFileSync(filterKitsJsonPath, JSON.stringify(cleanedFilterKits, null, 2), 'utf8');

console.log(`✅ Filter Kits JSON actualizado: ${filterKitsJsonPath}`);
console.log(`📊 Total de registros: ${filterKitsJsonData.length}`);

// ============================================
// IMPORTAR FILTERS
// ============================================
let filtersFile = excelPath;

if (!fs.existsSync(excelPath)) {
  if (fs.existsSync(filtersFallback)) {
    filtersFile = filtersFallback;
    console.log('⚠️  Usando archivo individual filters.xlsx');
  } else {
    console.error(`❌ Error: No se encontró el archivo ${excelPath} ni ${filtersFallback}`);
    process.exit(1);
  }
}

const wbFilters = XLSX.readFile(filtersFile);
let filtersSheetName = 'Filters';
if (!wbFilters.SheetNames.includes(filtersSheetName)) {
  filtersSheetName = wbFilters.SheetNames[0];
  console.log(`⚠️  Hoja "Filters" no encontrada, usando: ${filtersSheetName}`);
}

const filtersWs = wbFilters.Sheets[filtersSheetName];
const filtersJsonData = XLSX.utils.sheet_to_json(filtersWs);

const cleanedFilters = filtersJsonData.map((row) => {
  const cleaned = {};
  
  cleaned.code = row.code || row.Code || row.Código || '';
  cleaned.imageUrl = row.imageUrl || row['Image URL'] || row['URL de Imagen'] || row.imageurl || '';
  cleaned.description = row.description || row.Description || row.Descripción || '';
  
  // Validar que type sea uno de los valores permitidos
  const typeValue = (row.type || row.Type || row.Tipo || '').toLowerCase();
  const validTypes = ['oil', 'air', 'fuel', 'cabin'];
  if (validTypes.includes(typeValue)) {
    cleaned.type = typeValue;
  }
  
  if (!cleaned.imageUrl) delete cleaned.imageUrl;
  if (!cleaned.description) delete cleaned.description;
  if (!cleaned.type) delete cleaned.type;
  
  return cleaned;
});

const filtersJsonPath = path.join(__dirname, '../src/data/filters.json');
fs.writeFileSync(filtersJsonPath, JSON.stringify(cleanedFilters, null, 2), 'utf8');

console.log(`✅ Filters JSON actualizado: ${filtersJsonPath}`);
console.log(`📊 Total de registros: ${filtersJsonData.length}`);

// ============================================
// IMPORTAR LUBRICANTS
// ============================================
let lubricantsFile = null;
let hasLubricantsSheet = false;

// Primero intentar en data.xlsx si existe
if (fs.existsSync(excelPath)) {
  const wbCheck = XLSX.readFile(excelPath);
  const hasLubricants = wbCheck.SheetNames.some((name) => {
    const nameLower = name.toLowerCase();
    return name === 'Lubricants' || 
           name === 'Lubricantes' || 
           name === 'oil' ||
           name === 'Oil' ||
           nameLower.includes('lubricant') ||
           nameLower.includes('oil');
  });
  if (hasLubricants) {
    lubricantsFile = excelPath;
    hasLubricantsSheet = true;
  }
}

// Si no se encontró en data.xlsx, intentar archivo individual
if (!hasLubricantsSheet && fs.existsSync(lubricantsFallback)) {
  lubricantsFile = lubricantsFallback;
  console.log('⚠️  Usando archivo individual lubricants.xlsx');
}

if (lubricantsFile && fs.existsSync(lubricantsFile)) {
  const wbLubricants = XLSX.readFile(lubricantsFile);
  let lubricantsSheetName = 'Lubricants';
  
  // Buscar la hoja de lubricantes con diferentes nombres posibles
  if (wbLubricants.SheetNames.includes('Lubricants')) {
    lubricantsSheetName = 'Lubricants';
  } else if (wbLubricants.SheetNames.includes('Lubricantes')) {
    lubricantsSheetName = 'Lubricantes';
  } else if (wbLubricants.SheetNames.includes('oil')) {
    lubricantsSheetName = 'oil';
  } else if (wbLubricants.SheetNames.includes('Oil')) {
    lubricantsSheetName = 'Oil';
  } else {
    const foundSheet = wbLubricants.SheetNames.find((name) => {
      const nameLower = name.toLowerCase();
      return nameLower.includes('lubricant') || nameLower.includes('oil');
    });
    if (foundSheet) {
      lubricantsSheetName = foundSheet;
      console.log(`⚠️  Hoja "Lubricants" no encontrada, usando: ${lubricantsSheetName}`);
    } else {
      console.log(`⚠️  No se encontró hoja de lubricantes en ${lubricantsFile}, omitiendo...`);
      lubricantsFile = null;
    }
  }

  if (lubricantsFile) {
    const lubricantsWs = wbLubricants.Sheets[lubricantsSheetName];
    const lubricantsJsonData = XLSX.utils.sheet_to_json(lubricantsWs);

    const cleanedLubricants = lubricantsJsonData.map((row) => {
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

    const lubricantsJsonPath = path.join(__dirname, '../src/data/lubricants.json');
    fs.writeFileSync(lubricantsJsonPath, JSON.stringify(cleanedLubricants, null, 2), 'utf8');

    console.log(`✅ Lubricants JSON actualizado: ${lubricantsJsonPath}`);
    console.log(`📊 Total de registros: ${lubricantsJsonData.length}`);
  }
} else {
  console.log('⚠️  Archivo de lubricantes no encontrado, omitiendo...');
}

console.log('\n🎉 ¡Importación completa exitosa!');

