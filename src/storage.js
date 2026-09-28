/**
 * LocalStorage-based persistence layer for products and meals.
 * Provides simple CRUD operations for storing data in the browser.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'nutrition_scanner_products',
  MEALS: 'nutrition_scanner_meals',
};

/**
 * Get all stored products.
 * @returns {Array} Array of product objects
 */
function getProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading products:', e);
    return [];
  }
}

/**
 * Save a product.
 * @param {Object} product - Product object to save
 * @returns {Object} The saved product
 */
function saveProduct(product) {
  const products = getProducts();
  
  // Check if product already exists (by name)
  const existingIndex = products.findIndex(p => p.name === product.name);
  if (existingIndex >= 0) {
    products[existingIndex] = { ...products[existingIndex], ...product };
  } else {
    products.push(product);
  }
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return product;
}

/**
 * Delete a product.
 * @param {string} productId - ID of the product to delete
 * @returns {boolean} Whether the product was deleted
 */
function deleteProduct(productId) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== productId);
  
  if (filtered.length === products.length) {
    return false; // Not found
  }
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  return true;
}

/**
 * Get all stored meals.
 * @returns {Array} Array of meal objects
 */
function getMeals() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading meals:', e);
    return [];
  }
}

/**
 * Save a meal.
 * @param {Object} meal - Meal object to save
 * @returns {Object} The saved meal
 */
function saveMeal(meal) {
  const meals = getMeals();
  
  // Check if meal already exists
  const existingIndex = meals.findIndex(m => m.id === meal.id);
  if (existingIndex >= 0) {
    meals[existingIndex] = meal;
  } else {
    meals.push(meal);
  }
  
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  return meal;
}

/**
 * Delete a meal.
 * @param {string} mealId - ID of the meal to delete
 * @returns {boolean} Whether the meal was deleted
 */
function deleteMeal(mealId) {
  const meals = getMeals();
  const filtered = meals.filter(m => m.id !== mealId);
  
  if (filtered.length === meals.length) {
    return false; // Not found
  }
  
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(filtered));
  return true;
}

/**
 * Get meals for a specific date.
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {Array} Array of meals for the date
 */
function getMealsByDate(dateStr) {
  const meals = getMeals();
  return meals.filter(m => m.date && m.date.startsWith(dateStr));
}

/**
 * Clear all stored data.
 */
function clearAll() {
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.MEALS);
}

module.exports = {
  getProducts,
  saveProduct,
  deleteProduct,
  getMeals,
  saveMeal,
  deleteMeal,
  getMealsByDate,
  clearAll,
};