import { gql } from '@apollo/client'

export const PRODUCTS = gql`
query Products ($limit: Int!, $offset: Int!, $search: String) {
    loyalty_products(limit: $limit, offset: $offset, where: {name: {_ilike: $search}}, order_by: {created_at: desc}) {
      amount_left
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
    loyalty_products_aggregate(where: {name: {_ilike: $search}}) {
        aggregate {
          count
        }
    }
  }
`

export const PRODUCT = gql`
query Product($id: uuid!) {
    loyalty_products_by_pk (id: $id) {
      brand_name {
        name
      }
      amount_left
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
      fk_product_category_id
      fk_brand_id
    }
  }
`

export const CREATE = gql`
mutation Insert_Loyalty_Product ($description: String, $date: date, $brand_id: uuid, $category_id: uuid, $name: String, $price: Int, $image_url: String) {
  insert_loyalty_products_one(object: { description: $description, expiry_date: $date, fk_brand_id: $brand_id, fk_product_category_id: $category_id, name: $name, point_price: $price, product_image_url: $image_url}) {
    amount_left
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
    fk_product_category_id
    fk_brand_id
  }
}
`

export const CREATE_VARIATION = gql`
mutation Insert_Loyalty_Product_Variation ($color: String!, $product_id: uuid!, $price: Int, $image_url: String!, $name: String!) {
  insert_loyalty_products_variations_one(object: {color: $color, fk_product_id: $product_id, point_price: $price, variation_image_url: $image_url, variation_name: $name}) {
    amount_left
    color
    created_at
    id
    point_price
    updated_at
    variation_image_url
    variation_name
    fk_product_category_id
    fk_brand_id
  }
}
`

export const UPDATE = gql`
mutation Update_Loyalty_Products_By_Pk($id: uuid!, $amount_left: Int!, $description: String, $date: date, $brand_id: uuid, $category_id: uuid, $name: String, $price: Int, $image_url: String, $image_name: String! ) {
  update_loyalty_products_by_pk(pk_columns: {id: $id}, _set: {amount_left: $amount_left, description: $description, expiry_date: $date, fk_brand_id: $brand_id, fk_product_category_id: $category_id, name: $name, point_price: $price, product_image_url: $image_url}) {
    brand_name {
      name
    }
    amount_left
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
    fk_product_category_id
    fk_brand_id
  }
  deleteImage(imageName: $image_name) {
    error
    message
  }
}
`

