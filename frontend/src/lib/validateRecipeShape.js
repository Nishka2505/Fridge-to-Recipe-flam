/**
 * Validates the structure and data types of a recipe JSON object.
 * Throws an Error with a descriptive message if the object is invalid.
 * 
 * @param {any} recipe The parsed JSON object to validate.
 * @returns {boolean} Returns true if valid, throws error otherwise.
 */
export function validateRecipeShape(recipe) {
  if (!recipe || typeof recipe !== 'object') {
    throw new Error("Recipe must be a valid JSON object.");
  }
  
  if (typeof recipe.title !== 'string' || !recipe.title.trim()) {
    throw new Error("Recipe is missing a valid 'title' string.");
  }
  
  if (typeof recipe.servings !== 'number' || recipe.servings <= 0) {
    throw new Error("Recipe must have a positive 'servings' number.");
  }
  
  if (typeof recipe.prepTimeMinutes !== 'number' || recipe.prepTimeMinutes < 0) {
    throw new Error("Recipe must have a valid 'prepTimeMinutes' number.");
  }
  
  if (typeof recipe.cookTimeMinutes !== 'number' || recipe.cookTimeMinutes < 0) {
    throw new Error("Recipe must have a valid 'cookTimeMinutes' number.");
  }
  
  if (!Array.isArray(recipe.ingredients)) {
    throw new Error("Recipe must contain an 'ingredients' array.");
  }
  
  recipe.ingredients.forEach((ing, index) => {
    if (!ing.id) {
      throw new Error(`Ingredient at index ${index} is missing an 'id'.`);
    }
    if (typeof ing.name !== 'string' || !ing.name.trim()) {
      throw new Error(`Ingredient at index ${index} is missing a valid name.`);
    }
    if (typeof ing.quantity !== 'number') {
      throw new Error(`Ingredient '${ing.name || index}' quantity must be a number (got ${typeof ing.quantity}).`);
    }
    if (typeof ing.unit !== 'string') {
      throw new Error(`Ingredient '${ing.name || index}' unit must be a string.`);
    }
    if (typeof ing.swappable !== 'boolean') {
      throw new Error(`Ingredient '${ing.name || index}' swappable property must be a boolean.`);
    }
  });
  
  if (!Array.isArray(recipe.steps)) {
    throw new Error("Recipe must contain a 'steps' array.");
  }
  
  recipe.steps.forEach((step, index) => {
    if (!step.id) {
      throw new Error(`Step at index ${index} is missing an 'id'.`);
    }
    if (typeof step.order !== 'number') {
      throw new Error(`Step '${step.id || index}' is missing a valid numeric 'order'.`);
    }
    if (typeof step.text !== 'string' || !step.text.trim()) {
      throw new Error(`Step '${step.id || index}' is missing instruction text.`);
    }
  });

  if (recipe.notes !== undefined && recipe.notes !== null && typeof recipe.notes !== 'string') {
    throw new Error("Recipe 'notes' must be a valid string.");
  }
  
  return true;
}
