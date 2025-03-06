import {
  Popover,
  ActionList,
  BlockStack,
  InlineGrid,
  Text,
  Button,
  Icon,
} from "@shopify/polaris";
import {
  CartIcon,
  CheckCircleIcon,
  CollectionIcon,
  CurrencyConvertIcon,
  EditIcon,
  MeasurementWeightIcon,
  PlusCircleIcon,
  ProductIcon,
} from "@shopify/polaris-icons";
import { produce } from "immer";
import React, { useState } from "react";

import TotalAmount from "./Condition/TotalAmount";
import SubtotalAmount from "./Condition/SubtotalAmount";
import TotalWeight from "./Condition/TotalWeight";
import TotalQuantity from "./Condition/TotalQuantity";
import CartCurrency from "./Condition/CartCurrency";
import CartAttribute from "./Condition/CartAttribute";

export default function ConditionItem({
  condition,
  index,
  isVisibleConditionAction,
  setDiscountValue,
  discountValue,
}) {
  const [active, setActive] = useState(false);

  function toggleActive() {
    setActive((active) => !active);
  }

  function handleRemoveCondition() {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value.splice(index, 1);
      }),
    );
  }

  function handleChangeCondition(value) {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value[index].type = value;
      }),
    );
    toggleActive();
  }

  const listCondition = [
    {
      title: "General",
      items: [
        {
          content: "Always",
          helpText:
            "Don't check any rules/conditions, discounts are always available at checkout ✅",
          icon: CheckCircleIcon,
          id: "always",
          onAction: () => handleChangeCondition("always"),
        },
      ],
    },
    {
      title: "Cart detail",
      items: [
        {
          content: "Total Amount",
          helpText: "Based on the total value of the cart ✅",
          icon: CartIcon,
          id: "totalAmount",
          onAction: () => handleChangeCondition("totalAmount"),
          component: (
            <TotalAmount
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              index={index}
            />
          ),
        },
        {
          content: "Subtotal amount",
          helpText:
            "Based on the total value of the cart, before taxes and discounts ✅",
          icon: CartIcon,
          id: "subtotalAmount",
          onAction: () => handleChangeCondition("subtotalAmount"),
          component: (
            <SubtotalAmount
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              index={index}
            />
          ),
        },
        {
          content: "Total weight",
          helpText: "Based on the total weight of the cart ✅",
          icon: MeasurementWeightIcon,
          id: "totalWeight",
          onAction: () => handleChangeCondition("totalWeight"),
          component: (
            <TotalWeight
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              index={index}
            />
          ),
        },
        {
          content: "Total quantity",
          helpText: "Based on the total quantiy of the cart ❌",
          icon: PlusCircleIcon,
          id: "totalQuantity",
          onAction: () => handleChangeCondition("totalQuantity"),
          component: (
            <TotalQuantity
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              index={index}
            />
          ),
        },
        {
          content: "Cart currency",
          helpText: "Based on the cart currency ✅",
          icon: CurrencyConvertIcon,
          id: "cartCurrency",
          onAction: () => handleChangeCondition("cartCurrency"),
          component: (
            <CartCurrency
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              index={index}
            />
          ),
        },
        {
          content: "Cart attribute",
          helpText:
            "Based on the cart attribute: cart note, attributes to collect more information... ❌",
          icon: EditIcon,
          id: "cartAttribute",
          onAction: () => handleChangeCondition("cartAttribute"),
          component: (
            <CartAttribute
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              index={index}
            />
          ),
        },
      ],
    },
    {
      title: "Cart has any items",
      items: [
        {
          content: "Collection",
          helpText: "Based on the collectionst ❌",
          icon: CollectionIcon,
          id: "collection",
          onAction: () => handleChangeCondition("collection"),
        },
        {
          content: "Product tags",
          helpText: "Based on the product tags ❌",
          icon: ProductIcon,
          id: "productTags",
          onAction: () => handleChangeCondition("productTags"),
        },
      ],
    },
  ];

  const conditionSelected = listCondition
    .flatMap((section) => section.items || [])
    .find((item) => item.id === condition.type);

  const activator = (
    <BlockStack gap="600">
      <BlockStack gap="200">
        <InlineGrid columns="1fr auto">
          <Text variant="headingSm">{`Condition ${index + 1}:`}</Text>
          {isVisibleConditionAction && (
            <Button
              variant="plain"
              onClick={() => handleRemoveCondition(index)}
            >
              Remove
            </Button>
          )}
        </InlineGrid>
        <Button
          onClick={toggleActive}
          disclosure="select"
          fullWidth
          textAlign="left"
        >
          <InlineGrid columns="1fr auto" gap="300">
            <Icon source={conditionSelected.icon} />
            <BlockStack align="start" gap="100">
              <Text alignment="start" variant="headingMd">
                {conditionSelected.content}
              </Text>
              <Text alignment="start">
                <span>{conditionSelected.helpText}</span>
              </Text>
            </BlockStack>
          </InlineGrid>
        </Button>
      </BlockStack>
      <div>{conditionSelected.component}</div>
    </BlockStack>
  );

  return (
    <Popover
      active={active}
      activator={activator}
      autofocusTarget="first-node"
      onClose={toggleActive}
      fullWidth
    >
      {/* add onAction to listCondition */}
      <ActionList actionRole="menuitem" sections={listCondition} />
    </Popover>
  );
}
