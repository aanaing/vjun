import { gql } from '@apollo/client'

export const PRODUCTS = gql`
query Products ($limit: Int!, $offset: Int!, $search: String) {
    loyality_products(limit: $limit, offset: $offset, where: {name: {_ilike: $search}}, order_by: {created_at: desc}) {
      claimed_amount
      created_at
      description
      expiry_date
      id
      name
      point_price
      product_category {
        product_category_name
      }
      product_image_url
      updated_at
    }
    loyality_products_aggregate(where: {name: {_ilike: $search}}) {
        aggregate {
          count
        }
    }
  }
`

export const PRODUCT = gql`
query Product($id: uuid!) {
    loyality_products_by_pk (id: $id) {
      brand_name {
        name
      }
      claimed_amount
      created_at
      description
      expiry_date
      id
      point_price
      name
      product_category {
        product_category_name
      }
      product_image_url
      updated_at
      loyalty_products_variations {
        claimed_amount
        color
        created_at
        id
        point_price
        updated_at
        variation_image_url
        variation_name
      }
    }
  }
`