query {
  shopifyFunctions(first:10) {
    edges {
      node {
        id
        title
      }
    }
  }
}

query GetCartMetafields {
	discountNode(id: "gid://shopify/DiscountCodeNode/1495560225072") {
  	metafields(first: 10)
    {
      edges {
        node {
          value
        }
      }
    }
  }
}

mutation {
  discountCodeAppCreate(
    codeAppDiscount: {
      functionId: "80331221-f8cf-4f36-aa21-cea7be053cb9", 
      code: "CCCCCCCCCC2", 
      title: "đcm vcc", 
      startsAt: "2024-01-01",
      metafields: {
        namespace: "default",
        key: "function-configuration",
        type: "json",
        value: "{\"discounts\":[{\"value\":{\"percentage\":{\"value\":10}},\"targets\":\n                      [{\"orderSubtotal\":{\"excludedVariantIds\":[]}}]}],\"discountApplicationStrategy\":\"FIRST\"}"
      }
    }
  ) {
    codeAppDiscount {
      discountId
    }
    userErrors {
      message
    }
  }
}