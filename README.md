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