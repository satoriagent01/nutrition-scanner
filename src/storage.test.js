/**
 * Tests for the storage module
 * Tests LocalStorage-based persistence for products and meals
 */

const { Storage } = require('../src/storage.js');

describe('Storage Module', () => {
  let storage;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    storage = new Storage();
  });

  describe('saveProduct', () => {
    test('should save a product', () => {
      const product = {
        id: 'product-1',
        name: 'Chocolate Bar',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' },
          fat: { per100g: '33', perServing: '10', unit: 'g' },
          carbs: { per100g: '55', perServing: '16', unit: 'g' },
          sugar: { per100g: '45', perServing: '14', unit: 'g' },
          fiber: { per100g: '2.4', perServing: '0.7', unit: 'g' },
          protein: { per100g: '6.8', perServing: '2.0', unit: 'g' },
          salt: { per100g: '0.18', perServing: '0.05', unit: 'g' }
        }
      };

      const result = storage.saveProduct(product);
      
      expect(result).toBe(true);
      expect(storage.getProducts().length).toBe(1);
      expect(storage.getProducts()[0].name).toBe('Chocolate Bar');
    });

    test('should not save duplicate products', () => {
      const product = {
        id: 'product-1',
        name: 'Chocolate Bar',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' }
        }
      };

      storage.saveProduct(product);
      const result = storage.saveProduct(product);
      
      expect(result).toBe(false);
      expect(storage.getProducts().length).toBe(1);
    });

    test('should update an existing product', () => {
      const product1 = {
        id: 'product-1',
        name: 'Chocolate Bar',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' }
        }
      };

      const product2 = {
        id: 'product-1',
        name: 'Chocolate Bar Updated',
        nutrition: {
          energy: { per100g: '600', perServing: '180', unit: 'kcal' }
        }
      };

      storage.saveProduct(product1);
      const result = storage.saveProduct(product2);
      
      expect(result).toBe(true);
      expect(storage.getProducts().length).toBe(1);
      expect(storage.getProducts()[0].name).toBe('Chocolate Bar Updated');
    });
  });

  describe('getProducts', () => {
    test('should return all saved products', () => {
      const product1 = {
        id: 'product-1',
        name: 'Chocolate Bar',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' }
        }
      };

      const product2 = {
        id: 'product-2',
        name: 'Apple',
        nutrition: {
          energy: { per100g: '52', perServing: '52', unit: 'kcal' }
        }
      };

      storage.saveProduct(product1);
      storage.saveProduct(product2);
      
      const products = storage.getProducts();
      
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Chocolate Bar');
      expect(products[1].name).toBe('Apple');
    });

    test('should return empty array when no products are saved', () => {
      const products = storage.getProducts();
      
      expect(products).toBeDefined();
      expect(products.length).toBe(0);
    });
  });

  describe('saveMeal', () => {
    test('should save a meal', () => {
      const meal = {
        id: 'meal-1',
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      const result = storage.saveMeal(meal);
      
      expect(result).toBe(true);
      expect(storage.getMeals().length).toBe(1);
      expect(storage.getMeals()[0].name).toBe('Breakfast');
    });

    test('should not save duplicate meals', () => {
      const meal = {
        id: 'meal-1',
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      storage.saveMeal(meal);
      const result = storage.saveMeal(meal);
      
      expect(result).toBe(false);
      expect(storage.getMeals().length).toBe(1);
    });

    test('should update an existing meal', () => {
      const meal1 = {
        id: 'meal-1',
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      const meal2 = {
        id: 'meal-1',
        name: 'Breakfast Updated',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 2 }
        ]
      };

      storage.saveMeal(meal1);
      const result = storage.saveMeal(meal2);
      
      expect(result).toBe(true);
      expect(storage.getMeals().length).toBe(1);
      expect(storage.getMeals()[0].name).toBe('Breakfast Updated');
    });
  });

  describe('getMeals', () => {
    test('should return all saved meals', () => {
      const meal1 = {
        id: 'meal-1',
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      const meal2 = {
        id: 'meal-2',
        name: 'Snack',
        date: '2024-01-15',
        foodItems: [
          { name: 'Apple', amount: 1 }
        ]
      };

      storage.saveMeal(meal1);
      storage.saveMeal(meal2);
      
      const meals = storage.getMeals();
      
      expect(meals.length).toBe(2);
      expect(meals[0].name).toBe('Breakfast');
      expect(meals[1].name).toBe('Snack');
    });

    test('should return empty array when no meals are saved', () => {
      const meals = storage.getMeals();
      
      expect(meals).toBeDefined();
      expect(meals.length).toBe(0);
    });
  });

  describe('getMealByDate', () => {
    test('should return meals for a specific date', () => {
      const meal1 = {
        id: 'meal-1',
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      const meal2 = {
        id: 'meal-2',
        name: 'Snack',
        date: '2024-01-15',
        foodItems: [
          { name: 'Apple', amount: 1 }
        ]
      };

      const meal3 = {
        id: 'meal-3',
        name: 'Dinner',
        date: '2024-01-16',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      storage.saveMeal(meal1);
      storage.saveMeal(meal2);
      storage.saveMeal(meal3);
      
      const meals = storage.getMealByDate('2024-01-15');
      
      expect(meals.length).toBe(2);
      expect(meals[0].name).toBe('Breakfast');
      expect(meals[1].name).toBe('Snack');
    });

    test('should return empty array for dates with no meals', () => {
      const meals = storage.getMealByDate('2024-01-15');
      
      expect(meals).toBeDefined();
      expect(meals.length).toBe(0);
    });
  });

  describe('deleteProduct', () => {
    test('should delete a product', () => {
      const product = {
        id: 'product-1',
        name: 'Chocolate Bar',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' }
        }
      };

      storage.saveProduct(product);
      expect(storage.getProducts().length).toBe(1);
      
      const result = storage.deleteProduct('product-1');
      
      expect(result).toBe(true);
      expect(storage.getProducts().length).toBe(0);
    });

    test('should return false when deleting non-existent product', () => {
      const result = storage.deleteProduct('non-existent');
      
      expect(result).toBe(false);
    });
  });

  describe('deleteMeal', () => {
    test('should delete a meal', () => {
      const meal = {
        id: 'meal-1',
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      storage.saveMeal(meal);
      expect(storage.getMeals().length).toBe(1);
      
      const result = storage.deleteMeal('meal-1');
      
      expect(result).toBe(true);
      expect(storage.getMeals().length).toBe(0);
    });

    test('should return false when deleting non-existent meal', () => {
      const result = storage.deleteMeal('non-existent');
      
      expect(result).toBe(false);
    });
  });

  describe('clearAll', () => {
    test('should clear all saved data', () => {
      const product = {
        id: 'product-1',
        name: 'Chocolate Bar',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' }
        }
      };

      const meal = {
        id: 'meal-1',
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      storage.saveProduct(product);
      storage.saveMeal(meal);
      
      expect(storage.getProducts().length).toBe(1);
      expect(storage.getMeals().length).toBe(1);
      
      storage.clearAll();
      
      expect(storage.getProducts().length).toBe(0);
      expect(storage.getMeals().length).toBe(0);
    });
  });
});