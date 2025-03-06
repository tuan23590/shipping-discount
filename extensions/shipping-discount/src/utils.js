export const OPERATORS = {
  greater: (a, b) => a > b,
  less: (a, b) => a < b,
  equal: (a, b) => a === b,
  notEqual: (a, b) => a !== b,
};

/**
 * Calculate total amount of cart and compare with given value
 * @param {Object} cart - Cart object containing lines with cost information
 * @param {Object} data - Data object containing operator and value
 * @returns {boolean} - Whether the condition is met
 */
export function handleTotalAmount(cart, data) {
  const totalAmount = cart.lines.reduce((acc, line) => {  
    return acc + line.quantity;
  }, 0);
  return OPERATORS[data.operator]?.(totalAmount, parseFloat(data.value)) || false;
}

/**
 * Calculate subtotal amount of cart in USD and compare with given value
 * @param {Object} cart - Cart object containing cost information
 * @param {Object} data - Data object containing operator and value
 * @returns {boolean} - Whether the condition is met
 */
export function handleSubtotalAmount(cart, data) {
  // Only apply for USD currency
  if (cart.cost.subtotalAmount.currencyCode !== 'USD') {
    return false;
  }
  
  const subtotalAmount = parseFloat(cart.cost.subtotalAmount.amount);
  return OPERATORS[data.operator]?.(subtotalAmount, parseFloat(data.value)) || false;
}

/**
 * Calculate total weight of cart and compare with given value
 * @param {Object} cart - Cart object containing lines with merchandise information
 * @param {Object} data - Data object containing operator and value (in kilograms)
 * @returns {boolean} - Whether the condition is met
 */
export function handleTotalWeight(cart, data) {
  const totalWeight = cart.lines.reduce((acc, line) => {
    if (line.merchandise?.weight && line.merchandise?.weightUnit) {
      // Convert all weights to kilograms for comparison
      let weightInKg = line.merchandise.weight;
      if (line.merchandise.weightUnit === 'GRAMS') {
        weightInKg /= 1000;
      } else if (line.merchandise.weightUnit === 'POUNDS') {
        weightInKg *= 0.453592;
      } else if (line.merchandise.weightUnit === 'OUNCES') {
        weightInKg *= 0.0283495;
      }
      return acc + (weightInKg * line.quantity);
    }
    return acc;
  }, 0);

  return OPERATORS[data.operator]?.(totalWeight, parseFloat(data.value)) || false;
}

/**
 * Handle cart currency condition
 * @param {Object} cart - Cart object containing cost information
 * @param {Object} data - Data object containing operator and value
 * @returns {boolean} - Whether the condition is met
 */
export function handleCartCurrency(cart, data) {
  const cartCurrency = cart.cost.subtotalAmount.currencyCode;
  const currencies = data.currencies;
  const operator = data.operator;
  if (operator === "contains") {
    return currencies.includes(cartCurrency);
  } else if (operator === "doesNotContain") {
    return !currencies.includes(cartCurrency);
  }
  return false;
}

// always return true
export function handleAlways(cart, data) {
  return true;
}

/**
 * Map of type handlers for different discount conditions
 */
export const TYPE_HANDLERS = {
  totalAmount: handleTotalAmount,
  subtotalAmount: handleSubtotalAmount,
  totalWeight: handleTotalWeight,
  always: handleAlways,
  cartCurrency: handleCartCurrency,
};
