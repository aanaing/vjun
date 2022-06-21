import { gql } from "@apollo/client";

export const BLOGS = gql`
  query Blogs($limit: Int!, $offset: Int!) {
    blog_data(offset: $offset, limit: $limit, order_by: { updated_at: desc }) {
      created_at
      id
      title
      title_image_url
      updated_at
    }
    blog_data_aggregate(offset: $offset, limit: $limit) {
      aggregate {
        count
      }
    }
  }
`;

export const CREATE_BLOG = gql`
  mutation Insert_Blog(
    $title: String!
    $paragraph: String!
    $image_url: String!
  ) {
    insert_blog_data_one(
      object: { body: $paragraph, title: $title, title_image_url: $image_url }
    ) {
      id
      title
      created_at
      title_image_url
      updated_at
    }
  }
`;

export const BLOG = gql`
  query Blog($id: uuid!) {
    blog_data_by_pk(id: $id) {
      body
      created_at
      id
      title
      title_image_url
      updated_at
    }
  }
`;

export const UPDATE_BLOG = gql`
  mutation Update_Blog_By_Id(
    $id: uuid!
    $title: String!
    $paragraph: String!
    $image_url: String!
  ) {
    update_blog_data_by_pk(
      pk_columns: { id: $id }
      _set: { body: $paragraph, title: $title, title_image_url: $image_url }
    ) {
      body
      created_at
      id
      title
      title_image_url
      updated_at
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation Delete_Blog_by_pk($id: uuid!, $image_name: String!) {
    delete_blog_data_by_pk(id: $id) {
      id
    }
    deleteImage(imageName: $image_name) {
      error
      message
    }
  }
`;

export const UPDATE_POSITION = gql`
  mutation Update_Blog_By_Id($id: uuid!, $updateAt: timestamptz!) {
    update_blog_data_by_pk(
      pk_columns: { id: $id }
      _set: { updated_at: $updateAt }
    ) {
      body
      created_at
      id
      title
      title_image_url
      updated_at
    }
  }
`;
