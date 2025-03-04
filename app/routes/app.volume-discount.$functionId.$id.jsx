import { BlockStack, Box, Layout, Page } from "@shopify/polaris";
import React, { useState } from "react";

import { authenticate } from "../shopify.server";
import { redirect, useFetcher } from "@remix-run/react";
import AmountOffShipping from "../component/AmountOffShipping";
import ShippingMethods from "../component/ShippingMethods";
import BasedOn from "../component/BasedOn";
import DiscountValue from "../component/DiscountValue";
import MaximumDiscount from "../component/MaximumDiscount";
import Combinations from "../component/Combinations";
import ActiveDates from "../component/ActiveDates";
import Summary from "../component/Summary";

export const loader = async ({ params }) => {
  const { functionId, id } = params;
  // Fetch existing discount data if `id` is not "new"
  return { title: "Sample Discount", value: "10%" }; // Replace with actual API call
};

export const action = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const { formData } = {
    ...Object.fromEntries(await request.formData()),
  };

  const data = JSON.parse(formData);

  console.log('data', data)

  const response = await admin.graphql(
    `mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 10) {
              nodes {
                code
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`,
    {
      variables: {
        basicCodeDiscount: {
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
  const [basicCodeDiscount, setBasicCodeDiscount] = useState({
    title: "20% off all items during summer",
    code: "",
    startsAt: new Date().toISOString(),
    // endsAt
    customerSelection: { all: true },
    customerGets: {
      value: { percentage: 0.2 },
      items: { all: true },
    },
    minimumRequirement: {},
    appliesOncePerCustomer: true,
    // usageLimit
    combinesWith: {
      productDiscounts: false,
      orderDiscounts: false,
    },
  });

  const fetcher = useFetcher();

  const handleCreateDiscount = () =>
    fetcher.submit(
      { formData: JSON.stringify(basicCodeDiscount) },
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
              setBasicCodeDiscount={setBasicCodeDiscount}
              basicCodeDiscount={basicCodeDiscount}
            />
            <ShippingMethods />
            <BasedOn />
            <DiscountValue
              setBasicCodeDiscount={setBasicCodeDiscount}
              basicCodeDiscount={basicCodeDiscount}
            />
            <MaximumDiscount
              basicCodeDiscount={basicCodeDiscount}
              setBasicCodeDiscount={setBasicCodeDiscount}
            />
            <Combinations
              basicCodeDiscount={basicCodeDiscount}
              setBasicCodeDiscount={setBasicCodeDiscount}
            />
            <ActiveDates
              basicCodeDiscount={basicCodeDiscount}
              setBasicCodeDiscount={setBasicCodeDiscount}
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
