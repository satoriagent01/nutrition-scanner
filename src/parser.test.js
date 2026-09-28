/**
 * Tests for the nutrition table parser
 * Tests parsing of OCR text into structured nutrition data
 */

const { parseNutritionTable } = require('../src/parser.js');

describe('Parser Module', () => {
  describe('parseNutritionTable', () => {
    test('should parse German nutrition table', () => {
      const ocrText = `Nährwertdeklaration
Pro 100 g
Energie	2292 kJ / 549 kcal
Fett	33 g
davon gesättigte Fettsäuren	13 g
Kohlenhydrate	55 g
davon Zucker	45 g
Ballaststoffe	2,4 g
Eiweiß	6,8 g
Salz	0,18 g`;

      const result = parseNutritionTable(ocrText);
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      
      // Check for key nutrients
      const nutrientNames = result.items.map(item => item.name);
      expect(nutrientNames).toContain('Energie');
      expect(nutrientNames).toContain('Fett');
      expect(nutrientNames).toContain('Kohlenhydrate');
      expect(nutrientNames).toContain('Zucker');
      expect(nutrientNames).toContain('Ballaststoffe');
      expect(nutrientNames).toContain('Eiweiß');
      expect(nutrientNames).toContain('Salz');
    });

    test('should parse Dutch nutrition table', () => {
      const ocrText = `Voedingswaarde per 100 ml
energie	199 kJ / 47 kcal
vetten, waarvan	0 g
- verzadigde vetzuren	0 g
- onverzadigde vetzuren	0 g
koolhydraten, waarvan	11 g
- suikers	10 g
- zoetstoffen	0 g
vezels	0,7 g
eiwitten	0,4 g
zout	0 g`;

      const result = parseNutritionTable(ocrText);
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      
      const nutrientNames = result.items.map(item => item.name);
      expect(nutrientNames).toContain('energie');
      expect(nutrientNames).toContain('vetten');
      expect(nutrientNames).toContain('koolhydraten');
      expect(nutrientNames).toContain('suikers');
      expect(nutrientNames).toContain('vezels');
      expect(nutrientNames).toContain('eiwitten');
      expect(nutrientNames).toContain('zout');
    });

    test('should parse French nutrition table', () => {
      const ocrText = `Valeur nutritionnelle pour 100 g
Énergie	2292 kJ / 549 kcal
Matières grasses	33 g
dont acides gras saturés	13 g
Glucides	55 g
dont sucres	45 g
Fibres alimentaires	2,4 g
Protéines	6,8 g
Sel	0,18 g`;

      const result = parseNutritionTable(ocrText);
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      
      const nutrientNames = result.items.map(item => item.name);
      expect(nutrientNames).toContain('Énergie');
      expect(nutrientNames).toContain('Matières grasses');
      expect(nutrientNames).toContain('Glucides');
      expect(nutrientNames).toContain('sucres');
      expect(nutrientNames).toContain('Fibres');
      expect(nutrientNames).toContain('Protéines');
      expect(nutrientNames).toContain('Sel');
    });

    test('should parse Italian nutrition table', () => {
      const ocrText = `Dichiarazione nutrizionale
Per 100 g
Energia	2292 kJ / 549 kcal
Grassi	33 g
di cui acidi grassi saturi	13 g
Carboidrati	55 g
di cui zuccheri	45 g
Fibre	2,4 g
Proteine	6,8 g
Sale	0,18 g`;

      const result = parseNutritionTable(ocrText);
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      
      const nutrientNames = result.items.map(item => item.name);
      expect(nutrientNames).toContain('Energia');
      expect(nutrientNames).toContain('Grassi');
      expect(nutrientNames).toContain('Carboidrati');
      expect(nutrientNames).toContain('zuccheri');
      expect(nutrientNames).toContain('Fibre');
      expect(nutrientNames).toContain('Proteine');
      expect(nutrientNames).toContain('Sale');
    });

    test('should handle empty input', () => {
      const result = parseNutritionTable('');
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(0);
    });

    test('should handle input with no nutrition data', () => {
      const ocrText = `This is just some random text
with no nutrition information
at all`;

      const result = parseNutritionTable(ocrText);
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(0);
    });

    test('should parse numeric values correctly', () => {
      const ocrText = `Nährwertdeklaration
Pro 100 g
Energie	2292 kJ / 549 kcal
Fett	33 g
davon gesättigte Fettsäuren	13 g
Kohlenhydrate	55 g
davon Zucker	45 g
Ballaststoffe	2,4 g
Eiweiß	6,8 g
Salz	0,18 g`;

      const result = parseNutritionTable(ocrText);
      
      // Find specific nutrients and verify their values
      const energyItem = result.items.find(item => item.name === 'Energie');
      expect(energyItem).toBeDefined();
      expect(energyItem.per100g).toBe('549');
      expect(energyItem.unit).toBe('kcal');
      
      const fatItem = result.items.find(item => item.name === 'Fett');
      expect(fatItem).toBeDefined();
      expect(fatItem.per100g).toBe('33');
      expect(fatItem.unit).toBe('g');
      
      const sugarItem = result.items.find(item => item.name === 'Zucker');
      expect(sugarItem).toBeDefined();
      expect(sugarItem.per100g).toBe('45');
      expect(sugarItem.unit).toBe('g');
      
      const fiberItem = result.items.find(item => item.name === 'Ballaststoffe');
      expect(fiberItem).toBeDefined();
      expect(fiberItem.per100g).toBe('2,4');
      expect(fiberItem.unit).toBe('g');
    });

    test('should handle serving size information', () => {
      const ocrText = `Nährwertdeklaration
Pro 100 g	Pro 30 g (1 Melto)
Energie	2292 kJ / 549 kcal	688 kJ / 165 kcal
Fett	33 g	10 g
Kohlenhydrate	55 g	16 g
davon Zucker	45 g	14 g
Ballaststoffe	2,4 g	0,7 g
Eiweiß	6,8 g	2,0 g
Salz	0,18 g	0,05 g`;

      const result = parseNutritionTable(ocrText);
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      
      // Check that serving size is captured
      expect(result.servingSize).toBeDefined();
      expect(result.servingSize.perServing).toBe('30 g');
      
      // Check that per-serving values are parsed
      const energyItem = result.items.find(item => item.name === 'Energie');
      expect(energyItem).toBeDefined();
      expect(energyItem.perServing).toBe('165');
    });
  });
});