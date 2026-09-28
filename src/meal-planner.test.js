/**
 * Tests for the meal planner module
 * Tests adding meals, tracking nutrition, and meal history
 */

const { MealPlanner } = require('../src/meal-planner.js');

describe('Meal Planner Module', () => {
  let planner;

  beforeEach(() => {
    planner = new MealPlanner();
  });

  describe('addFoodItem', () => {
    test('should add a food item with nutrition data', () => {
      const foodItem = {
        name: 'Chocolate Bar',
        servingSize: '30g',
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

      const result = planner.addFoodItem(foodItem);
      
      expect(result).toBe(true);
      expect(planner.foodItems.length).toBe(1);
      expect(planner.foodItems[0].name).toBe('Chocolate Bar');
    });

    test('should not add duplicate food items', () => {
      const foodItem = {
        name: 'Chocolate Bar',
        servingSize: '30g',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' }
        }
      };

      planner.addFoodItem(foodItem);
      const result = planner.addFoodItem(foodItem);
      
      expect(result).toBe(false);
      expect(planner.foodItems.length).toBe(1);
    });

    test('should add food item with custom nutrition values', () => {
      const foodItem = {
        name: 'Custom Food',
        servingSize: '50g',
        nutrition: {
          energy: { per100g: '200', perServing: '100', unit: 'kcal' },
          fat: { per100g: '10', perServing: '5', unit: 'g' },
          carbs: { per100g: '25', perServing: '12.5', unit: 'g' },
          sugar: { per100g: '15', perServing: '7.5', unit: 'g' },
          fiber: { per100g: '2', perServing: '1', unit: 'g' },
          protein: { per100g: '8', perServing: '4', unit: 'g' },
          salt: { per100g: '0.5', perServing: '0.25', unit: 'g' }
        }
      };

      const result = planner.addFoodItem(foodItem);
      
      expect(result).toBe(true);
      expect(planner.foodItems.length).toBe(1);
      expect(planner.foodItems[0].name).toBe('Custom Food');
    });
  });

  describe('addMeal', () => {
    test('should add a meal with food items', () => {
      const foodItem = {
        name: 'Chocolate Bar',
        servingSize: '30g',
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

      planner.addFoodItem(foodItem);
      
      const meal = {
        name: 'Snack',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      const result = planner.addMeal(meal);
      
      expect(result).toBe(true);
      expect(planner.meals.length).toBe(1);
      expect(planner.meals[0].name).toBe('Snack');
    });

    test('should calculate total nutrition for a meal', () => {
      const foodItem = {
        name: 'Chocolate Bar',
        servingSize: '30g',
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

      planner.addFoodItem(foodItem);
      
      const meal = {
        name: 'Snack',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 2 }
        ]
      };

      planner.addMeal(meal);
      
      const mealTotal = planner.getMealTotal(planner.meals[0].id);
      
      expect(mealTotal).toBeDefined();
      expect(mealTotal.energy).toBe(330); // 165 * 2
      expect(mealTotal.fat).toBe(20); // 10 * 2
      expect(mealTotal.carbs).toBe(32); // 16 * 2
      expect(mealTotal.sugar).toBe(28); // 14 * 2
      expect(mealTotal.fiber).toBe(1.4); // 0.7 * 2
      expect(mealTotal.protein).toBe(4); // 2.0 * 2
      expect(mealTotal.salt).toBe(0.1); // 0.05 * 2
    });

    test('should handle multiple food items in a meal', () => {
      const foodItem1 = {
        name: 'Chocolate Bar',
        servingSize: '30g',
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

      const foodItem2 = {
        name: 'Apple',
        servingSize: '100g',
        nutrition: {
          energy: { per100g: '52', perServing: '52', unit: 'kcal' },
          fat: { per100g: '0.2', perServing: '0.2', unit: 'g' },
          carbs: { per100g: '14', perServing: '14', unit: 'g' },
          sugar: { per100g: '10', perServing: '10', unit: 'g' },
          fiber: { per100g: '2.4', perServing: '2.4', unit: 'g' },
          protein: { per100g: '0.3', perServing: '0.3', unit: 'g' },
          salt: { per100g: '0.01', perServing: '0.01', unit: 'g' }
        }
      };

      planner.addFoodItem(foodItem1);
      planner.addFoodItem(foodItem2);
      
      const meal = {
        name: 'Snack',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 },
          { name: 'Apple', amount: 1 }
        ]
      };

      planner.addMeal(meal);
      
      const mealTotal = planner.getMealTotal(planner.meals[0].id);
      
      expect(mealTotal).toBeDefined();
      expect(mealTotal.energy).toBe(217); // 165 + 52
      expect(mealTotal.fat).toBe(10.2); // 10 + 0.2
      expect(mealTotal.carbs).toBe(30); // 16 + 14
      expect(mealTotal.sugar).toBe(24); // 14 + 10
      expect(mealTotal.fiber).toBe(3.1); // 0.7 + 2.4
      expect(mealTotal.protein).toBe(2.3); // 2.0 + 0.3
      expect(mealTotal.salt).toBe(0.06); // 0.05 + 0.01
    });
  });

  describe('getDailyTotal', () => {
    test('should calculate daily nutrition totals', () => {
      const foodItem = {
        name: 'Chocolate Bar',
        servingSize: '30g',
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

      planner.addFoodItem(foodItem);
      
      const meal1 = {
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      const meal2 = {
        name: 'Snack',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 2 }
        ]
      };

      planner.addMeal(meal1);
      planner.addMeal(meal2);
      
      const dailyTotal = planner.getDailyTotal('2024-01-15');
      
      expect(dailyTotal).toBeDefined();
      expect(dailyTotal.energy).toBe(495); // 165 * 3
      expect(dailyTotal.fat).toBe(30); // 10 * 3
      expect(dailyTotal.carbs).toBe(48); // 16 * 3
      expect(dailyTotal.sugar).toBe(42); // 14 * 3
      expect(dailyTotal.fiber).toBe(2.1); // 0.7 * 3
      expect(dailyTotal.protein).toBe(6); // 2.0 * 3
      expect(dailyTotal.salt).toBe(0.15); // 0.05 * 3
    });

    test('should return zero totals for days with no meals', () => {
      const dailyTotal = planner.getDailyTotal('2024-01-15');
      
      expect(dailyTotal).toBeDefined();
      expect(dailyTotal.energy).toBe(0);
      expect(dailyTotal.fat).toBe(0);
      expect(dailyTotal.carbs).toBe(0);
      expect(dailyTotal.sugar).toBe(0);
      expect(dailyTotal.fiber).toBe(0);
      expect(dailyTotal.protein).toBe(0);
      expect(dailyTotal.salt).toBe(0);
    });
  });

  describe('getMealHistory', () => {
    test('should return meal history for a specific date', () => {
      const foodItem = {
        name: 'Chocolate Bar',
        servingSize: '30g',
        nutrition: {
          energy: { per100g: '549', perServing: '165', unit: 'kcal' }
        }
      };

      planner.addFoodItem(foodItem);
      
      const meal1 = {
        name: 'Breakfast',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      const meal2 = {
        name: 'Snack',
        date: '2024-01-15',
        foodItems: [
          { name: 'Chocolate Bar', amount: 2 }
        ]
      };

      const meal3 = {
        name: 'Dinner',
        date: '2024-01-16',
        foodItems: [
          { name: 'Chocolate Bar', amount: 1 }
        ]
      };

      planner.addMeal(meal1);
      planner.addMeal(meal2);
      planner.addMeal(meal3);
      
      const history = planner.getMealHistory('2024-01-15');
      
      expect(history).toBeDefined();
      expect(history.length).toBe(2);
      expect(history[0].name).toBe('Breakfast');
      expect(history[1].name).toBe('Snack');
    });

    test('should return empty array for dates with no meals', () => {
      const history = planner.getMealHistory('2024-01-15');
      
      expect(history).toBeDefined();
      expect(history.length).toBe(0);
    });
  });
});