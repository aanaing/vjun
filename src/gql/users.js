import { gql } from '@apollo/client'

export const USERS = gql`
query Users ($limit: Int!, $offset: Int!, $name: String, $phone: String) {
    users(limit: $limit, offset: $offset, order_by: {created_at: desc}, where: {_and: {name: {_ilike: $name}, phone: {_ilike: $phone}}}) {
      address
      created_at
      disabled
      id
      image_url
      loyalty_points
      member_start_date
      member_tier
      name
      phone
      updated_at
    }
    users_aggregate(where: {_and: {name: {_ilike: $name}, phone: {_ilike: $phone}}}) {
        aggregate {
          count
        }
    }
  }
`

export const USER = gql`
query User_By_Pk($id: uuid!) {
  users_by_pk(id: $id) {
    address
    created_at
    disabled
    id
    image_url
    loyalty_points
    member_id
    member_start_date
    member_tier
    name
    phone
    updated_at
  }
}
`

export const UPDATE_USER = gql`
mutation Update_Users_By_Pk ($id: uuid!, $disabled: Boolean!) {
  update_users_by_pk(pk_columns: {id: $id}, _set: {disabled: $disabled}) {
    address
    created_at
    disabled
    id
    image_url
    loyalty_points
    member_id
    member_start_date
    member_tier
    name
    phone
    updated_at
  }
}
`

export const UPDATE_MEMBER_TIRE = gql`
mutation Update_Member_Tire ($id: uuid!, $tier: String!) {
  update_users_by_pk(pk_columns: {id: $id}, _set: {member_tier: $tier}) {
    address
    created_at
    disabled
    id
    image_url
    loyalty_points
    member_id
    member_start_date
    member_tier
    name
    phone
    updated_at
  }
}
`

export const UPDATE_POINT = gql`
mutation Update_User_Point ($id: uuid!, $point: numeric!) {
  update_users_by_pk(pk_columns: {id: $id}, _set: {loyalty_points: $point}) {
    address
    created_at
    disabled
    id
    image_url
    loyalty_points
    member_id
    member_start_date
    member_tier
    name
    phone
    updated_at
  }
}
`