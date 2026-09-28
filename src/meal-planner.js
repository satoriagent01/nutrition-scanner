/**
 * Meal planner module for tracking meals with custom food items.
 * Allows users to create meals, add foods with custom gram amounts,
 * and track nutritional intake.
 */

/**
 * Create a new meal.
 * @param {string} name - Meal name
 * @param {Date} date - Date of the meal
 * @returns {Object} The created meal
 */
function createMeal(name, date = new Date()) {
  return {
    id: generateId(),
    name: name,
    date: date.toISOString(),
    foods: [],
  };
}

/**
 * Add a food item to a meal.
 * @param {Object} meal - The meal object
 * @param {Object} food - Food item with name, grams, and nutrition data
 * @returns {Object} The updated meal
 */
function addFoodToMeal(meal, food) {
  const foodItem = {
    id: generateId(),
    name: food.name,
    grams: food.grams || 100,
    nutrition: food.nutrition || {},
    scannedProductId: food.scannedProductId || null,
  };
  
  meal.foods.push(foodItem);
  return meal;
}

/**
 * Remove a food item from a meal.
 * @param {Object} meal - The meal object
 * @param {string} foodId - ID of the food to remove
 * @returns {Object} The updated meal
 */
function removeFoodFromMeal(meal, foodId) {
  meal.foods = meal.foods.filter(f => f.id !== foodId);
  return meal;
}

/**
 * Calculate total nutrition for a meal.
 * @param {Object} meal - The meal object
 * @returns {Object} Total nutrition values
 */
function calculateMealTotals(meal) {
  const totals = {
    energy: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    salt: 0,
  };
  
  for (const food of meal.foods) {
    const factor = food.grams / 100; // Normalize to per 100g
    
    for (const [key, value] of Object.entries(food.nutrition)) {
      if (totals.hasOwnProperty(key)) {
        totals[key] += value * factor;
      }
    }
  }
  
  // Round to reasonable precision
  for (const key of Object.keys(totals)) {
    totals[key] = Math.round(totals[key] * 10) / 10;
  }
  
  return totals;
}

/**
 * Create a new product entry from scanned nutrition data.
 * @param {string} name - Product name
 * @param {Object} nutrition - Nutrition data per 100g
 * @returns {Object} The product
 */
function createProduct(name, nutrition) {
  return {
    id: generateId(),
    name: name,
    nutrition: nutrition,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get all foods in a meal with calculated nutrition.
 * @param {Object} meal - The meal object
 * @returns {Array} Array of food items with calculated nutrition
 */
function getMealFoodsWithNutrition(meal) {
  return meal.foods.map(food => {
    const factor = food.grams / 100;
    const calculatedNutrition = {};
    
    for (const [key, value] of Object.entries(food.nutrition)) {
      calculatedNutrition[key] = Math.round(value * factor * 10) / 10;
    }
    
    return {
      ...food,
      calculatedNutrition,
    };
  });
}

/**
 * Generate a unique ID.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  createMeal,
  addFoodToMeal,
  removeFoodFromMeal,
  calculateMealTotals,
  createProduct,
  getMealFoodsWithNutrition,
};