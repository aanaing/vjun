import { gql } from "@apollo/client";

export const CUSTOMIZE_ORDRES = gql`
  query Customization_Orders($limit: Int!, $offset: Int!) {
    customization_order(limit: $limit, offset: $offset) {
      brand_name
      created_at
      id
      user {
        id
        name
      }
      model_name
      order_readable_id
      order_status
      total_price
      total_quantity
    }
    customization_order_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const CUSTOMIZE_ORDER = gql`
  query Customization_Order_By_Pk($id: uuid!) {
    customization_order_by_pk(id: $id) {
      address
      brand_name
      customization_image_url
      created_at
      fk_user_id
      id
      model_name
      notes
      order_readable_id
      order_status
      payment_method
      payment_receiver_account_number
      payment_receiver_name
      payment_screenshot_image_url
      payment_service_name
      total_price
      total_quantity
      user {
        id
        name
      }
    }
  }
`;

export const UPDATE_CUSTOMIZE_ORDER = gql`
  mutation Update_Customization_Order_By_Pk($id: uuid!, $status: String!) {
    update_customization_order_by_pk(
      pk_columns: { id: $id }
      _set: { order_status: $status }
    ) {
      id
      order_status
      order_readable_id
    }
  }
`;
