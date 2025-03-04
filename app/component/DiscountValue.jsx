import {
  BlockStack,
  Card,
  InlineGrid,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { produce } from "immer";
import React, { useCallback, useState } from "react";

export default function DiscountValue({ basicCodeDiscount, setBasicCodeDiscount }) {
  const [discountType, setDiscountType] = useState("percentage");

    const handleCustomerPercentageChange = useCallback(
    (value) => {
      setBasicCodeDiscount(
        produce((draft) => {
          draft.customerGets.value.percentage = value / 100;
        }),
      );
    },
    [setBasicCodeDiscount],
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
            Discount value
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
            value={basicCodeDiscount.customerGets.value.percentage * 100}
            onChange={handleCustomerPercentageChange}
          />
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
