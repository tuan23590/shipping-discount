import { BlockStack, Select, TextField } from "@shopify/polaris";
import React, { useEffect } from "react";
import { produce } from "immer";

export default function TotalAmount({ discountValue, setDiscountValue, index }) {
  function handleOperatorChange(value) {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value[index].data.operator = value;
      }),
    );
  }

  function handleValueChange(value) {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value[index].data.value = value;  
      }),
    );
  }

  useEffect(() => {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value[index].data.operator = "greater";
        draft.metafields[0].value.value[index].data.value = 0;
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
        value={discountValue.metafields[0].value.value[index].data.operator}
      />
      <TextField
        label="Value"
        type="number"
        value={discountValue.metafields[0].value.value[index].data.value}
        onChange={handleValueChange}
      />
    </BlockStack>
  );
}
