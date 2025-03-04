const EMPTY_DISCOUNT = {
  discounts: [],
};

export function run(input) {
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
        message: "50% off shipping",
      },
    ],
  };
}