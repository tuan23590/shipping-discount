import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Divider,
  InlineGrid,
  RadioButton,
  Text,
} from "@shopify/polaris";
import React from "react";
import { PlusIcon } from "@shopify/polaris-icons";
import { produce } from "immer";
import ConditionItem from "./ConditionItem";
export default function BasedOn({ discountValue, setDiscountValue }) {
  const isVisibleConditionAction =
    discountValue.metafields[0].value.value.length > 1;

  function handleAddCondition() {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value.push({ type: "always", data: {} });
      }),
    );
  }

  function handleChangeOperator(operator) {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.operator = operator;
      }),
    );
  }

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Based on ✅
          </Text>
        </InlineGrid>
        {/* operator */}
        {isVisibleConditionAction && (
          <BlockStack gap="200">
            <RadioButton
              checked={discountValue.metafields[0].value.operator === "AND"}
              onChange={() => handleChangeOperator("AND")}
              label="All below"
            />
            <RadioButton
              checked={discountValue.metafields[0].value.operator === "OR"}
              onChange={() => handleChangeOperator("OR")}
              label="Any below"
            />
          </BlockStack>
        )}
        {discountValue.metafields[0].value.value.map((condition, index) => (
          <BlockStack key={`${condition.id}-${index}`} gap="400">
            <ConditionItem
              condition={condition}
              index={index}
              isVisibleConditionAction={isVisibleConditionAction}
              setDiscountValue={setDiscountValue}
              discountValue={discountValue}
            />
            {isVisibleConditionAction &&
              index !== discountValue.metafields[0].value.value.length - 1 && (
                <BlockStack>
                  <Text>{discountValue.metafields[0].value.operator}</Text>
                  <Divider />
                </BlockStack>
              )}
          </BlockStack>
        ))}
        <ButtonGroup>
          <Button icon={PlusIcon} onClick={handleAddCondition}>
            Add condition ✅
          </Button>
        </ButtonGroup>
      </BlockStack>
    </Card>
  );
}
