# Nutrition Scanner - Project Plan

## Requirements

Build a free, open-source nutrition label scanner and meal planner that:

1. **Scans nutrition labels** from photos taken in supermarkets
2. **Extracts nutritional information** using OCR (Tesseract.js)
3. **Parses nutrition tables** from various languages (Dutch, German, French, Italian, English, Spanish)
4. **Tracks custom nutrients** - not just calories, but sodium, saturated fats, sugars, etc.
5. **Plans meals** by specifying grams of each food item
6. **Is free and ad-free** for users who want to care about their diet

## Shared Images Analysis

The provided images show nutrition labels from European products:

### Image 1 (Chocolate bar - German/Dutch/French/Italian)
- Multi-language nutrition table
- Columns: per 100g and per serving (30g = 1 Melto)
- Nutrients: Energie, Fett, davon gesättigte Fettsäuren, Kohlenhydrate, davon Zucker, Ballaststoffe, Eiweiß, Salz
- Values in kJ/kcal for energy, grams for others

### Image 2 (Apple-orange-mango juice - Dutch)
- Single column: per 100ml and per glass (200ml)
- Nutrients: energie, vetten, waarvan verzadigde vetzuren, koolhydraten, waarvan suikers, waarvan zoetstoffen, eiwitten, zout
- Also shows vitamin C percentage
- Additional info: ingredients, allergen info, storage instructions

### Image 3 (Olive oil spray - Dutch)
- Single column: per 100ml
- Nutrients: energie, waarvan verzadigde vetzuren, koolhydraten, waarvan suikers, vezels, eiwitten, zout
- Also shows vitamin E percentage
- Hazard symbols and safety warnings

## Architecture

### Tech Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **OCR**: Tesseract.js (client-side, no API keys needed)
- **Storage**: LocalStorage (no backend required)
- **Testing**: Node.js built-in test runner

### Modules

1. **ocr.js**: Wraps Tesseract.js to extract text from images
2. **parser.js**: Parses OCR text into structured nutrition data
3. **meal-planner.js**: Manages meals and nutrient tracking
4. **storage.js**: Persists products and meals to LocalStorage
5. **app.js**: Main application logic
6. **public/**: Static files (HTML, CSS, JS)

## Parser Strategy

The parser needs to handle:
- Multi-language labels (Dutch, German, French, Italian, English, Spanish)
- Different table formats (per 100g, per serving, per portion)
- Various nutrient names (Energie/energie/énergie, Fett/matieres grasses, etc.)
- Both kJ and kcal values
- Percentage values (vitamins, etc.)

## Decisions

1. **No backend**: Everything runs client-side for privacy and simplicity
2. **Tesseract.js**: No API keys required, works offline
3. **LocalStorage**: Simple persistence, no server needed
4. **Vanilla JS**: No framework dependencies, easy to understand

## What Comes Next

- Mobile app version (React Native or PWA)
- Cloud sync across devices
- Barcode scanning integration
- Integration with OpenFoodFacts API
- Recipe management
- Weekly meal planning