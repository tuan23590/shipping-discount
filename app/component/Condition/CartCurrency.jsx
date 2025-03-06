import {
  Autocomplete,
  BlockStack,
  LegacyStack,
  Select,
  Tag,
} from "@shopify/polaris";
import { produce } from "immer";
import React, { useEffect, useState, useMemo } from "react";
import deselectedOptions from "../../data";

export default function CartCurrency({ discountValue, setDiscountValue, index }) {
  function handleOperatorChange(value) {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value[index].data.operator = value;
      }),
    );
  }

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Update discountValue when selectedOptions changes
  useEffect(() => {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value[index].data.currencies = selectedOptions;
      }),
    );
  }, [selectedOptions]);

  // Initial setup
  useEffect(() => {
    setDiscountValue(
      produce(discountValue, (draft) => {
        draft.metafields[0].value.value[index].data.operator = "contains";
        draft.metafields[0].value.value[index].data.currencies = selectedOptions;
      }),
    );
  }, []);

  // Calculate filtered options based on input value
  const filteredOptions = useMemo(() => {
    if (!inputValue) return deselectedOptions;

    const filterRegex = new RegExp(inputValue, "i");
    return deselectedOptions.filter((option) =>
      option.label.match(filterRegex),
    );
  }, [inputValue]);

  function handleInputChange(value) {
    setInputValue(value);
  }

  function removeTag(tag) {
    return () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    };
  }

  function titleCase(string) {
    return string.split(" ").join("");
  }

  const verticalContentMarkup =
    selectedOptions.length > 0 ? (
      <LegacyStack spacing="extraTight" alignment="center">
        {selectedOptions.map((option) => {
          let tagLabel = "";
          tagLabel = option.replace("_", " ");
          tagLabel = titleCase(tagLabel);
          return (
            <Tag key={`option${option}`} onRemove={removeTag(option)}>
              {tagLabel}
            </Tag>
          );
        })}
      </LegacyStack>
    ) : null;

  const textField = (
    <Autocomplete.TextField
      onChange={handleInputChange}
      label="Currencies"
      value={inputValue}
      placeholder="Search currencies..."
      verticalContent={verticalContentMarkup}
      autoComplete="off"
    />
  );

  return (
    <BlockStack gap="300">
      <Select
        label="Operator"
        options={[
          { label: "contains", value: "contains" },
          { label: "does not contain", value: "doesNotContain" },
        ]}
        onChange={handleOperatorChange}
        value={discountValue.metafields[0].value.value[index].data.operator}
      />
      <Autocomplete
        allowMultiple
        options={filteredOptions}
        selected={selectedOptions}
        textField={textField}
        onSelect={setSelectedOptions}
        listTitle="Available Currencies"
      />
    </BlockStack>
  );
}
