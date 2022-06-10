import { gql } from '@apollo/client'

export const PRODUCTS = gql`
    query Products ($limit: Int!, $offset: Int!, $search: String, $sorting_created_at: order_by, $amount: order_by) {
        products(limit: $limit, offset: $offset, order_by: { created_at: $sorting_created_at, sold_amount: $amount }, where: {_or:[ {name: {_ilike: $search}},{ barcode: {_ilike: $search}}]}) {
            created_at
            description
            id
            name
            price
            sold_amount
            product_image_url
            updated_at
            barcode
            category {
                id
                product_category_name
            }
            brand_name {
                name
            }
        }
        products_aggregate(where: {_or:[ {name: {_ilike: $search}},{ barcode: {_ilike: $search}}]}) {
            aggregate {
              count
            }
        }
    }
`

export const PRODUCT_BY_ID = gql`
query Products_by_pk($id: uuid!) {
    products_by_pk(id: $id) {
      category {
        product_category_name
      }
      fk_product_category_id
      fk_brand_id
      created_at
      description
      id
      name
      price
      product_image_url
      show_reviews
      discount_eligible
      sold_amount
      barcode
      product_variations {
        color
        created_at
        fk_product_id
        id
        price
        updated_at
        variation_image_url
        variation_name
      }
      brand_name {
        name
      }
      updated_at
    }
  }
`

export const PRODUCT_VARIATIONS = gql`
    query Product_variations($product_id: uuid!) {
        product_variations(where: {fk_product_id: {_eq: $product_id}}) {
            color
            created_at
            id
            price
            sold_amount
            variation_image_url
            variation_name
        }
    }
`

export const PRODUCT_VARIATIONS_BY_PK = gql`
    query Product_variations_by_pk($id: ID!) {
        product_variations_by_pk(id: $id) {
            color
            created_at
            id
            price
            sold_amount
            variation_image_url
            variation_name
        }
    }
`

export const CREATE_PRODUCT = gql`
    mutation Insert_Products_One($name: String!, $price: numeric!, $product_image_url: String!, $barcode: String!, $description: String!, $category: uuid!, $brand: uuid!) {
        insert_products_one(object: {description: $description, name: $name, price: $price, barcode: $barcode, product_image_url: $product_image_url, fk_product_category_id: $category, fk_brand_id: $brand }) {
            created_at
            description
            id
            name
            price
            product_image_url
            updated_at
            barcode
            brand_name {
                name
            }
        }
    }
`

export const CREATE_PRODUCT_VARIATION = gql`
mutation Insert_Product_Variations_One($name: String!, $image_url: String!, $price: numeric!, $product_id: uuid!, $color: String) {
    insert_product_variations_one(object: {fk_product_id: $product_id, price: $price, variation_image_url: $image_url, variation_name: $name, color: $color}) {
        color
        created_at
        id
        price
        sold_amount
        variation_image_url
        variation_name
    }
}
`

export const DELETE_PRODUCT_VARIATION = gql`
mutation Delete_Product_Variations_By_Pk($id: uuid!, $image_name: String!) {
    delete_product_variations_by_pk(id: $id) {
      id
    }
    deleteImage(imageName: $image_name) {
        error
        message
    }
}
`

export const DELETE_PRODUCT = gql`
mutation Delete_Products_by_pk($id: uuid!, $image_name: String!) {
    delete_products_by_pk(id: $id) {
      id
    }
    deleteImage(imageName: $image_name) {
        error
        message
    }
}
`

export const UPDATE_PRODUCT = gql`
mutation Update_Product_By_Id ($id: uuid!, $description: String, $discount: Boolean, $brand: uuid, $category: uuid, $name: String, $price: numeric, $product_image_url: String, $barcode: String!, $review: Boolean) {
    update_products_by_pk(pk_columns: {id: $id}, _set: {description: $description, discount_eligible: $discount, fk_brand_id: $brand, fk_product_category_id: $category, name: $name, barcode: $barcode price: $price, product_image_url: $product_image_url, show_reviews: $review }) {
        created_at
        description
        id
        name
        price
        product_image_url
        updated_at
        barcode
        brand_name {
            name
        }
    }
  }  
`

export const UPDATE_PRODUCT_VARIATION = gql`
mutation Update_Product_Variation_By_Id($id: uuid!, $color: String, $price: numeric, $image_url: String, $name: String) {
    update_product_variations_by_pk(pk_columns: {id: $id}, _set: {color: $color, price: $price, variation_image_url: $image_url, variation_name: $name}) {
        created_at
        fk_product_id
        id
        price
        updated_at
        variation_image_url
        variation_name
    }
  }  
`