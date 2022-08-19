import { gql } from "@apollo/client";

export const BANNERS = gql`
  query Banners {
    banner(order_by: { created_at: desc }) {
      title
      image_url
      id
      external_url
      disabled
      created_at
      updated_at
    }
  }
`;

export const ACTION_BANNER = gql`
  mutation Action_Banner($id: Int!, $action: Boolean!) {
    update_banner_by_pk(pk_columns: { id: $id }, _set: { disabled: $action }) {
      id
      title
      disabled
    }
  }
`;

export const CREATE_BANNER = gql`
  mutation Create_Banner(
    $external_url: String
    $image_url: String!
    $title: String
  ) {
    insert_banner_one(
      object: {
        external_url: $external_url
        image_url: $image_url
        title: $title
      }
    ) {
      created_at
      disabled
      external_url
      id
      image_url
      title
      updated_at
    }
  }
`;

export const UPDATE_BANNER = gql`
  mutation Update_Banner(
    $id: Int!
    $external_url: String
    $image_url: String!
    $title: String
  ) {
    update_banner_by_pk(
      pk_columns: { id: $id }
      _set: {
        external_url: $external_url
        image_url: $image_url
        title: $title
      }
    ) {
      id
    }
  }
`;
