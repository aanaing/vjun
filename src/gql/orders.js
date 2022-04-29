import { gql } from '@apollo/client'

export const ORDERS = gql`
query Orders ($limit: Int!, $offset: Int!) {
    user_order(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
        created_at
        fk_user_id
        id
        order_status
        payment_screenshot_image_url
        total_price
        total_quantity
        updated_at
    }
    user_order_aggregate {
      aggregate {
        count
      }
    }
}
`

export const ORDERS_BY_ID  = gql`
query Order_By_Pk ($id: uuid!) {
    user_order_by_pk(id: $id) {
        created_at
        fk_user_id
        id
        order_status
        payment_screenshot_image_url
        total_price
        total_quantity
        updated_at
    }
  }
`

export const ORDER_ITEMS_BY_ID = gql`
query Order_Items($id: uuid!) {
    order_item(where: {fk_order_id: {_eq: $id}}) {
        fk_product_variation_id
        fk_order_id
        id
        quantity
        order_price_for_one_item
        created_at
        updated_at
    }
}  
`


  