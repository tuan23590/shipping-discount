import { BlockStack, Icon, InlineGrid, Select, TextField } from "@shopify/polaris";
import { produce } from "immer";
import React, { useEffect } from "react";

export default function SubtotalAmount({ discountValue, setDiscountValue }) {
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
        value={discountValue.metafields[0].value.data.operator }
      />
      <TextField
        label="Value (USD)"
        type="number"
        value={discountValue.metafields[0].value.data.value}
        onChange={handleValueChange}
        prefix="$"
        helpText="We just support USD currency"
      />
    </BlockStack>
  );
}
