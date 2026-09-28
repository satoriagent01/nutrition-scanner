/**
 * Frontend application logic for Nutrition Scanner
 * Handles camera, OCR scanning, product saving, meal planning, and UI updates.
 */

const { scanImage } = require('../src/ocr.js');
const { parseNutritionTable } = require('../src/parser.js');
const { saveProduct, getProducts, deleteProduct, saveMeal, getMeals, deleteMeal, addFoodToMeal, removeFoodFromMeal, getDailyTotals } = require('../src/storage.js');
const { MealPlanner } = require('../src/meal-planner.js');

// State
let currentImage = null;
let currentNutritionData = null;
const mealPlanner = new MealPlanner();

// DOM Elements
const takePhotoBtn = document.getElementById('take-photo-btn');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const scanBtn = document.getElementById('scan-btn');
const cancelScanBtn = document.getElementById('cancel-scan-btn');
const scanResult = document.getElementById('scan-result');
const nutritionTable = document.getElementById('nutrition-table');
const productNameInput = document.getElementById('product-name');
const saveProductBtn = document.getElementById('save-product-btn');
const scanLoading = document.getElementById('scan-loading');
const productsList = document.getElementById('products-list');
const mealDateInput = document.getElementById('meal-date');
const mealNameInput = document.getElementById('meal-name');
const createMealBtn = document.getElementById('create-meal-btn');
const mealsList = document.getElementById('meals-list');
const dailyTotals = document.getElementById('daily-totals');

// Initialize
function init() {
  // Set today's date as default
  mealDateInput.value = new Date().toISOString().split('T')[0];
  
  // Event listeners
  takePhotoBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  scanBtn.addEventListener('click', handleScan);
  cancelScanBtn.addEventListener('click', cancelScan);
  saveProductBtn.addEventListener('click', saveProductFromScan);
  createMealBtn.addEventListener('click', createMeal);
  
  // Load initial data
  loadProducts();
  loadMeals();
  updateDailyTotals();
}

// Handle file selection from camera or file picker
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    currentImage = e.target.result;
    previewImg.src = currentImage;
    imagePreview.classList.remove('hidden');
    scanResult.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

// Cancel scan and hide preview
function cancelScan() {
  currentImage = null;
  currentNutritionData = null;
  imagePreview.classList.add('hidden');
  scanResult.classList.add('hidden');
  fileInput.value = '';
}

// Handle OCR scan
async function handleScan() {
  if (!currentImage) return;
  
  scanLoading.classList.remove('hidden');
  scanResult.classList.add('hidden');
  
  try {
    const ocrText = await scanImage(currentImage);
    currentNutritionData = parseNutritionTable(ocrText);
    
    if (currentNutritionData && currentNutritionData.items.length > 0) {
      displayNutritionTable(currentNutritionData);
      scanResult.classList.remove('hidden');
      productNameInput.value = '';
    } else {
      alert('Could not detect nutrition table. Please try again with a clearer image.');
    }
  } catch (error) {
    console.error('Scan error:', error);
    alert('Error during scan. Please try again.');
  } finally {
    scanLoading.classList.add('hidden');
  }
}

// Display nutrition table in UI
function displayNutritionTable(data) {
  let html = '<table>';
  html += '<tr><th>Nutrient</th><th>Per 100g</th><th>Per Serving</th></tr>';
  
  data.items.forEach(item => {
    html += `<tr>
      <td>${item.name}</td>
      <td>${item.per100g} ${item.unit}</td>
      <td>${item.perServing} ${item.unit}</td>
    </tr>`;
  });
  
  html += '</table>';
  nutritionTable.innerHTML = html;
}

// Save scanned product
function saveProductFromScan() {
  if (!currentNutritionData) return;
  
  const name = productNameInput.value.trim() || 'Unnamed Product';
  const product = {
    id: Date.now().toString(),
    name: name,
    nutrition: currentNutritionData,
    createdAt: new Date().toISOString()
  };
  
  saveProduct(product);
  loadProducts();
  cancelScan();
  alert('Product saved!');
}

// Load and display products
function loadProducts() {
  const products = getProducts();
  
  if (products.length === 0) {
    productsList.innerHTML = '<p>No products saved yet. Scan a nutrition label to add one.</p>';
    return;
  }
  
  let html = '';
  products.forEach(product => {
    const nutrition = product.nutrition;
    const firstItem = nutrition.items[0];
    const calories = firstItem ? `${firstItem.per100g} kcal` : 'N/A';
    
    html += `<div class="product-card">
      <h4>${product.name}</h4>
      <p>Calories: ${calories}</p>
      <p>Added: ${new Date(product.createdAt).toLocaleDateString()}</p>
      <button class="danger" onclick="removeProduct('${product.id}')">🗑️ Delete</button>
    </div>`;
  });
  
  productsList.innerHTML = html;
}

