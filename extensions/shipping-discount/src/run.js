import { TYPE_HANDLERS } from './utils';

const EMPTY_DISCOUNT = {
  discounts: [],
};

export function run(input) {
  const metafield = JSON.parse(input.discountNode.metafield.value || "{}");
  
  // Get the appropriate handler for the type
  const handler = TYPE_HANDLERS[metafield.type];
  
  // If no handler exists for the type or conditions are not met, return empty discount
  if (!handler || !handler(input.cart, metafield.data)) {
    return EMPTY_DISCOUNT;
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
