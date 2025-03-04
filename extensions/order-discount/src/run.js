// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const MINIMUM_DISCOUNT_ITEMS = 3;
  const DISCOUNT_PERCENTAGE = 10;

  const totalDiscountTagItems = input.cart.lines.reduce((total, item) => {
    if (
      item.merchandise.__typename === "ProductVariant" &&
      item.merchandise.product.hasDiscountTag
    ) {
      return total + item.quantity;
    } else {
      return total;
    }
  }, 0);

  if (totalDiscountTagItems >= MINIMUM_DISCOUNT_ITEMS) {
    return {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          value: {
            percentage: {
              value: DISCOUNT_PERCENTAGE,
            },
          },
          targets: [
            {
              orderSubtotal: {
                excludedVariantIds: [],
              },
            },
          ],
        },
      ],
    };
  } else {
    return EMPTY_DISCOUNT;
  }
}
