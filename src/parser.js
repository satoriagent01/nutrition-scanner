/**
 * Nutrition table parser that extracts structured data from OCR text.
 * Handles multiple languages (German, Dutch, French, Italian, English, Spanish).
 */

/**
 * Common nutrition field names in various languages.
 */
const FIELD_NAMES = {
  energy: ['energie', 'énergie', 'energi', 'energia', 'energy', 'calorías', 'calorias', 'calories'],
  fat: ['fett', 'matières grasses', 'vetten', 'grassi', 'grasa', 'grasas', 'fat', 'gras'],
  saturatedFat: ['gesättigte fettsäuren', 'acides gras saturés', 'verzadigde vetzuren', 'acidi grassi saturi', 'grasas saturadas', 'saturated fat', 'grasas saturadas'],
  carbohydrates: ['kohlenhydrate', 'glucides', 'koolhydraten', 'carboidrati', 'carbohidratos', 'carbohydrates', 'carbohidratos'],
  sugars: ['zucker', 'sucre', 'suikers', 'zuccheri', 'azúcar', 'azúcares', 'sugars', 'azucares'],
  fiber: ['ballaststoffe', 'fibres alimentaires', 'vezels', 'fibre', 'fibra', 'fiber', 'fibra'],
  protein: ['eiweiß', 'protéines', 'eiwitten', 'proteine', 'proteína', 'proteínas', 'protein', 'proteina'],
  salt: ['salz', 'sel', 'zout', 'sale', 'sal', 'salt', 'sal'],
};

/**
 * Parse nutrition table from OCR text.
 * @param {string} text - Cleaned OCR text
 * @returns {Object|null} Parsed nutrition data or null if no table found
 */
function parseNutritionTable(text) {
  const lines = text.split('\n');
  
  // Find the nutrition table section
  const tableStart = findTableStart(lines);
  if (tableStart === null) return null;
  
  // Extract table rows
  const rows = extractTableRows(lines, tableStart);
  if (rows.length < 3) return null;
  
  // Parse the header to determine columns
  const header = rows[0];
  const columnCount = header.length;
  
  // Parse rows into structured data
  const parsedRows = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length >= 2) {
      parsedRows.push({
        name: row[0].trim(),
        values: parseRowValues(row.slice(1)),
      });
    }
  }
  
  // Convert to a map by field name
  const result = {
    fields: {},
    columns: header.map(h => h.trim()),
  };
  
  for (const row of parsedRows) {
    const fieldName = findFieldName(row.name);
    if (fieldName && row.values.length > 0) {
      result.fields[fieldName] = {
        name: row.name,
        values: row.values,
      };
    }
  }
  
  return result;
}

/**
 * Find the start of the nutrition table in the lines.
 */
function findTableStart(lines) {
  const tableKeywords = [
    'nährwertdeklaration', 'déclaration nutritionnelle', 'voedingswaarde',
    'dichiarazione nutrizionale', 'nutritional information', 'información nutricional',
    'voedingswaarde', 'nutrition facts', 'nährwerte',
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    for (const keyword of tableKeywords) {
      if (line.includes(keyword)) {
        return i;
      }
    }
  }
  return null;
}

/**
 * Extract table rows from the lines starting at the given index.
 */
function extractTableRows(lines, startIndex) {
  const rows = [];
  let i = startIndex + 1;
  
  // Skip empty lines and header lines
  while (i < lines.length && (lines[i].trim() === '' || lines[i].includes('/'))) {
    i++;
  }
  
  // Extract rows until we hit a non-table line
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '' || line.includes('FSC') || line.includes('Schär') || 
        line.includes('Dr.') || line.includes('www.')) {
      break;
    }
    
    // Try to parse as a table row
    const row = parseTableRow(line);
    if (row && row.length > 0) {
      rows.push(row);
    }
    i++;
  }
  
  return rows;
}

/**
 * Parse a single table row into cells.
 */
function parseTableRow(line) {
  // Try pipe-separated format first
  if (line.includes('|')) {
    return line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
  }
  
  // Try to parse space-separated values with known patterns
  // Look for lines like "Energie 2292 kJ 549 kcal 688 kJ 165 kcal"
  const parts = line.split(/\s{2,}/);
  if (parts.length >= 2) {
    return parts;
  }
  
  // Try splitting by multiple spaces
  return line.split(/\s{2,}/).filter(p => p.trim() !== '');
}

/**
 * Parse values from a row (after the name).
 */
function parseRowValues(values) {
  return values.map(v => {
    // Extract numeric value and unit
    const match = v.match(/^([\d.,]+)\s*(.*)$/);
    if (match) {
      return {
        value: parseFloat(match[1].replace(',', '.')),
        unit: match[2].trim(),
      };
    }
    return { value: 0, unit: v };
  });
}

/**
 * Find the canonical field name from a label name.
 */
function findFieldName(label) {
  const lowerLabel = label.toLowerCase().trim();
  
  for (const [canonical, aliases] of Object.entries(FIELD_NAMES)) {
    for (const alias of aliases) {
      if (lowerLabel.includes(alias)) {
        return canonical;
      }
    }
  }
  return null;
}

module.exports = { parseNutritionTable };