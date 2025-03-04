import {
  ActionList,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Icon,
  InlineGrid,
  Popover,
  Text,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import {
  CartIcon,
  CheckCircleIcon,
  CollectionIcon,
  PlusIcon,
  ProductIcon,
} from "@shopify/polaris-icons";
import { produce } from "immer";
import TotalAmount from "./Condition/TotalAmount";
export default function BasedOn() {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const [selectedsCondition, setSelectedsCondition] = useState(["always"]);

  function handleSelectCondition(value) {
    setSelectedsCondition(
      produce(selectedsCondition, (draft) => {
        draft[0] = value;
      }),
    );
    setActive(false);
  }

  const listCondition = [
    {
      title: "General",
      items: [
        {
          content: "Always",
          helpText:
            "Don't check any rules/conditions, discounts are always available at checkout",
          icon: CheckCircleIcon,
          id: "always",
          onAction: () => handleSelectCondition("always"),
        },
      ],
    },
    {
      title: "Cart detail",
      items: [
        {
          content: "Total Amount",
          helpText: "Based on the total value of the cart",
          icon: CartIcon,
          id: "totalAmount",
          onAction: () => handleSelectCondition("totalAmount"),
          component: <TotalAmount />,
        },
        {
          content: "Subtotal amount",
          helpText:
            "Based on the total value of the cart, before taxes and discounts",
          icon: CartIcon,
          id: "subtotalAmount",
          onAction: () => handleSelectCondition("subtotalAmount"),
        },
      ],
    },
    {
      title: "Cart has any items",
      items: [
        {
          content: "Collection",
          helpText: "Based on the collectionst",
          icon: CollectionIcon,
          id: "collection",
          onAction: () => handleSelectCondition("collection"),
        },
        {
          content: "Product tags",
          helpText: "Based on the product tags",
          icon: ProductIcon,
          id: "productTags",
          onAction: () => handleSelectCondition("productTags"),
        },
      ],
    },
  ];

  const activator = (
    <>
      {selectedsCondition.map((condition) => {
        const item = listCondition
          .map((section) => section.items)
          .flat()
          .find((item) => item.id === condition);
        return (
          <Button
            onClick={toggleActive}
            disclosure="select"
            fullWidth
            textAlign="left"
            key={item.id}
          >
            <InlineGrid columns="1fr auto" gap="300">
              <Icon source={item.icon} />
              <BlockStack align="start" gap="100">
                <Text alignment="start" variant="headingMd">
                  {item.content}
                </Text>
                <Text alignment="start">
                  <span>{item.helpText}</span>
                </Text>
              </BlockStack>
            </InlineGrid>
          </Button>
        );
      })}
    </>
  );

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="600">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            Based on
          </Text>
        </InlineGrid>
        <Popover
          active={active}
          activator={activator}
          autofocusTarget="first-node"
          onClose={toggleActive}
          fullWidth
        >
          <ActionList actionRole="menuitem" sections={listCondition} />
        </Popover>
        {selectedsCondition.map((condition) => {
          const item = listCondition
            .map((section) => section.items)
            .flat()
            .find((item) => item.id === condition);
          return <div key={item.id}>{item.component}</div>;
        })}
        <ButtonGroup>
          <Button icon={PlusIcon}>Add condition</Button>
        </ButtonGroup>
      </BlockStack>
    </Card>
  );
}
