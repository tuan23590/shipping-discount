import { BlockStack, Box, Layout, Page } from "@shopify/polaris";
import React, { useState } from "react";

import { authenticate } from "../shopify.server";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";
import AmountOffShipping from "../component/AmountOffShipping";
import ShippingMethods from "../component/ShippingMethods";
import BasedOn from "../component/BasedOn";
import DiscountValue from "../component/DiscountValue";
import MaximumDiscount from "../component/MaximumDiscount";
import Combinations from "../component/Combinations";
import ActiveDates from "../component/ActiveDates";
import Summary from "../component/Summary";
import { produce } from "immer";

export const loader = async ({ params }) => {
  const { functionId, id } = params;
  return { functionId, id };
};

export const action = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const { formData } = {
    ...Object.fromEntries(await request.formData()),
  };

  const data = JSON.parse(formData);

  const response = await admin.graphql(
    `mutation CreateDiscountCodeApp($DiscountCodeAppInput: DiscountCodeAppInput!) {
      discountCodeAppCreate(codeAppDiscount: $DiscountCodeAppInput) {
        codeAppDiscount {
          discountId
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        DiscountCodeAppInput: {
          ...data,
        },
      },
    },
  );

  const responseJson = await response.json();

  if (responseJson.errors) {
    alert("Error creating discount code");
  }

  return redirect(`/app`);
};

export default function ShippingPage() {
  const { functionId, id } = useLoaderData();

  const [discountValue, setDiscountValue] = useState({
    functionId,
    code: "",
    title: "",
    startsAt: new Date().toISOString(),
    metafields: [
      {
        namespace: "default",
        key: "function-configuration",
        type: "json",
        value: {
          operator: "AND",
          value: [{ type: "always", data: {} }],
        },
      },
    ],
    appliesOncePerCustomer: true,
    // usageLimit:2,
    combinesWith: {
      productDiscounts: false,
      orderDiscounts: false,
    },
  });

  const fetcher = useFetcher();

  const handleCreateDiscount = () =>
    fetcher.submit(
      {
        formData: JSON.stringify(
          produce(discountValue, (draft) => {
            draft.metafields[0].value = JSON.stringify(
              discountValue.metafields[0].value,
            );
          }),
        ),
      },
      { method: "POST" },
    );

  return (
    <Page
      title="Create shipping discount"
      backAction={{ url: "/app" }}
      compactTitle
      primaryAction={{
        content: "Create discount",
        onAction: handleCreateDiscount,
      }}
      secondaryActions={[
        {
          content: "Request new rules",
          onAction: () => alert("Duplicate action"),
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="300">
            <AmountOffShipping
              setDiscountValue={setDiscountValue}
              discountValue={discountValue}
            />
            <ShippingMethods />
            <BasedOn
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
            />
            <DiscountValue
              setDiscountValue={setDiscountValue}
              discountValue={discountValue}
            />
            <MaximumDiscount
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
            />
            <Combinations
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
            />
            <ActiveDates
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
            />
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Summary />
        </Layout.Section>
      </Layout>
      <Box padding="300" />
    </Page>
  );
}
