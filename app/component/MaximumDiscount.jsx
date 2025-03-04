import {
  BlockStack,
  Card,
  Checkbox,
  InlineGrid,
  Text,
  TextField,
} from "@shopify/polaris";
import { produce } from "immer";
import React, { useState } from "react";

export default function MaximumDiscount({
  basicCodeDiscount,
  setBasicCodeDiscount,
}) {
  const [showUsageLimit, setShowUsageLimit] = useState(
    basicCodeDiscount.usageLimit !== undefined,
  );

  function handleUsageLimitVisibilityChange() {
    setShowUsageLimit(
      produce((draft) => {
        if (draft) {
          delete basicCodeDiscount.usageLimit;
        }
        return !draft;
      }),
    );
  }

  function handleAppliesOncePerCustomerChange() {
    setBasicCodeDiscount(
      produce((draft) => {
        draft.appliesOncePerCustomer = !draft.appliesOncePerCustomer;
      }),
    );
  }

  function handleUsageLimitChange(value) {
    setBasicCodeDiscount(
      produce((draft) => {
        const parsedValue = parseInt(value || 0);
        if (parsedValue === 0) {
          delete draft.usageLimit; // Xóa thuộc tính usageLimit nếu value === 0
        } else {
          draft.usageLimit = parseInt(value); // Cập nhật usageLimit nếu value khác 0
        }
      }),
    );
  }

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Maximum discount uses
          </Text>
        </InlineGrid>
        <BlockStack gap="100">
          <Checkbox
            label="Limit number of times this discount can be used in total"
            checked={showUsageLimit}
            onChange={handleUsageLimitVisibilityChange}
          />
          {showUsageLimit && (
            <TextField
              type="number"
              value={basicCodeDiscount.usageLimit}
              onChange={handleUsageLimitChange}
              autoFocus
            />
          )}
          <Checkbox
            label="Limit to one use per customer"
            checked={basicCodeDiscount.appliesOncePerCustomer}
            onChange={handleAppliesOncePerCustomerChange}
          />
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
