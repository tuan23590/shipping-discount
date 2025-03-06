import {
  BlockStack,
  Card,
  InlineGrid,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";

import React, { useCallback, useState } from "react";

export default function DiscountValue({ discountValue, setDiscountValue }) {
  const [discountType, setDiscountType] = useState("percentage");

    const handleCustomerPercentageChange = useCallback(
    (value) => {
      // setDiscountValue(
      //   produce((draft) => {
      //     draft.customerGets.value.percentage = value / 100;
      //   }),
      // );
    },
    [setDiscountValue],
    );

  const handleDiscountTypeChange = useCallback(
    (value) => {
      setDiscountType(value);
    },
    [setDiscountType],
  );

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Discount value ❌
          </Text>
        </InlineGrid>
        <BlockStack gap="300">
          <Select
            label="Discount type"
            options={[
              { value: "percentage", label: "Percentage" },
              { value: "fixedAmount", label: "Fixed amount" },
              { value: "flatRate", label: "Flat rate" },
            ]}
            value={discountType}
            onChange={handleDiscountTypeChange}
          />
          <TextField
            type="number"
            prefix={discountType === "percentage" && "%"}
            helpText={
              discountType === "flatRate" &&
              "Always lower than the actual shipping cost."
            }
            // value={discountValue.customerGets.value.percentage * 100}
            onChange={handleCustomerPercentageChange}
          />
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
