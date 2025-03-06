import {
  BlockStack,
  Card,
  InlineGrid,
  KeyboardKey,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";

export default function ShippingMethods() {
  const [shippingMethod, setShippingMethod] = useState("all");
  const handleShippingMethodChange = useCallback(
    (value) => {
      setShippingMethod(value);
    },
    [setShippingMethod],
  );

  const shippingMethods = [
    { value: "all", label: "All shipping methods" },
    { value: "contains", label: "Contains" },
    { value: "isExactly", label: "Is exactly" },
    { value: "doesNotContain", label: "Does not contain" },
  ];
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Applies discount to Shipping methods ❌
          </Text>
        </InlineGrid>
        <Select
          options={shippingMethods}
          value={shippingMethod}
          onChange={handleShippingMethodChange}
        />
        {shippingMethod !== "all" && (
          <TextField
            label="Shipping method"
            helpText={
              <Text as="span">
                Shipping method name. Press{" "}
                <KeyboardKey size="small">enter</KeyboardKey> to add, allow
                multiple values.
              </Text>
            }
            placeholder="Example: International Shipping"
          />
        )}
      </BlockStack>
    </Card>
  );
}
