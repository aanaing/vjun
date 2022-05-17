import { gql } from '@apollo/client'

export const REVIEWS_BY_PRODUCT_ID = gql`
query Product_Reviews ($id: uuid!, $limit: Int!, $offset: Int!) {
    product_reviews(where: {fk_product_id: {_eq: $id}}, limit: $limit, offset: $offset) {
      fk_product_id
      id
      review_body_text
      review_images
      star_rating
      updated_at
      user {
        name
      }
    }
    product_reviews_aggregate(where: {fk_product_id: {_eq: $id}}, limit: $limit, offset: $offset) {
        aggregate {
          count(columns: created_at)
        }
      }
  }
`

export const DELETE_BY_ID = gql`
mutation Delete_Product_Reviews_By_Id ($id: uuid!) {
  delete_product_reviews_by_pk(id: $id) {
    fk_product_id
    id
    review_body_text
    review_images
    star_rating
    updated_at
    user {
      name
    }
  }
}
`