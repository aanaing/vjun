import { gql } from '@apollo/client'

export const ADS = gql`
query Ads {
    ads(order_by: {updated_at: desc}) {
        id
        external_url
        created_at
        image_url
        title
        updated_at
    }
}
`

export const CREATE_ADS = gql`
mutation Insert_Ads ($external_url: String, $image_url: String!, $title: String) {
    insert_ads_one(object: {external_url: $external_url, image_url: $image_url, title: $title}) {
      created_at
      external_url
      id
      image_url
      title
      updated_at
    }
  }
`

export const DELETE_ADS = gql`
mutation Delete_Ads ($id: Int!) {
    delete_ads_by_pk(id: $id) {
      id
    }
  }
`

export const UPDATE_ADS = gql`
mutation Update_Ads ($id: Int!, $external_url: String, $image_url: String!, $title: String) {
    update_ads_by_pk(pk_columns: {id: $id}, _set: {image_url: $image_url, external_url: $external_url, title: $title}) {
      created_at
      external_url
      id
      image_url
      title
      updated_at
    }
  }
`

export const UPDATE_POSITION = gql`
mutation Update_Ads_Position ($id: Int!, $updateAt: timestamptz) {
  update_ads_by_pk(pk_columns: {id: $id}, _set: {updated_at: $updateAt}) {
    created_at
    external_url
    id
    image_url
    title
    updated_at
  }
}
`