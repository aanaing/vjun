import { gql } from '@apollo/client'

export const PRODUCTS = gql`
    query Products ($limit: Int!, $offset: Int!, $search: String) {
        products(limit: $limit, offset: $offset, order_by: {created_at: desc}, where: {name: {_ilike: $search}}) {
            created_at
            description
            id
            name
            price
            product_image_url
            updated_at
            category {
                id
                product_category_name
            }
        }
        products_aggregate {
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
      created_at
      description
      id
      name
      price
      product_image_url
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
      updated_at
    }
  }
`

export const PRODUCT_VARIATIONS = gql`
    query Produc_variations($product_id: uuid!) {
        product_variations(where: {fk_product_id: {_eq: $product_id}}) {
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

export const PRODUCT_VARIATIONS_BY_PK = gql`
    query Product_variations_by_pk($id: ID!) {
        product_variations_by_pk(id: $id) {
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

export const CREATE_PRODUCT = gql`
    mutation Insert_Products_One($name: String!, $price: numeric!, $product_image_url: String!, $description: String!, $category: uuid!) {
        insert_products_one(object: {description: $description, name: $name, price: $price, product_image_url: $product_image_url, fk_product_category_id: $category }) {
            created_at
            description
            id
            name
            price
            product_image_url
            updated_at
        }
    }
`

export const CREATE_PRODUCT_VARIATION = gql`
mutation Insert_Product_Variations_One($name: String!, $image_url: String!, $price: numeric!, $product_id: uuid!) {
    insert_product_variations_one(object: {fk_product_id: $product_id, price: $price, variation_image_url: $image_url, variation_name: $name}) {
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

export const CATEGORIES = gql`
query Categories {
    product_categories {
        id
        product_category_name
    }
}
`