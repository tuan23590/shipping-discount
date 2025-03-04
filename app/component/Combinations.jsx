import { BlockStack, Card, Checkbox, InlineGrid, Text } from "@shopify/polaris";
import { produce } from "immer";
import React from "react";

export default function Combinations({
  basicCodeDiscount,
  setBasicCodeDiscount,
}) {
  function handleProductDiscountsChange() {
    setBasicCodeDiscount(
      produce(basicCodeDiscount, (draft) => {
        draft.combinesWith.productDiscounts =
          !draft.combinesWith.productDiscounts;
      }),
    );
  }

  function handleOrderDiscountsChange() {
    setBasicCodeDiscount(
      produce(basicCodeDiscount, (draft) => {
        draft.combinesWith.orderDiscounts = !draft.combinesWith.orderDiscounts;
      }),
    );
  }

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Combinations
          </Text>
        </InlineGrid>
        <BlockStack gap="100">
          <Text>This discount discount can be combined with:</Text>
          <Checkbox
            label="Product discounts"
            checked={basicCodeDiscount.combinesWith.productDiscounts}
            onChange={handleProductDiscountsChange}
          />
          <Checkbox
            label="Order discounts"
            checked={basicCodeDiscount.combinesWith.orderDiscounts}
            onChange={handleOrderDiscountsChange}
          />
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
