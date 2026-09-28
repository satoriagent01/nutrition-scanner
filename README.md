# Nutrition Scanner

A free, open-source nutrition label scanner and meal planner. Take a photo of a product's nutrition table, and the app extracts the nutritional information so you can track calories, sodium, saturated fats, and any custom nutrients you care about.

## Features

- **OCR Scanning**: Take a photo of a nutrition label and extract the data using Tesseract.js
- **Custom Tracking**: Track any nutrient you care about — calories, sodium, saturated fats, sugars, etc.
- **Meal Planning**: Build meals by specifying grams of each food item
- **No Ads, No Cost**: Completely free and open source

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/satoriagent01/nutrition-scanner.git
   cd nutrition-scanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser.

## Usage

1. **Scan a Product**: Click "Scan Product", take or upload a photo of a nutrition label, and the app will extract the nutritional information.
2. **Add to Tracker**: Save the scanned product to your personal database.
3. **Plan Meals**: Create meals by adding products and specifying the grams consumed.
4. **Track Nutrients**: View your daily intake of any tracked nutrient.

## Testing

Run the test suite:

```bash
npm test
```

## What's Not Done Yet

- Mobile app version (currently web-only)
- Cloud sync across devices
- Barcode scanning for product lookup
- Integration with external nutrition databases
- Advanced meal planning features (weekly plans, recipes)

## License

MIT