// Remove product (exposed to global scope for onclick)
window.removeProduct = function(id) {
  if (confirm('Delete this product?')) {
    deleteProduct(id);
    loadProducts();
  }
};

// Create a new meal
function createMeal() {
  const date = mealDateInput.value;
  const name = mealNameInput.value.trim() || 'Meal';
  
  if (!date) {
    alert('Please select a date.');
    return;
  }
  
  const meal = {
    id: Date.now().toString(),
    date: date,
    name: name,
    foods: [],
    createdAt: new Date().toISOString()
  };
  
  saveMeal(meal);
  mealNameInput.value = '';
  loadMeals();
  updateDailyTotals();
}

// Load and display meals
function loadMeals() {
  const meals = getMeals();
  
  if (meals.length === 0) {
    mealsList.innerHTML = '<p>No meals created yet. Create a meal to start tracking.</p>';
    return;
  }
  
  let html = '';
  meals.forEach(meal => {
    html += `<div class="meal-card">
      <h4>${meal.name}</h4>
      <p class="meal-date">${new Date(meal.date).toLocaleDateString()}</p>`;
    
    if (meal.foods.length > 0) {
      html += '<ul class="food-list">';
      meal.foods.forEach(food => {
        html += `<li>${food.name} - ${food.amount}g (${food.calories} kcal)</li>`;
      });
      html += '</ul>';
    }
    
    html += `<button onclick="addFoodToMeal('${meal.id}')">➕ Add Food</button>
      <button class="danger" onclick="removeMeal('${meal.id}')">🗑️ Delete</button>
    </div>`;
  });
  
  mealsList.innerHTML = html;
}

// Add food to meal (exposed to global scope)
window.addFoodToMeal = function(mealId) {
  const productName = prompt('Enter product name:');
  if (!productName) return;
  
  const amount = prompt('Enter amount in grams:');
  if (!amount || isNaN(amount)) {
    alert('Invalid amount.');
    return;
  }
  
  // Find product in saved products to get nutrition data
  const products = getProducts();
  const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
  
  let calories = 0;
  let nutrition = {};
  
  if (product) {
    const firstItem = product.nutrition.items[0];
    if (firstItem) {
      calories = (parseFloat(firstItem.per100g) * parseFloat(amount)) / 100;
      nutrition = product.nutrition;
    }
  } else {
    // Manual entry - ask for calories
    const calInput = prompt('Enter calories per 100g:');
    if (calInput && !isNaN(calInput)) {
      calories = (parseFloat(calInput) * parseFloat(amount)) / 100;
    }
  }
  
  const food = {
    name: productName,
    amount: parseFloat(amount),
    calories: Math.round(calories),
    nutrition: nutrition
  };
  
  addFoodToMeal(mealId, food);
  loadMeals();
  updateDailyTotals();
};

// Remove meal (exposed to global scope)
window.removeMeal = function(id) {
  if (confirm('Delete this meal?')) {
    deleteMeal(id);
    loadMeals();
    updateDailyTotals();
  }
};

// Update daily totals display
function updateDailyTotals() {
  const date = mealDateInput.value || new Date().toISOString().split('T')[0];
  const totals = getDailyTotals(date);
  
  if (totals.totalCalories === 0 && totals.totalProtein === 0) {
    dailyTotals.innerHTML = '<p>No meals for this date.</p>';
    return;
  }
  
  dailyTotals.innerHTML = `
    <div class="totals-box">
      <h4>Daily Totals (${new Date(date).toLocaleDateString()})</h4>
      <div class="totals-grid">
        <div class="totals-item">
          <div class="value">${Math.round(totals.totalCalories)}</div>
          <div class="label">kcal</div>
        </div>
        <div class="totals-item">
          <div class="value">${totals.totalProtein.toFixed(1)}g</div>
          <div class="label">Protein</div>
        </div>
        <div class="totals-item">
          <div class="value">${totals.totalFat.toFixed(1)}g</div>
          <div class="label">Fat</div>
        </div>
        <div class="totals-item">
          <div class="value">${totals.totalCarbs.toFixed(1)}g</div>
          <div class="label">Carbs</div>
        </div>
        <div class="totals-item">
          <div class="value">${totals.totalSugar.toFixed(1)}g</div>
          <div class="label">Sugar</div>
        </div>
        <div class="totals-item">
          <div class="value">${totals.totalSodium.toFixed(1)}mg</div>
          <div class="label">Sodium</div>
        </div>
      </div>
    </div>
  `;
}

// Listen for date changes to update totals
mealDateInput.addEventListener('change', updateDailyTotals);

// Start the app
init();