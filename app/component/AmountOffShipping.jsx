import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  InlineGrid,
  Text,
  TextField,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { generateRandomCode } from "../utils";
import { produce } from "immer";

export default function AmountOffShipping({
  setBasicCodeDiscount,
  basicCodeDiscount,
}) {
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);

  const handleButtonClick = useCallback(
    (index) => {
      if (activeButtonIndex === index) return;
      setActiveButtonIndex(index);
    },
    [activeButtonIndex],
  );

  function handeleGenerateRandomCode() {
    const generateCode = generateRandomCode();
    setBasicCodeDiscount(
      produce((draft) => {
        draft.code = generateCode;
      }),
    );
  }

  const handleCodeChange = useCallback((value) => {
    setBasicCodeDiscount(
      produce((draft) => {
        draft.code = value;
      }),
    );
  }, []);

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="300">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Amount off shipping
          </Text>
        </InlineGrid>
        <BlockStack gap="600">
          <ButtonGroup variant="segmented">
            <Button
              onClick={() => handleButtonClick(0)}
              pressed={activeButtonIndex === 0}
            >
              Discount code
            </Button>
            <Button
              onClick={() => handleButtonClick(1)}
              pressed={activeButtonIndex === 1}
            >
              Automatic discount
            </Button>
          </ButtonGroup>
          <TextField
            label="Discount code"
            labelAction={{
              content: "Generate random code",
              onAction: handeleGenerateRandomCode,
            }}
            helpText="Customers must enter this code at checkout."
            value={basicCodeDiscount.code}
            onChange={handleCodeChange}
          />
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
