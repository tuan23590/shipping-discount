import { BlockStack, Select, TextField } from "@shopify/polaris";
import React from "react";

export default function TotalAmount() {
  return (
    <BlockStack gap="300">
      <Select
        label="Operator"
        options={[
          { label: "is greater than", value: "greater" },
          { label: "is less than", value: "less" },
          { label: "is equal to", value: "equal" },
          { label: "is not equal to", value: "notEqual" },
        ]}
      />
      <TextField label="Value" type="number" />
    </BlockStack>
  );
}
