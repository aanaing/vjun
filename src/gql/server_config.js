import { gql } from '@apollo/client'

export const SERVER_CONFIG = gql`
query Server_Config {
    server_config {
      config_name
      config_value
      updated_at
      id
    }
  }
`

export const UPDATE_SERVER_CONFIG = gql`
mutation Update_SERVER_CONFIG ($id: uuid!, $value: String!) {
    update_server_config_by_pk(pk_columns: {id: $id}, _set: {config_value: $value}) {
        config_name
        config_value
        updated_at
        id
    }
  }
`