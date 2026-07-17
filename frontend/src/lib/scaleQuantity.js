/**
 * Scales an ingredient quantity and formats it beautifully as a fraction if appropriate.
 * 
 * @param {number} quantity The base quantity.
 * @param {number} originalServings The default recipe servings.
 * @param {number} newServings The user-selected servings.
 * @returns {string} The scaled and formatted quantity.
 */
export function scaleQuantity(quantity, originalServings, newServings) {
  if (quantity === undefined || quantity === null || isNaN(quantity)) {
    return "";
  }
  
  const scaled = quantity * (newServings / originalServings);
  if (scaled <= 0) return "0";
  
  // Round to 2 decimal places to prevent float precision issues
  const rounded = Math.round(scaled * 100) / 100;
  
  const integerPart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - integerPart) * 100) / 100;
  
  let fractionStr = "";
  // tolerance check (around 0.03)
  if (Math.abs(decimalPart - 0.25) <= 0.03) {
    fractionStr = "¼";
  } else if (Math.abs(decimalPart - 0.5) <= 0.03) {
    fractionStr = "½";
  } else if (Math.abs(decimalPart - 0.75) <= 0.03) {
    fractionStr = "¾";
  } else if (Math.abs(decimalPart - 0.33) <= 0.04) {
    fractionStr = "⅓";
  } else if (Math.abs(decimalPart - 0.67) <= 0.04) {
    fractionStr = "⅔";
  } else if (decimalPart <= 0.03) {
    fractionStr = "";
  } else {
    // If it doesn't fit standard cooking fractions, return single decimal digit
    return Number(scaled.toFixed(1)).toString();
  }
  
  if (integerPart === 0) {
    return fractionStr || "0";
  }
  
  return fractionStr ? `${integerPart}${fractionStr}` : `${integerPart}`;
}
