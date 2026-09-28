/**
 * Main application entry point wiring everything together.
 * Provides a unified API for the frontend to interact with
 * OCR, parsing, meal planning, and storage.
 */

const { extractTextFromImage } = require('./ocr');
const { parseNutritionTable } = require('./parser');
const {
  createMeal,
  addFoodToMeal,
  removeFoodFromMeal,
  calculateMealTotals,
  createProduct,
  getMealFoodsWithNutrition,
} = require('./meal-planner');
const {
  getProducts,
  saveProduct,
  deleteProduct,
  getMeals,
  saveMeal,
  deleteMeal,
  getMealsByDate,
  clearAll,
} = require('./storage');

/**
 * Scan an image and extract nutrition data.
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<Object>} Parsed nutrition data
 */
async function scanImage(imageData) {
  const text = await extractTextFromImage(imageData);
  const nutritionData = parseNutritionTable(text);
  return nutritionData;
}

/**
 * Save a scanned product.
 * @param {string} name - Product name
 * @param {Object} nutrition - Nutrition data
 * @returns {Object} Saved product
 */
function saveScannedProduct(name, nutrition) {
  const product = createProduct(name, nutrition);
  return saveProduct(product);
}

/**
 * Get all saved products.
 * @returns {Array} Array of products
 */
function getAllProducts() {
  return getProducts();
}

/**
 * Delete a product.
 * @param {string} productId - Product ID
 * @returns {boolean} Whether deleted
 */
function removeProduct(productId) {
  return deleteProduct(productId);
}

/**
 * Create a new meal.
 * @param {string} name - Meal name
 * @param {Date} date - Meal date
 * @returns {Object} Created meal
 */
function createNewMeal(name, date) {
  const meal = createMeal(name, date);
  return saveMeal(meal);
}

/**
 * Add food to a meal.
 * @param {string} mealId - Meal ID
 * @param {Object} food - Food item
 * @returns {Object} Updated meal
 */
function addFood(mealId, food) {
  const meals = getMeals();
  const meal = meals.find(m => m.id === mealId);
  if (!meal) {
    throw new Error('Meal not found');
  }
  
  addFoodToMeal(meal, food);
  return saveMeal(meal);
}

/**
 * Remove food from a meal.
 * @param {string} mealId - Meal ID
 * @param {string} foodId - Food ID
 * @returns {Object} Updated meal
 */
function removeFood(mealId, foodId) {
  const meals = getMeals();
  const meal = meals.find(m => m.id === mealId);
  if (!meal) {
    throw new Error('Meal not found');
  }
  
  removeFoodFromMeal(meal, foodId);
  return saveMeal(meal);
}

/**
 * Get all meals.
 * @returns {Array} Array of meals
 */
function getAllMeals() {
  return getMeals();
}

/**
 * Get meals for a specific date.
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {Array} Array of meals
 */
function getMealsForDate(dateStr) {
  return getMealsByDate(dateStr);
}

/**
 * Delete a meal.
 * @param {string} mealId - Meal ID
 * @returns {boolean} Whether deleted
 */
function removeMeal(mealId) {
  return deleteMeal(mealId);
}

/**
 * Get meal totals.
 * @param {Object} meal - Meal object
 * @returns {Object} Total nutrition
 */
function getMealTotals(meal) {
  return calculateMealTotals(meal);
}

/**
 * Get meal foods with calculated nutrition.
 * @param {Object} meal - Meal object
 * @returns {Array} Foods with nutrition
 */
function getMealFoods(meal) {
  return getMealFoodsWithNutrition(meal);
}

/**
 * Clear all data.
 */
function clearAllData() {
  clearAll();
}

module.exports = {
  scanImage,
  saveScannedProduct,
  getAllProducts,
  removeProduct,
  createNewMeal,
  addFood,
  removeFood,
  getAllMeals,
  getMealsForDate,
  removeMeal,
  getMealTotals,
  getMealFoods,
  clearAllData,
};