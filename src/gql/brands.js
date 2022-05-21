import { gql } from '@apollo/client'

export const BRANDS = gql`
query Brand_Name {
    brand_name(order_by: {updated_at: desc}) {
      created_at
      id
      name
      updated_at
    }
  }
`

export const CREATE_BRAND = gql`
mutation Insert_Brand_Name ($name: String!) {
    insert_brand_name_one(object: {name: $name}) {
      id
      name
      created_at
      updated_at
    }
  }  
`

export const UPDATE_BRAND = gql`
mutation Update_Brand_Name($id: uuid!, $name: String!) {
    update_brand_name_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
        created_at
        id
        name
        updated_at
      }
  } 
`

export const DELETE_BRAND  = gql`
mutation Delete_Brand_Name ($id: uuid!) {
    delete_brand_name_by_pk(id: $id) {
      id
    }
  }
  
`