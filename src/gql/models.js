import { gql } from "@apollo/client";

export const MODELS = gql`
  query Models($limit: Int!, $offset: Int!) {
    customization_model(limit: $limit, offset: $offset) {
      created_at
      customization_brand {
        brand_name
        id
      }
      id
      model_device_height
      model_device_image_url
      model_device_width
      model_image_url
      model_name
      updated_at
    }
    customization_model_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const DELETE_MODEL = gql`
  mutation Delete_Model(
    $id: uuid!
    $image_name1: String!
    $image_name2: String!
  ) {
    delete_customization_model_by_pk(id: $id) {
      id
    }
    first: deleteImage(imageName: $image_name1) {
      error
      message
    }
    second: deleteImage(imageName: $image_name2) {
      error
      message
    }
  }
`;

export const CREATE_MODEL = gql`
  mutation Create_model(
    $brand: uuid!
    $height: String!
    $width: String!
    $device_url: String!
    $url: String!
    $name: String!
  ) {
    insert_customization_model_one(
      object: {
        fk_customization_brand: $brand
        model_device_height: $height
        model_device_image_url: $device_url
        model_device_width: $width
        model_image_url: $url
        model_name: $name
      }
    ) {
      created_at
    }
  }
`;

export const UPDATED_MODEL = gql`
  mutation MyMutation(
    $id: uuid!
    $brand: uuid!
    $height: String!
    $width: String!
    $device_url: String!
    $url: String!
    $name: String!
  ) {
    update_customization_model_by_pk(
      pk_columns: { id: $id }
      _set: {
        fk_customization_brand: $brand
        model_device_height: $height
        model_device_image_url: $device_url
        model_device_width: $width
        model_image_url: $url
        model_name: $name
      }
    ) {
      id
    }
  }
`;
