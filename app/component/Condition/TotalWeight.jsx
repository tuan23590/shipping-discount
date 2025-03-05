import React, { useEffect } from "react";
import { produce } from "immer";
import { BlockStack, Select, TextField } from "@shopify/polaris";

export default function TotalWeight({ discountValue, setDiscountValue }) {
  function handleOperatorChange(value) {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.data.operator = value;
      }),
    );
  }

  function handleValueChange(value) {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.data.value = value;
      }),
    );
  }

  useEffect(() => {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.data.operator = "greater";
        draft.metafields[0].value.data.value = 0;
      }),
    );
  }, []);

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
        onChange={handleOperatorChange}
        value={discountValue.metafields[0].value.data.operator}
      />
      <TextField
        label="Value"
        type="number"
        value={discountValue.metafields[0].value.data.value}
        onChange={handleValueChange}
        prefix="kg"
        helpText="Weight (kg, g, lb, oz) will be automatically converted to kg during checkout."
      />
    </BlockStack>
  );
}
