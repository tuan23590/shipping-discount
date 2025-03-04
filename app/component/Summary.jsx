import { BlockStack, Card, InlineGrid, Text } from "@shopify/polaris";
import React from "react";

export default function Summary() {
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Summary
          </Text>
        </InlineGrid>
      </BlockStack>
    </Card>
  );
}
