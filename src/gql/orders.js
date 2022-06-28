import { gql } from "@apollo/client";

export const ORDERS = gql`
  query Orders(
    $limit: Int!
    $offset: Int!
    $search: String!
    $status: String!
  ) {
    user_order(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: {
        _and: {
          order_status: { _ilike: $status }
          user: { name: { _ilike: $search } }
        }
      }
    ) {
      created_at
      fk_user_id
      id
      order_readable_id
      order_status
      payment_screenshot_image_url
      total_price
      total_quantity
      updated_at
      user {
        name
        id
      }
    }
    user_order_aggregate(
      where: {
        _and: {
          order_status: { _ilike: $status }
          user: { name: { _ilike: $search } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const ORDERSBYID = gql`
  query Orders($search: Int!, $status: String!) {
    user_order(
      where: {
        _and: {
          order_status: { _ilike: $status }
          order_readable_id: { _eq: $search }
        }
      }
    ) {
      created_at
      fk_user_id
      id
      order_readable_id
      order_status
      payment_screenshot_image_url
      total_price
      total_quantity
      updated_at
      user {
        name
        id
      }
    }
  }
`;

export const ORDERSWITHDATE = gql`
  query Orders(
    $limit: Int!
    $offset: Int!
    $search: String!
    $status: String!
    $start: timestamptz
    $end: timestamptz
  ) {
    user_order(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: {
        _and: {
          order_status: { _ilike: $status }
          _or: {
            user: { name: { _ilike: $search } }
            created_at: { _gte: $start, _lt: $end }
          }
        }
      }
    ) {
      created_at
      fk_user_id
      id
      order_readable_id
      order_status
      payment_screenshot_image_url
      total_price
      total_quantity
      updated_at
      user {
        name
        id
      }
    }
    user_order_aggregate(
      where: {
        _and: {
          order_status: { _ilike: $status }
          _or: {
            user: { name: { _ilike: $search } }
            created_at: { _gte: $start, _lt: $end }
          }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const PENDING_ORDERS = gql`
  query Pending_Orders($status: String) {
    user_order_aggregate(where: { order_status: { _ilike: $status } }) {
      aggregate {
        count
      }
    }
  }
`;

export const ORDERS_BY_ID = gql`
  query Order_By_Pk($id: uuid!) {
    user_order_by_pk(id: $id) {
      created_at
      fk_user_id
      id
      order_readable_id
      order_readable_id
      address
      order_status
      payment_screenshot_image_url
      payment_receiver_account_number
      payment_receiver_name
      payment_service_name
      total_price
      total_quantity
      updated_at
      payment_method
      order_items {
        fk_product_variation_id
        product_variation {
          variation_name
          variation_image_url
          product {
            id
            name
          }
        }
        fk_order_id
        id
        quantity
        order_price_for_one_item
        created_at
        updated_at
      }
      user {
        name
        id
      }
    }
  }
`;

export const ORDER_ITEMS_BY_ID = gql`
  query Order_Items($id: uuid!) {
    order_item(where: { fk_order_id: { _eq: $id } }) {
      fk_product_variation_id
      fk_order_id
      id
      order_readable_id
      quantity
      order_price_for_one_item
      created_at
      updated_at
    }
  }
`;

export const VERIFIE_ORDER = gql`
  mutation Verfiy_Payment($id: String!) {
    verifyPayment(orderId: $id) {
      error
      message
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation Update_User_Order($id: uuid!, $status: String!) {
    update_user_order_by_pk(
      pk_columns: { id: $id }
      _set: { order_status: $status }
    ) {
      id
      order_readable_id
      order_status
    }
  }
`;

export const ALL_ORDER_COUNT = gql`
  query All_Order_Count {
    all: user_order_aggregate {
      aggregate {
        count
      }
    }
    pending: user_order_aggregate(
      where: { order_status: { _ilike: "pending" } }
    ) {
      aggregate {
        count
      }
    }
    verified: user_order_aggregate(
      where: { order_status: { _ilike: "payment_verified" } }
    ) {
      aggregate {
        count
      }
    }
    delivering: user_order_aggregate(
      where: { order_status: { _ilike: "delivering" } }
    ) {
      aggregate {
        count
      }
    }
    completed: user_order_aggregate(
      where: { order_status: { _ilike: "completed" } }
    ) {
      aggregate {
        count
      }
    }
    cancelled: user_order_aggregate(
      where: { order_status: { _ilike: "cancelled" } }
    ) {
      aggregate {
        count
      }
    }
  }
`;
