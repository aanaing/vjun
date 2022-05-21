import { gql } from '@apollo/client'

export const CATEGORIES = gql`
query Product_Categories {
    product_categories (order_by: {updated_at: desc}) {
      created_at
      device_type
      id
      product_category_image_url
      product_category_name
      updated_at
    }
  }
`

export const CREATE_CATEGORY = gql`
mutation Create_Category ($device_type: String, $image_url: String, $name: String) {
    insert_product_categories_one(object: {device_type: $device_type, product_category_image_url: $image_url, product_category_name: $name}) {
      product_category_name
      id
      created_at
      device_type
      product_category_image_url
      updated_at
    }
  }
  
`

export const UPDATE_CATEGORY = gql`
mutation Update_Category ($id: uuid!, $device_type: String, $image_url: String, $name: String) {
    update_product_categories_by_pk(pk_columns: {id: $id}, _set: {device_type: $device_type, product_category_image_url: $image_url, product_category_name: $name}) {
      device_type
      id
      product_category_image_url
      product_category_name
      updated_at
    }
  }
`

export const DELETE_CATEGORY = gql`
mutation Delete_Category ($id: uuid!, $image_name: String!) {
  delete_product_categories_by_pk(id: $id) {
    product_category_name
  }
  deleteImage(imageName: $image_name) {
    error
    message
  }
}
`

export const UPDATE_POSITION = gql`
mutation Update_Category ($id: uuid!, $updater: Boolean!) {
  update_product_categories_by_pk(pk_columns: {id: $id}, _set: {updated_at_updater: $updater}) {
    device_type
    id
    product_category_image_url
    product_category_name
    updated_at
  }
}
`