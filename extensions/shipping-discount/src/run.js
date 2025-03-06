import { TYPE_HANDLERS } from './utils';

const EMPTY_DISCOUNT = {
  discounts: [],
};

export function run(input) {
  const metafield = JSON.parse(input.discountNode.metafield.value || "{}");
  
  // Handle multiple conditions
  if (metafield.operator === "AND" && Array.isArray(metafield.value)) {
    // Check if all conditions are met
    const allConditionsMet = metafield.value.every(condition => {
      const handler = TYPE_HANDLERS[condition.type];
      return handler && handler(input.cart, condition.data);
    });

    if (!allConditionsMet) {
      return EMPTY_DISCOUNT;
    }
  } else {
    // Legacy single condition handling
    const handler = TYPE_HANDLERS[metafield.type];
    if (!handler || !handler(input.cart, metafield.data)) {
      return EMPTY_DISCOUNT;
    }
  }

  const deliveryOptions = [];

  for (const deliveryGroup of input.cart.deliveryGroups) {
    for (const option of deliveryGroup.deliveryOptions) {
      deliveryOptions.push({
        deliveryOption: {
          handle: option.handle,
        },
      });
    }
  }

  return {
    discounts: [
      {
        targets: deliveryOptions,
        value: {
          percentage: {
            value: 100,
          },
        },
        message: "100% off shipping",
      },
    ],
  };
}
