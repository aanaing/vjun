import { gql } from '@apollo/client'

export const BANKING_ACCOUNTS = gql`
query Banking_Accounts {
    banking_accounts {
      account_number
      created_at
      payment_service_name
      receiver_name
      id
    }
  }
`

export const CREATE_BANKING_ACCOUNT = gql`
mutation Create_Banking_Account ($account_number: String, $service_name: String, $receiver_name: String) {
    insert_banking_accounts_one(object: {account_number: $account_number, payment_service_name: $service_name, receiver_name: $receiver_name}) {
        account_number
        created_at
        payment_service_name
        receiver_name
        id
    }
  }
`

export const UPDATE_BANKING_ACCOUNT = gql`
mutation Update_Banking_Account ($id: uuid!, $account_number: String, $service_name: String, $receiver_name: String) {
    update_banking_accounts_by_pk(pk_columns: {id: $id}, _set: {account_number: $account_number, payment_service_name: $service_name, receiver_name: $receiver_name}) {
        account_number
        created_at
        payment_service_name
        receiver_name
        id
    }
  }
`

export const DELETE_BANKING_ACCOUNT = gql`
mutation Delete_Banking_Account ($id: uuid!) {
    delete_banking_accounts_by_pk(id: $id) {
      id
    }
  }  
`