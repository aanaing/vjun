import { gql } from "@apollo/client";

export const SHOPS = gql`
  query ShopData($limit: Int!, $offset: Int!, $sorting_created_at: order_by) {
    shop_data(
      limit: $limit
      offset: $offset
      order_by: { created_at: $sorting_created_at }
    ) {
      address
      id
      map_link
      shop_name
      shop_photo
      created_at
      note
      phone
    }
    shop_data_aggregate(
      limit: $limit
      offset: $offset
      order_by: { created_at: $sorting_created_at }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const CREATE_SHOP = gql`
  mutation Create_Shop(
    $address: String!
    $link: String!
    $name: String!
    $photo: String!
    $note: String
    $phone: String!
  ) {
    insert_shop_data_one(
      object: {
        address: $address
        map_link: $link
        shop_name: $name
        shop_photo: $photo
        note: $note
        phone: $phone
      }
    ) {
      address
      id
      created_at
      map_link
      shop_name
      shop_photo
      note
      phone
    }
  }
`;

export const REMOVE_SHOP = gql`
  mutation Delete_Shop($id: uuid!, $image_name: String!) {
    delete_shop_data_by_pk(id: $id) {
      address
      id
      created_at
      map_link
      shop_name
      shop_photo
      note
      phone
    }
    deleteImage(imageName: $image_name) {
      error
      message
    }
  }
`;
